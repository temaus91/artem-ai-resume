// Artem Tarasenko profile data - core content for portfolio display and demo AI responses.

export const artemProfile = {
  name: "Artem Tarasenko",
  title: "Senior Software Engineer",
  subtitle:
    "Full-stack engineering for enterprise platforms, test automation, and AI-enabled healthcare workflows",
  location: "Seattle Area",
  status: "Open to Senior+ full-stack/platform roles (remote-first)",
  companies: ["Oracle", "Amazon"],
  yearsExperience: "12+ years of software engineering experience",
  linkedinUrl: "https://www.linkedin.com/in/artem-tarasenko-seattle",
  githubUrl: "https://github.com/temaus91",
  email: "temaus91@gmail.com",

  summary: `I build reliable full-stack and backend systems at enterprise scale across Oracle and Amazon.
I have 12+ years of experience, including 10 years at Amazon across high-scale product and platform teams, and current work at Oracle on AI-enabled healthcare workflows.
I focus on high-impact, problem-first execution: replacing brittle systems, improving developer workflows, and shipping practical solutions end-to-end.
I mentor engineers, communicate directly, and use AI development tools across planning, implementation, testing, and documentation.
I value friendly, honest working relationships and bring humor, curiosity, and strong ownership to teams.`,

  awsServices: ["IAM", "S3", "DynamoDB", "EC2", "SNS", "SQS", "Lambda"],
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
    "Limited direct device experience (Kindle-focused)",
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

  experience: [
    {
      company: "Oracle",
      role: "Senior Software Engineer, Full Stack (Clinical One - AI / Life Sciences)",
      period: "2024-Present",
      highlights: [
        "Led replacement of a legacy VM-based test framework with a production-ready cross-platform Test Automation Studio and execution engine",
        "Owned core Java execution logic, CLI compatibility, JSON-based tests, live execution visibility, and Excel-to-JSON migration paths",
        "Drove production adoption through documentation, training, and support; tool is now used by multiple Clinical One service teams with positive usability feedback",
        "Building AI Intelligence capabilities on Clinical One for large pharmaceutical comapnies, including user-management APIs and secure auth integration",
        "Delivered core full-stack workflows for trial-related pages and user journeys while maintaining confidentiality boundaries"
      ],
      aiContext: {
        situation:
          "After onboarding at Oracle, I identified major reliability and usability gaps in the existing AI testing toolchain. The platform needed a maintainable replacement that teams could adopt quickly.",
        approach:
          "I wrote a technical design proposing a full replacement. Initially I co-led implementation with a principal engineer (UI ownership split), then took full ownership when he left and drove delivery to production.",
        technicalWork:
          "I led the Java logic and execution engine architecture, added CLI-compatible execution, JSON test definitions, run-time observability, and migration support from Excel-based suites. I later transferred ownership through docs, enablement sessions, and a dedicated support channel. In parallel, I contributed to AI Intelligence with secure user-management APIs, auth integration, and end-user workflow pages in Clinical One.",
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
        "Hands-on with AWS services including IAM, S3, DynamoDB, EC2, SNS, SQS, and Lambda; operated systems through regular on-call up to Sev-1 incidents"
      ],
      aiContext: {
        situation:
          "I worked across multiple Amazon organizations over ten years, each with different customer needs, scale requirements, and operational constraints.",
        approach:
          "My approach was to ramp quickly, dive deep into root causes, and deliver practical solutions end-to-end while balancing reliability and speed.",
        technicalWork:
          "I shipped APIs, backend services, and full-stack features across seller systems, HR workflows, fraud prevention tooling, and Kindle content platforms. I regularly worked with AWS cloud services and security primitives, handled production deployments, and participated in primary/secondary on-call rotations.",
        lessonsLearned:
          "Strong execution at scale requires clear ownership through the full lifecycle: design, implementation, deployment, on-call operations, and continuous improvement."
      }
    }
  ],

  skills: {
    strong: [
      "High-Scale Distributed Systems",
      "Full-Stack Engineering",
      "Java / Backend API Development",
      "AWS Cloud-Native Development",
      "Test Automation Architecture",
      "Execution Engine Design",
      "On-Call Operations and Incident Handling",
      "Cross-Team Delivery",
      "Mentoring and Knowledge Transfer"
    ],
    moderate: [
      "AI Feature Integration",
      "Cloud-Native Networking Patterns",
      "AuthN/AuthZ Integrations",
      "Frontend Framework Ramp-Up (including Oracle JET)",
      "Product Discovery and Requirement Validation"
    ],
    gaps: [
      "Formal People-Manager Experience",
      "Server Hardware Engineering",
      "Native Mobile Development",
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
        "Yes. I have 10 years at Amazon and current Oracle work, with hands-on AWS experience including IAM, S3, DynamoDB, EC2, SNS, SQS, and Lambda, plus regular on-call and production operations."
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
        "I use AI throughout planning, implementation, testing, and documentation. I also teach teammates how to use AI effectively so they can deliver faster and work more independently."
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
- He has hands-on AWS experience with IAM, S3, DynamoDB, EC2, SNS, SQS, and Lambda
- He has operated production systems through on-call rotations and Sev-1 handling
- Amazon and Oracle are both high-scale environments; do not claim otherwise
- He values healthy, friendly, and honest team culture
- He actively uses and teaches AI-assisted development for faster, more independent execution
- If asked about personality, reflect that he is humorous, social, and curious

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
          "I do not have native mobile development depth. My background is primarily full-stack web and backend systems."
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
