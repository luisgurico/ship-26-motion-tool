"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { Sidebar } from "@/components/editor/Sidebar";
import {
  PreviewPanel,
  type PreviewPanelHandle,
} from "@/components/editor/PreviewPanel";
import { Timeline } from "@/components/editor/Timeline";
import type { VideoFormatKey } from "@/lib/formats";
import {
  DEFAULT_SCREENS,
  DEFAULT_STYLE,
  type Screen,
  type StyleConfig,
} from "@/types";

export default function Home() {
  const [format, setFormat] = useState<VideoFormatKey>("landscape");
  const [screens, setScreens] = useState<Screen[]>(DEFAULT_SCREENS);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(
    DEFAULT_SCREENS[0]?.id ?? null
  );
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE);
  const previewRef = useRef<PreviewPanelHandle>(null);

  const selectedScreen = useMemo(
    () => screens.find((s) => s.id === selectedScreenId) ?? null,
    [screens, selectedScreenId]
  );

  const handleStyleConfigChange = useCallback(
    (patch: Partial<StyleConfig>) => {
      setStyleConfig((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const handleScreenUpdate = useCallback(
    (id: string, patch: Partial<Screen>) => {
      setScreens((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
      );
    },
    []
  );

  const handleScreenAdd = useCallback((screen: Screen) => {
    setScreens((prev) => [...prev, screen]);
    setSelectedScreenId(screen.id);
  }, []);

  const handleScreenRemove = useCallback(
    (id: string) => {
      setScreens((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (selectedScreenId === id) {
          setSelectedScreenId(next[0]?.id ?? null);
        }
        return next;
      });
    },
    [selectedScreenId]
  );

  const handleScreenSelect = useCallback(
    (id: string) => {
      setSelectedScreenId(id);
      // Seek player to start of this screen
      let startFrame = 0;
      for (const screen of screens) {
        if (screen.id === id) break;
        startFrame += screen.durationInFrames;
      }
      previewRef.current?.seekTo(startFrame);
    },
    [screens]
  );

  const totalDuration = useMemo(
    () => screens.reduce((sum, s) => sum + s.durationInFrames, 0),
    [screens]
  );

  const inputProps = useMemo(
    () => ({
      screens,
      ...styleConfig,
    }),
    [screens, styleConfig]
  );

  return (
    <div className="flex flex-col h-screen">
      <Toolbar format={format} onFormatChange={setFormat} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedScreen={selectedScreen}
          styleConfig={styleConfig}
          onScreenUpdate={handleScreenUpdate}
          onStyleConfigChange={handleStyleConfigChange}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 flex items-center justify-center bg-zinc-950 overflow-auto p-8">
            <PreviewPanel
              ref={previewRef}
              format={format}
              inputProps={inputProps}
              durationInFrames={totalDuration}
            />
          </main>
          <Timeline
            screens={screens}
            selectedScreenId={selectedScreenId}
            onSelect={handleScreenSelect}
            onAdd={handleScreenAdd}
            onRemove={handleScreenRemove}
            onReorder={setScreens}
          />
        </div>
      </div>
    </div>
  );
}
