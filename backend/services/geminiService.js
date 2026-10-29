import { GoogleGenAI } from "@google/genai";

export const ATTRIBUTE_IDS = [
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

export const CATEGORIES = ["Looking good", "Fine for now", "Needs a boost", "Hard to tell"];

const MODEL_CANDIDATES = [
  ...new Set([process.env.GEMINI_MODEL, "gemini-2.5-flash", "gemini-2.0-flash"].filter(Boolean)),
];

const GEMINI_RETRIES = Number(process.env.GEMINI_RETRIES) || 2;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getGeminiApiKeys = () => {
  const keys = [
    process.env.GEMINI_API_KEY,
    ...(String(process.env.GEMINI_API_KEYS || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)),
  ].filter((k) => k && k !== "your_key_from_https://aistudio.google.com/apikey");
  return [...new Set(keys)];
};

export function hasGeminiKey() {
  return getGeminiApiKeys().length > 0;
}

const errorText = (error) =>
  [error?.message, error?.status, error?.code, typeof error === "string" ? error : ""]
    .filter(Boolean)
    .join(" ");

const classifyGeminiError = (error) => {
  const msg = errorText(error).toLowerCase();
  const code = Number(error?.status || error?.code) || null;
  if (msg.includes("api key not valid") || msg.includes("api_key_invalid") || code === 401 || code === 403) {
    return { type: "auth", httpStatus: 401, message: "Invalid GEMINI_API_KEY." };
  }
  if (msg.includes("fetch failed") || msg.includes("enotfound")) {
    return { type: "network", httpStatus: 503, message: "Cannot reach Google Gemini API." };
  }
  if (msg.includes("not found") || msg.includes("not_found") || msg.includes("is not supported")) {
    return { type: "model", httpStatus: 502, message: "Gemini model not available. Set GEMINI_MODEL in .env." };
  }
  if (msg.includes("quota") || (code === 429 && msg.includes("quota"))) {
    return { type: "quota", httpStatus: 429, message: "Gemini API quota exceeded." };
  }
  if (code === 429 || msg.includes("rate limit")) {
    return { type: "rate_limit", httpStatus: 429, message: "Gemini is rate-limiting requests." };
  }
  if (code === 503 || msg.includes("unavailable") || msg.includes("timed out")) {
    return { type: "transient", httpStatus: 503, message: "Gemini is temporarily unavailable." };
  }
  return { type: "unknown", httpStatus: 500, message: String(error?.message || "Analysis failed.") };
};

const isRetryable = (err) => {
  const kind = classifyGeminiError(err).type;
  return kind === "rate_limit" || kind === "transient";
};

export function toInlineImagePart(input) {
  if (!input) return null;
  if (input.inlineData?.data) return input;
  let dataUrl = "";
  let mimeType = "image/jpeg";
  if (typeof input === "string") {
    if (input.startsWith("data:")) dataUrl = input;
    else return { inlineData: { mimeType, data: input.trim() } };
  } else if (typeof input === "object") {
    if (input.dataUrl) dataUrl = input.dataUrl;
    else if (input.base64Data) {
      mimeType = input.mediaType || input.mimeType || "image/jpeg";
      return { inlineData: { mimeType, data: String(input.base64Data).trim() } };
    }
  }
  if (!dataUrl.startsWith("data:")) return null;
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return { inlineData: { mimeType: match[1], data: match[2].trim() } };
}

const extractResponseText = (response) => {
  if (typeof response?.text === "string" && response.text.trim()) return response.text.trim();
  const parts = response?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    const joined = parts.map((p) => p?.text || "").join("").trim();
    if (joined) return joined;
  }
  return "";
};

const parseGeminiJson = (raw) => {
  let text = String(raw || "").trim();
  if (text.startsWith("```")) text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) text = text.slice(start, end + 1);
  return JSON.parse(text);
};

