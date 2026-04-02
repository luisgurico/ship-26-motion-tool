"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { Sidebar } from "@/components/editor/Sidebar";
import {
  PreviewPanel,
  type PreviewPanelHandle,
} from "@/components/editor/PreviewPanel";
import { EditorViewport } from "@/components/editor/EditorViewport";
import { Timeline } from "@/components/editor/Timeline";
import type { VideoFormatKey } from "@/lib/formats";
import {
  DEFAULT_SCREENS,
  DEFAULT_STYLE,
  DEFAULT_DEV_CONFIG,
  DEFAULT_GENERAL_CONFIG,
  createTextBox,
  type Screen,
  type StyleConfig,
  type DevConfig,
  type GeneralConfig,
  type TextBox,
} from "@/types";

export default function Home() {
  const [format, setFormat] = useState<VideoFormatKey>("landscape");
  const [screens, setScreens] = useState<Screen[]>(DEFAULT_SCREENS);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(
    DEFAULT_SCREENS[0]?.id ?? null
  );
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(
    DEFAULT_SCREENS[0]?.textBoxes[0]?.id ?? null
  );
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE);
  const [devConfig, setDevConfig] = useState<DevConfig>(DEFAULT_DEV_CONFIG);
  const [generalConfig, setGeneralConfig] = useState<GeneralConfig>(DEFAULT_GENERAL_CONFIG);
  const previewRef = useRef<PreviewPanelHandle>(null);

  const selectedScreen = useMemo(
    () => screens.find((s) => s.id === selectedScreenId) ?? null,
    [screens, selectedScreenId]
  );

  // Reset selectedTextBoxId when screen changes
  useEffect(() => {
    if (selectedScreen) {
      setSelectedTextBoxId(selectedScreen.textBoxes[0]?.id ?? null);
    } else {
      setSelectedTextBoxId(null);
    }
  }, [selectedScreenId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-snap all text box positions when grid size changes
  useEffect(() => {
    const gridStep = 100 / generalConfig.gridSize;
    const snap = (v: number) => Math.round(v / gridStep) * gridStep;
    setScreens((prev) =>
      prev.map((s) => ({
        ...s,
        textBoxes: s.textBoxes.map((tb) => ({
          ...tb,
          xPercent: snap(tb.xPercent),
          yPercent: snap(tb.yPercent),
        })),
      }))
    );
  }, [generalConfig.gridSize]);

  const handleStyleConfigChange = useCallback(
    (patch: Partial<StyleConfig>) => {
      setStyleConfig((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const handleDevConfigChange = useCallback(
    (patch: Partial<DevConfig>) => {
      setDevConfig((prev) => ({ ...prev, ...patch }));
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
      let startFrame = 0;
      for (const screen of screens) {
        if (screen.id === id) break;
        startFrame += screen.durationInFrames;
      }
      previewRef.current?.seekTo(startFrame);
    },
    [screens]
  );

  const handleTextBoxUpdate = useCallback(
    (screenId: string, textBoxId: string, patch: Partial<TextBox>) => {
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId
            ? {
                ...s,
                textBoxes: s.textBoxes.map((tb) =>
                  tb.id === textBoxId ? { ...tb, ...patch } : tb
                ),
              }
            : s
        )
      );
    },
    []
  );

  const handleTextBoxAdd = useCallback(
    (screenId: string) => {
      const newTb = createTextBox();
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId
            ? { ...s, textBoxes: [...s.textBoxes, newTb] }
            : s
        )
      );
      setSelectedTextBoxId(newTb.id);
    },
    []
  );

  const handleTextBoxRemove = useCallback(
    (screenId: string, textBoxId: string) => {
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId
            ? { ...s, textBoxes: s.textBoxes.filter((tb) => tb.id !== textBoxId) }
            : s
        )
      );
      if (selectedTextBoxId === textBoxId) {
        setSelectedTextBoxId(null);
      }
    },
    [selectedTextBoxId]
  );

  const handleGeneralConfigChange = useCallback(
    (patch: Partial<GeneralConfig>) => {
      setGeneralConfig((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const handleTextBoxContentUpdate = useCallback(
    (textBoxId: string, content: string) => {
      if (!selectedScreenId) return;
      handleTextBoxUpdate(selectedScreenId, textBoxId, { content });
    },
    [selectedScreenId, handleTextBoxUpdate]
  );

  const handleTextBoxMove = useCallback(
    (textBoxId: string, xPercent: number, yPercent: number) => {
      if (!selectedScreenId) return;
      handleTextBoxUpdate(selectedScreenId, textBoxId, { xPercent, yPercent });
    },
    [selectedScreenId, handleTextBoxUpdate]
  );

  const selectedScreenStartFrame = useMemo(() => {
    let start = 0;
    for (const screen of screens) {
      if (screen.id === selectedScreenId) break;
      start += screen.durationInFrames + devConfig.screenGap;
    }
    return start;
  }, [screens, selectedScreenId, devConfig.screenGap]);

  const totalDuration = useMemo(() => {
    const screenSum = screens.reduce((sum, s) => sum + s.durationInFrames, 0);
    const gapSum = devConfig.screenGap * (screens.length - 1);
    return Math.max(1, screenSum + gapSum);
  }, [screens, devConfig.screenGap]);

  const inputProps = useMemo(
    () => ({
      screens,
      ...styleConfig,
      ...devConfig,
    }),
    [screens, styleConfig, devConfig]
  );

  return (
    <div className="flex flex-col h-screen">
      <Toolbar format={format} onFormatChange={setFormat} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedScreen={selectedScreen}
          styleConfig={styleConfig}
          devConfig={devConfig}
          generalConfig={generalConfig}
          selectedTextBoxId={selectedTextBoxId}
          onSelectTextBox={setSelectedTextBoxId}
          onScreenUpdate={handleScreenUpdate}
          onStyleConfigChange={handleStyleConfigChange}
          onDevConfigChange={handleDevConfigChange}
          onGeneralConfigChange={handleGeneralConfigChange}
          onTextBoxUpdate={handleTextBoxUpdate}
          onTextBoxAdd={handleTextBoxAdd}
          onTextBoxRemove={handleTextBoxRemove}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 flex items-center justify-center gap-6 bg-zinc-950 overflow-auto p-6">
            <EditorViewport
              format={format}
              inputProps={inputProps}
              durationInFrames={totalDuration}
              selectedScreenStartFrame={selectedScreenStartFrame}
              selectedScreenDuration={selectedScreen?.durationInFrames ?? 75}
              textBoxes={selectedScreen?.textBoxes ?? []}
              selectedTextBoxId={selectedTextBoxId}
              onSelectTextBox={setSelectedTextBoxId}
              onMoveTextBox={handleTextBoxMove}
              onUpdateContent={handleTextBoxContentUpdate}
              gridSize={generalConfig.gridSize}
            />
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
