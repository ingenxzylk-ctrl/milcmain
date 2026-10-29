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
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-2"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] text-center relative overflow-hidden">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Your Personalized Skin Plan is <span className="text-[#4A1766]">Ready</span>
        </h2>

        {/* Blueprint summary box - 3 columns on tablet/desktop */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-left">
          <div className="p-4 rounded-2xl bg-[#F4F7FA] border border-[#EADBFA] shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              PRIMARY GOAL
            </span>
            <p className="text-xs sm:text-sm font-bold text-gray-900 mt-1">
              Clear pores, refine texture & reinforce barrier
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F7FA] border border-[#EADBFA] shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              DAILY TIME COMMITMENT
            </span>
            <p className="text-xs sm:text-sm font-bold text-gray-900 mt-1">
              Morning & Evening ritual · only 2 mins / day
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F7FA] border border-[#EADBFA] shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              FIRST MILESTONE
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#4A1766] mt-1">
              Build an unbroken 7-day consistency streak
            </p>
          </div>
        </div>

        {/* Pledge Text */}
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4 max-w-lg mx-auto">
          I, <span className="font-bold text-[#4A1766]">{signedName}</span>, commit to my prescribed skincare routine for the next 7 days for healthier, radiant skin.
        </p>

        {/* Digital Signature Canvas Box */}
        <div className="p-4 rounded-2xl border border-dashed border-[#7A35A3]/30 bg-white mb-6 relative max-w-md mx-auto shadow-2xs">
          <input
            type="text"
            value={signedName}
            onChange={(e) => setSignedName(e.target.value)}
            placeholder="Type your name to sign"
            className="w-full text-center text-2xl sm:text-3xl font-serif italic text-[#4A1766] outline-none bg-transparent"
            style={{ fontFamily: "'Cormorant Garamond', cursive" }}
          />
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
            Digital Signature Verified
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleCommit}
            className="w-full h-14 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-sm cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 flex items-center justify-center gap-2"
          >
            <span>Commit & Begin</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <p className="text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>By continuing, you're starting your personalized skincare journey.</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
