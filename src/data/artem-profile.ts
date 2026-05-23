// Artem Tarasenko profile data - core content for portfolio display and demo AI responses.

export const artemProfile = {
  name: "Artem Tarasenko",
  title: "Senior Software Engineer",
  subtitle:
    "Senior full-stack engineer building reliable platforms, AI workflows, and automation systems",
  location: "Seattle Area",
  status: "Open to Senior+ full-stack/platform roles (remote-first)",
  companies: ["Oracle", "Amazon"],
  yearsExperience: "12+ years of software engineering experience",
  linkedinUrl: "https://www.linkedin.com/in/artem-tarasenko-seattle",
  githubUrl: "https://github.com/temaus91",
  education: "Bachelor of Science in Computer Science, University of Washington",
  workAuthorization: "US citizen; legally authorized to work in the United States",

  summary: `I build reliable full-stack and backend systems at enterprise scale across Oracle and Amazon.
I have 12+ years of experience, including 10 years at Amazon across high-scale product and platform teams, and current work at Oracle on AI-enabled healthcare workflows.
I have a Bachelor of Science in Computer Science from the University of Washington and am a US citizen legally authorized to work in the United States.
I focus on high-impact, problem-first execution: replacing brittle systems, improving developer workflows, and shipping practical solutions end-to-end.
Since 2025, I have used AI development tools heavily, especially Codex and Anthropic Claude, across planning, implementation, testing, refactoring, and documentation.
I also build AI-enabled applications and developer tools, including this AI-queryable resume and FirstTrace, an open-source, evidence-grounded bug-localization tool.
I mentor engineers, communicate directly, and help teammates use AI tools more effectively.
I value friendly, honest working relationships and bring humor, curiosity, and strong ownership to teams.`,

  aiExperienceSummary:
    "Since 2025, Artem has used Codex and Anthropic Claude heavily for software planning, implementation, testing, refactoring, and documentation. He has also built AI-enabled application and developer-tooling flows, including this AI-queryable resume with an OpenAI-backed chat experience and structured job-description fit analyzer, plus FirstTrace, an open-source evidence-grounded bug-localization tool for engineers.",

  awsServices: ["IAM", "S3", "DynamoDB", "EC2", "SNS", "SQS", "Lambda", "Kinesis", "Redshift"],
  ociExperience: [
    "Oracle Cloud Infrastructure (OCI) operations support",
    "OCI IAM application configuration",
    "Authentication and authorization integration",
    "Token minting and service authorization flows",
  ],
  cloudSecurityAndNetworking: [
    "IAM permission design",
    "Security groups",
    "Service-to-service authorization",
    "Encryption",
    "Secrets management",
  ],
  hardNoClaims: [
    "Not a people manager today",
    "No server hardware engineering background",
    "No long-term production ownership of shipped native iOS/watchOS apps yet; currently building a SwiftUI iOS/watchOS app and has some Kindle Scribe launch/device-readiness experience",
  ],
  tonePreference: "balanced",
  whyLeftAmazon: `After a long and meaningful run at Amazon, I wanted a new challenge in a remote-first setup while staying in Seattle. I was on a manager track, but company-wide flattening and layoffs paused that path. I also wanted to move away from older mobile technology constraints and back toward broader full-stack/platform work.`,
  managerFeedback2026: `Artem started working on the LSAAS product at the beginning of the fiscal year and made solid contributions across the User Management plugin and multiple UI features. He collaborates effectively with the auth-z team, communicates clearly, and delivers practical results. The API automation tool he helped build is now used by multiple Clinical One service teams, with positive feedback on speed, error clarity, and troubleshooting.`,
  personal: [
    "Leads a home book club",
    "Has two dogs and two cats",
    "Travels frequently with his wife",
    "Enjoys paragliding, kiteboarding, skiing, climbing, and snowboarding",
  ],
  personalityHighlights: [
    "Funny and enjoys joking around",
    "Enjoys spending time with friends",
    "Reads extensively about AI",
    "Strong practical knowledge of cars and RVs",
  ],
  workValues: [
    "Honest, healthy, and friendly work relationships",
    "Building new ideas and modern systems over long-term legacy maintenance",
    "Using AI to help teams deliver faster and become more independent",
    "Team outings and strong team connection",
  ],
  longTermDreams: [
    "Open an RV shop one day",
    "Contribute feature direction at a major car company",
  ],

  projects: [
    {
      name: "FirstTrace",
      role: "Open-source developer tooling",
      period: "2026-Present",
      summary:
        "A self-hosted bug-localization tool that turns vague bug reports from CLI, Slack, or API input into cited investigation trails across code, commits, ownership, and issue context.",
      sourceUrl: "https://github.com/temaus91/firsttrace",
      highlights: [
        "Built a TypeScript CLI and hosted investigation path for read-only bug localization across local and GitHub repositories",
        "Designed an evidence-first AI workflow: deterministic search and ranking before optional OpenAI reasoning over bounded evidence",
        "Implemented provider-style architecture for repository access, filesystem/Supabase queues, Slack/API/CLI inputs, Vercel-compatible receivers, and worker execution",
        "Added Slack Events handling with signature verification, trigger gating, dedupe, queued investigations, and thread-ready result rendering",
        "Built eval and hosted-readiness flows to test citations, expected files, ownership hints, and receiver-to-worker behavior before live deployment claims"
      ],
      stack: [
        "TypeScript",
        "Node.js",
        "OpenAI",
        "Slack API",
        "GitHub App",
        "Supabase",
        "Vercel Functions",
        "Vitest",
        "Zod",
        "CLI tooling",
        "Worker queues"
      ],
      aiContext: {
        situation:
          "Teams often lose the first hour of debugging just finding the right code, owner, commit, or adjacent issue. I wanted an AI tool that produces a useful investigation starting point without requiring write access to private repositories.",
        approach:
          "I designed FirstTrace as read-only, self-hostable, and evidence-first. Deterministic search gathers files, docs, commit, issue, and ownership signals first; optional LLM reasoning ranks and explains that bounded evidence instead of inventing an answer.",
        technicalWork:
          "I built the TypeScript CLI, investigation runner, evidence search and ranking flow, OpenAI-backed investigator provider, GitHub App repository materialization, filesystem and Supabase queue adapters, Slack Events receiver with signature verification and dedupe, Vercel-compatible HTTP handlers, worker runtime, and Vitest/eval coverage for cited results.",
        lessonsLearned:
          "AI developer tools earn trust through constraints: read-only access, citations, evals, provider boundaries, clear failure modes, and honest wording about what has been locally verified versus what still needs live dogfood validation."
      }
    },
    {
      name: "AI Resume / Candidate Portfolio",
      role: "Personal project",
      period: "2026-Present",
      summary:
        "A public Next.js portfolio that lets recruiters ask questions against approved resume evidence and run structured job-description fit checks.",
      sourceUrl: "https://github.com/temaus91/artem-ai-resume",
      highlights: [
        "Built an OpenAI-backed resume chatbot and structured job-description fit analyzer",
        "Designed prompt guardrails so answers stay grounded, admit gaps, and avoid overselling",
        "Added optional Supabase chat-history persistence, focused tests, and a cleaned GitHub-ready project structure",
        "Used Codex and Anthropic Claude heavily throughout planning, implementation, debugging, cleanup, and documentation"
      ],
      stack: ["Next.js", "TypeScript", "OpenAI Responses API", "Tailwind CSS", "Supabase", "Vitest"],
      aiContext: {
        situation:
          "I wanted my resume to demonstrate how I think and build, not just list past jobs. A static resume could not answer recruiter-specific questions or expose my judgment around fit, gaps, and tradeoffs.",
        approach:
          "I treated the resume as a real AI product: define approved evidence, design anti-overselling behavior, build the chat and JD analysis flows, then clean the repo so the implementation itself is inspectable.",
        technicalWork:
          "I built a Next.js App Router portfolio with an OpenAI Responses API chat endpoint, structured job-description analysis using JSON schema output, reusable prompt builders, optional Supabase chat persistence, Tailwind UI, focused Vitest coverage, and a cleaned GitHub-ready project structure. I used Codex and Anthropic Claude heavily as development partners while keeping final architecture, product direction, and code review decisions grounded in my own judgment.",
        lessonsLearned:
          "AI tools are most valuable when paired with clear product intent, tight evidence boundaries, and human review. The hard part is not generating code; it is deciding what should exist, what should be deleted, and how the AI should behave honestly."
      }
    },
    {
      name: "Private Marketplace / Operations Platform",
      role: "Independent product build",
      period: undefined,
      sourceUrl: undefined,
      summary:
        "A private full-stack marketplace and operations platform for matching supply and venue-style demand, managing reservations, public discovery, payments, admin workflows, and staged production rollout.",
      highlights: [
        "Built a substantial Next.js product with authenticated user flows, public discovery pages, reservation workspaces, admin operations, and production-style deployment lanes",
        "Implemented Supabase-backed auth, PostgreSQL schema design, RLS-aware server flows, image storage, generated database types, seed data, and fixture-driven mock/demo environments",
        "Integrated Stripe Connect and Checkout Sessions with webhook idempotency, sale ledger snapshots, payout-readiness gating, refund/dispute-aware operations, and staged checkout testing",
        "Designed public exhibition-style routes with stable opaque slugs, QR code generation, print-ready QR kits, and lifecycle-aware public states",
        "Set up multi-environment deployment patterns across public preview, public demo, internal staging, mock data lanes, and server-backed staging",
        "Added broad verification coverage with linting, TypeScript checks, Vitest unit tests, Playwright flows, Supabase seed/type checks, and CI/CD-style verification scripts"
      ],
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
        "Stripe Connect",
        "Stripe Checkout",
        "Vercel",
        "Playwright",
        "Vitest",
        "Tailwind CSS",
        "Zod",
        "Email auth workflows"
      ],
      aiContext: {
        situation:
          "I wanted deeper hands-on experience building a real product surface beyond a resume demo: a marketplace-style workflow with public discovery, authenticated operators, payments, admin operations, and deployment discipline.",
        approach:
          "I kept the project private and independent, avoided naming the product publicly, and treated it as a production-oriented product build: clear environment topology, safe public preview/demo lanes, server-backed staging, payment ledgers, and broad automated verification.",
        technicalWork:
          "I built authenticated Next.js workflows backed by Supabase and PostgreSQL, designed RLS-aware server paths, implemented reservation and public exhibition flows, added Stripe Connect and Checkout integration, handled webhook idempotency and sale ledger snapshots, generated QR/public routes, managed Vercel deployment modes across mock and server-backed stages, and maintained Vitest plus Playwright coverage.",
        lessonsLearned:
          "Marketplace-style products require more than UI: auth boundaries, operational states, payments, webhooks, test data, staging topology, and launch gates have to be designed together. I learned to separate public demo behavior from real backend behavior so the product can be shown safely while production readiness is still gated."
      }
    },
    {
      name: "Soaring Session",
      role: "Personal iOS/watchOS project",
      period: undefined,
      sourceUrl: undefined,
      summary:
        "An in-progress local-first iPhone and Apple Watch app for paragliding and soaring sessions that keeps one outing alive across repeated takeoffs, top landings, relaunches, and final landing.",
      highlights: [
        "Built native SwiftUI iOS and watchOS app targets with a shared SoaringCore Swift package",
        "Implemented simulator telemetry replay and automatic flight-segment detection for takeoff, top-landing, relaunch, and final-landing scenarios",
        "Added local session persistence, summary calculation, CSV/export previews, and XCTest coverage around core session behavior",
        "Built WatchConnectivity command/snapshot sync and a HealthKit workout-session foundation for watch-controlled recording",
        "Keeping real GPS/barometer capture, locked-watch reliability, battery behavior, and outdoor field testing as explicit next validation steps"
      ],
      stack: [
        "Swift",
        "SwiftUI",
        "iOS",
        "watchOS",
        "HealthKit",
        "WatchConnectivity",
        "XCTest",
        "Local-first persistence"
      ],
      aiContext: {
        situation:
          "I could not find a paragliding app that matched how I wanted to record dune, ridge, and beach soaring sessions: one outing with multiple takeoffs, top landings, relaunches, fitness context, and local ownership of the log.",
        approach:
          "I am building it for myself first as a native Apple prototype, validating the hard parts in layers: shared session state, simulated telemetry, automatic segmentation, watch controls, local persistence, and then real-device field testing.",
        technicalWork:
          "I built SwiftUI iOS and watchOS targets, a shared SoaringCore Swift package, simulator telemetry replay, an automatic flight-segmentation engine with XCTest coverage, local JSON persistence and export previews, WatchConnectivity command and snapshot sync, and a HealthKit workout-session foundation for watch-controlled recording.",
        lessonsLearned:
          "For sensor-heavy apps, the honest engineering boundary matters: simulator telemetry can prove UI, state transitions, data modeling, and segmentation logic, but real GPS, barometer, battery, locked-watch behavior, and outdoor detection reliability still need physical-device validation before public claims."
      }
    }
  ],

  experience: [
    {
      company: "Oracle",
      role: "Senior Software Engineer, Full Stack (Clinical One - AI / Life Sciences)",
      period: "2024-Present",
      highlights: [
        "Led replacement of a legacy VM-based test framework with a production-ready cross-platform Test Automation Studio and execution engine",
        "Owned core Java execution logic, CLI compatibility, JSON-based tests, live execution visibility, and Excel-to-JSON migration paths",
        "Drove production adoption through documentation, training, and support; tool is now used by multiple Clinical One service teams with positive usability feedback",
        "Building AI Intelligence capabilities on Clinical One for large pharmaceutical companies, including user-management APIs and secure auth integration",
        "Added authentication and authorization flows involving token minting, OCI IAM application configuration, and Oracle Cloud operations support",
        "Delivered core full-stack workflows for trial-related pages and user journeys while maintaining confidentiality boundaries"
      ],
      aiContext: {
        situation:
          "After onboarding at Oracle, I identified major reliability and usability gaps in the existing AI testing toolchain. The platform needed a maintainable replacement that teams could adopt quickly.",
        approach:
          "I wrote a technical design proposing a full replacement. Initially I co-led implementation with a principal engineer (UI ownership split), then took full ownership when he left and drove delivery to production.",
        technicalWork:
          "I led the Java logic and execution engine architecture, added CLI-compatible execution, JSON test definitions, run-time observability, and migration support from Excel-based suites. I later transferred ownership through docs, enablement sessions, and a dedicated support channel. In parallel, I contributed to AI Intelligence with secure user-management APIs, authentication and authorization integration, token minting flows, OCI IAM application configuration, Oracle Cloud operations support, and end-user workflow pages in Clinical One.",
        lessonsLearned:
          "Own the full lifecycle, not just code: design quality, rollout, enablement, and long-term maintainability determine whether a platform change actually succeeds."
      }
    },
    {
      company: "Amazon",
      role: "Software Engineer -> Software Engineer II, Full Stack / Backend",
      period: "2014-2023",
      highlights: [
        "Built and maintained full-stack tools in Seller Experience (2014-2018), including a metrics project using Amazon Kinesis and Redshift",
        "Delivered Amazon HR tooling at large scale (2018-2020), including API latency optimizations with in-memory approaches and direct customer-driven delivery",
        "In Seller Fraud Prevention (2020-2022), identified a Redshift integration design issue and became an early internal adopter of a newer Redshift API",
        "In Kindle Content Management (2022-2023), helped lead delivery of a major Kindle UI redesign to on-time release",
        "Supported Kindle Scribe launch readiness by handling pre-release device workflows under embargo, coordinating a team for device deployment preparation, and delivering sorting/category experience work",
        "Hands-on with AWS services including IAM, S3, DynamoDB, EC2, SNS, SQS, Lambda, Kinesis, and Redshift; operated systems through regular on-call up to Sev-1 incidents"
      ],
      aiContext: {
        situation:
          "I worked across multiple Amazon organizations over ten years, each with different customer needs, scale requirements, and operational constraints.",
        approach:
          "My approach was to ramp quickly, dive deep into root causes, and deliver practical solutions end-to-end while balancing reliability and speed.",
        technicalWork:
          "I shipped APIs, backend services, and full-stack features across seller systems, HR workflows, fraud prevention tooling, and Kindle content platforms. On Kindle, I helped prepare pre-release Kindle Scribe devices for launch workflows under embargo, coordinated device deployment preparation with a team, and delivered sorting/category experience work. I regularly worked with AWS services including IAM, S3, DynamoDB, EC2, SNS, SQS, Lambda, Kinesis, and Redshift, handled production deployments, and participated in primary/secondary on-call rotations.",
        lessonsLearned:
          "Strong execution at scale requires clear ownership through the full lifecycle: design, implementation, deployment, confidential launch readiness, on-call operations, and continuous improvement."
      }
    }
  ],

  skills: {
    strong: [
      "High-Scale Distributed Systems",
      "Full-Stack Engineering",
      "Java / Backend API Development",
      "AWS Services and Cloud Operations (S3, SNS/SQS, DynamoDB, Redshift)",
      "AI Feature Integration",
      "AI-Assisted Software Development",
      "Test Automation Architecture",
      "Test Execution Engine Design",
      "Supabase / PostgreSQL Application Development",
      "On-Call Operations and Incident Handling",
      "Cross-Team Delivery",
      "Mentoring and Knowledge Transfer"
    ],
    moderate: [
      "Evidence-Grounded AI Workflow Design",
      "Open-Source Developer Tooling",
      "AI Agent Tooling Prototyping",
      "OpenAI API and LLM Integration",
      "Prompt, Guardrail, and Citation Design",
      "GitHub App and Slack Events Integration",
      "Async Job Queues and Worker Processing",
      "AI Evaluation Harnesses",
      "Stripe Connect and Checkout Integration",
      "Marketplace Workflow Design",
      "SwiftUI iOS/watchOS Prototyping",
      "HealthKit and WatchConnectivity Foundations",
      "Vercel Deployment and Environment Management",
      "Playwright End-to-End Testing",
      "Confidential Device Launch Readiness",
      "Oracle Cloud (OCI) IAM and Operations Support",
      "Authentication, Authorization, and Token Flows",
      "Cloud Service Integration and Deployment Config",
      "Adapting Quickly to New Frontend Frameworks",
      "Product Discovery and Requirement Validation"
    ],
    gaps: [
      "Formal People-Manager Experience",
      "Server Hardware Engineering",
      "Long-Term Production Ownership of Shipped Native iOS/watchOS Apps",
      "Consumer Growth Experimentation",
      "Pure Design/Brand-Led UI Roles"
    ]
  },

  failures: [
    {
      year: 2017,
      title: "Permission Scope Was Too Broad",
      summary:
        "A restricted support tool allowed an associate to accidentally cut a Sev-1 ticket.",
      details:
        "I worked on tooling for outsourced contractor workflows outside the main VPN environment. One workflow had broader permissions than necessary, and a contractor mistakenly created a Sev-1 incident. Even though product requirements did not explicitly call this out, I should have enforced stricter role limits from day one.",
      lessons:
        "Always implement least-privilege access, especially in support tooling where misuse risk is easy to underestimate."
    },
    {
      year: 2019,
      title: "Built the Spec, Then Found a Simpler Solution",
      summary:
        "I spent about six weeks implementing an inherited spec before validating whether it was the simplest way to solve the customer need.",
      details:
        "After joining a new team, I trusted an existing spec too quickly, built a prototype, aligned with partner teams, and drafted a technical design. During review, I was challenged on customer outcomes and realized there was a much simpler approach with less cross-team dependency and faster delivery.",
      lessons:
        "Even with a prewritten spec, verify customer outcomes and alternatives early before committing to implementation depth."
    }
  ],

  faq: [
    {
      question: "Why did you leave Amazon?",
      answer:
        "After ten years at Amazon, I wanted a new challenge in a remote-first setup while staying in Seattle. I was close to a manager path, but flattening and layoffs changed that trajectory. I also wanted to move away from older mobile technology constraints and focus on broader platform/full-stack impact."
    },
    {
      question: "What is your latest manager feedback?",
      answer:
        "Recent feedback highlights strong contributions to the LSAAS product, clear collaboration with auth-z teams, and delivery impact from the API automation platform now adopted by multiple Clinical One teams."
    },
    {
      question: "Do you have high-scale cloud and distributed-systems experience?",
      answer:
        "Yes. I have 10 years at Amazon and current Oracle work, with hands-on AWS experience including IAM, S3, DynamoDB, EC2, SNS, SQS, Lambda, Kinesis, and Redshift. I also have Oracle Cloud Infrastructure experience with IAM application configuration, token minting, auth integration, and operations support."
    },
    {
      question: "What operations or on-call improvements have you led?",
      answer:
        "I handled on-call through Sev-1 incidents for many years and improved rotation design by introducing a primary-to-secondary handoff pattern. The outgoing primary became secondary to finish in-flight issues and provide context, which improved triage speed, continuity, and sprint/vacation planning."
    },
    {
      question: "What are your work preferences?",
      answer:
        "I am strongest as a senior IC in full-cycle ownership roles and prefer remote-first opportunities based in Seattle."
    },
    {
      question: "What is your education?",
      answer:
        "I have a Bachelor of Science in Computer Science from the University of Washington. For fuller education details, LinkedIn is the best reference."
    },
    {
      question: "Can you legally work in the United States?",
      answer:
        "Yes. I am a US citizen and legally authorized to work in the United States."
    },
    {
      question: "What do you do outside work?",
      answer:
        "I lead a home book club, travel with my wife, and enjoy outdoor sports like paragliding, kiteboarding, skiing, climbing, and snowboarding."
    },
    {
      question: "What do you value at work?",
      answer:
        "I value honest, healthy, and friendly working relationships. I prefer building new ideas and modern systems over maintaining very old codebases. I also enjoy team outings and strong team connection."
    },
    {
      question: "How do you use AI at work?",
      answer:
        "Since 2025, I have used Codex and Anthropic Claude heavily across planning, implementation, debugging, refactoring, testing, and documentation. I also teach teammates how to use AI effectively so they can deliver faster and work more independently."
    },
    {
      question: "Have you built AI apps or chatbots yourself?",
      answer:
        "Yes. This portfolio is itself an AI-enabled application: it has an OpenAI-backed resume chatbot, structured job-description fit analyzer, prompt guardrails to avoid overselling, optional Supabase chat-history persistence, and a public GitHub-ready Next.js implementation. I am also building FirstTrace, an open-source AI developer tool that localizes bugs using read-only repository evidence, citations, evals, and Slack/GitHub/Supabase integration paths."
    },
    {
      question: "Have you built AI agents or developer tooling?",
      answer:
        "Yes. FirstTrace is the clearest example: it is an open-source developer tool with deterministic evidence search, optional OpenAI reasoning over bounded repository evidence, citations, evals, Slack Events handling, GitHub App repository access, queues, and worker execution. I would describe it as an evidence-grounded bug-localization agent/tooling project, not a production SaaS with customer adoption."
    },
    {
      question: "What is FirstTrace?",
      answer:
        "FirstTrace is my open-source developer-tooling project for self-hosted bug localization. It turns vague bug reports from CLI, Slack, or API input into cited investigation trails across code, docs, commits, ownership, and issue context. It is a real working project, but I describe it as a current open-source build, not as a production SaaS with customer adoption."
    },
    {
      question: "Any personal long-term goals outside software?",
      answer:
        "I know cars and RVs well, and my practical long-term dream is to open an RV shop. My aspirational dream is to influence feature direction at a major car company."
    }
  ],

  systemPrompt: `You are helping hiring managers evaluate Artem Tarasenko as a candidate.

CORE INSTRUCTIONS:
- Be specific. Use real details from his Oracle and Amazon work, not generic language.
- Be honest about gaps. If he does not have a skill, say so directly.
- When assessing fit, include where he is NOT the right choice.
- Do not oversell. Confidence should come from evidence.
- Tone should be balanced and evidence-based, not pessimistic.

WHAT ARTEM WANTS YOU TO KNOW:
- He is open to Senior+ full-stack/platform roles
- He is strongest in practical engineering execution, platform reliability, and test automation
- He values ownership from design through production adoption
- He is not pursuing a people-manager track right now
- Baseline facts: 12+ years total experience, including 10 years at Amazon and current Oracle work
- Education: Bachelor of Science in Computer Science from the University of Washington
- Work authorization: US citizen; legally authorized to work in the United States
- He has hands-on AWS experience with IAM, S3, DynamoDB, EC2, SNS, SQS, Lambda, Kinesis, and Redshift
- He has hands-on Oracle Cloud Infrastructure (OCI) experience with IAM application configuration, token minting, authentication/authorization integration, and operations support
- He has operated production systems through on-call rotations and Sev-1 handling
- Amazon and Oracle are both high-scale environments; do not claim otherwise
- He values healthy, friendly, and honest team culture
- He actively uses and teaches AI-assisted development for faster, more independent execution
- Since 2025, he has used Codex and Anthropic Claude heavily for planning, implementation, debugging, refactoring, testing, and documentation
- He built this AI resume project end-to-end as an OpenAI-backed chatbot and structured JD fit analyzer
- He is building FirstTrace, an open-source, self-hosted bug-localization developer tool with a TypeScript CLI, read-only repository investigation, deterministic evidence search, optional OpenAI reasoning, citations, evals, Slack Events handling, GitHub App repository access, Supabase/filesystem queues, Vercel-compatible receivers, and worker execution
- When discussing FirstTrace, describe it as a real working open-source project, not as a production SaaS with customer adoption
- He is also building a personal SwiftUI iOS/watchOS paragliding app with HealthKit, WatchConnectivity, local persistence, simulator telemetry, and flight-segmentation tests
- He has practical experience integrating LLMs into app and developer-tooling workflows, including prompt guardrails, structured outputs, citations, evals, and chat UX
- If asked about personality, reflect that he is humorous, social, and curious
- If asked about failures or mistakes, use the explicit failure examples in the profile. Do not invent new failure stories.
- If asked for unrelated help, redirect back to Artem's resume, experience, projects, strengths, gaps, or role fit.

FIT EVALUATION GUARDRAILS:
- Do not incorrectly claim insufficient years if a role asks for <=12 years.
- Do not claim lack of high-scale background.
- If there is a mismatch, anchor it to a concrete requirement he truly lacks.

CONFIDENTIALITY CONSTRAINT:
- For AI Intelligence details, stay abstract and non-confidential
- Use safe wording: building AI solutions for pharmaceutical workflows via Clinical One portal
- Do not reveal internal sensitive implementation details

HOW TO HANDLE COMMON QUESTIONS:
- "Is he a good fit for X?" -> Match role requirements to his actual experience and call out gaps clearly.
- "What should I ask in an interview?" -> Propose questions that test decision quality, ownership, and tradeoff thinking.
- "Tell me about his biggest failure" -> Share his real examples directly and explain what changed afterward.

WHAT HE EXPLICITLY DOESN'T WANT:
- Do not imply experience he does not have
- Do not hide meaningful gaps
- Do not claim he is open to every role type`,
};

