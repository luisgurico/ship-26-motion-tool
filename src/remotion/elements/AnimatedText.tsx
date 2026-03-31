import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn, slideUp, scaleIn } from "@/lib/animations";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
  animation?: "fade" | "slideUp" | "scale" | "fadeSlide";
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  style,
  className,
  animation = "fadeSlide",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let opacity = 1;
  let translateY = 0;
  let scale = 1;

  switch (animation) {
    case "fade":
      opacity = fadeIn(frame, delay);
      break;
    case "slideUp":
      translateY = slideUp(frame, delay);
      opacity = fadeIn(frame, delay);
      break;
    case "scale":
      scale = scaleIn(frame, fps, delay);
      opacity = fadeIn(frame, delay, 10);
      break;
    case "fadeSlide":
    default:
      opacity = fadeIn(frame, delay);
      translateY = slideUp(frame, delay, 30);
      break;
  }

  return (
    <div
      className={className}
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
