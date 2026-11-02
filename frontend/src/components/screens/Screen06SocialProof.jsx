import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, HeartHandshake, MapPin } from "lucide-react";
import worldMapUrl from "../../assets/world_branded.svg";

// Geographic vector paths for the 4 key countries (2000 x 857 coordinate space)
const INDIA_PATH =
  "M1427.6 308l-2.8 3-0.9 6 5.8 2.4 5.8 3.1 7.8 3.6 7.7 0.9 3.8 3.2 4.3 0.6 6.9 1.5 4.6-0.1 0.1-2.5-1.5-4.1-0.2-2.7 3.1-1.4 1.5 5.1 0.4 1.2 5.5 2.5 3.2-1 4.7 0.4 4.5-0.2-0.5-3.9-2.6-2.1 4.2-0.8 3.9-4.8 5.4-4 4.9 1.5 3.2-2.7 3.6 4-1.2 2.7 6.1 1 1 2.4-1.7 1.2 1.4 3.9-4.2-1.1-6.2 4.4 0.9 3.7-2 5.4 0.3 3.1-1.6 5.3-4.6-1.5 0.9 6.7-1 2.2 1 2.7-2.5 1.5-4.4-10.2-1.5 0-0.3 4.2-3.6-3.4 1.2-3.6 2.4-0.4 1.6-5.4-3.4-1.1-5.1 0.1-5.4-0.9-1.2-4.5-2.7-0.3-4.9-2.8-1.2 4.4 4.6 3.4-3 2.4-0.9 2.3 3.7 1.7-0.3 3.9 2.6 4.8 1.6 5.3-0.5 2.4-3.8-0.1-6.6 1.3 0.9 4.8-2.4 3.8-7.5 4.4-5.3 7.5-3.8 4.1-5 4.2 0.3 2.9-2.6 1.6-4.8 2.3-2.6 0.3-1.2 4.9 1.9 8.4 0.7 5.3-1.9 6.1 0.7 10.9-2.9 0.3-2.3 4.9 1.9 2.2-5.1 1.8-1.7 4.3-2.2 1.9-5.6-6-3.1-9-2.5-6.5-2.2-3-3.4-6.2-2-8-1.4-4-5.9-8.8-3.5-12.5-2.6-8.2-0.8-7.8-1.7-6-7.7 3.9-4-0.8-8.1-7.8 2.4-2.3-1.9-2.5-7.1-5.5 3.2-4.3 12.1 0-1.8-5.5-3.5-3.2-1.4-5-4-2.8 4.9-6.8 6.5 0.5 4.5-6.7 2.2-6.5 3.9-6.5-1-4.6 3.8-3.7-5.1-3.1-2.9-4.4-3.3-5.6 2-2.8 8.5 1.6 5.7-1 3.8-5.4 7.7 7.6 0.8 5.2 3 3.3 0.6 3.3-4.1-0.9 3.2 7.1 6.2 4 8.6 4.5z";

const PINPOINTS = [
  {
    id: "india",
    name: "India",
    pinX: 1430,
    pinY: 375,
    pillX: (1430 / 2000) * 100,
    pillY: (295 / 857) * 100,
  },
];

