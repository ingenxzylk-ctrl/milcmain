import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, Sparkles, TrendingUp } from "lucide-react";

export default function Screen07Fit47({ onComplete, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-2"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] text-center relative overflow-hidden">
        {/* Top Clinical Precision Badge */}
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-[#4A1766] uppercase bg-[#F4E8FC] px-3.5 py-1 rounded-full mb-4">
          <TrendingUp className="w-3.5 h-3.5" />
          Clinical Trajectory Forecast
        </span>

        {/* High-Precision Animated Fit Curve Graph Card */}
        <div className="relative w-full max-w-[340px] sm:max-w-[480px] md:max-w-[540px] mx-auto mb-6 p-4 sm:p-6 pt-3 rounded-2xl bg-[#F4F7FA]/90 border border-[#EADBFA] shadow-xs">
          {/* Header Legend with Distinct Line Samples */}
          <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-[#EADBFA]/70 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-[#4A1766]">
              <span className="w-3 h-3 rounded-full bg-[#7A35A3] inline-block shadow-xs" />
              <span>With MILC Protocol</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-slate-500">
              <span className="w-4 h-0.5 bg-slate-400 border-t-2 border-dashed border-slate-500 inline-block" />
              <span>On Average (Generic)</span>
            </div>
          </div>

          {/* Precision SVG Chart */}
          <div className="relative w-full aspect-[1.7/1]">
            <svg viewBox="0 0 320 180" className="w-full h-full overflow-visible select-none">
              <defs>
                {/* Gradient for MILC Area Fill */}
                <linearGradient id="milcAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7A35A3" stopOpacity="0.22" />
                  <stop offset="70%" stopColor="#8E7CC3" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#7A35A3" stopOpacity="0.0" />
                </linearGradient>

                {/* Gradient for MILC Stroke */}
                <linearGradient id="milcStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#C883EB" />
                  <stop offset="70%" stopColor="#7A35A3" />
                  <stop offset="100%" stopColor="#8E7CC3" />
                </linearGradient>
              </defs>

              {/* Horizontal Precision Grid Lines & Y-Axis Scale */}
              <g className="text-slate-300" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3">
                <line x1="42" y1="30" x2="305" y2="30" />
                <line x1="42" y1="65" x2="305" y2="65" />
                <line x1="42" y1="100" x2="305" y2="100" />
                <line x1="42" y1="135" x2="305" y2="135" strokeDasharray="none" stroke="#CBD7E3" strokeWidth="1.2" />
              </g>

              {/* Y-Axis Solid Line */}
              <line x1="42" y1="20" x2="42" y2="135" stroke="#CBD7E3" strokeWidth="1.2" />

              {/* Y-Axis Value Labels */}
              <text x="36" y="33" textAnchor="end" fill="#94A3B8" fontSize="9" fontWeight="600">100%</text>
              <text x="36" y="68" textAnchor="end" fill="#94A3B8" fontSize="9" fontWeight="600">75%</text>
              <text x="36" y="103" textAnchor="end" fill="#94A3B8" fontSize="9" fontWeight="600">50%</text>
              <text x="36" y="138" textAnchor="end" fill="#94A3B8" fontSize="9" fontWeight="600">25%</text>

              {/* X-Axis Timeline Labels */}
              <text x="46" y="154" textAnchor="start" fill="#94A3B8" fontSize="10" fontWeight="600">Start</text>
              <text x="125" y="154" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600">Week 2</text>
              <text x="205" y="154" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600">Week 4</text>
              <text x="285" y="154" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600">Week 8</text>

              {/* "On Average" Generic Plateau Curve (Dashed Animated Grey) */}
              <motion.path
                d="M 42 130 C 110 120, 160 106, 205 106 L 285 106"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2.4"
                strokeDasharray="5 4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />

              {/* "On Average" Floating Curve Label (Positioned cleanly below dashed line, no overlap) */}
              <g transform="translate(195, 114)">
                <rect x="0" y="0" width="102" height="17" rx="8.5" fill="#E2E8F0" />
                <text x="51" y="12" textAnchor="middle" fill="#475569" fontSize="8.5" fontWeight="700">
                  On Average: ~45%
                </text>
              </g>

              {/* "With MILC" Area Fill (Underneath Curve) */}
              <motion.path
                d="M 42 104 C 110 70, 180 44, 285 36 L 285 135 L 42 135 Z"
                fill="url(#milcAreaGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
              />

              {/* "With MILC" High-Precision Targeted Curve */}
              <motion.path
                d="M 42 104 C 110 70, 180 44, 285 36"
                fill="none"
                stroke="url(#milcStrokeGrad)"
                strokeWidth="3.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
              />

              {/* Start Milestone Dot (47% Fit Baseline) */}
              <g transform="translate(42, 104)">
                <circle cx="0" cy="0" r="8" className="fill-[#132B45] opacity-20 animate-ping" />
                <circle cx="0" cy="0" r="4.5" fill="#7A35A3" stroke="#FFFFFF" strokeWidth="2" />
                {/* 47% Callout Pill above Start */}
                <motion.g
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <rect x="-3" y="-28" width="60" height="18" rx="9" fill="#204060" />
                  <polygon points="4,-10 12,-10 8,-6" fill="#204060" />
                  <text x="27" y="-16" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="800">
                    47% START
                  </text>
                </motion.g>
              </g>

              {/* "With MILC" Peak Milestone Callout (At Week 8 Target) */}
              <g transform="translate(285, 36)">
                {/* Ping ring */}
                <circle cx="0" cy="0" r="10" className="fill-[#8E7CC3] opacity-35 animate-ping" />
                <circle cx="0" cy="0" r="14" className="fill-[#132B45] opacity-15 animate-pulse" />
                {/* Center dot */}
                <circle cx="0" cy="0" r="5" fill="#7A35A3" stroke="#FFFFFF" strokeWidth="2" />

                {/* Direct "With MILC" Callout Badge (No overlap, prominent label) */}
                <motion.g
                  initial={{ opacity: 0, y: -6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 350 }}
                >
                  <rect
                    x="-96"
                    y="-28"
                    width="104"
                    height="20"
                    rx="10"
                    fill="#7A35A3"
                    className="shadow-md"
                  />
                  <polygon points="-4,-8 4,-8 0,-4" fill="#7A35A3" />
                  <text
                    x="-44"
                    y="-14"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="800"
                    letterSpacing="0.3px"
                  >
                    ✦ With MILC (93%)
                  </text>
                </motion.g>
              </g>
            </svg>
          </div>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Your treatment program is a <span className="text-[#4A1766]">47% fit</span> right now
        </h2>

        <p className="text-gray-600 text-xs sm:text-sm mt-3 leading-relaxed max-w-md mx-auto">
          Generic skincare plateaus at ~45% because it treats skin on average. MILC elevates your trajectory to 93% by factoring in your unique lifestyle, climate, and cellular telemetry.
        </p>

        {/* Clean, Aligned Back & Continue Buttons */}
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
            <span>Calibrate Lifestyle</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
