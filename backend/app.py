import os
from typing import Literal

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from responses import generate_bot_response


# Comma-separated list, e.g. "https://my-site.vercel.app,http://localhost:8080"
ALLOWED_ORIGINS = [
  origin.strip()
  for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:8080").split(",")
  if origin.strip()
]

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=ALLOWED_ORIGINS,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


class ChatTurn(BaseModel):
  role: Literal["user", "assistant"]
  content: str


class ChatRequest(BaseModel):
  message: str
  history: list[ChatTurn] = Field(default_factory=list)
  session_id: str | None = Field(default=None, max_length=64)


class ChatResponse(BaseModel):
  reply: str


class VoiceSessionRequest(BaseModel):
  """Reserved for future voice session options; no secrets belong here."""


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
  return Response(status_code=204)


@app.get("/")
def root():
  return {"status": "ok", "message": "Chat service ready."}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
  if not req.message or not req.message.strip():
    raise HTTPException(status_code=400, detail="Message cannot be empty.")
  reply = generate_bot_response(
    req.message,
    history=[turn.model_dump() for turn in req.history],
    session_id=req.session_id,
  )
  return ChatResponse(reply=reply)


@app.post(
  "/voice/session",
  status_code=503,
  summary="Reserve a voice-assistant session",
)
def create_voice_session(_: VoiceSessionRequest | None = None):
  """Placeholder for a future OpenAI Realtime session integration.

  This route intentionally does not send API keys or realtime credentials to the
  browser. When enabled, it should mint short-lived server-generated client
  credentials after authenticating the caller.
  """
  raise HTTPException(
    status_code=503,
    detail={
      "message": "Voice assistant sessions are not enabled yet.",
      "next_step": "Configure a server-side OpenAI Realtime integration and short-lived client credentials.",
    },
  )
