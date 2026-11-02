import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  Sun,
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
import { clearFaceImagesIdb } from "../../utils/quizImageStore";

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
    setFailedKeys([]);
  };

  const runAnalysis = async () => {
    if (!photo) {
      setError("Please upload one clear, front-facing photo of your face.");
      return;
    }
    setIsAnalyzing(true);
    setLoading?.(true);

    const timeoutId = setTimeout(() => {
      setError("Analysis is taking longer than expected. Please try again.");
      setIsAnalyzing(false);
      setLoading?.(false);
    }, 180000);

    try {
      const dataUrl = await compressImage(await ensureDataUrl(photo), 1280, 0.88);
      const aiResponse = await analyzeSkin({
        aboutMe: state.aboutMe,
        skinProfile: state.skinProfile,
        lifestyle: state.lifestyle,
        images: [{ type: "front", label: "Face", dataUrl }],
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
        setError(err.message);
      } else {
        setError(err.message || "AI analysis failed. Please try again.");
      }
    }
  };

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md md:max-w-xl mx-auto mt-6 px-4"
      >
        <div className="atelier-card rounded-[32px] p-8 sm:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
          {/* Subtle warm ambient radar glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <div className="w-80 h-80 rounded-full border border-[#9E3A26]/30 animate-ping" />
            <div className="w-56 h-56 rounded-full border border-[#9E3A26]/40 animate-pulse" />
          </div>

          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-[#E8E3DA]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#9E3A26] border-r-[#9E3A26]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-bold text-[#18181B]">{progressPercent}%</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#71717A]">Analyzing</span>
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
            AI Skin Topography Audit
          </h3>

          <p className="text-[11px] font-mono font-semibold text-[#9E3A26] mt-2 uppercase tracking-wider">
            Biometric Scan in Progress
          </p>

          {/* Progress gauge bar */}
          <div className="h-1.5 bg-[#E8E3DA] rounded-full w-full overflow-hidden my-5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#9E3A26] to-[#C46853] rounded-full"
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
                {SCAN_STAGES[stageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-7 pt-4 border-t border-[#F0EBE1] flex items-center justify-center gap-2 text-[11px] text-[#71717A]">
            <Shield className="w-3.5 h-3.5 text-[#2D5A43]" />
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
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto mt-2 px-3 sm:px-6 pb-12"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-6 pb-5 border-b border-[#F0EBE1] text-left">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-1 rounded-full mb-3 shadow-2xs">
            <ScanLine className="w-3.5 h-3.5 text-[#9E3A26]" />
            Biometric Mapping
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#18181B] tracking-tight leading-tight">
            Front-Facing Facial Topography
          </h2>
          <p className="text-[#71717A] text-xs sm:text-sm mt-2 leading-relaxed max-w-xl">
            Please remove glasses, face even natural lighting, and maintain a neutral expression so the AI can accurately evaluate your epidermal surface.
          </p>
        </div>

        {/* Quality tips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {PHOTO_TIPS.map((tip) => {
            const failed = failedKeys.includes(tip.key);
            return (
              <div
                key={tip.label}
                className={`rounded-xl px-2.5 py-2 text-center border transition-all ${
                  failed
                    ? "bg-[#FDF2F2] border-[#F8D7D7] text-[#9E2A2B]"
                    : "bg-[#FAF8F5] border-[#E8E3DA] text-[#52525B]"
                }`}
              >
                <p className="text-[11px] font-medium flex items-center justify-center gap-1.5">
                  {failed ? (
                    <AlertCircle className="w-3 h-3 text-[#9E2A2B]" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-[#2D5A43]" />
                  )}
                  <span>{tip.label}</span>
                </p>
              </div>
            );
          })}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-[#FDF2F2] border border-[#F8D7D7] text-[#9E2A2B] text-xs font-medium rounded-2xl mb-5 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-[#9E2A2B] shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Biometric Viewfinder */}
        <div className="rounded-3xl border border-[#E8E3DA] bg-[#FAF8F5] p-2.5 sm:p-3 mb-6 max-w-sm mx-auto shadow-inner relative">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#F2ECE3] border border-[#E8E3DA]">
            {/* Viewfinder corner HUD marks */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#18181B] z-20 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#18181B] z-20 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#18181B] z-20 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#18181B] z-20 pointer-events-none" />

            {/* Mode 1: Live Camera View */}
            {useCamera ? (
              <div className="absolute inset-0 bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" />
                {/* Laser scan line animation */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#9E3A26] to-transparent shadow-[0_0_12px_#9E3A26] animate-laser pointer-events-none z-10" />

                {/* In-viewfinder capture controls */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-2.5 z-30 px-3">
                  <button
                    type="button"
                    onClick={captureFromCamera}
                    className="h-11 px-6 rounded-full bg-white text-[#18181B] font-bold text-xs cursor-pointer shadow-lg hover:bg-[#FAF8F5] flex items-center gap-1.5 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#9E3A26]" />
                    Take Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseCamera(false)}
                    className="h-11 px-4 rounded-full bg-black/60 backdrop-blur-md text-white font-medium text-xs cursor-pointer border border-white/20 hover:bg-black/80 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : photo ? (
              /* Mode 2: Captured/Uploaded Photo */
              <>
                <img src={photo} alt="Face Scan" className="absolute inset-0 w-full h-full object-cover" />
                {/* Laser scan line animation */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#9E3A26] to-transparent shadow-[0_0_12px_#9E3A26] animate-laser pointer-events-none z-10" />

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#9E2A2B] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#F8D7D7] shadow-sm cursor-pointer z-30 flex items-center gap-1"
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
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E3DA] text-[#18181B] flex items-center justify-center mb-3 shadow-xs">
                  <Camera className="w-7 h-7 stroke-[1.6] text-[#9E3A26]" />
                </div>
                <span className="text-sm font-bold text-[#18181B] block mb-1">
                  Ready for Face Scan
                </span>
                <span className="text-xs text-[#71717A]">
                  Upload a photo or activate live camera
                </span>
              </div>
            )}
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="h-12 px-4 border border-[#E8E3DA] bg-[#FAF8F5] text-[#52525B] rounded-full font-semibold hover:bg-[#F2ECE3] transition-colors cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 h-12 border border-[#E8E3DA] bg-white text-[#18181B] rounded-full font-semibold hover:border-[#D5CFC3] hover:bg-[#FAF8F5] transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs"
          >
            <Upload className="w-4 h-4 text-[#71717A]" />
            Upload Photo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setUseCamera(true)}
            className="flex-1 h-12 border border-[#E8E3DA] bg-white text-[#18181B] rounded-full font-semibold hover:border-[#D5CFC3] hover:bg-[#FAF8F5] transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs"
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
            className="flex-[1.3] h-12 bg-[#9E3A26] hover:bg-[#832C1B] text-white rounded-full font-bold cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed text-xs sm:text-sm shadow-[0_8px_20px_-4px_rgba(158,58,38,0.25)] hover:shadow-[0_12px_24px_-4px_rgba(158,58,38,0.32)] flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Analyze My Skin
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
