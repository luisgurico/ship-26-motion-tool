import { linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

export const fadeTransition = (durationInFrames = 15) => ({
  timing: linearTiming({ durationInFrames }),
  presentation: fade(),
});

export const slideTransition = (
  durationInFrames = 20,
  direction: "from-left" | "from-right" | "from-top" | "from-bottom" = "from-right"
) => ({
  timing: springTiming({
    durationInFrames,
    config: { damping: 15, stiffness: 200, mass: 0.8 },
  }),
  presentation: slide({ direction }),
});

export const wipeTransition = (
  durationInFrames = 20,
  direction: "from-left" | "from-right" | "from-top" | "from-bottom" = "from-left"
) => ({
  timing: linearTiming({ durationInFrames }),
  presentation: wipe({ direction }),
});
