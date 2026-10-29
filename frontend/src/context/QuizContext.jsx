import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  loadFaceImagesFromIdb,
  saveFaceImagesToIdb,
  clearFaceImagesIdb,
  mergeFaceImages,
} from "../utils/quizImageStore";

const STORAGE_KEY = "milc_skin_lab_20steps_v2";

export const INITIAL_STATE = {
  step: 1, // 1 through 19
  navDirection: "forward",
  aboutMe: {
    fullName: "Client",
    email: "",
    whatsapp: "",
    gender: "female",
    age: "28",
    ageBand: "25_34",
  },
  skinProfile: {
    skinType: "combination",
    concerns: ["pores", "redness"],
    sensitivity: "non_sensitive",
  },
  lifestyle: {
    sleep: "optimal",
    water: "2_to_6",
    stress: "rarely",
    routineTime: "20_min",
    location: "Chennai, India",
    climate: {
      uv: 12,
      humidity: 67,
      pollution: 20,
    },
  },
  faceImages: [],
  skinAnalysis: null,
  scratchCode: "MILC-GLOW-50",
  signature: "",
  selectedPlan: "1_month",
  isLoading: false,
  error: null,
};

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.skinProfile) delete parsed.skinProfile.secondaryConcerns;
        if (typeof parsed?.step === "number" && parsed.step >= 10) {
          parsed.step = Math.max(10, parsed.step - 1);
        }
        if (parsed?.lifestyle?.location && typeof parsed.lifestyle.location === "object") {
          parsed.lifestyle.location =
            parsed.lifestyle.location.city ||
            parsed.lifestyle.location.location ||
            "Tirunelveli, India";
        }
        return { ...INITIAL_STATE, ...parsed, isLoading: false, error: null };
      }
    } catch {
      // fallback
    }
    return INITIAL_STATE;
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Restore cached image from IndexedDB
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const idbImages = await loadFaceImagesFromIdb();
        if (cancelled || !idbImages?.length) return;
        setState((prev) => {
          const merged = mergeFaceImages(idbImages, prev.faceImages);
          if (!merged.some((i) => i?.dataUrl)) return prev;
          return { ...prev, faceImages: merged };
        });
      } catch {
        // no-op
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist state to localStorage & IndexedDB
  useEffect(() => {
    try {
      const serializable = {
        ...state,
        faceImages: (state.faceImages || []).map((img) => ({
          type: img?.type,
          label: img?.label,
          hasImage: Boolean(img?.dataUrl),
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
      const heavy = (state.faceImages || []).filter((img) => img?.dataUrl);
      if (heavy.length) saveFaceImagesToIdb(heavy).catch(() => {});
    } catch {
      // ignore
    }
  }, [state]);

  const nextStep = () => {
    setState((prev) => ({
      ...prev,
      step: Math.min(19, prev.step + 1),
      navDirection: "forward",
    }));
  };

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1),
      navDirection: "backward",
    }));
  };

  const goToStep = (stepNum, direction = "forward") => {
    setState((prev) => ({
      ...prev,
      step: Math.max(1, Math.min(19, stepNum)),
      navDirection: direction,
    }));
  };

  const updateAboutMe = (data) => {
    setState((prev) => ({ ...prev, aboutMe: { ...prev.aboutMe, ...data } }));
  };

  const updateSkinProfile = (data) => {
    setState((prev) => ({ ...prev, skinProfile: { ...prev.skinProfile, ...data } }));
  };

  const updateLifestyle = (data) => {
    setState((prev) => ({ ...prev, lifestyle: { ...prev.lifestyle, ...data } }));
  };

  const setFaceImages = (images) => {
    setState((prev) => ({ ...prev, faceImages: images }));
  };

  const setSkinAnalysis = (analysis) => {
    setState((prev) => ({ ...prev, skinAnalysis: analysis, isLoading: false, error: null }));
  };

  const setSignature = (sig) => {
    setState((prev) => ({ ...prev, signature: sig }));
  };

  const setSelectedPlan = (planId) => {
    setState((prev) => ({ ...prev, selectedPlan: planId }));
  };

  const setLoading = (loading) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  const setError = (err) => {
    setState((prev) => ({ ...prev, error: err, isLoading: false }));
  };

  const resetQuiz = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      clearFaceImagesIdb().catch(() => {});
    } catch {
      // no-op
    }
    setState(INITIAL_STATE);
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        nextStep,
        prevStep,
        goToStep,
        updateAboutMe,
        updateSkinProfile,
        updateLifestyle,
        setFaceImages,
        setSkinAnalysis,
        setSignature,
        setSelectedPlan,
        setLoading,
        setError,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within a QuizProvider");
  return ctx;
}
