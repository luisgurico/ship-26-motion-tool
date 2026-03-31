import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText } from "../elements/AnimatedText";
import { fadeIn } from "@/lib/animations";

interface TitleRevealProps {
  eventName: string;
  tagline: string;
  textColor: string;
  accentColor: string;
}

export const TitleReveal: React.FC<TitleRevealProps> = ({
  eventName,
  tagline,
  textColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isPortrait = height > width;

  const lineWidth = fadeIn(frame, 10, 20) * (isPortrait ? 200 : 300);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: isPortrait ? "80px 60px" : "60px 120px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isPortrait ? 30 : 20,
        }}
      >
        <AnimatedText
          text={eventName}
          delay={5}
          animation="fadeSlide"
          style={{
            fontSize: isPortrait ? 72 : 96,
            fontWeight: 800,
            color: textColor,
            letterSpacing: "-0.02em",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        />
        <div
          style={{
            width: lineWidth,
            height: 3,
            backgroundColor: accentColor,
            borderRadius: 2,
          }}
        />
        <AnimatedText
          text={tagline}
          delay={15}
          animation="fade"
          style={{
            fontSize: isPortrait ? 28 : 32,
            fontWeight: 400,
            color: accentColor,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
