import os
from typing import Literal

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from rate_limit import RateLimiter
from responses import generate_bot_response


MAX_MESSAGE_CHARS = 1000
MAX_TURN_CHARS = 8000
MAX_HISTORY_TURNS = 20


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

chat_limiter = RateLimiter(
  per_minute=int(os.getenv("CHAT_LIMIT_PER_MINUTE", "10")),
  per_day=int(os.getenv("CHAT_LIMIT_PER_DAY", "50")),
  global_per_day=int(os.getenv("CHAT_LIMIT_GLOBAL_PER_DAY", "500")),
)


def client_ip(request: Request) -> str:
  # Behind Render's proxy the visitor's IP is the first X-Forwarded-For entry.
  # A client can forge it to dodge the per-IP limit; the global cap still applies.
  forwarded = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
  return forwarded or (request.client.host if request.client else "unknown")


class ChatTurn(BaseModel):
  role: Literal["user", "assistant"]
  content: str = Field(max_length=MAX_TURN_CHARS)


class ChatRequest(BaseModel):
  message: str = Field(max_length=MAX_MESSAGE_CHARS)
  history: list[ChatTurn] = Field(default_factory=list, max_length=MAX_HISTORY_TURNS)
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
def chat(req: ChatRequest, request: Request):
  if not req.message or not req.message.strip():
    raise HTTPException(status_code=400, detail="Message cannot be empty.")
  limit_message = chat_limiter.check(client_ip(request))
  if limit_message:
    raise HTTPException(status_code=429, detail=limit_message)
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
