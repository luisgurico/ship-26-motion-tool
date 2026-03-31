import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { AnimatedText } from "../elements/AnimatedText";
import { ImageReveal } from "../elements/ImageReveal";

interface SpeakerCardProps {
  speakerName: string;
  speakerTitle: string;
  speakerImage: string;
  textColor: string;
  secondaryColor: string;
  accentColor: string;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({
  speakerName,
  speakerTitle,
  speakerImage,
  textColor,
  secondaryColor,
  accentColor,
}) => {
  const { width, height } = useVideoConfig();
  const isPortrait = height > width;
  const imageSize = isPortrait ? 240 : 180;

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
        {speakerImage && (
          <ImageReveal
            src={speakerImage}
            delay={0}
            width={imageSize}
            height={imageSize}
            style={{
              border: `3px solid ${accentColor}`,
            }}
          />
        )}
        <AnimatedText
          text={speakerName}
          delay={10}
          animation="fadeSlide"
          style={{
            fontSize: isPortrait ? 44 : 52,
            fontWeight: 700,
            color: textColor,
          }}
        />
        <AnimatedText
          text={speakerTitle}
          delay={18}
          animation="fade"
          style={{
            fontSize: isPortrait ? 22 : 26,
            fontWeight: 400,
            color: secondaryColor,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
