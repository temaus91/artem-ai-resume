"use client";

import { FormEvent, useState } from "react";
import { Command, MessageSquare, Send } from "lucide-react";
import { artemProfile } from "@/data/artem-profile";

interface HeroProps {
  onOpenChat: () => void;
  onAskQuestion: (question: string) => void;
}

const samplePrompts = [
  "Where is Artem strongest?",
  "What is Artem's education?",
  "Can Artem legally work in the US?",
];

const Hero = ({ onOpenChat, onAskQuestion }: HeroProps) => {
  const [question, setQuestion] = useState("");

  const submitQuestion = () => {
    const content = question.trim() || "Where is Artem strongest?";
    setQuestion("");
    onAskQuestion(content);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuestion();
  };

  return (
    <section
      id="hero"
      className="relative min-h-[72svh] overflow-hidden px-6 pt-24 pb-10 md:min-h-[78svh] md:pt-24 md:pb-12"
    >
      <div className="mx-auto flex min-h-[calc(72svh-8.5rem)] w-full max-w-4xl items-center md:min-h-[calc(78svh-9rem)]">
        <div className="w-full">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
            <span className="text-sm text-muted-foreground">{artemProfile.status}</span>
          </div>

          <h1 className="mb-6 text-4xl leading-tight sm:text-5xl md:text-7xl lg:text-8xl font-serif text-foreground animate-slide-up">
            {artemProfile.name}
          </h1>

          <p className="mb-4 text-2xl md:text-3xl text-primary font-serif animate-slide-up stagger-1">
            {artemProfile.title}
          </p>

          <p className="mb-7 text-lg md:text-xl text-muted-foreground animate-slide-up stagger-2">
            {artemProfile.subtitle}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mb-5 w-full animate-slide-up stagger-3"
            aria-label="Ask AI about Artem"
          >
            <label htmlFor="hero-ai-question" className="sr-only">
              Ask AI about Artem
            </label>
            <div className="group flex items-center gap-2 rounded-2xl border border-accent/45 bg-card p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors focus-within:border-accent">
              <MessageSquare className="ml-2 h-5 w-5 shrink-0 text-accent" />
              <input
                id="hero-ai-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    submitQuestion();
                  }
                }}
                placeholder="Ask about strengths, gaps, education, or fit..."
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-[16px] text-foreground outline-none placeholder:text-muted-foreground/90 md:text-sm"
              />
              <button
                type="submit"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
                aria-label="Ask AI"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mb-9 flex flex-col gap-3 animate-slide-up stagger-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onAskQuestion(prompt)}
                  className="rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <button
              onClick={onOpenChat}
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Command className="h-4 w-4" />
              <span>Open chat</span>
              <kbd className="rounded border border-current/30 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
