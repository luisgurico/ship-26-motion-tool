import { z } from "zod";

const screenSchema = z.object({
  id: z.string(),
  type: z.enum(["title", "event-details", "speaker", "cta", "logo", "custom-text"]),
  data: z.record(z.string(), z.string()),
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
});

export type SocialPromoProps = z.infer<typeof socialPromoSchema>;
