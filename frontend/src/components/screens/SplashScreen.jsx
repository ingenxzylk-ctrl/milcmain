import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Vertical 9:16 Mobile App Splash Screen Animation
 *
 * Frame Breakdown (5.0s total):
 * - Frame 0.0-0.6s: Pure white background. A thin 2px vertical line at horizontal center
 *                   in solid blush-pink (#E8A5B5) expands symmetrically left and right
 *                   with an ease-out curve until filling edge-to-edge.
 * - Frame 0.6-1.8s: At exact center, a black rounded-square badge (60px, r=16px) fades
 *                   and scales in from 80% to 100% scale (ease-out, clean settle).
 *                   Inside badge, a water droplet merging into a leaf line-art icon morphs
 *                   into place over 0.5s.
 * - Frame 1.8-3.2s: Badge shifts left to center the full lockup; letters "M-i-l-c" fly in
 *                   individually from right edge, 30ms apart, snapping to final position,
 *                   bold white sans-serif (rounded geometric, 700 weight, -1% tracking).
 * - Frame 3.2-5.0s: Full logo lockup holds static centered on blush-pink.
 *                   At 4.5s mark: subtle single soft pulse on badge (1.0 -> 1.02 -> 1.0, 400ms).
 *                   At 5.0s: Transitions cleanly to the Welcome page.
 */
export default function SplashScreen({ onComplete }) {
  // Animation state phases
  const [phase, setPhase] = useState("line"); // "line" (0.0-0.6s) -> "badge" (0.6-1.8s) -> "wordmark" (1.8-3.2s) -> "static" (3.2-5.0s)
  const [pulseBadge, setPulseBadge] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 0.6s: Line expands completely; Black icon badge appears at exact center
    const tBadge = setTimeout(() => {
      setPhase("badge");
    }, 600);

    // 1.8s: Wordmark letters "M-i-l-c" fly in from right edge; Badge shifts to center full lockup
    const tWordmark = setTimeout(() => {
      setPhase("wordmark");
    }, 1800);

    // 3.2s: Full lockup static hold
    const tStatic = setTimeout(() => {
      setPhase("static");
    }, 3200);

    // 4.5s: Single subtle soft pulse on the icon badge only (400ms duration)
    const tPulse = setTimeout(() => {
      setPulseBadge(true);
    }, 4500);

    const tPulseEnd = setTimeout(() => {
      setPulseBadge(false);
    }, 4900);

    // 5.0s: Finish splash screen and transition to Welcome page
    const tFinish = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 350);
    }, 5000);

    return () => {
      clearTimeout(tBadge);
      clearTimeout(tWordmark);
      clearTimeout(tStatic);
      clearTimeout(tPulse);
      clearTimeout(tPulseEnd);
      clearTimeout(tFinish);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 200);
  };

  // Staggered letters flying in 30ms apart starting at Frame 1.8s (1800ms)
  const letters = [
    { char: "M", delay: 0.0 },
    { char: "i", delay: 0.03 },
    { char: "l", delay: 0.06 },
    { char: "c", delay: 0.09 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="splash-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#E8A5B5] select-none overflow-hidden"
      >
        {/*
          Vertical 9:16 mobile canvas:
          - Native full-bleed on mobile screens
          - Centered 9:16 vertical ratio stage on desktop displays
        */}
        <div className="relative w-full h-full max-w-[430px] sm:aspect-[9/16] sm:max-h-[890px] sm:rounded-[36px] overflow-hidden bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-center">

          {/* 
            Frame 0.0-0.6s:
            White background with a 2px vertical line at horizontal center.
            Expands symmetrically left and right with ease-out curve to fill entire frame.
          */}
          <motion.div
            className="absolute inset-0 bg-[#E8A5B5] origin-center"
            initial={{ scaleX: 0.004 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1], // ease-out curve
            }}
          />

          {/* Initial 2px vertical line guide for the very first frames (0.0s - 0.06s) */}
          <motion.div
            className="absolute top-0 bottom-0 w-[2px] bg-[#E8A5B5] left-1/2 -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.08, duration: 0.12 }}
          />

          {/* Top Bar Controls: 9:16 tag and frictionless Skip button */}
          <div className="absolute top-5 inset-x-5 z-40 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase font-semibold">
              9:16 • 30 FPS
            </span>
            <button
              type="button"
              onClick={handleSkip}
              className="pointer-events-auto px-3 py-1 text-[11px] font-medium tracking-wide text-white/80 hover:text-white bg-black/15 hover:bg-black/25 rounded-full transition-all cursor-pointer backdrop-blur-xs"
            >
              Skip
            </button>
          </div>

          {/*
            Centered Stage:
            Total lockup contains:
            - Black icon badge: 60px x 60px
            - Gap: 14px
            - Wordmark "Milc": ~74px
            Total width = ~148px
            Center of lockup is 74px from left.
            Center of badge is 30px from left.
            Offset to place badge center at screen center = 44px.
            When phase is "badge", x is 44px (badge is exact center of screen).
            When phase switches to "wordmark" (1.8s), x moves to 0px (full lockup is exact center of screen)!
          */}
          <motion.div
            className="relative z-20 flex items-center"
            initial={{ x: 44 }}
            animate={{
              x: phase === "line" || phase === "badge" ? 44 : 0,
            }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1], // clean ease-out slide
            }}
          >
            {/*
              Frame 0.6-1.8s:
              Black rounded-square icon badge (60px, corner radius 16px).
              Fades and scales in from 80% to 100% scale, ease-out, no bounce, no overshoot.
              Minimal 4px soft shadow.
            */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: phase === "line" ? 0 : 1,
                scale:
                  phase === "line"
                    ? 0.8
                    : pulseBadge
                    ? 1.02 // Subtle soft pulse at 4.5s
                    : 1,
              }}
              transition={{
                opacity: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                scale: pulseBadge
                  ? { duration: 0.4, ease: "easeInOut" }
                  : { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.16)", // Minimal 4px soft shadow
              }}
              className="bg-black flex items-center justify-center shrink-0 relative select-none"
            >
              {/*
                Inside Badge: Simple minimal line-icon of water droplet merging into leaf shape.
                Morphs / draws into place over 0.5s representing skincare/botanical care.
                Clean settle, no bounce.
              */}
              {phase !== "line" && (
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible"
                >
                  {/* Droplet outline blending smoothly into leaf curvature */}
                  <motion.path
                    d="M 17 5 C 12 11.5 7.5 17 7.5 22 C 7.5 27.2 11.5 30 17 30 C 22.5 30 26.5 27.2 26.5 22 C 26.5 16 21.2 11 17 5 Z"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.12,
                      ease: [0.25, 0.1, 0.25, 1], // ease-out, clean settle
                    }}
                  />

                  {/* Botanical central vein / rib */}
                  <motion.path
                    d="M 17 29 C 17 24.5 17.6 19 17 13.5"
                    stroke="#FFFFFF"
                    strokeWidth="2.0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.28,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  />

                  {/* Gentle side leaf branch */}
                  <motion.path
                    d="M 17 22 C 19.5 20.6 22 20.5 23 19.5"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 0.32,
                      delay: 0.38,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  />
                </svg>
              )}
            </motion.div>

            {/*
              Frame 1.8-3.2s:
              Directly to the right of the icon badge (14px gap).
              Letters "M-i-l-c" fly in individually from the right edge of the frame,
              sliding in and snapping to final position 30ms apart, ease-out,
              bold white sans-serif (rounded geometric typeface, weight 700).
            */}
            <div className="flex items-center ml-[14px] overflow-visible">
              {(phase === "wordmark" || phase === "static") &&
                letters.map((item) => (
                  <motion.span
                    key={item.char}
                    initial={{ x: 280, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.44,
                      delay: item.delay,
                      ease: [0.16, 1, 0.3, 1], // ease-out snap, no overshoot
                    }}
                    className="text-white font-bold text-[38px] sm:text-[40px] leading-none tracking-[-0.01em]"
                    style={{
                      fontFamily:
                        '"Plus Jakarta Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    {item.char}
                  </motion.span>
                ))}
            </div>
          </motion.div>

          {/* Subtle bottom timeline progress indicator (5.0 seconds) */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/25 origin-left pointer-events-none"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5.0, ease: "linear" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
