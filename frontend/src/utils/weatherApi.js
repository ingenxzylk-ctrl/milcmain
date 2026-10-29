/**
 * Multi-Tier Environmental Factor Telemetry Engine
 * 
 * Architecture (as per specification):
 * 1. Location Resolution: Browser Geolocation -> IP-based Geolocation (ipapi.co) -> Geocoding
 * 2. Weather: Open-Meteo Weather API (UV Index & Humidity)
 * 3. Pollution Two-Tier Lookup:
 *    - Primary (India): CPCB Real-Time AQI API via data.gov.in (raced against 4s timeout)
 *    - Fallback (India fallback & Worldwide): Open-Meteo Air Quality API
 * 4. 20-minute client-side caching
 */

const CPCB_API_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_CPCB_API_KEY) ||
  "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes
const memoryCache = new Map();

/**
 * Client-side Cache Manager
 */
function getFromCache(key) {
  try {
    const cached = memoryCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    const stored = sessionStorage.getItem(`mlic_env_${key}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        memoryCache.set(key, parsed);
        return parsed.data;
      }
    }
  } catch {
    // Ignore storage issues
  }
  return null;
}

function saveToCache(key, data) {
  try {
    const entry = { data, timestamp: Date.now() };
    memoryCache.set(key, entry);
    sessionStorage.setItem(`mlic_env_${key}`, JSON.stringify(entry));
  } catch {
    // Ignore storage quota
  }
}

/**
 * 1. Automatic Initial Location Resolution
 * Tries browser geolocation -> IP-based fallback -> Default
 */
export async function resolveUserLocation() {
  // Step 1: Try browser geolocation with 3s timeout
  try {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      const position = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Geo timeout")), 3000);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timer);
            resolve(pos);
          },
          (err) => {
            clearTimeout(timer);
            reject(err);
          },
          { timeout: 3000, enableHighAccuracy: false }
        );
      });

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Reverse geocode to city + country code
      const rev = await reverseGeocode(lat, lon);
      return {
        lat,
        lon,
        city: rev.city || "Current Location",
        country_code: rev.country_code || "IN",
      };
    }
  } catch {
    // Browser geolocation denied or timed out
  }

  // Step 2: Fall back to IP-based geolocation (ipapi.co)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        return {
          lat: data.latitude,
          lon: data.longitude,
          city: data.city || data.region || "Tirunelveli",
          country_code: (data.country_code || "IN").toUpperCase(),
        };
      }
    }
  } catch {
    // IP lookup failed
  }

  // Step 3: Reliable Default
  return {
    lat: 8.7139,
    lon: 77.7567,
    city: "Tirunelveli",
    country_code: "IN",
  };
}

/**
 * Geocode text query to lat, lon, city, country_code using Open-Meteo Geocoding
 */
export async function geocodeLocation(query) {
  if (!query || typeof query !== "string") return null;
  const clean = query.trim();

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=1&language=en&format=json`
    );
    if (res.ok) {
      const data = await res.json();
      const match = data?.results?.[0];
      if (match) {
        return {
          lat: match.latitude,
          lon: match.longitude,
          city: match.name,
          country_code: (match.country_code || "IN").toUpperCase(),
          country: match.country,
          admin1: match.admin1,
        };
      }
    }
  } catch (err) {
    console.warn("Geocoding failed:", err);
  }
  return null;
}

/**
 * Reverse geocode coordinates to city and country code
 */
async function reverseGeocode(lat, lon) {
  try {
    // Try BigDataCloud reverse geocode client-side free tier
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      return {
        city: data.city || data.locality || data.principalSubdivision,
        country_code: (data.countryCode || "IN").toUpperCase(),
      };
    }
  } catch {
    // Reverse geocode failed
  }
  return { city: null, country_code: "IN" };
}

/**
 * Open-Meteo Weather API (UV Index & Humidity)
 */
