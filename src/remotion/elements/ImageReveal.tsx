import React from "react";
import { Img, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { fadeIn, scaleIn } from "@/lib/animations";

interface ImageRevealProps {
  src: string;
  delay?: number;
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  delay = 0,
  width = 200,
  height = 200,
  borderRadius = 999,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeIn(frame, delay, 15);
  const scale = scaleIn(frame, fps, delay);

  if (!src) return null;

  const imageSrc = src.startsWith("http") ? src : staticFile(src);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        width,
        height,
        borderRadius,
        overflow: "hidden",
        ...style,
      }}
    >
      <Img
        src={imageSrc}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};
