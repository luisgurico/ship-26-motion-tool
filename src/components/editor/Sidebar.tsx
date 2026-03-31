"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScreenFields } from "./ScreenFields";
import type { Screen, StyleConfig } from "@/types";

interface SidebarProps {
  selectedScreen: Screen | null;
  styleConfig: StyleConfig;
  onScreenUpdate: (id: string, patch: Partial<Screen>) => void;
  onStyleConfigChange: (config: Partial<StyleConfig>) => void;
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 rounded border border-border bg-transparent cursor-pointer"
      />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs font-mono text-foreground">{value}</span>
      </div>
    </div>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedScreen,
  styleConfig,
  onScreenUpdate,
  onStyleConfigChange,
}) => {
  return (
    <div className="w-[344px] border-r border-border h-full overflow-y-auto bg-background">
      <div className="p-4">
        <Tabs defaultValue="content">
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1">
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="flex-1">
              Style
            </TabsTrigger>
            <TabsTrigger value="export" className="flex-1">
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            {selectedScreen ? (
              <ScreenFields
                screen={selectedScreen}
                onUpdate={onScreenUpdate}
              />
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-xs text-muted-foreground font-mono">
                  Select a screen from the timeline
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="style">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <ColorField
                  label="Primary"
                  value={styleConfig.primaryColor}
                  onChange={(v) => onStyleConfigChange({ primaryColor: v })}
                />
                <ColorField
                  label="Secondary"
                  value={styleConfig.secondaryColor}
                  onChange={(v) => onStyleConfigChange({ secondaryColor: v })}
                />
                <ColorField
                  label="Background"
                  value={styleConfig.backgroundColor}
                  onChange={(v) => onStyleConfigChange({ backgroundColor: v })}
                />
                <ColorField
                  label="Text"
                  value={styleConfig.textColor}
                  onChange={(v) => onStyleConfigChange({ textColor: v })}
                />
                <ColorField
                  label="Accent"
                  value={styleConfig.accentColor}
                  onChange={(v) => onStyleConfigChange({ accentColor: v })}
                />
              </div>

              <div className="border-t border-border pt-4 mt-2" />

              <div className="flex flex-col gap-1.5">
                <Label>Pattern</Label>
                <Select
                  value={styleConfig.patternStyle}
                  onValueChange={(v) =>
                    onStyleConfigChange({
                      patternStyle: v as StyleConfig["patternStyle"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="lines">Lines</SelectItem>
                    <SelectItem value="waves">Waves</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>
                  Transition Speed: {styleConfig.transitionSpeed}x
                </Label>
                <Slider
                  value={[styleConfig.transitionSpeed]}
                  onValueChange={([v]) =>
                    onStyleConfigChange({ transitionSpeed: v })
                  }
                  min={0.5}
                  max={3}
                  step={0.1}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export">
            <div className="flex flex-col gap-4">
              <p className="text-xs text-muted-foreground font-mono">
                Use Remotion Studio for rendering:
              </p>
              <code className="text-xs font-mono bg-accent rounded px-2 py-1.5 text-foreground">
                npm run remotion
              </code>
              <p className="text-xs text-muted-foreground font-mono mt-2">
                Or render via CLI:
              </p>
              <code className="text-xs font-mono bg-accent rounded px-2 py-1.5 text-foreground break-all">
                npx remotion render src/remotion/index.ts SocialPromo-landscape
                out.mp4
              </code>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
