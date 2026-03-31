import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { AnimatedText } from "../elements/AnimatedText";

interface EventDetailsProps {
  date: string;
  location: string;
  textColor: string;
  secondaryColor: string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  date,
  location,
  textColor,
  secondaryColor,
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
          gap: isPortrait ? 24 : 16,
        }}
      >
        <AnimatedText
          text={date}
          delay={5}
          animation="fadeSlide"
          style={{
            fontSize: isPortrait ? 48 : 64,
            fontWeight: 700,
            color: textColor,
            letterSpacing: "-0.01em",
          }}
        />
        <AnimatedText
          text={location}
          delay={15}
          animation="fade"
          style={{
            fontSize: isPortrait ? 24 : 28,
            fontWeight: 400,
            color: secondaryColor,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
