import { artemProfile } from "@/data/artem-profile";
import ExperienceCard from "./ExperienceCard";
import { Check, Minus, X } from "lucide-react";

const skillGroups = [
  {
    title: "Strong",
    skills: artemProfile.skills.strong,
    icon: Check,
    className: "bg-success-muted border-success/20",
    iconClassName: "border-success/25 bg-success/10 text-success",
    titleClassName: "text-success",
  },
  {
    title: "Moderate",
    skills: artemProfile.skills.moderate,
    icon: Minus,
    className: "bg-secondary border-border",
    iconClassName: "border-border bg-muted text-muted-foreground",
    titleClassName: "text-muted-foreground",
  },
  {
    title: "Gaps (I'll tell you)",
    skills: artemProfile.skills.gaps,
    icon: X,
    className: "bg-warning-muted border-warning/20",
    iconClassName: "border-warning/25 bg-warning/10 text-warning",
    titleClassName: "text-warning",
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Experience
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Each role includes queryable AI context—the real story behind the bullet points.
          </p>
        </div>

        {/* Experience cards */}
        <div className="space-y-6">
          {artemProfile.experience.map((exp, index) => (
            <ExperienceCard
              key={exp.company}
              {...exp}
              index={index}
            />
          ))}
        </div>

        {/* Skills Grid */}
        <div id="skills" className="mt-16 grid md:grid-cols-3 gap-6 scroll-mt-24">
          {skillGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title} className={`rounded-2xl border p-6 ${group.className}`}>
                <h4 className={`mb-4 text-sm font-mono uppercase tracking-wider ${group.titleClassName}`}>
                  {group.title}
                </h4>
                <ul className="space-y-2">
                  {group.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-foreground">
                      <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${group.iconClassName}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
