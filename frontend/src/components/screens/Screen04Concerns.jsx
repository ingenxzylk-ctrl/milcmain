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
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl mx-auto px-4 sm:px-6 pb-12 pt-2 text-left"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] relative overflow-hidden">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          What are your skin concerns?
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-2 mb-6 sm:mb-8 leading-relaxed">
          MILC will create a treatment skincare program targeting each priority concern.
        </p>

        {/* One option in one row, full wording completely visible without truncation */}
        <div className="space-y-2.5 mb-8 max-w-md mx-auto">
          {PRIMARY_CONCERNS.map((item) => {
            const isChecked = selected.includes(item.id);
            const Icon = ICON_MAP[item.icon] || Sparkles;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => toggleConcern(item.id)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isChecked
                    ? "border-2 border-[#7A35A3] bg-[#C883EB]/15 text-[#4A1766] font-bold shadow-xs"
                    : "border-gray-200/90 bg-white hover:border-gray-300 text-gray-800 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3.5 pr-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isChecked ? "bg-[#7A35A3] text-white" : "bg-[#F4E8FC] text-[#4A1766]"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  {/* Full wording clearly displayed without truncation */}
                  <span className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                    {item.label}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                    isChecked ? "border-[#7A35A3] bg-[#7A35A3] text-white" : "border-gray-300"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Center-aligned Buttons */}
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
            disabled={selected.length === 0}
            onClick={handleNext}
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
