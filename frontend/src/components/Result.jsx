import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  MessageCircle,
  Check,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  Target,
  Droplets,
  Activity,
  Layers,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useQuiz } from "../context/QuizContext";
import { CONCERN_LABELS, SKIN_TYPE_LABELS } from "../data/attributes";
import { MILC_CATALOG } from "../data/products";
import FaceHeatmap from "./ui/FaceHeatmap";
import RoutineProtocol from "./ui/RoutineProtocol";
import SkinPassport from "./ui/SkinPassport";
import { submitAssessmentReport } from "../api/quizApi";
import { computeResultsData } from "../utils/scoringEngine";

const SKIN_PILLARS = [
  {
    id: "blemishes",
    title: "Active Blemishes",
    badge: "Blemishes & Redness",
    attrIds: ["whiteheads", "acne_inflammatory", "redness", "postacne_spots"],
    description: "Surface breakouts, microbial congestion, and post-blemish recovery.",
  },
  {
    id: "pores",
    title: "Pores & Texture",
    badge: "Pores & Texture",
    attrIds: ["visible_pores", "scars"],
    description: "Sebum dilation, epidermal smoothness, and follicular clarity.",
  },
  {
    id: "pigment",
    title: "Tone & Pigment",
    badge: "Tone & Pigment",
    attrIds: ["freckles", "pigmentation"],
    description: "Melanin distribution, UV photo-exposure, and tonal uniformity.",
  },
  {
    id: "aging",
    title: "Smoothness & Elasticity",
    badge: "Elasticity & Marks",
    attrIds: ["wrinkles", "moles", "nevi"],
    description: "Collagen elasticity, dynamic expression lines, and skin vitality.",
  },
];

function getScoreStyleMeta(category, score) {
  if (category === "Optimal" || score >= 85) {
    return {
      bar: "bg-emerald-500",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      badgeText: "Optimal",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    };
  }
  if (category === "Balanced" || (score >= 70 && score < 85)) {
    return {
      bar: "bg-amber-500",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      badgeText: "Balanced",
      border: "border-amber-200",
      dot: "bg-amber-500",
    };
  }
  return {
    bar: "bg-[#E04234]",
    badgeBg: "bg-red-50 text-[#E04234] border-red-200",
    badgeText: "Focus Area",
    border: "border-[#E04234]/30",
    dot: "bg-[#E04234]",
  };
}

