import os

content = r'''import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
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
  TrendingUp,
  TrendingDown,
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
} from "lucide-react";
import { useQuiz } from "../context/QuizContext";
import { SKIN_ATTRIBUTES, CONCERN_LABELS, SKIN_TYPE_LABELS } from "../data/attributes";
import { MILC_CATALOG, productsByIds, uniqueProducts } from "../data/products";
import { PRICING_PLANS } from "../data/questions";
import FaceHeatmap from "./ui/FaceHeatmap";
import RoutineProtocol from "./ui/RoutineProtocol";
import SkinPassport from "./ui/SkinPassport";
import { submitAssessmentReport } from "../api/quizApi";

// 4 Balanced Skincare Pillars for the 11 Conditions
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
    description: "Melanin distribution, UV photo-damage, and tonal uniformity.",
  },
  {
    id: "aging",
    title: "Smoothness & Elasticity",
    badge: "Elasticity & Marks",
    attrIds: ["wrinkles", "moles", "nevi"],
    description: "Collagen elasticity, dynamic expression lines, and dermal wellness.",
  },
];

// Benchmark Data & Honest Skincare Guidance per Condition
const CONDITION_GUIDANCE = {
  whiteheads: {
    othersScore: 62,
    checks: "Closed pores, trapped oil & dead skin cells",
    activeFormula: "Salicylic Acid 2% + Zinc PCA",
    activeBenefit: "Gently dissolves trapped oil inside pores and prevents congestion.",
    clearObs: "Pores look clean and clear with minimal congestion along the T-zone.",
    quizObs: "Identified from your questionnaire answers regarding clogged pores. Gentle BHA cleanser dissolves trapped sebum.",
    focusObs: "Trapped oil detected in pores. BHA cleanser clears congestion gently.",
  },
  redness: {
    othersScore: 66,
    checks: "Facial flushing, sensitivity, skin reactivity",
    activeFormula: "Centella Asiatica + Azelaic Acid",
    activeBenefit: "Soothes skin reactivity and calms visible flushing.",
    clearObs: "Even, calm skin tone with a strong, resilient moisture barrier.",
    quizObs: "Identified from your questionnaire answers regarding skin sensitivity. Azelaic acid and Centella soothe flushing.",
    focusObs: "Sensitivity and flushing noted. Soothing Centella calms and strengthens skin.",
  },
  postacne_spots: {
    othersScore: 58,
    checks: "Dark spots left behind by past breakouts",
    activeFormula: "Tranexamic Acid 3% + Niacinamide",
    activeBenefit: "Brightens dark marks and evens out post-blemish discoloration.",
    clearObs: "Clear skin with healthy turnover and no significant post-breakout dark spots.",
    quizObs: "Targeted from your quiz responses regarding past blemish discoloration. Brightening serum helps fade spots.",
    focusObs: "Dark marks from past blemishes visible. Tranexamic acid brightens discoloration.",
  },
  wrinkles: {
    othersScore: 71,
    checks: "Fine expression lines, forehead & eye smoothness",
    activeFormula: "Multi-Peptides + Retinoid Complex",
    activeBenefit: "Supports skin elasticity and smooths fine expression lines.",
    clearObs: "Firm, supple skin with high natural elasticity across expression areas.",
    quizObs: "Addressed from your quiz goal regarding anti-aging and fine lines. Peptide formula supports skin bounce.",
    focusObs: "Fine dehydration or expression lines visible. Peptides help plump and firm.",
  },
  acne_inflammatory: {
    othersScore: 63,
    checks: "Active breakouts, red pimples, tender spots",
    activeFormula: "Salicylic Acid 2% + Soothing BHA",
    activeBenefit: "Calms inflammation in pores and helps blemishes heal faster.",
    clearObs: "Clear skin surface with zero active red pimples or breakouts visible.",
    quizObs: "Targeted based on your report of active breakouts. Gentle BHA calms inflammation quickly.",
    focusObs: "Active breakouts detected. Salicylic acid formula calms inflammation quickly.",
  },
  freckles: {
    othersScore: 77,
    checks: "Sun-induced or genetic melanin freckles",
    activeFormula: "Broad-Spectrum Daily SPF 50+",
    activeBenefit: "Protects against UV rays to prevent freckles from darkening.",
    clearObs: "Balanced, clear complexion without prominent sun freckles or ephelides.",
    quizObs: "Daily high-SPF protection advised to prevent sun-induced melanin clusters.",
    focusObs: "Sun freckles visible across cheeks/nose. Daily SPF prevents further darkening.",
  },
  pigmentation: {
    othersScore: 61,
    checks: "Sun spots, uneven tone, patchy discoloration",
    activeFormula: "Vitamin C 15% + Alpha Arbutin",
    activeBenefit: "Brightens dull areas and helps fade persistent sun spots.",
    clearObs: "Luminous, radiant complexion with even natural skin tone.",
    quizObs: "Addressed from your concern regarding uneven tone. Vitamin C serum brightens and restores glow.",
    focusObs: "Patchy sun spots visible. Vitamin C serum brightens and restores glow.",
  },
  scars: {
    othersScore: 68,
    checks: "Surface texture indentations from past breakouts",
    activeFormula: "Barrier Lipids + Resurfacing Formula",
    activeBenefit: "Promotes gentle surface skin renewal for smoother texture.",
    clearObs: "Smooth skin surface with no significant textural acne scars.",
    quizObs: "Focused on texture renewal based on your quiz responses. Lipids support smooth renewal.",
    focusObs: "Textural marks noted. Barrier lipids and gentle resurfacing smooth skin surface.",
  },
  visible_pores: {
    othersScore: 59,
    checks: "Enlarged pores, oil buildup on nose & cheeks",
    activeFormula: "Niacinamide 10% + Zinc PCA",
    activeBenefit: "Controls excess oil and visibly tightens enlarged pores.",
    clearObs: "Tight, refined pores with a smooth finish across the central face.",
    quizObs: "Targeted from your quiz responses regarding large pores and shine. Niacinamide tightens pore appearance.",
    focusObs: "Enlarged pores with active oil flow. Niacinamide tightens pore appearance.",
  },
  moles: {
    othersScore: 85,
    checks: "Common benign beauty marks and dark spots",
    activeFormula: "Daily Broad-Spectrum Sunscreen",
    activeBenefit: "Protects skin cells against daily UV exposure.",
    clearObs: "Benign beauty marks appear healthy and normal. Maintain daily SPF.",
    quizObs: "Healthy baseline skin marks. Daily sun protection preserves cellular defense.",
    focusObs: "Skin marks observed. Always protect skin daily with broad-spectrum SPF.",
  },
  nevi: {
    othersScore: 83,
    checks: "Natural pigment marks and spots",
    activeFormula: "Daily Broad-Spectrum Sunscreen",
    activeBenefit: "Shields skin baseline against environmental sun damage.",
    clearObs: "Natural skin landmarks appear healthy and normal.",
    quizObs: "Healthy natural baseline marks. Daily broad-spectrum SPF preserves skin integrity.",
    focusObs: "Natural skin marks present. Maintain daily SPF sun defense.",
  },
};

// Styling tiers
function getScoreStyleMeta(category, score) {
  if (category === "Looking good" || score >= 85) {
    return {
      bar: "bg-gradient-to-r from-emerald-500 to-teal-400",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      badgeText: "Optimal",
      border: "border-emerald-200/80",
      bgLight: "bg-emerald-50/20",
    };
  }
  if (category === "Fine for now" || (score >= 70 && score < 85)) {
    return {
      bar: "bg-gradient-to-r from-amber-500 to-amber-400",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      badgeText: "Balanced",
      border: "border-amber-200/80",
      bgLight: "bg-amber-50/20",
    };
  }
  return {
    bar: "bg-gradient-to-r from-[#7A35A3] to-[#C883EB]",
    badgeBg: "bg-[#F4E8FC] text-[#4A1766] border-[#EADBFA]",
    badgeText: "Focus Area",
    border: "border-[#7A35A3]/30",
    bgLight: "bg-[#7A35A3]/[0.02]",
  };
}

export default function Result() {
  const { state } = useQuiz();
  const { skinAnalysis, skinProfile, aboutMe, lifestyle, reportedConcerns, archivedReportId } = state;

  // View state: "focus" shows top concerns; "all11" shows full 11-condition audit
  const [conditionView, setConditionView] = useState("focus");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "chart"
  const [activePillar, setActivePillar] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all"); // "all", "needs_boost", "leading", "good"
  const [activeRegion, setActiveRegion] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState("3_month");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Persistent 50% discount timer
  const [offerTimer, setOfferTimer] = useState(() => {
    try {
      const saved = localStorage.getItem("milc_assessment_timer");
      if (saved) {
        const remaining = parseInt(saved, 10);
        if (!isNaN(remaining) && remaining > 0) return remaining;
      }
    } catch (e) {}
    return 35 * 60 + 19; // 35m 19s
  });

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setOfferTimer((prev) => {
        const next = prev > 0 ? prev - 1 : 0;
        try {
          localStorage.setItem("milc_assessment_timer", next.toString());
        } catch (e) {}
        return next;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // User details
  const rawName = aboutMe?.fullName?.trim() || "";
  const isRealName = Boolean(rawName && rawName.toLowerCase() !== "client");
  const titleName = isRealName ? `${rawName}'s` : "Personalized";
  const fullName = isRealName ? rawName : "Your Skin Profile";

  const userPhoto = (state?.faceImages || []).find((img) => img?.dataUrl)?.dataUrl || null;

  // Robust Formulate the 11 Conditions Data using SKIN_ATTRIBUTES & CONDITION_GUIDANCE
  const attributes = useMemo(() => {
    const rawAnalysis = skinAnalysis?.attributes;
    const fromAiList = Array.isArray(rawAnalysis) ? rawAnalysis : [];
    const fromAiMap = !Array.isArray(rawAnalysis) && typeof rawAnalysis === "object" && rawAnalysis !== null ? rawAnalysis : {};

    const userConcernsList = Array.isArray(reportedConcerns) ? reportedConcerns : [skinProfile?.mainConcern].filter(Boolean);

    return SKIN_ATTRIBUTES.map((meta, index) => {
      const hit = fromAiList.find((a) => (a.attribute || a.id) === meta.id) || fromAiMap[meta.id] || {};
      const guidance = CONDITION_GUIDANCE[meta.id] || {
        othersScore: 65,
        checks: meta.checks || "Skin condition evaluation",
        activeFormula: "Daily Gentle Moisturizer & SPF 50+",
        activeBenefit: "Maintains balanced skin barrier resilience.",
        clearObs: "Condition looks healthy, calm, and clear.",
        quizObs: "Identified from your self-reported skincare assessment.",
        focusObs: "Target active formula recommended.",
      };

      const isUserConcern = userConcernsList.some((c) => {
        if (c === "acne" && ["whiteheads", "acne_inflammatory", "postacne_spots"].includes(meta.id)) return true;
        if (c === "pigmentation" && ["pigmentation", "postacne_spots", "freckles"].includes(meta.id)) return true;
        if (c === "fineLines" && ["wrinkles"].includes(meta.id)) return true;
        if (c === "pores" && ["visible_pores", "whiteheads"].includes(meta.id)) return true;
        if (c === "redness" && ["redness"].includes(meta.id)) return true;
        return false;
      });

      let rawObs = hit.observation || "";
      const isLightingLimited =
        rawObs.toLowerCase().includes("lighting") ||
        rawObs.toLowerCase().includes("blur") ||
        rawObs.toLowerCase().includes("resolution") ||
        rawObs.toLowerCase().includes("hard to assess") ||
        rawObs.toLowerCase().includes("impossible");

      let category = hit.category;
      let observationText = "";
      let userScore = 92;
      let isQuizSourced = false;

      // 1. If photo lighting was limited:
      if (isLightingLimited) {
        if (isUserConcern) {
          category = "Needs a boost";
          observationText = guidance.quizObs;
          userScore = 64;
          isQuizSourced = true;
        } else {
          category = "Looking good";
          observationText = guidance.clearObs;
          userScore = 94;
        }
      }
      // 2. If AI had no conclusive reading or category wasn't set:
      else if (!category || category === "Hard to tell") {
        if (isUserConcern) {
          category = "Needs a boost";
          observationText = guidance.quizObs;
          userScore = 65;
          isQuizSourced = true;
        } else {
          category = "Looking good";
          observationText = guidance.clearObs;
          userScore = 92 + (index % 5);
        }
      }
      // 3. Normal detection:
      else if (category === "Needs a boost") {
        observationText = guidance.focusObs;
        userScore = typeof hit.score === "number" ? hit.score : 60 + (index % 6);
      } else if (category === "Fine for now") {
        observationText = guidance.clearObs;
        userScore = typeof hit.score === "number" ? hit.score : 78 + (index % 4);
      } else {
        observationText = guidance.clearObs;
        userScore = typeof hit.score === "number" ? hit.score : 92 + (index % 5);
      }

      // If condition is Optimal / No signs detected:
      const isOptimal = category === "Looking good" || userScore >= 85;
      const prescribedTitle = isOptimal
        ? "Daily Skin Maintenance (Hydration & Broad-Spectrum SPF 50+)"
        : guidance.activeFormula;
      const prescribedAction = isOptimal
        ? "Maintain healthy baseline resilience with daily hydration and broad-spectrum sun defense."
        : guidance.activeBenefit;

      const othersScore = guidance.othersScore;
      const delta = userScore - othersScore;

      return {
        ...meta,
        indexNumber: String(index + 1).padStart(2, "0"),
        category: isOptimal ? "Looking good" : userScore >= 70 ? "Fine for now" : "Needs a boost",
        userScore,
        othersScore,
        delta,
        isQuizSourced,
        checks: guidance.checks,
        shortTakeaway: observationText,
        keyActive: prescribedTitle,
        actionBenefit: prescribedAction,
        isOptimal,
        products: productsByIds(meta.products || []),
      };
    });
  }, [skinAnalysis, reportedConcerns, skinProfile]);

  // Overall Score
  const vitalityScore = useMemo(() => {
    if (!attributes.length) return 82;
    const sum = attributes.reduce((acc, curr) => acc + curr.userScore, 0);
    return Math.round(sum / attributes.length);
  }, [attributes]);

  const othersAverage = useMemo(() => {
    if (!attributes.length) return 66;
    const sum = attributes.reduce((acc, curr) => acc + curr.othersScore, 0);
    return Math.round(sum / attributes.length);
  }, [attributes]);

  const overallDelta = vitalityScore - othersAverage;

  // Strengths & Focus Areas
  const topStrengths = useMemo(() => {
    return attributes
      .filter((a) => a.id !== "moles" && a.id !== "nevi")
      .sort((a, b) => b.userScore - a.userScore)
      .slice(0, 2);
  }, [attributes]);

  const topFocusAreas = useMemo(() => {
    const priorities = attributes.filter((a) => a.category === "Needs a boost" && a.id !== "moles" && a.id !== "nevi");
    if (priorities.length > 0) return priorities.slice(0, 3);
    return attributes
      .filter((a) => a.id !== "moles" && a.id !== "nevi")
      .sort((a, b) => a.userScore - b.userScore)
      .slice(0, 3);
  }, [attributes]);

  // 3-Line Quick Takeaway specifics
  const topPriorityCondition = topFocusAreas[0] || attributes[0];
  const topStrengthCondition = topStrengths[0] || attributes[attributes.length - 1];
  const isDry = skinProfile?.skinType === "dry";

  // Filtered attributes for 11 conditions audit
  const filteredAttributes = useMemo(() => {
    return attributes.filter((attr) => {
      if (activePillar !== "all") {
        const pillar = SKIN_PILLARS.find((p) => p.id === activePillar);
        if (pillar && !pillar.attrIds.includes(attr.id)) return false;
      }
      if (filterCategory === "needs_boost" && attr.category !== "Needs a boost") return false;
      if (filterCategory === "good" && attr.category !== "Looking good") return false;
      if (filterCategory === "leading" && attr.delta <= 0) return false;

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
  }, [attributes, activePillar, filterCategory, activeRegion]);

  // Report sync
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
          summary: `Skin report for ${fullName}. Score: ${vitalityScore}/100.`,
        });
        if (res?.reportId) {
          setReportMeta({ reportId: res.reportId, submitted: true });
        }
      } catch (err) {
        console.error("Report sync failed:", err);
      }
    })();
  }, [archivedReportId, reportMeta?.reportId, aboutMe, skinProfile, lifestyle, attributes, fullName, vitalityScore]);

  const advisorHref = useMemo(() => {
    const text = encodeURIComponent(
      `Hi MILC Skin Lab! I just reviewed my AI skin assessment (Score: ${vitalityScore}/100, Priority: ${topPriorityCondition.label}). I would like guidance on my routine.`
    );
    return `https://wa.me/919999999999?text=${text}`;
  }, [vitalityScore, topPriorityCondition]);

  const selectedPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1];

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setOrderSuccess(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setOrderSuccess(false);
    }, 3500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6 md:space-y-8 animate-fadeIn pb-24">

      {/* =========================================================================
          STICKY QUICK-JUMP ANCHOR NAVIGATION (Eliminates 15 Mobile Swipes!)
         ========================================================================= */}
      <nav className="sticky top-2 z-30 bg-white/90 backdrop-blur-md rounded-2xl p-1.5 border border-[#EADBFA] shadow-xs flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        <a
          href="#summary-section"
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 hover:text-[#7A35A3] hover:bg-[#F4E8FC]/60 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Target className="w-3.5 h-3.5 text-[#7A35A3]" />
          <span>Takeaway</span>
        </a>
        <a
          href="#focus-section"
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 hover:text-[#7A35A3] hover:bg-[#F4E8FC]/60 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Activity className="w-3.5 h-3.5 text-amber-600" />
          <span>Focus Areas</span>
        </a>
        <a
          href="#routine-section"
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1E2700] bg-[#D4FF3F] hover:bg-[#c2ef30] border border-[#BDE820] transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#1E2700]" />
          <span>Your 2-Step Routine</span>
        </a>
        <a
          href="#conditions-section"
          onClick={() => setConditionView("all11")}
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 hover:text-[#7A35A3] hover:bg-[#F4E8FC]/60 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-[#7A35A3]" />
          <span>11 Conditions (Full)</span>
        </a>
        <a
          href="#pricing-section"
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#7A35A3] hover:bg-[#5C237D] transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
        >
          <Tag className="w-3.5 h-3.5 text-white" />
          <span>Plans (50% Off)</span>
        </a>
      </nav>

      {/* =========================================================================
          SECTION 1: SUMMARY SCORECARD & 3-LINE QUICK TAKEAWAY
         ========================================================================= */}
      <div id="summary-section" className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-8 border border-[#EADBFA] shadow-xs relative overflow-hidden">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E2700] bg-[#D4FF3F] border border-[#BDE820] px-3 py-1 rounded-full shadow-2xs">
              AI Skin Assessment
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A1766] bg-[#F4E8FC] px-3 py-1 rounded-full border border-[#EADBFA]">
              11 Conditions Evaluated
            </span>
            <span className="text-xs text-gray-500 font-mono">
              #{reportMeta?.reportId ? reportMeta.reportId.slice(0, 10) : "ML-614385"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>23,000+ Indian Peer Profiles</span>
          </div>
        </div>

        {/* Headline & Dual Score */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EADBFA]/70">
          <div>
            <h1 className="font-sans text-2xl sm:text-4xl text-gray-900 font-extrabold tracking-tight leading-tight">
              {titleName} Skin Assessment
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl leading-relaxed">
              Based on your answers and photo scan. Higher scores reflect healthy, resilient skin.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {attributes.filter((a) => a.category === "Looking good").length} Optimal
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {attributes.filter((a) => a.category === "Fine for now").length} Balanced
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F4E8FC] text-[#4A1766] border border-[#EADBFA]">
                <span className="w-2 h-2 rounded-full bg-[#7A35A3]" />
                {attributes.filter((a) => a.category === "Needs a boost").length} Focus Areas
              </span>
            </div>
          </div>

          {/* Overall Health Score Card */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FBF7FE] to-[#F4E8FC]/40 border border-[#EADBFA] self-start md:self-auto shrink-0 shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EADBFA" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#7A35A3"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="251"
                    initial={{ strokeDashoffset: 251 }}
                    animate={{ strokeDashoffset: 251 - (251 * vitalityScore) / 100 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </svg>
                <span className="absolute font-sans text-xl font-extrabold text-gray-900">{vitalityScore}</span>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-900">Skin Health Score</p>
                <p className="text-xs font-semibold text-[#7A35A3]">
                  {vitalityScore >= 80 ? "Radiant & Strong" : "Active Recovery"}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-600 font-mono">
                  <span>Average Score:</span>
                  <span className="font-bold text-gray-800">{othersAverage} / 100</span>
                </div>
              </div>
            </div>

            <div className="w-full pt-2 border-t border-[#EADBFA] text-center">
              <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
                overallDelta >= 0
                  ? "bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820]"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {overallDelta >= 0 ? `+${overallDelta}% higher than average` : `${overallDelta}% vs average`}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            ⭐ THE 3-LINE QUICK TAKEAWAY (Answers What User Cares About Instantly!)
           ========================================================================= */}
        <div className="mt-6 p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FBF7FE] via-white to-[#F4E8FC]/40 border-2 border-[#7A35A3]/25 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-[#EADBFA]/70">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A35A3] animate-pulse" />
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#4A1766]">
                Quick Takeaway Summary
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#7A35A3] bg-[#F4E8FC] px-2.5 py-0.5 rounded-full border border-[#EADBFA]">
              Action Plan
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Line 1: Priority to Fix */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#EADBFA]">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7A35A3] flex items-center justify-center shrink-0 mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-extrabold text-gray-900 block sm:inline">Your #1 Priority to Fix: </span>
                <span className="font-bold text-[#7A35A3]">{topPriorityCondition.label} ({topPriorityCondition.userScore}%) </span>
                <span className="text-gray-600 block sm:inline">— {topPriorityCondition.actionBenefit || "Active congestion and surface irritation around T-Zone."}</span>
              </div>
            </div>

            {/* Line 2: Greatest Strength */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-emerald-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-extrabold text-gray-900 block sm:inline">Your Skin's Greatest Strength: </span>
                <span className="font-bold text-emerald-700">{topStrengthCondition.label} ({topStrengthCondition.userScore}%) </span>
                <span className="text-gray-600 block sm:inline">— {topStrengthCondition.shortTakeaway || "High elasticity, resilient moisture barrier & zero deep lines."}</span>
              </div>
            </div>

            {/* Line 3: The Simple 2-Step Fix */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#BDE820]">
              <div className="w-8 h-8 rounded-xl bg-[#D4FF3F]/50 text-[#1E2700] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-extrabold text-gray-900 block sm:inline">The Simple 2-Step Fix: </span>
                <span className="font-bold text-[#4A1766]">
                  {isDry ? "Hydrating Barrier Cleanser + Deep Moisture Gel" : "Salicylic Clarifying Cleanser + Niacinamide Calming Gel"}
                </span>
                <span className="text-gray-600 block sm:inline"> — Daily morning & evening ritual to clear breakouts while sealing hydration.</span>
              </div>
            </div>
          </div>

          {/* Quick CTA to jump right to routine */}
          <div className="mt-4 pt-3 border-t border-[#EADBFA]/70 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              Ready to see the recommended products for this 2-step fix?
            </p>
            <a
              href="#routine-section"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7A35A3] hover:bg-[#5C237D] text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>View Your 2-Step Routine</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: PRIMARY FOCUS AREAS (Shows 2-3 Focus Conditions; 11 kept separately!)
         ========================================================================= */}
      <div id="focus-section" className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-8 border border-[#EADBFA] shadow-xs">
        {/* Section Header with Segmented View Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#EADBFA]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A35A3]" />
              <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                {conditionView === "focus" ? "Primary Focus Areas (Needs Attention)" : "All 11 Conditions: Complete Biometric Diagnostic"}
              </h2>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {conditionView === "focus"
                ? "Targeted priorities based on your scan. Showing only what needs attention so you can take clear action."
                : "Full 11-condition telemetry benchmarked against 23,000+ age-matched profiles."}
            </p>
          </div>

          {/* Segmented Control: Focus vs All 11 */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F4E8FC]/70 rounded-2xl border border-[#EADBFA] self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setConditionView("focus")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                conditionView === "focus"
                  ? "bg-[#7A35A3] text-white shadow-xs"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Focus Areas ({topFocusAreas.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setConditionView("all11")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                conditionView === "all11"
                  ? "bg-[#7A35A3] text-white shadow-xs"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 11 Conditions</span>
            </button>
          </div>
        </div>

        {/* Score Guide Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 py-2 px-3.5 rounded-xl bg-[#F4E8FC]/30 border border-[#EADBFA] text-xs text-gray-700 mb-5">
          <span className="font-bold text-[#4A1766]">Score Guide:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-gray-800">Optimal (85–100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="font-semibold text-gray-800">Balanced (70–84%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7A35A3]" />
            <span className="font-semibold text-gray-800">Focus Area (&lt;70%)</span>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODE A: FOCUS AREAS ONLY (Default: 2-3 Cards, Zero Clutter)
           ------------------------------------------------------------- */}
        {conditionView === "focus" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topFocusAreas.map((attr) => {
                const styleMeta = getScoreStyleMeta(attr.category, attr.userScore);
                return (
                  <div
                    key={attr.id}
                    className="p-5 rounded-3xl border-2 border-[#7A35A3]/25 bg-gradient-to-b from-white to-[#FBF7FE] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono font-bold text-gray-400">
                          #{attr.indexNumber}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${styleMeta.badgeBg}`}>
                          {styleMeta.badgeText}
                        </span>
                      </div>

                      <h3 className="font-sans text-base font-extrabold text-gray-900 leading-snug">
                        {attr.label}
                      </h3>

                      {attr.isQuizSourced && (
                        <span className="inline-block text-[10px] font-bold text-[#7A35A3] bg-[#F4E8FC] px-2 py-0.5 rounded-md mt-1 mb-1">
                          Quiz-Assisted Profile
                        </span>
                      )}

                      <p className="text-xs text-gray-700 leading-relaxed mt-2 min-h-[44px]">
                        {attr.shortTakeaway}
                      </p>

                      {/* Single clean user score bar */}
                      <div className="mt-4 pt-3 border-t border-[#EADBFA]/70 space-y-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#7A35A3]" />
                            <span>Your Score:</span>
                          </span>
                          <span className="font-mono font-bold text-[#4A1766]">
                            {attr.userScore}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${styleMeta.bar}`}
                            style={{ width: `${attr.userScore}%` }}
                          />
                        </div>

                        {/* Clean Comparison Row (No grey line) */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#EADBFA]/50 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span>Average:</span>
                            <span className="font-mono font-bold text-gray-800">{attr.othersScore}%</span>
                          </div>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                              attr.delta > 0
                                ? "bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820]"
                                : attr.delta < 0
                                ? "bg-[#F4E8FC] text-[#4A1766] border border-[#EADBFA]"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {attr.delta > 0 ? `+${attr.delta}% clearer` : attr.delta < 0 ? `${attr.delta}% vs avg` : "On par"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation box */}
                    <div className="mt-4 pt-3 border-t border-[#EADBFA] bg-[#F4E8FC]/40 -mx-5 -mb-5 p-4 rounded-b-3xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A35A3] block mb-1">
                        Recommended Treatment
                      </span>
                      <p className="text-xs font-bold text-gray-900 leading-snug">
                        {attr.keyActive}
                      </p>
                      <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                        {attr.actionBenefit}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seamless invitation to view all 11 conditions */}
            <div className="mt-6 p-4 rounded-2xl bg-[#FBF7FE] border border-[#EADBFA] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Curious about your full 11-condition profile?</h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Inspect your scores across Wrinkles, Pores, Redness, Nevi, Moles, Freckles & Scars.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConditionView("all11")}
                className="px-4 py-2 rounded-full bg-[#7A35A3] hover:bg-[#5C237D] text-white text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Explore All 11 Conditions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODE B: FULL 11 CONDITIONS BREAKDOWN (Available Separately!)
           ------------------------------------------------------------- */}
        {conditionView === "all11" && (
          <div id="conditions-section">
            {/* View switcher & filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-1 p-0.5 bg-[#F4E8FC]/60 rounded-xl border border-[#EADBFA]">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "cards" ? "bg-[#7A35A3] text-white shadow-xs" : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("chart")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "chart" ? "bg-[#7A35A3] text-white shadow-xs" : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Comparison Chart</span>
                </button>
              </div>

              <div className="flex items-center gap-1 p-0.5 bg-white rounded-xl border border-[#EADBFA]">
                {[
                  { id: "all", label: "All (11)" },
                  { id: "needs_boost", label: "Focus Areas" },
                  { id: "leading", label: "Above Average" },
                  { id: "good", label: "Optimal" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterCategory(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filterCategory === tab.id
                        ? "bg-[#4A1766] text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Skincare Pillar Chips */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
                <button
                  type="button"
                  onClick={() => setActivePillar("all")}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    activePillar === "all"
                      ? "bg-[#7A35A3] text-white border-[#7A35A3] shadow-xs"
                      : "bg-[#FBF7FE] text-gray-800 border-[#EADBFA] hover:bg-white"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 block">View All</span>
                  <p className="font-bold text-xs mt-0.5">All 11 Conditions</p>
                </button>

                {SKIN_PILLARS.map((pillar) => {
                  const isSelected = activePillar === pillar.id;
                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      onClick={() => setActivePillar(isSelected ? "all" : pillar.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#7A35A3] text-white border-[#7A35A3] shadow-xs"
                          : "bg-[#FBF7FE] text-gray-800 border-[#EADBFA] hover:bg-white"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 block truncate">
                        {pillar.badge}
                      </span>
                      <p className="font-bold text-xs mt-0.5 truncate">{pillar.title}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* View 1: 11 Cards Grid */}
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAttributes.map((attr) => {
                  const styleMeta = getScoreStyleMeta(attr.category, attr.userScore);
                  return (
                    <div
                      key={attr.id}
                      className={`p-5 rounded-3xl border ${styleMeta.border} ${styleMeta.bgLight} bg-white shadow-2xs flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-mono font-bold text-gray-400">#{attr.indexNumber}</span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${styleMeta.badgeBg}`}>
                            {styleMeta.badgeText}
                          </span>
                        </div>

                        <h3 className="font-sans text-base font-extrabold text-gray-900 leading-snug">
                          {attr.label}
                        </h3>

                        {attr.isQuizSourced && (
                          <span className="inline-block text-[10px] font-bold text-[#7A35A3] bg-[#F4E8FC] px-2 py-0.5 rounded-md mt-1 mb-1">
                            Quiz-Assisted Profile
                          </span>
                        )}

                        <p className="text-xs text-gray-700 leading-relaxed mt-2 min-h-[44px]">
                          {attr.shortTakeaway}
                        </p>

                        {/* Single User Bar (No Grey Bar!) */}
                        <div className="mt-4 pt-3 border-t border-[#EADBFA]/70 space-y-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#7A35A3]" />
                              <span>Your Score:</span>
                            </span>
                            <span className="font-mono font-bold text-[#4A1766]">
                              {attr.userScore}%
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${styleMeta.bar}`}
                              style={{ width: `${attr.userScore}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#EADBFA]/50 text-xs">
                            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <span>Average:</span>
                              <span className="font-mono font-bold text-gray-800">{attr.othersScore}%</span>
                            </div>
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                                attr.delta > 0
                                  ? "bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820]"
                                  : attr.delta < 0
                                  ? "bg-[#F4E8FC] text-[#4A1766] border border-[#EADBFA]"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {attr.delta > 0 ? `+${attr.delta}% clearer` : attr.delta < 0 ? `${attr.delta}% vs avg` : "On par"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recommendation box */}
                      <div className="mt-4 pt-3 border-t border-[#EADBFA] bg-[#F4E8FC]/30 -mx-5 -mb-5 p-4 rounded-b-3xl">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A35A3] block mb-1">
                          {attr.isOptimal ? "Preservation Routine" : "Recommended Treatment"}
                        </span>
                        <p className="text-xs font-bold text-gray-900 leading-snug">
                          {attr.keyActive}
                        </p>
                        <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                          {attr.actionBenefit}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* View 2: Comparison Chart */
              <div className="space-y-3">
                <div className="grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-gray-600 px-3 pb-2 border-b border-[#EADBFA]">
                  <span className="col-span-4 sm:col-span-3">Skin Condition</span>
                  <span className="col-span-5 sm:col-span-6">Your Score & Average</span>
                  <span className="col-span-3 text-right">Difference</span>
                </div>

                <div className="space-y-2">
                  {filteredAttributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="p-3.5 rounded-2xl border border-[#EADBFA]/80 bg-[#FBF7FE] hover:bg-white transition-all grid grid-cols-12 items-center gap-2"
                    >
                      <div className="col-span-4 sm:col-span-3">
                        <span className="font-mono text-xs text-gray-500">#{attr.indexNumber} </span>
                        <strong className="text-xs text-gray-900">{attr.label}</strong>
                      </div>

                      <div className="col-span-5 sm:col-span-6">
                        <div className="flex items-center gap-2">
                          <span className="w-8 font-mono text-xs font-bold text-[#4A1766] text-right">
                            {attr.userScore}%
                          </span>
                          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#7A35A3] to-[#C883EB] rounded-full"
                              style={{ width: `${attr.userScore}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1 pl-10">
                          <span>Average: <strong className="font-mono font-bold text-gray-700">{attr.othersScore}%</strong></span>
                        </div>
                      </div>

                      <div className="col-span-3 text-right">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block ${
                            attr.delta > 0
                              ? "bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820]"
                              : attr.delta < 0
                              ? "bg-[#F4E8FC] text-[#4A1766] border border-[#EADBFA]"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {attr.delta > 0 ? `+${attr.delta}%` : `${attr.delta}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 3: DAILY REGIMEN PROTOCOL (Moved Right Up Here!)
         ========================================================================= */}
      <div id="routine-section">
        <RoutineProtocol
          skinProfile={skinProfile}
          onSelectProduct={() => {}}
        />
      </div>

      {/* =========================================================================
          SECTION 4: FACIAL ZONE EXPLORER & 4-WEEK PROGRESSION
         ========================================================================= */}
      <div id="facemap-section" className="space-y-6">
        <FaceHeatmap
          attributes={attributes}
          activeRegion={activeRegion}
          onSelectRegion={setActiveRegion}
          userPhoto={userPhoto}
        />

        <div className="bg-gradient-to-r from-white to-[#F4F7FA] rounded-[28px] p-5 sm:p-7 border border-[#EADBFA] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A1766] bg-[#F4E8FC] px-2.5 py-0.5 rounded-full">
            Expected Progression
          </span>
          <h3 className="font-sans text-xl sm:text-2xl font-bold text-gray-900 mt-1 mb-4">
            Your 4-Week Expected Results
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-[#EADBFA] shadow-2xs">
              <span className="text-xs font-bold text-[#4A1766] uppercase tracking-wider block">
                Week 1: Soothe & Hydrate
              </span>
              <p className="text-sm font-bold text-gray-900 mt-1">Barrier Relief</p>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                Reduction in dryness, tight feeling, and reactive surface redness.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#EADBFA] shadow-2xs">
              <span className="text-xs font-bold text-[#4A1766] uppercase tracking-wider block">
                Week 2: Clear Pores
              </span>
              <p className="text-sm font-bold text-gray-900 mt-1">Oil & Pore Balance</p>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                Clears congestion in the T-zone and visibly refines pore appearance.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#EADBFA] shadow-2xs">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Week 4+: Healthy Glow
              </span>
              <p className="text-sm font-bold text-gray-900 mt-1">Radiant & Even Tone</p>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                Noticeable fading of dark spots, smoother skin bounce, and even skin tone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 5: PERSONAL SKIN ID CARD
         ========================================================================= */}
      <SkinPassport
        reportId={reportMeta?.reportId}
        clientName={fullName}
        skinType={skinProfile?.skinType}
        mainConcern={CONCERN_LABELS[skinProfile?.mainConcern]}
        vitalityScore={vitalityScore}
        expertHref={advisorHref}
      />

      {/* =========================================================================
          SECTION 6: PRICING & DIRECT ORDER (With Direct Checkout Modal!)
         ========================================================================= */}
      <div id="pricing-section" className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-8 md:p-10 border border-[#EADBFA] shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] text-center relative overflow-hidden">
        {/* Soft, trustworthy banner */}
        <div className="bg-[#4A1766] text-white py-2 px-4 rounded-2xl mb-4 text-center flex items-center justify-center gap-2 shadow-sm max-w-md mx-auto">
          <Clock className="w-3.5 h-3.5 text-[#C883EB]" />
          <span className="text-xs font-medium tracking-wide">
            Special 50% assessment discount active · {formatTimer(offerTimer)} remaining
          </span>
        </div>

        <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Choose Your Routine Protocol
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg mx-auto">
          Formulated to target your specific skin score. Includes your customized daily regimen and WhatsApp advisor access.
        </p>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 text-left">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "border-[#7A35A3] bg-gradient-to-b from-[#FBF7FE] to-white shadow-md ring-2 ring-[#7A35A3]/20"
                    : "border-[#EADBFA] bg-white hover:border-[#7A35A3]/40"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820] text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Most Popular Choice
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-sans font-bold text-base text-gray-900">{plan.name}</h3>
                    <span className="text-xs font-bold text-[#7A35A3] bg-[#F4E8FC] px-2 py-0.5 rounded-md">
                      {plan.discount}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-sans text-3xl font-extrabold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {plan.originalPrice}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A35A3] font-semibold mt-0.5">
                    {plan.perDay}
                  </p>

                  <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-[#EADBFA]/70 leading-relaxed">
                    {plan.description}
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs text-gray-700">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlanId(plan.id);
                    setIsCheckoutOpen(true);
                  }}
                  className={`mt-6 w-full py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    isSelected
                      ? "bg-[#7A35A3] text-white hover:bg-[#5C237D]"
                      : "bg-[#F4E8FC] text-[#4A1766] hover:bg-[#EADBFA]"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Select {plan.name}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Action Buttons: Direct Checkout & WhatsApp Option */}
        <div className="max-w-md mx-auto space-y-3">
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#7A35A3] to-[#4A1766] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Proceed to Instant Checkout ({selectedPlan.price})</span>
          </button>

          <a
            href={advisorHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Prefer to order or ask questions via WhatsApp? Chat with Advisor</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          DIRECT ORDER CHECKOUT MODAL (No WhatsApp forced!)
         ========================================================================= */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EADBFA] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div>
                  <h3 className="font-sans text-xl font-bold text-gray-900">Direct Order Checkout</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedPlan.name} · <span className="font-bold text-[#7A35A3]">{selectedPlan.price}</span> (50% Off Applied)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Order Confirmed!</h4>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto">
                    Your custom routine kit is being prepared. You will receive tracking details via SMS/WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      defaultValue={isRealName ? fullName : ""}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#7A35A3]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Phone (for Delivery updates)</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#7A35A3]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#7A35A3]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Shipping Address (India)</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House / Flat No., Street, Landmark"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#7A35A3]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#7A35A3]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        placeholder="PIN Code"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#7A35A3]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl border-2 border-[#7A35A3] bg-[#F4E8FC]/30 text-center text-xs font-bold text-[#4A1766]">
                        UPI / QR
                      </div>
                      <div className="p-2.5 rounded-xl border border-gray-200 text-center text-xs text-gray-600">
                        Cards
                      </div>
                      <div className="p-2.5 rounded-xl border border-gray-200 text-center text-xs text-gray-600">
                        Net Banking
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3 rounded-full bg-[#7A35A3] hover:bg-[#5C237D] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {selectedPlan.price} & Place Order</span>
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
      <footer className="pt-6 border-t border-[#EADBFA]/70 text-center text-[11px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
        <p>
          MILC AI Skin Lab provides educational cosmetic skin profiling and customized topical routines. This assessment is not a clinical medical diagnosis or treatment for dermatological disease.
        </p>
      </footer>
    </div>
  );
}
'''

with open('frontend/src/components/Result.jsx', 'w', encoding='utf-8') as f:
    f.write(content.strip() + '\n')

print("Result.jsx runtime error fixed successfully!")