const ANALYSIS_PROMPT = `You are a dermatological skin-analysis assistant for cosmetic appearance only. Analyze this single front-facing facial photo for the following 11 conditions:

1. whiteheads — Whiteheads: Closed comedones, small clogged pores with white sebum heads (T-zone, chin, forehead, cheeks).
2. redness — Redness: Facial erythema, flushing, vascular redness, capillary sensitivity (cheeks, nose, central face).
3. postacne_spots — Postacne spots: Post-inflammatory hyperpigmentation (PIH/PIE) and marks left behind by past breakouts (cheeks, jawline, temples).
4. wrinkles — Wrinkles: Fine lines, expression lines, crow's feet, forehead furrows, nasolabial lines (forehead, eyes, mouth).
5. acne_inflammatory — Acne Inflammatory: Active inflammatory papules, pustules, cysts, tender red breakout lesions (cheeks, jawline, chin, T-zone).
6. freckles — Freckles: Ephelides, discrete light-brown sun-related speckles (nose bridge, upper cheeks).
7. pigmentation — Pigmentation: Sun spots, melasma patches, uneven dark patches, hyperpigmentation (forehead, upper cheeks, temples).
8. scars — Scars: Post-breakout textural scarring, atrophic or indented marks, rolling/boxcar depressions (cheeks, temples).
9. visible_pores — Visible pores: Enlarged pore diameter, follicular congestion on nose, inner cheeks, and forehead.
10. moles — Moles: Common benign melanocytic spots, dark or brown circular macules across facial skin.
11. nevi — Nevi: Distinct pigmented dermal/junctional nevi, beauty marks across facial skin.

For each condition, return one of these 4 categories: Looking good / Fine for now / Needs a boost / Hard to tell, plus a one-sentence observation grounded only in what's visible in the image.

Rules:
- Do not diagnose medical conditions.
- If lighting, makeup, blur, or angle prevent a confident read, use Hard to tell.
- Reject if this is not a real human face, is heavily filtered, or is not a facial photo. Then set imageRejected=true.
- Return valid JSON only, no markdown.

Shape:
{
  "imageRejected": false,
  "rejectionReasons": [],
  "qualityChecks": { "insufficientLight": false, "filtersApplied": false, "notAFace": false },
  "headline": "max 14 words summarizing skin type + main visible theme",
  "summary": "2 sentences on overall visible appearance across the 11 analyzed conditions",
  "attributes": [
    { "attribute": "whiteheads", "category": "Looking good", "observation": "one sentence" },
    { "attribute": "redness", "category": "Looking good", "observation": "one sentence" },
    { "attribute": "postacne_spots", "category": "Looking good", "observation": "one sentence" },
    { "attribute": "wrinkles", "category": "Looking good", "observation": "one sentence" },
    { "attribute": "acne_inflammatory", "category": "Looking good", "observation": "one sentence" },
    { "attribute": "freckles", "category": "Looking good", "observation": "one sentence" },
    { "attribute": "pigmentation", "category": "Looking good", "observation": "one sentence" },
    { "attribute": "scars", "category": "Looking good", "observation": "one sentence" },
    { "attribute": "visible_pores", "category": "Looking good", "observation": "one sentence" },
    { "attribute": "moles", "category": "Looking good", "observation": "one sentence" },
    { "attribute": "nevi", "category": "Looking good", "observation": "one sentence" }
  ]
}

All 11 condition ids are required: whiteheads, redness, postacne_spots, wrinkles, acne_inflammatory, freckles, pigmentation, scars, visible_pores, moles, nevi.`;

async function callGemini(ai, model, payload, retries = GEMINI_RETRIES) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await ai.models.generateContent({ ...payload, model });
    } catch (err) {
      lastError = err;
      if (!isRetryable(err) || attempt === retries - 1) throw err;
      await delay(classifyGeminiError(err).type === "rate_limit" ? 4000 * (attempt + 1) : 2000 * (attempt + 1));
    }
  }
  throw lastError;
}

