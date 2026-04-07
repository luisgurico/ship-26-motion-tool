"use client";

import React, { useImperativeHandle, forwardRef, useEffect, useState, useCallback } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { SocialPromo } from "@/remotion/compositions/SocialPromo";
import type { SocialPromoProps } from "@/remotion/compositions/schemas";
import { VIDEO_FORMATS, DEFAULT_FPS, type VideoFormatKey } from "@/lib/formats";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export interface PreviewPanelHandle {
  seekTo: (frame: number) => void;
}

interface PreviewPanelProps {
  format: VideoFormatKey;
  inputProps: SocialPromoProps;
  durationInFrames: number;
}

export const PreviewPanel = forwardRef<PreviewPanelHandle, PreviewPanelProps>(
  ({ format, inputProps, durationInFrames }, ref) => {
    const playerRef = React.useRef<PlayerRef>(null);
    const [playing, setPlaying] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const videoFormat = VIDEO_FORMATS[format];

    useImperativeHandle(ref, () => ({
      seekTo: (frame: number) => {
        playerRef.current?.seekTo(frame);
        playerRef.current?.pause();
        setPlaying(false);
      },
    }));

    useEffect(() => {
      const player = playerRef.current;
      if (!player) return;

      const onFrame = (e: { detail: { frame: number } }) => {
        setCurrentFrame(e.detail.frame);
      };
      const onPlay = () => setPlaying(true);
      const onPause = () => setPlaying(false);

      player.addEventListener("frameupdate", onFrame);
      player.addEventListener("play", onPlay);
      player.addEventListener("pause", onPause);
      return () => {
        player.removeEventListener("frameupdate", onFrame);
        player.removeEventListener("play", onPlay);
        player.removeEventListener("pause", onPause);
      };
    }, []);

    const handleScrub = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const frame = Number(e.target.value);
        playerRef.current?.seekTo(frame);
        playerRef.current?.pause();
        setPlaying(false);
      },
      [],
    );

    const maxWidth = 560;
    const maxHeight = 460;
    const aspectRatio = videoFormat.width / videoFormat.height;
    let displayWidth: number;
    let displayHeight: number;

    if (aspectRatio > maxWidth / maxHeight) {
      displayWidth = maxWidth;
      displayHeight = maxWidth / aspectRatio;
    } else {
      displayHeight = maxHeight;
      displayWidth = maxHeight * aspectRatio;
    }

    const totalSeconds = (durationInFrames / DEFAULT_FPS).toFixed(1);
    const currentSeconds = (currentFrame / DEFAULT_FPS).toFixed(1);

    return (
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Preview
        </span>
        <div
          className="rounded-lg overflow-hidden border border-border bg-black"
          style={{ position: "relative", width: displayWidth, height: displayHeight }}
        >
          <Player
            ref={playerRef}
            component={SocialPromo}
            inputProps={inputProps}
            durationInFrames={Math.max(durationInFrames, 1)}
            fps={DEFAULT_FPS}
            compositionWidth={videoFormat.width}
            compositionHeight={videoFormat.height}
            style={{ width: "100%", height: "100%" }}
            loop
            acknowledgeRemotionLicense
          />
        </div>
        <div className="flex flex-col gap-2" style={{ width: displayWidth }}>
          <input
            type="range"
            min={0}
            max={Math.max(durationInFrames - 1, 0)}
            value={currentFrame}
            onChange={handleScrub}
            className="w-full h-1.5 accent-white cursor-pointer"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  if (playing) {
                    playerRef.current?.pause();
                  } else {
                    playerRef.current?.play();
                  }
                }}
              >
                {playing ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  playerRef.current?.seekTo(0);
                  playerRef.current?.play();
                }}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              {currentSeconds}s / {totalSeconds}s &middot; {videoFormat.width}x{videoFormat.height}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

PreviewPanel.displayName = "PreviewPanel";
