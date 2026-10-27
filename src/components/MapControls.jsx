import { glass } from "../constants/styles.js";

function MapControls({ setZoom, mode, setMode }) {
  return (
<div className={`${glass} absolute right-4 top-[43%] z-20 flex -translate-y-1/2 flex-col items-center rounded-full py-1 md:right-6`}>
          <button
            title="Reset zoom"
            onClick={() => setZoom(100)}
            className="grid h-8 w-9 place-items-center text-lg text-slate-300 hover:text-sky-400"
          >
            ⊕
          </button>
          <span className="h-px w-5 bg-white/[0.06]" />
          <button
            title="Perbesar"
            onClick={() => setZoom((value) => Math.min(130, value + 10))}
            className="grid h-8 w-9 place-items-center text-xl text-slate-300 hover:text-sky-400"
          >
            +
          </button>
          <button
            title="Perkecil"
            onClick={() => setZoom((value) => Math.max(80, value - 10))}
            className="grid h-8 w-9 place-items-center text-xl text-slate-300 hover:text-sky-400"
          >
            −
          </button>
          <span className="h-px w-5 bg-white/[0.06]" />
          <button
            title="Ganti mode"
            onClick={() => setMode(mode === "Globe" ? "Flat" : "Globe")}
            className="grid h-8 w-9 place-items-center text-xl text-sky-400"
          >
            ◈
          </button>
        </div>
  );
}

export default MapControls;