export const demoResponses = {
  default: `Yes, this can be a strong fit depending on what you need most.

At Oracle, I inherited a legacy VM-based testing framework that had reliability and usability issues. I wrote a design proposal for replacement, then co-built the new platform before taking full ownership when my co-lead exited.

I led the Java execution engine and delivery path to production: CLI-compatible runs, JSON-based tests, live execution visibility, and migration support from legacy test formats. Beyond shipping, I handled production adoption with documentation, training, and ownership transfer.

If your team needs someone who can stabilize tooling, replace brittle systems, and drive adoption across teams, this is directly in my lane.

Gap to probe: if the role is deeply focused on consumer growth experimentation, that is not where I am strongest.`,

  costReduction: `The biggest win here was adoption and operational effectiveness, not just code delivery. After building the Test Automation Studio and Engine, I documented the framework thoroughly, created a dedicated support channel, and trained users plus new tool owners. That moved the platform from a promising project to production usage across multiple Clinical One service teams. Feedback centered on faster test execution, clearer error signals, and easier failure diagnosis versus the legacy approach.`,

  failure: `One useful failure was in 2019 when I implemented an inherited spec too literally.

I spent around six weeks building a prototype, working with partner teams, and drafting a technical design. During review, I was challenged on whether I had validated the customer outcome enough. That exposed a simpler approach that was faster and less complex.

My takeaway: even if a spec exists, I now validate customer intent and alternatives early before investing deeply in implementation.`,

  leadership: `My leadership style is ownership-first and hands-on.

At Oracle, I took full ownership of a critical framework replacement after my initial co-lead left, and drove it to production. After that, I focused on adoption by writing docs, training users, and onboarding new owners so the system stayed healthy beyond me.

I also mentor engineers directly, especially on architecture tradeoffs, implementation clarity, and practical delivery habits. I prefer technical leadership as an IC rather than a formal manager role.`,

  lsIntelligence: `I can share this at a high level due to confidentiality boundaries.

I am building AI solutions for pharmaceutical workflows through the Clinical One portal. The work includes secure user-management capabilities, stronger authorization/data integrity integrations, and end-user workflow pages that make trial-related information easier to navigate.

I can discuss architecture and delivery approach, but I avoid exposing sensitive internal details.`
};

