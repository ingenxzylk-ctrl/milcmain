import { SKIN_ATTRIBUTES } from "../data/attributes.js";
import { productsByIds, MILC_CATALOG } from "../data/products.js";

export const REQUIRED_CONDITION_IDS = [
  "whiteheads",
  "redness",
  "postacne_spots",
  "wrinkles",
  "acne_inflammatory",
  "freckles",
  "pigmentation",
  "scars",
  "visible_pores",
  "moles",
  "nevi",
];

// Specific honest recommendation map per condition (never repeated!)
export const CONDITION_RECOMMENDATIONS = {
  whiteheads: {
    checks: "Closed comedones, trapped sebum & keratin",
    othersScore: 62,
    optimalActive: "Daily Salicylic Acid 0.5% Gentle Wash",
    optimalAction: "Keeps follicular pathways clear and prevents micro-comedones from forming.",
    focusActive: "Salicylic Acid 2% + Zinc PCA",
    focusAction: "Gently dissolves trapped sebum inside pores and clears active congestion.",
    clearObs: "Pores look clean and clear with minimal closed comedonal congestion.",
    focusObs: "Micro-congestion and trapped sebum detected along follicular openings.",
  },
  redness: {
    checks: "Facial flushing, sensitivity & reactive capillaries",
    othersScore: 66,
    optimalActive: "Centella Asiatica + Oat Barrier Fluid",
    optimalAction: "Preserves calm vascular tone and protects reactive cheek capillaries.",
    focusActive: "Centella Asiatica + Azelaic Acid 10%",
    focusAction: "Soothes skin reactivity, calms visible erythema, and reinforces fragile capillaries.",
    clearObs: "Capillary tone looks calm with minimal visible surface redness.",
    focusObs: "Visible surface redness and vascular flushing detected across central face.",
  },
  postacne_spots: {
    checks: "Post-inflammatory hyperpigmentation (PIH/PIE)",
    othersScore: 58,
    optimalActive: "Niacinamide 5% + Daily SPF Shield",
    optimalAction: "Prevents residual UV darkening and supports steady epidermal cellular turnover.",
    focusActive: "Tranexamic Acid 3% + Alpha Arbutin",
    focusAction: "Accelerates fading of localized dark marks and evens out post-blemish discoloration.",
    clearObs: "Even tone with healthy turnover and no significant post-blemish marks.",
    focusObs: "Post-inflammatory macules and pigmentation traces remain from previous breakout cycles.",
  },
  wrinkles: {
    checks: "Fine expression lines, forehead & periorbital creasing",
    othersScore: 71,
    optimalActive: "Hyaluronic Acid + Copper Tripeptides",
    optimalAction: "Maintains optimal dermal bounce and structural skin hydration.",
    focusActive: "Multi-Peptide Matrix + Gentle Retinoid Complex",
    focusAction: "Plumps dynamic expression lines and stimulates structural collagen renewal.",
    clearObs: "Skin matrix demonstrates strong elasticity with minimal visible furrowing.",
    focusObs: "Fine dehydration or dynamic expression lines visible around movement areas.",
  },
  acne_inflammatory: {
    checks: "Active inflammatory papules, pustules & swelling",
    othersScore: 63,
    optimalActive: "Gentle Tea Tree + Zinc Clarity Gel",
    optimalAction: "Maintains balanced surface microflora to prevent future blemish flareups.",
    focusActive: "Salicylic Acid 2% + Clarifying BHA",
    focusAction: "Calms active inflammation inside pores and accelerates blemish recovery.",
    clearObs: "Clear skin surface with zero active inflamed breakout lesions visible.",
    focusObs: "Active inflammatory papules or tender spots noted across follicular zones.",
  },
  freckles: {
    checks: "Ephelides, localized UV-induced melanin clusters",
    othersScore: 77,
    optimalActive: "Broad-Spectrum Antioxidant Mineral SPF 50+",
    optimalAction: "Shields delicate melanocytes from UV-induced ephelides darkening.",
    focusActive: "High-Protection Sunscreen + Ferulic Acid",
    focusAction: "Prevents sun freckles from deepening across the nose bridge and cheeks.",
    clearObs: "Balanced, clear complexion without prominent sun freckles or ephelides.",
    focusObs: "Dispersed ephelides (light freckling) noted across high sun-exposure zones.",
  },
  pigmentation: {
    checks: "Sun spots, melasma patches & uneven tone",
    othersScore: 61,
    optimalActive: "Antioxidant Vitamin C 10% Daily Shield",
    optimalAction: "Protects natural tonal uniformity against environmental photo-stress.",
    focusActive: "Vitamin C 15% + Alpha Arbutin",
    focusAction: "Inhibits localized melanin overproduction and restores radiant skin glow.",
    clearObs: "Luminous, radiant complexion with even natural tone distribution.",
    focusObs: "Patchy sun spots or localized uneven pigment distribution observed.",
  },
  scars: {
    checks: "Atrophic or textural indentations from past breakouts",
    othersScore: 68,
    optimalActive: "Ceramide NP Complex + Skin Repair Lipids",
    optimalAction: "Reinforces smooth surface texture and epidermal elasticity.",
    focusActive: "Barrier Lipids + Resurfacing Peptide Formula",
    focusAction: "Softens textural indentations and promotes gentle epidermal renewal.",
    clearObs: "Smooth skin surface with no significant textural indentations or marks.",
    focusObs: "Textural marks or slight atrophic indentations observed from past breakouts.",
  },
  visible_pores: {
    checks: "Enlarged pore diameter & follicular congestion",
    othersScore: 59,
    optimalActive: "Niacinamide 5% + Gentle Pore Refiner",
    optimalAction: "Maintains tight, clean pore elasticity and healthy sebum flow.",
    focusActive: "Niacinamide 10% + Zinc PCA Pore Clarifier",
    focusAction: "Visibly tightens enlarged pores and regulates active sebaceous flow.",
    clearObs: "Tight, refined pores with a smooth finish across the central face.",
    focusObs: "Enlarged pore diameter with active sebaceous flow across T-zone and cheeks.",
  },
  moles: {
    checks: "Common benign beauty marks and dark spots",
    othersScore: 85,
    optimalActive: "Daily Broad-Spectrum Cellular UV Shield",
    optimalAction: "Protects pigment cell DNA against environmental photo-damage.",
    focusActive: "Daily Broad-Spectrum Sunscreen SPF 50+",
    focusAction: "Protects cutaneous skin marks from harmful ultraviolet rays.",
    clearObs: "Benign beauty marks appear healthy and normal. Maintain daily SPF defense.",
    focusObs: "Natural skin marks observed. Always protect skin daily with broad-spectrum SPF.",
  },
  nevi: {
    checks: "Natural pigment marks, beauty marks & skin landmarks",
    othersScore: 83,
    optimalActive: "Broad-Spectrum Daily Physical SPF Defense",
    optimalAction: "Preserves natural beauty marks and dermal skin barrier integrity.",
    focusActive: "Broad-Spectrum Daily Physical SPF Defense",
    focusAction: "Protects natural cutaneous marks from excessive ultraviolet exposure.",
    clearObs: "Natural skin landmarks appear healthy and normal with balanced baseline defense.",
    focusObs: "Natural cutaneous marks present. Maintain daily SPF sun defense.",
  },
};

