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
      className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 pb-16 pt-2"
    >
      {/* Urgency Ribbon Header - Midnight Navy */}
      <div className="bg-[#4A1766] text-white py-2 px-4 rounded-2xl mb-4 text-center flex items-center justify-center gap-2 shadow-sm max-w-md mx-auto">
        <Clock className="w-3.5 h-3.5 animate-pulse text-[#8E7CC3]" />
        <span className="text-xs font-bold tracking-wide">
          Introductory offer expires in {formatTimer(timeLeft)}
        </span>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] text-center relative overflow-hidden">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Get Started with Special Pricing
        </h2>

        {/* Voucher Tag Pill */}
        <div className="my-4 p-3 rounded-2xl bg-gradient-to-r from-[#F4F7FA] to-[#F4E8FC] border border-[#EADBFA] flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#4A1766]" />
            <span className="font-mono text-xs font-bold text-gray-900 tracking-wider">
              {name.toUpperCase().replace(/\s/g, "")}2026
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
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
                    ? "border-2 border-[#7A35A3] bg-white ring-2 ring-[#7A35A3]/15 shadow-sm"
                    : "border-gray-200/90 bg-[#F4F7FA]/70 hover:bg-white shadow-2xs"
                }`}
              >
                <div>
                  {/* Badge if popular / discount */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        plan.popular
                          ? "bg-[#7A35A3] text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {plan.badge}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-[#7A35A3] bg-[#7A35A3] text-white" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">{plan.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5 line-through">
                    {plan.originalPrice} → <span className="font-bold text-gray-700 no-underline">{plan.discountedPrice}</span>
                  </p>
                </div>

                <div className="text-right mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Billed</span>
                  <div>
                    <span className="font-serif text-2xl font-bold text-gray-900 leading-none">
                      {plan.dailyRate}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-1">/ day</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* What's Included */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F7FA] border border-[#EADBFA] text-left text-xs sm:text-sm space-y-2 mb-6 max-w-2xl mx-auto shadow-2xs">
          <p className="font-bold text-gray-900 uppercase tracking-wider text-[10px] sm:text-xs">
            Your Program Includes:
          </p>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>4 full-sized tailored MILC clinical active products</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Weekly AI Skin Telemetry scans to track pore & glow progress</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Direct WhatsApp dermatologist consultation & routine adjustments</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
          <span className="text-xs sm:text-sm font-bold text-slate-700 ml-1.5">
            4.9/5 from 23,000+ users
          </span>
        </div>

        {/* Checkout / WhatsApp CTA */}
        <div className="max-w-md mx-auto">
          <a
            href={expertHref}
            target="_blank"
            rel="noreferrer"
            className="w-full h-14 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-sm cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Claim Plan & Order via WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onRestart}
            className="mt-5 text-xs text-slate-400 hover:text-[#4A1766] underline cursor-pointer transition-colors block mx-auto"
          >
            Start a new assessment
          </button>
        </div>
      </div>
    </motion.div>
  );
}
