"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { Sidebar } from "@/components/editor/Sidebar";
import {
  PreviewPanel,
  type PreviewPanelHandle,
} from "@/components/editor/PreviewPanel";
import { EditorViewport } from "@/components/editor/EditorViewport";
import { DevPanel } from "@/components/editor/DevPanel";
import { Timeline } from "@/components/editor/Timeline";
import type { VideoFormatKey } from "@/lib/formats";
import {
  DEFAULT_SCREENS,
  DEFAULT_STYLE,
  DEFAULT_DEV_CONFIG,
  DEFAULT_GENERAL_CONFIG,
  createTextBox,
  createImageElement,
  createLottieElement,
  type Screen,
  type StyleConfig,
  type DevConfig,
  type GeneralConfig,
  type TextBox,
  type ImageElement,
  type LottieElement,
} from "@/types";
import {
  loadAutosave,
  saveAutosave,
  loadPresets,
  addPreset,
  deletePreset,
  type Preset,
  type EditorState,
} from "@/lib/presets";

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [format, setFormat] = useState<VideoFormatKey>("square");
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
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showDev, setShowDev] = useState(false);
  const previewRef = useRef<PreviewPanelHandle>(null);

  // Restore saved state after hydration
  useEffect(() => {
    const saved = loadAutosave();
    if (saved) {
      setFormat(saved.format);
      setScreens(saved.screens);
      setSelectedScreenId(saved.screens[0]?.id ?? null);
      setSelectedTextBoxId(saved.screens[0]?.textBoxes[0]?.id ?? null);
      setStyleConfig(saved.styleConfig);
      setDevConfig(saved.devConfig);
      setGeneralConfig(saved.generalConfig);
    }
    setPresets(loadPresets());
    setHydrated(true);
  }, []);

  // Auto-save state to localStorage on changes (debounced)
  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      saveAutosave({ format, screens, styleConfig, devConfig, generalConfig });
    }, 500);
    return () => clearTimeout(timer);
  }, [hydrated, format, screens, styleConfig, devConfig, generalConfig]);

  const handleSavePreset = useCallback(
    (name: string) => {
      const preset = addPreset(name, { format, screens, styleConfig, devConfig, generalConfig });
      setPresets((prev) => [preset, ...prev]);
    },
    [format, screens, styleConfig, devConfig, generalConfig]
  );

  const handleLoadPreset = useCallback((preset: Preset) => {
    setFormat(preset.format);
    setScreens(preset.screens);
    setStyleConfig(preset.styleConfig);
    setDevConfig(preset.devConfig);
    setGeneralConfig(preset.generalConfig);
    setSelectedScreenId(preset.screens[0]?.id ?? null);
    setSelectedTextBoxId(preset.screens[0]?.textBoxes[0]?.id ?? null);
  }, []);

  const handleDeletePreset = useCallback((id: string) => {
    deletePreset(id);
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }, []);

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

  // Auto-snap all text box positions when grid size changes (only if snap is on)
  useEffect(() => {
    if (!generalConfig.snapEnabled) return;
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
  }, [generalConfig.gridSize, generalConfig.snapEnabled]);

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

  const handleImageAdd = useCallback(
    (screenId: string) => {
      const img = createImageElement();
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId ? { ...s, images: [...(s.images ?? []), img] } : s
        )
      );
    },
    []
  );

  const handleImageUpdate = useCallback(
    (screenId: string, imageId: string, patch: Partial<ImageElement>) => {
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId
            ? { ...s, images: (s.images ?? []).map((i) => (i.id === imageId ? { ...i, ...patch } : i)) }
            : s
        )
      );
    },
    []
  );

  const handleImageRemove = useCallback(
    (screenId: string, imageId: string) => {
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId
            ? { ...s, images: (s.images ?? []).filter((i) => i.id !== imageId) }
            : s
        )
      );
    },
    []
  );

  const handleLottieAdd = useCallback(
    (screenId: string) => {
      const lt = createLottieElement();
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId ? { ...s, lotties: [...(s.lotties ?? []), lt] } : s
        )
      );
    },
    []
  );

  const handleLottieUpdate = useCallback(
    (screenId: string, lottieId: string, patch: Partial<LottieElement>) => {
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId
            ? { ...s, lotties: (s.lotties ?? []).map((l) => (l.id === lottieId ? { ...l, ...patch } : l)) }
            : s
        )
      );
    },
    []
  );

  const handleLottieRemove = useCallback(
    (screenId: string, lottieId: string) => {
      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId
            ? { ...s, lotties: (s.lotties ?? []).filter((l) => l.id !== lottieId) }
            : s
        )
      );
    },
    []
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
      <Toolbar showDev={showDev} onToggleDev={() => setShowDev((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          format={format}
          onFormatChange={setFormat}
          selectedScreen={selectedScreen}
          styleConfig={styleConfig}
          generalConfig={generalConfig}
          selectedTextBoxId={selectedTextBoxId}
          onSelectTextBox={setSelectedTextBoxId}
          onScreenUpdate={handleScreenUpdate}
          onStyleConfigChange={handleStyleConfigChange}
          onGeneralConfigChange={handleGeneralConfigChange}
          onTextBoxUpdate={handleTextBoxUpdate}
          onTextBoxAdd={handleTextBoxAdd}
          onTextBoxRemove={handleTextBoxRemove}
          onImageAdd={handleImageAdd}
          onImageUpdate={handleImageUpdate}
          onImageRemove={handleImageRemove}
          onLottieAdd={handleLottieAdd}
          onLottieUpdate={handleLottieUpdate}
          onLottieRemove={handleLottieRemove}
          presets={presets}
          onSavePreset={handleSavePreset}
          onLoadPreset={handleLoadPreset}
          onDeletePreset={handleDeletePreset}
        />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 flex items-start justify-center gap-6 bg-black overflow-auto p-6 pt-12">
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
              snapEnabled={generalConfig.snapEnabled}
            />
            <PreviewPanel
              ref={previewRef}
              format={format}
              inputProps={inputProps}
              durationInFrames={totalDuration}
            />
          </div>
          <div className="shrink-0">
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
        {showDev && (
          <DevPanel
            devConfig={devConfig}
            onDevConfigChange={handleDevConfigChange}
          />
        )}
      </div>
    </div>
  );
}
