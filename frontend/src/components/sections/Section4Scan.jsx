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
  { label: "Natural front light", key: "insufficientLight" },
  { label: "No makeup or filters", key: "filtersApplied" },
  { label: "Hair tucked back", key: "hair" },
];

const SCAN_STAGES = [
  "Facial landmark & symmetry alignment...",
  "Scanning Whiteheads, Inflammatory Acne, and Visible Pores...",
  "Auditing Pigmentation, Freckles, Postacne Spots, and Redness...",
  "Profiling Wrinkles, Scars, Moles, and Nevi...",
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md md:max-w-xl mx-auto mt-8 px-4"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 sm:p-10 border border-[#EADBFA] shadow-[0_20px_50px_-15px_rgba(19,43,69,0.10)] text-center relative overflow-hidden">
          {/* Animated radar rings in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-72 h-72 rounded-full border border-[#7A35A3] animate-ping" />
            <div className="w-48 h-48 rounded-full border border-[#7A35A3] animate-pulse" />
          </div>

          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[#F4E8FC]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#132B45] border-r-[#132B45]"
            />
            <div className="absolute inset-0 flex items-center justify-center text-[#4A1766]">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            AI Skin Telemetry
          </h3>

          <p className="text-xs sm:text-sm font-semibold text-[#4A1766] mt-2 uppercase tracking-wider">
            {progressPercent}% Analyzed
          </p>

          {/* Progress gauge bar */}
          <div className="h-2 bg-[#F4E8FC] rounded-full w-full overflow-hidden my-4">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E34234] to-[#C72F22] rounded-full"
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
                className="text-xs sm:text-sm text-gray-600 font-medium px-2"
              >
                {SCAN_STAGES[stageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero raw photos retained on servers</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto mt-4 px-4 sm:px-6 pb-14"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-9 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] relative overflow-hidden">
        {/* Header */}
        <div className="mb-6 pb-5 border-b border-gray-100/80 text-left">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-[#4A1766] uppercase bg-[#F4E8FC]/90 border border-[#7A35A3]/10 px-3.5 py-1 rounded-full mb-3 shadow-xs">
            <ScanLine className="w-3.5 h-3.5" />
            Biometric Photo Scan
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-serif tracking-tight">
            Front-Facing Face Scan
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xl">
            Please remove eyeglasses, face even natural light, and keep a neutral expression so the AI can accurately assess your raw skin surface.
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
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-[#F4F7FA] border-[#EADBFA] text-gray-700"
                }`}
              >
                <p className="text-[11px] font-semibold flex items-center justify-center gap-1">
                  {failed ? (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
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
            className="p-3.5 bg-red-50/90 border border-red-200/90 text-red-800 text-xs font-medium rounded-2xl mb-5 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Biometric Viewfinder */}
        <div className="rounded-3xl border border-[#EADBFA] bg-gradient-to-b from-white to-[#F4F7FA] p-3 mb-6 max-w-sm mx-auto shadow-inner relative">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#F4F7FA] border border-[#EADBFA]">
            {/* Viewfinder corner HUD marks */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#7A35A3] z-20 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#7A35A3] z-20 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#7A35A3] z-20 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#7A35A3] z-20 pointer-events-none" />

            {/* Mode 1: Live Camera View */}
            {useCamera ? (
              <div className="absolute inset-0 bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" />
                {/* Laser scan line animation */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#132B45] to-transparent shadow-[0_0_12px_#132B45] animate-laser pointer-events-none z-10" />

                {/* In-viewfinder capture controls */}
                <div className="absolute bottom-3.5 inset-x-0 flex justify-center items-center gap-2.5 z-30 px-3">
                  <button
                    type="button"
                    onClick={captureFromCamera}
                    className="h-11 px-5 rounded-full bg-white text-[#4A1766] font-bold text-xs cursor-pointer shadow-lg hover:bg-[#F4F7FA] flex items-center gap-1.5 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
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
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#132B45] to-transparent shadow-[0_0_12px_#132B45] animate-laser pointer-events-none z-10" />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-100 shadow-md cursor-pointer z-30 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Change
                </motion.button>
              </>
            ) : (
              /* Mode 3: Placeholder ready for photo/camera */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-[#7A35A3]/[0.02] transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#F4E8FC] text-[#4A1766] flex items-center justify-center mb-3 shadow-xs">
                  <Camera className="w-8 h-8 stroke-[1.8]" />
                </div>
                <span className="text-sm font-bold text-gray-800 block mb-1">
                  Ready for Face Scan
                </span>
                <span className="text-xs text-gray-500">
                  Upload a photo or use live camera below
                </span>
              </div>
            )}
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="h-13 px-4 border border-gray-200/90 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition-colors cursor-pointer text-sm flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 h-13 border border-[#7A35A3]/20 bg-white text-[#4A1766] rounded-full font-semibold hover:bg-[#C883EB]/15 transition-colors cursor-pointer text-sm flex items-center justify-center gap-2 shadow-xs"
          >
            <Upload className="w-4 h-4" />
            Upload Photo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setUseCamera(true)}
            className="flex-1 h-13 border border-[#7A35A3]/20 bg-white text-[#4A1766] rounded-full font-semibold hover:bg-[#C883EB]/15 transition-colors cursor-pointer text-sm flex items-center justify-center gap-2 shadow-xs"
          >
            <Camera className="w-4 h-4" />
            Live Camera
          </motion.button>

          <motion.button
            whileHover={photo ? { scale: 1.02 } : {}}
            whileTap={photo ? { scale: 0.98 } : {}}
            type="button"
            disabled={!photo}
            onClick={runAnalysis}
            className="flex-[1.4] h-13 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm shadow-md shadow-[#E34234]/20 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Analyze My Skin
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
