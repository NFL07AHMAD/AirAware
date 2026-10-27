import { cities } from "../data/cities.js";
import { glass } from "../constants/styles.js";

function Header({ search, setSearch, filtered, chooseCity, mode, setMode }) {
  return (
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
  );
}

export default Header;