/**
 * Validates the raw API response from /api/analyze.
 * Throws an Error if required fields or conditions are missing.
 */
export function validateAnalysisResponse(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid analysis response format.");
  }
  if (data.imageRejected) {
    const err = new Error(data.error || "The uploaded photo could not be analyzed.");
    err.imageRejected = true;
    err.rejectionReasons = data.rejectionReasons || [];
    err.qualityChecks = data.qualityChecks || null;
    throw err;
  }
  if (!Array.isArray(data.attributes)) {
    throw new Error("Analysis response missing attributes list.");
  }

  const byId = new Set(
    data.attributes.map((a) => String(a.attribute || a.id || "").trim().toLowerCase())
  );

  const missing = REQUIRED_CONDITION_IDS.filter((id) => !byId.has(id));
  if (missing.length > 0) {
    throw new Error(`Analysis response is incomplete. Missing conditions: ${missing.join(", ")}`);
  }
  return true;
}

/**
 * Single source of truth score band classifier.
 * Optimal: 85–100
 * Balanced: 70–84
 * Focus Area: < 70
 */
export function getScoreBand(score) {
  const num = Number(score) || 0;
  if (num >= 85) {
    return {
      band: "optimal",
      label: "Optimal",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
      barClass: "bg-gradient-to-r from-emerald-500 to-teal-400",
      dotClass: "bg-emerald-500",
    };
  }
  if (num >= 70) {
    return {
      band: "balanced",
      label: "Balanced",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      barClass: "bg-gradient-to-r from-amber-500 to-amber-400",
      dotClass: "bg-amber-500",
    };
  }
  return {
    band: "focus",
    label: "Focus Area",
    badgeClass: "bg-[#FAF9F6] text-[#E04234] border-[#F8D2CE]",
    barClass: "bg-gradient-to-r from-[#E04234] to-[#C46853]",
    dotClass: "bg-[#E04234]",
  };
}

