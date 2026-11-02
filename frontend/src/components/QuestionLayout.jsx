import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

export default function QuestionLayout({
  badge,
  title,
  subtitle,
  children,
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueDisabled = false,
  error,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl mx-auto mt-2 px-3 sm:px-4 mb-10 w-full box-border"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 md:p-10 relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* Subtle Warm Editorial Ambient Flare */}
        <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br from-[#F5EFEB]/80 to-transparent pointer-events-none blur-2xl" />

        <div className="mb-6 relative z-10">
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E3DA] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#71717A] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E3A26]" />
              {badge}
            </div>
          )}
          <h2 className="text-[26px] sm:text-[28px] md:text-[32px] font-serif font-bold text-[#18181B] leading-[1.18] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[#71717A] mt-2.5 text-xs sm:text-sm leading-relaxed max-w-lg">
              {subtitle}
            </p>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-[#FDF2F2] border border-[#F8D7D7] text-[#9E2A2B] text-xs font-medium rounded-2xl mb-5 flex items-center gap-2.5 shadow-xs"
          >
            <AlertCircle className="w-4 h-4 text-[#9E2A2B] shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="relative z-10 space-y-3">{children}</div>

        <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#F0EBE1] w-full relative z-10">
          {onBack && (
            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onBack}
              className="h-12 px-4 sm:px-5 rounded-full border border-[#E8E3DA] bg-[#FAF8F5] text-[#52525B] text-xs sm:text-sm font-semibold hover:bg-[#F2ECE3] hover:text-[#18181B] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>
          )}

          {onContinue && (
            <motion.button
              whileHover={!continueDisabled ? { scale: 1.015, y: -1 } : {}}
              whileTap={!continueDisabled ? { scale: 0.98 } : {}}
              type="button"
              onClick={onContinue}
              disabled={continueDisabled}
              className={`h-12 px-6 rounded-full font-bold text-xs sm:text-sm flex-1 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(158,58,38,0.22)] ${
                continueDisabled
                  ? "bg-[#EAE5DC] text-[#A8A193] cursor-not-allowed shadow-none"
                  : "bg-[#9E3A26] hover:bg-[#832C1B] text-white hover:shadow-[0_12px_24px_-4px_rgba(158,58,38,0.3)]"
              }`}
            >
              <span>{continueLabel}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
