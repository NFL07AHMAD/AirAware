import { getAqiLevel } from "../utils/aqi.js";

// Daftar kota yang bisa digeser (khusus layar kecil, karena globe lebih kecil)
function CityTabs({ cities, records, selectedId, onSelect }) {
  return (
    <div className="thin-scroll -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
      {cities.map((city) => {
        const aqi = records[city.id]?.data?.aqi ?? null;
        const color = getAqiLevel(aqi).color;
        const active = city.id === selectedId;
        return (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelect(city)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition duration-300 active:scale-95 ${
              active
                ? "border-white/25 bg-white/10 text-white"
                : "border-white/[0.08] bg-white/[0.03] text-slate-400"
            }`}
          >
            <i className="h-2 w-2 rounded-full" style={{ background: color }} />
            {city.name}
            <b className="font-mono" style={{ color }}>
              {aqi ?? "…"}
            </b>
          </button>
        );
      })}
    </div>
  );
}

export default CityTabs;