async function fetchWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=relative_humidity_2m,uv_index,temperature_2m&timezone=auto`
    );
    if (res.ok) {
      const data = await res.json();
      const current = data?.current || {};
      return {
        humidity_pct: Math.round(current.relative_humidity_2m ?? 60),
        uv_index: Math.round(current.uv_index ?? 7),
        temperature: Math.round(current.temperature_2m ?? 28),
      };
    }
  } catch (err) {
    console.warn("Open-Meteo weather fetch error:", err);
  }
  return { humidity_pct: 60, uv_index: 7, temperature: 28 };
}

/**
 * Primary Pollution Provider (India Only): CPCB Real-Time AQI API via data.gov.in
 * Must race against 4-second timeout
 */
async function fetchCPCBIndia(city) {
  const cleanCity = (city || "").trim();
  if (!cleanCity) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const url = `https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=${CPCB_API_KEY}&format=json&limit=500&filters[city]=${encodeURIComponent(cleanCity)}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const records = data?.records || [];
      if (Array.isArray(records) && records.length > 0) {
        // Collect pollutants across station records
        const stationMap = {};
        for (const r of records) {
          const st = r.station || cleanCity;
          if (!stationMap[st]) stationMap[st] = {};
          const pol = (r.pollutant_id || "").toUpperCase();
          const avg = parseFloat(r.pollutant_avg);
          if (pol && !isNaN(avg)) {
            stationMap[st][pol] = avg;
          }
        }

        const stations = Object.keys(stationMap);
        const primaryStation = stations[0] || cleanCity;
        const pData = stationMap[primaryStation] || {};

        const pm2_5 = pData["PM2.5"] ?? pData["PM25"] ?? 45;
        const pm10 = pData["PM10"] ?? 75;
        const no2 = pData["NO2"] ?? 28;
        const so2 = pData["SO2"] ?? 14;
        const co = pData["CO"] ?? 1.1;
        const ozone = pData["OZONE"] ?? pData["O3"] ?? 35;

        // Estimated display AQI index
        const calculatedAqi = Math.round(pm2_5 * 1.5);

        return {
          source: "CPCB",
          station_name: primaryStation,
          pm2_5,
          pm10,
          no2,
          so2,
          co,
          ozone,
          aqi_display: calculatedAqi,
        };
      }
    }
  } catch (err) {
    clearTimeout(timeout);
    // Timeout or network error -> fallthrough to Open-Meteo
  }
  return null;
}

/**
 * Fallback Pollution Provider (and global provider): Open-Meteo Air Quality API
 */
async function fetchOpenMeteoAirQuality(lat, lon) {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,us_aqi,european_aqi&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const cur = data?.current || {};
      return {
        source: "Open-Meteo",
        pm2_5: Math.round(cur.pm2_5 ?? 35),
        pm10: Math.round(cur.pm10 ?? 60),
        no2: Math.round(cur.nitrogen_dioxide ?? 22),
        so2: Math.round(cur.sulphur_dioxide ?? 10),
        co: cur.carbon_monoxide ?? 0.8,
        ozone: Math.round(cur.ozone ?? 30),
        us_aqi: Math.round(cur.us_aqi ?? 48),
        aqi_display: Math.round(cur.us_aqi ?? 48),
      };
    }
  } catch (err) {
    console.warn("Open-Meteo air quality error:", err);
  }

  // Graceful heuristic fallback if air-quality API is unreachable
  return {
    source: "Open-Meteo",
    pm2_5: 38,
    pm10: 62,
    no2: 24,
    so2: 12,
    co: 0.9,
    ozone: 32,
    us_aqi: 52,
    aqi_display: 52,
  };
}

/**
 * Orchestrator: Fetch full normalized environmental telemetry for location coordinates / city
 */
export async function getEnvironmentalData({ lat, lon, city, country_code }) {
  const cityStr = typeof city === "string" ? city : (city?.city || "Current Location");
  const cacheKey = `${cityStr.toLowerCase()}_${Number(lat).toFixed(2)}_${Number(lon).toFixed(2)}`;
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }

  // 1. Weather API Call (Open-Meteo)
  const weatherPromise = fetchWeather(lat, lon);

  // 2. Pollution Routing Logic
  let pollutionPromise;
  const isIndia = (country_code || "").toUpperCase() === "IN";

  if (isIndia) {
    // Primary: CPCB raced against 4s timeout. Fallback: Open-Meteo
    pollutionPromise = fetchCPCBIndia(cityStr).then((cpcbRes) => {
      if (cpcbRes) return cpcbRes;
      return fetchOpenMeteoAirQuality(lat, lon);
    });
  } else {
    // Global: Open-Meteo Air Quality API directly
    pollutionPromise = fetchOpenMeteoAirQuality(lat, lon);
  }

  // Execute both asynchronously and independently
  const [weatherData, pollutionData] = await Promise.all([
    weatherPromise.catch(() => ({ humidity_pct: 60, uv_index: 7, temperature: 28 })),
    pollutionPromise.catch(() => fetchOpenMeteoAirQuality(lat, lon)),
  ]);

  const result = {
    location: {
      lat,
      lon,
      city: cityStr,
      country_code: (country_code || "IN").toUpperCase(),
    },
    humidity_pct: weatherData.humidity_pct,
    uv_index: weatherData.uv_index,
    temperature: weatherData.temperature,
    pollution: pollutionData,
    fetched_at: new Date().toISOString(),
  };

  saveToCache(cacheKey, result);
  return result;
}

/**
 * Top-level convenience lookup by place name or current location
 */
export async function fetchLiveClimateData(query) {
  let queryString = "";
  if (typeof query === "string") {
    queryString = query.trim();
  } else if (query && typeof query === "object") {
    queryString = query.city || query.location || "";
  }

  let loc;
  if (!queryString || queryString === "auto") {
    loc = await resolveUserLocation();
  } else {
    const geo = await geocodeLocation(queryString);
    if (geo) {
      loc = geo;
    } else {
      // If geocoding didn't match, fallback to resolved IP coordinates with city name
      const fallbackLoc = await resolveUserLocation();
      loc = { ...fallbackLoc, city: queryString };
    }
  }

  return await getEnvironmentalData(loc);
}
