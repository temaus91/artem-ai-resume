import { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedQuestions = [
  'What’s your biggest weakness?',
  'Tell me about a project that failed',
  'Why did you leave Amazon?',
  'What would your last manager say about you?',
];

const AIChat = ({ isOpen, onClose }: AIChatProps) => {
  const [input, setInput] = useState('');
  const { messages, ask, loading } = useChat();

  if (!isOpen) return null;

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput('');
    await ask(content);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-[100dvh] w-full max-w-2xl bg-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-accent-foreground font-serif font-bold">A</div>
            <div>
              <p className="text-foreground font-medium">Ask AI About Artem</p>
              <p className="text-xs text-muted-foreground">Direct, honest fit answers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">What would you like to know?</h3>
              <p className="text-muted-foreground text-sm mb-6">Ask specific questions about experience and role fit.</p>
              <div className="space-y-2 max-w-xl mx-auto">
                {suggestedQuestions.map((q) => (
                  <button key={q} onClick={() => void send(q)} className="w-full text-left p-3 rounded-lg bg-secondary hover:bg-muted text-sm">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground'}`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && <p className="text-sm text-muted-foreground">Thinking…</p>}
        </div>

        <div
          className="shrink-0 border-t border-border bg-card"
          style={{
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
          }}
        >
          <div
            className="flex gap-2 p-4"
            style={{
              paddingLeft: 'calc(env(safe-area-inset-left) + 1rem)',
              paddingRight: 'calc(env(safe-area-inset-right) + 1rem)',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void send()}
              placeholder="Ask about strengths, gaps, or fit..."
              className="min-w-0 flex-1 bg-secondary rounded-lg px-4 py-2 text-[16px] md:text-sm"
            />
            <button
              onClick={() => void send()}
              className="h-10 w-10 shrink-0 inline-flex items-center justify-center bg-accent hover:bg-accent/90 rounded-lg text-accent-foreground"
              disabled={loading}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
