'use client';

import { useState } from "react";
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

  const openChat = () => setIsChatOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenChat={openChat} />
      <main>
        <Hero onOpenChat={openChat} />
        <Experience />
        <Projects />
        <HowItWorks />
        <FitAssessment />
      </main>
      <Footer />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default PortfolioPage;
