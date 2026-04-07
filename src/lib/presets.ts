import type { Screen, StyleConfig, DevConfig, GeneralConfig } from "@/types";
import type { VideoFormatKey } from "@/lib/formats";
import { BUILT_IN_PRESETS } from "./built-in-presets";

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

/** Load user presets from localStorage, deduplicating by ID (keeps most recent) */
function loadUserPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    const parsed: Preset[] = JSON.parse(raw);
    const byId = new Map<string, Preset>();
    for (const p of parsed) {
      const existing = byId.get(p.id);
      if (!existing || p.createdAt > existing.createdAt) {
        byId.set(p.id, p);
      }
    }
    return Array.from(byId.values());
  } catch {
    return [];
  }
}

/** Load all presets: user presets first, then built-in presets (skipping duplicates by name) */
export function loadPresets(): Preset[] {
  const userPresets = loadUserPresets();
  const userNames = new Set(userPresets.map((p) => p.name));
  const builtIn = BUILT_IN_PRESETS.filter((p) => !userNames.has(p.name));
  return [...userPresets, ...builtIn];
}

export function addPreset(name: string, state: EditorState): Preset {
  const preset: Preset = {
    id: crypto.randomUUID(),
    name,
    ...state,
    createdAt: Date.now(),
  };
  const userPresets = loadUserPresets();
  userPresets.unshift(preset);
  localStorage.setItem(PRESETS_KEY, JSON.stringify(userPresets));
  return preset;
}

export function updatePreset(id: string, state: EditorState): Preset | null {
  const userPresets = loadUserPresets();

  // For built-in presets, create or replace a user override
  const builtIn = BUILT_IN_PRESETS.find((p) => p.id === id);
  if (builtIn) {
    const override: Preset = { ...builtIn, ...state, createdAt: Date.now() };
    const existingIndex = userPresets.findIndex((p) => p.id === id);
    if (existingIndex !== -1) {
      userPresets[existingIndex] = override;
    } else {
      userPresets.unshift(override);
    }
    localStorage.setItem(PRESETS_KEY, JSON.stringify(userPresets));
    return override;
  }

  // For user presets, update in-place
  const index = userPresets.findIndex((p) => p.id === id);
  if (index === -1) return null;
  userPresets[index] = { ...userPresets[index], ...state, createdAt: Date.now() };
  localStorage.setItem(PRESETS_KEY, JSON.stringify(userPresets));
  return userPresets[index];
}

export function deletePreset(id: string): void {
  const userPresets = loadUserPresets().filter((p) => p.id !== id);
  localStorage.setItem(PRESETS_KEY, JSON.stringify(userPresets));
}

export function findPresetByName(name: string): Preset | null {
  // User presets take priority so UI updates persist across refreshes
  const userPresets = loadUserPresets();
  const found = userPresets.find((p) => p.name === name);
  if (found) return found;
  // Fall back to built-in preset (code defaults) for fresh installs
  return BUILT_IN_PRESETS.find((p) => p.name === name) ?? null;
}
