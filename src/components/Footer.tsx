import { Github, Linkedin, Mail } from "lucide-react";
import { artemProfile } from "@/data/artem-profile";

const Footer = () => {
  const githubUrl = artemProfile.githubUrl || "https://github.com";
  const linkedinUrl =
    artemProfile.linkedinUrl || "https://www.linkedin.com/in/artem-tarasenko-seattle";
  const email = artemProfile.email || "temaus91@gmail.com";

  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-2xl font-serif text-foreground mb-2">{artemProfile.name}</p>
            <p className="text-muted-foreground">Senior Software Engineer · Full Stack Platform and AI Solutions</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-secondary rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-secondary rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${email}`}
              className="p-3 bg-secondary rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            This portfolio demonstrates AI-queryable professional presentation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
