import React from "react";

interface GradientOverlayProps {
  colors: string[];
  direction?: string;
  delay?: number;
  opacity?: number;
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({
  colors,
  direction = "to bottom right",
  opacity: maxOpacity = 0.3,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: maxOpacity,
        background: `linear-gradient(${direction}, ${colors.join(", ")})`,
      }}
    />
  );
};