export default function Result() {
  const { state } = useQuiz();
  const { skinProfile, aboutMe, lifestyle, archivedReportId } = state;

  // Single source of truth computed data
  const resultsData = useMemo(() => computeResultsData(state), [state]);
  const {
    overallScore,
    vitalityScore,
    attributes,
    bandCounts,
    focusAreas,
    priorityCondition,
    strengthCondition,
    isWellBalanced,
    cleanser,
    moisturizer,
    quickTakeawayRoutine,
  } = resultsData;

  // Section visibility toggles
  const [showDeepDetails, setShowDeepDetails] = useState(false);
  const [conditionView, setConditionView] = useState("cards"); // "cards" or "chart"
  const [activePillar, setActivePillar] = useState("all");
  const [activeRegion, setActiveRegion] = useState(null);

  // User name check
  const rawName = aboutMe?.fullName?.trim() || "";
  const isRealName = Boolean(rawName && rawName.toLowerCase() !== "client" && rawName.toLowerCase() !== "your skin profile");
  const titleName = isRealName ? `${rawName}'s` : "Your Personalized";

  const userPhoto = (state?.faceImages || []).find((img) => img?.dataUrl)?.dataUrl || null;

  // Report sync to backend
  const [reportMeta, setReportMeta] = useState(() => ({
    reportId: archivedReportId || null,
    submitted: Boolean(archivedReportId),
  }));

  const syncRanRef = useRef(false);

  useEffect(() => {
    if (reportMeta.reportId || syncRanRef.current) return;
    syncRanRef.current = true;

    (async () => {
      try {
        const res = await submitAssessmentReport({
          aboutMe,
          skinProfile,
          lifestyle,
          attributes,
          vitalityScore,
          summary: `Skin report for ${isRealName ? rawName : "User"}. Score: ${vitalityScore}/100.`,
        });
        if (res?.reportId) {
          setReportMeta({ reportId: res.reportId, submitted: true });
        }
      } catch (err) {
        console.error("Report sync failed:", err);
      }
    })();
  }, [archivedReportId, reportMeta?.reportId, aboutMe, skinProfile, lifestyle, attributes, isRealName, rawName, vitalityScore]);

  const advisorHref = useMemo(() => {
    const repParam = reportMeta?.reportId ? ` (Report: ${reportMeta.reportId})` : "";
    const concernText = isWellBalanced
      ? "My skin is well balanced and I want to maintain it."
      : `My priority is ${priorityCondition?.label || "skin improvement"}.`;
    const text = encodeURIComponent(
      `Hi MILC Skin Lab! I just reviewed my Skin Assessment${repParam}. Score: ${vitalityScore}/100. ${concernText} Could you guide me on my routine?`
    );
    return `https://wa.me/919999999999?text=${text}`;
  }, [reportMeta?.reportId, vitalityScore, isWellBalanced, priorityCondition]);

  const filteredAttributes = useMemo(() => {
    return attributes.filter((attr) => {
      if (activePillar !== "all") {
        const pillar = SKIN_PILLARS.find((p) => p.id === activePillar);
        if (pillar && !pillar.attrIds.includes(attr.id)) return false;
      }
      if (activeRegion) {
        const regionMap = {
          tzone: ["visible_pores", "whiteheads", "acne_inflammatory", "freckles"],
          cheeks: ["redness", "postacne_spots", "freckles", "pigmentation", "scars"],
          forehead: ["wrinkles", "visible_pores", "whiteheads", "pigmentation"],
          undereye: ["wrinkles", "pigmentation"],
          jawline: ["acne_inflammatory", "postacne_spots", "scars", "whiteheads"],
        };
        const allowed = regionMap[activeRegion] || [];
        if (!allowed.includes(attr.id)) return false;
      }
      return true;
    });
  }, [attributes, activePillar, activeRegion]);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6 md:space-y-8 animate-fadeIn pb-24">

      {/* =========================================================================
          SECTION 1: SCORECARD & HONEST SUMMARY
         ========================================================================= */}
      <div id="score-section" className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-8 border border-[#EBE5DC] shadow-xs relative overflow-hidden">
        {/* Top Identification Badge & Medical Disclaimer */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#141416] bg-[#FAF9F6] border border-[#EBE5DC] px-3 py-1 rounded-full shadow-2xs">
              Skin Assessment Report
            </span>
            <span className="text-xs text-[#71717A] font-mono">
              Report ID: <strong className="text-[#141416]">{reportMeta?.reportId || "Generating..."}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
            <Info className="w-3.5 h-3.5 text-[#CD92EB]" />
            <span className="italic">Cosmetic skin analysis, not a medical diagnosis.</span>
          </div>
        </div>

        {/* Hero Score Display */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EBE5DC]">
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl text-[#141416] font-bold tracking-tight leading-tight">
              {titleName} Skin Assessment
            </h1>
            <p className="text-xs sm:text-sm text-[#52525B] mt-2 max-w-xl leading-relaxed">
              Synthesized directly from your answered profile and photo topography. Your overall skin vitality index is <strong className="text-[#141416] font-bold">{vitalityScore}/100</strong>.
            </p>

            {/* Score Band Counts */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {bandCounts.optimal} Optimal (85–100%)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {bandCounts.balanced} Balanced (70–84%)
              </span>
              {bandCounts.focus > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#E04234] border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-[#E04234]" />
                  {bandCounts.focus} Focus Area{bandCounts.focus > 1 ? "s" : ""} (&lt;70%)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF9F6] text-emerald-700 border border-[#EBE5DC]">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  0 Severe Concerns
                </span>
              )}
            </div>
          </div>

          {/* Clean Vitality Gauge */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#EBE5DC] shrink-0 shadow-2xs">
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EBE5DC" strokeWidth="8" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={vitalityScore >= 80 ? "#CD92EB" : "#E04234"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  initial={{ strokeDashoffset: 251 }}
                  animate={{ strokeDashoffset: 251 - (251 * vitalityScore) / 100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#141416]">{vitalityScore}</span>
                <span className="text-[8px] font-mono text-[#71717A] uppercase">/ 100</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-[#141416]">Skin Vitality Index</p>
              <p className="text-xs font-semibold text-[#E04234] mt-0.5">
                {vitalityScore >= 85 ? "Optimal Resilience" : vitalityScore >= 70 ? "Healthy Balance" : "Active Recovery Needed"}
              </p>
              <p className="text-[11px] text-[#71717A] mt-1 max-w-[140px] leading-tight">
                Derived from your 11 biomarker evaluations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: PRIMARY FOCUS AREAS
         ========================================================================= */}
      <div id="priorities-section" className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-8 border border-[#EBE5DC] shadow-xs space-y-6">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-2.5 py-1 rounded-full shadow-2xs">
            TARGET FINDINGS
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141416] mt-2">
            Primary Focus Areas (Score &lt; 85)
          </h2>
        </div>

        {/* Primary Focus Cards - STRICTLY < 85, Never Padded */}
        <div>

          {focusAreas.length === 0 ? (
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-left">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>No major concerns found — All biomarkers are within optimal balance</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1.5 leading-relaxed">
                Your skin demonstrated resilient barrier health with zero conditions scoring below 85. We recommend our daily maintenance protocol to preserve this excellent baseline resilience against UV and seasonal stress.
              </p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${focusAreas.length === 1 ? "md:grid-cols-1" : focusAreas.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"} gap-4`}>
              {focusAreas.map((attr) => {
                const styleMeta = getScoreStyleMeta(attr.category, attr.userScore);
                return (
                  <div
                    key={attr.id}
                    className="p-5 rounded-2xl border border-[#EBE5DC] bg-[#FAF9F6] shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold text-[#71717A]">
                        #{attr.indexNumber}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${styleMeta.badgeBg}`}>
                        {styleMeta.badgeText}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-[#141416]">
                      {attr.label}
                    </h4>

                    {/* Score bar */}
                    <div className="mt-4 pt-3 border-t border-[#EBE5DC] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#141416]">Condition Score:</span>
                        <span className="font-mono font-bold text-[#141416]">{attr.userScore}%</span>
                      </div>
                      <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#EBE5DC]">
                        <div
                          className={`h-full rounded-full ${styleMeta.bar}`}
                          style={{ width: `${attr.userScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: DAILY ROUTINE WITH INCLUDED PRODUCTS & PRICES
         ========================================================================= */}
      <div id="routine-section">
        <RoutineProtocol skinProfile={skinProfile} />
      </div>

      {/* =========================================================================
          SECTION 4: COLLAPSIBLE DEEPER DETAILS (11 Conditions, Facial Zone, Passport)
         ========================================================================= */}
      <div id="deep-diagnostic-section" className="space-y-6">
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setShowDeepDetails(!showDeepDetails)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#EBE5DC] hover:border-[#CD92EB] text-xs font-bold text-[#141416] shadow-2xs transition-all cursor-pointer"
          >
            <span>{showDeepDetails ? "Hide Deep Diagnostic Audit" : "Explore Full 11-Condition Deep Diagnostic & Facial Map"}</span>
            {showDeepDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showDeepDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* 11 Conditions Audit Container */}
            <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-8 border border-[#EBE5DC] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EBE5DC]">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-2.5 py-1 rounded-full shadow-2xs">
                    FULL BIOMETRIC AUDIT
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141416] mt-2">
                    All 11 Evaluated Biomarkers
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-[#FAF9F6] rounded-2xl border border-[#EBE5DC]">
                  <button
                    type="button"
                    onClick={() => setConditionView("cards")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      conditionView === "cards" ? "bg-[#141416] text-white" : "text-[#71717A]"
                    }`}
                  >
                    Card Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setConditionView("chart")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      conditionView === "chart" ? "bg-[#141416] text-white" : "text-[#71717A]"
                    }`}
                  >
                    Comparison Table
                  </button>
                </div>
              </div>

              {/* Pillar Category Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                <button
                  type="button"
                  onClick={() => setActivePillar("all")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    activePillar === "all"
                      ? "bg-[#141416] text-white border-[#141416]"
                      : "bg-[#FAF9F6] text-[#52525B] border-[#EBE5DC] hover:bg-white"
                  }`}
                >
                  All 11 Markers
                </button>
                {SKIN_PILLARS.map((pillar) => (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActivePillar(pillar.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      activePillar === pillar.id
                        ? "bg-[#141416] text-white border-[#141416]"
                        : "bg-[#FAF9F6] text-[#52525B] border-[#EBE5DC] hover:bg-white"
                    }`}
                  >
                    {pillar.title}
                  </button>
                ))}
              </div>

              {conditionView === "cards" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAttributes.map((attr) => {
                    const styleMeta = getScoreStyleMeta(attr.category, attr.userScore);
                    return (
                      <div
                        key={attr.id}
                        className="p-5 rounded-2xl border border-[#EBE5DC] bg-[#FAF9F6] shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-mono font-bold text-[#71717A]">
                            #{attr.indexNumber}
                          </span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${styleMeta.badgeBg}`}>
                            {styleMeta.badgeText}
                          </span>
                        </div>

                        <h4 className="font-serif text-base font-bold text-[#141416]">
                          {attr.label}
                        </h4>

                        <div className="mt-4 pt-3 border-t border-[#EBE5DC] space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#141416]">Condition Score:</span>
                            <span className="font-mono font-bold text-[#141416]">{attr.userScore}%</span>
                          </div>
                          <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#EBE5DC]">
                            <div
                              className={`h-full rounded-full ${styleMeta.bar}`}
                              style={{ width: `${attr.userScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Table View */
                <div className="space-y-2">
                  <div className="grid grid-cols-12 text-xs font-mono font-bold uppercase tracking-wider text-[#71717A] px-3 pb-2 border-b border-[#EBE5DC]">
                    <span className="col-span-5 sm:col-span-4">Biomarker</span>
                    <span className="col-span-4 sm:col-span-5">Score & Band</span>
                    <span className="col-span-3 text-right">Status</span>
                  </div>

                  {filteredAttributes.map((attr) => {
                    const styleMeta = getScoreStyleMeta(attr.category, attr.userScore);
                    return (
                      <div
                        key={attr.id}
                        className="p-3 rounded-xl border border-[#EBE5DC] bg-[#FAF9F6] grid grid-cols-12 items-center gap-2 text-xs"
                      >
                        <div className="col-span-5 sm:col-span-4">
                          <span className="font-mono text-[#71717A]">#{attr.indexNumber} </span>
                          <strong className="text-[#141416]">{attr.label}</strong>
                        </div>
                        <div className="col-span-4 sm:col-span-5 flex items-center gap-2">
                          <span className="font-mono font-bold text-[#141416] w-8 text-right">{attr.userScore}%</span>
                          <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-[#EBE5DC]">
                            <div className={`h-full ${styleMeta.bar}`} style={{ width: `${attr.userScore}%` }} />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styleMeta.badgeBg} hidden sm:inline-block`}>
                            {styleMeta.badgeText}
                          </span>
                        </div>
                        <div className="col-span-3 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styleMeta.badgeBg}`}>
                            {styleMeta.badgeText}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Facial Zone Explorer */}
            <FaceHeatmap
              attributes={attributes}
              activeRegion={activeRegion}
              onSelectRegion={setActiveRegion}
              userPhoto={userPhoto}
            />

            {/* 4-Week Expected Progression */}
            <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-7 border border-[#EBE5DC] shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-2.5 py-1 rounded-full shadow-2xs">
                TRAJECTORY TIMELINE
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141416] mt-2 mb-4">
                Your 4-Week Expected Progression
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EBE5DC] shadow-2xs">
                  <span className="text-xs font-bold text-[#141416] uppercase tracking-wider block">
                    Week 1: Soothe & Hydrate
                  </span>
                  <p className="text-sm font-bold text-[#141416] mt-1">Barrier Relief</p>
                  <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                    Noticeable reduction in tightness, dry flaking, and reactive surface redness.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EBE5DC] shadow-2xs">
                  <span className="text-xs font-bold text-[#141416] uppercase tracking-wider block">
                    Week 2: Clear Pores
                  </span>
                  <p className="text-sm font-bold text-[#141416] mt-1">Oil & Pore Balance</p>
                  <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                    Clears trapped sebum in the central T-zone and visibly calms micro-blemishes.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EBE5DC] shadow-2xs">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                    Week 4+: Healthy Glow
                  </span>
                  <p className="text-sm font-bold text-[#141416] mt-1">Luminous Resilience</p>
                  <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                    Smoother surface texture, gradual fading of superficial spots, and sustained barrier bounce.
                  </p>
                </div>
              </div>
            </div>

            {/* Dossier Passport */}
            <SkinPassport
              reportId={reportMeta?.reportId}
              clientName={isRealName ? rawName : null}
              skinType={skinProfile?.skinType}
              mainConcern={CONCERN_LABELS[skinProfile?.mainConcern]}
              vitalityScore={vitalityScore}
              expertHref={advisorHref}
            />
          </motion.div>
        )}
      </div>

      {/* =========================================================================
          FOOTER DISCLAIMER
         ========================================================================= */}
      <footer className="pt-6 border-t border-[#EBE5DC] text-center text-[11px] text-[#71717A] max-w-2xl mx-auto leading-relaxed">
        <p>
          MILC AI Skin Lab provides educational cosmetic skin profiling and customized topical routines. This assessment is not a clinical medical diagnosis or treatment for dermatological disease.
        </p>
      </footer>
    </div>
  );
}
