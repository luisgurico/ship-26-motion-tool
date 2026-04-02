import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { AnimatedText } from "../elements/AnimatedText";
import { ImageReveal } from "../elements/ImageReveal";

interface LogoRevealProps {
  logoImage: string;
  tagline: string;
  textColor: string;
  accentColor: string;
}

export const LogoReveal: React.FC<LogoRevealProps> = ({
  logoImage,
  tagline,
  textColor,
  accentColor,
}) => {
  const { width, height } = useVideoConfig();
  const isPortrait = height > width;
  const logoSize = isPortrait ? 240 : 200;

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
          gap: isPortrait ? 30 : 24,
        }}
      >
        {logoImage ? (
          <ImageReveal
            src={logoImage}
            delay={0}
            width={logoSize}
            height={logoSize}
            borderRadius={0}
          />
        ) : (
          <div
            style={{
              width: logoSize,
              height: logoSize,
              border: `2px dashed ${accentColor}44`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: `${textColor}44`,
              fontSize: 14,
              fontFamily: "monospace",
            }}
          >
            logo
          </div>
        )}
        {tagline && (
          <AnimatedText
            text={tagline}
            delay={15}
            style={{
              fontSize: isPortrait ? 24 : 28,
              fontWeight: 400,
              color: accentColor,
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
