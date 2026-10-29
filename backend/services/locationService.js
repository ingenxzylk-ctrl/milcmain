import {
  isValidIndianPincode,
  normalizeIndianPincode,
  extractIndianPincode,
} from "../utils/pincode.js";
import { isPrivateIp, normalizeClientIp } from "../utils/clientIp.js";

const PIN_TTL_MS = 24 * 60 * 60 * 1000;
const GEO_TTL_MS = 6 * 60 * 60 * 1000;
const pinCache = new Map();
const geoCache = new Map();

const POSTAL_URL = "https://api.postalpincode.in/pincode/";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "MILCSkinLab/1.0 (skin analysis location lookup)";

function cacheGet(map, key, ttl) {
  const hit = map.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > ttl) {
    map.delete(key);
    return null;
  }
  return hit.value;
}

function cacheSet(map, key, value, max = 2000) {
  if (map.size >= max) {
    const first = map.keys().next().value;
    if (first !== undefined) map.delete(first);
  }
  map.set(key, { at: Date.now(), value });
}

async function fetchJson(url, { timeoutMs = 8000, headers = {} } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", ...headers },
    });
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function pickCity(office = {}) {
  const district = String(office.District || "").trim();
  const block = String(office.Block || "").trim();
  const name = String(office.Name || "").trim();
  if (district && !/^na$/i.test(district)) return district;
  if (block && !/^na$/i.test(block)) return block;
  return name || "";
}

export async function lookupPincode(rawPin) {
  const pincode = normalizeIndianPincode(rawPin);
  if (!isValidIndianPincode(pincode)) return { ok: false, reason: "invalid_format", pincode };
  const cached = cacheGet(pinCache, pincode, PIN_TTL_MS);
  if (cached) return cached;
  try {
    const data = await fetchJson(`${POSTAL_URL}${encodeURIComponent(pincode)}`);
    const row = Array.isArray(data) ? data[0] : data;
    const offices = Array.isArray(row?.PostOffice) ? row.PostOffice : [];
    const status = String(row?.Status || "").toLowerCase();
    if (status !== "success" || !offices.length) {
      const miss = { ok: false, reason: "not_found", pincode };
      cacheSet(pinCache, pincode, miss);
      return miss;
    }
    const office = offices[0] || {};
    const result = {
      ok: true,
      pincode,
      city: pickCity(office),
      district: String(office.District || "").trim(),
      state: String(office.State || "").trim(),
      postOffice: String(office.Name || "").trim(),
    };
    cacheSet(pinCache, pincode, result);
    return result;
  } catch (err) {
    console.warn("[pincode] lookup failed:", err?.message || err);
    return { ok: false, reason: "upstream_error", pincode };
  }
}

function pickLocalityCity(address = {}) {
  return String(
    address.state_district ||
      address.city ||
      address.town ||
      address.county ||
      address.village ||
      address.municipality ||
      ""
  ).trim();
}

export async function reverseGeocode(lat, lng, { accuracy } = {}) {
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { ok: false, reason: "invalid_coords" };
  }
  if (latitude < 6 || latitude > 38 || longitude < 68 || longitude > 98) {
    return { ok: false, reason: "outside_india" };
  }
  const acc = Number(accuracy);
  if (Number.isFinite(acc) && acc > 1500) {
    return { ok: false, reason: "low_accuracy" };
  }

  const key = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
  const cached = cacheGet(geoCache, key, GEO_TTL_MS);
  if (cached) return cached;

  try {
    const url = `${NOMINATIM_URL}?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(
      longitude
    )}&zoom=18&addressdetails=1&accept-language=en`;
    const data = await fetchJson(url, { timeoutMs: 10000, headers: { "User-Agent": USER_AGENT } });
    const address = data?.address || {};
    const country = String(address.country || "").toLowerCase();
    if (country && country !== "india") {
      const miss = { ok: false, reason: "outside_india" };
      cacheSet(geoCache, key, miss);
      return miss;
    }
    const pincode = extractIndianPincode(address.postcode);
    const official = pincode ? await lookupPincode(pincode) : null;
    const result = {
      ok: true,
      fill: pincode ? "pin" : "place",
      pincode: official?.ok ? official.pincode : pincode,
      city: official?.ok ? official.city : pickLocalityCity(address),
      state: official?.ok ? official.state : String(address.state || "").trim(),
    };
    cacheSet(geoCache, key, result);
    return result;
  } catch (err) {
    console.warn("[geo] reverse failed:", err?.message || err);
    return { ok: false, reason: "upstream_error" };
  }
}

export async function lookupIpLocation(rawIp) {
  const ip = normalizeClientIp(rawIp);
  if (!ip || isPrivateIp(ip)) return { ok: false, reason: "private_ip" };
  try {
    const data = await fetchJson(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,city,region,country,country_code`);
    if (!data?.success) return { ok: false, reason: "not_found" };
    if (String(data.country_code || "").toUpperCase() !== "IN") {
      return { ok: false, reason: "outside_india" };
    }
    return { ok: true, city: data.city || "", state: data.region || "" };
  } catch {
    return { ok: false, reason: "not_found" };
  }
}
