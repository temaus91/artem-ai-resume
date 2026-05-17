'use client';

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import HowItWorks from "@/components/HowItWorks";
import FitAssessment from "@/components/FitAssessment";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";

const PortfolioPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState<string | null>(null);

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const openChatWithQuestion = useCallback((question: string) => {
    setInitialQuestion(question);
    setIsChatOpen(true);
  }, []);
  const clearInitialQuestion = useCallback(() => setInitialQuestion(null), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k" && !isEditable) {
        event.preventDefault();
        openChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openChat]);

  return (
    <div className="site-shell min-h-screen bg-background">
      <Header onOpenChat={openChat} />
      <main>
        <Hero onOpenChat={openChat} onAskQuestion={openChatWithQuestion} />
        <FitAssessment />
        <Experience />
        <Projects />
        <HowItWorks />
      </main>
      <Footer />
      <AIChat
        isOpen={isChatOpen}
        initialQuestion={initialQuestion}
        onInitialQuestionConsumed={clearInitialQuestion}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default PortfolioPage;
