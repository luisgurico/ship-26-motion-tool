import type { Screen, StyleConfig, DevConfig, GeneralConfig } from "@/types";
import type { VideoFormatKey } from "@/lib/formats";

export interface Preset {
  id: string;
  name: string;
  format: VideoFormatKey;
  screens: Screen[];
  styleConfig: StyleConfig;
  devConfig: DevConfig;
  generalConfig: GeneralConfig;
  createdAt: number;
}

export interface EditorState {
  format: VideoFormatKey;
  screens: Screen[];
  styleConfig: StyleConfig;
  devConfig: DevConfig;
  generalConfig: GeneralConfig;
}

const PRESETS_KEY = "ship26-presets";
const AUTOSAVE_KEY = "ship26-autosave";

export function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePresets(presets: Preset[]): void {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function addPreset(name: string, state: EditorState): Preset {
  const preset: Preset = {
    id: crypto.randomUUID(),
    name,
    ...state,
    createdAt: Date.now(),
  };
  const presets = loadPresets();
  presets.unshift(preset);
  savePresets(presets);
  return preset;
}

export function deletePreset(id: string): void {
  const presets = loadPresets().filter((p) => p.id !== id);
  savePresets(presets);
}

export function loadAutosave(): EditorState | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAutosave(state: EditorState): void {
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(state));
}
