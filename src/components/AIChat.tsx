import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clipboard, MessageCircle, Send, X } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { Chip } from "@/components/ui/Chip";

interface AIChatProps {
  isOpen: boolean;
  initialQuestion?: string | null;
  onInitialQuestionConsumed?: () => void;
  onClose: () => void;
}

const suggestedQuestions = [
  "Where is Artem strongest?",
  "Where is Artem not a fit?",
  "What should I probe in an interview?",
  "Explain the AI resume project",
  "Tell me about a real failure",
];

const evidenceTargets: Record<string, string> = {
  Oracle: "experience-oracle",
  Amazon: "experience-amazon",
  Projects: "projects",
  Failures: "experience",
  Skills: "skills",
  "Known gaps": "skills",
  FAQ: "hero",
};

function splitEvidenceLine(content: string) {
  const match = content.match(/\n\nEvidence used:\s*([^\n]+)$/i);
  if (!match) return { body: content, labels: [] as string[] };

  return {
    body: content.slice(0, match.index).trim(),
    labels: match[1].split(",").map((label) => label.trim()).filter(Boolean),
  };
}

const AIChat = ({
  isOpen,
  initialQuestion,
  onInitialQuestionConsumed,
  onClose,
}: AIChatProps) => {
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { messages, ask, loading } = useChat();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const visibleMessages = useMemo(
    () => messages.map((message) => ({ ...message, parsed: splitEvidenceLine(message.content) })),
    [messages],
  );

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !initialQuestion || loading) return;
    onInitialQuestionConsumed?.();
    void ask(initialQuestion);
  }, [ask, initialQuestion, isOpen, loading, onInitialQuestionConsumed]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    await ask(content);
  };

  const copyAnswer = async (index: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1400);
    } catch {
      setCopiedIndex(null);
    }
  };

  const jumpToEvidence = (label: string) => {
    const target = evidenceTargets[label];
    if (!target) return;
    onClose();
    window.setTimeout(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(target)?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }, 50);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-title"
        aria-describedby="chat-description"
        className="absolute right-0 top-0 flex h-[100dvh] w-full max-w-2xl flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/35 bg-accent/15 font-serif font-bold text-accent">
              A
            </div>
            <div>
              <p id="chat-title" className="font-medium text-foreground">Ask AI About Artem</p>
              <p id="chat-description" className="text-xs text-muted-foreground">
                Evidence-grounded answers about experience, gaps, education, and fit.
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6" aria-live="polite">
          {visibleMessages.length === 0 ? (
            <div className="py-10">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary">
                <MessageCircle className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-2 text-center text-lg font-medium">Ask a recruiter-style question</h3>
              <p className="mx-auto mb-6 max-w-sm text-center text-sm text-muted-foreground">
                The assistant should answer from approved resume evidence and call out gaps directly.
              </p>
              <div className="mx-auto grid max-w-xl gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => void send(question)}
                    className="rounded-xl border border-border bg-secondary p-3 text-left text-sm text-foreground transition-colors hover:border-accent/50 hover:bg-muted"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            visibleMessages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`group max-w-[86%] ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                        isUser
                          ? "bg-accent text-accent-foreground"
                          : "border border-border bg-secondary text-foreground"
                      }`}
                    >
                      {message.parsed.body}
                    </div>

                    {!isUser && message.parsed.labels.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.parsed.labels.map((label) => (
                          <button
                            key={label}
                            onClick={() => jumpToEvidence(label)}
                            className="rounded-full"
                            disabled={!evidenceTargets[label]}
                            title={evidenceTargets[label] ? `Jump to ${label} evidence` : label}
                          >
                            <Chip variant="accent">{label}</Chip>
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {!isUser ? (
                      <button
                        onClick={() => void copyAnswer(index, message.content)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus:opacity-100"
                        aria-label="Copy answer"
                      >
                        {copiedIndex === index ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
                        {copiedIndex === index ? "Copied" : "Copy"}
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}

          {loading ? (
            <div className="flex justify-start">
              <div className="w-full max-w-[86%] rounded-2xl border border-border bg-secondary px-4 py-3">
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse-soft" />
                  Checking resume evidence
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-11/12 rounded-full bg-muted animate-skeleton" />
                  <div className="h-3 w-3/4 rounded-full bg-muted animate-skeleton" />
                  <div className="h-3 w-5/6 rounded-full bg-muted animate-skeleton" />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div
          className="shrink-0 border-t border-border bg-card"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
          }}
        >
          <div
            className="flex gap-2 p-4"
            style={{
              paddingLeft: "calc(env(safe-area-inset-left) + 1rem)",
              paddingRight: "calc(env(safe-area-inset-right) + 1rem)",
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Ask about Artem
            </label>
            <input
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && void send()}
              placeholder="Ask about strengths, gaps, education, or fit..."
              className="min-w-0 flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-[16px] outline-none transition-colors placeholder:text-muted-foreground/90 focus:border-accent md:text-sm"
            />
            <button
              onClick={() => void send()}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
              disabled={loading || input.trim().length === 0}
              aria-label="Send question"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
