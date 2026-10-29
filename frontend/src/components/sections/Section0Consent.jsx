import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, UserCheck, Sparkles, ArrowRight, FileCheck } from "lucide-react";
import LegalDocumentPage from "./LegalDocumentPage";

const PRIVACY_POINTS = [
  {
    icon: Lock,
    title: "Secure & Encrypted",
    body: "Your answers and photos are encrypted in transit and used only for this assessment.",
  },
  {
    icon: ShieldCheck,
    title: "Photos are not kept",
    body: "After analysis we store only the derived skin-attribute metrics — never raw facial photos.",
  },
  {
    icon: UserCheck,
    title: "You're in total control",
    body: "You can download, share, or request full deletion of your skin report at any time.",
  },
  {
    icon: Sparkles,
    title: "Instant Personalized Regimen",
    body: "Receive clinical cosmetic ratings, AM/PM routine advice, and targeted product pairings.",
  },
];

function LegalLinkButton({ docId, children, onOpen }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpen(docId);
      }}
      className="text-[#4A1766] font-semibold underline underline-offset-2 hover:text-[#0B1E32] cursor-pointer bg-transparent border-0 p-0 inline"
    >
      {children}
    </button>
  );
}

export default function Section0Consent({ onComplete }) {
  const [agreedConsent, setAgreedConsent] = useState(false);
  const [openDocId, setOpenDocId] = useState(null);

  if (openDocId) {
    return <LegalDocumentPage docId={openDocId} onBack={() => setOpenDocId(null)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-xl mx-auto mt-4 px-4 pb-12"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-7 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] relative overflow-hidden">
        {/* Luxury ambient accent light */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#F4E8FC]/80 via-transparent to-transparent rounded-bl-full pointer-events-none" />

        <div className="mb-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-[#4A1766] uppercase bg-[#F4E8FC]/90 border border-[#7A35A3]/15 px-3.5 py-1.5 rounded-full shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Clinical Privacy & Consent
          </span>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className="mt-6 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E34234] to-[#C72F22] flex items-center justify-center text-white shadow-lg shadow-[#E34234]/20"
          >
            <ShieldCheck className="w-8 h-8" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-5 leading-tight font-serif">
            Your Privacy & Data Integrity
          </h2>
          <p className="text-gray-600 mt-2.5 text-sm leading-relaxed max-w-md mx-auto">
            Experience our next-generation AI skin diagnosis. We respect your confidentiality with zero photo retention.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7 relative z-10">
          {PRIVACY_POINTS.map((point, idx) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.05 }}
                className="p-4 rounded-2xl bg-[#F4F7FA]/80 border border-[#EADBFA] hover:border-[#7A35A3]/30 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#4A1766] shadow-xs flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-gray-900 leading-snug">{point.title}</p>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{point.body}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.label
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none mb-6 relative z-10 ${
            agreedConsent
              ? "border-[#7A35A3] bg-[#C883EB]/15 ring-1 ring-[#7A35A3]/20"
              : "border-gray-200/90 bg-white hover:border-gray-300"
          }`}
        >
          <input
            type="checkbox"
            checked={agreedConsent}
            onChange={(e) => setAgreedConsent(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded accent-[#132B45] shrink-0 cursor-pointer"
          />
          <span className="text-xs text-gray-700 leading-relaxed">
            I agree to the{" "}
            <LegalLinkButton docId="terms" onOpen={setOpenDocId}>
              Terms of Service
            </LegalLinkButton>
            ,{" "}
            <LegalLinkButton docId="privacy" onOpen={setOpenDocId}>
              Privacy Policy
            </LegalLinkButton>{" "}
            and consent to AI cosmetic analysis of my uploaded photo. MILC will process my answers to generate a personalized skincare routine report.
          </span>
        </motion.label>

        <div className="relative z-10">
          <motion.button
            whileHover={agreedConsent ? { scale: 1.02 } : {}}
            whileTap={agreedConsent ? { scale: 0.98 } : {}}
            type="button"
            disabled={!agreedConsent}
            onClick={onComplete}
            className="w-full h-14 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-semibold hover:shadow-xl hover:shadow-[#E34234]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none text-base cursor-pointer inline-flex items-center justify-center gap-2.5"
          >
            <span>Begin My AI Face Assessment</span>
            <ArrowRight className="w-5 h-5 stroke-[2.2]" />
          </motion.button>
          <p className="mt-3.5 text-center text-[11px] text-gray-400 flex items-center justify-center gap-2">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Private · Dermatologist-Tuned · Photos Deleted Instantly</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