async function callGeminiWithFallback(payload) {
  const apiKeys = getGeminiApiKeys();
  if (!apiKeys.length) {
    const err = new Error("GEMINI_API_KEY is missing.");
    err.status = 401;
    throw err;
  }
  let lastError;
  for (let keyIndex = 0; keyIndex < apiKeys.length; keyIndex++) {
    const ai = new GoogleGenAI({ apiKey: apiKeys[keyIndex] });
    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await callGemini(ai, model, payload);
        return { response, model };
      } catch (err) {
        lastError = err;
        const kind = classifyGeminiError(err).type;
        if (kind === "quota" || kind === "auth") break;
        if (kind === "model") continue;
      }
    }
  }
  throw lastError;
}

const ALIAS_MAP = {
  whitehead: "whiteheads",
  whiteheads: "whiteheads",
  closed_comedones: "whiteheads",
  redness: "redness",
  erythema: "redness",
  rosacea: "redness",
  postacne: "postacne_spots",
  postacne_spots: "postacne_spots",
  postacnespots: "postacne_spots",
  post_acne: "postacne_spots",
  post_acne_spots: "postacne_spots",
  wrinkle: "wrinkles",
  wrinkles: "wrinkles",
  finelines: "wrinkles",
  fine_lines: "wrinkles",
  acne: "acne_inflammatory",
  acne_inflammatory: "acne_inflammatory",
  acneinflammatory: "acne_inflammatory",
  inflammatory_acne: "acne_inflammatory",
  breakouts: "acne_inflammatory",
  freckle: "freckles",
  freckles: "freckles",
  pigmentation: "pigmentation",
  dark_spots: "pigmentation",
  darkspots: "pigmentation",
  scar: "scars",
  scars: "scars",
  scarring: "scars",
  pores: "visible_pores",
  visible_pores: "visible_pores",
  visiblepores: "visible_pores",
  mole: "moles",
  moles: "moles",
  nevi: "nevi",
  nevus: "nevi",
};

export function normalizeAttributes(rawList = []) {
  const byId = new Map();
  (Array.isArray(rawList) ? rawList : []).forEach((item) => {
    const rawKey = String(item?.attribute || item?.id || "")
      .trim()
      .toLowerCase();
    const canonKey = ALIAS_MAP[rawKey] || rawKey;
    if (canonKey) byId.set(canonKey, item);
  });

  return ATTRIBUTE_IDS.map((id) => {
    const hit = byId.get(id) || {};
    const category = CATEGORIES.includes(hit.category) ? hit.category : "Hard to tell";
    const observation =
      typeof hit.observation === "string" && hit.observation.trim()
        ? hit.observation.trim()
        : "Condition assessed in clear view across facial zones.";
    return { attribute: id, category, observation };
  });
}

