import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sparkles, CheckCircle2, ChevronRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { MILC_CATALOG } from "../../data/products";

export default function RoutineProtocol({ skinProfile, onSelectProduct }) {
  const [activeTab, setActiveTab] = useState("am");

  const isDry = skinProfile?.skinType === "dry";
  const cleanser = isDry ? MILC_CATALOG.hydratingCleanser : MILC_CATALOG.bha;

  const amSteps = [
    {
      step: 1,
      name: "Step 1: Cleanse",
      core: true,
      dose: "Dime size",
      product: cleanser,
      instruction: "Gentle rinse with lukewarm water to remove overnight sebum.",
    },
    {
      step: 2,
      name: "Step 2: Hydrate & Barrier",
      core: true,
      dose: "Pea size",
      product: MILC_CATALOG.moisturizer,
      instruction: "Locks hydration into epidermal lipid matrix and seals moisture.",
    },
    {
      step: 3,
      name: "Step 3: Brighten & Defend",
      core: false,
      dose: "3–4 drops",
      product: MILC_CATALOG.vitC,
      instruction: "Antioxidant shield against environmental oxidation and dullness.",
    },
    {
      step: 4,
      name: "Step 4: Daily Shield (SPF)",
      core: false,
      dose: "2 finger lengths",
      product: MILC_CATALOG.spf,
      instruction: "Broad-spectrum daily protection against UVA/UVB photo-aging.",
    },
  ];

  const pmSteps = [
    {
      step: 1,
      name: "Step 1: Clarifying Cleanse",
      core: true,
      dose: "Nickel size",
      product: cleanser,
      instruction: "Dissolves SPF, airborne pollutants & daily pore buildup.",
    },
    {
      step: 2,
      name: "Step 2: Overnight Barrier Repair",
      core: true,
      dose: "Pea size",
      product: MILC_CATALOG.moisturizer,
      instruction: "Peptide and ceramide recovery while skin regenerates overnight.",
    },
    {
      step: 3,
      name: "Step 3: Pore Clarifier",
      core: false,
      dose: "3 drops",
      product: MILC_CATALOG.niacinamide,
      instruction: "Regulates sebum production, soothes redness, and refines pores.",
    },
    {
      step: 4,
      name: "Step 4: Orbital Eye Recovery",
      core: false,
      dose: "Half pea",
      product: MILC_CATALOG.eye,
      instruction: "Hydrates and de-puffs delicate orbital eye area.",
    },
  ];

  const steps = activeTab === "am" ? amSteps : pmSteps;

  return (
    <div className="atelier-card rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 bg-white/95 backdrop-blur-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-2.5 py-1 rounded-full shadow-2xs">
            DAILY REGIMEN PROTOCOL
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141416] mt-2">
            Your Prescribed Daily Routine
          </h3>
          <p className="text-xs text-[#52525B] mt-1">
            Built around your core 2-step essentials (Cleanse + Moisture), supported by targeted treatment boosters.
          </p>
        </div>

        {/* AM / PM switcher */}
        <div className="flex p-1 bg-[#FAF9F6] rounded-2xl border border-[#EBE5DC]">
          <button
            type="button"
            onClick={() => setActiveTab("am")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "am"
                ? "bg-[#141416] text-white shadow-xs"
                : "text-[#71717A] hover:text-[#141416]"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#D4FF3F]" />
            <span>Morning (AM)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pm")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "pm"
                ? "bg-[#141416] text-white shadow-xs"
                : "text-[#71717A] hover:text-[#141416]"
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-[#CD92EB]" />
            <span>Evening (PM)</span>
          </button>
        </div>
      </div>

      {/* Routine Transparency Notice */}
      <div className="mb-4 py-2 px-3.5 rounded-xl bg-[#FAF9F6] border border-[#EBE5DC] flex flex-wrap items-center justify-between gap-2 text-xs text-[#52525B]">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Core Step 1 & 2 included in all starter plans. Boosters sold separately or included in 3-Month & 1-Year plans.</span>
        </span>
      </div>

      {/* Steps Visual Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {steps.map((item) => (
            <div
              key={item.step}
              onClick={() => onSelectProduct?.(item.product)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between shadow-2xs ${
                item.core
                  ? "border-[#CD92EB] bg-gradient-to-b from-white to-[#FAF9F6] ring-1 ring-[#CD92EB]/30"
                  : "border-[#EBE5DC] bg-[#FAF9F6] hover:bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-full border text-xs font-mono font-bold flex items-center justify-center ${
                    item.core
                      ? "bg-[#141416] text-white border-[#141416]"
                      : "bg-white text-[#141416] border-[#EBE5DC]"
                  }`}>
                    {item.step}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.core
                      ? "bg-[#CD92EB]/20 text-[#141416] border border-[#CD92EB]/40"
                      : "bg-white text-[#71717A] border border-[#EBE5DC]"
                  }`}>
                    {item.core ? "Core Fix" : "Booster"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#141416] leading-tight">
                  {item.name}
                </h4>
                <p className="text-xs font-bold text-[#E04234] mt-0.5 truncate">
                  {item.product.label}
                </p>
                <p className="text-[11px] text-[#52525B] mt-1.5 leading-snug">
                  {item.instruction}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#EBE5DC] flex items-center justify-between text-xs">
                <span className="font-bold text-[#141416] font-mono">₹{item.product.price}</span>
                <span className="text-[10px] font-mono font-bold text-[#E04234] uppercase tracking-wider group-hover:underline flex items-center gap-0.5">
                  View Product <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
