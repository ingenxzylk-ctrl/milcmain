import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Sun,
  Droplets,
  Wind,
  ArrowRight,
  ChevronLeft,
  RefreshCw,
  Radio,
} from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { fetchLiveClimateData } from "../../utils/weatherApi";

const POPULAR_LOCATIONS = [
  "Tirunelveli, India",
  "Chennai, India",
  "New Delhi, India",
  "Singapore",
  "Seoul, Korea",
  "New York, USA",
];

function toCityString(val) {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    return val.city || val.location || val.name || "";
  }
  return "";
}

export default function Screen08Climate({ onComplete, onBack }) {
  const { state, updateLifestyle } = useQuiz();

  const [city, setCity] = useState(() => {
    const initial = state?.lifestyle?.location;
    return toCityString(initial) || "Tirunelveli, India";
  });

  const activeCity = toCityString(city) || "Tirunelveli, India";

  const [climate, setClimate] = useState({
    uv_index: 10,
    humidity_pct: 64,
    temperature: 29,
    pollution: {
      source: "Open-Meteo",
      aqi_display: 48,
      pm2_5: 35,
    },
    location: {
      city: activeCity,
      country_code: "IN",
    },
  });
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  // Fetch live climate telemetry whenever user selects or types location
  useEffect(() => {
    const queryCity = toCityString(city).trim();
    if (!queryCity || queryCity.length < 2) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchLiveClimateData(queryCity);
        if (data) {
          setClimate(data);
          const resolvedCityName = toCityString(data.location?.city) || queryCity;
          updateLifestyle?.({
            location: resolvedCityName,
            uvIndex: data.uv_index,
            humidity: data.humidity_pct,
            pollution: data.pollution?.aqi_display || data.pollution?.pm2_5 || 45,
            temperature: data.temperature,
            pollutionSource: data.pollution?.source,
            pollutionStation: data.pollution?.station_name,
          });
        }
      } catch (err) {
        console.error("Live climate sync error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [city, updateLifestyle]);

  const handleNext = () => {
    const finalCity =
      toCityString(climate.location?.city) ||
      toCityString(city) ||
      "Tirunelveli, India";

    updateLifestyle?.({
      location: finalCity,
      uvIndex: climate.uv_index,
      humidity: climate.humidity_pct,
      pollution: climate.pollution?.aqi_display || climate.pollution?.pm2_5 || 45,
      temperature: climate.temperature,
      pollutionSource: climate.pollution?.source,
      pollutionStation: climate.pollution?.station_name,
    });
    onComplete();
  };

  // Helper status indicators
  const getUvStatus = (val) => {
    if (val >= 10) return { label: "Very High", color: "text-amber-700 bg-amber-100/70" };
    if (val >= 7) return { label: "High", color: "text-amber-700 bg-amber-100/70" };
    if (val >= 4) return { label: "Moderate", color: "text-yellow-700 bg-yellow-100/70" };
    return { label: "Mild", color: "text-emerald-700 bg-emerald-100/70" };
  };

  const getHumidityStatus = (val) => {
    if (val >= 70) return { label: "High Moisture", color: "text-blue-700 bg-blue-100/70" };
    if (val <= 40) return { label: "Dry Climate", color: "text-amber-700 bg-amber-100/70" };
    return { label: "Balanced", color: "text-emerald-700 bg-emerald-100/70" };
  };

  const getPollutionStatus = (val) => {
    if (val >= 150) return { label: "Unhealthy AQI", color: "text-rose-700 bg-rose-100/70" };
    if (val >= 100) return { label: "Elevated AQI", color: "text-orange-700 bg-orange-100/70" };
    if (val >= 50) return { label: "Moderate AQI", color: "text-amber-700 bg-amber-100/70" };
    return { label: "Good Air", color: "text-emerald-700 bg-emerald-100/70" };
  };

  const uvBadge = getUvStatus(climate.uv_index ?? 10);
  const humidityBadge = getHumidityStatus(climate.humidity_pct ?? 64);
  const aqiValue =
    climate.pollution?.aqi_display ??
    climate.pollution?.us_aqi ??
    climate.pollution?.pm2_5 ??
    48;
  const pollutionBadge = getPollutionStatus(aqiValue);

  // Dynamic Data-Source Label as required by PDF page 7
  const isCpcb = climate.pollution?.source === "CPCB";
  const stationOrCity =
    climate.pollution?.station_name ||
    toCityString(climate.location?.city) ||
    "Station";
  const dataSourceLabel = isCpcb
    ? `CPCB — ${stationOrCity}`
    : "Open-Meteo modeled estimate";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-2"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] text-left relative overflow-hidden">
        {/* Live sync reassurance badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-[0.14em] text-[#4A1766] uppercase bg-[#F4E8FC] px-3 py-1 rounded-full">
            <Sun className="w-3.5 h-3.5" />
            Environmental Factor Engine
          </span>

          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open-Meteo & CPCB Live</span>
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          I live in...
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xl">
          Your local climate, air quality, and sun exposure impact your skin. We fetch real-time atmospheric sensor data for your location.
        </p>

        {/* Location Input with Live Indicator */}
        <div className="relative mt-5 mb-2">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A1766]" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter any district, city, or country..."
            className="w-full h-14 pl-11 pr-10 rounded-2xl border border-slate-200 bg-[#F4F7FA]/80 text-sm font-semibold text-gray-900 focus:border-[#7A35A3] focus:ring-2 focus:ring-[#7A35A3]/20 outline-none transition-all shadow-xs"
          />
          {loading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A1766]">
              <RefreshCw className="w-4 h-4 animate-spin text-[#4A1766]" />
            </div>
          )}
        </div>

        {/* Quick Pick District / City Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          <span className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider">Quick:</span>
          {POPULAR_LOCATIONS.map((loc) => {
            const isSelected = activeCity
              .toLowerCase()
              .includes(loc.split(",")[0].toLowerCase());
            return (
              <button
                key={loc}
                type="button"
                onClick={() => setCity(loc)}
                className={`text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full border transition-all cursor-pointer font-medium ${
                  isSelected
                    ? "bg-[#7A35A3] text-white border-[#7A35A3]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {loc.split(",")[0]}
              </button>
            );
          })}
        </div>

        {/* 3 Live Telemetry Sensor Tiles */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-5 mb-4">
          {/* UV Index Tile */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[#F4F7FA] border border-[#EADBFA] text-center relative overflow-hidden transition-all shadow-2xs">
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-amber-500 mb-1" />
            <p className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider">UV Index</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5">
              {loading ? "..." : climate.uv_index}
            </p>
            <span
              className={`inline-block mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${uvBadge.color}`}
            >
              {uvBadge.label}
            </span>
          </div>

          {/* Humidity Tile */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[#F4F7FA] border border-[#EADBFA] text-center relative overflow-hidden transition-all shadow-2xs">
            <Droplets className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-blue-500 mb-1" />
            <p className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider">Humidity</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5">
              {loading ? "..." : `${climate.humidity_pct}%`}
            </p>
            <span
              className={`inline-block mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${humidityBadge.color}`}
            >
              {humidityBadge.label}
            </span>
          </div>

          {/* Pollution / AQI Tile */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[#F4F7FA] border border-[#EADBFA] text-center relative overflow-hidden transition-all shadow-2xs">
            <Wind className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-slate-600 mb-1" />
            <p className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider">Pollution</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5">
              {loading ? "..." : aqiValue}
            </p>
            <span
              className={`inline-block mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${pollutionBadge.color}`}
            >
              {pollutionBadge.label}
            </span>
          </div>
        </div>

        {/* Data Source Label (as specified in PDF Page 7) */}
        <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-slate-100/80 border border-slate-200/80 w-fit mx-auto mb-8 text-[11px] text-slate-600">
          <Radio className={`w-3 h-3 ${isCpcb ? "text-emerald-600" : "text-[#4A1766]"}`} />
          <span className="font-medium text-slate-500">Source:</span>
          <span className="font-semibold text-slate-800">{dataSourceLabel}</span>
        </div>

        {/* Center-aligned Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 h-12 border border-gray-200/90 text-gray-700 rounded-full font-semibold hover:bg-gray-50 text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleNext}
            className="flex-[1.5] h-12 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-sm cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
