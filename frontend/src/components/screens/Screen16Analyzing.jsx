import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, ShieldCheck, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

export default function Screen16Analyzing({ onComplete, onBack }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  useEffect(() => {
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
        if (autoAdvance && onComplete) {
          setTimeout(() => {
            onComplete();
          }, 350);
        }
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [autoAdvance, onComplete]);

  // Concentric dot coordinates
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-xl mx-auto px-3 sm:px-4 text-center select-none"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* Header Trust Stack */}
        <header className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#141416] flex items-center justify-center text-[#FAF9F6] text-xs font-serif font-bold shadow-xs">
              M
            </div>
            <span className="text-xl font-serif font-bold text-[#141416] tracking-tight">MILC</span>
            <span className="text-[9px] tracking-[0.2em] font-mono text-[#71717A] uppercase font-semibold">
              ATELIER
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-[#EBE5DC] text-[10px] font-mono font-medium text-[#52525B]">
              <Award className="w-3 h-3 text-[#B8860B] shrink-0" />
              <span>Dermatology Certified</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-[#EBE5DC] text-[10px] font-mono font-medium text-[#52525B]">
              <Star className="w-3 h-3 fill-[#B8860B] text-[#B8860B] shrink-0" />
              <span>500K+ Consultations</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7FDDF] border border-[#E2F79A] text-[10px] font-mono font-medium text-[#2D5A43]">
              <ShieldCheck className="w-3 h-3 text-[#2D5A43] shrink-0" />
              <span>Clinical Standard</span>
            </div>
          </div>
        </header>

        {/* Headline */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141416] leading-tight px-2 mb-6 max-w-lg mx-auto">
          Calibrating Your Personalized Skin Protocol
        </h1>

        {/* Concentric Dot-Ring Loader */}
        <div className="relative w-[200px] h-[200px] mx-auto my-2 flex items-center justify-center">
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#E04234]/10 to-transparent blur-xl pointer-events-none" />

          <svg width="200" height="200" viewBox="0 0 220 220" className="overflow-visible select-none">
            {/* Center Nucleus */}
            <motion.circle
              cx="110"
              cy="110"
              r="7"
              animate={{
                fill: ["#E04234", "#C46853", "#141416", "#E04234"],
                scale: [1, 1.25, 1],
                opacity: [0.8, 1, 0.8],
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
              stroke="#E04234"
              strokeWidth="1"
              strokeDasharray="2 3"
              fill="none"
              animate={{
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
            {rings.map((ringDots) =>
              ringDots.map((dot) => (
                <motion.circle
                  key={dot.id}
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.r}
                  animate={{
                    fill: ["#E04234", "#C46853", "#AFA698", "#E04234"],
                    scale: [0.85, 1.3, 0.95, 0.85],
                    opacity: [0.45, 1, 0.7, 0.45],
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

        <p className="font-semibold text-[#141416] text-xs sm:text-sm tracking-tight mb-2">
          Synthesizing biometric parameters...
        </p>

        {/* Horizontal Progress Bar */}
        <div className="w-full max-w-[260px] mx-auto mb-2">
          <div className="h-1.5 w-full bg-[#FAF9F6] rounded-full overflow-hidden border border-[#EBE5DC]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#E04234] to-[#C46853]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

        {/* Status Text */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-medium text-[#71717A] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#E04234]" />
          <span>Building treatment dossier</span>
          <span className="text-[#AFA698]">({progress}%)</span>
        </div>

        {/* Body Copy */}
        <div className="space-y-3 pt-3 border-t border-[#EBE5DC] text-left">
          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EBE5DC]">
            <h4 className="text-xs font-semibold text-[#141416] mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E04234]" />
              MILC Bio-Targeted Formulation Engine
            </h4>
            <p className="text-[11px] text-[#52525B] leading-relaxed">
              Synthesizing topical actives, barrier lipid ratios, and daily micro-massage techniques tailored specifically to your skin profile.
            </p>
          </div>
        </div>

        {isDone && !autoAdvance && onComplete && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onComplete}
            className="w-full mt-4 h-12 bg-[#E04234] text-white rounded-full font-bold text-xs cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <span>Proceed to Analysis Results</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
