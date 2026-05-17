import { ExternalLink, Github, Linkedin } from "lucide-react";
import { artemProfile } from "@/data/artem-profile";

const Footer = () => {
  const githubUrl = artemProfile.githubUrl || "https://github.com";
  const linkedinUrl =
    artemProfile.linkedinUrl || "https://www.linkedin.com/in/artem-tarasenko-seattle";
  const sourceUrl = "https://github.com/temaus91/artem-ai-resume";

  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div>
            <p className="text-2xl font-serif text-foreground mb-2">{artemProfile.name}</p>
            <p className="text-muted-foreground">Senior Software Engineer · Full Stack Platform and AI Solutions</p>
            <p className="mt-3 max-w-xl text-sm text-text-subtle">
              Built with Next.js, OpenAI, Supabase, Tailwind CSS, and a deliberately public source trail.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              Site source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
