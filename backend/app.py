from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from responses import generate_bot_response


app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:8080"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


class ChatRequest(BaseModel):
  message: str


class ChatResponse(BaseModel):
  reply: str

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
  reply = generate_bot_response(req.message)
  return ChatResponse(reply=reply)


