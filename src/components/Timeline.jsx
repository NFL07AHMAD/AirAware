import { glass } from "../constants/styles.js";

function Timeline({ time, hour, setHour, playing, setPlaying }) {
  return (
<footer className={`${glass} absolute bottom-6 left-1/2 z-30 flex w-[min(440px,calc(100vw-24px))] -translate-x-1/2 items-center gap-3 rounded-full px-3 py-2`}>
        <button
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause timeline" : "Play timeline"}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[10px] hover:bg-sky-400/20"
        >
          {playing ? "Ⅱ" : "▶"}
        </button>

        <span className="shrink-0 whitespace-nowrap font-mono text-[9px] text-slate-300">
          {time}
        </span>

        <input
          type="range"
          min="0"
          max="23"
          value={hour}
          onChange={(event) => {
            setHour(Number(event.target.value));
            setPlaying(false);
          }}
          aria-label="Pilih waktu"
          className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 accent-sky-400"
        />

        <span className="h-6 w-px shrink-0 bg-white/[0.08]" />

        <div className="flex shrink-0 items-center gap-2 font-mono text-[9px] text-slate-400">
          AQI
          <span className="h-1 w-[54px] rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 via-orange-400 to-fuchsia-500 sm:w-[84px]" />
        </div>
      </footer>
  );
}

export default Timeline;
