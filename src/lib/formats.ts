export const VIDEO_FORMATS = {
  landscape: {
    width: 1920,
    height: 1080,
    label: "Landscape",
    description: "YouTube, LinkedIn, general",
  },
  portrait: {
    width: 1080,
    height: 1920,
    label: "Portrait",
    description: "Stories, Reels, TikTok",
  },
  square: {
    width: 1080,
    height: 1080,
    label: "Square",
    description: "Instagram Feed, Twitter",
  },
} as const;

export type VideoFormatKey = keyof typeof VIDEO_FORMATS;

export const DEFAULT_FPS = 30;
export const DEFAULT_DURATION_SECONDS = 10;
export const DEFAULT_DURATION_FRAMES = DEFAULT_FPS * DEFAULT_DURATION_SECONDS;
