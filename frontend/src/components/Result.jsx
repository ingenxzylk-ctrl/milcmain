import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
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
  X,
  ArrowRight,
  ArrowDown,
  Target,
  Droplets,
  Sun,
  Flame,
  Activity,
  Smile,
  Users,
  CircleDot,
  Eye,
  Layers,
  Award,
  Tag,
  Clock,
  Star,
  LayoutGrid,
  BarChart3,
  CreditCard,
  Lock,
  ChevronRight,
  Shield,
  Phone,
} from "lucide-react";
import { useQuiz } from "../context/QuizContext";
import { CONCERN_LABELS, SKIN_TYPE_LABELS } from "../data/attributes";
import { MILC_CATALOG } from "../data/products";
import { PRICING_PLANS } from "../data/questions";
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

  // Pricing selection (default to recommended 3-Months)
  const [selectedPlanId, setSelectedPlanId] = useState("3_months");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Active section for top nav
  const [activeSection, setActiveSection] = useState("score");
  const [showStickyBar, setShowStickyBar] = useState(false);

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

  // Observer for active section & sticky bar
  useEffect(() => {
    const handleScroll = () => {
      const plansEl = document.getElementById("plans-section");
      if (plansEl) {
        const rect = plansEl.getBoundingClientRect();
        // Show sticky CTA if scrolled past the top of the plans section
        setShowStickyBar(rect.top < 0);
      }

      const sections = ["score", "priorities", "routine", "plans", "deep-diagnostic"];
      for (const id of sections) {
        const el = document.getElementById(`${id}-section`);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 160 && r.bottom >= 160) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const selectedPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1];

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

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setOrderSuccess(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setOrderSuccess(false);
    }, 3500);
  };

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
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6 md:space-y-8 animate-fadeIn pb-28">

      {/* =========================================================================
          TOP SMOOTH ANCHOR NAV (Active highlight on scroll)
         ========================================================================= */}
      <nav className="sticky top-2 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-[#EBE5DC] shadow-xs flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        <a
          href="#score-section"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === "score"
              ? "bg-[#141416] text-white shadow-2xs"
              : "text-[#52525B] hover:text-[#141416] hover:bg-[#FAF9F6]"
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#D4FF3F]" />
          <span>Score</span>
        </a>
        <a
          href="#priorities-section"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === "priorities"
              ? "bg-[#141416] text-white shadow-2xs"
              : "text-[#52525B] hover:text-[#141416] hover:bg-[#FAF9F6]"
          }`}
        >
          <Target className="w-3.5 h-3.5 text-[#E04234]" />
          <span>Priorities</span>
        </a>
        <a
          href="#routine-section"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === "routine"
              ? "bg-[#141416] text-white shadow-2xs"
              : "text-[#52525B] hover:text-[#141416] hover:bg-[#FAF9F6]"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#CD92EB]" />
          <span>Your Routine</span>
        </a>
        <a
          href="#plans-section"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === "plans"
              ? "bg-[#E04234] text-white shadow-2xs"
              : "text-[#E04234] hover:bg-red-50"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Plans & Pricing</span>
        </a>
        <a
          href="#deep-diagnostic-section"
          onClick={() => setShowDeepDetails(true)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === "deep-diagnostic"
              ? "bg-[#141416] text-white shadow-2xs"
              : "text-[#52525B] hover:text-[#141416] hover:bg-[#FAF9F6]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#71717A]" />
          <span>Deep Audit (11 Markers)</span>
        </a>
      </nav>

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
          SECTION 2: TOP PRIORITIES & QUICK TAKEAWAY
         ========================================================================= */}
      <div id="priorities-section" className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-8 border border-[#EBE5DC] shadow-xs space-y-6">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-2.5 py-1 rounded-full shadow-2xs">
            TARGET FINDINGS
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141416] mt-2">
            Primary Focus & Strengths
          </h2>
        </div>

        {/* 3-Line Quick Takeaway */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#FAF9F6] to-white border border-[#CD92EB]/40 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#EBE5DC] pb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E04234] animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#141416]">
              Quick Takeaway Summary
            </h3>
          </div>

          <div className="space-y-2.5">
            {/* Line 1: Priority */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#EBE5DC]">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E04234] flex items-center justify-center shrink-0 mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-[#141416]">Your Primary Focus: </span>
                {isWellBalanced ? (
                  <span className="text-[#52525B]">Your skin is well balanced across all tested markers. Maintain this healthy equilibrium with consistent daily care.</span>
                ) : (
                  <>
                    <span className="font-bold text-[#E04234]">{priorityCondition?.label} ({priorityCondition?.userScore}%)</span>
                    <span className="text-[#52525B]"> — {priorityCondition?.actionBenefit}</span>
                  </>
                )}
              </div>
            </div>

            {/* Line 2: Greatest Strength */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-emerald-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-[#141416]">Your Greatest Strength: </span>
                <span className="font-bold text-emerald-700">{strengthCondition?.label} ({strengthCondition?.userScore}%)</span>
                <span className="text-[#52525B]"> — {strengthCondition?.shortTakeaway}</span>
              </div>
            </div>

            {/* Line 3: The 2-Step Routine Agreement */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#EBE5DC]">
              <div className="w-8 h-8 rounded-xl bg-[#FAF9F6] text-[#141416] flex items-center justify-center shrink-0 mt-0.5 border border-[#EBE5DC]">
                <CheckCircle2 className="w-4 h-4 text-[#CD92EB]" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-[#141416]">Your Core 2-Step Protocol: </span>
                <span className="font-bold text-[#141416]">{quickTakeawayRoutine.step1} + {quickTakeawayRoutine.step2}</span>
                <span className="text-[#52525B]"> — {quickTakeawayRoutine.description}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Focus Cards - STRICTLY < 85, Never Padded */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3">
            Primary Focus Areas (Score &lt; 85)
          </h3>

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
                    className="p-5 rounded-2xl border border-[#EBE5DC] bg-[#FAF9F6] shadow-2xs flex flex-col justify-between"
                  >
                    <div>
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

                      <p className="text-xs text-[#52525B] leading-relaxed mt-2">
                        {attr.shortTakeaway}
                      </p>

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

                    {/* Condition specific recommendation */}
                    <div className="mt-4 pt-3 border-t border-[#EBE5DC]">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E04234] block mb-0.5">
                        Targeted Active Formula
                      </span>
                      <p className="text-xs font-bold text-[#141416]">{attr.keyActive}</p>
                      <p className="text-[11px] text-[#52525B] mt-0.5 leading-snug">{attr.actionBenefit}</p>
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
          SECTION 4: PLANS & PRIMARY SINGLE CTA (Within ~2 screens!)
         ========================================================================= */}
      <div id="plans-section" className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-8 md:p-10 border border-[#EBE5DC] shadow-sm relative overflow-hidden">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-3.5 py-1 rounded-full shadow-2xs">
            TREATMENT PLANS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141416] mt-2">
            Choose Your Routine Protocol
          </h2>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1.5 leading-relaxed">
            Formulated to target your specific score of {vitalityScore}/100. Select a plan below to continue.
          </p>
        </div>

        {/* Pricing Cards Grid (Selectable Radio-style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-left">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "border-[#E04234] bg-white shadow-md ring-2 ring-[#E04234]/15 scale-[1.01]"
                    : "border-[#EBE5DC] bg-[#FAF9F6] hover:bg-white hover:border-[#CD92EB]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E04234] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    MOST POPULAR
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-[#E04234] bg-[#E04234]" : "border-[#71717A]"
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#141416]">{plan.title}</h3>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-extrabold text-[#141416]">
                      {plan.price}
                    </span>
                    <span className="text-xs font-mono text-[#71717A]">
                      ({plan.dailyRate} {plan.period})
                    </span>
                  </div>

                  {/* Billing Details Note */}
                  <p className="text-[11px] text-[#52525B] mt-1.5 leading-snug">
                    {plan.billingNote}
                  </p>

                  {/* Products Included Notice */}
                  <div className="mt-3 py-1.5 px-2.5 rounded-xl bg-white border border-[#EBE5DC] text-[11px] font-semibold text-[#141416]">
                    🎁 {plan.productsIncludedText}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-4 space-y-2 text-xs text-[#52525B] pt-3 border-t border-[#EBE5DC]">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear Ambiguity Line */}
        <div className="text-center py-2.5 px-4 rounded-2xl bg-[#FAF9F6] border border-[#EBE5DC] max-w-xl mx-auto mb-6 text-xs text-[#52525B]">
          <strong className="text-[#141416]">What you get:</strong> 11-Condition Biometric Profile & Custom Routine Protocol.
          <br className="hidden sm:inline" /> <strong className="text-[#141416]">Products:</strong> Included in all kits as stated above with zero hidden recurring fees.
        </div>

        {/* SINGLE PRIMARY CTA BUTTON */}
        <div className="max-w-md mx-auto space-y-3">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full h-13 rounded-full bg-[#E04234] hover:bg-[#C73024] text-white text-sm font-bold shadow-[0_8px_20px_-4px_rgba(224,66,52,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue with {selectedPlan?.title} · {selectedPlan?.price}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>

          {/* Secondary WhatsApp link */}
          <a
            href={advisorHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-full border border-[#EBE5DC] bg-[#FAF9F6] hover:bg-white text-xs font-bold text-[#52525B] hover:text-[#141416] transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Prefer to order or ask questions via WhatsApp? Chat with Advisor</span>
          </a>
        </div>

        {/* Trust Row near checkout */}
        <div className="mt-6 pt-5 border-t border-[#EBE5DC] flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-[#71717A]">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#CD92EB]" />
            <span>14-Day Formulation Adjustment Guarantee</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#141416]" />
            <span>Support: support@milccosmetics.com</span>
          </span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 5: COLLAPSIBLE DEEPER DETAILS (11 Conditions, Facial Zone, Passport)
         ========================================================================= */}
      <div id="deep-diagnostic-section" className="space-y-6">
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setShowDeepDetails(!showDeepDetails)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#EBE5DC] hover:border-[#CD92EB] text-xs font-bold text-[#141416] shadow-2xs transition-all cursor-pointer"
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
                        className="p-5 rounded-2xl border border-[#EBE5DC] bg-[#FAF9F6] flex flex-col justify-between shadow-2xs"
                      >
                        <div>
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

                          <p className="text-xs text-[#52525B] leading-relaxed mt-2 min-h-[38px]">
                            {attr.shortTakeaway}
                          </p>

                          <div className="mt-4 pt-3 border-t border-[#EBE5DC] space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#141416]">Score:</span>
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

                        <div className="mt-4 pt-3 border-t border-[#EBE5DC]">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E04234] block mb-0.5">
                            Action
                          </span>
                          <p className="text-xs font-bold text-[#141416]">{attr.keyActive}</p>
                          <p className="text-[11px] text-[#52525B] mt-0.5 leading-snug">{attr.actionBenefit}</p>
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
                    <span className="col-span-3 text-right">Target Active</span>
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
                        <div className="col-span-3 text-right truncate text-[11px] text-[#52525B]">
                          {attr.keyActive}
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
          STICKY MOBILE & DESKTOP BOTTOM BAR (Shows once user passes plans)
         ========================================================================= */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-[#EBE5DC] shadow-lg flex items-center justify-between max-w-lg mx-auto sm:rounded-t-3xl"
          >
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-9 h-9 rounded-full bg-[#141416] text-[#D4FF3F] font-mono font-bold text-xs flex items-center justify-center">
                {vitalityScore}
              </div>
              <div>
                <p className="text-xs font-bold text-[#141416] leading-tight">{selectedPlan?.title}</p>
                <p className="text-[11px] font-mono text-[#E04234] font-bold">{selectedPlan?.price}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="h-10 px-5 rounded-full bg-[#E04234] hover:bg-[#C73024] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          CHECKOUT MODAL
         ========================================================================= */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EBE5DC] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#141416]">Order Protocol Kit</h3>
                  <p className="text-xs text-[#52525B] mt-0.5">
                    {selectedPlan?.title} · <strong className="font-mono text-[#E04234]">{selectedPlan?.price}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF9F6] text-[#71717A] flex items-center justify-center cursor-pointer hover:bg-[#EBE5DC]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[#141416]">Order Confirmed!</h4>
                  <p className="text-xs text-[#52525B] max-w-xs mx-auto leading-relaxed">
                    Your customized regimen kit is being prepared. You will receive confirmation and tracking details via SMS/WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#141416] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      defaultValue={isRealName ? rawName : ""}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E04234]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#141416] block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E04234]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#141416] block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E04234]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#141416] block mb-1">Shipping Address (India)</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House / Flat No., Street, Landmark"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E04234]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#141416] block mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E04234]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#141416] block mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        placeholder="PIN Code"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E04234]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#141416] block mb-1.5">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl border-2 border-[#E04234] bg-red-50/40 text-center text-xs font-bold text-[#141416]">
                        UPI / QR
                      </div>
                      <div className="p-2.5 rounded-xl border border-gray-200 text-center text-xs text-[#71717A]">
                        Cards
                      </div>
                      <div className="p-2.5 rounded-xl border border-gray-200 text-center text-xs text-[#71717A]">
                        Net Banking
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 rounded-full bg-[#E04234] hover:bg-[#C73024] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {selectedPlan?.price} & Confirm Protocol Kit</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
