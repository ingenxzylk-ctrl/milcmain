import { validateAnalysisResponse } from "../utils/scoringEngine";

function resolveApiUrl() {
  const fromEnv = String(import.meta.env.VITE_API_URL || "").trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "/api";
}

const API_URL = resolveApiUrl();

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function parseResponse(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {
    const err = new Error("Backend returned an unparseable response.");
    err.status = res.status;
    throw err;
  }
  if (!res.ok) {
    const err = new Error(data.error || `Server responded with status ${res.status}`);
    err.status = res.status;
    if (data.imageRejected) {
      err.imageRejected = true;
      err.rejectionReasons = data.rejectionReasons || [];
      err.qualityChecks = data.qualityChecks || null;
    }
    throw err;
  }
  return data;
}

const isRetryableStatus = (status) => status === 503 || status === 502 || status === 429 || status === 504;

export async function analyzeSkin({ aboutMe, skinProfile, lifestyle, images, onRetryProgress }) {
  const maxRetries = 2;
  const backoffDelays = [2000, 5000];
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutMe, skinProfile, lifestyle, images }),
      });

      const data = await parseResponse(res);
      // Strict response schema validation
      validateAnalysisResponse(data);
      return data;
    } catch (err) {
      lastError = err;
      if (err.imageRejected) {
        // Image validation rejection is not a transient server error, do not retry
        throw err;
      }

      const isNetworkError = !err.status || err.name === "TypeError" || String(err.message).toLowerCase().includes("fetch");
      const shouldRetry = attempt < maxRetries && (isNetworkError || isRetryableStatus(err.status));

      if (!shouldRetry) {
        throw err;
      }

      const delayMs = backoffDelays[attempt] || 5000;
      onRetryProgress?.({
        attempt: attempt + 1,
        maxRetries,
        delayMs,
        message: `Analysis service is busy. Retrying in ${delayMs / 1000}s (Attempt ${attempt + 1} of ${maxRetries})...`,
      });
      await wait(delayMs);
    }
  }

  throw lastError;
}

export async function submitAssessmentReport(payload) {
  let res;
  try {
    res = await fetch(`${API_URL}/report/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    const error = new Error("Cannot reach server to save assessment report.");
    error.isNetwork = true;
    throw error;
  }
  return parseResponse(res);
}

export async function fetchAssessmentReport(reportId) {
  const id = encodeURIComponent(String(reportId || "").trim());
  let res;
  try {
    res = await fetch(`${API_URL}/report/${id}`);
  } catch (err) {
    const error = new Error("Cannot reach server to load report.");
    error.isNetwork = true;
    error.status = 503;
    throw error;
  }
  if (res.status === 404) {
    const err = new Error("Report not found.");
    err.status = 404;
    throw err;
  }
  return parseResponse(res);
}

export async function lookupPincode(pincode) {
  const pin = encodeURIComponent(String(pincode || "").trim());
  try {
    const res = await fetch(`${API_URL}/pincode/${pin}`);
    return await res.json();
  } catch {
    return { ok: false, reason: "upstream_error" };
  }
}

export async function reverseGeocodeLocation({ lat, lng, accuracy }) {
  try {
    const res = await fetch(`${API_URL}/geo/reverse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng, accuracy }),
    });
    return await res.json();
  } catch {
    return { ok: false, reason: "network" };
  }
}
