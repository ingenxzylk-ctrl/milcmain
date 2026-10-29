import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shield, AlertCircle, RefreshCw } from "lucide-react";
import { QuizProvider, useQuiz } from "./context/QuizContext";

import Screen01Welcome from "./components/screens/Screen01Welcome";
import Screen02Gender from "./components/screens/Screen02Gender";
import Screen03Age from "./components/screens/Screen03Age";
import Screen04Concerns from "./components/screens/Screen04Concerns";
import Screen05SkinType from "./components/screens/Screen05SkinType";
import Screen06SocialProof from "./components/screens/Screen06SocialProof";
import Screen07Fit47 from "./components/screens/Screen07Fit47";
import Screen08Climate from "./components/screens/Screen08Climate";
import Screen10Sensitivity from "./components/screens/Screen10Sensitivity";
import Screen11Sleep from "./components/screens/Screen11Sleep";
import Screen12Water from "./components/screens/Screen12Water";
import Screen13Stress from "./components/screens/Screen13Stress";
import Screen14RoutineTime from "./components/screens/Screen14RoutineTime";
import Screen15Milestone93 from "./components/screens/Screen15Milestone93";
import Screen16Analyzing from "./components/screens/Screen16Analyzing";
import Section4Scan from "./components/sections/Section4Scan";
import Screen17Projection from "./components/screens/Screen17Projection";
import Screen18ScratchCard from "./components/screens/Screen18ScratchCard";
import Screen19Signature from "./components/screens/Screen19Signature";
import Screen20Paywall from "./components/screens/Screen20Paywall";
import Result from "./components/Result";
import { fetchAssessmentReport } from "./api/quizApi";

