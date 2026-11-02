import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { computeResultsData } from "../../utils/scoringEngine";

export default function Screen15Milestone93({ onComplete, onBack }) {
  const { state } = useQuiz();
  const name = state?.aboutMe?.fullName || "Client";
  const userPhoto = (state?.faceImages || []).find((img) => img?.dataUrl)?.dataUrl;

  const results = useMemo(() => computeResultsData(state), [state]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-6 pb-10 pt-1 sm:pt-2"
    >
      <div className="atelier-card rounded-[24px] sm:rounded-[36px] p-5 sm:p-8 md:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* User Photo Avatar if scanned */}
        {userPhoto && (
          <div className="flex justify-center mb-3">
            <div className="relative">
              <img
                src={userPhoto}
                alt="Your biometric scan"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#CD92EB] shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D4FF3F] border-2 border-white flex items-center justify-center text-[#141416] shadow-2xs">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
              </span>
            </div>
          </div>
        )}

        <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-3.5 py-1 rounded-full mb-3 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_6px_#D4FF3F]" />
          SYNTHESIS · STEP 15
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141416] leading-tight">
          Your profile calibration is complete
        </h2>

        {/* Dashboard 2-Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 my-5 sm:my-6 text-left">
          {/* Baseline Score Card - Lavender Silk Surface */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F0FC] border border-[#E2BDF5] flex items-center justify-between gap-4 shadow-2xs">
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#141416] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#CD92EB] shrink-0" />
                Skin Baseline Health
              </span>
              <p className="text-[11px] text-[#52525B] mt-1 leading-snug">
                Epidermal baseline is stable. Precision lipid replenishment will amplify skin hydration and barrier resilience.
              </p>
            </div>
            <div className="shrink-0 w-13 h-13 rounded-full bg-white border border-[#E2BDF5] flex items-center justify-center font-serif text-base sm:text-lg font-bold text-[#141416] shadow-2xs">
              {results.overallScore}<span className="text-[10px] text-[#71717A] font-sans">/100</span>
            </div>
          </div>

          {/* Treatment Match Index - Chartreuse Highlight */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#EBE5DC] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-bold text-[#141416] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#E04234]" />
                Treatment Match Index
              </span>
              <span className="badge-chartreuse px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider">
                {results.derivedFitIndex}% FIT
              </span>
            </div>

            {/* Trajectory Steps */}
            <div className="relative flex justify-between items-center text-[10px] sm:text-xs font-mono font-medium text-[#71717A] pt-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#EBE5DC] -translate-y-1/2 -z-0" />
              <div className="relative z-10 bg-white px-2.5 py-0.5 rounded-full border border-[#EBE5DC] text-[#141416] font-semibold">
                Week 01
              </div>
              <div className="relative z-10 bg-white px-2.5 py-0.5 rounded-full border border-[#EBE5DC] text-[#52525B]">
                Week 02
              </div>
              <div className="relative z-10 bg-[#E04234] text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                Week 04 Peak
              </div>
            </div>
          </div>
        </div>

        <p className="text-[#52525B] text-xs sm:text-sm mb-6 leading-relaxed max-w-lg mx-auto">
          Your facial scan and environmental parameters yield a <span className="font-bold text-[#E04234]">{results.derivedFitIndex}% profile match</span>. Review your 28-day skin renewal projection below.
        </p>

        {/* Action Controls */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between gap-2.5 sm:gap-3 max-w-md mx-auto pt-4 sm:pt-5 border-t border-[#EBE5DC]">
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
            <span>See 28-Day Renewal Projection</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
