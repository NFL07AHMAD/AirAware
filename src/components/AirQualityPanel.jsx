import AirChart from "./AirChart.jsx";
import AnimatedNumber from "./AnimatedNumber.jsx";
import { glass } from "../constants/styles.js";
import {
  AQI_LEVELS,
  aqiToPercent,
  formatClock,
  formatCoordinates,
  getPrimaryPollutant,
} from "../utils/aqi.js";

function Skeleton() {
  return (
    <div className="animate-pulse px-6 pb-6 pt-3" aria-busy="true">
      <div className="flex items-center gap-4">
        <div className="h-[84px] w-[130px] rounded-2xl bg-white/[0.07]" />
        <div className="flex flex-1 flex-col gap-2.5">
          <div className="h-3.5 w-20 rounded-full bg-white/[0.07]" />
          <div className="h-3.5 w-28 rounded-full bg-white/[0.07]" />
        </div>
      </div>
      <div className="mt-5 h-2 rounded-full bg-white/[0.07]" />
      <div className="mt-5 h-16 rounded-xl bg-white/[0.05]" />
      <div className="mt-5 h-40 rounded-2xl bg-white/[0.05]" />
      <div className="mt-5 grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-white/[0.05]" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="px-6 pb-7 pt-4">
      <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-4">
        <p className="text-sm font-medium text-rose-200">
          Gagal memuat data kualitas udara
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
          {message}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400/25 active:scale-95"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}

function AirQualityPanel({ city, record, level, onRetry }) {
  const { data, loading, error } = record;

  const stats = data
    ? [
        { label: "PM2.5", value: data.pm25, unit: "µg/m³", decimals: 1 },
        { label: "PM10", value: data.pm10, unit: "µg/m³", decimals: 1 },
        { label: "Wind", value: data.wind, unit: "km/h", decimals: 1 },
        { label: "Temp", value: data.temperature, unit: "°C", decimals: 0 },
      ]
    : [];

  return (
    <aside
      className={`${glass} thin-scroll anim-slide-left pointer-events-auto relative max-h-full w-full overflow-y-auto rounded-2xl rounded-tl-[32px]`}
      style={{ animationDelay: "250ms" }}
    >
      <div key={city.id} className="anim-swap">
        <div className="flex items-start justify-between gap-3 px-6 pt-6">
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-[1.8px] text-slate-500">
              MONITORING STATION
            </p>
            <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight">
              {city.name}
            </h1>
            <p className="mt-1.5 text-[13px] text-slate-400">
              {city.country ? `${city.country} • ` : ""}
              {formatCoordinates(city.lat, city.lon)}
            </p>
          </div>

          <span
            className="mt-1 flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-500"
            style={{
              color: level.color,
              borderColor: `${level.color}40`,
              backgroundColor: `${level.color}14`,
            }}
          >
            <i
              className="h-2 w-2 rounded-full"
              style={{ background: level.color, boxShadow: `0 0 10px ${level.color}` }}
            />
            {data ? level.short : loading ? "Loading…" : "No data"}
          </span>
        </div>

        {!data && loading && <Skeleton />}
        {!data && !loading && (
          <ErrorState message={error ?? "Terjadi kesalahan."} onRetry={onRetry} />
        )}

        {data && (
          <>
            <div className="flex items-center gap-4 px-6 pb-4 pt-3">
              <span className="text-[84px] font-light leading-none tracking-[-4px] text-white">
                <AnimatedNumber value={data.aqi} />
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-200">US AQI</span>
                <span
                  className="text-[13px] font-medium leading-snug transition-colors duration-500"
                  style={{ color: level.color }}
                >
                  {level.label}
                </span>
                <span className="text-xs text-slate-500">
                  Primary: {getPrimaryPollutant(data.pm25, data.pm10)}
                </span>
              </div>
            </div>

            <div className="relative px-6 pb-5">
              <div className="flex gap-1">
                {AQI_LEVELS.map((item) => (
                  <span
                    key={item.key}
                    className="h-1.5 flex-1 rounded-full transition-opacity duration-500"
                    style={{
                      background: item.color,
                      opacity: item.key === level.key ? 1 : 0.35,
                    }}
                  />
                ))}
              </div>
              <span
                className="absolute top-[-4px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-white bg-[#10131b] shadow-[0_0_12px_rgba(255,255,255,.5)] transition-[left] duration-1000 ease-out"
                style={{
                  left: `calc(1.5rem + (100% - 3rem) * ${aqiToPercent(data.aqi) / 100})`,
                }}
              />
            </div>

            <div
              className="mx-6 mb-5 rounded-xl border px-4 py-3 text-[13px] leading-relaxed text-slate-300 transition-colors duration-500"
              style={{
                borderColor: `${level.color}33`,
                backgroundColor: `${level.color}0f`,
              }}
            >
              <b className="font-semibold" style={{ color: level.color }}>
                Saran:{" "}
              </b>
              {level.advice}
            </div>

            <AirChart city={city} data={data} color={level.color} />

            <div className="grid grid-cols-4 px-6 py-5">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex min-w-0 flex-col gap-1.5 ${
                    index > 0 ? "border-l border-white/[0.07] pl-3" : ""
                  }`}
                >
                  <span className="text-xs text-slate-500">{stat.label}</span>
                  <b className="font-mono text-lg font-normal text-slate-100">
                    <AnimatedNumber value={stat.value} decimals={stat.decimals} />
                  </b>
                  <span className="text-[11px] text-slate-600">{stat.unit}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5 border-t border-white/[0.07] px-6 py-4 font-mono text-[11px] tracking-wide text-slate-500">
              <i
                className={`h-2 w-2 rounded-full ${
                  error ? "bg-amber-400" : "bg-emerald-400"
                } ${loading ? "animate-pulse" : ""}`}
              />
              {error
                ? "GAGAL MEMPERBARUI"
                : loading
                  ? "MEMPERBARUI…"
                  : "LIVE DATA · OPEN-METEO"}
              <span className="ml-auto text-slate-400">
                {formatClock(data.updatedAt)} {data.timezone}
              </span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default AirQualityPanel;