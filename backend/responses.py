import os
import re
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from openai import OpenAI

from tools import AgenticTools, TOOL_DEFINITIONS, load_personal_info

# Load OpenAI settings from environment variables (before anything reads them)
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
client = OpenAI(api_key=api_key) if api_key else None
print(f"OpenAI configured with model {MODEL}" if api_key else "No OpenAI API key; using fallback responses")

tools = AgenticTools(client=client, search_model=MODEL)

MAX_TOOL_ROUNDS = 5
MAX_HISTORY_MESSAGES = 12
MAX_HISTORY_CHARS = 2000


def build_system_prompt(session_id: Optional[str]) -> str:
    memories = tools.get_memories(session_id)
    remembered = "\n".join(f"- {k}: {v}" for k, v in memories.items()) or "- (nothing yet)"
    return f"""You are Frank's AI assistant on his portfolio website, with agentic capabilities. You can:
1. Answer questions about Frank using his information below.
2. Use tools to perform actions like web search, job search and skill analysis.
3. Remember facts the visitor shares during this conversation.

Work step by step: call as many tools as a request needs, in sequence, and use each result
to decide the next step (for example, search_jobs and then analyze_skills on what you found).
Only state facts about Frank that appear in his information; never invent experience.
The chat window shows raw text, so never use markdown (no **, #, or [text](url) links);
use simple numbered lines and write URLs in full. Keep replies concise.

Frank's Information:
{load_personal_info()}

Facts remembered from this visitor:
{remembered}"""


def _to_plain_text(reply: str) -> str:
    """The chat widget renders raw text, so strip the markdown models add despite instructions"""
    reply = re.sub(r"\[([^\]]+)\]\((\S+?)\)", r"\1: \2", reply)
    reply = re.sub(r"(\*\*|__)(.+?)\1", r"\2", reply)
    reply = re.sub(r"^#{1,6}\s+", "", reply, flags=re.MULTILINE)
    return reply.strip()


def _clean_history(history: Optional[List[Dict[str, str]]]) -> List[Dict[str, str]]:
    cleaned = []
    for turn in (history or [])[-MAX_HISTORY_MESSAGES:]:
        role, content = turn.get("role"), (turn.get("content") or "").strip()
        if role in ("user", "assistant") and content:
            cleaned.append({"role": role, "content": content[:MAX_HISTORY_CHARS]})
    return cleaned


def generate_bot_response(
    user_message: str,
    history: Optional[List[Dict[str, str]]] = None,
    session_id: Optional[str] = None,
) -> str:
    """Generate an agentic response: let the model call tools in a loop until it can answer"""
    if client is None:
        return generate_fallback_response(user_message)

    messages: List[Dict[str, Any]] = [
        {"role": "system", "content": build_system_prompt(session_id)},
        *_clean_history(history),
        {"role": "user", "content": user_message},
    ]

    try:
        for round_number in range(MAX_TOOL_ROUNDS + 1):
            # On the last round, withhold tools so the model must produce an answer
            final_round = round_number == MAX_TOOL_ROUNDS
            response = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                tools=TOOL_DEFINITIONS,
                tool_choice="none" if final_round else "auto",
                max_tokens=600,
                temperature=0.4,
            )
            message = response.choices[0].message
            tool_calls = [call for call in (message.tool_calls or []) if getattr(call, "function", None)]

            if not tool_calls:
                return _to_plain_text(message.content or "") or generate_fallback_response(user_message)

            messages.append({
                "role": "assistant",
                "content": message.content,
                "tool_calls": [
                    {
                        "id": call.id,
                        "type": "function",
                        "function": {"name": call.function.name, "arguments": call.function.arguments},
                    }
                    for call in tool_calls
                ],
            })
            for call in tool_calls:
                result = tools.execute_tool(call.function.name, call.function.arguments, session_id)
                messages.append({"role": "tool", "tool_call_id": call.id, "content": result})

        return generate_fallback_response(user_message)

    except Exception as e:
        print(f"OpenAI API error: {e}")
        return generate_fallback_response(user_message)

# Fallback responses for when OpenAI is not available
fallback_responses = {
    "skills": "Frank is proficient in React, TypeScript, Node.js, Python, and many other technologies. He has 5+ years of experience in full-stack development and specializes in creating modern web applications.",
    "experience": "Frank has over 5 years of professional experience as a Full Stack Developer. He has worked on various projects ranging from e-commerce platforms to AI-powered applications.",
    "projects": "Frank has completed 50+ projects including e-commerce platforms, task management apps, and weather dashboards. You can check out his featured projects in the Projects section above!",
    "education": "Frank holds a Master's degree in Computer Science from University of Technology (2019-2021) and a Bachelor's degree from State University (2015-2019).",
    "contact": "You can reach Frank at diviyanfrankjeyasingh@gmail.com or through the contact form above. He's always open to discussing new opportunities!",
    "default": "That's an interesting question! I can help you with information about Frank's skills, experience, projects, education, or contact details. What would you like to know more about?",
}

def generate_fallback_response(user_message: str) -> str:
    """Fallback response when OpenAI is not available"""
    message = (user_message or "").lower()
    if "skill" in message or "tech" in message or "programming" in message:
        return fallback_responses["skills"]
    if "experience" in message or "work" in message or "job" in message:
        return fallback_responses["experience"]
    if "project" in message or "portfolio" in message or "work" in message:
        return fallback_responses["projects"]
    if "education" in message or "degree" in message or "university" in message:
        return fallback_responses["education"]
    if "contact" in message or "email" in message or "reach" in message:
        return fallback_responses["contact"]
    return fallback_responses["default"]