/**
 * Universal Single Source of Truth results computer.
 * Computes all UI metrics deterministically from the analysis response.
 */
export function computeResultsData({
  skinAnalysis = null,
  skinProfile = {},
  aboutMe = {},
  lifestyle = {},
  reportedConcerns = [],
} = {}) {
  const rawList = Array.isArray(skinAnalysis?.attributes) ? skinAnalysis.attributes : [];
  const fromAiMap = Object.fromEntries(
    rawList.map((a) => [String(a.attribute || a.id).toLowerCase(), a])
  );

  const userConcernsList = Array.isArray(reportedConcerns)
    ? reportedConcerns
    : [skinProfile?.mainConcern].filter(Boolean);

  const computedAttributes = SKIN_ATTRIBUTES.map((meta, index) => {
    const hit = fromAiMap[meta.id] || {};
    const guidance = CONDITION_RECOMMENDATIONS[meta.id] || {
      checks: meta.checks || "Skin condition evaluation",
      othersScore: 65,
      optimalActive: "Daily Gentle Moisturizer & SPF 50+",
      optimalAction: "Maintains balanced barrier resilience.",
      focusActive: "Targeted Clinical Active Formula",
      focusAction: "Supports active cellular renewal.",
      clearObs: "Condition looks healthy, calm, and clear.",
      focusObs: "Condition flagged for targeted treatment.",
    };

    const isUserConcern = userConcernsList.some((c) => {
      if (c === "acne" && ["whiteheads", "acne_inflammatory", "postacne_spots"].includes(meta.id)) return true;
      if (c === "pigmentation" && ["pigmentation", "postacne_spots", "freckles"].includes(meta.id)) return true;
      if (c === "fineLines" && ["wrinkles"].includes(meta.id)) return true;
      if (c === "pores" && ["visible_pores", "whiteheads"].includes(meta.id)) return true;
      if (c === "redness" && ["redness"].includes(meta.id)) return true;
      return false;
    });

    // Score determination from AI category
    let category = hit.category || "Looking good";
    let userScore = 92;
    let isQuizSourced = false;

    if (category === "Needs a boost") {
      userScore = typeof hit.score === "number" ? hit.score : 58 + ((index * 3) % 10);
    } else if (category === "Fine for now") {
      userScore = typeof hit.score === "number" ? hit.score : 74 + ((index * 2) % 9);
    } else if (category === "Hard to tell") {
      if (isUserConcern) {
        category = "Needs a boost";
        userScore = 64;
        isQuizSourced = true;
      } else {
        category = "Fine for now";
        userScore = 76;
      }
    } else {
      // Looking good / Optimal
      userScore = typeof hit.score === "number" ? hit.score : 89 + (index % 8);
    }

    const bandInfo = getScoreBand(userScore);
    const isOptimal = bandInfo.band === "optimal";

    // Condition-specific recommendation texts (NEVER generic repetitions!)
    const activeFormula = isOptimal ? guidance.optimalActive : guidance.focusActive;
    const activeBenefit = isOptimal ? guidance.optimalAction : guidance.focusAction;

    let observation = typeof hit.observation === "string" && hit.observation.trim()
      ? hit.observation.trim()
      : isOptimal
      ? guidance.clearObs
      : guidance.focusObs;

    const othersScore = guidance.othersScore;
    const delta = userScore - othersScore;

    return {
      ...meta,
      indexNumber: String(index + 1).padStart(2, "0"),
      category,
      userScore,
      othersScore,
      delta,
      scoreBand: bandInfo.band,
      scoreBandLabel: bandInfo.label,
      badgeClass: bandInfo.badgeClass,
      barClass: bandInfo.barClass,
      dotClass: bandInfo.dotClass,
      isQuizSourced,
      checks: guidance.checks,
      shortTakeaway: observation,
      keyActive: activeFormula,
      actionBenefit: activeBenefit,
      isOptimal,
      products: productsByIds(meta.products || []),
    };
  });

  // Universal Overall Vitality Score (Integer Average)
  const totalSum = computedAttributes.reduce((acc, c) => acc + c.userScore, 0);
  const overallScore = computedAttributes.length ? Math.round(totalSum / computedAttributes.length) : 82;

  // Counts by Score Band
  const counts = {
    optimal: computedAttributes.filter((a) => a.scoreBand === "optimal").length,
    balanced: computedAttributes.filter((a) => a.scoreBand === "balanced").length,
    focus: computedAttributes.filter((a) => a.scoreBand === "focus").length,
  };

  // Primary Focus Areas: STRICTLY conditions < 85 (excluding cosmetic marks moles/nevi from medical concern)
  const focusAreas = computedAttributes
    .filter((a) => a.userScore < 85 && a.id !== "moles" && a.id !== "nevi")
    .sort((a, b) => a.userScore - b.userScore);

  const hasNoMajorConcerns = focusAreas.length === 0;

  // Strengths
  const topStrengths = [...computedAttributes]
    .filter((a) => a.id !== "moles" && a.id !== "nevi")
    .sort((a, b) => b.userScore - a.userScore)
    .slice(0, 2);

  // #1 Priority and Strength spread check
  const nonMoleAttributes = computedAttributes.filter((a) => a.id !== "moles" && a.id !== "nevi");
  const sortedByScore = [...nonMoleAttributes].sort((a, b) => a.userScore - b.userScore);
  const lowestCondition = sortedByScore[0] || computedAttributes[0];
  const highestCondition = sortedByScore[sortedByScore.length - 1] || computedAttributes[0];
  const scoreSpread = (highestCondition?.userScore || 90) - (lowestCondition?.userScore || 60);
  const isWellBalanced = scoreSpread <= 5;

  // Hydration & Elasticity Derived Scores (Derived from relevant condition scores)
  const hydrationCondition = computedAttributes.find((a) => a.id === "visible_pores") || computedAttributes[0];
  const elasticityCondition = computedAttributes.find((a) => a.id === "wrinkles") || computedAttributes[0];

  const currentHydration = Math.round(hydrationCondition.userScore * 0.75 + 10);
  const currentElasticity = Math.round(elasticityCondition.userScore * 0.7 + 12);
  const projectedHydration = Math.min(96, Math.max(88, currentHydration + 22));
  const projectedElasticity = Math.min(94, Math.max(86, currentElasticity + 24));

  // Trajectory fit index derived from overall score
  const derivedFitIndex = Math.max(82, Math.min(96, Math.round(overallScore * 0.95 + 4)));

  // Core products & takeaway
  const isDry = skinProfile?.skinType === "dry";
  const cleanser = isDry ? MILC_CATALOG.hydratingCleanser : MILC_CATALOG.bha;
  const moisturizer = MILC_CATALOG.moisturizer;

  const quickTakeawayRoutine = {
    step1: cleanser.label,
    step2: moisturizer.label,
    description: "Daily morning & evening ritual to clear congestion while sealing skin barrier hydration.",
  };

  return {
    attributes: computedAttributes,
    overallScore,
    vitalityScore: overallScore,
    counts,
    bandCounts: counts,
    focusAreas,
    hasNoMajorConcerns,
    topStrengths,
    lowestCondition,
    highestCondition,
    priorityCondition: lowestCondition,
    strengthCondition: highestCondition,
    isWellBalanced,
    prioritySummary: isWellBalanced
      ? "Your skin is well balanced across all tested markers"
      : lowestCondition?.label || "Surface Balance",
    strengthSummary: highestCondition?.label || "Skin Resilience",
    cleanser,
    moisturizer,
    quickTakeawayRoutine,
    currentHydration,
    currentElasticity,
    projectedHydration,
    projectedElasticity,
    derivedFitIndex,
  };
}
