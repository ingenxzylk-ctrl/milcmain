import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight, AlertCircle, Check } from "lucide-react";

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
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-xl mx-auto mt-3 px-4 mb-8 w-full box-border"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(122,53,163,0.08)] border border-[#EADBFA] w-full relative overflow-hidden">
        {/* Subtle decorative luxury ambient glow inside top of card */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#C883EB]/25 to-transparent pointer-events-none blur-2xl" />

        <div className="mb-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-[#1E2700] uppercase bg-[#D4FF3F] border border-[#BDE820] px-3.5 py-1.5 rounded-full shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E2700]" />
            {badge}
          </span>
          <h2 className="text-[26px] md:text-[28px] font-bold text-gray-900 mt-4 leading-tight font-serif tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-lg">
              {subtitle}
            </p>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 bg-red-50/90 border border-red-200/80 text-red-800 text-xs font-medium rounded-2xl mb-5 flex items-center gap-2.5 shadow-xs"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="relative z-10 space-y-3">{children}</div>

        <div className="flex items-center gap-3.5 mt-8 pt-4 border-t border-gray-100 w-full relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 h-13 border border-gray-200/90 text-gray-600 rounded-full font-semibold hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer text-sm flex items-center justify-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </motion.button>
          <motion.button
            whileHover={!continueDisabled ? { scale: 1.02 } : {}}
            whileTap={!continueDisabled ? { scale: 0.98 } : {}}
            type="button"
            disabled={continueDisabled}
            onClick={onContinue}
            className="flex-[2] h-13 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold hover:shadow-lg hover:shadow-[#E34234]/25 transition-all text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 shadow-md shadow-[#E34234]/20"
          >
            <span>{continueLabel}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export function OptionButton({ selected, onClick, label, desc, multi }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-4 transition-all duration-200 cursor-pointer relative overflow-hidden group ${
        selected
          ? "border-2 border-[#7A35A3] bg-gradient-to-r from-[#C883EB]/15 to-[#C883EB]/5 shadow-xs ring-1 ring-[#7A35A3]/25"
          : "border border-gray-200/80 bg-white/70 hover:border-[#C883EB]/60 hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3.5 relative z-10">
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-bold transition-colors ${
              selected ? "text-[#4A1766]" : "text-gray-800 group-hover:text-gray-900"
            }`}
          >
            {label}
          </p>
          {desc && <p className="text-xs text-gray-500 mt-1 leading-normal">{desc}</p>}
        </div>

        <div
          className={`w-5 h-5 border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
            multi ? "rounded-md" : "rounded-full"
          } ${
            selected
              ? "border-[#7A35A3] bg-[#7A35A3] text-white shadow-xs"
              : "border-gray-300 bg-white group-hover:border-gray-400"
          }`}
        >
          {selected &&
            (multi ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-white" />
            ))}
        </div>
      </div>
    </motion.button>
  );
}
