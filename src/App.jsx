
import { useMemo, useState } from "react";

const cities = [
  {
    name: "Jakarta",
    country: "Indonesia",
    lat: -6.2,
    lon: 106.84,
    aqi: 152,
    pm25: 64.8,
    pm10: 92.4,
    wind: 14,
    color: "#ff607c",
    status: "Unhealthy",
    x: 48,
    y: 57,
    history: [32, 35, 42, 53, 57, 54, 64, 72, 89, 108, 126, 139, 152],
  },
  {
    name: "Singapore",
    country: "Singapore",
    lat: 1.35,
    lon: 103.82,
    aqi: 38,
    pm25: 9.2,
    pm10: 18.5,
    wind: 11,
    color: "#36d9a0",
    status: "Good",
    x: 39,
    y: 43,
    history: [42, 39, 41, 36, 35, 38, 32, 34, 37, 35, 39, 37, 38],
  },
  {
    name: "Kuala Lumpur",
    country: "Malaysia",
    lat: 3.14,
    lon: 101.69,
    aqi: 68,
    pm25: 20.1,
    pm10: 34.2,
    wind: 9,
    color: "#ffc45b",
    status: "Moderate",
    x: 32,
    y: 37,
    history: [45, 49, 53, 47, 52, 56, 61, 58, 64, 62, 65, 67, 68],
  },
  {
    name: "Bangkok",
    country: "Thailand",
    lat: 13.75,
    lon: 100.5,
    aqi: 91,
    pm25: 31.4,
    pm10: 45.7,
    wind: 8,
    color: "#ffb65b",
    status: "Moderate",
    x: 26,
    y: 28,
    history: [65, 68, 70, 75, 72, 78, 82, 79, 84, 86, 88, 89, 91],
  },
];

const glass =
  "border border-white/[0.08] bg-[#10131b]/85 shadow-2xl backdrop-blur-2xl";

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

