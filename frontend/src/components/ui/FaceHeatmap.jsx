import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, Camera, Layers, Check, ShieldCheck, ChevronRight, Activity, Info } from "lucide-react";

// 5 Facial Zones mapping to the 11 skin conditions
export const REGIONS = [
  {
    id: "tzone",
    name: "T-Zone & Nose",
    attrIds: ["visible_pores", "whiteheads", "acne_inflammatory", "freckles"],
    badge: "Pores & Congestion",
    insight: "Central area with high oil gland density. Monitored for trapped sebum, blackheads, and pore size.",
    applicationTip: "Gently pat your clarifying BHA or Niacinamide formula along the nose bridge and chin.",
  },
  {
    id: "cheeks",
    name: "Cheeks",
    attrIds: ["redness", "postacne_spots", "freckles", "pigmentation", "scars"],
    badge: "Tone & Moisture Barrier",
    insight: "Primary moisture barrier zone. Monitored for facial flushing, sun spots, and past blemish marks.",
    applicationTip: "Layer soothing Centella and barrier cream evenly to lock in hydration and reduce redness.",
  },
  {
    id: "forehead",
    name: "Forehead",
    attrIds: ["wrinkles", "visible_pores", "whiteheads", "pigmentation"],
    badge: "Expression Lines & Texture",
    insight: "Upper facial area. Monitored for dynamic expression lines, sun exposure, and upper pore smoothness.",
    applicationTip: "Smooth serums upward toward the hairline to support skin elasticity.",
  },
  {
    id: "undereye",
    name: "Under-Eyes",
    attrIds: ["wrinkles", "pigmentation"],
    badge: "Delicate Eye Area",
    insight: "Thin, delicate skin zone. Monitored for fine dehydration lines, darkness, and fatigue shadows.",
    applicationTip: "Gently tap eye cream with your ring finger along the orbital bone—never pull or rub.",
  },
  {
    id: "jawline",
    name: "Jawline & Chin",
    attrIds: ["acne_inflammatory", "postacne_spots", "scars", "whiteheads"],
    badge: "Breakouts & Recovery",
    insight: "Lower facial area often influenced by hormonal shifts, friction, and residual marks.",
    applicationTip: "Carry your evening moisturizer all the way down across the jawline and neck.",
  },
];

