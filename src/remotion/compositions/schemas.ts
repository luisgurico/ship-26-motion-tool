import { z } from "zod";

const textBoxSchema = z.object({
  id: z.string(),
  content: z.string(),
  xPercent: z.number().min(0).max(100),
  yPercent: z.number().min(0).max(100),
  justification: z.enum(["left", "center", "right"]),
  fontSize: z.number().min(12).max(400),
  fontWeight: z.number().min(100).max(900).default(400),
  fontFamily: z.string().default("Geist Mono"),
  letterSpacing: z.number().min(-0.2).max(0.5).default(-0.02),
});

const revealConfigSchema = z.object({
  enabled: z.boolean().default(false),
  direction: z.enum(["in", "out"]).default("in"),
  wipeMode: z.enum(["linear", "random"]).default("linear"),
  minBlockSize: z.number().min(2).max(64).default(4),
  maxBlockSize: z.number().min(16).max(512).default(96),
  sensitivityMin: z.number().min(1).max(100).default(15),
  sensitivityMax: z.number().min(1).max(100).default(60),
  bgCutoff: z.number().min(0).max(80).default(10),
  strokeEnabled: z.boolean().default(true),
  strokeColor: z.string().default("#ffffff"),
  strokeWidthLarge: z.number().min(0).max(1).default(0.3),
  strokeWidthSmall: z.number().min(0).max(1).default(0.05),
  borderEnabled: z.boolean().default(false),
  borderInset: z.number().min(0.5).max(8).default(1),
  noiseScale: z.number().min(10).max(500).default(150),
  noiseSpeed: z.number().min(1).max(100).default(20),
  noiseStrength: z.number().min(100).max(500).default(100),
  noiseSeed: z.number().min(0).max(999).default(42),
  durationInFrames: z.number().min(5).max(300).default(45),
  delayInFrames: z.number().min(0).max(300).default(0),
  softZone: z.number().min(20).max(300).default(100),
  waveGap: z.number().min(20).max(400).default(120),
  overlapPercent: z.number().min(0).max(100).default(30),
});

const imageSchema = z.object({
  id: z.string(),
  src: z.string(),
  xPercent: z.number().min(0).max(100),
  yPercent: z.number().min(0).max(100),
  scalePercent: z.number().min(1).max(100),
  reveal: revealConfigSchema.optional(),
});

const lottieSchema = z.object({
  id: z.string(),
  src: z.string(),
  xPercent: z.number().min(0).max(100),
  yPercent: z.number().min(0).max(100),
  scalePercent: z.number().min(1).max(100),
  loop: z.boolean().default(false),
});

const screenSchema = z.object({
  id: z.string(),
  name: z.string(),
  textBoxes: z.array(textBoxSchema).default([]),
  images: z.array(imageSchema).default([]),
  lotties: z.array(lottieSchema).default([]),
  durationInFrames: z.number().min(15).max(300),
});

export const socialPromoSchema = z.object({
  screens: z.array(screenSchema).default([]),
  primaryColor: z.string().default("#ffffff"),
  secondaryColor: z.string().default("#a1a1aa"),
  backgroundColor: z.string().default("#09090b"),
  textColor: z.string().default("#fafafa"),
  accentColor: z.string().default("#3b82f6"),
  patternStyle: z
    .enum(["dots", "grid", "lines", "waves", "none"])
    .default("grid"),
  transitionSpeed: z.number().min(0.5).max(3).default(1),
  textAnimationDuration: z.number().min(5).max(60).default(15),
  screenGap: z.number().min(-30).max(30).default(0),
});

export type SocialPromoProps = z.infer<typeof socialPromoSchema>;
