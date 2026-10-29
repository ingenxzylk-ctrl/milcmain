export const GENDER_OPTIONS = [
  { id: "female", label: "Female", icon: "venus" },
  { id: "male", label: "Male", icon: "mars" },
];

export const AGE_OPTIONS = [
  { id: "under_25", label: "Under 25" },
  { id: "25_34", label: "25 – 34" },
  { id: "35_44", label: "35 – 44" },
  { id: "45_60", label: "45 – 60" },
  { id: "over_60", label: "Over 60" },
];

export const PRIMARY_CONCERNS = [
  { id: "acne", label: "Pimples or acne", icon: "Flame", tag: "Clarify" },
  { id: "pores", label: "Enlarged Pores", icon: "Droplets", tag: "Refine" },
  { id: "redness", label: "Redness or rosacea", icon: "Activity", tag: "Calm" },
  { id: "dullness", label: "Dullness", icon: "Sun", tag: "Radiance" },
  { id: "texture", label: "Rough texture", icon: "Waves", tag: "Smooth" },
  { id: "tone", label: "Uneven skin tone", icon: "Sliders", tag: "Even" },
  { id: "pigmentation", label: "Pigmentation changes", icon: "Sparkles", tag: "Brighten" },
  { id: "fineLines", label: "Fine lines and wrinkles", icon: "Eye", tag: "Plump" },
  { id: "dryness", label: "Dryness", icon: "Wind", tag: "Hydrate" },
  { id: "oiliness", label: "Oiliness", icon: "Droplet", tag: "Balance" },
  { id: "texture_irreg", label: "Textural Irregularities", icon: "Layers", tag: "Resurface" },
  { id: "puffy_eyes", label: "Puffy eyes", icon: "CircleDot", tag: "De-puff" },
  { id: "crows_feet", label: "Crow's feet", icon: "Smile", tag: "Firm" },
  { id: "double_chin", label: "Double chin", icon: "User", tag: "Sculpt" },
  { id: "dark_circles", label: "Dark circles", icon: "Moon", tag: "Brighten" },
  { id: "sagging", label: "Sagging Skin", icon: "TrendingDown", tag: "Lift" },
  { id: "none", label: "Nothing from above", icon: "Shield", tag: "Maintain" },
];

export const SKIN_TYPES = [
  { id: "dry", label: "Dry skin type" },
  { id: "normal", label: "Normal skin type" },
  { id: "oily", label: "Oily skin type" },
  { id: "combination", label: "Combination skin type" },
];



export const SENSITIVITY_OPTIONS = [
  { id: "sensitive", label: "Sensitive" },
  { id: "non_sensitive", label: "Non-sensitive" },
];

export const SLEEP_OPTIONS = [
  { id: "minimal", label: "Minimal rest (less than 5 hours)" },
  { id: "moderate", label: "I get some shut-eye (5-6 hours)" },
  { id: "optimal", label: "I sleep long and well (7-8 hours)" },
  { id: "extended", label: "I like to sleep in (8+ hours)" },
];

export const WATER_OPTIONS = [
  { id: "caffeine_only", label: "I only have coffee or tea" },
  { id: "about_2", label: "About 2 glasses (16 oz.)" },
  { id: "2_to_6", label: "2 to 6 glasses (16–48 oz.)" },
  { id: "more_than_6", label: "More than 6 glasses (48+ oz.)" },
];

export const STRESS_OPTIONS = [
  { id: "everyday", label: "Yes, everyday" },
  { id: "often", label: "Often" },
  { id: "rarely", label: "Rarely" },
  { id: "never", label: "Never" },
];

export const ROUTINE_TIME_OPTIONS = [
  { id: "10_min", label: "10 minutes" },
  { id: "20_min", label: "20 minutes" },
  { id: "30_min", label: "30 minutes" },
  { id: "1_hour", label: "1 hour" },
  { id: "more", label: "Even more" },
];

export const PRICING_PLANS = [
  {
    id: "1_year",
    title: "1-Year Plan",
    badge: "SAVE 73%",
    originalPrice: "$129.99",
    discountedPrice: "$64.99",
    dailyRate: "$0.18",
    period: "per day, billed annually",
  },
  {
    id: "1_month",
    title: "1-Month Plan",
    badge: "MOST POPULAR",
    popular: true,
    originalPrice: "$39.99",
    discountedPrice: "$19.99",
    dailyRate: "$0.67",
    period: "per day, billed monthly",
  },
  {
    id: "3_months",
    title: "3-Months Plan",
    badge: "SAVE 50%",
    originalPrice: "$79.99",
    discountedPrice: "$39.99",
    dailyRate: "$0.44",
    period: "per day, billed quarterly",
  },
];
