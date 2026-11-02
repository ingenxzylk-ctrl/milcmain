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
    <div className="w-full max-w-2xl mx-auto px-3 select-none mb-4">
      {/* Step nodes */}
      <div className="relative flex justify-between items-center mb-4">
        {/* Background track */}
        <div
          className="absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 h-[1.5px] bg-[#E8E3DA] pointer-events-none"
          aria-hidden
        />
        {/* Active filled line */}
        <motion.div
          className="absolute top-1/2 left-[10%] -translate-y-1/2 h-[1.5px] bg-[#9E3A26] pointer-events-none origin-left"
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
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 shadow-2xs ${
                  isPast
                    ? "bg-[#9E3A26] border-[#9E3A26] text-white"
                    : isActive
                    ? "bg-white border-[#9E3A26] text-[#9E3A26] ring-4 ring-[#9E3A26]/10"
                    : "bg-[#FAF8F5] border-[#E8E3DA] text-[#A8A193]"
                }`}
              >
                {isPast ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </motion.div>
              <span
                className={`text-[10px] tracking-wider uppercase font-mono mt-1.5 transition-colors font-medium ${
                  isActive
                    ? "text-[#18181B] font-bold"
                    : isPast
                    ? "text-[#52525B]"
                    : "text-[#A8A193]"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sub-bar with question count */}
      <div className="flex items-center justify-between text-[11px] text-[#71717A] px-1 font-mono">
        <span className="tracking-wide uppercase text-[10px] font-semibold text-[#52525B]">
          {resolvedSectionLabel}
        </span>
        <span className="font-medium text-[#71717A]">
          Question {qNum} <span className="text-[#D5CFC3]">/</span> {qTotal}
        </span>
      </div>
      <div className="w-full bg-[#E8E3DA] h-1 rounded-full overflow-hidden mt-1.5">
        <motion.div
          className="bg-gradient-to-r from-[#9E3A26] to-[#C46853] h-full rounded-full"
          initial={false}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
