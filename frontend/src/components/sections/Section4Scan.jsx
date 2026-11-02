import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  Shield,
  CheckCircle2,
  AlertCircle,
  ScanLine,
  ChevronLeft,
} from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { compressImage, ensureDataUrl } from "../../utils/compressImage";
import { precheckPhotoQuality } from "../../utils/photoQualityPrecheck";
import { analyzeSkin } from "../../api/quizApi";

const PHOTO_TIPS = [
  { label: "Remove glasses", key: "glasses" },
  { label: "Even natural light", key: "insufficientLight" },
  { label: "No makeup / filters", key: "filtersApplied" },
  { label: "Hair swept back", key: "hair" },
];

const SCAN_STAGES = [
  "Aligning biometric facial landmarks & contours...",
  "Auditing Whiteheads, Inflammatory Acne, and Pores...",
  "Analyzing Pigmentation, Freckles, Spots, and Micro-Redness...",
  "Profiling Wrinkle Depth, Elasticity, and Barrier Integrity...",
  "Synthesizing 11-condition clinical skin protocol...",
];

function savedFaceUrl(saved = []) {
  const hit = (Array.isArray(saved) ? saved : []).find((img) => img?.dataUrl);
  return hit?.dataUrl || null;
}

export default function Section4Scan({ onComplete, onBack }) {
  const { state, setFaceImages, setSkinAnalysis, setLoading } = useQuiz();
  const [photo, setPhoto] = useState(() => savedFaceUrl(state?.faceImages));
  const [error, setError] = useState(null);
  const [serverError, setServerError] = useState(false);
  const [retryMessage, setRetryMessage] = useState("");
  const [failedKeys, setFailedKeys] = useState([]);
  const [useCamera, setUseCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const restored = savedFaceUrl(state?.faceImages);
    if (restored && !photo) setPhoto(restored);
  }, [state?.faceImages, photo]);

  // Stage timer during analysis
  useEffect(() => {
    if (!isAnalyzing) {
      setStageIndex(0);
      setProgressPercent(12);
      return undefined;
    }

    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev));
    }, 4500);

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => (prev < 94 ? prev + Math.floor(Math.random() * 4 + 2) : 94));
    }, 600);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [isAnalyzing]);

  useEffect(() => {
    if (useCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "user", width: 720, height: 960 } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        })
        .catch(() => {
          setError("Could not access camera. Please upload a photo file instead.");
          setUseCamera(false);
        });
    }
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [useCamera]);

  const persistPhoto = (dataUrl) => {
    setFaceImages?.(dataUrl ? [{ type: "front", label: "Face", dataUrl }] : []);
  };

  const acceptPhoto = useCallback(async (dataUrl) => {
    if (!dataUrl) return;
    setError(null);
    setServerError(false);
    const check = await precheckPhotoQuality(dataUrl);
    if (!check.ok) {
      setFailedKeys(["insufficientLight"]);
      setError(check.message);
      return;
    }
    setFailedKeys([]);
    setPhoto(dataUrl);
    persistPhoto(dataUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      await acceptPhoto(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    const width = videoRef.current.videoWidth || 720;
    const height = videoRef.current.videoHeight || 960;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    const screenshot = canvas.toDataURL("image/jpeg", 0.9);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    setUseCamera(false);
    await acceptPhoto(screenshot);
  };

  const removePhoto = () => {
    setPhoto(null);
    persistPhoto(null);
    setError(null);
    setServerError(false);
    setFailedKeys([]);
  };

  const runAnalysis = async () => {
    if (!photo) {
      setError("Please upload one clear, front-facing photo of your face.");
      return;
    }
    setIsAnalyzing(true);
    setServerError(false);
    setRetryMessage("");
    setLoading?.(true);

    const timeoutId = setTimeout(() => {
      setError("Analysis is taking longer than expected. Please try again.");
      setIsAnalyzing(false);
      setLoading?.(false);
      setServerError(true);
    }, 180000);

    try {
      const dataUrl = await compressImage(await ensureDataUrl(photo), 1280, 0.88);
      const aiResponse = await analyzeSkin({
        aboutMe: state.aboutMe,
        skinProfile: state.skinProfile,
        lifestyle: state.lifestyle,
        images: [{ type: "front", label: "Face", dataUrl }],
        onRetryProgress: (info) => {
          setRetryMessage(info.message);
        },
      });
      setProgressPercent(100);
      clearTimeout(timeoutId);
      setTimeout(() => {
        setSkinAnalysis(aiResponse);
        setFaceImages([{ type: "front", label: "Face", dataUrl }]);
        setIsAnalyzing(false);
        setLoading?.(false);
        onComplete?.(aiResponse);
      }, 500);
    } catch (err) {
      clearTimeout(timeoutId);
      setIsAnalyzing(false);
      setLoading?.(false);
      if (err.imageRejected) {
        setFailedKeys(["insufficientLight", "filtersApplied"]);
        setError(err.message || "Please provide a clearer, unfiltered photo.");
      } else {
        // 503, network error, or schema validation failure
        setServerError(true);
        setError(err.message);
      }
    }
  };

  // Dedicated Error Screen when analysis fails (Phase 1.2)
  if (serverError && !isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md md:max-w-xl mx-auto mt-6 px-3 sm:px-4"
      >
        <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="w-14 h-14 rounded-full bg-[#FDF0EE] text-[#E04234] flex items-center justify-center mx-auto mb-4 border border-[#F8D2CE]">
            <AlertCircle className="w-7 h-7 stroke-[2]" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight">
            We couldn't complete your analysis
          </h3>

          <p className="text-xs sm:text-sm text-[#52525B] mt-2 mb-6 max-w-md mx-auto leading-relaxed">
            Your answers and photo are safely saved. The neural analysis service is temporarily busy or encountered a network interruption.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto h-12 px-6 rounded-full border border-[#EBE5DC] bg-[#FAF9F6] text-[#52525B] font-semibold text-xs sm:text-sm hover:border-[#CD92EB] hover:text-[#141416] transition-all cursor-pointer"
            >
              Back to Quiz
            </button>
            <button
              type="button"
              onClick={runAnalysis}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#E04234] hover:bg-[#C73024] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Analysis</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md md:max-w-xl mx-auto mt-4 sm:mt-6 px-3 sm:px-4"
      >
        <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
          {/* Lavender & Chartreuse biometric radar aura */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-80 h-80 rounded-full border border-[#CD92EB]/40 animate-ping" />
            <div className="w-56 h-56 rounded-full border border-[#D4FF3F]/60 animate-pulse" />
          </div>

          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-[#EBE5DC]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#CD92EB] border-r-[#E04234]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-bold text-[#141416]">{progressPercent}%</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#71717A]">Analyzing</span>
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight">
            AI Skin Topography Audit
          </h3>

          <p className="text-[10px] sm:text-[11px] font-mono font-bold text-[#E04234] mt-2 uppercase tracking-wider">
            {retryMessage || "Biometric Scan in Progress"}
          </p>

          {/* Progress gauge bar */}
          <div className="h-1.5 bg-[#EBE5DC] rounded-full w-full overflow-hidden my-5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#CD92EB] via-[#E04234] to-[#D4FF3F] rounded-full"
              initial={{ width: "12%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Dynamic telemetry step */}
          <div className="min-h-[48px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={stageIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-xs sm:text-sm text-[#52525B] font-medium px-2"
              >
                {retryMessage || SCAN_STAGES[stageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-7 pt-4 border-t border-[#EBE5DC] flex items-center justify-center gap-2 text-[11px] text-[#71717A]">
            <span className="w-2 h-2 rounded-full bg-[#D4FF3F] shadow-[0_0_5px_#D4FF3F]" />
            <Shield className="w-3.5 h-3.5 text-[#141416]" />
            <span>Encrypted locally · Zero raw photos stored</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto mt-1 sm:mt-2 px-2 sm:px-6 pb-10"
    >
      <div className="atelier-card rounded-[24px] sm:rounded-[36px] p-4.5 sm:p-8 md:p-10 relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* Soft Lavender flare */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-br from-[#CD92EB]/18 via-[#CD92EB]/5 to-transparent pointer-events-none blur-3xl" />

        {/* Header */}
        <div className="mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-[#EBE5DC] text-left">
          <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-3 py-1 rounded-full mb-2.5 sm:mb-3 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_6px_#D4FF3F]" />
            <ScanLine className="w-3.5 h-3.5 text-[#E04234]" />
            Biometric Mapping
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#141416] tracking-tight leading-tight">
            Front-Facing Facial Topography
          </h2>
          <p className="text-[#71717A] text-xs sm:text-sm mt-2 leading-relaxed max-w-xl">
            Please remove glasses, face even natural lighting, and maintain a neutral expression so the AI can accurately evaluate your epidermal surface.
          </p>
        </div>

        {/* Quality tips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 sm:mb-6">
          {PHOTO_TIPS.map((tip) => {
            const failed = failedKeys.includes(tip.key);
            return (
              <div
                key={tip.label}
                className={`rounded-xl px-2.5 py-2 text-center border transition-all ${
                  failed
                    ? "bg-[#FDF0EE] border-[#F8D2CE] text-[#E04234]"
                    : "bg-[#FAF9F6] border-[#EBE5DC] text-[#52525B]"
                }`}
              >
                <p className="text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1.5">
                  {failed ? (
                    <AlertCircle className="w-3 h-3 text-[#E04234]" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-[#141416]" />
                  )}
                  <span>{tip.label}</span>
                </p>
              </div>
            );
          })}
        </div>

        {error && !serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 sm:p-3.5 bg-[#FDF0EE] border border-[#F8D2CE] text-[#E04234] text-xs font-medium rounded-2xl mb-4 sm:mb-5 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-[#E04234] shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Biometric Viewfinder with Chartreuse Reticle & Laser */}
        <div className="rounded-3xl border border-[#EBE5DC] bg-[#FAF9F6] p-2.5 sm:p-3 mb-5 sm:mb-6 max-w-sm mx-auto shadow-inner relative">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#F4EFE9] border border-[#EBE5DC]">
            {/* Viewfinder corner HUD marks in brand Chartreuse */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4FF3F] shadow-[0_0_6px_#D4FF3F] z-20 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4FF3F] shadow-[0_0_6px_#D4FF3F] z-20 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4FF3F] shadow-[0_0_6px_#D4FF3F] z-20 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4FF3F] shadow-[0_0_6px_#D4FF3F] z-20 pointer-events-none" />

            {/* Mode 1: Live Camera View */}
            {useCamera ? (
              <div className="absolute inset-0 bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" />
                {/* Chartreuse laser scan line animation */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4FF3F] to-transparent shadow-[0_0_12px_#D4FF3F] animate-laser pointer-events-none z-10" />

                {/* In-viewfinder capture controls */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-2 z-30 px-3">
                  <button
                    type="button"
                    onClick={captureFromCamera}
                    className="h-10 px-5 rounded-full bg-[#E04234] hover:bg-[#C73024] text-white font-bold text-xs cursor-pointer shadow-lg flex items-center gap-1.5 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Take Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseCamera(false)}
                    className="h-10 px-3.5 rounded-full bg-black/60 backdrop-blur-md text-white font-medium text-xs cursor-pointer border border-white/20 hover:bg-black/80 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : photo ? (
              /* Mode 2: Captured/Uploaded Photo */
              <>
                <img src={photo} alt="Face Scan" className="absolute inset-0 w-full h-full object-cover" />
                {/* Chartreuse laser scan line animation */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4FF3F] to-transparent shadow-[0_0_12px_#D4FF3F] animate-laser pointer-events-none z-10" />

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#E04234] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#F8D2CE] shadow-sm cursor-pointer z-30 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Change
                </motion.button>
              </>
            ) : (
              /* Mode 3: Placeholder ready for photo/camera */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-white/40 transition-colors"
              >
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-white border border-[#EBE5DC] text-[#141416] flex items-center justify-center mb-3 shadow-xs">
                  <Camera className="w-6 sm:w-7 h-6 sm:h-7 stroke-[1.6] text-[#E04234]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#141416] block mb-1">
                  Ready for Face Scan
                </span>
                <span className="text-[11px] text-[#71717A]">
                  Upload a photo or activate live camera
                </span>
              </div>
            )}
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

        {/* Action Controls - Mobile Responsive Stack */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-2.5">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="col-span-2 sm:col-auto h-11 sm:h-12 px-4 border border-[#EBE5DC] bg-[#FAF9F6] text-[#52525B] rounded-full font-semibold hover:border-[#CD92EB] hover:text-[#141416] transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-11 sm:h-12 border border-[#EBE5DC] bg-white text-[#141416] rounded-full font-semibold hover:border-[#CD92EB] hover:bg-[#FAF9F6] transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-2xs"
          >
            <Upload className="w-4 h-4 text-[#71717A]" />
            Upload Photo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setUseCamera(true)}
            className="h-11 sm:h-12 border border-[#EBE5DC] bg-white text-[#141416] rounded-full font-semibold hover:border-[#CD92EB] hover:bg-[#FAF9F6] transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-2xs"
          >
            <Camera className="w-4 h-4 text-[#71717A]" />
            Live Camera
          </motion.button>

          <motion.button
            whileHover={photo ? { scale: 1.015, y: -1 } : {}}
            whileTap={photo ? { scale: 0.98 } : {}}
            type="button"
            disabled={!photo}
            onClick={runAnalysis}
            className="col-span-2 sm:col-auto sm:flex-[1.4] h-11 sm:h-12 bg-[#E04234] hover:bg-[#C73024] text-white rounded-full font-bold cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed text-xs sm:text-sm shadow-[0_8px_20px_-4px_rgba(224,66,52,0.32)] hover:shadow-[0_12px_24px_-4px_rgba(224,66,52,0.45)] flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Analyze My Skin
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