export default function Screen06SocialProof({ onComplete, onBack }) {
  const [activeCountry, setActiveCountry] = useState(null);

  const handleMouseEnter = (id) => {
    setActiveCountry(id);
  };

  const handleMouseLeave = () => {
    setActiveCountry(null);
  };

  const handleClick = (id, e) => {
    e.stopPropagation();
    setActiveCountry((prev) => (prev === id ? null : id));
  };

  const activePin = PINPOINTS.find((p) => p.id === activeCountry);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 pb-12 pt-2"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-3.5 py-1 rounded-full mb-5 shadow-2xs">
          <HeartHandshake className="w-3.5 h-3.5 text-[#E04234]" />
          COMMUNITY VALIDATION · STEP 07
        </span>

        {/* Real World Map Container */}
        <div
          onPointerLeave={handleMouseLeave}
          onClick={handleMouseLeave}
          className="relative w-full max-w-[340px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[680px] aspect-[2000/857] mx-auto mb-3 p-1 rounded-2xl bg-[#FAF9F6] border border-[#EBE5DC] flex items-center justify-center overflow-visible shadow-xs select-none"
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 rounded-2xl opacity-15 pointer-events-none bg-[radial-gradient(#141416_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden" />

          {/* Real World Map Vector Image */}
          <img
            src={worldMapUrl}
            alt="Real World Map"
            className="w-full h-full object-contain pointer-events-none select-none rounded-xl"
          />

          {/* Interactive Geographic SVG Layer */}
          <svg
            viewBox="0 0 2000 857"
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          >
            <defs>
              <filter id="countryPopShadow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#E04234" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* India Group */}
            <g
              onPointerEnter={() => handleMouseEnter("india")}
              onPointerLeave={handleMouseLeave}
              onClick={(e) => handleClick("india", e)}
              className="cursor-pointer pointer-events-auto"
            >
              <path
                d={INDIA_PATH}
                className="transition-all duration-200"
                fill={activeCountry === "india" ? "#E04234" : "transparent"}
                stroke={activeCountry === "india" ? "#C73024" : "transparent"}
                strokeWidth={activeCountry === "india" ? 1.8 : 0}
                style={{
                  transformOrigin: "1430px 375px",
                  transform: activeCountry === "india" ? "translateY(-4px) scale(1.03)" : "none",
                  filter: activeCountry === "india" ? "url(#countryPopShadow)" : "none",
                }}
              />
              <circle cx="1430" cy="375" r="45" fill="transparent" />
              {/* Pulse ring */}
              <circle cx="1430" cy="375" r="10" fill="#E04234" opacity="0.35">
                <animate attributeName="r" from="10" to="34" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              {/* Core Beacon Pin */}
              <circle
                cx="1430"
                cy="375"
                r={activeCountry === "india" ? "11" : "8.5"}
                fill={activeCountry === "india" ? "#C73024" : "#E04234"}
                stroke="#FFFFFF"
                strokeWidth={activeCountry === "india" ? "3.5" : "2.5"}
                className="transition-all duration-200 drop-shadow-md"
              />
            </g>
          </svg>

          {/* Unified Pill Tooltip */}
          <AnimatePresence>
            {activePin && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                style={{
                  left: `${activePin.pillX}%`,
                  top: `${activePin.pillY}%`,
                }}
                className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full pb-2.5 transition-[left,top] duration-150 ease-out"
              >
                <div className="relative bg-[#141416] text-[#FAF9F6] text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full shadow-2xl border border-[#EBE5DC]/30 whitespace-nowrap flex items-center justify-center select-none tracking-wide">
                  <span>{activePin.name}</span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-[#141416]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prompt Hint */}
        <p className="text-[11px] sm:text-xs text-[#71717A] font-mono mb-4 flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#E04234]" />
          <span>Interactive map · Hover or tap India to inspect local profiles</span>
        </p>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141416] leading-tight">
          You are in excellent company
        </h2>
        <p className="text-[#52525B] text-sm sm:text-base mt-2 leading-relaxed max-w-md mx-auto">
          MILC has personalized routines for{" "}
          <span className="font-bold text-[#E04234]">1,001+ skin profiles</span> with similar cellular concerns across{" "}
          <span className="font-semibold text-[#141416]">India</span>.
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex items-center justify-between gap-3 max-w-md mx-auto pt-5 border-t border-[#EBE5DC]">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 h-12 border border-[#EBE5DC] bg-[#FAF9F6] text-[#52525B] rounded-full font-semibold hover:bg-[#F2ECE3] hover:text-[#141416] text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onComplete}
            className="flex-[1.4] h-12 bg-[#E04234] hover:bg-[#C73024] text-white rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-[0_8px_20px_-4px_rgba(224,66,52,0.22)] hover:shadow-[0_12px_24px_-4px_rgba(224,66,52,0.3)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
