import { staticFile } from "remotion";
import { loadFont as loadRemotionFont } from "@remotion/fonts";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

export function loadLocalFont(
  family: string,
  fileName: string,
  options?: { weight?: string; style?: string }
) {
  const url = staticFile(`fonts/${fileName}`);
  loadRemotionFont({
    family,
    url,
    weight: options?.weight ?? "400",
    style: options?.style ?? "normal",
  });
}

export const GEIST_PIXEL_VARIANTS = [
  { family: "GeistPixel-Circle", file: "GeistPixel-Circle.woff2" },
  { family: "GeistPixel-Grid", file: "GeistPixel-Grid.woff2" },
  { family: "GeistPixel-Line", file: "GeistPixel-Line.woff2" },
  { family: "GeistPixel-Square", file: "GeistPixel-Square.woff2" },
  { family: "GeistPixel-Triangle", file: "GeistPixel-Triangle.woff2" },
] as const;

export type FontFamily = "Geist Mono" | "GeistPixel-Circle" | "GeistPixel-Grid" | "GeistPixel-Line" | "GeistPixel-Square" | "GeistPixel-Triangle";

export const FONT_OPTIONS: { label: string; value: FontFamily }[] = [
  { label: "Geist Mono", value: "Geist Mono" },
  { label: "Pixel Circle", value: "GeistPixel-Circle" },
  { label: "Pixel Grid", value: "GeistPixel-Grid" },
  { label: "Pixel Line", value: "GeistPixel-Line" },
  { label: "Pixel Square", value: "GeistPixel-Square" },
  { label: "Pixel Triangle", value: "GeistPixel-Triangle" },
];

export function loadProjectFonts() {
  loadGeistMono();
  for (const v of GEIST_PIXEL_VARIANTS) {
    loadLocalFont(v.family, v.file);
  }
}
