const BASE_URL =
  "https://air-quality-api.open-meteo.com/v1/air-quality";

export async function fetchAirQuality(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "us_aqi,pm2_5,pm10",
    hourly: "us_aqi,pm2_5,pm10",
    timezone: "Asia/Jakarta",
    forecast_days: "3",
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Air quality API error: ${response.status}`);
  }

  return response.json();
}