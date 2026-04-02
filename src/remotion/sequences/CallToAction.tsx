import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { AnimatedText } from "../elements/AnimatedText";

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
  const { width, height } = useVideoConfig();
  const isPortrait = height > width;

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
          style={{
            fontSize: isPortrait ? 36 : 44,
            fontWeight: 700,
            color: textColor,
          }}
        />
        <div
          style={{
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
