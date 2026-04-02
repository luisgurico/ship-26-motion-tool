import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { SocialPromoProps } from "./schemas";
import type { TextBox } from "@/types";
import { AnimatedText } from "../elements/AnimatedText";
import { loadProjectFonts } from "@/lib/fonts";

loadProjectFonts();

function getTransformOrigin(justification: string): string {
  switch (justification) {
    case "left": return "0% 50%";
    case "right": return "100% 50%";
    default: return "50% 50%";
  }
}

function getTranslate(justification: string): string {
  switch (justification) {
    case "left": return "translateY(-100%)";
    case "right": return "translate(-100%, -100%)";
    default: return "translate(-50%, -100%)";
  }
}

const TitleCard: React.FC<{
  textBoxes: TextBox[];
  durationInFrames: number;
  textAnimationDuration: number;
}> = ({ textBoxes, durationInFrames, textAnimationDuration }) => {
  const { width, height } = useVideoConfig();

  const inDelay = 0;
  const outDelay = durationInFrames - textAnimationDuration;

  return (
    <AbsoluteFill>
      {textBoxes.map((tb) => {
        const leftPx = (tb.xPercent / 100) * width;
        const topPx = (tb.yPercent / 100) * height;
        return (
          <div
            key={tb.id}
            style={{
              position: "absolute",
              left: leftPx,
              top: topPx,
              transform: getTranslate(tb.justification),
            }}
          >
            <AnimatedText
              text={tb.content}
              delay={inDelay}
              outDelay={outDelay}
              duration={textAnimationDuration}
              style={{
                fontSize: tb.fontSize,
                fontWeight: tb.fontWeight,
                fontFamily: `'${tb.fontFamily}', monospace`,
                color: "#ffffff",
                letterSpacing: `${tb.letterSpacing}em`,
                textAlign: tb.justification,
                lineHeight: 1.1,
                whiteSpace: "pre",
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const SocialPromo: React.FC<SocialPromoProps> = ({
  screens,
  textAnimationDuration = 15,
  screenGap = 0,
}) => {
  const screenStarts: number[] = [];
  let currentStart = 0;
  for (let i = 0; i < screens.length; i++) {
    screenStarts.push(currentStart);
    if (i < screens.length - 1) {
      currentStart += screens[i].durationInFrames + screenGap;
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {screens.map((screen, i) => (
        <Sequence
          key={screen.id}
          from={screenStarts[i]}
          durationInFrames={screen.durationInFrames}
        >
          <TitleCard
            textBoxes={screen.textBoxes}
            durationInFrames={screen.durationInFrames}
            textAnimationDuration={textAnimationDuration}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
