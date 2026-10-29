function resolveApiUrl() {
  const fromEnv = String(import.meta.env.VITE_API_URL || "").trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "/api";
}

const API_URL = resolveApiUrl();

async function parseResponse(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {
    throw new Error("Backend returned an invalid response. Check the backend terminal.");
  }
  if (!res.ok) {
    const err = new Error(data.error || "Something went wrong. Please try again.");
    if (data.imageRejected) {
      err.imageRejected = true;
      err.rejectionReasons = data.rejectionReasons || [];
      err.qualityChecks = data.qualityChecks || null;
    }
    throw err;
  }
  return data;
}

export async function analyzeSkin({ aboutMe, skinProfile, lifestyle, images }) {
  let res;
  try {
    res = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aboutMe, skinProfile, lifestyle, images }),
    });
  } catch {
    throw new Error("Cannot reach backend. Start it with npm run dev from the project root.");
  }
  return parseResponse(res);
}

export async function submitAssessmentReport(payload) {
  let res;
  try {
    res = await fetch(`${API_URL}/report/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Cannot reach backend to save the assessment report.");
  }
  return parseResponse(res);
}

export async function fetchAssessmentReport(reportId) {
  const id = encodeURIComponent(String(reportId || "").trim());
  let res;
  try {
    res = await fetch(`${API_URL}/report/${id}`);
  } catch {
    throw new Error("Cannot reach backend to load this assessment report.");
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
