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
            uv_index: data.uv_index,
            humidity_pct: data.humidity_pct,
            temperature: data.temperature,
            pollution: data.pollution,
          });
        }
      } catch {
        // Fallback default
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [city]);

  const handleNext = () => {
    updateLifestyle({
      location: activeCity,
      uv_index: climate.uv_index,
      humidity_pct: climate.humidity_pct,
      temperature: climate.temperature,
      pollution: climate.pollution,
    });
    onComplete();
  };

  // Severity badges
  const uvBadge =
    climate.uv_index >= 8
      ? { label: "Very High", color: "bg-[#FDF2F2] text-[#9E2A2B] border border-[#F8D7D7]" }
      : climate.uv_index >= 5
      ? { label: "Moderate", color: "bg-[#FDF8ED] text-[#B8860B] border border-[#F5E6BE]" }
      : { label: "Low", color: "bg-[#EEF4F0] text-[#2D5A43] border border-[#CCE0D4]" };

  const humidityBadge =
    climate.humidity_pct >= 70
      ? { label: "High / Humid", color: "bg-[#F5EFEB] text-[#9E3A26] border border-[#E8CEC5]" }
      : climate.humidity_pct <= 40
      ? { label: "Dry / Low", color: "bg-[#FDF8ED] text-[#B8860B] border border-[#F5E6BE]" }
      : { label: "Balanced", color: "bg-[#EEF4F0] text-[#2D5A43] border border-[#CCE0D4]" };

  const aqiValue = climate.pollution?.aqi_display || 48;
  const isCpcb = climate.pollution?.source === "CPCB";
  const dataSourceLabel = isCpcb
    ? "Central Pollution Control Board (CPCB) India"
    : "Open-Meteo European Atmosphere Service";

  const pollutionBadge =
    aqiValue > 150
      ? { label: "Severe / Unhealthy", color: "bg-[#FDF2F2] text-[#9E2A2B] border border-[#F8D7D7]" }
      : aqiValue > 100
      ? { label: "Moderate Pollution", color: "bg-[#FDF8ED] text-[#B8860B] border border-[#F5E6BE]" }
      : { label: "Good Air Quality", color: "bg-[#EEF4F0] text-[#2D5A43] border border-[#CCE0D4]" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 pb-12 pt-2 text-left"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 relative overflow-hidden bg-white/95 backdrop-blur-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E3DA] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#71717A] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9E3A26]" />
          ENVIRONMENT · STEP 09
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#18181B] leading-tight">
          Where do you live?
        </h2>
        <p className="text-[#71717A] text-xs sm:text-sm mt-2 mb-6 leading-relaxed max-w-xl">
          UV index, humidity, and atmospheric particulate matter accelerate oxidative cellular stress and barrier degradation.
        </p>

        {/* Location Input Box */}
        <div className="relative mb-3">
          <MapPin className="w-4 h-4 text-[#9E3A26] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city or district..."
            className="w-full h-12 pl-11 pr-10 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] focus:border-[#9E3A26] focus:bg-white text-xs sm:text-sm font-medium text-[#18181B] outline-none transition-all"
          />
          {loading && (
            <RefreshCw className="w-4 h-4 text-[#A8A193] animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Quick Pick Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          <span className="text-[10px] text-[#A8A193] font-mono font-semibold uppercase tracking-wider mr-1">Quick:</span>
          {POPULAR_LOCATIONS.map((loc) => {
            const isSelected = activeCity.toLowerCase().includes(loc.split(",")[0].toLowerCase());
            return (
              <button
                key={loc}
                type="button"
                onClick={() => setCity(loc)}
                className={`text-[11px] px-3 py-1 rounded-full border transition-all cursor-pointer font-medium font-mono ${
                  isSelected
                    ? "bg-[#9E3A26] text-white border-[#9E3A26]"
                    : "bg-[#FAF8F5] text-[#52525B] border-[#E8E3DA] hover:border-[#D5CFC3]"
                }`}
              >
                {loc.split(",")[0]}
              </button>
            );
          })}
        </div>

        {/* 3 Live Telemetry Sensor Tiles */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-5">
          {/* UV Index Tile */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] text-center relative overflow-hidden transition-all shadow-2xs">
            <Sun className="w-5 h-5 mx-auto text-[#B8860B] mb-1.5" />
            <p className="text-[9px] sm:text-[10px] uppercase font-mono font-bold text-[#71717A] tracking-wider">UV Index</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#18181B] mt-0.5">
              {loading ? "..." : climate.uv_index}
            </p>
            <span className={`inline-block mt-1 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${uvBadge.color}`}>
              {uvBadge.label}
            </span>
          </div>

          {/* Humidity Tile */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] text-center relative overflow-hidden transition-all shadow-2xs">
            <Droplets className="w-5 h-5 mx-auto text-[#2D5A43] mb-1.5" />
            <p className="text-[9px] sm:text-[10px] uppercase font-mono font-bold text-[#71717A] tracking-wider">Humidity</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#18181B] mt-0.5">
              {loading ? "..." : `${climate.humidity_pct}%`}
            </p>
            <span className={`inline-block mt-1 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${humidityBadge.color}`}>
              {humidityBadge.label}
            </span>
          </div>

          {/* Pollution / AQI Tile */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] text-center relative overflow-hidden transition-all shadow-2xs">
            <Wind className="w-5 h-5 mx-auto text-[#9E3A26] mb-1.5" />
            <p className="text-[9px] sm:text-[10px] uppercase font-mono font-bold text-[#71717A] tracking-wider">Pollution</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#18181B] mt-0.5">
              {loading ? "..." : aqiValue}
            </p>
            <span className={`inline-block mt-1 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${pollutionBadge.color}`}>
              {pollutionBadge.label}
            </span>
          </div>
        </div>

        {/* Data Source Label */}
        <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-[#FAF8F5] border border-[#E8E3DA] w-fit mx-auto mb-8 text-[10px] text-[#71717A] font-mono">
          <Radio className={`w-3 h-3 ${isCpcb ? "text-[#2D5A43]" : "text-[#9E3A26]"}`} />
          <span className="text-[#A8A193]">Source:</span>
          <span className="font-semibold text-[#52525B]">{dataSourceLabel}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto pt-5 border-t border-[#F0EBE1]">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 h-12 border border-[#E8E3DA] bg-[#FAF8F5] text-[#52525B] rounded-full font-semibold hover:bg-[#F2ECE3] hover:text-[#18181B] text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleNext}
            className="flex-[1.4] h-12 bg-[#9E3A26] hover:bg-[#832C1B] text-white rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-[0_8px_20px_-4px_rgba(158,58,38,0.22)] hover:shadow-[0_12px_24px_-4px_rgba(158,58,38,0.3)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
