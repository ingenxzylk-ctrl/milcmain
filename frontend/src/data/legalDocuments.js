export const LEGAL_DOCUMENTS = {
  privacy: {
    id: "privacy",
    title: "Privacy Policy",
    subtitle: "MILC Skin Lab · Last updated September 2026",
    paragraphs: [
      "MILC processes your name, contact details, quiz answers, and facial photographs solely to generate a cosmetic skin analysis and product recommendations. We act as a data fiduciary under the Digital Personal Data Protection Act, 2023 (India).",
      "Photos are sent to a vision model for a one-time analysis, then discarded. We store only the derived attribute JSON (category + observation) tied to your assessment record, along with the quiz answers you submitted. We do not sell personal data.",
      "You may request access, correction, or erasure of your assessment record by emailing privacy@milc.beauty. You can opt out of marketing WhatsApp or email at any time; transactional delivery of your report is separate.",
    ],
  },
  terms: {
    id: "terms",
    title: "Terms of Service",
    subtitle: "MILC Skin Lab · Last updated September 2026",
    paragraphs: [
      "The MILC Skin Analysis is a cosmetic appearance tool, not a medical diagnosis, dermatology consult, or treatment. Results are based on visible surface attributes in the photos you provide and on your self-reported answers.",
      "You must be 13 or older to use this assessment. If you are under 18, a parent or guardian should review these terms with you. Product recommendations are suggestions only and may not be suitable if you are using prescription treatments — ask a clinician before adding actives.",
      "By starting the assessment you agree that MILC may process your information to generate and send your report via WhatsApp and email, and that lighting, makeup, filters, and camera quality can limit accuracy.",
    ],
  },
  consent: {
    id: "consent",
    title: "AI Skin Analysis Consent",
    subtitle: "MILC Skin Lab · Photo processing consent",
    paragraphs: [
      "You consent to MILC processing one front-facing facial photograph with an AI vision model for cosmetic skin-attribute analysis: Whiteheads, Redness, Postacne spots, Wrinkles, Acne Inflammatory, Freckles, Pigmentation, Scars, Visible pores, Moles, and Nevi.",
      "This is not a medical diagnosis. The model will not be asked to identify disease. If you have a diagnosed skin condition, continue to follow your clinician’s advice. Photos are not retained after analysis.",
      "You confirm the photos are of you, taken without filters, and that you understand you can stop at any time before uploading.",
    ],
  },
};
