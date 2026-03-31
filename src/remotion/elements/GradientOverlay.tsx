import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn } from "@/lib/animations";

interface GradientOverlayProps {
  colors: string[];
  direction?: string;
  delay?: number;
  opacity?: number;
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({
  colors,
  direction = "to bottom right",
  delay = 0,
  opacity: maxOpacity = 0.3,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, delay, 30) * maxOpacity;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        background: `linear-gradient(${direction}, ${colors.join(", ")})`,
      }}
    />
  );
};
