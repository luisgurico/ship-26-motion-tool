import React from "react";
import { Img, staticFile } from "remotion";

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
  width = 200,
  height = 200,
  borderRadius = 999,
  style,
}) => {
  if (!src) return null;

  const imageSrc = src.startsWith("http") ? src : staticFile(src);

  return (
    <div
      style={{
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
