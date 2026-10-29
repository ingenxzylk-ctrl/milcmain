import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check, Sparkles, ShieldCheck, MessageCircle, Copy } from "lucide-react";

export default function SkinPassport({
  reportId,
  clientName,
  skinType,
  mainConcern,
  vitalityScore = 82,
  expertHref,
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0B1E32] to-[#132B45] text-white rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Subtle luxury ambient pattern overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#204060]/25 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-[#132B45]/40 to-transparent rounded-tr-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-serif font-bold text-white border border-white/20">
              M
            </div>
            <div>
              <span className="font-serif tracking-widest text-sm font-bold text-[#F4E8FC] uppercase">
                MILC SKIN LAB
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-white/50">
                Official Clinical Skin ID
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-white/90">Verified Telemetry</span>
          </div>
        </div>

        {/* Passport Content Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Subject</p>
            <p className="text-base font-bold text-[#F4E8FC] mt-0.5 truncate">{clientName || "Client"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Skin Baseline</p>
            <p className="text-base font-bold text-[#F4E8FC] mt-0.5 capitalize">{skinType || "Normal"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Primary Target</p>
            <p className="text-base font-bold text-[#F4E8FC] mt-0.5 capitalize truncate">{mainConcern || "Balance"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Radiance Index</p>
            <p className="text-base font-bold text-emerald-400 mt-0.5">{vitalityScore} / 100</p>
          </div>
        </div>

        {/* Report ID & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/15">
          <div className="text-center sm:text-left">
            <p className="text-[11px] text-white/60 font-mono tracking-wider">
              ID: {reportId || "MILC-PROVISIONAL"}
            </p>
            <p className="text-[10px] text-white/40 mt-0.5">
              Derived from multi-factor cosmetic vision metrics
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleShare}
              className="flex-1 sm:flex-none h-11 px-4 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Share Report</span>
                </>
              )}
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={expertHref}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none h-11 px-4 rounded-full bg-[#F4E8FC] hover:bg-white text-[#0B1E32] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#4A1766]" />
              <span>Derm Consult</span>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
}