export function demoAnalysis({ aboutMe = {}, skinProfile = {}, lifestyle = {} } = {}) {
  const concern = skinProfile.mainConcern || "acne";
  const breakouts = skinProfile.breakouts;
  const midday = skinProfile.middayFeel;
  const sun = lifestyle.sunExposure;
  const spf = lifestyle.sunscreen;
  const age = Number(aboutMe.age) || 28;

  const cat = (boostWhen, fineWhen) => {
    if (boostWhen) return "Needs a boost";
    if (fineWhen) return "Fine for now";
    return "Looking good";
  };

  const attributes = [
    {
      attribute: "whiteheads",
      category: cat(midday === "shinyAll" || breakouts === "frequent", midday === "tZone"),
      observation:
        midday === "shinyAll"
          ? "Micro-congestion and small closed comedones are visible along the forehead and chin."
          : "Skin surface appears largely free of closed comedonal clustering.",
    },
    {
      attribute: "redness",
      category: cat(concern === "redness" || skinProfile.skinType === "sensitive", concern === "redness"),
      observation:
        concern === "redness"
          ? "Visible vascular reactivity and erythema detected across central cheek areas."
          : "Capillary tone looks calm with minimal visible surface redness.",
    },
    {
      attribute: "postacne_spots",
      category: cat(breakouts === "frequent" || concern === "acne", breakouts === "occasional"),
      observation:
        breakouts === "frequent" || breakouts === "occasional"
          ? "Post-inflammatory macules and pigmentation traces remain from previous breakout cycles."
          : "Faint to negligible post-blemish discoloration detected.",
    },
    {
      attribute: "wrinkles",
      category: cat(concern === "fineLines" && age >= 35, age >= 30),
      observation:
        age >= 35
          ? "Delicate dynamic expression lines visible around eye corners and forehead."
          : "Skin matrix demonstrates strong elasticity with minimal visible furrowing.",
    },
    {
      attribute: "acne_inflammatory",
      category: cat(breakouts === "frequent" || concern === "acne", breakouts === "occasional"),
      observation:
        breakouts === "frequent"
          ? "Active inflammatory papules detected around the lower face and T-zone."
          : "No active inflammatory cysts or inflamed lesions stand out.",
    },
    {
      attribute: "freckles",
      category: cat(false, sun === "high"),
      observation:
        sun === "high"
          ? "Dispersed ephelides (light freckling) noted across the nose bridge and upper cheeks."
          : "Minimal light-induced freckling observed.",
    },
    {
      attribute: "pigmentation",
      category: cat(concern === "pigmentation" || (sun === "high" && spf !== "daily"), sun === "moderate"),
      observation:
        concern === "pigmentation" || (sun === "high" && spf !== "daily")
          ? "Focal melanin clustering and sun spots detected on the upper cheekbones and forehead."
          : "Even melanin distribution with minimal UV-induced spotting.",
    },
    {
      attribute: "scars",
      category: cat(concern === "texture" && breakouts === "frequent", breakouts === "frequent"),
      observation:
        breakouts === "frequent"
          ? "Shallow textural indentations and post-blemish micro-scars present on the mid-cheeks."
          : "Smooth dermal texture with no noticeable atrophic scar tissue.",
    },
    {
      attribute: "visible_pores",
      category: cat(concern === "pores" || midday === "shinyAll", midday === "tZone"),
      observation:
        concern === "pores" || midday === "shinyAll" || midday === "tZone"
          ? "Enlarged follicular openings prominent across the nose and medial cheeks."
          : "Follicular pore diameter appears tight and refined.",
    },
    {
      attribute: "moles",
      category: cat(false, false),
      observation: "Benign, well-circumscribed melanocytic macules observed; stable baseline appearance.",
    },
    {
      attribute: "nevi",
      category: cat(false, false),
      observation: "Isolated dermal/junctional nevi noted; regular border symmetry and uniform pigmentation.",
    },
  ];

  return {
    demo: true,
    imageRejected: false,
    headline: `${skinProfile.skinType === "combination" ? "Combination" : "Your"} skin, main concern: ${concern}`,
    summary:
      "This is a quiz-grounded demo read because GEMINI_API_KEY is not set. Add a key to backend/.env for live photo analysis.",
    attributes: normalizeAttributes(attributes),
    photoStored: false,
  };
}

export async function analyzeFacePhotos({ images = [] }) {
  const face = images.find((i) => i.type === "front") || images[0];
  const parts = [
    { text: ANALYSIS_PROMPT },
    { text: "This is the user's single front-facing face photo." },
    toInlineImagePart(face),
  ].filter(Boolean);

  const { response, model } = await callGeminiWithFallback({
    contents: [{ role: "user", parts }],
    config: { temperature: 0.2, responseMimeType: "application/json" },
  });

  const parsed = parseGeminiJson(extractResponseText(response));
  if (parsed.imageRejected) {
    const err = new Error(
      parsed.error || "Please upload a clear, well-lit face photo with no filters or makeup."
    );
    err.imageRejected = true;
    err.rejectionReasons = parsed.rejectionReasons || [];
    err.qualityChecks = parsed.qualityChecks || {};
    throw err;
  }

  return {
    demo: false,
    model,
    imageRejected: false,
    headline: typeof parsed.headline === "string" ? parsed.headline : "",
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
    attributes: normalizeAttributes(parsed.attributes),
    photoStored: false,
  };
}

export function publicAnalysisError(e) {
  return classifyGeminiError(e).message;
}
