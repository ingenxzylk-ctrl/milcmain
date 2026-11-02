import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Lock, Check } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";

export default function Screen19Signature({ onComplete, onBack }) {
  const { state, setSignature } = useQuiz();
  const [signedName, setSignedName] = useState(state?.signature || state?.aboutMe?.fullName || "Sarah");

  const handleCommit = () => {
    setSignature(signedName);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 pb-12 pt-2"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF8F5] border border-[#E8E3DA] px-3.5 py-1 rounded-full mb-3 shadow-2xs">
          COMMITMENT PLEDGE · STEP 18
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#18181B] leading-tight">
          Your personalized skin protocol is ready
        </h2>

        {/* Blueprint summary box */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-left">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] shadow-2xs">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#A8A193] block">
              PRIMARY TARGET
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#18181B] mt-1">
              Refine texture, soothe pores & restore lipid barrier
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] shadow-2xs">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#A8A193] block">
              RITUAL COMMITMENT
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#18181B] mt-1">
              Morning & Evening ritual · only 2 minutes per day
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] shadow-2xs">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#A8A193] block">
              MILESTONE GOAL
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#9E3A26] mt-1">
              Achieve continuous 7-day epidermal consistency
            </p>
          </div>
        </div>

        {/* Pledge Text */}
        <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed mb-4 max-w-lg mx-auto">
          I, <span className="font-bold text-[#18181B]">{signedName}</span>, pledge to follow my personalized 2-step treatment protocol for the next 7 days for visibly healthier skin.
        </p>

        {/* Digital Signature Canvas Box */}
        <div className="p-4 rounded-2xl border border-dashed border-[#9E3A26]/40 bg-[#FAF8F5] mb-6 relative max-w-md mx-auto shadow-2xs">
          <input
            type="text"
            value={signedName}
            onChange={(e) => setSignedName(e.target.value)}
            placeholder="Type your name to sign"
            className="w-full text-center text-2xl sm:text-3xl font-serif italic text-[#18181B] outline-none bg-transparent"
          />
          <p className="text-[10px] font-mono text-[#71717A] mt-1 uppercase tracking-wider">
            Digital Signature Confirmed
          </p>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex items-center justify-center max-w-md mx-auto pt-5 border-t border-[#F0EBE1]">
          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleCommit}
            className="w-full h-13 bg-[#9E3A26] hover:bg-[#832C1B] text-white rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-[0_8px_20px_-4px_rgba(158,58,38,0.22)] hover:shadow-[0_12px_24px_-4px_rgba(158,58,38,0.3)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Confirm Pledge & Unlock Full Skin Passport</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
