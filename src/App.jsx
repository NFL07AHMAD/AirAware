import { useEffect, useState } from "react";
import { useAirData } from "./hooks/useAirData.js";
import { getAqiLevel } from "./utils/aqi.js";
import Header from "./components/Header.jsx";
import AirQualityPanel from "./components/AirQualityPanel.jsx";
import Globe from "./components/Globe.jsx";
import MapControls from "./components/MapControls.jsx";
import CityTabs from "./components/CityTabs.jsx";
import AqiLegend from "./components/AqiLegend.jsx";

const ZOOM_MIN = 80;
const ZOOM_MAX = 140;
const ZOOM_STEP = 10;
const PENDING = { data: null, loading: true, error: null };

function App() {
  const { cities, records, refreshAll, refreshCity, addPlace } = useAirData();
  const [selectedId, setSelectedId] = useState(cities[0].id);
  const [mode, setMode] = useState("Globe");
  const [zoom, setZoom] = useState(100);

  const selected = cities.find((city) => city.id === selectedId) ?? cities[0];
  const record = records[selected.id] ?? PENDING;
  const level = getAqiLevel(record.data?.aqi);

  const allRecords = cities.map((city) => records[city.id] ?? PENDING);
  const hasData = allRecords.some((item) => item.data);
  const refreshing = allRecords.some((item) => item.loading);
  const connection = !hasData
    ? refreshing
      ? "loading"
      : "error"
    : refreshing
      ? "syncing"
      : "live";

  // Judul tab browser ikut berubah sesuai kota & AQI
  useEffect(() => {
    document.title =
      record.data?.aqi != null
        ? `${selected.name} · AQI ${record.data.aqi} — Aether`
        : "Aether — Air Quality Radar";
  }, [selected.name, record.data?.aqi]);

  function zoomBy(delta) {
    setZoom((value) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value + delta)));
  }

  function toggleMode() {
    setMode((value) => (value === "Globe" ? "Flat" : "Globe"));
  }

  function handleSelectCity(city) {
    setSelectedId(city.id);
  }

  function handleSelectPlace(place) {
    const city = addPlace(place);
    setSelectedId(city.id);
  }

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-[#05070b] text-slate-100 lg:h-screen lg:min-h-[640px] lg:overflow-hidden">
      {/* Latar: gradien, grid, dan cahaya yang melayang pelan */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_58%_45%,rgba(13,26,44,.5),transparent_48%),linear-gradient(145deg,#07090d,#05070b_65%,#080a10)]" />
        <div className="bg-grid absolute inset-0" />
        <div className="anim-drift absolute left-[35%] top-[12%] h-96 w-96 rounded-full bg-blue-500/[0.07] blur-[120px]" />
        <div className="anim-drift-slow absolute bottom-[8%] right-[12%] h-80 w-80 rounded-full bg-emerald-400/[0.05] blur-[120px]" />
        <div
          className="absolute bottom-[20%] left-[8%] h-72 w-72 rounded-full blur-[130px] transition-colors duration-1000"
          style={{ background: `${level.color}12` }}
        />
      </div>

      <Header
        cities={cities}
        records={records}
        mode={mode}
        setMode={setMode}
        connection={connection}
        refreshing={refreshing}
        onRefresh={refreshAll}
        onSelectCity={handleSelectCity}
        onSelectPlace={handleSelectPlace}
      />

      <div className="relative flex flex-col gap-6 px-4 pb-14 pt-24 md:px-6 lg:contents">
        {/* Globe */}
        <div className="order-1 mb-10 lg:absolute lg:left-[62%] lg:top-1/2 lg:z-10 lg:mb-0 lg:w-[min(50vw,72vh,720px)] lg:-translate-x-1/2 lg:-translate-y-[52%]">
          <Globe
            cities={cities}
            records={records}
            selected={selected}
            onSelect={handleSelectCity}
            zoom={zoom}
            onWheelZoom={zoomBy}
            flat={mode === "Flat"}
          />
        </div>

        <div className="order-2 lg:hidden">
          <CityTabs
            cities={cities}
            records={records}
            selectedId={selected.id}
            onSelect={handleSelectCity}
          />
        </div>

        {/* Card monitoring station */}
        <div className="order-3 w-full lg:pointer-events-none lg:absolute lg:inset-y-[92px] lg:left-[4.6vw] lg:z-20 lg:flex lg:w-[380px] lg:items-center xl:w-[420px]">
          <AirQualityPanel
            city={selected}
            record={record}
            level={level}
            onRetry={() => refreshCity(selected)}
          />
        </div>

        <MapControls
          zoom={zoom}
          canZoomIn={zoom < ZOOM_MAX}
          canZoomOut={zoom > ZOOM_MIN}
          onZoomIn={() => zoomBy(ZOOM_STEP)}
          onZoomOut={() => zoomBy(-ZOOM_STEP)}
          onReset={() => setZoom(100)}
          mode={mode}
          onToggleMode={toggleMode}
        />

        <div className="order-4 lg:absolute lg:bottom-10 lg:right-6 lg:z-20 lg:w-[220px]">
          <AqiLegend activeKey={level.key} />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-6 right-6 hidden justify-between font-mono text-[11px] text-slate-600 md:flex">
        <span>AE / 01</span>
        <span>Atmospheric Intelligence Interface</span>
        <span>Data: Open-Meteo</span>
      </div>
    </main>
  );
}

export default App;