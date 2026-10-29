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

  // Immediate 0ms hover feedback
  const handleMouseEnter = (id) => {
    setActiveCountry(id);
  };

  // Immediate 0ms dismissal on leaving country or map
  const handleMouseLeave = () => {
    setActiveCountry(null);
  };

  // Click/tap toggle for touch devices
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
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-2"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] text-center relative overflow-hidden">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-[#4A1766] uppercase bg-[#F4E8FC] px-3.5 py-1 rounded-full mb-5">
          <HeartHandshake className="w-3.5 h-3.5" />
          You're in good hands
        </span>

        {/* Real World Map Container */}
        <div
          onPointerLeave={handleMouseLeave}
          onClick={handleMouseLeave}
          className="relative w-full max-w-[340px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[680px] aspect-[2000/857] mx-auto mb-3 p-1 rounded-2xl bg-[#F4F7FA]/90 border border-[#EADBFA] flex items-center justify-center overflow-visible shadow-xs select-none"
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 rounded-2xl opacity-15 pointer-events-none bg-[radial-gradient(#132B45_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden" />

          {/* Genuine Real World Map Vector Image */}
          <img
            src={worldMapUrl}
            alt="Real World Map"
            className="w-full h-full object-contain pointer-events-none select-none rounded-xl"
          />

          {/* Interactive Geographic SVG Layer (matching 2000 x 857 coordinate space) */}
          <svg
            viewBox="0 0 2000 857"
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          >
            <defs>
              {/* Drop-shadow filter that elevates the popped-up country off the map */}
              <filter id="countryPopShadow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#4A1766" floodOpacity="0.4" />
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#4A1766" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* ===== 1. INDIA (Geographic Path + Beacon unified in single group) ===== */}
            <g
              onPointerEnter={() => handleMouseEnter("india")}
              onPointerLeave={handleMouseLeave}
              onClick={(e) => handleClick("india", e)}
              className="cursor-pointer pointer-events-auto"
            >
              <path
                d={INDIA_PATH}
                className="transition-all duration-200"
                fill={activeCountry === "india" ? "#132B45" : "transparent"}
                stroke={activeCountry === "india" ? "#0B1E32" : "transparent"}
                strokeWidth={activeCountry === "india" ? 1.8 : 0}
                style={{
                  transformOrigin: "1430px 375px",
                  transform: activeCountry === "india" ? "translateY(-4px) scale(1.03)" : "none",
                  filter: activeCountry === "india" ? "url(#countryPopShadow)" : "none",
                }}
              />
              {/* Hit target */}
              <circle cx="1430" cy="375" r="45" fill="transparent" />
              {/* Pulse ring */}
              <circle cx="1430" cy="375" r="10" fill="#8E7CC3" opacity="0.45">
                <animate attributeName="r" from="10" to="34" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              {/* Core Beacon Pin */}
              <circle
                cx="1430"
                cy="375"
                r={activeCountry === "india" ? "11" : "8.5"}
                fill={activeCountry === "india" ? "#0E2034" : "#132B45"}
                stroke="#FFFFFF"
                strokeWidth={activeCountry === "india" ? "3.8" : "2.8"}
                className="transition-all duration-200 drop-shadow-md"
              />
            </g>
          </svg>

          {/* ===== SINGLE UNIFIED PILL TOOLTIP (Zero overlap, instant swap, clean mouse-out dismiss) ===== */}
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
                <div className="relative bg-[#7A35A3] text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full shadow-2xl border border-white/20 whitespace-nowrap flex items-center justify-center select-none tracking-wide">
                  <span>{activePin.name}</span>
                  {/* Downward pointer caret */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-[#7A35A3]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prompt Hint */}
        <p className="text-[11px] sm:text-xs text-slate-400 font-medium mb-4 flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3 text-[#4A1766]" />
          <span>Hover or tap India on the map to pop up its location</span>
        </p>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          You're not alone!
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed max-w-md mx-auto">
          MILC has personalized routines for{" "}
          <span className="font-bold text-[#4A1766]">1,001 people</span> with similar skin concerns across{" "}
          <span className="font-semibold text-gray-900">India</span>.
        </p>

        {/* Center-aligned Navigation Buttons */}
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
            className="flex-[1.5] h-12 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-sm cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
