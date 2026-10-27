const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

async function getJson(baseUrl, params, signal, label) {
  const response = await fetch(`${baseUrl}?${new URLSearchParams(params)}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`${label} error: ${response.status}`);
  }

  return response.json();
}

// Kualitas udara: nilai saat ini + data per jam (kemarin, hari ini, 2 hari ke depan).
export function fetchAirQuality(latitude, longitude, signal) {
  return getJson(
    AIR_QUALITY_URL,
    {
      latitude: String(latitude),
      longitude: String(longitude),
      current: "us_aqi,pm2_5,pm10",
      hourly: "us_aqi,pm2_5,pm10",
      timezone: "auto",
      past_days: "1",
      forecast_days: "3",
    },
    signal,
    "Air quality API"
  );
}

// Cuaca (angin & suhu) dari Open-Meteo. API kualitas udara tidak menyediakan angin.
export function fetchWeather(latitude, longitude, signal) {
  return getJson(
    WEATHER_URL,
    {
      latitude: String(latitude),
      longitude: String(longitude),
      current: "temperature_2m,wind_speed_10m",
      timezone: "auto",
    },
    signal,
    "Weather API"
  );
}

// Pencarian lokasi (geocoding) untuk search bar.
export async function searchLocations(query, signal) {
  const json = await getJson(
    GEOCODING_URL,
    { name: query, count: "6", language: "id", format: "json" },
    signal,
    "Geocoding API"
  );

  return (json.results ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    admin1: item.admin1 ?? "",
    country: item.country ?? "",
    latitude: item.latitude,
    longitude: item.longitude,
  }));
}