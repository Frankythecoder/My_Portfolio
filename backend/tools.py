"""
Agentic Tools for the AI Assistant
These tools enable the AI to perform actions beyond just responding.

Every tool in TOOL_DEFINITIONS is dispatched through AgenticTools.execute_tool,
which always returns a string so the result can be fed straight back to the
model as a tool message. Memory is scoped per chat session so one visitor can
never read what another visitor stored.
"""
import json
import re
import threading
from collections import OrderedDict
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

import requests

INFO_PATH = Path(__file__).with_name("info.txt")

MAX_SESSIONS = 500
MAX_KEYS_PER_SESSION = 20
MAX_VALUE_CHARS = 500
MAX_RESULT_CHARS = 4000


def load_personal_info() -> str:
    """Load personal information from info.txt next to this file"""
    try:
        return INFO_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        return "Personal information file not found."


def _split_top_level(text: str) -> List[str]:
    """Split on commas that are not inside parentheses, e.g. 'AWS (S3, Textract), Docker'"""
    parts, depth, current = [], 0, ""
    for char in text:
        if char == "(":
            depth += 1
        elif char == ")":
            depth = max(depth - 1, 0)
        if char == "," and depth == 0:
            parts.append(current)
            current = ""
        else:
            current += char
    parts.append(current)
    return [part.strip() for part in parts if part.strip()]


def extract_skills(info_text: str) -> List[str]:
    """Collect Frank's skills from the Technical Skills section and every 'Tech:' line"""
    skills: List[str] = []
    seen = set()
    in_skills_section = False
    for line in info_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("## "):
            in_skills_section = stripped == "## Technical Skills"
            continue
        is_skill_line = in_skills_section and stripped.startswith("- ") and ":" in stripped
        if not (is_skill_line or stripped.startswith("- Tech:")):
            continue
        for item in _split_top_level(stripped.split(":", 1)[1]):
            name = item.split("(")[0].strip()
            if name and name.lower() not in seen:
                seen.add(name.lower())
                skills.append(name)
    return skills


def _skill_in_text(skill: str, text_lower: str) -> bool:
    """Whole-word match so 'SQL' doesn't match 'PostgreSQL' and 'Git' doesn't match 'GitHub'"""
    aliases = {skill.lower(), re.sub(r"\s+(api|protocol)$", "", skill.lower())}
    return any(
        re.search(rf"(?<![\w+#]){re.escape(alias)}(?![\w+#])", text_lower)
        for alias in aliases
    )


