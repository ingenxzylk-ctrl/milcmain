import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, Camera, Layers, Check } from "lucide-react";

// Regional definitions mapping to attribute categories
const REGIONS = [
  {
    id: "forehead",
    name: "Forehead",
    attrIds: ["wrinkles", "visible_pores", "whiteheads", "pigmentation"],
    badge: "Wrinkles & tone",
    path: "M 60 55 C 60 30, 140 30, 140 55 C 140 68, 60 68, 60 55 Z",
  },
  {
    id: "tzone",
    name: "T-Zone & Nose",
    attrIds: ["visible_pores", "whiteheads", "acne_inflammatory", "freckles"],
    badge: "Pores & congestion",
    path: "M 88 72 L 112 72 L 110 115 C 110 125, 90 125, 90 115 Z",
  },
  {
    id: "undereye",
    name: "Under-Eyes",
    attrIds: ["wrinkles", "pigmentation"],
    badge: "Lines & tone",
    path: "M 60 85 C 65 92, 82 92, 86 85 M 114 85 C 118 92, 135 92, 140 85",
    isStroke: true,
  },
  {
    id: "cheeks",
    name: "Cheeks",
    attrIds: ["redness", "postacne_spots", "freckles", "pigmentation", "scars", "moles", "nevi", "visible_pores"],
    badge: "Redness, spots & scars",
    path: "M 52 100 C 45 125, 75 145, 82 135 C 75 115, 65 105, 52 100 Z M 148 100 C 155 125, 125 145, 118 135 C 125 115, 135 105, 148 100 Z",
  },
  {
    id: "jawline",
    name: "Jawline & Chin",
    attrIds: ["acne_inflammatory", "postacne_spots", "scars", "whiteheads", "moles", "nevi"],
    badge: "Breakouts & post-acne marks",
    path: "M 62 145 C 75 180, 125 180, 138 145 C 130 162, 70 162, 62 145 Z",
  },
];

