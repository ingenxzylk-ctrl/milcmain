import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ChevronLeft } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";

export default function Screen17Projection({ onComplete, onBack }) {
  const { state } = useQuiz();
  const userPhoto = (state?.faceImages || []).find((img) => img?.dataUrl)?.dataUrl;
  const fallbackModel = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-6 pb-10 pt-1 sm:pt-2"
    >
      <div className="atelier-card rounded-[24px] sm:rounded-[36px] p-5 sm:p-8 md:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-3.5 py-1 rounded-full mb-3 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_6px_#D4FF3F]" />
          PROJECTION · STEP 16
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141416] leading-tight">
          Your projected skin transformation
        </h2>
        <p className="text-xs sm:text-sm font-mono font-medium text-[#E04234] mt-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E04234]" />
          <span>Clinical Trajectory Model based on your cellular profile</span>
        </p>

        {/* Dual Side-by-Side Comparison */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 my-5 sm:my-6">
          {/* Card Now */}
          <div className="rounded-2xl border border-[#EBE5DC] bg-[#FAF9F6] p-2 sm:p-4 text-left shadow-2xs">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 sm:mb-3 bg-[#EAE5DC]">
              <img
                src={userPhoto || fallbackModel}
                alt="Current face baseline"
                className="w-full h-full object-cover grayscale contrast-105"
              />
              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-white/95 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#141416] shadow-xs">
                Day 00
              </span>
            </div>

            <div className="space-y-2 px-1 py-1 font-mono">
              <div>
                <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold">
                  <span className="text-[#71717A]">Hydration</span>
                  <span className="text-[#E04234]">59%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EBE5DC] rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-[#E04234] rounded-full w-[59%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold">
                  <span className="text-[#71717A]">Elasticity</span>
                  <span className="text-[#E04234]">37%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EBE5DC] rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-[#E04234]/70 rounded-full w-[37%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card Your Goal */}
          <div className="rounded-2xl border-2 border-[#CD92EB] bg-white p-2 sm:p-4 text-left shadow-[0_8px_24px_-6px_rgba(205,146,235,0.25)]">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 sm:mb-3 bg-[#EAE5DC] ring-1 ring-[#CD92EB]/50">
              <img
                src={userPhoto || fallbackModel}
                alt="Target glow outcome"
                className="w-full h-full object-cover brightness-105 saturate-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141416]/20 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#E04234] text-white text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#D4FF3F]" />
                Day 28 Goal
              </span>
            </div>

            <div className="space-y-2 px-1 py-1 font-mono">
              <div>
                <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold">
                  <span className="text-[#71717A]">Hydration</span>
                  <span className="text-[#141416] font-bold">93%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EBE5DC] rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-[#D4FF3F] rounded-full w-[93%] shadow-[0_0_6px_#D4FF3F]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold">
                  <span className="text-[#71717A]">Elasticity</span>
                  <span className="text-[#141416] font-bold">87%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EBE5DC] rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-[#D4FF3F] rounded-full w-[87%] shadow-[0_0_6px_#D4FF3F]" />
                </div>
              </div>
            </div>
          </div>
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
