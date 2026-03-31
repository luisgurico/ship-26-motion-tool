export const SCREEN_TYPES = [
  "title",
  "event-details",
  "speaker",
  "cta",
  "logo",
  "custom-text",
] as const;

export type ScreenType = (typeof SCREEN_TYPES)[number];

export interface Screen {
  id: string;
  type: ScreenType;
  data: Record<string, string>;
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

export const SCREEN_TYPE_META: Record<
  ScreenType,
  { label: string; icon: string; defaultData: Record<string, string> }
> = {
  title: {
    label: "Title",
    icon: "Type",
    defaultData: { eventName: "Ship 26", tagline: "Build. Ship. Repeat." },
  },
  "event-details": {
    label: "Details",
    icon: "Calendar",
    defaultData: { date: "April 15, 2026", location: "San Francisco, CA" },
  },
  speaker: {
    label: "Speaker",
    icon: "User",
    defaultData: { name: "Jane Doe", title: "CEO & Founder", imageUrl: "" },
  },
  cta: {
    label: "CTA",
    icon: "MousePointerClick",
    defaultData: {
      ctaText: "Register Now",
      ctaUrl: "https://example.com",
      eventName: "Ship 26",
    },
  },
  logo: {
    label: "Logo",
    icon: "Image",
    defaultData: { logoImage: "", tagline: "" },
  },
  "custom-text": {
    label: "Text",
    icon: "FileText",
    defaultData: { heading: "Heading", body: "Body text goes here" },
  },
};

export const SCREEN_FIELDS: Record<
  ScreenType,
  { key: string; label: string; placeholder?: string }[]
> = {
  title: [
    { key: "eventName", label: "Event Name" },
    { key: "tagline", label: "Tagline" },
  ],
  "event-details": [
    { key: "date", label: "Date" },
    { key: "location", label: "Location" },
  ],
  speaker: [
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    { key: "imageUrl", label: "Image", placeholder: "images/speaker.jpg or URL" },
  ],
  cta: [
    { key: "ctaText", label: "CTA Text" },
    { key: "ctaUrl", label: "CTA URL" },
    { key: "eventName", label: "Event Name" },
  ],
  logo: [
    { key: "logoImage", label: "Logo Image", placeholder: "images/logo.png or URL" },
    { key: "tagline", label: "Tagline" },
  ],
  "custom-text": [
    { key: "heading", label: "Heading" },
    { key: "body", label: "Body" },
  ],
};

export function createScreen(type: ScreenType): Screen {
  return {
    id: crypto.randomUUID(),
    type,
    data: { ...SCREEN_TYPE_META[type].defaultData },
    durationInFrames: 75,
  };
}

export const DEFAULT_SCREENS: Screen[] = [
  { id: "1", type: "title", data: { eventName: "Ship 26", tagline: "Build. Ship. Repeat." }, durationInFrames: 75 },
  { id: "2", type: "event-details", data: { date: "April 15, 2026", location: "San Francisco, CA" }, durationInFrames: 75 },
  { id: "3", type: "speaker", data: { name: "Jane Doe", title: "CEO & Founder", imageUrl: "" }, durationInFrames: 75 },
  { id: "4", type: "cta", data: { ctaText: "Register Now", ctaUrl: "https://example.com", eventName: "Ship 26" }, durationInFrames: 75 },
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
