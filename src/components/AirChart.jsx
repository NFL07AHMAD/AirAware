import { useId, useMemo, useState } from "react";
import {
  formatClock,
  formatDayTime,
  getAqiLevel,
  sliceSeries,
} from "../utils/aqi.js";

const W = 320;
const H = 120;
const PAD_TOP = 12;
const PAD_BOTTOM = 8;

const RANGES = [
  { key: "past", label: "24 Jam Terakhir" },
  { key: "future", label: "Prakiraan 24 Jam" },
];

function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  const t = 0.18;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) * t;
    const c1y = p1.y + (p2.y - p0.y) * t;
    const c2x = p2.x - (p3.x - p1.x) * t;
    const c2y = p2.y - (p3.y - p1.y) * t;

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

function AirChart({ city, data, color }) {
  const [range, setRange] = useState("past");
  const [hoverIndex, setHoverIndex] = useState(null);
  const gradientId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const points = useMemo(() => {
    const raw = sliceSeries(data.series, data.nowIndex, range);
    if (raw.length < 2) return [];

    const values = raw.map((p) => p.aqi);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const pad = Math.max(6, (hi - lo) * 0.2);
    const min = Math.max(0, lo - pad);
    const max = hi + pad;
    const span = max - min || 1;

    return raw.map((p, i) => ({
      ...p,
      x: (i / (raw.length - 1)) * W,
      y: PAD_TOP + (1 - (p.aqi - min) / span) * (H - PAD_TOP - PAD_BOTTOM),
    }));
  }, [data, range]);

  const line = useMemo(() => smoothPath(points), [points]);

  function changeRange(next) {
    setRange(next);
    setHoverIndex(null);
  }

  function handleMove(event) {
    if (points.length < 2) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    setHoverIndex(Math.round(ratio * (points.length - 1)));
  }

  const hovered =
    hoverIndex != null && points.length
      ? points[Math.min(hoverIndex, points.length - 1)]
      : null;

  const nowPoint =
    points.length > 0
      ? range === "past"
        ? points[points.length - 1]
        : points[0]
      : null;

  let trend = null;
  if (points.length > 1) {
    const first = points[0].aqi;
    const last = points[points.length - 1].aqi;
    const diff = last - first;
    const pct = first > 0 ? Math.round((Math.abs(diff) / first) * 100) : null;
    trend = {
      arrow: diff > 0 ? "↗" : diff < 0 ? "↘" : "→",
      text: pct != null ? `${pct}%` : `${Math.abs(diff)}`,
      color: diff > 0 ? "#ff7a8e" : diff < 0 ? "#44d8a2" : "#94a3b8",
    };
  }

  const labelIndexes = [0, 0.25, 0.5, 0.75, 1].map((f) =>
    Math.round(f * (points.length - 1))
  );

  return (
    <div className="border-y border-white/[0.06] px-6 py-5">
      <div className="mb-3 flex rounded-full bg-white/[0.05] p-1">
        {RANGES.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => changeRange(item.key)}
            aria-pressed={range === item.key}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition duration-300 ${
              range === item.key
                ? "bg-white/10 text-white shadow"
                : "text-slate-500 hover:text-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex min-h-[20px] items-center justify-between gap-2 text-[13px]">
        {hovered ? (
          <>
            <span className="text-slate-300">{formatDayTime(hovered.time)}</span>
            <span
              className="font-mono font-medium"
              style={{ color: getAqiLevel(hovered.aqi).color }}
            >
              AQI {Math.round(hovered.aqi)}
            </span>
          </>
        ) : (
          <>
            <span className="text-slate-400">
              Tren AQI ·{" "}
              {range === "past" ? "24 jam terakhir" : "24 jam ke depan"}
            </span>
            {trend && (
              <span className="font-mono font-medium" style={{ color: trend.color }}>
                {trend.arrow} {trend.text}
              </span>
            )}
          </>
        )}
      </div>

      {points.length > 1 ? (
        <svg
          key={`${city.id}-${range}`}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full cursor-crosshair touch-pan-y overflow-visible"
          role="img"
          aria-label={`Grafik tren AQI ${city.name}`}
          onPointerMove={handleMove}
          onPointerDown={handleMove}
          onPointerLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.38" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((f) => {
            const y = PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * f;
            return (
              <line
                key={f}
                x1="0"
                y1={y}
                x2={W}
                y2={y}
                stroke="rgba(255,255,255,.07)"
                strokeDasharray="3 5"
              />
            );
          })}

          <path
            className="chart-area"
            d={`${line} L ${W} ${H} L 0 ${H} Z`}
            fill={`url(#${gradientId})`}
          />
          <path
            className="chart-line"
            d={line}
            pathLength="1"
            fill="none"
            stroke={color}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {nowPoint && (
            <g>
              <circle cx={nowPoint.x} cy={nowPoint.y} r="4.5" fill={color} />
              <circle
                cx={nowPoint.x}
                cy={nowPoint.y}
                r="4.5"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
              >
                <animate attributeName="r" values="4.5;13" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {hovered && (
            <g pointerEvents="none">
              <line
                x1={hovered.x}
                y1="0"
                x2={hovered.x}
                y2={H}
                stroke="rgba(255,255,255,.3)"
                strokeDasharray="3 3"
              />
              <circle
                cx={hovered.x}
                cy={hovered.y}
                r="5"
                fill="#0b101a"
                stroke={getAqiLevel(hovered.aqi).color}
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>
      ) : (
        <p className="py-8 text-center text-[13px] text-slate-500">
          Data grafik belum tersedia.
        </p>
      )}

      {points.length > 1 && (
        <div className="mt-2.5 flex justify-between font-mono text-[11px] text-slate-500">
          {labelIndexes.map((idx, i) => {
            const isNow =
              (range === "past" && i === labelIndexes.length - 1) ||
              (range === "future" && i === 0);
            return (
              <span key={i} className={isNow ? "text-sky-300" : ""}>
                {isNow ? "Now" : formatClock(points[idx].time)}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AirChart;