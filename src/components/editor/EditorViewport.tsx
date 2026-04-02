"use client";

import React from "react";
import { Thumbnail } from "@remotion/player";
import { SocialPromo } from "@/remotion/compositions/SocialPromo";
import type { SocialPromoProps } from "@/remotion/compositions/schemas";
import { VIDEO_FORMATS, DEFAULT_FPS, type VideoFormatKey } from "@/lib/formats";
import { DragOverlay } from "./DragOverlay";
import type { TextBox } from "@/types";

interface EditorViewportProps {
  format: VideoFormatKey;
  inputProps: SocialPromoProps;
  durationInFrames: number;
  selectedScreenStartFrame: number;
  selectedScreenDuration: number;
  textBoxes: TextBox[];
  selectedTextBoxId: string | null;
  onSelectTextBox: (id: string | null) => void;
  onMoveTextBox: (id: string, xPercent: number, yPercent: number) => void;
  onUpdateContent: (id: string, content: string) => void;
  gridSize: number;
}

export const EditorViewport: React.FC<EditorViewportProps> = ({
  format,
  inputProps,
  durationInFrames,
  selectedScreenStartFrame,
  selectedScreenDuration,
  textBoxes,
  selectedTextBoxId,
  onSelectTextBox,
  onMoveTextBox,
  onUpdateContent,
  gridSize,
}) => {
  const videoFormat = VIDEO_FORMATS[format];

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

  // Show midpoint of the selected screen so text is visible
  const frameToDisplay = selectedScreenStartFrame + Math.floor(selectedScreenDuration / 2);

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        Editor
      </span>
      <div
        className="rounded-lg overflow-hidden border border-border bg-black"
        style={{ position: "relative", width: displayWidth, height: displayHeight }}
      >
        <Thumbnail
          component={SocialPromo}
          inputProps={inputProps}
          durationInFrames={Math.max(durationInFrames, 1)}
          frameToDisplay={Math.min(frameToDisplay, Math.max(durationInFrames - 1, 0))}
          fps={DEFAULT_FPS}
          compositionWidth={videoFormat.width}
          compositionHeight={videoFormat.height}
          style={{ width: "100%", height: "100%" }}
        />
        <DragOverlay
          textBoxes={textBoxes}
          selectedTextBoxId={selectedTextBoxId}
          gridSize={gridSize}
          onSelectTextBox={onSelectTextBox}
          onMoveTextBox={onMoveTextBox}
          onUpdateContent={onUpdateContent}
          displayWidth={displayWidth}
          displayHeight={displayHeight}
        />
      </div>
    </div>
  );
};
