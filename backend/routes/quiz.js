import express from "express";
import { analyzeSkin } from "../controllers/analyzeController.js";
import { submitAssessmentReport, getAssessmentReport } from "../controllers/reportController.js";
import { getPincodeLookup, postReverseGeocode, getIpLocation } from "../controllers/locationController.js";
import { hasGeminiKey } from "../services/geminiService.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    provider: "gemini",
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    hasApiKey: hasGeminiKey(),
    photosRetained: false,
    pipeline: ["quiz", "gemini_face_photo_analysis", "messaging_merge", "save_report_without_photos"],
  });
});

router.post("/analyze", analyzeSkin);
router.post("/report/submit", submitAssessmentReport);
router.get("/report/:reportId", getAssessmentReport);
router.get("/pincode/:pincode", getPincodeLookup);
router.post("/geo/reverse", postReverseGeocode);
router.get("/geo/ip", getIpLocation);

export default router;
