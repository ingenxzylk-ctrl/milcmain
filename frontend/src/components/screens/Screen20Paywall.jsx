import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Tag,
  Star,
} from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { PRICING_PLANS } from "../../data/questions";
import { MILC_CATALOG } from "../../data/products";

export default function Screen20Paywall({ onRestart }) {
  const { state, setSelectedPlan } = useQuiz();
  const [selected, setSelected] = useState(state?.selectedPlan || "1_month");
  const [timeLeft, setTimeLeft] = useState(39 * 60 + 23); // 39:23

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const name = state?.aboutMe?.fullName || "Client";
  const expertHref = `https://wa.me/?text=${encodeURIComponent(
    `Hi MILC, I just completed my 20-step skin diagnostic assessment and would like to claim my 50% introductory protocol discount.`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-2 sm:px-6 pb-12 pt-1 sm:pt-2"
    >
      {/* Urgency Ribbon Header */}
      <div className="bg-[#141416] text-white py-2 px-4 rounded-2xl mb-3 sm:mb-4 text-center flex items-center justify-center gap-2 shadow-xs max-w-md mx-auto">
        <Clock className="w-3.5 h-3.5 animate-pulse text-[#CD92EB]" />
        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wide">
          Introductory offer expires in {formatTimer(timeLeft)}
        </span>
      </div>

      <div className="atelier-card rounded-[24px] sm:rounded-[36px] p-5 sm:p-8 md:p-10 text-center relative overflow-hidden bg-white/95 backdrop-blur-sm">
        {/* Soft Lavender ambient bloom */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-br from-[#CD92EB]/18 via-[#CD92EB]/5 to-transparent pointer-events-none blur-3xl" />

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141416] leading-tight">
          Get Started with Special Pricing
        </h2>

        {/* Voucher Tag Pill */}
        <div className="my-4 p-3 rounded-2xl bg-[#FAF9F6] border border-[#EBE5DC] flex items-center justify-between max-w-md mx-auto shadow-2xs">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#141416]" />
            <span className="font-mono text-xs font-bold text-[#141416] tracking-wider">
              {name.toUpperCase().replace(/\s/g, "")}2026
            </span>
          </div>
          <span className="badge-chartreuse text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
            50% off
          </span>
        </div>

        {/* Pricing Tier Selection Cards - 3 columns on tablet and desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 my-6 text-left">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelected(plan.id);
                  setSelectedPlan(plan.id);
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "border-2 border-[#CD92EB] bg-white ring-2 ring-[#CD92EB]/30 shadow-[0_8px_24px_-6px_rgba(205,146,235,0.25)]"
                    : "border-[#EBE5DC] bg-[#FAF9F6] hover:border-[#CD92EB]/60 hover:bg-white shadow-2xs"
                }`}
              >
                <div>
                  {/* Badge if popular / discount */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        plan.popular
                          ? "bg-[#E04234] text-white"
                          : "bg-[#EBE5DC] text-[#52525B]"
                      }`}
                    >
                      {plan.badge}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-[#CD92EB] bg-[#CD92EB]" : "border-[#D8D0C3]"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] shadow-[0_0_4px_#D4FF3F]" />}
                    </div>
                  </div>

                  <h4 className="font-bold text-[#141416] text-sm sm:text-base">{plan.title}</h4>
                  <p className="text-xs text-[#71717A] mt-0.5 line-through">
                    {plan.originalPrice} → <span className="font-bold text-[#141416] no-underline">{plan.discountedPrice}</span>
                  </p>
                </div>

                <div className="text-right mt-4 pt-3 border-t border-[#EBE5DC] flex items-baseline justify-between">
                  <span className="text-[10px] text-[#71717A] uppercase font-semibold font-mono">Billed</span>
                  <div>
                    <span className="font-serif text-2xl font-bold text-[#141416] leading-none">
                      {plan.dailyRate}
                    </span>
                    <span className="text-[10px] text-[#71717A] ml-1 font-mono">/ day</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* What's Included */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#EBE5DC] text-left text-xs sm:text-sm space-y-2 mb-6 max-w-2xl mx-auto shadow-2xs">
          <p className="font-mono font-bold text-[#141416] uppercase tracking-wider text-[10px] sm:text-xs">
            Your Program Includes:
          </p>
          <div className="flex items-center gap-2.5 text-[#52525B]">
            <div className="w-4 h-4 rounded-full bg-[#D4FF3F] text-[#141416] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.8]" />
            </div>
            <span>4 full-sized tailored MILC clinical active products</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#52525B]">
            <div className="w-4 h-4 rounded-full bg-[#D4FF3F] text-[#141416] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.8]" />
            </div>
            <span>Weekly AI Skin Telemetry scans to track pore & glow progress</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#52525B]">
            <div className="w-4 h-4 rounded-full bg-[#D4FF3F] text-[#141416] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.8]" />
            </div>
            <span>Direct WhatsApp dermatologist consultation & routine adjustments</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current text-[#D4FF3F]" />
          ))}
          <span className="text-xs sm:text-sm font-semibold text-[#52525B] ml-1.5 font-mono">
            4.9/5 from 23,000+ users
          </span>
        </div>

        {/* Checkout / WhatsApp CTA */}
        <div className="max-w-md mx-auto">
          <a
            href={expertHref}
            target="_blank"
            rel="noreferrer"
            className="w-full h-12 sm:h-13 bg-[#E04234] hover:bg-[#C73024] text-white rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-[0_8px_20px_-4px_rgba(224,66,52,0.32)] hover:shadow-[0_12px_24px_-4px_rgba(224,66,52,0.45)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Claim Plan & Order via WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onRestart}
            className="mt-4 text-xs text-[#71717A] hover:text-[#141416] underline cursor-pointer transition-colors block mx-auto font-mono"
          >
            Start a new assessment
          </button>
        </div>
      </div>
    </motion.div>
  );
}
