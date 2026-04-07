export type TextJustification = "left" | "center" | "right";

export interface TextBox {
  id: string;
  content: string;
  xPercent: number;
  yPercent: number;
  justification: TextJustification;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  letterSpacing: number;
}

export interface ImageElement {
  id: string;
  src: string;
  xPercent: number;
  yPercent: number;
  scalePercent: number;
}

export interface LottieElement {
  id: string;
  src: string;
  xPercent: number;
  yPercent: number;
  scalePercent: number;
  loop: boolean;
}

export interface Screen {
  id: string;
  name: string;
  textBoxes: TextBox[];
  images: ImageElement[];
  lotties: LottieElement[];
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

export function createTextBox(content = "Text", xPercent = 50, yPercent = 50): TextBox {
  return {
    id: crypto.randomUUID(),
    content,
    xPercent,
    yPercent,
    justification: "center",
    fontSize: 88,
    fontWeight: 400,
    fontFamily: "Geist Mono",
    letterSpacing: -0.02,
  };
}

export function createImageElement(src = "/img/Speaker Image.png"): ImageElement {
  return {
    id: crypto.randomUUID(),
    src,
    xPercent: 50,
    yPercent: 50,
    scalePercent: 30,
  };
}

export function createLottieElement(src = "/lottie/test-v2.json"): LottieElement {
  return {
    id: crypto.randomUUID(),
    src,
    xPercent: 50,
    yPercent: 50,
    scalePercent: 40,
    loop: false,
  };
}

export function createScreen(name = "New Screen", content = "Text"): Screen {
  return {
    id: crypto.randomUUID(),
    name,
    textBoxes: [createTextBox(content)],
    images: [],
    lotties: [],
    durationInFrames: 75,
  };
}

export const DEFAULT_SCREENS: Screen[] = [
  { id: "1", name: "Intro", textBoxes: [], images: [], lotties: [{ id: "1l", src: "/lottie/test-v2.json", xPercent: 50, yPercent: 50, scalePercent: 40, loop: false }], durationInFrames: 75 },
  { id: "2", name: "Tagline", textBoxes: [{ id: "2a", content: "SHIP WHAT\u2019S NEXT\nLEARN TO BUILD, DEPLOY,\nAND SCALE YOUR AGENTS.\nVERCEL.COM/SHIP", xPercent: 8.3, yPercent: 79.9, justification: "left", fontSize: 36, fontWeight: 400, fontFamily: "Geist Mono", letterSpacing: -0.01 }, { id: "2b", content: "[OK] 17.26\n[OK] OUTERNET\n[OK] LDN\n[OK] W1 3DJ", xPercent: 67.2, yPercent: 79.9, justification: "left", fontSize: 36, fontWeight: 400, fontFamily: "Geist Mono", letterSpacing: -0.01 }], images: [], lotties: [], durationInFrames: 75 },
  { id: "3", name: "Speaker", textBoxes: [{ id: "3a", content: "GUILLERMO RAUCH\nFOUNDER, VERCEL", xPercent: 8.3, yPercent: 82, justification: "left", fontSize: 36, fontWeight: 400, fontFamily: "Geist Mono", letterSpacing: -0.01 }], images: [{ id: "3img", src: "/img/guillermo-rauch.png", xPercent: 50, yPercent: 45, scalePercent: 78 }], lotties: [], durationInFrames: 75 },
  { id: "4", name: "URL", textBoxes: [{ id: "4a", content: "vercel.com/ship", xPercent: 50, yPercent: 50, justification: "center", fontSize: 88, fontWeight: 400, fontFamily: "Geist Mono", letterSpacing: -0.02 }], images: [], lotties: [], durationInFrames: 75 },
  { id: "5", name: "Outro", textBoxes: [{ id: "5a", content: "Ship 26", xPercent: 50, yPercent: 50, justification: "center", fontSize: 88, fontWeight: 400, fontFamily: "Geist Mono", letterSpacing: -0.02 }], images: [], lotties: [], durationInFrames: 75 },
];

export interface GeneralConfig {
  gridSize: number;
  snapEnabled: boolean;
}

export const DEFAULT_GENERAL_CONFIG: GeneralConfig = {
  gridSize: 20,
  snapEnabled: false,
};

export interface DevConfig {
  textAnimationDuration: number;
  screenGap: number;
}

export const DEFAULT_DEV_CONFIG: DevConfig = {
  textAnimationDuration: 15,
  screenGap: 0,
};

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