export default function FaceHeatmap({
  attributes = [],
  activeRegion: propActiveRegion,
  onSelectRegion,
  userPhoto = null,
}) {
  // Default to T-Zone so the inspection box is NEVER empty!
  const [internalActive, setInternalActive] = useState("tzone");
  const currentRegionId = propActiveRegion || internalActive;

  const handleSelect = (id) => {
    setInternalActive(id);
    onSelectRegion?.(id);
  };

  // Determine health status for a given region
  const getRegionStatus = (attrIds) => {
    const relevant = attributes.filter((a) => attrIds.includes(a.id));
    if (relevant.some((a) => a.category === "Needs a boost")) return "needs_boost";
    if (relevant.some((a) => a.category === "Fine for now")) return "fine";
    return "good";
  };

  const activeMeta = REGIONS.find((r) => r.id === currentRegionId) || REGIONS[0];
  const activeAttributes = attributes.filter((a) => activeMeta.attrIds.includes(a.id));

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-[#EADBFA] shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7A35A3]" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
              Facial Zone Explorer
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            {userPhoto
              ? "Your face photo mapped across 5 primary facial zones. Tap any zone to see localized skin findings."
              : "Explore the 5 facial zones to see how products target different areas of your face."}
          </p>
        </div>

        {propActiveRegion && (
          <button
            type="button"
            onClick={() => onSelectRegion?.(null)}
            className="self-start sm:self-auto text-xs font-semibold text-[#4A1766] hover:underline cursor-pointer bg-[#F4E8FC] px-3.5 py-1.5 rounded-full border border-[#EADBFA] transition-colors"
          >
            Show All Conditions
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Clean Biometric Photo Lens (NO awkward dots on glasses/hair!) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-56 sm:w-64 aspect-[1/1.2] rounded-3xl overflow-hidden border-2 border-[#EADBFA] bg-[#FBF7FE] shadow-sm group">
            {userPhoto ? (
              <>
                <img
                  src={userPhoto}
                  alt="Your Face Scan"
                  className="w-full h-full object-cover"
                />
                {/* Subtle biometric scan line & vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15 pointer-events-none" />
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4FF3F] to-transparent opacity-50 animate-pulse pointer-events-none top-1/2" />
              </>
            ) : (
              /* Sleek clinical silhouette fallback */
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#FBF7FE] to-[#F4E8FC]/30 select-none">
                <svg viewBox="0 0 200 240" className="w-44 h-52">
                  <ellipse cx="100" cy="115" rx="60" ry="78" fill="#FFFFFF" stroke="#EADBFA" strokeWidth="2" />
                  <circle cx="80" cy="98" r="3" fill="#C883EB" />
                  <circle cx="120" cy="98" r="3" fill="#C883EB" />
                  <path d="M 92 148 Q 100 154 108 148" stroke="#7A35A3" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 98 106 L 98 126 L 104 126" stroke="#C883EB" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            )}

            {/* Corner Reticles */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4FF3F] pointer-events-none z-20" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4FF3F] pointer-events-none z-20" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4FF3F] pointer-events-none z-20" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4FF3F] pointer-events-none z-20" />

            {/* Bottom active zone label pill */}
            <div className="absolute bottom-3 inset-x-3 z-20 text-center">
              <span className="bg-black/60 backdrop-blur-md text-[#D4FF3F] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-white/20 inline-block">
                Active Zone: {activeMeta.name}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Zone Selector Buttons & Pre-Filled Zone Card */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Zone Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {REGIONS.map((region) => {
              const isSelected = currentRegionId === region.id;
              const status = getRegionStatus(region.attrIds);

              const dotColor =
                status === "needs_boost"
                  ? "bg-[#7A35A3]"
                  : status === "fine"
                  ? "bg-amber-500"
                  : "bg-emerald-500";

              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => handleSelect(region.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? "bg-[#7A35A3] text-white border-[#7A35A3] shadow-xs scale-102"
                      : "bg-[#FBF7FE] text-gray-700 border-[#EADBFA] hover:bg-white hover:border-[#C883EB]"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  <span>{region.name}</span>
                </button>
              );
            })}
          </div>

          {/* Contextual Zone Diagnostic Breakdown Card (Never Empty!) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FBF7FE] to-[#F4E8FC]/40 border border-[#EADBFA] shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#EADBFA]/80 pb-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A35A3]">
                  Zone Focus
                </span>
                <h4 className="font-bold text-gray-900 text-base">{activeMeta.name}</h4>
              </div>
              <span className="text-[10px] font-bold text-[#1E2700] bg-[#D4FF3F] border border-[#BDE820] px-2.5 py-0.5 rounded-full">
                {activeMeta.badge}
              </span>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">
              {activeMeta.insight}
            </p>

            {/* Mapped conditions in this zone */}
            {activeAttributes.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1.5">
                  Conditions in this zone ({activeAttributes.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeAttributes.map((attr) => (
                    <span
                      key={attr.id}
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        attr.category === "Needs a boost"
                          ? "bg-[#F4E8FC] text-[#4A1766] border-[#EADBFA]"
                          : attr.category === "Fine for now"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {attr.label} ({attr.userScore}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Routine Application Tip */}
            <div className="pt-2 border-t border-[#EADBFA]/80 flex items-start gap-2 text-xs text-[#4A1766]">
              <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#7A35A3]" />
              <span>
                <strong className="font-semibold text-gray-900">Skincare Tip: </strong>
                {activeMeta.applicationTip}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
