import { useMemo } from "react";

function makeChart(values) {
  const min = Math.min(...values) - 5;
  const max = Math.max(...values) + 5;
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 320;
      const y = 100 - ((value - min) / range) * 100;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function AirChart({ city }) {
  const path = useMemo(() => makeChart(city.history), [city]);
  const area = `${path} L 320 100 L 0 100 Z`;

  return (
    <div className="border-y border-white/[0.06] px-5 py-4">
      <div className="mb-4 flex items-center justify-between gap-2 text-[10px] text-slate-400">
        <span>24-Hour Air Quality Trend</span>
        <span className="font-mono text-orange-300">
          {city.history.at(-1) > city.history[0] ? "↗" : "↘"}{" "}
          {Math.abs(
            Math.round(
              ((city.history.at(-1) - city.history[0]) /
                city.history[0]) *
                100
            )
          )}
          %
        </span>
      </div>

      <svg
        viewBox="0 0 320 100"
        preserveAspectRatio="none"
        className="h-24 w-full overflow-visible"
        role="img"
        aria-label={`Tren AQI ${city.name}`}
      >
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={city.color} stopOpacity=".25" />
            <stop offset="100%" stopColor={city.color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[25, 50, 75].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="320"
            y2={y}
            stroke="rgba(255,255,255,.06)"
            strokeDasharray="3 5"
          />
        ))}

        <path d={area} fill="url(#chart-gradient)" />
        <path
          d={path}
          fill="none"
          stroke={city.color}
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="mt-2 flex justify-between font-mono text-[8px] text-slate-600">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>Now</span>
      </div>
    </div>
  );
}

export default AirChart;
