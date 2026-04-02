import React, { useEffect, useState } from "react";
import { Lottie, getLottieMetadata } from "@remotion/lottie";
import { staticFile, continueRender, delayRender, useVideoConfig } from "remotion";

interface LottieElementProps {
  src: string;
  loop: boolean;
  style?: React.CSSProperties;
}

export const LottieElement: React.FC<LottieElementProps> = ({
  src,
  loop,
  style,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);
  const [handle] = useState(() => delayRender("Loading Lottie animation"));
  const { fps } = useVideoConfig();

  useEffect(() => {
    const url = src.startsWith("http") ? src : staticFile(src);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Failed to load lottie:", err);
        continueRender(handle);
      });
  }, [src, handle]);

  if (!animationData) return null;

  // Auto-adjust playback rate to match lottie's native framerate
  const metadata = getLottieMetadata(animationData);
  const lottieFps = metadata?.fps ?? fps;
  const playbackRate = lottieFps / fps;

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      playbackRate={playbackRate}
      style={{
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
};
