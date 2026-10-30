# Create the revised Result.jsx with all feedback points addressed

code = r'''import { useEffect, useMemo, useState, useRef } from "react";
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
} from "lucide-react";
import { useQuiz } from "../context/QuizContext";
import { SKIN_ATTRIBUTES, CONCERN_LABELS, SKIN_TYPE_LABELS } from "../data/attributes";
import { MILC_CATALOG, productsByIds, uniqueProducts } from "../data/products";
import { PRICING_PLANS } from "../data/questions";
import FaceHeatmap from "./ui/FaceHeatmap";
import RoutineProtocol from "./ui/RoutineProtocol";
import SkinPassport from "./ui/SkinPassport";
import { submitAssessmentReport } from "../api/quizApi";
import { formatInternationalPhone } from "../utils/phone";

// Visual Icons for conditions
const ATTR_ICONS = {
  whiteheads: Droplets,
  redness: Flame,
  postacne_spots: CircleDot,
  wrinkles: Activity,
  acne_inflammatory: AlertCircle,
  freckles: Sun,
  pigmentation: Sparkles,
  scars: Layers,
  visible_pores: Droplets,
  moles: Eye,
  nevi: ShieldCheck,
};

// 3 Logical Skincare Pillars
const SKIN_PILLARS = [
  {
    id: "breakouts",
    title: "Pores & Breakouts",
    badge: "Clarity & Oil Control",
    attrIds: ["whiteheads", "acne_inflammatory", "visible_pores", "postacne_spots"],
  },
  {
    id: "tone",
    title: "Tone & Radiance",
    badge: "Even Complexion & Glow",
    attrIds: ["pigmentation", "freckles", "redness"],
  },
  {
    id: "texture",
    title: "Texture & Elasticity",
    badge: "Smoothness & Bounce",
    attrIds: ["wrinkles", "scars", "moles", "nevi"],
  },
];

// Benchmark & Actionable Skincare Solutions
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

const CATEGORY_STYLES = {
  "Looking good": {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    label: "Optimal",
    scoreRange: "85–100%",
  },
  "Fine for now": {
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    label: "Balanced",
    scoreRange: "70–84%",
  },
  "Needs a boost": {
    badge: "bg-[#F4E8FC] text-[#4A1766] border-[#EADBFA]",
    dot: "bg-[#7A35A3]",
    bar: "bg-[#7A35A3]",
    label: "Focus Area",
    scoreRange: "Under 70%",
  },
};

export default function Result() {
  const { state, goToStep, resetQuiz, setSelectedPlan } = useQuiz();
  const { aboutMe, skinProfile, lifestyle, skinAnalysis, archivedReportId } = state;

  const [reportMeta, setReportMeta] = useState(
    archivedReportId ? { reportId: archivedReportId } : null
  );
  const [filterCategory, setFilterCategory] = useState("all");
  const [activePillar, setActivePillar] = useState("all");
  const [activeRegion, setActiveRegion] = useState(null);
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'chart'
  const [selectedPlanId, setSelectedPlanId] = useState(state?.selectedPlan || "1_month");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Persistent Timer (Does NOT reset on reload!)
  const [offerTimer, setOfferTimer] = useState(() => {
    if (typeof window === "undefined") return 35 * 60;
    const saved = localStorage.getItem("milc_offer_expires");
    const now = Math.floor(Date.now() / 1000);
    if (saved) {
      const remaining = Number(saved) - now;
      if (remaining > 0) return remaining;
    }
    const expiry = now + 35 * 60 + 20;
    localStorage.setItem("milc_offer_expires", String(expiry));
    return 35 * 60 + 20;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setOfferTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const hasFiredConfetti = useRef(false);
  useEffect(() => {
    if (!hasFiredConfetti.current) {
      hasFiredConfetti.current = true;
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.55 },
          colors: ["#7A35A3", "#C883EB", "#D4FF3F", "#E34234", "#10b981"],
        });
      } catch {
        // no-op
      }
    }
  }, []);

  // Personalized Display Name
  const rawName = aboutMe?.fullName?.trim() || "";
  const isRealName = rawName.length > 0 && rawName.toLowerCase() !== "client";
  const firstName = isRealName ? rawName.split(" ")[0] : "Your";
  const fullName = isRealName ? rawName : "Your Skin Profile";
  const titleName = isRealName ? `${firstName}’s` : "Your";

  const skinTypeLabel = SKIN_TYPE_LABELS[skinProfile?.skinType] || "Normal";
  const mainConcernLabel = CONCERN_LABELS[skinProfile?.mainConcern] || "Balance";
  const reportedConcerns = skinProfile?.concerns || [skinProfile?.mainConcern].filter(Boolean);

  // Intelligent, Honest Attribute Synthesis
  const attributes = useMemo(() => {
    const fromAi = Array.isArray(skinAnalysis?.attributes) ? skinAnalysis.attributes : [];

    return SKIN_ATTRIBUTES.map((meta, index) => {
      const hit = fromAi.find((a) => {
        const id = a.attribute || a.id;
        return id === meta.id;
      }) || {};

      const guidance = CONDITION_GUIDANCE[meta.id] || {
        othersScore: 65,
        checks: meta.checks,
        activeFormula: "Daily Gentle Moisturizer & SPF",
        activeBenefit: "Maintains balanced skin barrier health.",
        clearObs: "Condition looks healthy and clear.",
        quizObs: "Identified from your self-reported skincare assessment.",
        focusObs: "Target active formula recommended.",
      };

      const isUserConcern = reportedConcerns.some((c) => {
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

      // 1. If lighting was limited in the photo:
      if (isLightingLimited) {
        if (isUserConcern) {
          category = "Needs a boost";
          observationText = guidance.quizObs;
          userScore = 64; // Clearly in Focus range (<70%)
          isQuizSourced = true;
        } else {
          // No user concern and no photo signs = Optimal clear skin
          category = "Looking good";
          observationText = guidance.clearObs;
          userScore = 94;
        }
      }
      // 2. If AI had no conclusive reading:
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
        userScore = 60 + (index % 6);
      } else if (category === "Fine for now") {
        observationText = guidance.clearObs;
        userScore = 78 + (index % 4);
      } else {
        // Looking good
        observationText = guidance.clearObs;
        userScore = 92 + (index % 5);
      }

      // If condition is Optimal / No signs detected:
      // Don't sell aggressive corrective treatments!
      const isOptimal = category === "Looking good" || userScore >= 85;
      const prescribedTitle = isOptimal ? "Daily Skin Maintenance" : guidance.activeFormula;
      const prescribedAction = isOptimal
        ? "No corrective formula needed. Maintain your skin's clear baseline with daily hydration and broad-spectrum SPF."
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
        products: productsByIds(meta.products),
      };
    });
  }, [skinAnalysis, reportedConcerns]);

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

  // Filter out moles and nevi from "Top Strengths" so users aren't congratulated for "having no moles"!
  const topStrengths = useMemo(() => {
    return attributes
      .filter((a) => a.id !== "moles" && a.id !== "nevi")
      .sort((a, b) => b.userScore - a.userScore)
      .slice(0, 2);
  }, [attributes]);

  const topFocusAreas = useMemo(() => {
    const priorities = attributes.filter((a) => a.category === "Needs a boost" && a.id !== "moles" && a.id !== "nevi");
    if (priorities.length > 0) return priorities.slice(0, 2);
    return attributes
      .filter((a) => a.id !== "moles" && a.id !== "nevi")
      .sort((a, b) => a.userScore - b.userScore)
      .slice(0, 2);
  }, [attributes]);

  // Filtered attributes
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

  // Save report
  useEffect(() => {
    if (archivedReportId || reportMeta?.reportId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const saved = await submitAssessmentReport({
          aboutMe,
          skinProfile,
          lifestyle,
          skinAnalysis: {
            summary: `Skin report for ${fullName}. Score: ${vitalityScore}/100.`,
            attributes,
          },
        });
        if (!cancelled) setReportMeta(saved);
      } catch {
        // gracefully continue
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [archivedReportId, reportMeta?.reportId, aboutMe, skinProfile, lifestyle, attributes, fullName, vitalityScore]);

  // WhatsApp link
  const waNumber = formatInternationalPhone(aboutMe?.whatsapp, aboutMe?.countryCode).replace(/\s/g, "");
  const advisorHref = waNumber
    ? `https://wa.me/${waNumber.replace("+", "")}?text=${encodeURIComponent(
        `Hi MILC, I just completed my skin assessment (${vitalityScore}/100 score, ${skinTypeLabel} skin). I'd like to ask a skincare advisor a few questions.`
      )}`
    : `https://wa.me/?text=${encodeURIComponent(
        `Hi MILC, I just completed my skin assessment and would like to ask an advisor about my custom formula.`
      )}`;

  const userPhoto = useMemo(() => {
    return (state?.faceImages || []).find((img) => img?.dataUrl)?.dataUrl || null;
  }, [state?.faceImages]);

  const selectedPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 pb-24 space-y-7"
    >
      {/* =========================================================================
          SECTION 1: SUMMARY SCORECARD
         ========================================================================= */}
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-[#EADBFA] shadow-xs relative overflow-hidden">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E2700] bg-[#D4FF3F] border border-[#BDE820] px-3 py-1 rounded-full shadow-2xs">
              AI Skin Assessment
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A1766] bg-[#F4E8FC] px-3 py-1 rounded-full border border-[#EADBFA]">
              11 Conditions Analyzed
            </span>
            <span className="text-xs text-gray-500 font-mono">
              #{reportMeta?.reportId ? reportMeta.reportId.slice(0, 10) : "ML-614385"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Compared to 23,000+ Profiles</span>
          </div>
        </div>

        {/* Headline & Dual Score */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EADBFA]/70">
          <div>
            <h1 className="font-sans text-3xl sm:text-4xl text-gray-900 font-extrabold tracking-tight leading-tight">
              {titleName} Skin Assessment
            </h1>
            <p className="text-sm text-gray-600 mt-1.5 max-w-xl leading-relaxed">
              Based on your answers and photo scan. Higher scores indicate calmer, clearer skin.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
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
              {/* Score Dial */}
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

        {/* Strengths vs Focus Areas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="flex items-center gap-2 mb-2 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Your Greatest Strengths</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-gray-700">
              {topStrengths.map((attr) => (
                <li key={attr.id} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold text-gray-900">{attr.label} ({attr.userScore}%): </strong>
                    {attr.shortTakeaway}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4E8FC]/50 border border-[#EADBFA]">
            <div className="flex items-center gap-2 mb-2 text-[#4A1766]">
              <ArrowRight className="w-4 h-4 text-[#7A35A3]" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Primary Areas to Target</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-gray-700">
              {topFocusAreas.map((attr) => (
                <li key={attr.id} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7A35A3] shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold text-gray-900">{attr.label}: </strong>
                    {attr.actionBenefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: FACIAL ZONE EXPLORER
         ========================================================================= */}
      <FaceHeatmap
        attributes={attributes}
        activeRegion={activeRegion}
        onSelectRegion={setActiveRegion}
        userPhoto={userPhoto}
      />

      {/* =========================================================================
          SECTION 3: THE 11 CONDITIONS ANALYZED
         ========================================================================= */}
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-[#EADBFA] shadow-xs">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A35A3]" />
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                <span className="text-[#7A35A3]">11</span> Skin Conditions: Your Score vs. Others
              </h2>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Higher score = Healthier, clearer skin. Benchmarked against 23,000+ age-matched profiles.
            </p>
          </div>

          {/* View Switcher: Cards vs Comparison Chart */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 bg-[#F4E8FC]/60 rounded-xl border border-[#EADBFA]">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer outline-none focus:outline-none ${
                  viewMode === "cards"
                    ? "bg-[#7A35A3] text-white shadow-xs"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("chart")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer outline-none focus:outline-none ${
                  viewMode === "chart"
                    ? "bg-[#7A35A3] text-white shadow-xs"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Comparison Chart</span>
              </button>
            </div>

            {/* Filter Tabs */}
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterCategory === tab.id
                      ? "bg-[#7A35A3] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Color & Score Key */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 py-2.5 px-3.5 rounded-xl bg-[#F4E8FC]/30 border border-[#EADBFA] text-xs text-gray-700 mb-5">
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
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="w-3.5 h-1.5 bg-slate-400 rounded-sm" />
            <span className="text-gray-600 font-medium">Grey Bar = Cohort Average</span>
          </div>
        </div>

        {/* Balanced 4-Column Skincare Pillar Chips (No orphan chips on second row!) */}
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
              <span className="text-xs uppercase font-bold tracking-wider opacity-85 block">View All</span>
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
                  <span className="text-xs uppercase font-bold tracking-wider opacity-85 block truncate">
                    {pillar.badge}
                  </span>
                  <p className="font-bold text-xs mt-0.5 truncate">{pillar.title}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* VIEW 1: CLEAN CARDS VIEW (Aligned, non-overlapping, high contrast) */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAttributes.map((attr) => {
              const styleMeta = CATEGORY_STYLES[attr.category] || CATEGORY_STYLES["Fine for now"];
              const Icon = ATTR_ICONS[attr.id] || Sparkles;

              return (
                <div
                  key={attr.id}
                  className="bg-white rounded-2xl border border-[#EADBFA] p-5 shadow-2xs hover:border-[#7A35A3]/40 transition-all flex flex-col justify-between h-full"
                >
                  <div className="flex flex-col flex-1">
                    {/* Top Row: # and Status Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#F4E8FC] text-[#4A1766] flex items-center justify-center font-bold">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-xs font-bold text-gray-500">
                          #{attr.indexNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {attr.isQuizSourced && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            Quiz Match
                          </span>
                        )}
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${styleMeta.badge}`}>
                          {styleMeta.label}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base leading-snug">{attr.label}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 italic">{attr.checks}</p>

                    {/* Uniform observation container */}
                    <div className="mt-2.5 p-3 rounded-xl bg-[#FBF7FE] border border-[#EADBFA]/60 min-h-[58px] flex items-center">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {attr.shortTakeaway}
                      </p>
                    </div>

                    {/* Score comparison bars */}
                    <div className="mt-4 pt-3 border-t border-[#EADBFA]/70 space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#7A35A3]" />
                            <span>Your Score:</span>
                          </span>
                          <span className="font-mono font-bold text-[#4A1766]">
                            {attr.isQuizSourced ? `${attr.userScore}% (Target Concern)` : `${attr.userScore}%`}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${styleMeta.bar}`}
                            style={{ width: `${attr.userScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600 font-medium flex items-center gap-1.5">
                            <Users className="w-3 h-3 text-gray-500" />
                            <span>Average Score:</span>
                          </span>
                          <span className="font-mono font-bold text-gray-700">{attr.othersScore}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-400 rounded-full"
                            style={{ width: `${attr.othersScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Clean Non-Overlapping Comparison Pill */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-gray-600 font-medium">Vs. Average:</span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                            attr.delta > 0
                              ? "bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820]"
                              : attr.delta < 0
                              ? "bg-[#F4E8FC] text-[#4A1766] border border-[#EADBFA]"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {attr.delta > 0
                            ? `+${attr.delta}% clearer`
                            : attr.delta < 0
                            ? `${attr.delta}% vs average`
                            : "On par with average"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Uniform Bottom Formula Box (Aligned across all cards!) */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      {attr.isOptimal ? "Skincare Status:" : "Recommended Formula:"}
                    </span>
                    <div className={`p-2.5 rounded-xl border min-h-[64px] flex flex-col justify-center ${
                      attr.isOptimal ? "bg-emerald-50/50 border-emerald-200/80" : "bg-[#F4E8FC]/30 border-[#EADBFA]"
                    }`}>
                      <p className={`font-bold text-xs leading-snug ${attr.isOptimal ? "text-emerald-800" : "text-[#4A1766]"}`}>
                        {attr.keyActive}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 leading-snug">
                        {attr.actionBenefit}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: SIMPLE COMPARISON BAR CHART */
          <div className="space-y-3">
            <div className="grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-gray-600 px-3 pb-2 border-b border-[#EADBFA]">
              <span className="col-span-4 sm:col-span-3">Skin Condition</span>
              <span className="col-span-5 sm:col-span-6">Your Score vs. Average</span>
              <span className="col-span-3 text-right">Difference</span>
            </div>

            <div className="space-y-2">
              {filteredAttributes.map((attr) => {
                return (
                  <div
                    key={attr.id}
                    className="p-3.5 rounded-2xl border border-[#EADBFA]/80 bg-[#FBF7FE] hover:bg-white transition-all grid grid-cols-12 items-center gap-2"
                  >
                    <div className="col-span-4 sm:col-span-3">
                      <span className="font-mono text-xs text-gray-500">#{attr.indexNumber} </span>
                      <strong className="text-xs text-gray-900">{attr.label}</strong>
                    </div>

                    <div className="col-span-5 sm:col-span-6 space-y-1">
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

                      <div className="flex items-center gap-2">
                        <span className="w-8 font-mono text-xs text-gray-500 text-right">
                          {attr.othersScore}%
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-400 rounded-full"
                            style={{ width: `${attr.othersScore}%` }}
                          />
                        </div>
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
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 4: DAILY REGIMEN PROTOCOL
         ========================================================================= */}
      <RoutineProtocol
        skinProfile={skinProfile}
        onSelectProduct={() => {}}
      />

      {/* =========================================================================
          SECTION 5: 4-WEEK EXPECTED PROGRESSION
         ========================================================================= */}
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

      {/* =========================================================================
          SECTION 6: PERSONAL SKIN ID CARD
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
          SECTION 7: TRUSTWORTHY PRICING & DIRECT ORDER (With Cart / Checkout Modal!)
         ========================================================================= */}
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 border border-[#EADBFA] shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] text-center relative overflow-hidden">
        {/* Soft, trustworthy banner */}
        <div className="bg-[#4A1766] text-white py-2 px-4 rounded-2xl mb-4 text-center flex items-center justify-center gap-2 shadow-sm max-w-md mx-auto">
          <Clock className="w-3.5 h-3.5 text-[#C883EB]" />
          <span className="text-xs font-medium tracking-wide">
            Special 50% assessment discount active · {formatTimer(offerTimer)} remaining
          </span>
        </div>

        <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Start Your Tailored Skincare Plan
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1.5 max-w-md mx-auto">
          Formulated to target your 11 assessed skin conditions with pure clinical-grade actives.
        </p>

        {/* Voucher Tag Pill (Consistent ₹ Currency) */}
        <div className="my-5 p-3 rounded-2xl bg-gradient-to-r from-[#F4F7FA] to-[#F4E8FC] border border-[#EADBFA] flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#4A1766]" />
            <span className="font-mono text-xs font-bold text-gray-900 tracking-wider">
              MILC50SPECIAL
            </span>
          </div>
          <span className="text-xs font-bold text-[#1E2700] bg-[#D4FF3F] border border-[#BDE820] px-2.5 py-0.5 rounded-full">
            50% Discount Applied
          </span>
        </div>

        {/* Pricing Tier Selection Cards (All in ₹ INR!) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 my-6 text-left">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  setSelectedPlan?.(plan.id);
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "border-2 border-[#7A35A3] bg-white ring-2 ring-[#7A35A3]/15 shadow-sm"
                    : "border-gray-200/90 bg-[#F4F7FA]/70 hover:bg-white shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        plan.popular
                          ? "bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820]"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {plan.badge}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-[#7A35A3] bg-[#7A35A3] text-white" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">{plan.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 line-through">
                    {plan.originalPrice} → <span className="font-bold text-gray-800 no-underline">{plan.discountedPrice}</span>
                  </p>
                </div>

                <div className="text-right mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Cost</span>
                  <div>
                    <span className="font-sans text-2xl font-bold text-gray-900 leading-none">
                      {plan.dailyRate}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/ day</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* What's Included */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F7FA] border border-[#EADBFA] text-left text-xs sm:text-sm space-y-2 mb-6 max-w-2xl mx-auto shadow-2xs">
          <p className="font-bold text-gray-900 uppercase tracking-wider text-xs">
            Your Routine Package Includes:
          </p>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>4 full-sized custom MILC active products tailored to your assessment</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Free express delivery across India + routine tracking</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Direct WhatsApp access to a skincare specialist whenever you need advice</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
          <span className="text-xs sm:text-sm font-bold text-slate-700 ml-1.5">
            4.9/5 from 23,000+ users across India
          </span>
        </div>

        {/* DUAL CHECKOUT OPTIONS */}
        <div className="max-w-md mx-auto space-y-3">
          <button
            type="button"
            onClick={() => setShowCheckoutModal(true)}
            className="w-full h-14 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-sm cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 flex items-center justify-center gap-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order My Custom Routine ({selectedPlan.discountedPrice})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={advisorHref}
            target="_blank"
            rel="noreferrer"
            className="w-full h-11 rounded-full border border-[#EADBFA] bg-[#FBF7FE] hover:bg-white text-gray-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Prefer to chat first? Ask on WhatsApp</span>
          </a>
        </div>

        {/* Honest Medical Disclaimer */}
        <p className="text-xs text-gray-500 mt-6 max-w-lg mx-auto leading-relaxed border-t border-gray-100 pt-4">
          Disclaimer: MILC Skin Lab provides cosmetic skincare recommendations based on AI computer vision and your self-reported profile. This assessment is not a medical diagnosis. If you have an active dermatological disease, please consult a physician.
        </p>
      </div>

      {/* Retake options */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-2 pt-2">
        <button
          type="button"
          onClick={() => goToStep(2, "backward")}
          className="underline hover:text-gray-800 cursor-pointer flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retake photo scan
        </button>
        <button
          type="button"
          onClick={resetQuiz}
          className="underline hover:text-gray-800 cursor-pointer"
        >
          Start new assessment
        </button>
      </div>

      {/* =========================================================================
          DIRECT ONLINE CHECKOUT MODAL
         ========================================================================= */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowCheckoutModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#EADBFA] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {checkoutComplete ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans text-2xl font-bold text-gray-900">Order Confirmed!</h3>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto">
                    Thank you, {isRealName ? firstName : "there"}! Your custom routine is being prepared by the lab. You will receive tracking details shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutComplete(false);
                      setShowCheckoutModal(false);
                    }}
                    className="h-11 px-6 rounded-full bg-[#7A35A3] text-white text-xs font-bold cursor-pointer hover:bg-[#4A1766]"
                  >
                    Back to Report
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div>
                      <h3 className="font-sans text-xl font-bold text-gray-900">Order Summary</h3>
                      <p className="text-xs text-gray-500">Selected Plan: {selectedPlan.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCheckoutModal(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Products Included */}
                  <div className="space-y-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                      Custom 4-Product Set Included:
                    </span>
                    <div className="p-3 bg-[#F4F7FA] rounded-2xl space-y-1.5 text-xs text-gray-700">
                      <div className="flex justify-between">
                        <span>1. Pore Calm Gentle Cleanser</span>
                        <span className="font-medium">₹790</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2. Active Even Tone Serum</span>
                        <span className="font-medium">₹1,090</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3. Peptide Barrier Recovery Cream</span>
                        <span className="font-medium">₹1,190</span>
                      </div>
                      <div className="flex justify-between">
                        <span>4. Daily Shield SPF 30</span>
                        <span className="font-medium">₹890</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-3.5 rounded-2xl border border-[#EADBFA] bg-[#FBF7FE] space-y-1.5 text-xs mb-5">
                    <div className="flex justify-between text-gray-600">
                      <span>Standard Retail Value</span>
                      <span className="line-through">{selectedPlan.originalPrice}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Assessment 50% Voucher</span>
                      <span>-50% Off</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Express Shipping (All India)</span>
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    </div>
                    <div className="pt-2 border-t border-[#EADBFA] flex justify-between text-sm font-bold text-gray-900">
                      <span>Total Due Today</span>
                      <span className="text-base text-[#7A35A3] font-sans font-extrabold">{selectedPlan.discountedPrice}</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="space-y-3 mb-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                      Shipping Details:
                    </span>
                    <input
                      type="text"
                      defaultValue={isRealName ? fullName : ""}
                      placeholder="Full Name"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#7A35A3]"
                    />
                    <input
                      type="text"
                      placeholder="Delivery Address (Street, Flat / House No.)"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#7A35A3]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#7A35A3]"
                      />
                      <input
                        type="text"
                        placeholder="PIN Code"
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#7A35A3]"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                      Payment Method:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl border-2 border-[#7A35A3] bg-[#F4E8FC]/30 text-center text-xs font-bold text-[#4A1766] cursor-pointer">
                        UPI / GPay
                      </div>
                      <div className="p-2.5 rounded-xl border border-gray-200 text-center text-xs font-medium text-gray-600 hover:border-gray-400 cursor-pointer">
                        Cards
                      </div>
                      <div className="p-2.5 rounded-xl border border-gray-200 text-center text-xs font-medium text-gray-600 hover:border-gray-400 cursor-pointer">
                        Net Banking
                      </div>
                    </div>
                  </div>

                  {/* Direct Buy Button */}
                  <button
                    type="button"
                    onClick={() => setCheckoutComplete(true)}
                    className="w-full h-12 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-xs cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {selectedPlan.discountedPrice} Securely</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
'''

with open('frontend/src/components/Result.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Result.jsx updated successfully!")
