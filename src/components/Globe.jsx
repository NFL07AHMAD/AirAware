import { cities } from "../data/cities.js";

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

export default Globe;
