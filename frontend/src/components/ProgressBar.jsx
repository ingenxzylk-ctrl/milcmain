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
    { number: 2, label: "About You", icon: User },
    { number: 3, label: "Skin", icon: Sparkles },
    { number: 4, label: "Lifestyle", icon: HeartPulse },
  ];

  const currentStep = Math.min(Math.max(Number(step) || 1, 1), 4);
  const qNum = Math.min(Math.max(Number(questionNumber) || 1, 1), Math.max(Number(questionTotal) || 1, 1));
  const qTotal = Math.max(Number(questionTotal) || 1, 1);
  const progressPercentage = Math.min(100, Math.max(0, ((currentStep - 1 + qNum / qTotal) / 4) * 100));
  const resolvedSectionLabel = sectionLabel || `Section ${currentStep} of 4`;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 select-none">
      {/* Step nodes */}
      <div className="relative flex justify-between items-center mb-5">
        {/* Background track */}
        <div
          className="absolute top-1/2 left-[12%] right-[12%] -translate-y-1/2 h-[2px] bg-[#EADBFA] pointer-events-none"
          aria-hidden
        />
        {/* Active filled line */}
        <motion.div
          className="absolute top-1/2 left-[12%] -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#E34234] to-[#C72F22] pointer-events-none origin-left"
          initial={false}
          animate={{
            width: `${Math.max(0, Math.min(100, ((currentStep - 1) / 3) * 76))}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative"
              >
                {/* Active glow ring */}
                {isActive && (
                  <span className="absolute -inset-1.5 rounded-full bg-[#7A35A3]/20 animate-ping opacity-75" />
                )}

                <div
                  className={[
                    "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm",
                    isActive
                      ? "bg-[#7A35A3] text-white ring-4 ring-[#7A35A3]/15 shadow-[#E34234]/20 shadow-md"
                      : isPast
                        ? "bg-[#7A35A3] text-white"
                        : "bg-white text-gray-400 border border-gray-200/90",
                  ].join(" ")}
                >
                  {isPast ? (
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
              </motion.div>

              <span
                className={[
                  "text-[11px] mt-2.5 tracking-wide font-medium text-center leading-tight transition-colors duration-200",
                  isActive
                    ? "text-[#4A1766] font-bold"
                    : isPast
                      ? "text-gray-700 font-semibold"
                      : "text-gray-400",
                ].join(" ")}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Fluid progress bar */}
      <div className="relative h-2 bg-[#F4E8FC] rounded-full w-full overflow-hidden mb-3 p-[1px]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#132B45] via-[#204060] to-[#2B5278] rounded-full relative"
          initial={false}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/40 rounded-full blur-[1px]" />
        </motion.div>
      </div>

      {/* Metric Labels */}
      <div className="flex items-center justify-between gap-3 text-xs text-gray-500 font-medium px-1">
        <span className="flex items-center gap-1.5 font-medium text-gray-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7A35A3]" />
          {resolvedSectionLabel}
        </span>
        <span className="bg-[#F4E8FC] text-[#4A1766] px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
          Question {qNum} of {qTotal}
        </span>
      </div>
    </div>
  );
}
