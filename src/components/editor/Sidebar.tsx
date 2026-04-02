"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Monitor, Smartphone, Square } from "lucide-react";
import { VIDEO_FORMATS, type VideoFormatKey } from "@/lib/formats";
import { ScreenFields } from "./ScreenFields";
import type { Screen, StyleConfig, GeneralConfig, TextBox, ImageElement, LottieElement } from "@/types";
import type { Preset } from "@/lib/presets";

const formatIcons: Record<VideoFormatKey, React.ReactNode> = {
  landscape: <Monitor className="h-3.5 w-3.5" />,
  portrait: <Smartphone className="h-3.5 w-3.5" />,
  square: <Square className="h-3.5 w-3.5" />,
};

interface SidebarProps {
  format: VideoFormatKey;
  onFormatChange: (format: VideoFormatKey) => void;
  selectedScreen: Screen | null;
  styleConfig: StyleConfig;
  generalConfig: GeneralConfig;
  selectedTextBoxId: string | null;
  onSelectTextBox: (id: string | null) => void;
  onScreenUpdate: (id: string, patch: Partial<Screen>) => void;
  onStyleConfigChange: (config: Partial<StyleConfig>) => void;
  onGeneralConfigChange: (config: Partial<GeneralConfig>) => void;
  onTextBoxUpdate: (screenId: string, textBoxId: string, patch: Partial<TextBox>) => void;
  onTextBoxAdd: (screenId: string) => void;
  onTextBoxRemove: (screenId: string, textBoxId: string) => void;
  onImageAdd: (screenId: string) => void;
  onImageUpdate: (screenId: string, imageId: string, patch: Partial<ImageElement>) => void;
  onImageRemove: (screenId: string, imageId: string) => void;
  onLottieAdd: (screenId: string) => void;
  onLottieUpdate: (screenId: string, lottieId: string, patch: Partial<LottieElement>) => void;
  onLottieRemove: (screenId: string, lottieId: string) => void;
  presets: Preset[];
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: Preset) => void;
  onDeletePreset: (id: string) => void;
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
  format,
  onFormatChange,
  selectedScreen,
  styleConfig,
  generalConfig,
  selectedTextBoxId,
  onSelectTextBox,
  onScreenUpdate,
  onStyleConfigChange,
  onGeneralConfigChange,
  onTextBoxUpdate,
  onTextBoxAdd,
  onTextBoxRemove,
  onImageAdd,
  onImageUpdate,
  onImageRemove,
  onLottieAdd,
  onLottieUpdate,
  onLottieRemove,
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}) => {
  const [presetName, setPresetName] = useState("");

  return (
    <div className="w-[344px] border-r border-border h-full overflow-y-auto bg-background">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-1">
          {(Object.keys(VIDEO_FORMATS) as VideoFormatKey[]).map((key) => (
            <Button
              key={key}
              variant={format === key ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onFormatChange(key)}
              title={VIDEO_FORMATS[key].description}
              className="flex-1 gap-1.5"
            >
              {formatIcons[key]}
              <span className="text-xs">{VIDEO_FORMATS[key].label}</span>
            </Button>
          ))}
        </div>
        <Tabs defaultValue="content">
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1 px-1.5">
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="flex-1 px-1.5">
              Style
            </TabsTrigger>
            <TabsTrigger value="general" className="flex-1 px-1.5">
              General
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex-1 px-1.5">
              Presets
            </TabsTrigger>
            <TabsTrigger value="export" className="flex-1 px-1.5">
              Export
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
                onImageAdd={onImageAdd}
                onImageUpdate={onImageUpdate}
                onImageRemove={onImageRemove}
                onLottieAdd={onLottieAdd}
                onLottieUpdate={onLottieUpdate}
                onLottieRemove={onLottieRemove}
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
              <div className="flex items-center justify-between">
                <Label>Grid Snapping</Label>
                <Button
                  variant={generalConfig.snapEnabled ? "secondary" : "outline"}
                  size="sm"
                  onClick={() =>
                    onGeneralConfigChange({ snapEnabled: !generalConfig.snapEnabled })
                  }
                >
                  {generalConfig.snapEnabled ? "On" : "Off"}
                </Button>
              </div>

              {generalConfig.snapEnabled && (
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
              )}
            </div>
          </TabsContent>

          <TabsContent value="presets">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Save Current State</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Preset name..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && presetName.trim()) {
                        onSavePreset(presetName.trim());
                        setPresetName("");
                      }
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    disabled={!presetName.trim()}
                    onClick={() => {
                      onSavePreset(presetName.trim());
                      setPresetName("");
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-2" />

              <div className="flex items-center gap-2 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                  Auto-restore on refresh is active
                </span>
              </div>

              {presets.length === 0 ? (
                <p className="text-xs text-muted-foreground font-mono py-4 text-center">
                  No saved presets yet
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {presets.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-2 rounded border border-border p-2"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-mono text-foreground truncate">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {p.screens.length} screens &middot;{" "}
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onLoadPreset(p)}
                        >
                          Load
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => onDeletePreset(p.id)}
                        >
                          &times;
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
