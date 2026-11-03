import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ChevronLeft, ShieldCheck, TrendingUp, Droplets, Activity } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { computeResultsData } from "../../utils/scoringEngine";

export default function Screen17Projection({ onComplete, onBack }) {
  const { state } = useQuiz();
  const results = computeResultsData(state);
  const userPhoto = (state?.faceImages || []).find((img) => img?.dataUrl)?.dataUrl;
  const fallbackModel = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80";
  const photoSrc = userPhoto || fallbackModel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 pb-6 pt-1 sm:pt-2"
    >
      <div className="atelier-card rounded-[24px] sm:rounded-[36px] p-4.5 sm:p-7 md:p-8 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-3.5 py-1 rounded-full mb-2.5 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_6px_#D4FF3F]" />
          PROJECTION · STEP 16
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141416] leading-tight">
          Your projected skin trajectory
        </h2>
        <p className="text-xs sm:text-sm font-mono font-medium text-[#E04234] mt-1 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E04234]" />
          <span>Expected 28-day response with targeted active routine</span>
        </p>

        {/* Dual Side-by-Side Comparison (Before & After) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-5 my-4 sm:my-5 text-left">
          {/* Card Before: Baseline */}
          <div className="rounded-2xl border border-[#EBE5DC] bg-[#FAF9F6] p-2.5 sm:p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-xl overflow-hidden mb-2.5 bg-[#EAE5DC]">
                <img
                  src={photoSrc}
                  alt="Current skin baseline"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#141416] shadow-xs">
                  Day 00 · Baseline
                </span>
              </div>

              <div className="space-y-2 px-0.5 font-mono">
                <div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-[#71717A] mb-0.5">
                    <span>Hydration</span>
                    <span className="font-bold text-[#141416]">{results.currentHydration}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EBE5DC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#CD92EB] rounded-full"
                      style={{ width: `${results.currentHydration}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-[#71717A] mb-0.5">
                    <span>Elasticity</span>
                    <span className="font-bold text-[#141416]">{results.currentElasticity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EBE5DC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#CD92EB]/80 rounded-full"
                      style={{ width: `${results.currentElasticity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] sm:text-[11px] text-[#71717A] mt-2 leading-tight font-sans hidden sm:block">
              Current surface baseline before targeted protocol.
            </p>
          </div>

          {/* Card After: Projected Glow (Brightened) */}
          <div className="rounded-2xl border border-[#CD92EB]/40 bg-[#FAF9F6] p-2.5 sm:p-4 shadow-2xs flex flex-col justify-between ring-1 ring-[#CD92EB]/30">
            <div>
              <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-xl overflow-hidden mb-2.5 bg-[#EAE5DC]">
                <img
                  src={photoSrc}
                  alt="Target glow outcome"
                  className="w-full h-full object-cover brightness-110 contrast-102 saturate-105"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#E04234] text-white text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#D4FF3F]" />
                  Day 28 Goal
                </span>
              </div>

              <div className="space-y-2 px-0.5 font-mono">
                <div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-[#141416] mb-0.5">
                    <span className="flex items-center gap-1 text-[#E04234] font-bold">
                      <TrendingUp className="w-3 h-3 text-[#E04234]" />
                      Hydration
                    </span>
                    <span className="font-bold text-[#E04234]">{results.projectedHydration}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EBE5DC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#CD92EB] via-[#E04234] to-[#D4FF3F] rounded-full shadow-[0_0_6px_#D4FF3F]"
                      style={{ width: `${results.projectedHydration}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-[#141416] mb-0.5">
                    <span className="flex items-center gap-1 text-[#E04234] font-bold">
                      <TrendingUp className="w-3 h-3 text-[#E04234]" />
                      Elasticity
                    </span>
                    <span className="font-bold text-[#E04234]">{results.projectedElasticity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EBE5DC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#CD92EB] via-[#E04234] to-[#D4FF3F] rounded-full shadow-[0_0_6px_#D4FF3F]"
                      style={{ width: `${results.projectedElasticity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] sm:text-[11px] text-[#71717A] mt-2 leading-tight font-sans hidden sm:block">
              Projected barrier hydration and surface radiance with routine.
            </p>
          </div>
        </div>

        {/* Illustrative Transparency Disclaimer */}
        <p className="text-[10px] sm:text-[11px] text-[#71717A] italic max-w-md mx-auto mb-3">
          Illustrative trajectory projection based on your skin profile. Individual response may vary.
        </p>

        {/* Action Controls - sticky / always visible on small viewports */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-3 max-w-md mx-auto pt-3 border-t border-[#EBE5DC]">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 h-11 sm:h-12 border border-[#EBE5DC] bg-[#FAF9F6] text-[#52525B] rounded-full font-semibold hover:border-[#CD92EB] hover:text-[#141416] text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onComplete}
            className="flex-[1.5] h-11 sm:h-12 bg-[#E04234] hover:bg-[#C73024] text-white rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-[0_8px_20px_-4px_rgba(224,66,52,0.3)] hover:shadow-[0_12px_24px_-4px_rgba(224,66,52,0.42)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
