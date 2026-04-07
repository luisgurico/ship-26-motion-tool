import React, { useEffect, useRef, useState } from "react";
import {
  useCurrentFrame,
  Img,
  staticFile,
  delayRender,
  continueRender,
  interpolate,
} from "remotion";
import type { ImageRevealConfig } from "@/types";
import { renderRevealFrame, prepareFrozenData } from "@/lib/pixel-reveal";
import type { GridLeaf } from "@/lib/pixel-reveal";

interface ImageRevealProps {
  src: string;
  width: number;
  height: number;
  reveal?: ImageRevealConfig;
  // Legacy props (used by unused sequence templates)
  delay?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  width,
  height,
  reveal,
  borderRadius,
  style,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frozenRef = useRef<{
    frozenLeaves: GridLeaf[];
    seedMap: Map<string, number>;
    cellSeeds: Map<string, number>;
  } | null>(null);
  const [handle] = useState(() => delayRender("Loading image for pixel reveal"));
  const [loaded, setLoaded] = useState(false);

  const resolvedSrc = src.startsWith("http") ? src : staticFile(src);

  const roundedW = Math.round(width);
  const roundedH = Math.round(height);

  // Load image into ImageData once
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = roundedW;
      offscreen.height = roundedH;
      const ctx = offscreen.getContext("2d")!;
      ctx.drawImage(img, 0, 0, roundedW, roundedH);
      imageDataRef.current = ctx.getImageData(0, 0, roundedW, roundedH);

      // Temp canvas for compositing (holds the original image)
      const tc = document.createElement("canvas");
      tc.width = roundedW;
      tc.height = roundedH;
      const tctx = tc.getContext("2d")!;
      tctx.drawImage(img, 0, 0, roundedW, roundedH);
      tempCanvasRef.current = tc;

      // Pre-compute frozen grid and seeds
      if (reveal) frozenRef.current = prepareFrozenData(imageDataRef.current, reveal);

      setLoaded(true);
      continueRender(handle);
    };
    img.onerror = () => {
      continueRender(handle);
    };
    img.src = resolvedSrc;
  }, [resolvedSrc, roundedW, roundedH]);

  // Recompute frozen data when reveal config changes
  useEffect(() => {
    if (imageDataRef.current && reveal) {
      frozenRef.current = prepareFrozenData(imageDataRef.current, reveal);
    }
  }, [
    reveal?.minBlockSize, reveal?.maxBlockSize,
    reveal?.sensitivityMin, reveal?.sensitivityMax,
    reveal?.bgCutoff, reveal?.noiseSeed,
    reveal?.noiseScale, reveal?.noiseStrength,
  ]);

  // Render on every frame
  useEffect(() => {
    if (!reveal || !loaded || !canvasRef.current || !imageDataRef.current || !tempCanvasRef.current || !frozenRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const progress = interpolate(
      frame,
      [reveal.delayInFrames, reveal.delayInFrames + reveal.durationInFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    // Before animation starts
    if (progress <= 0) {
      if (reveal.direction === "in") {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, roundedW, roundedH);
      } else {
        ctx.drawImage(tempCanvasRef.current, 0, 0);
      }
      return;
    }

    // After animation ends
    if (progress >= 1) {
      if (reveal.direction === "in") {
        ctx.drawImage(tempCanvasRef.current, 0, 0);
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, roundedW, roundedH);
      }
      return;
    }

    renderRevealFrame(
      ctx,
      imageDataRef.current,
      tempCanvasRef.current,
      reveal,
      frozenRef.current.frozenLeaves,
      frozenRef.current.seedMap,
      frozenRef.current.cellSeeds,
      progress,
    );
  }, [frame, loaded, reveal, roundedW, roundedH]);

  if (!reveal?.enabled) {
    return (
      <div style={{ width, height, borderRadius, overflow: "hidden", ...style }}>
        <Img
          src={resolvedSrc}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={roundedW}
      height={roundedH}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
};
