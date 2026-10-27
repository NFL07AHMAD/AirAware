import { useState } from "react";
import { cities } from "./data/cities.js";
import Header from "./components/Header.jsx";
import AirQualityPanel from "./components/AirQualityPanel.jsx";
import Globe from "./components/Globe.jsx";
import MapControls from "./components/MapControls.jsx";
import Timeline from "./components/Timeline.jsx";

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

      <Header
        search={search}
        setSearch={setSearch}
        filtered={filtered}
        chooseCity={chooseCity}
        mode={mode}
        setMode={setMode}
      />

      <section className="absolute inset-0">
                <AirQualityPanel selected={selected} time={time} />

        <section className="absolute left-[61%] top-[49%] hidden w-[min(59vw,690px)] -translate-x-1/2 -translate-y-1/2 lg:block">
          <Globe
            selected={selected}
            onSelect={chooseCity}
            zoom={zoom}
            flat={mode === "Flat"}
          />
        </section>

                <MapControls setZoom={setZoom} mode={mode} setMode={setMode} />

        <div className="absolute bottom-24 right-6 hidden items-center gap-3 font-mono text-[8px] text-slate-500 xl:flex">
          <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Good</span>
          <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-amber-300" />Moderate</span>
          <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-rose-400" />Unhealthy</span>
        </div>
      </section>

      <Timeline
        time={time}
        hour={hour}
        setHour={setHour}
        playing={playing}
        setPlaying={setPlaying}
      />

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
