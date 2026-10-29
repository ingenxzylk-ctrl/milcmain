import {
  analyzeFacePhotos,
  demoAnalysis,
  hasGeminiKey,
  publicAnalysisError,
} from "../services/geminiService.js";
import { enrichMessaging } from "../services/messaging.js";

export async function analyzeSkin(req, res) {
  const { aboutMe, skinProfile, lifestyle, images } = req.body || {};
  const list = Array.isArray(images) ? images.filter((img) => img?.dataUrl || img?.base64Data) : [];

  if (list.length < 1) {
    return res.status(400).json({ error: "One front-facing face photo is required." });
  }

  try {
    let analysis;
    if (!hasGeminiKey()) {
      analysis = demoAnalysis({ skinProfile, lifestyle, aboutMe });
    } else {
      analysis = await analyzeFacePhotos({ images: list });
    }
    const enriched = enrichMessaging(analysis, { aboutMe, skinProfile, lifestyle });
    return res.json(enriched);
  } catch (err) {
    if (err.imageRejected) {
      return res.status(422).json({
        imageRejected: true,
        error: err.message,
        rejectionReasons: err.rejectionReasons || [],
        qualityChecks: err.qualityChecks || {},
      });
    }
    console.error("[analyze]", err);
    return res.status(502).json({ error: publicAnalysisError(err) });
  }
}