class AgenticTools:
    def __init__(self, client: Any = None, search_model: str = "gpt-4o-mini"):
        self.client = client
        self.search_model = search_model
        self._memory: "OrderedDict[str, OrderedDict[str, str]]" = OrderedDict()
        self._lock = threading.Lock()
        self._handlers: Dict[str, Callable[[Dict[str, Any], Optional[str]], str]] = {
            "search_web": lambda args, _: self.search_web(args.get("query", "")),
            "analyze_skills": lambda args, _: self.analyze_skills(args.get("job_description", "")),
            "remember_conversation": lambda args, session_id: self.remember_conversation(
                session_id, args.get("key", ""), args.get("value", "")
            ),
            "recall_memory": lambda args, session_id: self.recall_memory(session_id, args.get("key")),
            "search_jobs": lambda args, _: self.search_jobs(args.get("query", "")),
        }

    def execute_tool(self, name: str, raw_arguments: Optional[str], session_id: Optional[str]) -> str:
        """Run a tool requested by the model. Errors are returned as text so the model can recover."""
        handler = self._handlers.get(name)
        if handler is None:
            return f"Error: unknown tool '{name}'."
        try:
            arguments = json.loads(raw_arguments or "{}")
        except json.JSONDecodeError:
            return f"Error: arguments for {name} were not valid JSON."
        if not isinstance(arguments, dict):
            return f"Error: arguments for {name} must be a JSON object."
        try:
            result = handler(arguments, session_id)
        except Exception as e:
            return f"Error executing {name}: {e}"
        return str(result)[:MAX_RESULT_CHARS]

    def search_web(self, query: str) -> str:
        """Search the web for current information"""
        query = (query or "").strip()
        if not query:
            return "Error: the search query was empty."

        if self.client is not None:
            try:
                response = self.client.responses.create(
                    model=self.search_model,
                    tools=[{"type": "web_search"}],
                    input=(
                        f"Search the web for: {query}\n"
                        "Summarise the most relevant, current findings as a short list. "
                        "Use plain text only (no markdown, bold or link syntax) and write each source URL in full."
                    ),
                    max_output_tokens=600,
                )
                if response.output_text:
                    text = re.sub(r"[?&]utm_source=openai", "", response.output_text)
                    return f"Web search results for '{query}':\n{text}"
            except Exception as e:
                print(f"OpenAI web search failed, falling back to DuckDuckGo: {e}")

        return self._duckduckgo_instant_answer(query)

    def _duckduckgo_instant_answer(self, query: str) -> str:
        """Fallback: DuckDuckGo instant answers (no API key, but only covers well-known topics)"""
        try:
            response = requests.get(
                "https://api.duckduckgo.com/",
                params={'q': query, 'format': 'json', 'no_html': '1', 'skip_disambig': '1'},
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            return f"Web search failed: {e}. Answer from existing knowledge and say the search was unavailable."

        if data.get('Abstract'):
            return f"Web search result: {data['Abstract']} ({data.get('AbstractURL', '')})"
        if data.get('Answer'):
            return f"Answer: {data['Answer']}"
        if data.get('Definition'):
            return f"Definition: {data['Definition']}"

        # RelatedTopics mixes plain topics with groups that nest their topics under 'Topics'
        results = []
        for topic in data.get('RelatedTopics', []):
            for entry in topic.get('Topics', [topic]):
                if entry.get('Text'):
                    results.append(f"{entry['Text']} ({entry.get('FirstURL', '')})")
        if results:
            return "Web search results: " + "; ".join(results[:5])

        return f"Web search for '{query}' returned no results. Answer from existing knowledge and say so."

    def analyze_skills(self, job_description: str) -> str:
        """Analyze how Frank's skills match a job description"""
        if not (job_description or "").strip():
            return "Error: no job description was provided."

        frank_skills = extract_skills(load_personal_info())
        if not frank_skills:
            return "Error: Frank's skills could not be loaded from info.txt."

        job_lower = job_description.lower()
        matched = [skill for skill in frank_skills if _skill_in_text(skill, job_lower)]
        others = [skill for skill in frank_skills if skill not in matched]

        summary = (
            f"Matched skills ({len(matched)}): {', '.join(matched)}."
            if matched
            else "No direct keyword matches with Frank's listed skills."
        )
        return (
            f"{summary}\n"
            f"Frank's other skills: {', '.join(others)}.\n"
            "Use Frank's information to judge transferable experience and any gaps in the job requirements."
        )

    def remember_conversation(self, session_id: Optional[str], key: str, value: Any) -> str:
        """Store information in this session's memory"""
        if not session_id:
            return "Memory is unavailable because this chat has no session id."
        key = str(key or "").strip()[:64]
        if not key:
            return "Error: a key is required to remember something."
        value = str(value)[:MAX_VALUE_CHARS]

        with self._lock:
            session = self._memory.setdefault(session_id, OrderedDict())
            self._memory.move_to_end(session_id)
            session[key] = value
            session.move_to_end(key)
            while len(session) > MAX_KEYS_PER_SESSION:
                session.popitem(last=False)
            while len(self._memory) > MAX_SESSIONS:
                self._memory.popitem(last=False)
        return f"Remembered: {key} = {value}"

    def recall_memory(self, session_id: Optional[str], key: Optional[str] = None) -> str:
        """Recall one key, or everything stored for this session when no key matches"""
        memories = self.get_memories(session_id)
        if not memories:
            return "Nothing has been remembered in this conversation yet."
        if key and key in memories:
            return f"Recalled: {key} = {memories[key]}"
        stored = "; ".join(f"{k} = {v}" for k, v in memories.items())
        prefix = f"No memory stored under '{key}'. " if key else ""
        return f"{prefix}Everything remembered in this conversation: {stored}"

    def get_memories(self, session_id: Optional[str]) -> Dict[str, str]:
        if not session_id:
            return {}
        with self._lock:
            return dict(self._memory.get(session_id, {}))

    def search_jobs(self, query: str) -> str:
        """Search for live job openings and add platform guidance"""
        query = (query or "").strip()
        if not query:
            return "Error: the job search query was empty."

        listings = self.search_web(f"{query} job openings, with company, location and application link")
        return f"""{listings}

Other places to search: LinkedIn Jobs, Naukri, Indeed, Wellfound (startups), Glassdoor, and company career pages.
Keyword tips: try variations like "AI Engineer", "ML Engineer", "Python Developer", "Django Developer" and add a location or "Remote"."""


# Tool schemas for OpenAI Chat Completions tool calling
TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "Search the web for current information about any topic, e.g. news, companies, or technologies. Use when the answer is not in Frank's information and may have changed recently.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The search query"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "analyze_skills",
            "description": "Compare a job description or list of required skills against Frank's actual skills and return the matches.",
            "parameters": {
                "type": "object",
                "properties": {
                    "job_description": {"type": "string", "description": "Job description or required skills to analyze"}
                },
                "required": ["job_description"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "remember_conversation",
            "description": "Store a fact the visitor shares (their name, company, role they are hiring for, etc.) so it can be recalled later in this conversation.",
            "parameters": {
                "type": "object",
                "properties": {
                    "key": {"type": "string", "description": "Short snake_case label, e.g. 'visitor_name' or 'hiring_role'"},
                    "value": {"type": "string", "description": "Information to store"}
                },
                "required": ["key", "value"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "recall_memory",
            "description": "Recall facts stored earlier in this conversation. Omit the key to list everything remembered.",
            "parameters": {
                "type": "object",
                "properties": {
                    "key": {"type": "string", "description": "Key to recall; omit to list all stored facts"}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_jobs",
            "description": "Search the web for live job openings and return listings plus where else to look.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Job search query (e.g., 'AI engineer jobs Chennai', 'remote Python developer')"}
                },
                "required": ["query"]
            }
        }
    },
]
