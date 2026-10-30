import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Users,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  ArrowRight,
  Target,
  BarChart3,
  Radar as RadarIcon,
  Layers,
} from "lucide-react";

export default function SkinTelemetryGraph({
  attributes = [],
  userName = "You",
  onSelectAttribute,
  selectedAttributeId,
  graphType: propGraphType,
  onGraphTypeChange,
  isEmbedded = true,
}) {
  const [hoveredAttr, setHoveredAttr] = useState(null);
  const [internalGraphType, setInternalGraphType] = useState("radar"); // 'radar' | 'bars'
  const graphType = propGraphType || internalGraphType;
  const setGraphType = onGraphTypeChange || setInternalGraphType;

  const activeAttr = useMemo(() => {
    const id = hoveredAttr || selectedAttributeId;
    return attributes.find((a) => a.id === id) || attributes[0] || null;
  }, [hoveredAttr, selectedAttributeId, attributes]);

  // Geometry configuration for the 11-Axis Radar Chart
  const size = 520;
  const center = size / 2;
  const radius = 185;
  const total = attributes.length || 11;

  // Compute (x, y) coordinates for any value (0-100) on axis i
  const getCoordinates = (value, index) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const distance = (Math.max(10, Math.min(100, value)) / 100) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y, angle };
  };

  // Concentric guideline rings at 25%, 50%, 75%, 100%
  const gridRings = [0.25, 0.5, 0.75, 1.0];

  // User polygon points
  const userPolygonPoints = useMemo(() => {
    return attributes
      .map((attr, i) => {
        const { x, y } = getCoordinates(attr.userScore, i);
        return `${x},${y}`;
      })
      .join(" ");
  }, [attributes]);

  // Peer polygon points
  const peerPolygonPoints = useMemo(() => {
    return attributes
      .map((attr, i) => {
        const { x, y } = getCoordinates(attr.othersScore, i);
        return `${x},${y}`;
      })
      .join(" ");
  }, [attributes]);

  const content = (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-6 pb-4 border-b border-[#EADBFA]/70 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-[#7A35A3] border border-[#4A1766] shadow-xs" />
          <span className="font-bold text-[#4A1766]">You ({userName})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 border-t-2 border-dashed border-slate-400" />
          <span className="font-medium text-slate-500">Cohort Average (Others)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF3F] border border-[#BDE820]" />
          <span className="font-medium text-gray-700">Higher Area = Higher Clarity & Health</span>
        </div>
      </div>

      {/* GRAPH CONTENT */}
      {graphType === "radar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: The 11-Axis Interactive Radar Chart */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-[480px] aspect-square relative select-none">
              <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
                <defs>
                  {/* Luxury Lavender Gradient for User's Skin Shape */}
                  <linearGradient id="userRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C883EB" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#7A35A3" stopOpacity="0.25" />
                  </linearGradient>

                  {/* Cohort Outline Shadow */}
                  <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#7A35A3" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* Concentric Guide Polygons */}
                {gridRings.map((scale, ringIdx) => {
                  const ringRadius = radius * scale;
                  const points = attributes
                    .map((_, i) => {
                      const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
                      const x = center + ringRadius * Math.cos(angle);
                      const y = center + ringRadius * Math.sin(angle);
                      return `${x},${y}`;
                    })
                    .join(" ");

                  return (
                    <g key={ringIdx}>
                      <polygon
                        points={points}
                        fill={ringIdx % 2 === 0 ? "rgba(244, 232, 252, 0.15)" : "transparent"}
                        stroke="#EADBFA"
                        strokeWidth="1"
                        strokeDasharray={scale === 1 ? "none" : "3,3"}
                      />
                      {/* Percent labels along the top axis */}
                      <text
                        x={center + 6}
                        y={center - ringRadius + 12}
                        fontSize="9"
                        fill="#94a3b8"
                        fontFamily="sans-serif"
                        fontWeight="600"
                      >
                        {scale * 100}%
                      </text>
                    </g>
                  );
                })}

                {/* 11 Radial Axis Spoke Lines */}
                {attributes.map((attr, i) => {
                  const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
                  const x2 = center + radius * Math.cos(angle);
                  const y2 = center + radius * Math.sin(angle);
                  const isHovered = (hoveredAttr || selectedAttributeId) === attr.id;

                  return (
                    <line
                      key={attr.id}
                      x1={center}
                      y1={center}
                      x2={x2}
                      y2={y2}
                      stroke={isHovered ? "#7A35A3" : "#EADBFA"}
                      strokeWidth={isHovered ? "1.5" : "1"}
                      className="transition-colors duration-200"
                    />
                  );
                })}

                {/* Peer Cohort Polygon (Dashed Baseline) */}
                <polygon
                  points={peerPolygonPoints}
                  fill="rgba(148, 163, 184, 0.12)"
                  stroke="#94A3B8"
                  strokeWidth="1.8"
                  strokeDasharray="4,4"
                />

                {/* User's Telemetry Polygon (Vibrant Lavender) */}
                <polygon
                  points={userPolygonPoints}
                  fill="url(#userRadarGrad)"
                  stroke="#7A35A3"
                  strokeWidth="2.5"
                  filter="url(#radarGlow)"
                  className="transition-all duration-300"
                />

                {/* User Data Points (Vertices) & Interactive Hit Targets */}
                {attributes.map((attr, i) => {
                  const userCoords = getCoordinates(attr.userScore, i);
                  const peerCoords = getCoordinates(attr.othersScore, i);
                  const isSelected = (hoveredAttr || selectedAttributeId) === attr.id;

                  // Label position (pushed out slightly past radius)
                  const labelRadius = radius + 28;
                  const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
                  const lx = center + labelRadius * Math.cos(angle);
                  const ly = center + labelRadius * Math.sin(angle);

                  // Text alignment
                  const cos = Math.cos(angle);
                  const textAnchor = Math.abs(cos) < 0.25 ? "middle" : cos > 0 ? "start" : "end";

                  return (
                    <g key={attr.id} className="cursor-pointer">
                      {/* Peer Dot */}
                      <circle
                        cx={peerCoords.x}
                        cy={peerCoords.y}
                        r="3"
                        fill="#94A3B8"
                        opacity="0.7"
                      />

                      {/* User Vertex Circle */}
                      <circle
                        cx={userCoords.x}
                        cy={userCoords.y}
                        r={isSelected ? "6.5" : "4.5"}
                        fill={attr.delta >= 0 ? "#7A35A3" : "#C883EB"}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-all duration-200"
                      />

                      {/* Invisible larger hit circle for easy touch/mouse targeting */}
                      <circle
                        cx={userCoords.x}
                        cy={userCoords.y}
                        r="18"
                        fill="transparent"
                        onMouseEnter={() => setHoveredAttr(attr.id)}
                        onMouseLeave={() => setHoveredAttr(null)}
                        onClick={() => onSelectAttribute?.(attr.id)}
                      />

                      {/* Axis Label */}
                      <text
                        x={lx}
                        y={ly + 4}
                        textAnchor={textAnchor}
                        fontSize={isSelected ? "11" : "10"}
                        fontWeight={isSelected ? "700" : "600"}
                        fill={isSelected ? "#4A1766" : "#64748b"}
                        className="transition-all duration-200 select-none"
                        onMouseEnter={() => setHoveredAttr(attr.id)}
                        onMouseLeave={() => setHoveredAttr(null)}
                        onClick={() => onSelectAttribute?.(attr.id)}
                      >
                        {attr.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-[11px] text-gray-400 mt-2 text-center">
              Hover or tap any node to inspect detailed protocol telemetry.
            </p>
          </div>

          {/* Right: Live Interactive Telemetry Inspector Card */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {activeAttr ? (
                <motion.div
                  key={activeAttr.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 rounded-3xl bg-gradient-to-br from-[#FBF7FE] to-[#F4E8FC]/40 border-2 border-[#7A35A3]/30 shadow-sm space-y-4"
                >
                  {/* Top: Protocol # and Category Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-gray-400">
                      PROTOCOL #{activeAttr.indexNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        activeAttr.category === "Needs a boost"
                          ? "bg-[#F4E8FC] text-[#4A1766] border-[#EADBFA]"
                          : activeAttr.category === "Fine for now"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {activeAttr.category === "Needs a boost"
                        ? "Priority Focus"
                        : activeAttr.category === "Fine for now"
                        ? "Stable Baseline"
                        : "Optimal"}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-xl font-bold text-gray-900 leading-tight">
                      {activeAttr.label}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 italic">{activeAttr.checks}</p>
                  </div>

                  {/* Dual Telemetry Comparison Bars */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EADBFA] space-y-3 shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-gray-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#7A35A3]" />
                          <span>You ({userName}):</span>
                        </span>
                        <span className="font-mono font-bold text-[#4A1766]">{activeAttr.userScore}% Clarity</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#7A35A3] to-[#C883EB] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${activeAttr.userScore}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span>Cohort Average:</span>
                        </span>
                        <span className="font-mono font-semibold text-gray-500">{activeAttr.othersScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${activeAttr.othersScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Variance Callout */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">Cohort Variance:</span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          activeAttr.delta > 0
                            ? "bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820]"
                            : activeAttr.delta < 0
                            ? "bg-[#F4E8FC] text-[#4A1766] border border-[#EADBFA]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {activeAttr.delta > 0
                          ? `+${activeAttr.delta}% clearer than peers`
                          : activeAttr.delta < 0
                          ? `${activeAttr.delta}% below peer avg`
                          : "On par with peers"}
                      </span>
                    </div>
                  </div>

                  {/* Clinical Observation */}
                  <p className="text-xs text-gray-700 leading-relaxed bg-white/80 p-3 rounded-2xl border border-[#EADBFA]/80">
                    {activeAttr.shortTakeaway}
                  </p>

                  {/* Prescribed Active */}
                  <div className="p-3.5 rounded-2xl bg-[#7A35A3] text-white space-y-1 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4FF3F] block">
                      Prescribed Active Formula
                    </span>
                    <p className="font-bold text-sm text-white">{activeAttr.keyActive}</p>
                    <p className="text-[11px] text-[#F4E8FC]/90">{activeAttr.actionBenefit}</p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* GRAPH TYPE 2: HORIZON COMPARATIVE BARS VIEW */
        <div className="space-y-3">
          <div className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 pb-1 border-b border-[#EADBFA]">
            <span className="col-span-4 sm:col-span-3"># Protocol</span>
            <span className="col-span-5 sm:col-span-6">Visual Telemetry (You vs. Cohort)</span>
            <span className="col-span-3 text-right">Variance</span>
          </div>

          <div className="space-y-2">
            {attributes.map((attr) => {
              const isSelected = (hoveredAttr || selectedAttributeId) === attr.id;

              return (
                <div
                  key={attr.id}
                  onClick={() => onSelectAttribute?.(attr.id)}
                  onMouseEnter={() => setHoveredAttr(attr.id)}
                  onMouseLeave={() => setHoveredAttr(null)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer grid grid-cols-12 items-center gap-2 ${
                    isSelected
                      ? "bg-white border-[#7A35A3] shadow-xs ring-1 ring-[#7A35A3]/20"
                      : "bg-[#FBF7FE] border-[#EADBFA]/70 hover:bg-white hover:border-[#C883EB]"
                  }`}
                >
                  {/* Name */}
                  <div className="col-span-4 sm:col-span-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-gray-400">#{attr.indexNumber}</span>
                      <p className="font-bold text-xs text-gray-900 truncate">{attr.label}</p>
                    </div>
                  </div>

                  {/* Dual Horizontal Bars */}
                  <div className="col-span-5 sm:col-span-6 space-y-1">
                    {/* User bar */}
                    <div className="flex items-center gap-2">
                      <span className="w-8 font-mono text-[10px] font-bold text-[#4A1766] text-right">
                        {attr.userScore}%
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7A35A3] to-[#C883EB] rounded-full"
                          style={{ width: `${attr.userScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Peer bar */}
                    <div className="flex items-center gap-2">
                      <span className="w-8 font-mono text-[10px] text-gray-400 text-right">
                        {attr.othersScore}%
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${attr.othersScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Variance */}
                  <div className="col-span-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        attr.delta > 0
                          ? "bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820]"
                          : attr.delta < 0
                          ? "bg-[#F4E8FC] text-[#4A1766] border border-[#EADBFA]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {attr.delta > 0 ? `+${attr.delta}%` : `${attr.delta}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-[#EADBFA] shadow-xs">
      {content}
    </div>
  );
}
