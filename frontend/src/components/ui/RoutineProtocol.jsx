import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { MILC_CATALOG } from "../../data/products";

export default function RoutineProtocol({ skinProfile, onSelectProduct }) {
  const [activeTab, setActiveTab] = useState("am");

  const isDry = skinProfile?.skinType === "dry";
  const cleanser = isDry ? MILC_CATALOG.hydratingCleanser : MILC_CATALOG.bha;

  const amSteps = [
    {
      step: 1,
      name: "Cleanse",
      dose: "Dime size",
      product: cleanser,
      instruction: "Gentle rinse with lukewarm water",
    },
    {
      step: 2,
      name: "Brighten",
      dose: "3–4 drops",
      product: MILC_CATALOG.vitC,
      instruction: "Antioxidant shield against daily UV & pollution",
    },
    {
      step: 3,
      name: "Hydrate",
      dose: "Pea size",
      product: MILC_CATALOG.moisturizer,
      instruction: "Locks moisture into lipid barrier",
    },
    {
      step: 4,
      name: "Shield (SPF)",
      dose: "2 finger lengths",
      product: MILC_CATALOG.spf,
      instruction: "Broad-spectrum daily protection",
    },
  ];

  const pmSteps = [
    {
      step: 1,
      name: "Deep Cleanse",
      dose: "Nickel size",
      product: cleanser,
      instruction: "Dissolves SPF, grime & daily buildup",
    },
    {
      step: 2,
      name: "Target Pores",
      dose: "3 drops",
      product: MILC_CATALOG.niacinamide,
      instruction: "Clears pores and calms redness",
    },
    {
      step: 3,
      name: "Eye Care",
      dose: "Half pea",
      product: MILC_CATALOG.eye,
      instruction: "De-puffs and brightens dark circles",
    },
    {
      step: 4,
      name: "Night Recovery",
      dose: "Pea size",
      product: MILC_CATALOG.moisturizer,
      instruction: "Overnight peptide barrier repair",
    },
  ];

  const steps = activeTab === "am" ? amSteps : pmSteps;

  return (
    <div className="atelier-card rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 bg-white/95 backdrop-blur-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-2.5 py-1 rounded-full shadow-2xs">
            DAILY REGIMEN
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141416] mt-2">
            Your Prescribed Daily Routine
          </h3>
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
            <span>AM</span>
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
            <span>PM</span>
          </button>
        </div>
      </div>

      {/* 4-Step Visual Grid */}
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
              className="p-4 rounded-2xl border border-[#EBE5DC] bg-[#FAF9F6] hover:border-[#CD92EB] hover:bg-white transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-white border border-[#EBE5DC] text-[#141416] font-mono font-bold text-xs flex items-center justify-center">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#AFA698] uppercase tracking-wider">
                    {item.dose}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#141416] leading-tight">
                  {item.name}
                </h4>
                <p className="text-xs font-semibold text-[#E04234] mt-0.5 truncate">
                  {item.product.label}
                </p>
                <p className="text-[11px] text-[#52525B] mt-1.5 leading-snug">
                  {item.instruction}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#EBE5DC] flex items-center justify-between text-xs">
                <span className="font-bold text-[#141416] font-mono">₹{item.product.price}</span>
                <span className="text-[10px] font-mono font-bold text-[#E04234] uppercase tracking-wider group-hover:underline flex items-center gap-0.5">
                  Inspect <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
