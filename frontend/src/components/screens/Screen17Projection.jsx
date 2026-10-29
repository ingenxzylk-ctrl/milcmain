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
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-2"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] text-center relative overflow-hidden">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Get the most radiant version of your skin
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-[#4A1766] mt-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#8E7CC3]" />
          <span>AI Clinical Prediction based on your goals</span>
        </p>

        {/* Dual Side-by-Side Comparison */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 my-6">
          {/* Card Now */}
          <div className="rounded-2xl border border-[#EADBFA] bg-[#F4F7FA] p-2.5 sm:p-4 text-left shadow-2xs">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 sm:mb-3 bg-gray-100">
              <img
                src={userPhoto || fallbackModel}
                alt="Current face baseline"
                className="w-full h-full object-cover grayscale-15 contrast-105"
              />
              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] sm:text-xs font-bold text-slate-700 shadow-xs">
                Now
              </span>
            </div>

            <div className="space-y-2 px-1 py-1">
              <div>
                <div className="flex justify-between text-[11px] sm:text-xs font-bold">
                  <span className="text-slate-500">Hydration</span>
                  <span className="text-amber-700">59%</span>
                </div>
                <div className="w-full h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-amber-500 rounded-full w-[59%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] sm:text-xs font-bold">
                  <span className="text-slate-500">Elasticity</span>
                  <span className="text-red-700">37%</span>
                </div>
                <div className="w-full h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-red-400 rounded-full w-[37%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card Your Goal */}
          <div className="rounded-2xl border-2 border-[#7A35A3] bg-white p-2.5 sm:p-4 text-left shadow-sm">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 sm:mb-3 bg-gray-100 ring-1 ring-[#7A35A3]/30">
              <img
                src={userPhoto || fallbackModel}
                alt="Target glow outcome"
                className="w-full h-full object-cover brightness-105 saturate-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#132B45]/20 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#7A35A3] text-white text-[10px] sm:text-xs font-bold shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#8E7CC3]" />
                Your goal
              </span>
            </div>

            <div className="space-y-2 px-1 py-1">
              <div>
                <div className="flex justify-between text-[11px] sm:text-xs font-bold">
                  <span className="text-slate-500">Hydration</span>
                  <span className="text-emerald-700">93%</span>
                </div>
                <div className="w-full h-1.5 sm:h-2 bg-emerald-100 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-emerald-500 rounded-full w-[93%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] sm:text-xs font-bold">
                  <span className="text-slate-500">Elasticity</span>
                  <span className="text-emerald-700">87%</span>
                </div>
                <div className="w-full h-1.5 sm:h-2 bg-emerald-100 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-emerald-500 rounded-full w-[87%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

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
            onClick={onComplete}
            className="flex-[1.5] h-12 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-sm cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
