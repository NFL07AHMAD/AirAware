import AirChart from "./AirChart.jsx";
import { glass } from "../constants/styles.js";

function AirQualityPanel({ selected, time }) {
  return (
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
  );
}

export default AirQualityPanel;
