import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, ShieldCheck, RefreshCw, Award } from "lucide-react";

export default function Screen01Welcome({ onComplete, onReplayIntro, onPreviewAnalyzing }) {
  const checklist = [
    "Dermatology-certified facial topography scan",
    "Tailored 2-step barrier repair protocol",
    "Clinical 11-condition biomarker audit",
    "Dozens of targeted facial massage techniques",
    "Measurable skin density & hydration improvements",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-3 sm:px-6 pb-12 pt-2"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* Subtle Warm Atmospheric Light Flare */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-br from-[#F5EFEB]/80 to-transparent pointer-events-none blur-3xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Visual Before & After Preview */}
          <div className="flex flex-col items-center">
            {/* Dual Day 0 vs Day 30 comparison card */}
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-none rounded-2xl overflow-hidden border border-[#E8E3DA] shadow-xs bg-[#FAF8F5] p-2 flex gap-2">
              {/* Day 0 */}
              <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-[#EAE5DC]">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=360&q=80"
                  alt="Day 0 baseline"
                  className="w-full h-full object-cover grayscale contrast-105"
                />
                <div className="absolute inset-0 bg-[#18181B]/15 pointer-events-none" />
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-white/95 text-[9px] font-mono font-bold tracking-wider uppercase text-[#18181B] shadow-xs">
                  Day 00
                </span>
              </div>

              {/* Day 30 */}
              <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-[#EAE5DC] ring-2 ring-[#9E3A26]/30">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=360&q=85"
                  alt="Day 30 transformation"
                  className="w-full h-full object-cover saturate-110 brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/30 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#9E3A26] text-white text-[9px] font-mono font-bold tracking-wider uppercase shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#E8CEC5]" />
                  Day 30
                </span>
              </div>
            </div>

            {/* Quick Proof Badges below card */}
            <div className="hidden md:flex items-center justify-center gap-2.5 mt-5 text-[11px] text-[#52525B]">
              <span className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E8E3DA] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
                Dermatologist Verified
              </span>
              <span className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E8E3DA] font-medium">
                <Award className="w-3.5 h-3.5 text-[#9E3A26]" />
                Clinical Formulation
              </span>
            </div>
          </div>

          {/* Right Column: Title, Checklist, and Action */}
          <div className="text-left flex flex-col justify-center">
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#71717A] bg-[#FAF8F5] border border-[#E8E3DA] px-3 py-1 rounded-full mb-3.5 self-start">
              Biometric Consultation
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181B] leading-[1.15] tracking-tight">
              Personalized skin health powered by AI face scan
            </h1>

            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9E3A26] mt-4 mb-3">
              Included in your protocol:
            </p>

            {/* Checklist */}
            <div className="space-y-2 mb-7 text-left">
              {checklist.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + idx * 0.04, duration: 0.3 }}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA]/80 hover:border-[#D5CFC3] transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#E8F0EA] text-[#2D5A43] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-semibold text-[#18181B] leading-snug">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onComplete}
              className="w-full h-13 bg-[#9E3A26] hover:bg-[#832C1B] text-white rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-[0_8px_20px_-4px_rgba(158,58,38,0.25)] hover:shadow-[0_12px_24px_-4px_rgba(158,58,38,0.32)] transition-all flex items-center justify-center gap-2"
            >
              <span>Begin Face Scan Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {onReplayIntro && (
              <div className="mt-3.5 flex items-center justify-center md:justify-start">
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="text-[11px] font-mono text-[#A8A193] hover:text-[#18181B] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replay Introduction Scan</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
