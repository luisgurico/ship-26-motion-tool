import { staticFile } from "remotion";
import { loadFont as loadRemotionFont } from "@remotion/fonts";

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

export { loadFont as loadGoogleFont } from "@remotion/google-fonts/Inter";
