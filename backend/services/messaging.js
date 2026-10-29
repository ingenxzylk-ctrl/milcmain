const CONCERN_TO_ATTR = {
  acne: "acne_inflammatory",
  pigmentation: "pigmentation",
  dullness: "pigmentation",
  fineLines: "wrinkles",
  pores: "visible_pores",
  dryness: "redness",
  redness: "redness",
  texture: "scars",
};

function appendOnce(text, extra) {
  if (!extra) return text;
  if (String(text).includes(extra.slice(0, 24))) return text;
  return `${text} ${extra}`.trim();
}

/**
 * Merge quiz answers into observation *copy* only — never change the category.
 */
export function enrichMessaging(analysis, { aboutMe = {}, skinProfile = {}, lifestyle = {} } = {}) {
  const attributes = (analysis.attributes || []).map((row) => ({ ...row }));
  const byId = Object.fromEntries(attributes.map((a) => [a.attribute, a]));

  const stress = lifestyle.stress;
  const sleep = lifestyle.sleep;
  const sun = lifestyle.sunExposure;
  const spf = lifestyle.sunscreen;
  const water = lifestyle.water;
  const conditions = Array.isArray(lifestyle.conditions) ? lifestyle.conditions : [];
  const treatments = lifestyle.treatments;
  const duration = skinProfile.concernDuration;
  const breakouts = skinProfile.breakouts;
  const age = Number(aboutMe.age);

  if (byId.redness?.category === "Needs a boost" && (stress === "veryHigh" || stress === "high")) {
    byId.redness.observation = appendOnce(
      byId.redness.observation,
      "Recent high stress can elevate vascular reactivity and flush central cheek zones."
    );
  }

  if (
    (byId.pigmentation?.category === "Needs a boost" || byId.pigmentation?.category === "Fine for now") &&
    (sun === "high" || spf === "never" || spf === "rarely")
  ) {
    byId.pigmentation.observation = appendOnce(
      byId.pigmentation.observation,
      "Daily UV without consistent SPF is the fastest way dark marks and sun spots remain prominent."
    );
  }

  if (byId.postacne_spots && (breakouts === "frequent" || breakouts === "occasional")) {
    byId.postacne_spots.observation = appendOnce(
      byId.postacne_spots.observation,
      "Targeted pigment inhibitors help accelerate fading of residual post-acne marks."
    );
  }

  if (byId.acne_inflammatory && (conditions.includes("pcos") || conditions.includes("acne"))) {
    byId.acne_inflammatory.observation = appendOnce(
      byId.acne_inflammatory.observation,
      "Given your history, treat active breakouts as a consistency play — not a medical diagnosis."
    );
  }

  if (treatments === "yes" && lifestyle.treatmentsNote) {
    const note = `You’re already using ${lifestyle.treatmentsNote.trim()} — introduce new clinical actives gradually.`;
    for (const id of ["acne_inflammatory", "whiteheads", "scars", "wrinkles"]) {
      if (byId[id] && byId[id].category !== "Looking good") {
        byId[id].observation = appendOnce(byId[id].observation, note);
        break;
      }
    }
  }

  if (duration === "over3y" && skinProfile.mainConcern) {
    const mapped = CONCERN_TO_ATTR[skinProfile.mainConcern];
    if (mapped && byId[mapped]) {
      byId[mapped].observation = appendOnce(
        byId[mapped].observation,
        "A longer-standing condition usually needs routine barrier consistency more than a harsh abrasive product."
      );
    }
  }

  if (age >= 35 && byId.wrinkles && byId.wrinkles.category === "Looking good") {
    byId.wrinkles.observation = appendOnce(
      byId.wrinkles.observation,
      "At this age band, broad-spectrum daily SPF and peptides are high-leverage to keep fine lines from deepening."
    );
  }

  const typeLabel =
    {
      oily: "Oily",
      dry: "Dry",
      combination: "Combination",
      normal: "Normal",
      unsure: "Mixed",
    }[skinProfile.skinType] || "Your";

  const concernLabel =
    {
      acne: "inflammatory breakouts",
      pigmentation: "pigmentation & dark spots",
      dullness: "uneven tone",
      fineLines: "wrinkles",
      pores: "visible pores",
      dryness: "dryness",
      redness: "redness",
    }[skinProfile.mainConcern] || "profile concerns";

  const boosted = attributes.filter((a) => a.category === "Needs a boost").map((a) => a.attribute);
  const headline =
    analysis.headline && !analysis.demo
      ? analysis.headline
      : `${typeLabel} skin, focus: ${concernLabel}${boosted.length ? ` + ${boosted.length} condition${boosted.length > 1 ? "s" : ""} to boost` : ""}`;

  return {
    ...analysis,
    headline,
    attributes: ATTRIBUTE_ORDER(attributes, byId),
    photoStored: false,
  };
}

function ATTRIBUTE_ORDER(attributes, byId) {
  const ids = [
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
  return ids.map((id) => byId[id] || attributes.find((a) => a.attribute === id)).filter(Boolean);
}
