import { MAP_SIZE, toMapPoint } from "./geography.js";

// Proyeksi lat/lon -> posisi marker (dalam %) pada peta globe.
// onGlobe: berada di dalam lingkaran globe, onMap: berada di dalam peta datar (mode Flat).
export function projectToMap(lat, lon) {
  const point = toMapPoint(lon, lat);
  const x = (point.x / MAP_SIZE) * 100;
  const y = (point.y / MAP_SIZE) * 100;

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    onMap: x >= 4 && x <= 96 && y >= 4 && y <= 96,
    onGlobe: Math.hypot(x - 50, y - 50) <= 46,
  };
}

// Sisi tempat label kota ditampilkan, agar kota yang berdekatan tidak saling tumpang tindih.
// right | left | top | topRight | bottom
const baseCities = [
  { id: "jakarta", name: "Jakarta", country: "Indonesia", lat: -6.2, lon: 106.84, side: "left" },
  { id: "surabaya", name: "Surabaya", country: "Indonesia", lat: -7.25, lon: 112.75, side: "right" },
  { id: "medan", name: "Medan", country: "Indonesia", lat: 3.59, lon: 98.67, side: "left" },
  { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.35, lon: 103.82, side: "right" },
  { id: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", lat: 3.14, lon: 101.69, side: "topRight" },
  { id: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.75, lon: 100.5, side: "left" },
  { id: "ho-chi-minh", name: "Ho Chi Minh", country: "Vietnam", lat: 10.82, lon: 106.63, side: "right" },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", lat: 21.03, lon: 105.85, side: "right" },
];

export const cities = baseCities.map((city) => ({
  ...city,
  ...projectToMap(city.lat, city.lon),
}));