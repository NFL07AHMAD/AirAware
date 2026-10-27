import { useEffect, useRef, useState } from "react";

// Angka yang "menghitung" naik/turun dengan halus saat nilainya berubah.
function AnimatedNumber({ value, decimals = 0, duration = 900 }) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (value == null) return undefined;

    const from = fromRef.current;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (value - from) * eased;
      fromRef.current = next;
      setDisplay(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  if (value == null) return <>—</>;
  return <>{display.toFixed(decimals)}</>;
}

export default AnimatedNumber;