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
import type { Screen, StyleConfig, DevConfig, GeneralConfig, TextBox } from "@/types";

interface SidebarProps {
  selectedScreen: Screen | null;
  styleConfig: StyleConfig;
  devConfig: DevConfig;
  generalConfig: GeneralConfig;
  selectedTextBoxId: string | null;
  onSelectTextBox: (id: string | null) => void;
  onScreenUpdate: (id: string, patch: Partial<Screen>) => void;
  onStyleConfigChange: (config: Partial<StyleConfig>) => void;
  onDevConfigChange: (config: Partial<DevConfig>) => void;
  onGeneralConfigChange: (config: Partial<GeneralConfig>) => void;
  onTextBoxUpdate: (screenId: string, textBoxId: string, patch: Partial<TextBox>) => void;
  onTextBoxAdd: (screenId: string) => void;
  onTextBoxRemove: (screenId: string, textBoxId: string) => void;
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
  devConfig,
  generalConfig,
  selectedTextBoxId,
  onSelectTextBox,
  onScreenUpdate,
  onStyleConfigChange,
  onDevConfigChange,
  onGeneralConfigChange,
  onTextBoxUpdate,
  onTextBoxAdd,
  onTextBoxRemove,
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
            <TabsTrigger value="general" className="flex-1">
              General
            </TabsTrigger>
            <TabsTrigger value="export" className="flex-1">
              Export
            </TabsTrigger>
            <TabsTrigger
              value="dev"
              className="flex-1 border border-dashed border-yellow-600/50 text-yellow-500"
            >
              Dev
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            {selectedScreen ? (
              <ScreenFields
                screen={selectedScreen}
                selectedTextBoxId={selectedTextBoxId}
                onSelectTextBox={onSelectTextBox}
                onUpdate={onScreenUpdate}
                onTextBoxUpdate={onTextBoxUpdate}
                onTextBoxAdd={onTextBoxAdd}
                onTextBoxRemove={onTextBoxRemove}
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

          <TabsContent value="general">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>
                  Grid Size: {generalConfig.gridSize} rows
                </Label>
                <Slider
                  value={[generalConfig.gridSize]}
                  onValueChange={([v]) =>
                    onGeneralConfigChange({ gridSize: v })
                  }
                  min={4}
                  max={40}
                  step={1}
                />
                <span className="text-[10px] text-muted-foreground font-mono">
                  Snap grid divisions ({(100 / generalConfig.gridSize).toFixed(1)}% per cell)
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dev">
            <div className="flex flex-col gap-4 rounded border border-dashed border-yellow-600/40 p-3">
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
