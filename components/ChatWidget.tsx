'use client';

import { useState, useRef, useEffect } from 'react';

const PRIMARY = '#b45309';
const PRIMARY_DARK = '#92400e';
const PRIMARY_GRADIENT = `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function renderMessageContent(content: string) {
  const parts = content.split(/(\[([^\]]+)\]\(([^)]+)\))/g);
  const result: React.ReactNode[] = [];
  let i = 0;
  while (i < parts.length) {
    const part = parts[i];
    if (part && part.startsWith('[') && parts[i + 1] && parts[i + 2]) {
      const text = parts[i + 1];
      const url = parts[i + 2];
      result.push(
        <a key={i} href={url} className="underline font-semibold" style={{ color: PRIMARY_DARK }}>
          {text}
        </a>
      );
      i += 3;
    } else {
      if (part) result.push(<span key={i}>{part}</span>);
      i++;
    }
  }
  return result;
}

const QUICK_REPLIES_INITIAL = ['Vezi meniu', 'Recomandări', 'Rezervări', 'Program'];

function getContextualReplies(message: string): string[] | null {
  const lower = message.toLowerCase();
  if (lower.includes('meniu') || lower.includes('cafea') || lower.includes('băutură') || lower.includes('bautura')) {
    return ['Opțiuni vegane', 'Deserturi', 'Cafea rece'];
  }
  if (lower.includes('rezerv') || lower.includes('loc') || lower.includes('masă') || lower.includes('masa')) {
    return ['Fă o rezervare', 'Program'];
  }
  return null;
}

function QuickReplyButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 font-medium"
      style={{
        borderColor: PRIMARY,
        color: hovered ? '#fff' : PRIMARY,
        background: hovered ? PRIMARY : '#fff',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bună ziua! Sunt Vibo, barista-ul tău virtual de la Vibe Coffee. Cum te pot ajuta? ☕',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userHasTyped, setUserHasTyped] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>(QUICK_REPLIES_INITIAL);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUserHasTyped(false);
      setQuickReplies(QUICK_REPLIES_INITIAL);
    }
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || isLoading) return;

    setUserHasTyped(true);
    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setQuickReplies([]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      const assistantMessage = data.message;
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }]);

      const contextual = getContextualReplies(assistantMessage);
      if (contextual) setQuickReplies(contextual);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Îmi pare rău, a apărut o eroare. Te rog încearcă din nou.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      setUserHasTyped(true);
      setQuickReplies([]);
    }
  };

  const showQuickReplies = quickReplies.length > 0 && (!userHasTyped || !isLoading);

  return (
    <>
      {/* Fereastra de chat — full screen pe mobil, floating pe desktop */}
      {isOpen && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden shadow-2xl rounded-2xl
            bottom-24 right-3 left-3 h-[72vh] max-h-[520px]
            sm:left-auto sm:right-6 sm:w-80 sm:h-[610px] sm:max-h-none"
          style={{ background: '#fff', border: '1px solid #e5e7eb' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: PRIMARY_GRADIENT, fontFamily: 'var(--font-heading, sans-serif)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xl"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                ☕
              </div>
              <div>
                <p className="text-white font-bold text-sm tracking-wide">Vibo</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>Barista virtual · Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors text-white hover:bg-white/20 text-2xl leading-none"
              aria-label="Închide chat"
            >
              ×
            </button>
          </div>

          {/* Zona mesaje */}
          <div
            className="flex-1 px-4 py-3 space-y-3"
            style={{ background: '#fafaf9', fontFamily: 'var(--font-inter, sans-serif)', overflowY: 'scroll', minHeight: 0 }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? { background: PRIMARY_GRADIENT, color: '#fff', borderBottomRightRadius: '4px' }
                      : { background: '#fff', color: '#1f2937', border: '1px solid #e5e7eb', borderBottomLeftRadius: '4px' }
                  }
                >
                  {msg.role === 'assistant' ? renderMessageContent(msg.content) : msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 rounded-2xl"
                  style={{ background: '#fff', border: '1px solid #e5e7eb', borderBottomLeftRadius: '4px' }}
                >
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: PRIMARY, animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: PRIMARY, animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: PRIMARY, animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {showQuickReplies && (
            <div
              className="px-3 pt-2 pb-2 flex flex-wrap gap-2 flex-shrink-0"
              style={{ background: '#fafaf9', borderTop: '1px solid #f3f4f6' }}
            >
              {quickReplies.map((reply) => (
                <QuickReplyButton
                  key={reply}
                  label={reply}
                  onClick={() => sendMessage(reply)}
                  disabled={isLoading}
                />
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="px-3 py-3 flex gap-2 flex-shrink-0"
            style={{ borderTop: '1px solid #e5e7eb', background: '#fff' }}
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Scrie un mesaj..."
              disabled={isLoading}
              className="flex-1 text-sm px-4 py-2 rounded-full outline-none disabled:opacity-50"
              style={{
                border: `1px solid #d1d5db`,
                background: '#f9fafb',
                color: '#1f2937',
                fontFamily: 'var(--font-inter, sans-serif)',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity disabled:opacity-40 flex-shrink-0"
              style={{ background: PRIMARY_GRADIENT }}
              aria-label="Trimite mesaj"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Buton flotant */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white text-2xl transition-transform hover:scale-110 active:scale-95 ${!isOpen ? 'animate-pulse' : ''}`}
        style={{ background: PRIMARY_GRADIENT }}
        aria-label="Deschide chat"
      >
        {isOpen ? '×' : (
        <span className="relative flex items-center justify-center w-full h-full">
          <span className="text-2xl">☕</span>
          {/* Bulă de mesaj care iese din cerc în colțul dreapta sus */}
          <span
            className="absolute flex items-center justify-center rounded-full shadow-md"
            style={{
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              background: '#fff',
              border: `2px solid ${PRIMARY}`,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M1 1.5C1 1.22 1.22 1 1.5 1h9C10.78 1 11 1.22 11 1.5v6c0 .28-.22.5-.5.5H7L5 10V8H1.5C1.22 8 1 7.78 1 7.5v-6z" fill={PRIMARY}/>
            </svg>
          </span>
        </span>
      )}
      </button>
    </>
  );
}
