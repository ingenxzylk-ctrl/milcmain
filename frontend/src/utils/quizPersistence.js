import { saveFaceImagesToIdb, clearFaceImagesIdb } from "./quizImageStore";

export const STORAGE_KEY = "milc_skin_quiz_v1";

export const INITIAL_QUIZ_STATE = {
  step: 0.5,
  aboutMe: {
    fullName: "",
    whatsapp: "",
    email: "",
    city: "",
    pincode: "",
    state: "",
    countryCode: "+91",
    countryName: "India",
    age: "",
    ageRange: "",
    gender: "",
    photoConsent: false,
  },
  skinProfile: {
    skinType: "",
    mainConcern: "",
    middayFeel: "",
    breakouts: "",
    concernDuration: "",
  },
  lifestyle: {
    sleep: "",
    stress: "",
    sunExposure: "",
    sunscreen: "",
    water: "",
    conditions: [],
    conditionsOther: "",
    routine: "",
    treatments: "",
    treatmentsNote: "",
  },
  skinAnalysis: null,
  faceImages: [],
  archivedReportId: null,
  archivedReportDate: null,
  sectionSteps: {
    section1AboutYou: 0,
    section2SkinProfile: 0,
    section3Lifestyle: 0,
    section4Scan: "guide",
  },
  navDirection: "forward",
  isLoading: false,
  error: null,
};

function lightImages(images = []) {
  return (Array.isArray(images) ? images : []).map((img) => ({
    type: img?.type,
    label: img?.label || img?.type,
    hasImage: Boolean(img?.dataUrl || img?.previewUrl || img?.url),
    dataUrl: null,
  }));
}

function serializeState(state) {
  const sectionSteps = { ...(state.sectionSteps || {}) };
  if (sectionSteps.section4Scan === "analyzing") sectionSteps.section4Scan = "upload";
  return {
    ...state,
    sectionSteps,
    isLoading: false,
    error: null,
    faceImages: lightImages(state.faceImages),
  };
}

export function persistQuizStateNow(state) {
  try {
    const payload = serializeState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    const heavy = (state.faceImages || []).filter((img) => img?.dataUrl);
    if (heavy.length) saveFaceImagesToIdb(heavy).catch(() => {});
  } catch {
    // quota
  }
}

export function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      ...INITIAL_QUIZ_STATE,
      ...parsed,
      aboutMe: { ...INITIAL_QUIZ_STATE.aboutMe, ...(parsed.aboutMe || {}) },
      skinProfile: { ...INITIAL_QUIZ_STATE.skinProfile, ...(parsed.skinProfile || {}) },
      lifestyle: { ...INITIAL_QUIZ_STATE.lifestyle, ...(parsed.lifestyle || {}) },
      sectionSteps: { ...INITIAL_QUIZ_STATE.sectionSteps, ...(parsed.sectionSteps || {}) },
      isLoading: false,
      error: null,
    };
  } catch {
    return null;
  }
}

export function clearPersistedQuizState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  clearFaceImagesIdb().catch(() => {});
}
