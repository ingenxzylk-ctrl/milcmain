import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check, Sparkles, ShieldCheck, MessageCircle, Copy, Award } from "lucide-react";

export default function SkinPassport({
  reportId,
  clientName,
  skinType,
  mainConcern,
  vitalityScore = 82,
  expertHref,
}) {
  const [copied, setCopied] = useState(false);

  const displayName = clientName?.trim() && clientName.trim() !== "Client"
    ? clientName.trim()
    : "Your Skin Profile";

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#2D143E] via-[#4A1766] to-[#7A35A3] text-white rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden border border-[#EADBFA]/30">
      {/* Subtle luxury ambient pattern overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C883EB]/20 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-[#D4FF3F]/10 to-transparent rounded-tr-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-xs font-serif font-bold text-[#D4FF3F] border border-white/20">
              M
            </div>
            <div>
              <span className="font-serif tracking-widest text-sm font-bold text-[#F4E8FC] uppercase">
                MILC SKIN LAB
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-[#C883EB]">
                Personal Skin Profile ID
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4FF3F]" />
            <span className="font-medium text-white/90">Assessment Verified</span>
          </div>
        </div>

        {/* Passport Content Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-white/60">Profile Name</p>
            <p className="text-base font-bold text-white mt-0.5 truncate">{displayName}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-white/60">Skin Type</p>
            <p className="text-base font-bold text-white mt-0.5 capitalize">{skinType || "Normal"}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-white/60">Primary Goal</p>
            <p className="text-base font-bold text-white mt-0.5 capitalize truncate">{mainConcern || "Balance"}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-white/60">Skin Health Score</p>
            <p className="text-base font-bold text-[#D4FF3F] mt-0.5">{vitalityScore} / 100</p>
          </div>
        </div>

        {/* Report ID & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/15">
          <div className="text-center sm:text-left">
            <p className="text-[11px] text-[#EADBFA] font-mono tracking-wider">
              ID: {reportId || "MILC-PROVISIONAL"}
            </p>
            <p className="text-[10px] text-white/50 mt-0.5">
              Formulated for educational skincare matching · Not a medical diagnosis
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleShare}
              className="flex-1 sm:flex-none h-11 px-5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#D4FF3F]" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Share Skin ID</span>
                </>
              )}
            </motion.button>

            <a
              href={expertHref}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none h-11 px-5 rounded-full bg-[#D4FF3F] text-[#1E2700] hover:bg-[#bde820] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask an Advisor</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
