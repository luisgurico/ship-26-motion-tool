"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { VIDEO_FORMATS, type VideoFormatKey } from "@/lib/formats";
import { Monitor, Smartphone, Square } from "lucide-react";

interface ToolbarProps {
  format: VideoFormatKey;
  onFormatChange: (format: VideoFormatKey) => void;
}

const formatIcons: Record<VideoFormatKey, React.ReactNode> = {
  landscape: <Monitor className="h-4 w-4" />,
  portrait: <Smartphone className="h-4 w-4" />,
  square: <Square className="h-4 w-4" />,
};

export const Toolbar: React.FC<ToolbarProps> = ({ format, onFormatChange }) => {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono font-bold tracking-tight text-foreground">
          ship26-motion
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          / social promo
        </span>
      </div>
      <div className="flex items-center gap-1">
        {(Object.keys(VIDEO_FORMATS) as VideoFormatKey[]).map((key) => (
          <Button
            key={key}
            variant={format === key ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onFormatChange(key)}
            title={VIDEO_FORMATS[key].description}
            className="gap-1.5"
          >
            {formatIcons[key]}
            <span className="text-xs">{VIDEO_FORMATS[key].label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
