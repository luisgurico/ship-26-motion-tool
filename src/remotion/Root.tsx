import React from "react";
import { Composition } from "remotion";
import { SocialPromo } from "./compositions/SocialPromo";
import { socialPromoSchema } from "./compositions/schemas";
import { VIDEO_FORMATS, DEFAULT_FPS } from "@/lib/formats";
import { DEFAULT_SCREENS, DEFAULT_STYLE, DEFAULT_DEV_CONFIG } from "@/types";

export const RemotionRoot: React.FC = () => {
  const totalDuration = DEFAULT_SCREENS.reduce(
    (sum, s) => sum + s.durationInFrames,
    0
  );

  const defaultProps = {
    screens: DEFAULT_SCREENS,
    ...DEFAULT_STYLE,
    ...DEFAULT_DEV_CONFIG,
  };

  return (
    <>
      {(
        Object.entries(VIDEO_FORMATS) as [
          keyof typeof VIDEO_FORMATS,
          (typeof VIDEO_FORMATS)[keyof typeof VIDEO_FORMATS],
        ][]
      ).map(([key, format]) => (
        <Composition
          key={key}
          id={`SocialPromo-${key}`}
          component={SocialPromo}
          durationInFrames={totalDuration}
          fps={DEFAULT_FPS}
          width={format.width}
          height={format.height}
          schema={socialPromoSchema}
          defaultProps={defaultProps}
        />
      ))}
    </>
  );
};
