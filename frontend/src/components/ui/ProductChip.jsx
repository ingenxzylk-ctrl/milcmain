import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MILC_CATALOG } from "../../data/products";

export default function ProductChip({ product, compact, onSelect }) {
  const item = typeof product === "string" ? MILC_CATALOG[product] : product;
  if (!item) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={() => onSelect?.(item)}
      className={`inline-flex items-center gap-2 rounded-full border border-[#E8E3DA] bg-white hover:border-[#9E3A26]/40 transition-all cursor-pointer shadow-2xs hover:shadow-xs text-left ${
        compact ? "px-3 py-1.5" : "px-3.5 py-2"
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#18181B] bg-[#FAF8F5] px-2 py-0.5 rounded-full">
        {item.role}
      </span>
      <span className="text-xs font-semibold text-gray-800">{item.label}</span>
      {!compact && item.price && (
        <span className="text-[11px] font-bold text-gray-400">· ₹{item.price}</span>
      )}
    </motion.button>
  );
}
