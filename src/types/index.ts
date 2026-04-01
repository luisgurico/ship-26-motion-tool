export interface Screen {
  id: string;
  name: string;
  content: string;
  durationInFrames: number;
}

export interface StyleConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  patternStyle: "dots" | "grid" | "lines" | "waves" | "none";
  transitionSpeed: number;
}

export function createScreen(name = "New Screen", content = "Text"): Screen {
  return {
    id: crypto.randomUUID(),
    name,
    content,
    durationInFrames: 75,
  };
}

export const DEFAULT_SCREENS: Screen[] = [
  { id: "1", name: "Intro", content: "Ship 26", durationInFrames: 75 },
  { id: "2", name: "Tagline", content: "Ship what's next", durationInFrames: 75 },
  { id: "3", name: "Location", content: "London", durationInFrames: 75 },
  { id: "4", name: "URL", content: "vercel.com/ship", durationInFrames: 75 },
  { id: "5", name: "Outro", content: "Ship 26", durationInFrames: 75 },
];

export const DEFAULT_STYLE: StyleConfig = {
  primaryColor: "#ffffff",
  secondaryColor: "#a1a1aa",
  backgroundColor: "#09090b",
  textColor: "#fafafa",
  accentColor: "#3b82f6",
  fontFamily: "Inter",
  patternStyle: "grid",
  transitionSpeed: 1,
};
