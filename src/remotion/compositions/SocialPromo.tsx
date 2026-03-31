import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import type { SocialPromoProps } from "./schemas";
import { PatternBackground } from "../elements/PatternBackground";
import { GradientOverlay } from "../elements/GradientOverlay";
import { TitleReveal } from "../sequences/TitleReveal";
import { EventDetails } from "../sequences/EventDetails";
import { SpeakerCard } from "../sequences/SpeakerCard";
import { CallToAction } from "../sequences/CallToAction";
import { LogoReveal } from "../sequences/LogoReveal";
import { CustomText } from "../sequences/CustomText";
import { fadeTransition, slideTransition } from "../transitions/presets";

export const SocialPromo: React.FC<SocialPromoProps> = ({
  screens,
  primaryColor,
  secondaryColor,
  backgroundColor,
  textColor,
  accentColor,
  patternStyle,
  transitionSpeed,
}) => {
  const transitionDuration = Math.round(15 / transitionSpeed);

  const renderScreen = (screen: (typeof screens)[number]) => {
    const d = screen.data;
    switch (screen.type) {
      case "title":
        return (
          <TitleReveal
            eventName={d.eventName ?? ""}
            tagline={d.tagline ?? ""}
            textColor={textColor}
            accentColor={accentColor}
          />
        );
      case "event-details":
        return (
          <EventDetails
            date={d.date ?? ""}
            location={d.location ?? ""}
            textColor={textColor}
            secondaryColor={secondaryColor}
          />
        );
      case "speaker":
        return (
          <SpeakerCard
            speakerName={d.name ?? ""}
            speakerTitle={d.title ?? ""}
            speakerImage={d.imageUrl ?? ""}
            textColor={textColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
          />
        );
      case "cta":
        return (
          <CallToAction
            ctaText={d.ctaText ?? ""}
            ctaUrl={d.ctaUrl ?? ""}
            eventName={d.eventName ?? ""}
            textColor={textColor}
            accentColor={accentColor}
            backgroundColor={backgroundColor}
          />
        );
      case "logo":
        return (
          <LogoReveal
            logoImage={d.logoImage ?? ""}
            tagline={d.tagline ?? ""}
            textColor={textColor}
            accentColor={accentColor}
          />
        );
      case "custom-text":
        return (
          <CustomText
            heading={d.heading ?? ""}
            body={d.body ?? ""}
            textColor={textColor}
            secondaryColor={secondaryColor}
          />
        );
    }
  };

  const useSlide = (i: number) => i % 2 === 1;

  return (
    <AbsoluteFill>
      <PatternBackground
        pattern={patternStyle}
        color={secondaryColor}
        backgroundColor={backgroundColor}
        opacity={0.12}
      />
      <GradientOverlay
        colors={[`${accentColor}22`, "transparent", `${accentColor}11`]}
        direction="135deg"
        opacity={0.5}
      />

      <TransitionSeries>
        {screens.map((screen, i) => (
          <React.Fragment key={screen.id}>
            {i > 0 && (
              <TransitionSeries.Transition
                presentation={
                  useSlide(i)
                    ? slideTransition(transitionDuration).presentation
                    : fadeTransition(transitionDuration).presentation
                }
                timing={
                  useSlide(i)
                    ? slideTransition(transitionDuration).timing
                    : fadeTransition(transitionDuration).timing
                }
              />
            )}
            <TransitionSeries.Sequence
              durationInFrames={screen.durationInFrames}
            >
              {renderScreen(screen)}
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
