// All site copy lives here, separate from layout and motion.

export const site = {
  name: "Studio Galaxy",
  domain: "studiogalaxy.org",
  email: "hello@studiogalaxy.org",
  tagline: "Digital products · Experiences · Intelligent systems",
};

export const nav = [
  { label: "Projects", href: "/projects/flipbook" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "About", href: "/#approach" },
  { label: "Contact", href: "/#contact" },
];

export const idea = [
  "You have an idea.",
  "Maybe it's an app.",
  "Maybe it's a website.",
  "Maybe it's something that doesn't exist yet.",
  "That's where we come in.",
];

export const process = [
  { word: "Idea", note: "A single point." },
  { word: "Design", note: "The point finds its form." },
  { word: "Engineering", note: "Form becomes structure." },
  { word: "Intelligence", note: "Structure starts to think." },
  { word: "Experience", note: "Everything, in someone's hands." },
];

export const create = [
  { verb: "We design", line: "Interfaces people want to use." },
  { verb: "We engineer", line: "Systems built to actually work." },
  { verb: "We create", line: "Experiences that feel alive." },
  { verb: "We automate", line: "Work that shouldn't need to be repeated." },
] as const;

export const possibilities = [
  "A product people remember.",
  "An experience that scales.",
  "Technology that works for you.",
  "Something people don't expect.",
];

// [lead, key word] — the key word acts out its verb on screen
export const approach: [string, string][] = [
  ["We start with the", "problem"],
  ["We understand the", "experience"],
  ["We design the", "system"],
  ["We build the", "technology"],
  ["We refine every", "detail"],
];

export const capabilities = [
  { group: "Design", items: ["Product Design", "UI / UX", "Design Systems", "Motion & Interaction"] },
  { group: "Engineering", items: ["Web", "Mobile", "Backend", "Cloud"] },
  { group: "Intelligence", items: ["AI", "Automation", "Agents", "Data"] },
  { group: "Experimentation", items: ["Creative Technology", "3D", "Interactive Experiences", "Custom Engines"] },
];

export const galaxy = [
  "Everything starts with a point.",
  "An idea.",
  "A system.",
  "An experience.",
];

// The brochure flipbook (/projects/flipbook). Pages are zero-based.
export const brochure = {
  url: "/projects/flipbook/studio-galaxy-brochure.pdf",
  pageAspect: 210 / 297, // A4 portrait: the reader's window is sized to the pages exactly
  darkPages: [0, 2, 7, 11],
  chapters: [
    { title: "Cover", from: 0, line: "A field guide to working with us." },
    { title: "Contents", from: 1, line: "Everything inside, at a glance." },
    { title: "Who we are", from: 2, line: "Designers and engineers, in one room." },
    { title: "What we do", from: 3, line: "Four disciplines, one team." },
    { title: "How a project runs", from: 5, line: "From first call to launch — and after." },
    { title: "Working together", from: 6, line: "Pick the shape that fits." },
    { title: "What to expect", from: 7, line: "Our promises, in writing." },
    { title: "Made in the studio", from: 8, line: "You’re holding one of our products." },
    { title: "Questions", from: 9, line: "The things people usually ask." },
    { title: "Start a project", from: 10, line: "Starting is simple." },
    { title: "Back cover", from: 11, line: "Let’s build something worth experiencing." },
  ],
};
