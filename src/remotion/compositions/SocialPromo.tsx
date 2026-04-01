import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import type { SocialPromoProps } from "./schemas";
import { AnimatedText } from "../elements/AnimatedText";
import { fadeTransition, slideTransition } from "../transitions/presets";
import { loadProjectFonts } from "@/lib/fonts";

loadProjectFonts();

const TitleCard: React.FC<{ content: string }> = ({ content }) => {
  const { width, height } = useVideoConfig();
  const isPortrait = height > width;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
      }}
    >
      <AnimatedText
        text={content}
        delay={5}
        animation="fadeSlide"
        style={{
          fontSize: isPortrait ? 64 : 88,
          fontWeight: 400,
          fontFamily: "'Geist Mono', monospace",
          color: "#ffffff",
          letterSpacing: "-0.02em",
          textAlign: "center",
          lineHeight: 1.1,
        }}
      />
    </AbsoluteFill>
  );
};

export const SocialPromo: React.FC<SocialPromoProps> = ({
  screens,
  transitionSpeed,
}) => {
  const transitionDuration = Math.round(15 / transitionSpeed);
  const useSlide = (i: number) => i % 2 === 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <TransitionSeries>
        {screens.map((screen, i) => (
          <React.Fragment key={screen.id}>
            {i > 0 && (
              <TransitionSeries.Transition
                presentation={
                  useSlide(i)
                    ? slideTransition(transitionDuration).presentation
                    : fadeTransition(transitionDuration).presentation
                }
                timing={
                  useSlide(i)
                    ? slideTransition(transitionDuration).timing
                    : fadeTransition(transitionDuration).timing
                }
              />
            )}
            <TransitionSeries.Sequence
              durationInFrames={screen.durationInFrames}
            >
              <TitleCard content={screen.content} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
