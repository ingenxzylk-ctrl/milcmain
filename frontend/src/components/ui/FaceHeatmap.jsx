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
    coordinates: { top: "22%", left: "32%", width: "36%", height: "55%", borderRadius: "18px" },
  },
  {
    id: "cheeks",
    name: "Cheeks",
    attrIds: ["redness", "postacne_spots", "freckles", "pigmentation", "scars"],
    badge: "Tone & Moisture Barrier",
    insight: "Primary moisture barrier zone. Monitored for facial flushing, sun spots, and past blemish marks.",
    applicationTip: "Layer soothing Centella and barrier cream evenly to lock in hydration and reduce redness.",
    coordinates: { top: "42%", left: "12%", width: "76%", height: "30%", borderRadius: "20px" },
  },
  {
    id: "forehead",
    name: "Forehead",
    attrIds: ["wrinkles", "visible_pores", "whiteheads", "pigmentation"],
    badge: "Expression Lines & Texture",
    insight: "Upper facial area. Monitored for dynamic expression lines, sun exposure, and upper pore smoothness.",
    applicationTip: "Smooth serums upward toward the hairline to support skin elasticity.",
    coordinates: { top: "10%", left: "16%", width: "68%", height: "24%", borderRadius: "16px" },
  },
  {
    id: "undereye",
    name: "Under-Eyes",
    attrIds: ["wrinkles", "pigmentation"],
    badge: "Delicate Eye Area",
    insight: "Thin, delicate skin zone. Monitored for fine dehydration lines, darkness, and fatigue shadows.",
    applicationTip: "Gently tap eye cream with your ring finger along the orbital bone—never pull or rub.",
    coordinates: { top: "34%", left: "18%", width: "64%", height: "18%", borderRadius: "14px" },
  },
  {
    id: "jawline",
    name: "Jawline & Chin",
    attrIds: ["acne_inflammatory", "postacne_spots", "scars", "whiteheads"],
    badge: "Breakouts & Recovery",
    insight: "Lower facial area often influenced by hormonal shifts, friction, and residual marks.",
    applicationTip: "Carry your evening moisturizer all the way down across the jawline and neck.",
    coordinates: { top: "66%", left: "20%", width: "60%", height: "26%", borderRadius: "22px" },
  },
];

export default function FaceHeatmap({
  attributes = [],
  activeRegion: propActiveRegion,
  onSelectRegion,
  userPhoto = null,
}) {
  const [internalActive, setInternalActive] = useState("tzone");
  const currentRegionId = propActiveRegion || internalActive;

  const handleSelect = (id) => {
    setInternalActive(id);
    onSelectRegion?.(id);
  };

  const getRegionStatus = (attrIds) => {
    const relevant = attributes.filter((a) => attrIds.includes(a.id));
    if (relevant.some((a) => a.category === "Needs a boost" || (typeof a.userScore === "number" && a.userScore < 70))) {
      return "needs_boost";
    }
    if (relevant.some((a) => a.category === "Fine for now" || (typeof a.userScore === "number" && a.userScore < 85))) {
      return "fine";
    }
    return "good";
  };

  const activeMeta = REGIONS.find((r) => r.id === currentRegionId) || REGIONS[0];
  const activeAttributes = attributes.filter((a) => activeMeta.attrIds.includes(a.id));

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-[#EBE5DC] shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E04234]" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
              Facial Zone Explorer
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            {userPhoto
              ? "Your face photo mapped across 5 primary facial zones. Tap any zone to see localized skin findings."
              : "Explore the 5 facial zones to see how targeted products focus on specific areas."}
          </p>
        </div>

        {propActiveRegion && (
          <button
            type="button"
            onClick={() => onSelectRegion?.(null)}
            className="self-start sm:self-auto text-xs font-semibold text-[#141416] hover:underline cursor-pointer bg-[#FAF9F6] px-3.5 py-1.5 rounded-full border border-[#EBE5DC] transition-colors"
          >
            Show All Conditions
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Clean Biometric Photo Lens with smooth zone highlight overlay (NO fake scanning reticles) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-56 sm:w-64 aspect-[1/1.2] rounded-3xl overflow-hidden border-2 border-[#EBE5DC] bg-[#FAF9F6] shadow-sm">
            {userPhoto ? (
              <>
                <img
                  src={userPhoto}
                  alt="Your Face Scan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                {/* Smooth Animated Zone Highlight Overlay */}
                <motion.div
                  key={activeMeta.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: activeMeta.coordinates.top,
                    left: activeMeta.coordinates.left,
                    width: activeMeta.coordinates.width,
                    height: activeMeta.coordinates.height,
                    borderRadius: activeMeta.coordinates.borderRadius,
                  }}
                  className="border-2 border-[#CD92EB] bg-[#CD92EB]/15 backdrop-blur-[0.5px] shadow-[0_0_16px_rgba(205,146,235,0.4)] pointer-events-none"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#FAF9F6] to-[#FAF9F6]/30 select-none relative">
                <svg viewBox="0 0 200 240" className="w-44 h-52">
                  <ellipse cx="100" cy="115" rx="60" ry="78" fill="#FFFFFF" stroke="#EBE5DC" strokeWidth="2" />
                  <circle cx="80" cy="98" r="3" fill="#CD92EB" />
                  <circle cx="120" cy="98" r="3" fill="#CD92EB" />
                  <path d="M 92 148 Q 100 154 108 148" stroke="#E04234" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 98 106 L 98 126 L 104 126" stroke="#141416" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>

                {/* Animated Zone highlight on svg silhouette */}
                <motion.div
                  key={activeMeta.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute",
                    top: activeMeta.coordinates.top,
                    left: activeMeta.coordinates.left,
                    width: activeMeta.coordinates.width,
                    height: activeMeta.coordinates.height,
                    borderRadius: activeMeta.coordinates.borderRadius,
                  }}
                  className="border-2 border-[#CD92EB] bg-[#CD92EB]/20 pointer-events-none"
                />
              </div>
            )}

            {/* Bottom active zone label pill */}
            <div className="absolute bottom-3 inset-x-3 z-20 text-center">
              <span className="bg-black/70 backdrop-blur-md text-[#FAF9F6] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-white/20 inline-block">
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
                  ? "bg-[#E04234]"
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
                      ? "bg-[#E04234] text-white border-[#E04234] shadow-xs scale-102"
                      : "bg-[#FAF9F6] text-gray-700 border-[#EBE5DC] hover:bg-white hover:border-[#CD92EB]"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  <span>{region.name}</span>
                </button>
              );
            })}
          </div>

          {/* Contextual Zone Diagnostic Breakdown Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF9F6] to-[#FAF9F6]/40 border border-[#EBE5DC] shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#EBE5DC]/80 pb-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E04234]">
                  Zone Focus
                </span>
                <h4 className="font-bold text-gray-900 text-base">{activeMeta.name}</h4>
              </div>
              <span className="text-[10px] font-bold text-[#141416] bg-[#FAF9F6] border border-[#EBE5DC] px-2.5 py-0.5 rounded-full">
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
                        attr.category === "Needs a boost" || (typeof attr.userScore === "number" && attr.userScore < 70)
                          ? "bg-[#FAF9F6] text-[#141416] border-[#EBE5DC]"
                          : attr.category === "Fine for now" || (typeof attr.userScore === "number" && attr.userScore < 85)
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
            <div className="pt-2 border-t border-[#EBE5DC]/80 flex items-start gap-2 text-xs text-[#141416]">
              <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#E04234]" />
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
