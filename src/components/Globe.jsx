import { getAqiLevel } from "../utils/aqi.js";
import { graticule, landPaths } from "../data/geography.js";

// Posisi label relatif terhadap titik kota
const SIDE_CLASS = {
  right: "left-full top-1/2 ml-2.5 -translate-y-1/2",
  left: "right-full top-1/2 mr-2.5 -translate-y-1/2",
  top: "bottom-full left-1/2 mb-2.5 -translate-x-1/2",
  topRight: "bottom-full left-0 mb-3 -ml-3",
  bottom: "left-1/2 top-full mt-2.5 -translate-x-1/2",
};

function pickSide(city) {
  if (city.side) return city.side;
  if (city.y != null && city.y < 12) return "bottom";
  return city.x != null && city.x > 62 ? "left" : "right";
}

function Globe({ cities, records, selected, onSelect, zoom, onWheelZoom, flat }) {
  const isVisible = (city) => (flat ? city.onMap : city.onGlobe);
  const visible = cities.filter(isVisible);
  const selectedHidden = !isVisible(selected);
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
          <svg
            viewBox="0 0 600 600"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Peta Asia Tenggara"
          >
            <g fill="none" strokeWidth="1">
              {graticule.map((line) => (
                <path
                  key={line.key}
                  d={line.d}
                  stroke="#7dd3fc"
                  strokeOpacity={line.major ? 0.22 : 0.09}
                  strokeDasharray={line.major ? "6 6" : undefined}
                />
              ))}
            </g>
            <g className="fill-[#14253b] stroke-[#2f4d73]" strokeWidth="1" strokeLinejoin="round">
              {landPaths.map((land) => (
                <path key={land.name} d={land.d} />
              ))}
            </g>
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
                  className="anim-pop-in relative block h-3.5 w-3.5"
                  style={{ animationDelay: `${500 + index * 90}ms` }}
                >
                  {active && (
                    <span
                      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                      style={{
                        borderColor: `${color}88`,
                        backgroundColor: `${color}18`,
                        boxShadow: `0 0 35px ${color}30`,
                      }}
                    >
                      <span
                        className="absolute -inset-4 animate-ping rounded-full border opacity-30"
                        style={{ borderColor: color, animationDuration: "3s" }}
                      />
                      <span
                        className="absolute -inset-8 rounded-full border opacity-30"
                        style={{ borderColor: color }}
                      />
                    </span>
                  )}

                  {!active && severe && (
                    <span
                      className="anim-breathe pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ background: `${color}22` }}
                    />
                  )}

                  {/* Titik lokasi kota yang tepat */}
                  <span
                    className="absolute inset-0 rounded-full border-2 border-[#0b101a] transition duration-300 group-hover:scale-125"
                    style={{ background: color, boxShadow: `0 0 12px ${color}` }}
                  />

                  {/* Label kota */}
                  <span
                    className={`absolute flex items-center gap-2 whitespace-nowrap rounded-full border bg-[#0b101a]/95 px-3 py-1.5 text-xs text-slate-200 shadow-lg backdrop-blur-xl transition duration-300 group-hover:bg-slate-800 group-focus-visible:ring-2 group-focus-visible:ring-sky-400 ${
                      SIDE_CLASS[pickSide(city)]
                    } ${active ? "border-white/30" : "border-white/[0.09]"}`}
                    style={{ borderColor: active ? `${color}99` : undefined }}
                  >
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