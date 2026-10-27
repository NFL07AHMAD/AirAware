import { getAqiLevel } from "../utils/aqi.js";

function Globe({ cities, records, selected, onSelect, zoom, onWheelZoom, flat }) {
  const visible = cities.filter((city) => city.x != null && city.y != null);
  const selectedHidden = selected.x == null || selected.y == null;
  const circleTransform = flat
    ? `perspective(1000px) rotateX(14deg) scale(${zoom / 100})`
    : `scale(${zoom / 100})`;

  return (
    <div
      className="anim-globe-in relative mx-auto aspect-square w-full max-w-[760px]"
      style={{ animationDelay: "150ms" }}
      onWheel={(event) => {
        // Zoom dengan scroll hanya di layar lebar (di layar kecil halaman bisa di-scroll)
        if (window.innerWidth >= 1024) onWheelZoom(event.deltaY < 0 ? 5 : -5);
      }}
    >
      <div className="anim-float absolute inset-0">
        <div className="pointer-events-none absolute -inset-[5%] rounded-full bg-[radial-gradient(circle,transparent_62%,rgba(49,155,242,.20)_72%,transparent_81%)] blur-md" />

        {/* Cincin orbit + satelit */}
        <div
          className={`anim-orbit pointer-events-none absolute -inset-[8%] rounded-full border border-dashed border-sky-300/20 transition-opacity duration-700 ${
            flat ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_14px_#7dd3fc]" />
        </div>

        <div
          className={`absolute inset-0 overflow-hidden border border-sky-300/50 bg-[radial-gradient(ellipse_at_40%_35%,#111c2b,#070c15_65%,#020409)] shadow-[inset_-35px_-12px_80px_rgba(0,0,0,.8),0_0_32px_rgba(53,157,239,.16)] transition-[transform,border-radius] duration-700 ease-out ${
            flat ? "rounded-[6%]" : "rounded-[50%]"
          }`}
          style={{ transform: circleTransform }}
        >
          <div
            className={`pointer-events-none absolute inset-[10%_-4%] rounded-[50%] border border-sky-200/[0.08] shadow-[0_-48px_0_-47px_rgba(119,169,222,.12),0_48px_0_-47px_rgba(119,169,222,.12),0_112px_0_-111px_rgba(119,169,222,.1),0_-112px_0_-111px_rgba(119,169,222,.1)] transition-opacity duration-700 ${
              flat ? "opacity-0" : "opacity-100"
            }`}
          />

          <div
            className={`pointer-events-none absolute inset-[-1%_24%] rounded-[50%] border border-sky-200/[0.07] transition-opacity duration-700 before:absolute before:inset-0 before:rounded-[50%] before:border before:border-sky-200/[0.07] before:content-[''] after:absolute after:inset-x-[20%] after:rounded-[50%] after:border after:border-sky-200/[0.06] after:content-[''] ${
              flat ? "opacity-0" : "opacity-100"
            }`}
          />

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

          {/* Sapuan radar */}
          <div className="radar-sweep anim-radar pointer-events-none absolute -inset-1/4" />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_44%_43%,transparent_30%,rgba(2,5,10,.2)_68%,rgba(0,0,0,.72)_100%)]" />

          {visible.map((city, index) => {
            const record = records[city.id];
            const data = record?.data;
            const level = getAqiLevel(data?.aqi);
            const color = level.color;
            const active = city.id === selected.id;
            const severe = data?.aqi != null && data.aqi > 150;

            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelect(city)}
                title={`Lihat ${city.name}`}
                aria-label={`Lihat ${city.name}`}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 outline-none ${
                  active ? "z-20" : "z-10"
                }`}
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
              >
                <span
                  className="anim-pop-in block"
                  style={{ animationDelay: `${500 + index * 90}ms` }}
                >
                  {active && (
                    <span
                      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                      style={{
                        borderColor: `${color}88`,
                        backgroundColor: `${color}18`,
                        boxShadow: `0 0 35px ${color}30`,
                      }}
                    >
                      <span
                        className="absolute -inset-5 animate-ping rounded-full border opacity-30"
                        style={{ borderColor: color, animationDuration: "3s" }}
                      />
                      <span
                        className="absolute -inset-10 rounded-full border opacity-30"
                        style={{ borderColor: color }}
                      />
                    </span>
                  )}

                  {!active && severe && (
                    <span
                      className="anim-breathe pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ background: `${color}22` }}
                    />
                  )}

                  <span
                    className={`relative flex items-center gap-2 whitespace-nowrap rounded-full border bg-[#0b101a]/95 px-3 py-1.5 text-xs text-slate-200 shadow-lg backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:bg-slate-800 group-focus-visible:ring-2 group-focus-visible:ring-sky-400 ${
                      active ? "scale-110 border-white/30" : "border-white/[0.09]"
                    }`}
                    style={{ borderColor: active ? `${color}99` : undefined }}
                  >
                    <i
                      className="h-2 w-2 rounded-full"
                      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                    />
                    <span className={active ? "" : "hidden sm:inline"}>{city.name}</span>
                    <b
                      className={`font-mono text-[13px] ${
                        record?.loading && !data ? "animate-pulse" : ""
                      }`}
                      style={{ color }}
                    >
                      {data?.aqi ?? (record?.error ? "!" : "…")}
                    </b>
                  </span>
                </span>
              </button>
            );
          })}

          <div className="pointer-events-none absolute left-[43%] top-[60%] grid h-4 w-4 place-items-center rounded-full border border-white/15 text-xs text-slate-300/60">
            +
          </div>
        </div>
      </div>

      <div className="absolute -bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 whitespace-nowrap">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[1.5px] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#38dca4]" />
          AIR QUALITY MONITORING <span className="text-slate-700">/</span> SE ASIA
        </div>
        {selectedHidden && (
          <div className="anim-fade-up rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-slate-300">
            {selected.name} di luar area peta · data tetap tampil di card
          </div>
        )}
      </div>
    </div>
  );
}

export default Globe;