export default function FaceHeatmap({
  attributes = [],
  activeRegion,
  onSelectRegion,
  userPhoto = null,
}) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [showOverlays, setShowOverlays] = useState(true);

  // Determine category urgency status for a given region
  const getRegionStatus = (attrIds) => {
    const relevant = attributes.filter((a) => attrIds.includes(a.id));
    if (relevant.some((a) => a.category === "Needs a boost")) return "needs_boost";
    if (relevant.some((a) => a.category === "Fine for now")) return "fine";
    return "good";
  };

  const currentActive = hoveredRegion || activeRegion;
  const activeMeta = REGIONS.find((r) => r.id === currentActive);

  return (
    <div className="bg-gradient-to-b from-white to-[#F4F7FA] rounded-[28px] p-5 sm:p-6 border border-[#EADBFA] shadow-xs relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 font-serif text-base">
            <Sparkles className="w-4 h-4 text-[#4A1766]" />
            {userPhoto ? "Your Face Scan & Zone Analysis" : "Interactive Facial Zone Map"}
          </h4>
          <p className="text-[11px] text-gray-500">
            {userPhoto
              ? "Tap any mapped zone on your photo to filter clinical attributes"
              : "Tap any face zone to inspect tailored clinical reads"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userPhoto && (
            <button
              type="button"
              onClick={() => setShowOverlays((v) => !v)}
              className="text-[11px] font-semibold text-gray-600 hover:text-gray-900 cursor-pointer bg-white px-3 py-1 rounded-full border border-[#EADBFA] flex items-center gap-1.5 shadow-2xs"
            >
              <Layers className="w-3 h-3 text-[#4A1766]" />
              <span>{showOverlays ? "Hide Overlay" : "Show Overlay"}</span>
            </button>
          )}

          {activeRegion && (
            <button
              type="button"
              onClick={() => onSelectRegion(null)}
              className="text-[11px] font-semibold text-[#4A1766] hover:underline cursor-pointer bg-white px-3 py-1 rounded-full border border-[#EADBFA]"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Face Image Frame / SVG Visualizer */}
        <div className="relative w-48 sm:w-56 aspect-[1/1.2] shrink-0 rounded-2xl overflow-hidden border border-[#EADBFA] bg-[#F4F7FA] shadow-inner group">
          {/* If user uploaded a photo, display their photo */}
          {userPhoto ? (
            <>
              <img
                src={userPhoto}
                alt="Your Analyzed Face Scan"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Subtle biometric scan lines */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25 pointer-events-none" />

              {/* Viewfinder corner HUD marks */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#7A35A3]/80 z-20 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#7A35A3]/80 z-20 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#7A35A3]/80 z-20 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#7A35A3]/80 z-20 pointer-events-none" />
            </>
          ) : (
            /* Fallback sleek minimalist SVG face silhouette */
            <svg viewBox="0 0 200 220" className="w-full h-full select-none">
              <ellipse
                cx="100"
                cy="105"
                rx="62"
                ry="82"
                className="fill-white stroke-[#EADBFA]"
                strokeWidth="2"
              />
              <circle cx="78" cy="80" r="3.5" className="fill-[#b0c0d0]" />
              <circle cx="122" cy="80" r="3.5" className="fill-[#b0c0d0]" />
              <path d="M 88 140 Q 100 148 112 140" stroke="#b0c0d0" strokeWidth="2" fill="none" />
            </svg>
          )}

          {/* Interactive SVG Hotspots on top of photo or illustration */}
          {showOverlays && (
            <svg
              viewBox="0 0 200 220"
              className="absolute inset-0 w-full h-full select-none z-10"
            >
              {REGIONS.map((region) => {
                const status = getRegionStatus(region.attrIds);
                const isSelected = activeRegion === region.id;
                const isHovered = hoveredRegion === region.id;

                let fillColor = userPhoto ? "rgba(19, 43, 69, 0.15)" : "rgba(19, 43, 69, 0.08)";
                let strokeColor = "rgba(19, 43, 69, 0.4)";

                if (status === "needs_boost") {
                  fillColor = isSelected || isHovered ? "rgba(19, 43, 69, 0.45)" : "rgba(19, 43, 69, 0.25)";
                  strokeColor = "#132B45";
                } else if (status === "fine") {
                  fillColor = isSelected || isHovered ? "rgba(217, 119, 6, 0.4)" : "rgba(217, 119, 6, 0.2)";
                  strokeColor = "#d97706";
                } else {
                  fillColor = isSelected || isHovered ? "rgba(16, 185, 129, 0.4)" : "rgba(16, 185, 129, 0.2)";
                  strokeColor = "#10b981";
                }

                if (region.isStroke) {
                  return (
                    <path
                      key={region.id}
                      d={region.path}
                      fill="none"
                      stroke={isSelected || isHovered ? strokeColor : (userPhoto ? "#ffffff" : "#94a3b8")}
                      strokeWidth={isSelected || isHovered ? "4.5" : "3"}
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredRegion(region.id)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => onSelectRegion(isSelected ? null : region.id)}
                    />
                  );
                }

                return (
                  <path
                    key={region.id}
                    d={region.path}
                    fill={fillColor}
                    stroke={isSelected || isHovered ? strokeColor : (userPhoto ? "rgba(255,255,255,0.4)" : "transparent")}
                    strokeWidth={isSelected || isHovered ? "2.5" : "1"}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => onSelectRegion(isSelected ? null : region.id)}
                  />
                );
              })}
            </svg>
          )}
        </div>

        {/* Region Detail & Pills */}
        <div className="flex-1 w-full flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-3">
            {REGIONS.map((r) => {
              const isSelected = activeRegion === r.id;
              const status = getRegionStatus(r.attrIds);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectRegion(isSelected ? null : r.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#7A35A3] text-white border-[#7A35A3] shadow-xs"
                      : "bg-white text-gray-700 border-gray-200/90 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status === "needs_boost"
                        ? "bg-[#7A35A3]"
                        : status === "fine"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#EADBFA]">
            {activeMeta ? (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{activeMeta.name} Region</span>
                  <span className="text-[10px] font-semibold text-[#4A1766] uppercase tracking-wider bg-[#F4E8FC] px-2 py-0.5 rounded-full">
                    {activeMeta.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Filtering attributes for {activeMeta.name.toLowerCase()} area. Click below to inspect findings.
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                {userPhoto
                  ? "Your face photo is loaded with mapped zones. Tap any zone to filter your 8 skin factors."
                  : "Tap any facial zone to filter attributes and reveal clinical insights."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
