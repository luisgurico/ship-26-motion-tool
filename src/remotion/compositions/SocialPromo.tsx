import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig, Img, staticFile } from "remotion";
import type { SocialPromoProps } from "./schemas";
import type { TextBox, ImageElement, LottieElement as LottieElementType } from "@/types";
import { AnimatedText } from "../elements/AnimatedText";
import { LottieElement } from "../elements/LottieElement";
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
  images: ImageElement[];
  lotties: LottieElementType[];
  durationInFrames: number;
  textAnimationDuration: number;
}> = ({ textBoxes, images, lotties, durationInFrames, textAnimationDuration }) => {
  const { width, height } = useVideoConfig();

  const inDelay = 0;
  const outDelay = durationInFrames - textAnimationDuration;

  return (
    <AbsoluteFill>
      {/* Images */}
      {images.map((img) => {
        const leftPx = (img.xPercent / 100) * width;
        const topPx = (img.yPercent / 100) * height;
        const scale = img.scalePercent ?? (img as any).widthPercent ?? 30;
        const size = (scale / 100) * Math.min(width, height);
        const w = size;
        const h = size;
        const src = img.src.startsWith("http") ? img.src : staticFile(img.src);
        return (
          <div
            key={img.id}
            style={{
              position: "absolute",
              left: leftPx,
              top: topPx,
              width: w,
              height: h,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Img src={src} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        );
      })}

      {/* Lotties */}
      {lotties.map((lt) => {
        const leftPx = (lt.xPercent / 100) * width;
        const topPx = (lt.yPercent / 100) * height;
        const scale = lt.scalePercent ?? (lt as any).widthPercent ?? 40;
        const size = (scale / 100) * Math.min(width, height);
        const w = size;
        const h = size;
        return (
          <div
            key={lt.id}
            style={{
              position: "absolute",
              left: leftPx,
              top: topPx,
              width: w,
              height: h,
              transform: "translate(-50%, -50%)",
            }}
          >
            <LottieElement src={lt.src} loop={lt.loop} />
          </div>
        );
      })}

      {/* Text boxes */}
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
            images={screen.images ?? []}
            lotties={screen.lotties ?? []}
            durationInFrames={screen.durationInFrames}
            textAnimationDuration={textAnimationDuration}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
