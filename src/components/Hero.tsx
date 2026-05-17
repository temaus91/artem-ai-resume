"use client";

import { FormEvent, useState } from "react";
import { Command, GraduationCap, MessageSquare, Send, ShieldCheck, Sparkles } from "lucide-react";
import { artemProfile } from "@/data/artem-profile";
import { Chip } from "@/components/ui/Chip";

interface HeroProps {
  onOpenChat: () => void;
  onAskQuestion: (question: string) => void;
}

const samplePrompts = [
  "Where is Artem strongest?",
  "Can Artem legally work in the US?",
  "What should I probe in an interview?",
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
      className="relative min-h-[88svh] md:min-h-[100dvh] overflow-hidden px-6 pt-24 pb-12 md:pt-24 md:pb-16"
    >
      <div className="mx-auto grid min-h-[calc(88svh-9rem)] w-full max-w-6xl items-center gap-10 md:min-h-[calc(100dvh-10rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
            <span className="text-sm text-muted-foreground">{artemProfile.status}</span>
          </div>

          <h1 className="mb-6 max-w-3xl text-4xl leading-tight sm:text-5xl md:text-7xl lg:text-8xl font-serif text-foreground animate-slide-up">
            {artemProfile.name}
          </h1>

          <p className="mb-4 text-2xl md:text-3xl text-primary font-serif animate-slide-up stagger-1">
            {artemProfile.title}
          </p>

          <p className="mb-7 max-w-2xl text-lg md:text-xl text-muted-foreground animate-slide-up stagger-2">
            {artemProfile.subtitle}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mb-5 max-w-2xl animate-slide-up stagger-3"
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

          <div className="mb-9 flex flex-wrap gap-2 animate-slide-up stagger-4">
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

          <div className="flex flex-wrap items-center gap-3 animate-slide-up stagger-4">
            {artemProfile.companies.map((company) => (
              <Chip key={company}>{company}</Chip>
            ))}
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Command className="h-4 w-4" />
              <span>Open chat</span>
              <kbd className="rounded border border-current/30 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
          </div>
        </div>

        <div className="relative hidden lg:block animate-slide-up stagger-2">
          <div className="rounded-3xl border border-border bg-card/75 p-5 shadow-2xl shadow-background/30 backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-accent">
                  AI evidence console
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Answers stay tied to approved resume facts.
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-border bg-secondary/70 p-4">
                <p className="text-xs font-mono uppercase tracking-wider text-text-subtle">
                  Query
                </p>
                <p className="mt-2 text-sm text-foreground">
                  Can Artem handle a senior full-stack platform role?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-success/25 bg-success-muted/45 p-4">
                  <ShieldCheck className="mb-3 h-5 w-5 text-success" />
                  <p className="text-sm text-foreground">US citizen</p>
                  <p className="mt-1 text-xs text-muted-foreground">Authorized to work</p>
                </div>
                <div className="rounded-2xl border border-primary/25 bg-secondary/70 p-4">
                  <GraduationCap className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-sm text-foreground">UW Computer Science</p>
                  <p className="mt-1 text-xs text-muted-foreground">Bachelor of Science</p>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-secondary/70 p-4">
                <p className="text-xs font-mono uppercase tracking-wider text-text-subtle">
                  Evidence used
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip variant="accent">Oracle</Chip>
                  <Chip variant="accent">Amazon</Chip>
                  <Chip variant="accent">Projects</Chip>
                  <Chip variant="muted">Known gaps</Chip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
