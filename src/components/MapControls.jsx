import { glass } from "../constants/styles.js";
import { LayersIcon, MinusIcon, PlusIcon, TargetIcon } from "./Icons.jsx";

const button =
  "grid h-12 w-12 place-items-center text-slate-300 transition duration-200 hover:text-sky-300 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-300";

function MapControls({
  zoom,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onReset,
  mode,
  onToggleMode,
}) {
  return (
    <div
      className={`${glass} anim-slide-right absolute right-4 top-[104px] z-20 flex flex-col items-center rounded-full py-2 md:right-6 lg:top-[40%] lg:-translate-y-1/2`}
      style={{ animationDelay: "400ms" }}
    >
      <button type="button" title="Reset zoom" aria-label="Reset zoom" onClick={onReset} className={button}>
        <TargetIcon className="h-6 w-6" />
      </button>
      <span className="h-px w-7 bg-white/[0.08]" />
      <button
        type="button"
        title="Perbesar"
        aria-label="Perbesar"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className={button}
      >
        <PlusIcon className="h-6 w-6" />
      </button>
      <span className="font-mono text-[11px] text-slate-400">{zoom}%</span>
      <button
        type="button"
        title="Perkecil"
        aria-label="Perkecil"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className={button}
      >
        <MinusIcon className="h-6 w-6" />
      </button>
      <span className="h-px w-7 bg-white/[0.08]" />
      <button
        type="button"
        title={`Mode: ${mode} (klik untuk ganti)`}
        aria-label="Ganti mode tampilan"
        onClick={onToggleMode}
        className={`${button} ${mode === "Flat" ? "!text-sky-300" : ""}`}
      >
        <LayersIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default MapControls;