import json
from types import SimpleNamespace

import responses
from tools import AgenticTools, extract_skills, load_personal_info


def test_skills_are_read_from_info_file():
  skills = extract_skills(load_personal_info())

  for skill in ["Python", "C++", "Django", "LangChain", "PyTorch", "AWS", "FAISS"]:
    assert skill in skills
  assert "S3" not in skills  # nested inside "AWS (S3, Textract)"


def test_analyze_skills_matches_whole_words_only():
  result = AgenticTools().analyze_skills("Django + LangChain engineer with PyTorch, PostgreSQL and GitHub")
  matched_line = result.splitlines()[0]

  for skill in ["Django", "LangChain", "PyTorch", "PostgreSQL"]:
    assert skill in matched_line
  assert "SQL," not in matched_line
  assert "Git," not in matched_line


def test_memory_is_isolated_per_session():
  tools = AgenticTools()
  tools.remember_conversation("visitor-a", "visitor_name", "Priya")

  assert "Priya" in tools.recall_memory("visitor-a", "visitor_name")
  assert "Priya" in tools.recall_memory("visitor-a", "name")  # unknown key lists everything
  assert "Priya" not in tools.recall_memory("visitor-b", "visitor_name")
  assert "unavailable" in tools.remember_conversation(None, "k", "v")


def test_execute_tool_reports_errors_as_text():
  tools = AgenticTools()

  assert "unknown tool" in tools.execute_tool("__init__", "{}", "s")
  assert "not valid JSON" in tools.execute_tool("analyze_skills", "{oops", "s")
  assert "Remembered" in tools.execute_tool("remember_conversation", '{"key": "a", "value": "b"}', "s")


def test_duckduckgo_fallback_reads_nested_topics(monkeypatch):
  payload = {"RelatedTopics": [{"Name": "Group", "Topics": [{"Text": "LangGraph docs", "FirstURL": "https://x"}]}]}
  response = SimpleNamespace(raise_for_status=lambda: None, json=lambda: payload)
  monkeypatch.setattr("tools.requests.get", lambda *args, **kwargs: response)

  result = AgenticTools(client=None).search_web("langgraph")

  assert "LangGraph docs" in result


def test_replies_are_stripped_to_plain_text():
  reply = responses._to_plain_text("## Jobs\n1. **AI Engineer** - [Apply here](https://x.com/a)")

  assert reply == "Jobs\n1. AI Engineer - Apply here: https://x.com/a"


def _tool_call(call_id, name, arguments):
  return SimpleNamespace(id=call_id, function=SimpleNamespace(name=name, arguments=json.dumps(arguments)))


def _completion(content=None, tool_calls=None):
  return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=content, tool_calls=tool_calls))])


def test_agent_loop_chains_tools_and_keeps_context(monkeypatch):
  scripted = [
    _completion(tool_calls=[_tool_call("1", "search_jobs", {"query": "Django jobs"})]),
    _completion(tool_calls=[_tool_call("2", "analyze_skills", {"job_description": "Django, LangChain"})]),
    _completion(content="Frank is a strong fit."),
  ]
  requests_seen = []

  def create(**kwargs):
    requests_seen.append(json.loads(json.dumps(kwargs["messages"])))
    return scripted.pop(0)

  fake_client = SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(create=create)))
  monkeypatch.setattr(responses, "client", fake_client)
  monkeypatch.setattr(responses.tools, "search_web", lambda query: "Acme is hiring a Django developer")

  reply = responses.generate_bot_response(
    "Find Django jobs and check Frank's fit",
    history=[{"role": "user", "content": "Hi"}, {"role": "assistant", "content": "Hello!"}],
    session_id="s1",
  )

  assert reply == "Frank is a strong fit."
  final_messages = requests_seen[-1]
  assert "Frank's Information" in final_messages[0]["content"]
  assert [m["role"] for m in final_messages[1:3]] == ["user", "assistant"]
  tool_results = [m["content"] for m in final_messages if m["role"] == "tool"]
  assert "Acme is hiring" in tool_results[0]
  assert "Django" in tool_results[1]
