// Kategori US AQI (EPA)
export const AQI_LEVELS = [
  {
    key: "good",
    min: 0,
    max: 50,
    range: "0–50",
    label: "Good",
    short: "Good",
    color: "#44d8a2",
    advice: "Udara bersih dan aman. Nikmati aktivitas di luar ruangan seperti biasa.",
  },
  {
    key: "moderate",
    min: 51,
    max: 100,
    range: "51–100",
    label: "Moderate",
    short: "Moderate",
    color: "#f5d45e",
    advice: "Kualitas udara dapat diterima. Orang yang sangat sensitif sebaiknya mengurangi aktivitas berat di luar ruangan.",
  },
  {
    key: "sensitive",
    min: 101,
    max: 150,
    range: "101–150",
    label: "Unhealthy for Sensitive Groups",
    short: "Sensitive",
    color: "#ff9b55",
    advice: "Anak-anak, lansia, serta penderita asma atau penyakit jantung sebaiknya membatasi aktivitas di luar ruangan.",
  },
  {
    key: "unhealthy",
    min: 151,
    max: 200,
    range: "151–200",
    label: "Unhealthy",
    short: "Unhealthy",
    color: "#ff607c",
    advice: "Semua orang mulai berisiko. Kurangi aktivitas di luar ruangan dan gunakan masker saat keluar.",
  },
  {
    key: "very-unhealthy",
    min: 201,
    max: 300,
    range: "201–300",
    label: "Very Unhealthy",
    short: "Very Unhealthy",
    color: "#b57bfa",
    advice: "Risiko kesehatan tinggi bagi semua orang. Hindari aktivitas di luar ruangan dan tutup jendela.",
  },
  {
    key: "hazardous",
    min: 301,
    max: 500,
    range: "301+",
    label: "Hazardous",
    short: "Hazardous",
    color: "#c9304f",
    advice: "Kondisi darurat. Tetap di dalam ruangan, gunakan penyaring udara, dan hindari semua aktivitas luar.",
  },
];

export const NO_DATA_LEVEL = {
  key: "none",
  label: "No data",
  short: "No data",
  color: "#64748b",
  advice: "Data kualitas udara belum tersedia untuk lokasi ini.",
};

export function getAqiLevel(aqi) {
  if (aqi == null || Number.isNaN(aqi)) return NO_DATA_LEVEL;
  const value = Math.round(aqi);
  return (
    AQI_LEVELS.find((level) => value <= level.max) ??
    AQI_LEVELS[AQI_LEVELS.length - 1]
  );
}

// Posisi indikator (0–100) pada bar skala 6 segmen.
export function aqiToPercent(aqi) {
  if (aqi == null) return 0;
  const value = Math.max(0, Math.round(aqi));
  const index = AQI_LEVELS.findIndex((level) => value <= level.max);
  const i = index === -1 ? AQI_LEVELS.length - 1 : index;
  const level = AQI_LEVELS[i];
  const span = level.max - level.min || 1;
  const progress = Math.min(1, Math.max(0, (value - level.min) / span));
  return ((i + progress) / AQI_LEVELS.length) * 100;
}

// Polutan dominan dibandingkan terhadap pedoman harian WHO (PM2.5: 15, PM10: 45 µg/m³).
export function getPrimaryPollutant(pm25, pm10) {
  if (pm25 == null && pm10 == null) return "—";
  const r25 = pm25 == null ? -1 : pm25 / 15;
  const r10 = pm10 == null ? -1 : pm10 / 45;
  return r25 >= r10 ? "PM2.5" : "PM10";
}

function toNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

// Gabungkan respons API kualitas udara + cuaca menjadi satu objek siap pakai.
export function normalizeAirData(air, weather) {
  const current = air?.current ?? {};
  const hourly = air?.hourly ?? {};
  const times = hourly.time ?? [];

  const series = times.map((time, index) => ({
    time,
    aqi: toNumber(hourly.us_aqi?.[index]),
    pm25: toNumber(hourly.pm2_5?.[index]),
    pm10: toNumber(hourly.pm10?.[index]),
  }));

  const hourKey = (current.time ?? "").slice(0, 13);
  let nowIndex = hourKey ? times.findIndex((t) => t.startsWith(hourKey)) : -1;
  if (nowIndex < 0) {
    nowIndex = Math.min(24, Math.max(0, times.length - 1));
  }

  const fallback = series[nowIndex] ?? {};
  const aqiRaw = toNumber(current.us_aqi) ?? fallback.aqi ?? null;
  const aqi = aqiRaw == null ? null : Math.round(aqiRaw);

  return {
    aqi,
    pm25: toNumber(current.pm2_5) ?? fallback.pm25 ?? null,
    pm10: toNumber(current.pm10) ?? fallback.pm10 ?? null,
    wind: toNumber(weather?.current?.wind_speed_10m),
    temperature: toNumber(weather?.current?.temperature_2m),
    series,
    nowIndex,
    updatedAt: current.time ?? times[nowIndex] ?? null,
    timezone: air?.timezone_abbreviation ?? "",
    level: getAqiLevel(aqi),
  };
}

// Ambil 25 titik (24 jam) ke belakang atau ke depan dari jam sekarang.
export function sliceSeries(series, nowIndex, range) {
  if (!series?.length) return [];
  const now = nowIndex >= 0 ? nowIndex : series.length - 1;
  const from = range === "past" ? Math.max(0, now - 24) : now;
  const to = range === "past" ? now : Math.min(series.length - 1, now + 24);
  return series.slice(from, to + 1).filter((point) => point.aqi != null);
}

export function formatClock(time) {
  return time ? time.slice(11, 16) : "--:--";
}

export function formatDayTime(time) {
  if (!time) return "";
  const date = new Date(`${time}:00`);
  if (Number.isNaN(date.getTime())) return time;
  const day = date.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${day} · ${formatClock(time)}`;
}

export function formatCoordinates(lat, lon) {
  const ns = lat < 0 ? "S" : "N";
  const ew = lon < 0 ? "W" : "E";
  return `${Math.abs(lat).toFixed(2)}°${ns}, ${Math.abs(lon).toFixed(2)}°${ew}`;
}

// "-7.98, 112.63" -> { lat, lon }
export function parseCoordinates(input) {
  const match = input
    .trim()
    .replace(/−/g, "-")
    .match(/^(-?\d{1,3}(?:\.\d+)?)\s*[,;\s]\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (!match) return null;
  const lat = Number(match[1]);
  const lon = Number(match[2]);
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}