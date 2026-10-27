import { glass } from "../constants/styles.js";
import { AQI_LEVELS } from "../utils/aqi.js";

function AqiLegend({ activeKey }) {
  return (
    <div
      className={`${glass} anim-fade-up rounded-2xl p-4`}
      style={{ animationDelay: "700ms" }}
    >
      <p className="mb-3 font-mono text-[11px] tracking-[1.6px] text-slate-500">
        US AQI SCALE
      </p>
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
        {AQI_LEVELS.map((level) => {
          const active = level.key === activeKey;
          return (
            <li
              key={level.key}
              className={`flex items-center gap-2.5 rounded-lg px-2 py-1 text-xs transition duration-500 ${
                active ? "bg-white/[0.08] text-white" : "text-slate-400"
              }`}
            >
              <i
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: level.color,
                  boxShadow: active ? `0 0 10px ${level.color}` : "none",
                }}
              />
              <span className="flex-1 truncate">{level.short}</span>
              <span className="font-mono text-[11px] text-slate-500">{level.range}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default AqiLegend;