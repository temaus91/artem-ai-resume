import { useState, useEffect } from "react";
import { Command, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenChat?: () => void;
}

const Header = ({ onOpenChat }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const shouldWaitForMenuClose = mobileMenuOpen;

    setMobileMenuOpen(false);

    window.setTimeout(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = document.getElementById(id);

      if (!target) {
        return;
      }

      const navHeight = document.querySelector("header nav")?.getBoundingClientRect().height ?? 0;
      const breathingRoom = id === "hero" ? 0 : 16;
      const targetTop = target.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(targetTop - navHeight - breathingRoom, 0),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }, shouldWaitForMenuClose ? 75 : 0);
  };

  const handleAskAI = () => {
    setMobileMenuOpen(false);
    if (onOpenChat) {
      onOpenChat();
    } else {
      scrollToSection("experience");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => scrollToSection("hero")}
          className="font-serif text-xl text-foreground hover:text-primary transition-colors"
        >
          AT
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("experience")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("fit-assessment")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Fit Check
          </button>
          <button
            onClick={handleAskAI}
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent px-4 py-2 text-sm text-accent-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Command className="h-3.5 w-3.5" />
            <span>Ask AI</span>
            <kbd className="rounded border border-accent-foreground/30 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-b border-border animate-slide-down">
          <div className="px-6 py-4">
            <div className="grid gap-4 border-b border-border pb-4">
            <button
              onClick={() => scrollToSection("experience")}
              className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("fit-assessment")}
              className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors"
            >
              Fit Check
            </button>
            </div>
            <button
              onClick={handleAskAI}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-accent-foreground transition-transform active:scale-[0.98]"
            >
              <Command className="h-4 w-4" />
              Ask AI About Me
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
