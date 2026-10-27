// Metadata kota saja. Semua angka (AQI, PM2.5, PM10, angin, suhu) diambil dari API.
// x / y = posisi marker (dalam %) pada ilustrasi globe.
export const cities = [
  { id: "jakarta", name: "Jakarta", country: "Indonesia", lat: -6.2, lon: 106.84, x: 48, y: 57 },
  { id: "surabaya", name: "Surabaya", country: "Indonesia", lat: -7.25, lon: 112.75, x: 68, y: 60 },
  { id: "medan", name: "Medan", country: "Indonesia", lat: 3.59, lon: 98.67, x: 17, y: 46 },
  { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.35, lon: 103.82, x: 39, y: 43 },
  { id: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", lat: 3.14, lon: 101.69, x: 32, y: 37 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.75, lon: 100.5, x: 26, y: 28 },
  { id: "ho-chi-minh", name: "Ho Chi Minh", country: "Vietnam", lat: 10.82, lon: 106.63, x: 52, y: 31 },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", lat: 21.03, lon: 105.85, x: 43, y: 17 },
];

// Proyeksi sederhana lat/lon -> posisi di ilustrasi globe (untuk lokasi hasil pencarian).
// Lokasi yang jatuh di luar area globe mengembalikan x/y = null (data tetap tampil di card).
export function projectToMap(lat, lon) {
  const x = 26 + (lon - 100.5) * 3.2;
  const y = 28 + (13.75 - lat) * 1.45;
  const inside = Math.hypot(x - 50, y - 50) <= 40;
  return inside
    ? { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
    : { x: null, y: null };
}