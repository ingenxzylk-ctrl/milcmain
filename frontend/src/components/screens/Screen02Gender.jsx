import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { GENDER_OPTIONS } from "../../data/questions";

export default function Screen02Gender({ onComplete, onBack }) {
  const { state, updateAboutMe } = useQuiz();
  const current = state?.aboutMe?.gender || "";

  const handleSelect = (id) => {
    updateAboutMe({ gender: id });
    setTimeout(() => onComplete(), 280);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl mx-auto px-2 sm:px-6 pb-10 pt-1 sm:pt-2 text-left"
    >
      <div className="atelier-card rounded-[24px] sm:rounded-[36px] p-5 sm:p-8 md:p-10 relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* Soft Lavender ambient bloom */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-br from-[#CD92EB]/18 via-[#CD92EB]/5 to-transparent pointer-events-none blur-3xl" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#EBE5DC] text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] mb-3 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_6px_#D4FF3F]" />
          BIOMETRICS · STEP 03
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141416] leading-tight">
          What gender do you identify with?
        </h2>
        <p className="text-[#71717A] text-xs sm:text-sm mt-2 mb-6 sm:mb-8 leading-relaxed max-w-lg">
          Hormonal profiles fundamentally dictate sebum production rate, epidermal thickness, and cellular turnover.
        </p>

        {/* Options */}
        <div className="space-y-2.5 sm:space-y-3 mb-8 max-w-md mx-auto">
          {GENDER_OPTIONS.map((g, idx) => {
            const isSelected = current === g.id;
            return (
              <motion.button
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + idx * 0.04, duration: 0.3 }}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => handleSelect(g.id)}
                className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#CD92EB] bg-white ring-2 ring-[#CD92EB]/30 shadow-[0_8px_24px_-6px_rgba(205,146,235,0.25)]"
                    : "border-[#EBE5DC] bg-[#FAF9F6] hover:border-[#CD92EB]/60 hover:bg-white shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                      isSelected ? "bg-[#CD92EB] text-[#141416]" : "bg-white border border-[#EBE5DC] text-[#52525B]"
                    }`}
                  >
                    {g.label.charAt(0)}
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-[#141416]">{g.label}</p>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "border-[#CD92EB] bg-[#CD92EB]" : "border-[#D8D0C3] bg-white"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#D4FF3F] shadow-[0_0_4px_#D4FF3F]" />}
                </div>
              </motion.button>
            );
          })}
        </div>

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
            whileHover={current ? { scale: 1.015, y: -1 } : {}}
            whileTap={current ? { scale: 0.98 } : {}}
            type="button"
            disabled={!current}
            onClick={onComplete}
            className="flex-[1.5] h-11 sm:h-12 bg-[#E04234] hover:bg-[#C73024] text-white rounded-full font-bold text-xs sm:text-sm cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-[0_8px_20px_-4px_rgba(224,66,52,0.3)] hover:shadow-[0_12px_24px_-4px_rgba(224,66,52,0.42)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
