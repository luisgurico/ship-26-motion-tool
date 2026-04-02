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

const imageSchema = z.object({
  id: z.string(),
  src: z.string(),
  xPercent: z.number().min(0).max(100),
  yPercent: z.number().min(0).max(100),
  scalePercent: z.number().min(1).max(100),
});

const lottieSchema = z.object({
  id: z.string(),
  src: z.string(),
  xPercent: z.number().min(0).max(100),
  yPercent: z.number().min(0).max(100),
  scalePercent: z.number().min(1).max(100),
  loop: z.boolean().default(true),
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
