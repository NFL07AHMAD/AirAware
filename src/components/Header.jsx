import { useEffect, useMemo, useRef, useState } from "react";
import { glass } from "../constants/styles.js";
import { searchLocations } from "../services/airQualityApi.js";
import { getAqiLevel, parseCoordinates } from "../utils/aqi.js";
import { CloseIcon, PinIcon, RefreshIcon, SearchIcon } from "./Icons.jsx";

const CONNECTION = {
  live: { label: "Live", dot: "bg-emerald-400", ping: true },
  syncing: { label: "Updating", dot: "bg-amber-300", ping: true },
  loading: { label: "Loading", dot: "bg-amber-300", ping: true },
  error: { label: "Offline", dot: "bg-rose-400", ping: false },
};

function Header({
  cities,
  records,
  mode,
  setMode,
  connection,
  refreshing,
  onRefresh,
  onSelectCity,
  onSelectPlace,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [remote, setRemote] = useState({ query: "", items: [] });
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const trimmed = query.trim();
  const status = CONNECTION[connection] ?? CONNECTION.loading;

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Pencarian lokasi (geocoding) dengan debounce
  useEffect(() => {
    if (trimmed.length < 2) return undefined;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const items = await searchLocations(trimmed, controller.signal);
        setRemote({ query: trimmed, items });
      } catch (error) {
        if (error?.name !== "AbortError") {
          setRemote({ query: trimmed, items: [] });
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  const searching = trimmed.length >= 2 && remote.query !== trimmed;

  const options = useMemo(() => {
    const q = trimmed.toLowerCase();
    const list = [];

    cities
      .filter((city) => !q || `${city.name} ${city.country}`.toLowerCase().includes(q))
      .forEach((city) => {
        const aqi = records[city.id]?.data?.aqi ?? null;
        list.push({
          key: `city-${city.id}`,
          group: q ? "Lokasi tersedia" : "Kota pantauan",
          title: city.name,
          subtitle: city.country,
          aqi,
          color: getAqiLevel(aqi).color,
          onSelect: () => onSelectCity(city),
        });
      });

    const coords = parseCoordinates(trimmed);
    if (coords) {
      list.push({
        key: "coords",
        group: "Koordinat",
        title: `${coords.lat}, ${coords.lon}`,
        subtitle: "Gunakan koordinat ini",
        pin: true,
        onSelect: () =>
          onSelectPlace({
            id: `coord-${coords.lat}_${coords.lon}`,
            name: `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}`,
            country: "Koordinat kustom",
            lat: coords.lat,
            lon: coords.lon,
          }),
      });
    }

    if (trimmed.length >= 2 && remote.query === trimmed) {
      remote.items.forEach((item) => {
        const duplicate = cities.some(
          (city) =>
            Math.abs(city.lat - item.latitude) < 0.3 &&
            Math.abs(city.lon - item.longitude) < 0.3
        );
        if (duplicate) return;
        list.push({
          key: `geo-${item.id}`,
          group: "Hasil pencarian",
          title: item.name,
          subtitle: [item.admin1, item.country].filter(Boolean).join(", "),
          pin: true,
          onSelect: () =>
            onSelectPlace({
              id: `geo-${item.id}`,
              name: item.name,
              country: item.country || item.admin1 || "",
              lat: item.latitude,
              lon: item.longitude,
            }),
        });
      });
    }

    return list;
  }, [cities, records, trimmed, remote, onSelectCity, onSelectPlace]);

  function choose(option) {
    option.onSelect();
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.blur();
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter") {
      const option = options[Math.min(activeIndex, options.length - 1)];
      if (option) {
        event.preventDefault();
        choose(option);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
      event.currentTarget.blur();
    }
  }

  const showMenu = open && (options.length > 0 || trimmed.length > 0);
  let lastGroup = "";

  return (
    <header className="anim-fade-down absolute inset-x-4 top-4 z-30 flex items-center justify-between gap-3 md:inset-x-6 md:top-5">
      <div
        ref={containerRef}
        className={`${glass} relative flex h-14 w-full max-w-[480px] items-center rounded-full px-4`}
      >
        <button
          type="button"
          className="flex shrink-0 items-center gap-2.5 text-sm font-semibold transition hover:text-sky-300"
          onClick={() => onSelectCity(cities[0])}
          title="Kembali ke kota utama"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full border border-slate-200/80 text-sm text-sky-400">
            ⊙
          </span>
          <span className="hidden sm:inline">Aether</span>
        </button>

        <span className="mx-3 h-5 w-px bg-white/10" />

        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <SearchIcon className="h-5 w-5 shrink-0 text-slate-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Cari kota atau koordinat..."
            aria-label="Cari lokasi"
            autoComplete="off"
            spellCheck="false"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
          {query && (
            <button
              type="button"
              aria-label="Hapus pencarian"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {showMenu && (
          <div className="anim-menu-in thin-scroll absolute left-0 right-0 top-[calc(100%+10px)] max-h-[60vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#10141c]/95 p-2 shadow-2xl backdrop-blur-xl">
            {options.map((option, index) => {
              const showGroup = option.group !== lastGroup;
              lastGroup = option.group;
              return (
                <div key={option.key}>
                  {showGroup && (
                    <p className="px-3 pb-1 pt-2 font-mono text-[11px] tracking-[1.4px] text-slate-500">
                      {option.group.toUpperCase()}
                    </p>
                  )}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(option)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      index === activeIndex ? "bg-white/[0.08]" : "hover:bg-white/5"
                    }`}
                  >
                    {option.pin ? (
                      <PinIcon className="h-4 w-4 shrink-0 text-sky-300" />
                    ) : (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: option.color, boxShadow: `0 0 8px ${option.color}` }}
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-slate-100">{option.title}</span>
                      {option.subtitle && (
                        <span className="block truncate text-xs text-slate-500">
                          {option.subtitle}
                        </span>
                      )}
                    </span>
                    {!option.pin && (
                      <b className="font-mono text-sm" style={{ color: option.color }}>
                        {option.aqi ?? "…"}
                      </b>
                    )}
                  </button>
                </div>
              );
            })}

            {searching && (
              <p className="animate-pulse px-3 py-3 text-[13px] text-slate-500">
                Mencari lokasi…
              </p>
            )}
            {!searching && options.length === 0 && (
              <p className="px-3 py-3 text-[13px] text-slate-500">
                Lokasi tidak ditemukan.
              </p>
            )}
          </div>
        )}
      </div>

      <nav
        className={`${glass} flex h-14 shrink-0 items-center gap-1 rounded-full p-1.5`}
      >
        <span className="hidden items-center gap-2 px-3 text-xs font-medium text-slate-200 md:flex">
          <span className="relative flex h-2 w-2">
            {status.ping && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${status.dot}`}
              />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${status.dot}`} />
          </span>
          {status.label}
        </span>

        <button
          type="button"
          onClick={onRefresh}
          title="Perbarui data"
          aria-label="Perbarui data"
          className="grid h-10 w-10 place-items-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-sky-300 active:scale-90"
        >
          <RefreshIcon className={`h-[18px] w-[18px] ${refreshing ? "animate-spin" : ""}`} />
        </button>

        {["Globe", "Flat"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            aria-pressed={mode === item}
            className={`rounded-full px-4 py-2.5 text-xs font-medium transition duration-300 active:scale-95 ${
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