export const fitAssessments = {
  strong: {
    verdict: "strong" as const,
    title: "Strong Fit - Let's Talk",
    summary: "Your requirements align well with my recent experience. Here is concrete evidence:",
    matches: [
      {
        requirement: "Platform and tooling modernization",
        evidence:
          "At Oracle, I led replacement of a legacy VM-based testing framework and drove the new platform through production rollout and team adoption."
      },
      {
        requirement: "Full-stack plus backend depth",
        evidence:
          "I have long-running full-stack delivery across Amazon domains and deep backend/API execution, including Java execution engine ownership at Oracle."
      },
      {
        requirement: "Cross-team execution and enablement",
        evidence:
          "I partnered across teams, produced production documentation, trained users and new owners, and supported adoption beyond initial launch."
      }
    ],
    gaps: [
      {
        area: "Consumer growth specialization",
        note:
          "My track record is enterprise/platform and internal product workflows, not consumer growth experimentation ownership."
      }
    ],
    recommendation:
      "If you need a senior IC who can own delivery from design to production adoption in complex enterprise environments, I can add value quickly."
  },
  weak: {
    verdict: "weak" as const,
    title: "Honest Assessment - Probably Not Your Person",
    summary: "I want to be direct about where this would be a mismatch:",
    mismatches: [
      {
        requirement: "Deep mobile product development",
        reality:
          "I do not have deep production native mobile ownership yet. I am building a SwiftUI iOS/watchOS paragliding app with HealthKit and WatchConnectivity, and I have some Kindle Scribe launch/device-readiness experience, but my main background is full-stack web, backend systems, platform workflows, and production operations."
      },
      {
        requirement: "Consumer growth experimentation ownership",
        reality:
          "I have not owned consumer growth metrics or A/B experimentation programs as a primary function."
      },
      {
        requirement: "Brand/design-led product role",
        reality:
          "My strengths are engineering architecture and delivery, not pure brand/design-led product execution."
      }
    ],
    whatTransfers:
      "Strong engineering fundamentals, platform thinking, API/system design, and cross-team execution still transfer broadly.",
    recommendation:
      "If this role is heavily consumer mobile and growth-led, you likely want someone with direct ownership in those domains."
  }
};
