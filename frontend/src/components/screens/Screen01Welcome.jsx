import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, ShieldCheck, RefreshCw, Award } from "lucide-react";

export default function Screen01Welcome({ onComplete, onReplayIntro, onPreviewAnalyzing }) {
  const checklist = [
    "Extensive product recommendations",
    "Dozens of facelifting techniques",
    "Skin analysis by smart face scanner",
    "Dermatology approved skin guidance",
    "Visibly improve your skin quality",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 pb-12 pt-2"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Left Column: Visual Before & After Preview */}
          <div className="flex flex-col items-center">
            {/* Dual Day 0 vs Day 30 comparison card */}
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-none rounded-2xl overflow-hidden border border-[#EADBFA] shadow-sm bg-[#F4F7FA] p-1.5 flex gap-1.5">
              {/* Day 0 */}
              <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=360&q=80"
                  alt="Day 0 baseline"
                  className="w-full h-full object-cover grayscale-20 contrast-105"
                />
                <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-700 shadow-xs">
                  Day 0
                </span>
              </div>

              {/* Day 30 */}
              <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 ring-2 ring-[#7A35A3]/30">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=360&q=85"
                  alt="Day 30 transformation"
                  className="w-full h-full object-cover saturate-110 brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#132B45]/30 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#7A35A3] text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#8E7CC3]" />
                  Day 30
                </span>
              </div>
            </div>

            {/* Quick Proof Badges below card */}
            <div className="hidden md:flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-600 font-semibold">
              <span className="flex items-center gap-1 bg-[#F4F7FA] px-2.5 py-1 rounded-full border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4A1766]" />
                Dermatology Approved
              </span>
              <span className="flex items-center gap-1 bg-[#F4F7FA] px-2.5 py-1 rounded-full border border-slate-200">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                Proven Results
              </span>
            </div>
          </div>

          {/* Right Column: Title, Checklist, and Action */}
          <div className="text-left flex flex-col justify-center">
            <span className="inline-block md:hidden text-[10px] font-bold uppercase tracking-[0.14em] text-[#4A1766] bg-[#F4E8FC] px-2.5 py-0.5 rounded-full mb-3 self-start">
              Clinical Assessment
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 leading-tight">
              Welcome to your program with face scan analysis
            </h1>

            <p className="text-xs font-bold uppercase tracking-wider text-[#4A1766] mt-4 mb-2.5">
              The program includes
            </p>

            {/* Checklist */}
            <div className="space-y-2 mb-6 text-left">
              {checklist.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F4F7FA]/90 border border-[#EADBFA]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#F4E8FC] text-[#4A1766] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 leading-snug">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onComplete}
              className="w-full h-14 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-sm cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Start with Face Scan</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {onReplayIntro && (
              <div className="mt-3 flex items-center justify-center md:justify-start">
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="text-[11px] font-medium text-slate-400 hover:text-[#4A1766] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replay Analyzing Screen (0:00–1.5s)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
