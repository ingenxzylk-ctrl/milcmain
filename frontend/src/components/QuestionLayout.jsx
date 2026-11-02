import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight, AlertCircle } from "lucide-react";

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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl mx-auto mt-1 sm:mt-3 px-2 sm:px-4 mb-8 sm:mb-12 w-full box-border"
    >
      <div className="atelier-card rounded-[24px] sm:rounded-[32px] p-4.5 sm:p-7 md:p-9 relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* Soft Lavender ambient bloom in corner */}
        <div className="absolute -top-20 -right-20 w-48 sm:w-56 h-48 sm:h-56 rounded-full bg-gradient-to-br from-[#CD92EB]/18 via-[#CD92EB]/5 to-transparent pointer-events-none blur-2xl" />

        <div className="mb-5 sm:mb-6 relative z-10">
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#EBE5DC] text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] mb-2.5 sm:mb-3 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_6px_#D4FF3F]" />
              {badge}
            </div>
          )}
          <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-serif font-bold text-[#141416] leading-[1.2] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[#71717A] mt-2 text-xs sm:text-sm leading-relaxed max-w-lg">
              {subtitle}
            </p>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 sm:p-3.5 bg-[#FDF0EE] border border-[#F8D2CE] text-[#E04234] text-xs font-medium rounded-2xl mb-4 sm:mb-5 flex items-center gap-2.5 shadow-xs"
          >
            <AlertCircle className="w-4 h-4 text-[#E04234] shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="relative z-10 space-y-2.5 sm:space-y-3">{children}</div>

        <div className="flex items-center gap-2.5 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[#EBE5DC] w-full relative z-10">
          {onBack && (
            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onBack}
              className="h-11 sm:h-12 px-3.5 sm:px-5 rounded-full border border-[#EBE5DC] bg-[#FAF9F6] text-[#52525B] text-xs sm:text-sm font-semibold hover:border-[#CD92EB] hover:text-[#141416] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
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
              className={`h-11 sm:h-12 px-5 sm:px-6 rounded-full font-bold text-xs sm:text-sm flex-1 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(224,66,52,0.3)] ${
                continueDisabled
                  ? "bg-[#EAE5DC] text-[#AFA698] cursor-not-allowed shadow-none"
                  : "bg-[#E04234] hover:bg-[#C73024] text-white hover:shadow-[0_12px_24px_-4px_rgba(224,66,52,0.42)]"
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