function QuizFlow() {
  const { state, nextStep, prevStep, goToStep, hydrateFromReport, setError, resetQuiz } = useQuiz();
  const { step, isLoading } = state;
  const [showSplash, setShowSplash] = useState(true);

  const [reportBoot, setReportBoot] = useState(() => {
    if (typeof window === "undefined") return { status: "idle" };
    const id = new URLSearchParams(window.location.search).get("report");
    return id ? { status: "loading", reportId: id } : { status: "idle" };
  });

  useEffect(() => {
    if (reportBoot.status !== "loading" || !reportBoot.reportId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAssessmentReport(reportBoot.reportId);
        if (cancelled) return;
        hydrateFromReport?.(data);
        setReportBoot({ status: "ready", reportId: data.reportId });
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Could not open this report.");
        setReportBoot({
          status: "error",
          reportId: reportBoot.reportId,
          message: err?.message || "Report not found.",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reportBoot.status, reportBoot.reportId]);

  let content;
  if (reportBoot.status === "loading") {
    content = (
      <div className="flex flex-col items-center justify-center p-12 bg-white/95 backdrop-blur-md rounded-3xl border border-[#EADBFA] max-w-md mx-auto my-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full border-4 border-t-[#132B45] border-[#F4E8FC] animate-spin mb-4" />
        <h3 className="text-lg font-bold font-serif text-gray-900">Retrieving Your Skin Profile</h3>
        <p className="text-xs text-gray-400 mt-2">Loading report {reportBoot.reportId}…</p>
      </div>
    );
  } else if (reportBoot.status === "error") {
    content = (
      <div className="flex flex-col items-center justify-center p-10 bg-white/95 backdrop-blur-md rounded-3xl border border-[#EADBFA] max-w-md mx-auto my-12 text-center shadow-sm">
        <AlertCircle className="w-10 h-10 text-[#4A1766] mb-3" />
        <h3 className="text-lg font-bold text-gray-900 font-serif">Report Unavailable</h3>
        <p className="text-xs text-gray-500 mt-2">{reportBoot.message}</p>
        <button
          type="button"
          className="mt-6 px-6 py-2.5 rounded-full bg-[#7A35A3] hover:bg-[#204060] text-white text-xs font-bold cursor-pointer transition-colors"
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete("report");
            window.history.replaceState({}, "", url);
            setReportBoot({ status: "idle" });
            resetQuiz();
            setShowSplash(true);
          }}
        >
          Start a new assessment
        </button>
      </div>
    );
  } else if (reportBoot.status === "ready") {
    content = <Result />;
  } else {
    // 19-Screen Master Flow Controller
    switch (step) {
      case 1:
        content = (
          <Screen01Welcome
            onComplete={nextStep}
            onReplayIntro={() => setShowSplash(true)}
            onPreviewAnalyzing={() => goToStep(15)}
          />
        );
        break;
      case 2:
        content = <Section4Scan onComplete={nextStep} onBack={prevStep} />;
        break;
      case 3:
        content = <Screen02Gender onComplete={nextStep} onBack={prevStep} />;
        break;
      case 4:
        content = <Screen03Age onComplete={nextStep} onBack={prevStep} />;
        break;
      case 5:
        content = <Screen04Concerns onComplete={nextStep} onBack={prevStep} />;
        break;
      case 6:
        content = <Screen05SkinType onComplete={nextStep} onBack={prevStep} />;
        break;
      case 7:
        content = <Screen06SocialProof onComplete={nextStep} onBack={prevStep} />;
        break;
      case 8:
        content = <Screen07Fit47 onComplete={nextStep} onBack={prevStep} />;
        break;
      case 9:
        content = <Screen08Climate onComplete={nextStep} onBack={prevStep} />;
        break;
      case 10:
        content = <Screen10Sensitivity onComplete={nextStep} onBack={prevStep} />;
        break;
      case 11:
        content = <Screen11Sleep onComplete={nextStep} onBack={prevStep} />;
        break;
      case 12:
        content = <Screen12Water onComplete={nextStep} onBack={prevStep} />;
        break;
      case 13:
        content = <Screen13Stress onComplete={nextStep} onBack={prevStep} />;
        break;
      case 14:
        content = <Screen14RoutineTime onComplete={nextStep} onBack={prevStep} />;
        break;
      case 15:
        content = <Screen15Milestone93 onComplete={nextStep} onBack={prevStep} />;
        break;
      case 16:
        content = <Screen17Projection onComplete={nextStep} onBack={prevStep} />;
        break;
      case 17:
        content = <Screen18ScratchCard onComplete={nextStep} onBack={prevStep} />;
        break;
      case 18:
        content = <Screen19Signature onComplete={nextStep} onBack={prevStep} />;
        break;
      case 19:
        content = <Result />;
        break;
      default:
        content = (
          <Screen01Welcome
            onComplete={nextStep}
            onReplayIntro={() => setShowSplash(true)}
          />
        );
    }
  }

  // Screen 1: Analyzing/Processing as first section before Welcome
  if (showSplash && step === 1 && reportBoot.status !== "ready") {
    return (
      <div className="min-h-screen bg-[#FBF7FE] text-[#2D143E] px-4 md:px-8 pb-16 antialiased flex flex-col justify-center items-center relative overflow-hidden">
        {/* Background Floating Ambient Orbs (Cool Slate & Lavender Mist) */}
        <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-[#D8E4F0]/70 to-transparent pointer-events-none blur-3xl animate-float-slow -z-10" />
        <div className="fixed bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#E2D9F3]/50 to-transparent pointer-events-none blur-3xl animate-float-reverse -z-10" />
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl my-auto relative z-10 pt-4">
          <Screen16Analyzing onComplete={() => setShowSplash(false)} />
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.max(5, (step / 19) * 100));

  return (
    <div className="min-h-screen bg-[#FBF7FE] text-[#2D143E] px-4 md:px-8 pb-16 antialiased relative overflow-hidden">
      {/* Background Floating Ambient Orbs (Lavender & Soft Mist) */}
      <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-[#C883EB]/30 to-transparent pointer-events-none blur-3xl animate-float-slow -z-10" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#EFE1FA]/60 to-transparent pointer-events-none blur-3xl animate-float-reverse -z-10" />

      {/* Header */}
      <header className="w-full max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto flex items-center justify-between py-4 border-b border-[#EADBFA] mb-4 relative z-20 px-2 sm:px-4">
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => {
            goToStep(1);
            setShowSplash(true);
          }}
          title="Click to replay analyzing screen"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7A35A3] to-[#C883EB] flex items-center justify-center text-white text-xs font-serif font-bold shadow-xs">
            M
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-[#4A1766] font-serif">MILC</span>
            <span className="text-[9px] tracking-[0.18em] uppercase text-[#8E5AA8] font-semibold ml-1.5">
              Skin Lab
            </span>
          </div>
        </div>

        {/* Step Indicator & Shield */}
        <div className="flex items-center gap-2">
          {step > 1 && step < 19 && (
            <span className="text-[11px] font-bold text-[#1E2700] bg-[#D4FF3F] border border-[#BDE820] px-2.5 py-0.5 rounded-full shadow-2xs">
              Step {step} of 19
            </span>
          )}
          <div className="flex items-center gap-1 text-[11px] text-[#6E4282] bg-white/80 px-2 py-0.5 rounded-full border border-[#EADBFA]">
            <Shield className="w-3 h-3 text-[#7A35A3]" />
            <span className="text-[10px]">Private</span>
          </div>
        </div>
      </header>

      {/* Fluid Linear Stepper Progress Bar */}
      {step > 1 && step < 19 && (
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto mb-4 px-2 sm:px-4 relative z-20">
          <div className="h-1.5 bg-[#EADBFA] rounded-full w-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#7A35A3] via-[#C883EB] to-[#E34234] rounded-full"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Screen Content Container with Smooth Animation */}
      <main className="mx-auto flex justify-center items-start max-w-5xl relative z-10">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-full"
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <QuizFlow />
    </QuizProvider>
  );
}
