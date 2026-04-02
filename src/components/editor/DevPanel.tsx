"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { DevConfig } from "@/types";

interface DevPanelProps {
  devConfig: DevConfig;
  onDevConfigChange: (config: Partial<DevConfig>) => void;
}

export const DevPanel: React.FC<DevPanelProps> = ({
  devConfig,
  onDevConfigChange,
}) => {
  return (
    <div className="w-[280px] border-l border-dashed border-yellow-600/30 h-full overflow-y-auto bg-background">
      <div className="p-4 flex flex-col gap-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-yellow-500">
          Dev Parameters
        </p>
        <div className="flex flex-col gap-1.5">
          <Label>
            Text Animation Duration: {devConfig.textAnimationDuration}f
          </Label>
          <Slider
            value={[devConfig.textAnimationDuration]}
            onValueChange={([v]) =>
              onDevConfigChange({ textAnimationDuration: v })
            }
            min={5}
            max={60}
            step={1}
          />
          <span className="text-[10px] text-muted-foreground font-mono">
            Frames for character dissolve in/out
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>
            Screen Gap: {devConfig.screenGap}f
          </Label>
          <Slider
            value={[devConfig.screenGap]}
            onValueChange={([v]) =>
              onDevConfigChange({ screenGap: v })
            }
            min={-30}
            max={30}
            step={1}
          />
          <span className="text-[10px] text-muted-foreground font-mono">
            Gap between out/in animations. Negative = overlap
          </span>
        </div>
      </div>
    </div>
  );
};
