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
    <div className="bg-gradient-to-br from-[#141416] via-[#1F1924] to-[#141416] text-[#FAF9F6] rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 shadow-xl relative overflow-hidden border border-[#CD92EB]/30">
      {/* Subtle luxury ambient pattern overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#CD92EB]/20 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-[#D4FF3F]/15 to-transparent rounded-tr-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-serif font-bold text-[#FAF9F6] border border-white/15">
              M
            </div>
            <div>
              <span className="font-serif tracking-widest text-sm font-bold text-[#FAF9F6] uppercase">
                MILC ATELIER
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] font-mono text-[#AFA698]">
                Dermatological Passport
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E2F79A]" />
            <span className="font-medium text-white/90">Clinical Verification</span>
          </div>
        </div>

        {/* Passport Content Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[9px] font-mono uppercase tracking-wider text-white/50">Dossier Name</p>
            <p className="text-sm sm:text-base font-bold text-white mt-1 truncate">{displayName}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[9px] font-mono uppercase tracking-wider text-white/50">Lipid Profile</p>
            <p className="text-sm sm:text-base font-bold text-white mt-1 capitalize">{skinType || "Normal"}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[9px] font-mono uppercase tracking-wider text-white/50">Primary Target</p>
            <p className="text-sm sm:text-base font-bold text-white mt-1 capitalize truncate">{mainConcern || "Balance"}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[9px] font-mono uppercase tracking-wider text-white/50">Vitality Index</p>
            <p className="text-sm sm:text-base font-bold text-[#D4FF3F] mt-1 font-mono">{vitalityScore} / 100</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <span className="text-[10px] font-mono text-white/50">
            Report Token: <span className="text-white/80 font-bold">{reportId || "MILC-LIVE-2026"}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#E2F79A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Copied" : "Share Dossier"}</span>
            </button>
            {expertHref && (
              <a
                href={expertHref}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-[#E04234] hover:bg-[#C73024] text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Consult Specialist</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
