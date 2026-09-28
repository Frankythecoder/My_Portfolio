import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Bot, MessageSquare, Send, X } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
}

const MAX_HISTORY = 12;

const createSessionId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const ChatBot = () => {
  // Scopes the assistant's memory tools to this visitor's tab
  const [sessionId] = useState(createSessionId);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      content: "Hi! I'm Frank's AI assistant. Ask me about his projects, experience, or skills.",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const nextId = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const addMessage = (content: string, sender: Message['sender']) => {
    setMessages((current) => [
      ...current,
      { id: nextId.current++, content, sender },
    ]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    const history = messages
      .filter((message) => message.id !== 0)
      .slice(-MAX_HISTORY)
      .map((message) => ({
        role: message.sender === 'user' ? 'user' : 'assistant',
        content: message.content,
      }));

    addMessage(question, 'user');
    setInput('');
    setIsLoading(true);

    try {
      const result = await api<{ reply: string }>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: question, history, session_id: sessionId }),
      });
      addMessage(result.reply || 'I could not find an answer. Please try asking another question.', 'bot');
    } catch {
      addMessage("The assistant isn't available right now. You can reach Frank at jeyasinghfrankdiviyan@gmail.com.", 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="chat-toggle"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Close assistant' : 'Chat with Frank’s assistant'}
        aria-expanded={isOpen}
        aria-controls="portfolio-chat"
      >
        {isOpen ? <X size={25} /> : <MessageSquare size={25} />}
      </button>

      {isOpen && (
        <section className="chat-window" id="portfolio-chat" aria-label="Chat with Frank’s assistant">
          <div className="chat-heading">
            <Bot size={28} />
            <div>Ask about Frank<small>Projects, experience &amp; more</small></div>
          </div>
          <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.sender}`}>
                {message.content}
              </div>
            ))}
            {isLoading && <div className="chat-message" role="status">Thinking…</div>}
            <div ref={endRef} />
          </div>
          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question…"
              aria-label="Your question"
              disabled={isLoading}
            />
            <button type="submit" aria-label="Send message" disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </section>
      )}
    </>
  );
};

export default ChatBot;
