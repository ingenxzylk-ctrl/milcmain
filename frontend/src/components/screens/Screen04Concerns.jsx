import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  Check,
  Flame,
  Droplets,
  Activity,
  Sun,
  Waves,
  Sliders,
  Sparkles,
  Eye,
  Shield,
  Wind,
  Droplet,
  Layers,
  CircleDot,
  Smile,
  User,
  Moon,
  TrendingDown,
} from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { PRIMARY_CONCERNS } from "../../data/questions";

const ICON_MAP = {
  Flame,
  Droplets,
  Activity,
  Sun,
  Waves,
  Sliders,
  Sparkles,
  Eye,
  Shield,
  Wind,
  Droplet,
  Layers,
  CircleDot,
  Smile,
  User,
  Moon,
  TrendingDown,
};

export default function Screen04Concerns({ onComplete, onBack }) {
  const { state, updateSkinProfile } = useQuiz();
  const [selected, setSelected] = useState(state?.skinProfile?.concerns || []);

  const toggleConcern = (id) => {
    if (id === "none") {
      setSelected((prev) => (prev.includes("none") ? [] : ["none"]));
      return;
    }
    setSelected((prev) => {
      const filtered = prev.filter((x) => x !== "none");
      return filtered.includes(id)
        ? filtered.filter((x) => x !== id)
        : [...filtered, id];
    });
  };

  const handleNext = () => {
    updateSkinProfile({ concerns: selected });
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl mx-auto px-3 sm:px-6 pb-12 pt-2 text-left"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 relative overflow-hidden bg-white/95 backdrop-blur-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E3DA] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#71717A] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9E3A26]" />
          PRIMARY TARGETS · STEP 05
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#18181B] leading-tight">
          What are your skin concerns?
        </h2>
        <p className="text-[#71717A] text-xs sm:text-sm mt-2 mb-6 sm:mb-8 leading-relaxed max-w-lg">
          Select all that apply. MILC will engineer a precision protocol targeting your active concerns.
        </p>

        {/* Options */}
        <div className="space-y-2.5 mb-8 max-w-md mx-auto">
          {PRIMARY_CONCERNS.map((item, idx) => {
            const isChecked = selected.includes(item.id);
            const Icon = ICON_MAP[item.icon] || Sparkles;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 + idx * 0.03, duration: 0.28 }}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => toggleConcern(item.id)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isChecked
                    ? "border-[#9E3A26] bg-[#FDF9F7] ring-1 ring-[#9E3A26]/20 shadow-xs"
                    : "border-[#E8E3DA] bg-[#FAF8F5] hover:border-[#D5CFC3] hover:bg-[#F5EFEB] shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3.5 pr-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? "bg-[#9E3A26] text-white"
                        : "bg-white border border-[#E8E3DA] text-[#52525B]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#18181B] leading-snug">
                    {item.label}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                    isChecked
                      ? "border-[#9E3A26] bg-[#9E3A26] text-white"
                      : "border-[#D5CFC3] bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </motion.button>
            );
          })}
        </div>

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
            whileHover={selected.length > 0 ? { scale: 1.015, y: -1 } : {}}
            whileTap={selected.length > 0 ? { scale: 0.98 } : {}}
            type="button"
            disabled={selected.length === 0}
            onClick={handleNext}
            className={`flex-[1.4] h-12 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(158,58,38,0.22)] ${
              selected.length > 0
                ? "bg-[#9E3A26] hover:bg-[#832C1B] text-white"
                : "bg-[#EAE5DC] text-[#A8A193] cursor-not-allowed shadow-none"
            }`}
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
