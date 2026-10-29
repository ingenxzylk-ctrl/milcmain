import { saveReport, getReport } from "../services/reportStore.js";
import { reportUrl, sendReportEmail, whatsappShareUrl } from "../services/delivery.js";

export async function submitAssessmentReport(req, res) {
  const { aboutMe, skinProfile, lifestyle, skinAnalysis } = req.body || {};
  if (!skinAnalysis?.attributes) {
    return res.status(400).json({ error: "Analysis is required before a report can be saved." });
  }

  const stored = await saveReport({ aboutMe, skinProfile, lifestyle, skinAnalysis });
  let email = { sent: false };
  try {
    email = await sendReportEmail({
      aboutMe,
      reportId: stored.reportId,
      headline: skinAnalysis.headline,
    });
  } catch (err) {
    console.warn("[email]", err?.message || err);
    email = { sent: false, reason: "send_failed" };
  }

  return res.json({
    ok: true,
    reportId: stored.reportId,
    reportDate: stored.reportDate,
    resultPageUrl: reportUrl(stored.reportId),
    whatsappUrl: whatsappShareUrl({ aboutMe, reportId: stored.reportId }),
    email,
    demo: Boolean(skinAnalysis.demo),
  });
}

export async function getAssessmentReport(req, res) {
  const report = await getReport(req.params.reportId);
  if (!report) return res.status(404).json({ error: "Report not found." });
  return res.json(report);
}
