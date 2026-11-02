import { motion } from "framer-motion";
import { Camera, User, Sparkles, HeartPulse, Check } from "lucide-react";

export default function ProgressBar({
  step = 1,
  questionNumber = 1,
  questionTotal = 1,
  sectionLabel,
}) {
  const steps = [
    { number: 1, label: "Scan", icon: Camera },
    { number: 2, label: "Profile", icon: User },
    { number: 3, label: "Skin", icon: Sparkles },
    { number: 4, label: "Lifestyle", icon: HeartPulse },
  ];

  const currentStep = Math.min(Math.max(Number(step) || 1, 1), 4);
  const qNum = Math.min(Math.max(Number(questionNumber) || 1, 1), Math.max(Number(questionTotal) || 1, 1));
  const qTotal = Math.max(Number(questionTotal) || 1, 1);
  const progressPercentage = Math.min(100, Math.max(0, ((currentStep - 1 + qNum / qTotal) / 4) * 100));
  const resolvedSectionLabel = sectionLabel || `Phase ${currentStep} of 4`;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-3 select-none mb-3 sm:mb-4">
      {/* Step nodes */}
      <div className="relative flex justify-between items-center mb-3 sm:mb-4">
        {/* Background track */}
        <div
          className="absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 h-[1.5px] bg-[#EBE5DC] pointer-events-none"
          aria-hidden
        />
        {/* Active filled line */}
        <motion.div
          className="absolute top-1/2 left-[10%] -translate-y-1/2 h-[1.5px] bg-gradient-to-r from-[#CD92EB] to-[#E04234] pointer-events-none origin-left"
          initial={false}
          animate={{
            width: `${Math.max(0, Math.min(100, ((currentStep - 1) / 3) * 80))}%`,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        />

        {steps.map((item) => {
          const isActive = currentStep === item.number;
          const isPast = currentStep > item.number;
          const Icon = item.icon;

          return (
            <div key={item.number} className="relative z-10 flex flex-col items-center flex-1">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.08 : 1,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className={`w-8 sm:w-9 h-8 sm:h-9 rounded-full flex items-center justify-center border transition-all duration-300 shadow-2xs ${
                  isPast
                    ? "bg-[#E04234] border-[#E04234] text-white"
                    : isActive
                    ? "bg-white border-[#E04234] text-[#E04234] ring-4 ring-[#CD92EB]/35"
                    : "bg-[#FAF9F6] border-[#EBE5DC] text-[#AFA698]"
                }`}
              >
                {isPast ? (
                  <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                )}
              </motion.div>
              <span
                className={`text-[9px] sm:text-[10px] tracking-wider uppercase font-mono mt-1 sm:mt-1.5 transition-colors font-medium ${
                  isActive
                    ? "text-[#141416] font-bold"
                    : isPast
                    ? "text-[#52525B]"
                    : "text-[#AFA698]"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sub-bar with question count */}
      <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#71717A] px-1 font-mono">
        <span className="tracking-wide uppercase text-[9px] sm:text-[10px] font-semibold text-[#52525B]">
          {resolvedSectionLabel}
        </span>
        <span className="font-medium text-[#71717A]">
          Question {qNum} <span className="text-[#D8D0C3]">/</span> {qTotal}
        </span>
      </div>
      <div className="w-full bg-[#EBE5DC] h-1 rounded-full overflow-hidden mt-1 sm:mt-1.5">
        <motion.div
          className="bg-gradient-to-r from-[#CD92EB] via-[#E04234] to-[#D4FF3F] h-full rounded-full"
          initial={false}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