function Globe({ selected, onSelect, zoom, flat }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[700px]">
      <div className="absolute -inset-[5%] rounded-full bg-[radial-gradient(circle,transparent_62%,rgba(49,155,242,.20)_72%,transparent_81%)] blur-md" />

      <div
        className={`absolute inset-0 overflow-hidden border border-sky-300/50 bg-[radial-gradient(ellipse_at_40%_35%,#111c2b,#070c15_65%,#020409)] shadow-[inset_-35px_-12px_80px_rgba(0,0,0,.8),0_0_32px_rgba(53,157,239,.16)] transition-transform duration-300 ${
          flat ? "rounded-2xl [transform:perspective(900px)_rotateX(12deg)]" : "rounded-full"
        }`}
        style={{ transform: `scale(${zoom / 100})` }}
      >
        <div className="pointer-events-none absolute inset-[10%_-4%] rounded-[50%] border border-sky-200/[0.08] shadow-[0_-48px_0_-47px_rgba(119,169,222,.12),0_48px_0_-47px_rgba(119,169,222,.12),0_112px_0_-111px_rgba(119,169,222,.1),0_-112px_0_-111px_rgba(119,169,222,.1)]" />

        <div className="pointer-events-none absolute inset-[-1%_24%] rounded-[50%] border border-sky-200/[0.07] before:absolute before:inset-0 before:rounded-[50%] before:border before:border-sky-200/[0.07] before:content-[''] after:absolute after:inset-x-[20%] after:rounded-[50%] after:border after:border-sky-200/[0.06] after:content-['']" />

        <svg
          viewBox="0 0 600 600"
          className="absolute inset-0 h-full w-full fill-[#101b2b]/80 stroke-[#1a2a40] stroke-[1.2]"
          aria-label="Ilustrasi daratan globe"
        >
          <path d="M150 140 Q180 120 205 153 L231 183 221 217 238 244 215 275 197 305 170 290 154 254 130 230 121 189Z" />
          <path d="M226 303 L257 318 269 358 254 395 248 442 224 467 210 428 201 390 190 359Z" />
          <path d="M300 175 Q321 184 325 212 L313 235 298 214Z" />
          <path d="M318 255 L339 264 348 288 335 315 322 300Z" />
          <path d="M347 310 L389 318 423 335 409 349 372 341 348 329Z" />
          <path d="M388 381 Q424 354 469 383 L491 412 486 453 449 478 412 465 389 433Z" />
          <path d="M283 267 L298 277 291 298 277 290Z" />
          <path d="M359 241 L373 247 378 265 369 277 357 263Z" />
        </svg>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_44%_43%,transparent_30%,rgba(2,5,10,.2)_68%,rgba(0,0,0,.72)_100%)]" />

        {cities.map((city) => {
          const active = selected.name === city.name;

          return (
            <button
              key={city.name}
              onClick={() => onSelect(city)}
              title={`Lihat ${city.name}`}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${city.x}%`,
                top: `${city.y}%`,
              }}
            >
              {active && (
                <span
                  className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{
                    borderColor: `${city.color}88`,
                    backgroundColor: `${city.color}18`,
                    boxShadow: `0 0 35px ${city.color}30`,
                  }}
                >
                  <span
                    className="absolute -inset-4 animate-ping rounded-full border opacity-30"
                    style={{ borderColor: city.color, animationDuration: "3s" }}
                  />
                  <span
                    className="absolute -inset-8 rounded-full border opacity-30"
                    style={{ borderColor: city.color }}
                  />
                </span>
              )}

              <span
                className="relative flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/[0.09] bg-[#0b101a]/95 px-2.5 py-1.5 text-[10px] text-slate-200 shadow-lg backdrop-blur-xl transition hover:bg-slate-800"
                style={{
                  borderColor: active ? `${city.color}77` : undefined,
                }}
              >
                <i
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: city.color,
                    boxShadow: `0 0 8px ${city.color}`,
                  }}
                />
                {city.name}
                <b style={{ color: city.color }}>{city.aqi}</b>
              </span>
            </button>
          );
        })}

        <div className="pointer-events-none absolute left-[43%] top-[60%] grid h-4 w-4 place-items-center rounded-full border border-white/15 text-xs text-slate-300/60">
          +
        </div>
      </div>

      <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap font-mono text-[8px] tracking-[1.5px] text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#38dca4]" />
        AIR QUALITY MONITORING <span className="text-slate-700">/</span> SE ASIA
      </div>
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState(cities[0]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("Globe");
  const [zoom, setZoom] = useState(100);
  const [hour, setHour] = useState(14);
  const [playing, setPlaying] = useState(false);

  const filtered = cities.filter((city) =>
    `${city.name} ${city.country}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const time = `${String(hour).padStart(2, "0")}:00 WIB`;

  function chooseCity(city) {
    setSelected(city);
    setSearch("");
  }

  return (
    <main className="relative isolate h-screen min-h-[620px] overflow-hidden bg-[#05070b] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_58%_45%,rgba(13,26,44,.4),transparent_48%),linear-gradient(145deg,#07090d,#05070b_65%,#080a10)]" />
      <div className="pointer-events-none absolute left-[35%] top-[15%] -z-10 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px]" />

      <header className="absolute inset-x-4 top-4 z-30 flex items-center justify-between gap-3 md:inset-x-6 md:top-5">
        <div className={`${glass} relative flex h-10 w-full max-w-[420px] items-center rounded-full px-3`}>
          <button
            className="flex shrink-0 items-center gap-2 text-xs font-semibold"
            onClick={() => chooseCity(cities[0])}
          >
            <span className="grid h-4 w-4 place-items-center rounded-full border border-slate-200 text-sky-400">
              ⊙
            </span>
            Aether
          </button>

          <span className="mx-3 h-4 w-px bg-white/10" />

          <div className="relative flex min-w-0 flex-1 items-center gap-2">
            <span className="text-xl text-slate-500">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search location or coordinates..."
              aria-label="Cari kota"
              className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-slate-600"
            />

            {search && (
              <div className="absolute left-0 right-0 top-9 overflow-hidden rounded-xl border border-white/10 bg-[#10141c] p-1 shadow-2xl">
                {filtered.length ? (
                  filtered.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => chooseCity(city)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-xs hover:bg-white/5"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: city.color }}
                      />
                      <span>{city.name}</span>
                      <span className="flex-1 text-slate-500">{city.country}</span>
                      <b style={{ color: city.color }}>{city.aqi}</b>
                    </button>
                  ))
                ) : (
                  <p className="p-3 text-xs text-slate-500">Lokasi tidak ditemukan.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <nav className={`${glass} flex h-10 shrink-0 items-center gap-1 rounded-full p-1`}>
          <span className="hidden items-center gap-1.5 px-2 text-[10px] text-slate-300 sm:flex">
            <i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
          {["Globe", "Flat"].map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`rounded-full px-3 py-2 text-[10px] transition ${
                mode === item
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <section className="absolute inset-0">
        <aside className={`${glass} absolute left-5 top-1/2 z-20 w-[min(315px,calc(100vw-40px))] -translate-y-[43%] overflow-hidden rounded-tl-[22px] md:left-[4.6vw]`}>
          <div className="flex items-start justify-between gap-2 px-5 pt-5">
            <div>
              <p className="font-mono text-[8px] tracking-[1.6px] text-slate-500">
                MONITORING STATION
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                {selected.name}
              </h1>
              <p className="mt-1 text-[10px] text-slate-500">
                {selected.country} • {Math.abs(selected.lat).toFixed(2)}
                {selected.lat < 0 ? "°S" : "°N"}, {selected.lon.toFixed(2)}°E
              </p>
            </div>

            <span
              className="mt-1 flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1.5 text-[9px]"
              style={{
                color: selected.color,
                borderColor: `${selected.color}25`,
                backgroundColor: `${selected.color}0d`,
              }}
            >
              <i
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: selected.color }}
              />
              {selected.status}
            </span>
          </div>

          <div className="flex items-center gap-3 px-5 pb-3 pt-2">
            <span className="text-[62px] font-normal leading-none tracking-[-4px]">
              {selected.aqi}
            </span>
            <div className="flex flex-col gap-1 text-[10px] text-slate-400">
              <span>US AQI</span>
              <span className="text-[9px] text-slate-600">Primary: PM2.5</span>
            </div>
          </div>

          <div className="flex gap-1 px-5 pb-4">
            {["#44d8a2", "#f5d45e", "#ff9b55", "#ff607c", "#b57bfa"].map(
              (color) => (
                <span
                  key={color}
                  className="h-[3px] flex-1 rounded-full"
                  style={{ background: color }}
                />
              )
            )}
          </div>

          <AirChart city={selected} />

          <div className="grid grid-cols-3 px-5 py-4">
            {[
              ["PM2.5", selected.pm25, "µg/m³"],
              ["PM10", selected.pm10, "µg/m³"],
              ["Wind", selected.wind, "km/h"],
            ].map(([label, value, unit], index) => (
              <div
                key={label}
                className={`flex flex-col gap-1.5 ${
                  index > 0 ? "border-l border-white/[0.07] pl-3" : ""
                }`}
              >
                <span className="text-[9px] text-slate-500">{label}</span>
                <b className="font-mono text-base font-normal text-slate-200">
                  {value}
                </b>
                <span className="text-[9px] text-slate-600">{unit}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-white/[0.07] px-5 py-3 font-mono text-[8px] tracking-wide text-slate-500">
            <i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            SIMULATED DATA
            <span className="ml-auto text-slate-400">{time}</span>
          </div>
        </aside>

        <section className="absolute left-[61%] top-[49%] hidden w-[min(59vw,690px)] -translate-x-1/2 -translate-y-1/2 lg:block">
          <Globe
            selected={selected}
            onSelect={chooseCity}
            zoom={zoom}
            flat={mode === "Flat"}
          />
        </section>

        <div className={`${glass} absolute right-4 top-[43%] z-20 flex -translate-y-1/2 flex-col items-center rounded-full py-1 md:right-6`}>
          <button
            title="Reset zoom"
            onClick={() => setZoom(100)}
            className="grid h-8 w-9 place-items-center text-lg text-slate-300 hover:text-sky-400"
          >
            ⊕
          </button>
          <span className="h-px w-5 bg-white/[0.06]" />
          <button
            title="Perbesar"
            onClick={() => setZoom((value) => Math.min(130, value + 10))}
            className="grid h-8 w-9 place-items-center text-xl text-slate-300 hover:text-sky-400"
          >
            +
          </button>
          <button
            title="Perkecil"
            onClick={() => setZoom((value) => Math.max(80, value - 10))}
            className="grid h-8 w-9 place-items-center text-xl text-slate-300 hover:text-sky-400"
          >
            −
          </button>
          <span className="h-px w-5 bg-white/[0.06]" />
          <button
            title="Ganti mode"
            onClick={() => setMode(mode === "Globe" ? "Flat" : "Globe")}
            className="grid h-8 w-9 place-items-center text-xl text-sky-400"
          >
            ◈
          </button>
        </div>

        <div className="absolute bottom-24 right-6 hidden items-center gap-3 font-mono text-[8px] text-slate-500 xl:flex">
          <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Good</span>
          <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-amber-300" />Moderate</span>
          <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-rose-400" />Unhealthy</span>
        </div>
      </section>

      <footer className={`${glass} absolute bottom-6 left-1/2 z-30 flex w-[min(440px,calc(100vw-24px))] -translate-x-1/2 items-center gap-3 rounded-full px-3 py-2`}>
        <button
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause timeline" : "Play timeline"}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[10px] hover:bg-sky-400/20"
        >
          {playing ? "Ⅱ" : "▶"}
        </button>

        <span className="shrink-0 whitespace-nowrap font-mono text-[9px] text-slate-300">
          {time}
        </span>

        <input
          type="range"
          min="0"
          max="23"
          value={hour}
          onChange={(event) => {
            setHour(Number(event.target.value));
            setPlaying(false);
          }}
          aria-label="Pilih waktu"
          className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 accent-sky-400"
        />

        <span className="h-6 w-px shrink-0 bg-white/[0.08]" />

        <div className="flex shrink-0 items-center gap-2 font-mono text-[9px] text-slate-400">
          AQI
          <span className="h-1 w-[54px] rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 via-orange-400 to-fuchsia-500 sm:w-[84px]" />
        </div>
      </footer>

      <div className="pointer-events-none absolute bottom-2 left-5 right-5 hidden justify-between font-mono text-[8px] text-slate-600 md:flex">
        <span>AE / 01</span>
        <span>Atmospheric Intelligence Interface</span>
        <span>Demo · Data simulasi</span>
      </div>

      <div className="absolute inset-x-4 top-[115px] z-10 lg:hidden">
        <Globe
          selected={selected}
          onSelect={chooseCity}
          zoom={zoom}
          flat={mode === "Flat"}
        />
      </div>
    </main>
  );
}

export default App;
