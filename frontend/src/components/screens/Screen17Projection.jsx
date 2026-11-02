import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ChevronLeft, ShieldCheck, TrendingUp, Droplets, Activity } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { computeResultsData } from "../../utils/scoringEngine";

export default function Screen17Projection({ onComplete, onBack }) {
  const { state } = useQuiz();
  const results = computeResultsData(state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 pb-6 pt-1 sm:pt-2"
    >
      <div className="atelier-card rounded-[24px] sm:rounded-[36px] p-5 sm:p-7 md:p-8 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-3.5 py-1 rounded-full mb-3 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_6px_#D4FF3F]" />
          PROJECTION · STEP 16
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141416] leading-tight">
          Your projected skin trajectory
        </h2>
        <p className="text-xs sm:text-sm font-mono font-medium text-[#E04234] mt-1.5 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E04234]" />
          <span>Expected 28-day response with targeted active routine</span>
        </p>

        {/* Honest Metric Projections Grid (Option B - honest data bars, no filtered photo trick) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 my-5 text-left">
          {/* Hydration Bar */}
          <div className="rounded-2xl border border-[#EBE5DC] bg-[#FAF9F6] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-[#141416]">
                <Droplets className="w-4 h-4 text-[#CD92EB]" />
                <span>Hydration & Moisture Barrier</span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white border border-[#EBE5DC] text-[#71717A]">
                Day 0 → Day 28
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#71717A] mb-1">
                  <span>Current Baseline</span>
                  <span className="font-bold text-[#141416]">{results.currentHydration}%</span>
                </div>
                <div className="w-full h-2 bg-[#EBE5DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CD92EB] rounded-full transition-all duration-700"
                    style={{ width: `${results.currentHydration}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#141416] mb-1">
                  <span className="flex items-center gap-1 font-bold text-[#E04234]">
                    <TrendingUp className="w-3.5 h-3.5 text-[#E04234]" />
                    Projected Goal
                  </span>
                  <span className="font-bold text-[#E04234]">{results.projectedHydration}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#EBE5DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#CD92EB] via-[#E04234] to-[#D4FF3F] rounded-full shadow-[0_0_8px_#D4FF3F]"
                    style={{ width: `${results.projectedHydration}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#71717A] mt-2.5 leading-relaxed font-sans">
              Strengthened lipid barrier with consistent daily hydration and gentle cleansing.
            </p>
          </div>

          {/* Elasticity Bar */}
          <div className="rounded-2xl border border-[#EBE5DC] bg-[#FAF9F6] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-[#141416]">
                <Activity className="w-4 h-4 text-[#E04234]" />
                <span>Skin Elasticity & Bounce</span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white border border-[#EBE5DC] text-[#71717A]">
                Day 0 → Day 28
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#71717A] mb-1">
                  <span>Current Baseline</span>
                  <span className="font-bold text-[#141416]">{results.currentElasticity}%</span>
                </div>
                <div className="w-full h-2 bg-[#EBE5DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CD92EB]/80 rounded-full transition-all duration-700"
                    style={{ width: `${results.currentElasticity}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#141416] mb-1">
                  <span className="flex items-center gap-1 font-bold text-[#E04234]">
                    <TrendingUp className="w-3.5 h-3.5 text-[#E04234]" />
                    Projected Goal
                  </span>
                  <span className="font-bold text-[#E04234]">{results.projectedElasticity}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#EBE5DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#CD92EB] via-[#E04234] to-[#D4FF3F] rounded-full shadow-[0_0_8px_#D4FF3F]"
                    style={{ width: `${results.projectedElasticity}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#71717A] mt-2.5 leading-relaxed font-sans">
              Collagen support and surface smoothing from peptide nourishment and UV protection.
            </p>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <p className="text-[11px] text-[#71717A] italic max-w-md mx-auto mb-4">
          Projection is an estimate based on your skin profile, not a guaranteed medical result. Individual response may vary.
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
