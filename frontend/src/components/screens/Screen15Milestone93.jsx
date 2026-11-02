import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";

export default function Screen15Milestone93({ onComplete, onBack }) {
  const { state } = useQuiz();
  const name = state?.aboutMe?.fullName || "Client";
  const userPhoto = (state?.faceImages || []).find((img) => img?.dataUrl)?.dataUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 pb-12 pt-2"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* User Photo Avatar if scanned */}
        {userPhoto && (
          <div className="flex justify-center mb-3.5">
            <div className="relative">
              <img
                src={userPhoto}
                alt="Your biometric scan"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#9E3A26] shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#2D5A43] border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </span>
            </div>
          </div>
        )}

        <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-1 rounded-full mb-3 inline-block shadow-2xs">
          SYNTHESIS · STEP 15
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#18181B] leading-tight">
          Your profile calibration is complete
        </h2>

        {/* Dashboard 2-Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-left">
          {/* Baseline Score Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF4F0] border border-[#CCE0D4] flex items-center justify-between gap-4 shadow-2xs">
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#2D5A43] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" />
                Cellular Baseline Health
              </span>
              <p className="text-[11px] text-[#2D5A43]/85 mt-1 leading-snug">
                Epidermal baseline is stable. Precision lipid replenishment will amplify cellular regeneration and barrier resilience.
              </p>
            </div>
            <div className="shrink-0 w-13 h-13 rounded-full bg-white border border-[#CCE0D4] flex items-center justify-center font-serif text-base sm:text-lg font-bold text-[#2D5A43] shadow-2xs">
              75<span className="text-[10px] text-[#2D5A43]/60 font-sans">/100</span>
            </div>
          </div>

          {/* Treatment Match Index */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-bold text-[#18181B] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#9E3A26]" />
                Treatment Match Index
              </span>
              <span className="font-serif text-lg sm:text-xl font-bold text-[#9E3A26]">93% Fit</span>
            </div>

            {/* Trajectory Steps */}
            <div className="relative flex justify-between items-center text-[10px] sm:text-xs font-mono font-medium text-[#71717A] pt-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E8E3DA] -translate-y-1/2 -z-0" />
              <div className="relative z-10 bg-white px-2.5 py-0.5 rounded-full border border-[#E8E3DA] text-[#18181B] font-semibold">
                Week 01
              </div>
              <div className="relative z-10 bg-white px-2.5 py-0.5 rounded-full border border-[#E8E3DA] text-[#52525B]">
                Week 02
              </div>
              <div className="relative z-10 bg-[#9E3A26] text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                Week 04 Peak
              </div>
            </div>
          </div>
        </div>

        <p className="text-[#52525B] text-xs sm:text-sm mb-7 leading-relaxed max-w-lg mx-auto">
          Your facial scan and environmental parameters yield a <span className="font-bold text-[#9E3A26]">93% clinical match</span>. Review your 28-day cellular renewal projection below.
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex items-center justify-between gap-3 max-w-md mx-auto pt-5 border-t border-[#F0EBE1]">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 h-12 border border-[#E8E3DA] bg-[#FAF8F5] text-[#52525B] rounded-full font-semibold hover:bg-[#F2ECE3] hover:text-[#18181B] text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onComplete}
            className="flex-[1.6] h-12 bg-[#9E3A26] hover:bg-[#832C1B] text-white rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-[0_8px_20px_-4px_rgba(158,58,38,0.22)] hover:shadow-[0_12px_24px_-4px_rgba(158,58,38,0.3)] flex items-center justify-center gap-2 transition-all"
          >
            <span>See 28-Day Trajectory</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
