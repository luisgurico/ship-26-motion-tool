"use client";

import React, { useImperativeHandle, forwardRef } from "react";
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
    const [playing, setPlaying] = React.useState(false);
    const videoFormat = VIDEO_FORMATS[format];

    useImperativeHandle(ref, () => ({
      seekTo: (frame: number) => {
        playerRef.current?.seekTo(frame);
        playerRef.current?.pause();
        setPlaying(false);
      },
    }));

    const maxWidth = 720;
    const maxHeight = 500;
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

    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="rounded-lg overflow-hidden border border-border bg-black"
          style={{ width: displayWidth, height: displayHeight }}
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
            autoPlay
            acknowledgeRemotionLicense
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (playing) {
                playerRef.current?.pause();
              } else {
                playerRef.current?.play();
              }
              setPlaying(!playing);
            }}
          >
            {playing ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              playerRef.current?.seekTo(0);
              playerRef.current?.play();
              setPlaying(true);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            {videoFormat.width}x{videoFormat.height} &middot; {DEFAULT_FPS}fps
          </span>
        </div>
      </div>
    );
  }
);

PreviewPanel.displayName = "PreviewPanel";
