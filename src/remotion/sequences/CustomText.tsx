import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { AnimatedText } from "../elements/AnimatedText";

interface CustomTextProps {
  heading: string;
  body: string;
  textColor: string;
  secondaryColor: string;
}

export const CustomText: React.FC<CustomTextProps> = ({
  heading,
  body,
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
          maxWidth: isPortrait ? "90%" : "70%",
        }}
      >
        <AnimatedText
          text={heading}
          delay={5}
          style={{
            fontSize: isPortrait ? 48 : 64,
            fontWeight: 700,
            color: textColor,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        />
        {body && (
          <AnimatedText
            text={body}
            delay={15}
            style={{
              fontSize: isPortrait ? 22 : 26,
              fontWeight: 400,
              color: secondaryColor,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
