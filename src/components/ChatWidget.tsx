import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WHATSAPP_NUMBER = import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '+33695358644';
const SESSION_KEY = 'mb-chat-messages';
const SESSION_COUNTER_KEY = 'mb-chat-count';
const MAX_QUESTIONS = 5;

const WELCOME_GREETING = "Bonjour ! Moi c'est Natoo, l'assistante de Maître Baigneur. Tarifs, bassins, prestations — plongeons dans le vif du sujet !";
const WELCOME_FOLLOWUP = "Qu'est-ce qui vous amène ?";

const SUGGESTIONS = [
  'Quels sont vos tarifs ?',
  'Cours bébé nageur dès quel âge ?',
  'Quels bassins proposez-vous ?',
  'Comment réserver un cours ?',
];

function buildWhatsappUrl(question: string): string {
  const text = `Bonjour, j'ai une question : ${question}`;
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
}

function renderWithLinks(text: string): React.ReactNode {
  const parts = text.split(/(https?:\/\/[^\s]+|\+33\s?\d[\s\d]{7,}|[\w.+-]+@[\w-]+\.[\w.]+)/);
  return (
    <>
      {parts.map((part, i) => {
        if (part.match(/^https?:\/\//)) {
          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="chat-link">
              Réserver en ligne
            </a>
          );
        }
        if (part.match(/^\+33[\s\d]{8,}/)) {
          const tel = part.replace(/\s/g, '');
          return (
            <a key={i} href={`tel:${tel}`} className="chat-link">
              {part}
            </a>
          );
        }
        if (part.match(/^[\w.+-]+@[\w-]+\.[\w.]+$/)) {
          return (
            <a key={i} href={`mailto:${part}`} className="chat-link">
              {part}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

function readSessionCount(): number {
  try { return parseInt(sessionStorage.getItem(SESSION_COUNTER_KEY) ?? '0', 10) || 0; }
  catch { return 0; }
}

function writeSessionCount(n: number): void {
  try { sessionStorage.setItem(SESSION_COUNTER_KEY, String(n)); } catch {}
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [visible, setVisible] = useState(false);
  const [questionCount, setQuestionCount] = useState(readSessionCount);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const remaining = MAX_QUESTIONS - questionCount;
  const limitReached = remaining <= 0;

  useEffect(() => {
    const update = () => {
      setVisible((document.body.scrollTop || document.documentElement.scrollTop) > 20);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  // Séquence d'accueil animée
  useEffect(() => {
    if (!open || messages.length > 0) {
      setWelcomeStep(0);
      return;
    }
    setWelcomeStep(1);
    const t1 = setTimeout(() => setWelcomeStep(2), 1200);
    const t2 = setTimeout(() => setWelcomeStep(3), 1600);
    const t3 = setTimeout(() => setWelcomeStep(4), 2600);
    const t4 = setTimeout(() => setWelcomeStep(5), 2900);
    const t5 = setTimeout(() => setWelcomeStep(6), 3700);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5);
      setWelcomeStep(0);
    };
  }, [open, messages.length]);

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading || cooldown || limitReached) return;

    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    writeSessionCount(newCount);

    setInput('');
    setLastQuestion(msg);
    setShowWhatsapp(false);
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages.slice(-6) }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply ?? 'Limite atteinte. Contactez-nous par WhatsApp.' }]);
        setShowWhatsapp(true);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Désolé, je suis momentanément indisponible.' }]);
        setShowWhatsapp(true);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        if (data.suggestWhatsapp) setShowWhatsapp(true);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Désolé, je suis momentanément indisponible.' }]);
      setShowWhatsapp(true);
    } finally {
      setLoading(false);
      setCooldown(true);
      setTimeout(() => setCooldown(false), 1500);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function clearChat() {
    setMessages([]);
    setShowWhatsapp(false);
    setLastQuestion('');
    setQuestionCount(0);
    setWelcomeStep(0);
    writeSessionCount(0);
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }

  return (
    <>
      <button
        className={`chat-toggle${open ? ' chat-toggle--open' : ''}${visible ? ' is-visible' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Fermer le chat' : 'Ouvrir le chat'}
        aria-expanded={open}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6V2H8"/>
              <path d="m8 18-4 4V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"/>
              <path d="M2 12h2"/>
              <path d="M9 11v2"/>
              <path d="M15 11v2"/>
              <path d="M20 12h2"/>
            </svg>
            <span className="chat-toggle__label" aria-hidden="true">Natoo</span>
          </>
        )}
      </button>

      {open && (
        <div className="chat-window" role="dialog" aria-label="Natoo, assistante Maître Baigneur">
          <div className="chat-header">
            <div className="chat-header__info">
              <span className="chat-header__title">Natoo</span>
              <span className="chat-header__subtitle">Assistante Maître Baigneur</span>
            </div>
            {messages.length > 0 && (
              <button className="chat-clear-btn" onClick={clearChat} aria-label="Effacer la conversation" title="Nouvelle conversation">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            )}
          </div>

          <div className="chat-messages" aria-live="polite">
            {messages.length === 0 && !loading && welcomeStep > 0 && (
              <>
                {welcomeStep === 1 && (
                  <div className="chat-message chat-message--assistant chat-message--loading" aria-label="Chargement">
                    <span /><span /><span />
                  </div>
                )}
                {welcomeStep >= 2 && (
                  <div className="chat-message chat-message--assistant">
                    <p>{WELCOME_GREETING}</p>
                  </div>
                )}
                {welcomeStep === 3 && (
                  <div className="chat-message chat-message--assistant chat-message--loading" aria-label="Chargement">
                    <span /><span /><span />
                  </div>
                )}
                {welcomeStep >= 4 && (
                  <div className="chat-suggestions">
                    {SUGGESTIONS.map(s => (
                      <button key={s} className="chat-suggestion" onClick={() => handleSend(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {welcomeStep === 5 && (
                  <div className="chat-message chat-message--assistant chat-message--loading" aria-label="Chargement">
                    <span /><span /><span />
                  </div>
                )}
                {welcomeStep >= 6 && (
                  <div className="chat-message chat-message--assistant">
                    <p>{WELCOME_FOLLOWUP}</p>
                  </div>
                )}
              </>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message chat-message--${msg.role}`}>
                <p>{msg.role === 'assistant' ? renderWithLinks(msg.content) : msg.content}</p>
              </div>
            ))}
            {loading && (
              <div className="chat-message chat-message--assistant chat-message--loading" aria-label="Réponse en cours">
                <span /><span /><span />
              </div>
            )}
            {showWhatsapp && (
              <a href={buildWhatsappUrl(lastQuestion)} target="_blank" rel="noopener noreferrer" className="chat-whatsapp-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Contacter par WhatsApp
              </a>
            )}
            <div ref={messagesEndRef} />
          </div>

          {limitReached ? (
            <div className="chat-limit-reached">
              <p>Vous avez utilisé vos {MAX_QUESTIONS} questions de cette session.</p>
              <a href={buildWhatsappUrl(lastQuestion || 'Je souhaite plus d\'informations')} target="_blank" rel="noopener noreferrer" className="chat-whatsapp-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Continuer par WhatsApp
              </a>
            </div>
          ) : (
            <>
              {questionCount > 0 && (
                <p className="chat-remaining" aria-live="polite">
                  {remaining} question{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
                </p>
              )}
            <div className="chat-input-area">
              <div className="chat-input-wrap">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Votre question..."
                  maxLength={500}
                  disabled={loading}
                  className="chat-input"
                  aria-label="Votre question"
                />
                {input.length > 400 && (
                  <span className="chat-char-count" aria-live="polite">{input.length}/500</span>
                )}
              </div>
              <button
                onClick={() => handleSend()}
                disabled={loading || cooldown || !input.trim()}
                className="chat-send-btn"
                aria-label="Envoyer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
