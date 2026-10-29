import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, ShieldCheck, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

/**
 * Screen 1: Analyzing/Processing (0:00–1.5s)
 * 
 * Elements:
 * - Header: "Jovi" logo with reassurance-stacking trust badges:
 *     1. Beauty Award seal
 *     2. "500K+ Happy Users" with 5-star rating
 *     3. World Dermatology Congress badge
 * - Headline: "Award-Winning Skincare Proven to Deliver Results"
 * - Center animation: Concentric dot-ring loader with color-cycling pulse (pink -> purple)
 * - Below animation: "Please don't close this page" in bold
 * - Progress bar: Horizontal bar filling left to right over 0:00–1.5s
 * - Status text: "Analysing your skincare profile"
 * - Body copy: What's being built ("MILC Skincare & Routine Tracker...")
 * - Expectations-setting legal/marketing disclaimer
 */
export default function Screen16Analyzing({ onComplete, onBack }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // 0:00 - 1.5s progress synchronization
  useEffect(() => {
    let start = null;
    const duration = 1500; // 1.5 seconds

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        setIsDone(true);
        if (autoAdvance && onComplete) {
          setTimeout(() => {
            onComplete();
          }, 400);
        }
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [autoAdvance, onComplete]);

  // Generate concentric dot coordinates
  const rings = useMemo(() => {
    const center = 110;
    const ringConfigs = [
      { radius: 28, count: 8, dotRadius: 3.2, delayBase: 0 },
      { radius: 56, count: 14, dotRadius: 3.8, delayBase: 0.2 },
      { radius: 84, count: 20, dotRadius: 4.4, delayBase: 0.4 },
    ];

    return ringConfigs.map((ring, ringIdx) => {
      const dots = [];
      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * 2 * Math.PI;
        const x = center + ring.radius * Math.cos(angle);
        const y = center + ring.radius * Math.sin(angle);
        dots.push({
          id: `${ringIdx}-${i}`,
          x,
          y,
          r: ring.dotRadius,
          delay: ring.delayBase + (i / ring.count) * 0.8,
        });
      }
      return dots;
    });
  }, []);

  const handleReplay = () => {
    setProgress(0);
    setIsDone(false);
    setAutoAdvance(false);
    let start = null;
    const duration = 1500;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        setIsDone(true);
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-2 text-center"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] relative overflow-hidden">
        
        {/* Replay / Pause Testing Pill in Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
          <button
            type="button"
            onClick={handleReplay}
            title="Replay 1.5s analysis"
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. Header: "Jovi" Logo & Reassurance-Stacking Trust Badges */}
        <header className="mb-5 pt-1">
          {/* "Jovi" Brand Logo */}
          <div className="flex items-center justify-center gap-1.5 mb-3.5">
            <span className="font-serif text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
              Jovi
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#E8A5B5] to-[#9333EA] inline-block mb-1" />
          </div>

          {/* Reassurance-Stacking Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md mx-auto">
            {/* Trust Badge 1: Beauty Award Seal */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] font-semibold text-amber-900 shadow-2xs">
              <Award className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Beauty Award Seal</span>
            </div>

            {/* Trust Badge 2: 500K+ Happy Users + 5 Stars */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50/80 border border-rose-100 text-[10px] font-semibold text-rose-950 shadow-2xs">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-amber-400 stroke-amber-500" />
                ))}
              </div>
              <span className="font-bold">500K+ Happy Users</span>
            </div>

            {/* Trust Badge 3: World Dermatology Congress Badge */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[10px] font-semibold text-teal-900 shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
              <span>World Dermatology Congress</span>
            </div>
          </div>
        </header>

        {/* 2. Headline */}
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-snug px-2 mb-6 max-w-xl mx-auto">
          Award-Winning Skincare Proven to Deliver Results
        </h1>

        {/* 3. Center Animation: Concentric Dot-Ring Loader (Color-Cycling Pink -> Purple) */}
        <div className="relative w-[220px] h-[220px] mx-auto my-3 flex items-center justify-center">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#E8A5B5]/25 via-fuchsia-200/20 to-purple-300/25 blur-xl pointer-events-none animate-pulse" />

          <svg width="220" height="220" viewBox="0 0 220 220" className="overflow-visible select-none">
            {/* Center Pulsing Nucleus */}
            <motion.circle
              cx="110"
              cy="110"
              r="7"
              animate={{
                fill: ["#E8A5B5", "#F472B6", "#C084FC", "#9333EA", "#E8A5B5"],
                scale: [1, 1.25, 1],
                opacity: [0.75, 1, 0.75],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.circle
              cx="110"
              cy="110"
              r="14"
              stroke="#E8A5B5"
              strokeWidth="1"
              strokeDasharray="2 3"
              fill="none"
              animate={{
                stroke: ["#E8A5B5", "#EC4899", "#A855F7", "#9333EA", "#E8A5B5"],
                scale: [0.95, 1.1, 0.95],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Concentric Rings of Dots */}
            {rings.map((ringDots, rIdx) =>
              ringDots.map((dot) => (
                <motion.circle
                  key={dot.id}
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.r}
                  animate={{
                    // Dots pulse and shift color dynamically from blush-pink (#E8A5B5 / #F472B6) toward vivid purple (#9333EA)
                    fill: [
                      "#E8A5B5", // Blush-pink
                      "#F472B6", // Vibrant pink
                      "#C084FC", // Soft violet
                      "#9333EA", // Deep purple
                      "#E8A5B5", // Back to blush-pink
                    ],
                    scale: [0.85, 1.35, 1.0, 0.85],
                    opacity: [0.55, 1, 0.85, 0.55],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: dot.delay,
                  }}
                />
              ))
            )}
          </svg>
        </div>

        {/* 4. Below Center Animation: Retention Nudge */}
        <p className="font-bold text-gray-900 text-sm tracking-tight mb-2">
          Please don't close this page
        </p>

        {/* 5. Progress Bar: Horizontal bar filling left to right over 0:00–1.5s */}
        <div className="w-full max-w-[280px] mx-auto mb-2">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200/70">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#E8A5B5] via-[#EC4899] to-[#9333EA]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

        {/* 6. Status Text: "Analysing your skincare profile" */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#4A1766] mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-[#8E7CC3]" />
          <span>Analysing your skincare profile</span>
          <span className="font-mono text-[11px] text-slate-400 ml-1">({progress}%)</span>
        </div>

        {/* 7. Body Copy & Legal/Marketing Cover */}
        <div className="space-y-3 pt-3 border-t border-[#EADBFA] text-left">
          {/* What's Being Built Explanation */}
          <div className="p-3.5 rounded-2xl bg-[#F4F7FA]/90 border border-[#EADBFA]">
            <h4 className="text-xs font-bold text-gray-900 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8E7CC3]" />
              MILC Skincare & Routine Tracker
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              AI-powered personal skincare insights, cutting-edge analytical tools, and daily educational articles tailored to your unique barrier profile.
            </p>
          </div>

          {/* Legal / Marketing Cover Disclaimer */}
          <p className="text-[10px] text-slate-400 italic leading-relaxed px-1 text-center">
            *Results may vary. Users on the premium plan may expect to see visible improvements in hydration, clarity, and barrier resilience within a few weeks.
          </p>
        </div>

        {/* Manual Continue Button when testing or if auto-advance is disabled */}
        {isDone && !autoAdvance && onComplete && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onComplete}
            className="w-full mt-4 h-12 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-xs cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 flex items-center justify-center gap-2"
          >
            <span>Proceed to Analysis Results</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
