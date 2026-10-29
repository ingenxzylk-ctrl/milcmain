function item(id, sku, label, ingredients, price, role) {
  return { id, sku, label, ingredients, price, role, href: `#shop/${sku}` };
}

export const MILC_CATALOG = {
  spf: item("spf", "MILC-SPF-30", "MILC Daily Shield SPF 30", "Broad-spectrum SPF 30", 890, "Protect"),
  vitC: item("vitC", "MILC-C-30", "MILC Glow C Serum", "Vitamin C derivative", 1290, "Brighten"),
  niacinamide: item("niacinamide", "MILC-NIA-10", "MILC Even Tone Serum", "Niacinamide 10%", 1090, "Even"),
  bha: item("bha", "MILC-BHA-CLEAN", "MILC Pore Calm Cleanser", "Salicylic acid", 790, "Clear"),
  moisturizer: item("moisturizer", "MILC-BARRIER", "MILC Barrier Cream", "Ceramides, peptides", 1190, "Repair"),
  aha: item("aha", "MILC-AHA-GENTLE", "MILC Soft Resurface", "Lactic / mandelic acid", 990, "Smooth"),
  eye: item("eye", "MILC-EYE-01", "MILC Bright Eye Cream", "Caffeine, peptides", 990, "Eyes"),
  hydratingCleanser: item(
    "hydratingCleanser",
    "MILC-CLEAN-GENTLE",
    "MILC Cream Cleanser",
    "Low-foam cleanser",
    690,
    "Cleanse"
  ),
};

export function productsByIds(ids = []) {
  return ids.map((id) => MILC_CATALOG[id]).filter(Boolean);
}

export function uniqueProducts(lists = []) {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    for (const p of list) {
      if (!p?.sku || seen.has(p.sku)) continue;
      seen.add(p.sku);
      out.push(p);
    }
  }
  return out;
}
