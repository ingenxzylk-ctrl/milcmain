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
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-2"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] text-center relative overflow-hidden">
        {/* User Photo Avatar if scanned */}
        {userPhoto && (
          <div className="flex justify-center mb-3">
            <div className="relative">
              <img
                src={userPhoto}
                alt="Your biometric scan"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#7A35A3] shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </span>
            </div>
          </div>
        )}

        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#4A1766] bg-[#F4E8FC] px-3.5 py-1 rounded-full mb-3 inline-block">
          Milestone Calibration
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Your profile is ready
        </h2>

        {/* Dashboard 2-Card Row on tablet & desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-left">
          {/* 75/100 Score Gauge Pill */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between gap-4 shadow-2xs">
            <div>
              <span className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Balanced Glow Baseline
              </span>
              <p className="text-[11px] sm:text-xs text-emerald-700 mt-1 leading-snug">
                Cellular baseline is strong. Targeted hydration and photostable SPF can elevate your glow significantly.
              </p>
            </div>
            <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-emerald-300 flex items-center justify-center font-serif text-base sm:text-lg font-bold text-emerald-800 shadow-2xs">
              75<span className="text-[10px] text-emerald-500 font-sans">/100</span>
            </div>
          </div>

          {/* 93% Fit Curve Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F7FA] border border-[#EADBFA] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#4A1766]" />
                Treatment Match Index
              </span>
              <span className="font-serif text-lg sm:text-xl font-bold text-[#4A1766]">93% Fit</span>
            </div>

            {/* Milestone Trajectory Steps */}
            <div className="relative flex justify-between items-center text-[10px] sm:text-xs font-semibold text-slate-500 pt-2">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#EADBFA] -translate-y-1/2 -z-0" />
              <div className="relative z-10 bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[#4A1766] font-bold">
                Smoother skin
              </div>
              <div className="relative z-10 bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-700">
                Pore calm
              </div>
              <div className="relative z-10 bg-[#7A35A3] text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                Your best skin
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm mb-7 leading-relaxed max-w-lg mx-auto">
          Your facial scan & lifestyle metrics yield a <span className="font-bold text-[#4A1766]">93% clinical match</span>. Next, review your projected 28-day skin renewal trajectory.
        </p>

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
            className="flex-[1.8] h-12 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-sm cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>See 28-Day Projection</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
