import pytest
from fastapi.testclient import TestClient

import app as app_module
from app import app
from rate_limit import RateLimiter


client = TestClient(app)


@pytest.fixture
def fake_bot(monkeypatch):
  """Skip OpenAI and give each test a fresh limiter: 2/minute per IP, 3/day overall"""
  monkeypatch.setattr(app_module, "generate_bot_response", lambda message, **_: f"echo: {message}")
  monkeypatch.setattr(app_module, "chat_limiter", RateLimiter(per_minute=2, per_day=100, global_per_day=3))


def test_chat_rejects_overlong_messages(fake_bot):
  response = client.post("/chat", json={"message": "x" * (app_module.MAX_MESSAGE_CHARS + 1)})

  assert response.status_code == 422


def test_chat_rejects_oversized_history(fake_bot):
  history = [{"role": "user", "content": "hi"}] * (app_module.MAX_HISTORY_TURNS + 1)
  response = client.post("/chat", json={"message": "hi", "history": history})

  assert response.status_code == 422


def test_chat_is_rate_limited_per_forwarded_ip(fake_bot):
  visitor_a = {"X-Forwarded-For": "1.1.1.1, 10.0.0.1"}

  assert client.post("/chat", json={"message": "hi"}, headers=visitor_a).json() == {"reply": "echo: hi"}
  assert client.post("/chat", json={"message": "hi"}, headers=visitor_a).status_code == 200
  limited = client.post("/chat", json={"message": "hi"}, headers=visitor_a)
  assert limited.status_code == 429
  assert "too quickly" in limited.json()["detail"]

  visitor_b = {"X-Forwarded-For": "2.2.2.2"}
  assert client.post("/chat", json={"message": "hi"}, headers=visitor_b).status_code == 200
  assert "daily limit" in client.post("/chat", json={"message": "hi"}, headers=visitor_b).json()["detail"]


def test_voice_session_is_unavailable_until_configured():
  response = client.post("/voice/session")

  assert response.status_code == 503
  body = response.json()
  assert body["detail"]["message"] == "Voice assistant sessions are not enabled yet."
  assert "short-lived client credentials" in body["detail"]["next_step"]


def test_voice_session_accepts_an_empty_json_object():
  response = client.post("/voice/session", json={})

  assert response.status_code == 503
