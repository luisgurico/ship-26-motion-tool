import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText } from "../elements/AnimatedText";
import { fadeIn, scaleIn } from "@/lib/animations";

interface CallToActionProps {
  ctaText: string;
  ctaUrl: string;
  eventName: string;
  textColor: string;
  accentColor: string;
  backgroundColor: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  ctaText,
  ctaUrl,
  eventName,
  textColor,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;

  const buttonScale = scaleIn(frame, fps, 15);
  const buttonOpacity = fadeIn(frame, 15, 15);

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
          gap: isPortrait ? 40 : 32,
        }}
      >
        <AnimatedText
          text={eventName}
          delay={0}
          animation="fade"
          style={{
            fontSize: isPortrait ? 36 : 44,
            fontWeight: 700,
            color: textColor,
          }}
        />
        <div
          style={{
            opacity: buttonOpacity,
            transform: `scale(${buttonScale})`,
            backgroundColor: accentColor,
            color: backgroundColor,
            padding: isPortrait ? "20px 48px" : "16px 40px",
            borderRadius: 8,
            fontSize: isPortrait ? 24 : 28,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {ctaText}
        </div>
        {ctaUrl && (
          <AnimatedText
            text={ctaUrl.replace(/^https?:\/\//, "")}
            delay={25}
            animation="fade"
            style={{
              fontSize: isPortrait ? 18 : 20,
              color: `${textColor}88`,
              fontFamily: "monospace",
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
