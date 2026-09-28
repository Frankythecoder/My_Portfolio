from fastapi.testclient import TestClient

from app import app


client = TestClient(app)


def test_voice_session_is_unavailable_until_configured():
  response = client.post("/voice/session")

  assert response.status_code == 503
  body = response.json()
  assert body["detail"]["message"] == "Voice assistant sessions are not enabled yet."
  assert "short-lived client credentials" in body["detail"]["next_step"]


def test_voice_session_accepts_an_empty_json_object():
  response = client.post("/voice/session", json={})

  assert response.status_code == 503
