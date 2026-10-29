export const SKIN_ATTRIBUTES = [
  {
    id: "whiteheads",
    label: "Whiteheads",
    checks: "Closed comedones, trapped sebum & keratin",
    region: "T-zone, chin, forehead, cheeks",
    products: ["bha", "niacinamide"],
  },
  {
    id: "redness",
    label: "Redness",
    checks: "Facial erythema, capillary flushing, reactive irritation",
    region: "Cheeks, nose bridge, central face",
    products: ["moisturizer", "niacinamide"],
  },
  {
    id: "postacne_spots",
    label: "Postacne spots",
    checks: "Post-inflammatory hyperpigmentation (PIH/PIE) from past breakouts",
    region: "Cheeks, jawline, lower face",
    products: ["vitC", "niacinamide", "spf"],
  },
  {
    id: "wrinkles",
    label: "Wrinkles",
    checks: "Expression lines, static furrows, periorbital & forehead creasing",
    region: "Forehead, eye corners, mouth corners",
    products: ["moisturizer", "spf"],
  },
  {
    id: "acne_inflammatory",
    label: "Acne Inflammatory",
    checks: "Active inflammatory papules, pustules, tender follicular swelling",
    region: "Cheeks, jawline, chin, T-zone",
    products: ["bha", "niacinamide"],
  },
  {
    id: "freckles",
    label: "Freckles",
    checks: "Ephelides, localized UV-induced & genetic melanin clusters",
    region: "Nose bridge, upper cheeks",
    products: ["spf", "vitC"],
  },
  {
    id: "pigmentation",
    label: "Pigmentation",
    checks: "Sun spots, melasma patches, generalized uneven tone",
    region: "Forehead, upper cheeks, temples",
    products: ["vitC", "niacinamide", "spf"],
  },
  {
    id: "scars",
    label: "Scars",
    checks: "Atrophic or textural acne indentations (rolling, boxcar, ice-pick)",
    region: "Cheeks, temples",
    products: ["moisturizer", "bha"],
  },
  {
    id: "visible_pores",
    label: "Visible pores",
    checks: "Enlarged follicular diameter, congestion, sebum dilation",
    region: "Nose, inner cheeks, T-zone",
    products: ["bha", "niacinamide"],
  },
  {
    id: "moles",
    label: "Moles",
    checks: "Common benign melanocytic spots, dark/brown circular macules",
    region: "Full face",
    products: ["spf"],
  },
  {
    id: "nevi",
    label: "Nevi",
    checks: "Pigmented cutaneous marks, beauty marks, junctional/compound lesions",
    region: "Full face",
    products: ["spf"],
  },
];

export const CATEGORIES = ["Looking good", "Fine for now", "Needs a boost", "Hard to tell"];

export const CATEGORY_URGENCY = {
  "Looking good": "Looking good here — keep this going with a simple, consistent routine.",
  "Fine for now": "Worth a small tweak — a consistent gentle routine should help this settle.",
  "Needs a boost": "This is a priority right now — left untreated, it often reads more obvious in daylight.",
  "Hard to tell": "This angle or lighting limited the read. A retake in even natural light would help.",
};

export const CONCERN_LABELS = {
  acne: "Acne / breakouts",
  pigmentation: "Dark spots / pigmentation",
  dullness: "Dullness / uneven tone",
  fineLines: "Fine lines / wrinkles",
  pores: "Large pores",
  dryness: "Dryness / flakiness",
  redness: "Redness / sensitivity",
};

export const SKIN_TYPE_LABELS = {
  oily: "Oily",
  dry: "Dry",
  combination: "Combination",
  normal: "Normal",
  unsure: "Not sure",
};

export function ageBand(age) {
  const n = Number(age);
  if (!Number.isFinite(n)) return "";
  if (n < 25) return "13-24";
  if (n < 35) return "25-34";
  if (n < 45) return "35-44";
  return "45+";
}
