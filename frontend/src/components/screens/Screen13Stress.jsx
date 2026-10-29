import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { STRESS_OPTIONS } from "../../data/questions";

export default function Screen13Stress({ onComplete, onBack }) {
  const { state, updateLifestyle } = useQuiz();
  const current = state?.lifestyle?.stress || "";

  const handleSelect = (id) => {
    updateLifestyle({ stress: id });
    setTimeout(() => onComplete(), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-2 text-left"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] relative overflow-hidden">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Do you often feel stressed and tense?
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-2 mb-6 sm:mb-8 leading-relaxed max-w-xl">
          Stress increases cortisol and adrenaline, causing inflammation and triggering flares in acne, eczema, or barrier breakdown.
        </p>

        {/* Single Column: One option per row */}
        <div className="max-w-md mx-auto space-y-2.5 mb-8">
          {STRESS_OPTIONS.map((item) => {
            const isSelected = current === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#7A35A3] bg-[#C883EB]/15 text-[#4A1766] font-bold shadow-xs"
                    : "border-gray-200/90 bg-white hover:border-gray-300 font-semibold text-gray-800 shadow-2xs"
                }`}
              >
                <span className="text-sm sm:text-base">{item.label}</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                    isSelected ? "border-[#7A35A3] bg-[#7A35A3]" : "border-gray-300"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Center-aligned Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-3 max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 h-12 border border-gray-200/90 text-gray-700 rounded-full font-semibold hover:bg-gray-50 text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
            <span>Back</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={!current}
            onClick={onComplete}
            className="flex-[1.5] h-12 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-sm cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
