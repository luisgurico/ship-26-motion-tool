import type { Preset } from "./presets";
import defaultPresetData from "./default-preset.json";

export const BUILT_IN_PRESETS: Preset[] = [
  {
    id: "built-in-default",
    name: "Default",
    ...defaultPresetData,
    createdAt: 0,
  } as Preset,
];
