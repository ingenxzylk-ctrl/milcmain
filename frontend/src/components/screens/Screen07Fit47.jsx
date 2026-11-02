import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, Sparkles, TrendingUp } from "lucide-react";

export default function Screen07Fit47({ onComplete, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 pb-12 pt-2"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-1 rounded-full mb-4 shadow-2xs">
          <TrendingUp className="w-3.5 h-3.5 text-[#9E3A26]" />
          CLINICAL TRAJECTORY · STEP 08
        </span>

        {/* High-Precision Forecast Graph Card */}
        <div className="relative w-full max-w-[340px] sm:max-w-[480px] md:max-w-[540px] mx-auto mb-6 p-4 sm:p-6 pt-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] shadow-xs">
          {/* Header Legend */}
          <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-[#E8E3DA] text-xs sm:text-sm font-mono">
            <div className="flex items-center gap-2 font-bold text-[#18181B]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9E3A26] inline-block shadow-xs" />
              <span>With MILC Protocol</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-[#71717A]">
              <span className="w-4 h-0.5 bg-[#A8A193] border-t border-dashed border-[#71717A] inline-block" />
              <span>Generic Plateau</span>
            </div>
          </div>

          {/* Precision SVG Chart */}
          <div className="relative w-full aspect-[1.7/1]">
            <svg viewBox="0 0 320 180" className="w-full h-full overflow-visible select-none">
              <defs>
                <linearGradient id="milcAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9E3A26" stopOpacity="0.18" />
                  <stop offset="70%" stopColor="#C46853" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#9E3A26" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="milcStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9E3A26" />
                  <stop offset="100%" stopColor="#C46853" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              <g stroke="#E8E3DA" strokeWidth="1" strokeDasharray="3 3">
                <line x1="42" y1="30" x2="305" y2="30" />
                <line x1="42" y1="65" x2="305" y2="65" />
                <line x1="42" y1="100" x2="305" y2="100" />
                <line x1="42" y1="135" x2="305" y2="135" strokeDasharray="none" stroke="#D5CFC3" strokeWidth="1.2" />
              </g>

              {/* Y-Axis Solid Line */}
              <line x1="42" y1="20" x2="42" y2="135" stroke="#D5CFC3" strokeWidth="1.2" />

              {/* Y-Axis Value Labels */}
              <text x="36" y="33" textAnchor="end" fill="#A8A193" fontSize="8.5" fontFamily="monospace" fontWeight="600">100%</text>
              <text x="36" y="68" textAnchor="end" fill="#A8A193" fontSize="8.5" fontFamily="monospace" fontWeight="600">75%</text>
              <text x="36" y="103" textAnchor="end" fill="#A8A193" fontSize="8.5" fontFamily="monospace" fontWeight="600">50%</text>
              <text x="36" y="138" textAnchor="end" fill="#A8A193" fontSize="8.5" fontFamily="monospace" fontWeight="600">25%</text>

              {/* X-Axis Timeline Labels */}
              <text x="46" y="154" textAnchor="start" fill="#71717A" fontSize="9.5" fontFamily="monospace" fontWeight="600">Day 00</text>
              <text x="125" y="154" textAnchor="middle" fill="#71717A" fontSize="9.5" fontFamily="monospace" fontWeight="600">Week 02</text>
              <text x="205" y="154" textAnchor="middle" fill="#71717A" fontSize="9.5" fontFamily="monospace" fontWeight="600">Week 04</text>
              <text x="285" y="154" textAnchor="middle" fill="#71717A" fontSize="9.5" fontFamily="monospace" fontWeight="600">Week 08</text>

              {/* "On Average" Generic Plateau Curve */}
              <motion.path
                d="M 42 130 C 110 120, 160 106, 205 106 L 285 106"
                fill="none"
                stroke="#A8A193"
                strokeWidth="2.2"
                strokeDasharray="4 4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />

              {/* "On Average" Floating Curve Label */}
              <g transform="translate(195, 114)">
                <rect x="0" y="0" width="102" height="17" rx="8.5" fill="#EAE5DC" />
                <text x="51" y="11.5" textAnchor="middle" fill="#52525B" fontSize="8" fontFamily="monospace" fontWeight="700">
                  On Average: ~45%
                </text>
              </g>

              {/* "With MILC" Area Fill */}
              <motion.path
                d="M 42 104 C 110 70, 180 44, 285 36 L 285 135 L 42 135 Z"
                fill="url(#milcAreaGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
              />

              {/* "With MILC" Targeted Curve */}
              <motion.path
                d="M 42 104 C 110 70, 180 44, 285 36"
                fill="none"
                stroke="url(#milcStrokeGrad)"
                strokeWidth="3.4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
              />

              {/* Start Milestone Dot */}
              <g transform="translate(42, 104)">
                <circle cx="0" cy="0" r="7" className="fill-[#9E3A26] opacity-25 animate-ping" />
                <circle cx="0" cy="0" r="4.5" fill="#9E3A26" stroke="#FFFFFF" strokeWidth="2" />
                <motion.g
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <rect x="-3" y="-28" width="60" height="18" rx="9" fill="#18181B" />
                  <polygon points="4,-10 12,-10 8,-6" fill="#18181B" />
                  <text x="27" y="-16" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" fontWeight="800">
                    47% START
                  </text>
                </motion.g>
              </g>

              {/* "With MILC" Peak Milestone Callout */}
              <g transform="translate(285, 36)">
                <circle cx="0" cy="0" r="9" className="fill-[#9E3A26] opacity-30 animate-ping" />
                <circle cx="0" cy="0" r="4.5" fill="#9E3A26" stroke="#FFFFFF" strokeWidth="2" />

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
                    fill="#9E3A26"
                    className="shadow-sm"
                  />
                  <polygon points="-4,-8 4,-8 0,-4" fill="#9E3A26" />
                  <text
                    x="-44"
                    y="-14.5"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="800"
                    letterSpacing="0.4px"
                  >
                    ✦ MILC Target (93%)
                  </text>
                </motion.g>
              </g>
            </svg>
          </div>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#18181B] leading-tight">
          Your current routine is a <span className="text-[#9E3A26]">47% fit</span>
        </h2>

        <p className="text-[#52525B] text-xs sm:text-sm mt-3 leading-relaxed max-w-md mx-auto">
          Mass-market formulas plateau at ~45% because they treat skin indiscriminately. MILC elevates your trajectory to 93% through precision barrier repair.
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex items-center justify-between gap-3 max-w-md mx-auto pt-5 border-t border-[#F0EBE1]">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 h-12 border border-[#E8E3DA] bg-[#FAF8F5] text-[#52525B] rounded-full font-semibold hover:bg-[#F2ECE3] hover:text-[#18181B] text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onComplete}
            className="flex-[1.5] h-12 bg-[#9E3A26] hover:bg-[#832C1B] text-white rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-[0_8px_20px_-4px_rgba(158,58,38,0.22)] hover:shadow-[0_12px_24px_-4px_rgba(158,58,38,0.3)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Calibrate Lifestyle</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
