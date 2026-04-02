"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  showDev: boolean;
  onToggleDev: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ showDev, onToggleDev }) => {
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
      <Button
        variant={showDev ? "secondary" : "ghost"}
        size="sm"
        onClick={onToggleDev}
        className="gap-1.5 border border-dashed border-yellow-600/40 text-yellow-500 hover:text-yellow-400"
      >
        <span className="text-xs">Dev</span>
      </Button>
    </div>
  );
};
