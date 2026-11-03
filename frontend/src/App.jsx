import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";
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

  const loadReport = async (reportId) => {
    setReportBoot({ status: "loading", reportId });
    try {
      const data = await fetchAssessmentReport(reportId);
      hydrateFromReport?.(data);
      setReportBoot({ status: "ready", reportId: data.reportId });
    } catch (err) {
      const is404 = err?.status === 404;
      const msg = is404
        ? "We couldn't find an analysis report with this ID. It may have expired or the link is incorrect."
        : "The assessment server is temporarily unavailable or experiencing network interruptions.";
      setReportBoot({
        status: "error",
        reportId,
        is404,
        message: msg,
      });
    }
  };

  useEffect(() => {
    if (reportBoot.status === "loading" && reportBoot.reportId) {
      loadReport(reportBoot.reportId);
    }
  }, []);

  let content;
  if (reportBoot.status === "loading") {
    content = (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white/95 backdrop-blur-md rounded-[28px] border border-[#EBE5DC] max-w-md mx-auto my-12 text-center shadow-xs">
        <div className="w-10 h-10 rounded-full border-2 border-t-[#E04234] border-[#CD92EB]/30 animate-spin mb-4" />
        <h3 className="text-lg font-bold font-serif text-[#141416]">Retrieving Skin Analysis</h3>
        <p className="text-xs text-[#71717A] mt-2 font-mono">Loading dossier {reportBoot.reportId}…</p>
      </div>
    );
  } else if (reportBoot.status === "error") {
    content = (
      <div className="flex flex-col items-center justify-center p-8 sm:p-10 bg-white/95 backdrop-blur-md rounded-[28px] border border-[#EBE5DC] max-w-md mx-auto my-12 text-center shadow-xs">
        <AlertCircle className="w-10 h-10 text-[#E04234] mb-3" />
        <h3 className="text-lg font-bold text-[#141416] font-serif">
          {reportBoot.is404 ? "Report Not Found" : "Server Unavailable"}
        </h3>
        <p className="text-xs text-[#71717A] mt-2 max-w-xs leading-relaxed">{reportBoot.message}</p>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5 w-full justify-center">
          {!reportBoot.is404 && (
            <button
              type="button"
              className="px-5 py-2.5 rounded-full bg-[#E04234] hover:bg-[#C73024] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
              onClick={() => loadReport(reportBoot.reportId)}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          )}
          <button
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#FAF9F6] border border-[#EBE5DC] hover:border-[#CD92EB] text-[#141416] text-xs font-bold cursor-pointer transition-colors"
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
      <div className="min-h-[100dvh] w-full bg-[#FAF9F6] text-[#141416] px-3 sm:px-6 md:px-8 pb-12 antialiased flex flex-col justify-center items-center relative overflow-hidden">
        {/* Soft Lavender and Chartreuse ambient blooms */}
        <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-br from-[#CD92EB]/20 via-[#CD92EB]/5 to-transparent pointer-events-none blur-3xl animate-ambient -z-10" />
        <div className="fixed bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[550px] max-h-[550px] rounded-full bg-gradient-to-tl from-[#D4FF3F]/15 via-[#CD92EB]/10 to-transparent pointer-events-none blur-3xl animate-ambient -z-10" />
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl my-auto relative z-10 pt-2 sm:pt-4">
          <Screen16Analyzing onComplete={() => setShowSplash(false)} />
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.max(5, (step / 19) * 100));

  return (
    <div className="min-h-[100dvh] w-full bg-[#FAF9F6] text-[#141416] px-3 sm:px-4 md:px-8 pb-16 sm:pb-20 antialiased relative overflow-x-hidden flex flex-col">
      {/* Soft natural ambient background with brand Lavender & Chartreuse luminescence */}
      <div className="fixed top-[-15%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-[#CD92EB]/18 via-[#CD92EB]/5 to-transparent pointer-events-none blur-3xl animate-ambient -z-10" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-tl from-[#D4FF3F]/12 via-[#CD92EB]/8 to-transparent pointer-events-none blur-3xl animate-ambient -z-10" />

      {/* Haute-Cosmetique Header */}
      <header className="w-full max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto flex items-center justify-between py-3.5 sm:py-4 border-b border-[#EBE5DC] mb-3 relative z-20 px-1 sm:px-4">
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => {
            goToStep(1);
            setShowSplash(true);
          }}
          title="Click to replay introductory scan"
        >
          <div className="w-8 h-8 rounded-lg bg-[#141416] flex items-center justify-center text-[#FAF9F6] text-xs font-serif font-bold shadow-xs group-hover:bg-[#E04234] transition-colors">
            M
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#141416] font-serif">MILC</span>
            <span className="text-[9px] tracking-[0.22em] uppercase text-[#71717A] font-mono ml-2 font-semibold hidden sm:inline">
              AI
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {step > 1 && step < 19 && (
            <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-[#52525B] bg-white border border-[#EBE5DC] px-2.5 py-1 rounded-full shadow-2xs">
              STEP <span className="text-[#E04234]">{String(step).padStart(2, "0")}</span> <span className="text-[#AFA698]">/</span> 19
            </span>
          )}
        </div>
      </header>

      {/* Fluid Linear Stepper Progress Bar */}
      {step > 1 && step < 19 && (
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto mb-4 px-1 sm:px-4 relative z-20">
          <div className="h-[2.5px] bg-[#EBE5DC] rounded-full w-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#CD92EB] via-[#E04234] to-[#D4FF3F] rounded-full"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      )}

      {/* Screen Content Container with Smooth Eased Animation */}
      <main className="mx-auto flex justify-center items-start max-w-5xl w-full relative z-10 flex-1">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
