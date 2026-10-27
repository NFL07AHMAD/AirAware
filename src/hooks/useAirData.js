import { useCallback, useEffect, useRef, useState } from "react";
import { cities as defaultCities, projectToMap } from "../data/cities.js";
import { fetchAirQuality, fetchWeather } from "../services/airQualityApi.js";
import { normalizeAirData } from "../utils/aqi.js";

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 menit

const createInitialRecords = () =>
  Object.fromEntries(
    defaultCities.map((city) => [
      city.id,
      { data: null, loading: true, error: null },
    ])
  );

function friendlyError(error) {
  if (error?.name === "TypeError") {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
  }
  return error?.message || "Gagal memuat data kualitas udara.";
}

async function loadCity(city, signal) {
  const [air, weather] = await Promise.allSettled([
    fetchAirQuality(city.lat, city.lon, signal),
    fetchWeather(city.lat, city.lon, signal),
  ]);

  // Data kualitas udara wajib; cuaca (angin & suhu) boleh gagal.
  if (air.status === "rejected") throw air.reason;

  return normalizeAirData(
    air.value,
    weather.status === "fulfilled" ? weather.value : null
  );
}

export function useAirData() {
  const [cities, setCities] = useState(defaultCities);
  const [records, setRecords] = useState(createInitialRecords);
  const citiesRef = useRef(cities);
  const controllerRef = useRef(null);

  useEffect(() => {
    citiesRef.current = cities;
  }, [cities]);

  const fetchOne = useCallback(async (city, signal) => {
    setRecords((prev) => ({
      ...prev,
      [city.id]: {
        data: prev[city.id]?.data ?? null,
        loading: true,
        error: null,
      },
    }));

    try {
      const data = await loadCity(city, signal);
      setRecords((prev) => ({
        ...prev,
        [city.id]: { data, loading: false, error: null },
      }));
    } catch (error) {
      if (error?.name === "AbortError" || signal?.aborted) return;
      setRecords((prev) => ({
        ...prev,
        [city.id]: {
          data: prev[city.id]?.data ?? null,
          loading: false,
          error: friendlyError(error),
        },
      }));
    }
  }, []);

  const refreshAll = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    citiesRef.current.forEach((city) => fetchOne(city, controller.signal));
  }, [fetchOne]);

  // Ambil data saat web pertama kali dibuka + perbarui otomatis tiap 10 menit.
  useEffect(() => {
    refreshAll();
    const timer = setInterval(refreshAll, REFRESH_INTERVAL);
    return () => {
      clearInterval(timer);
      controllerRef.current?.abort();
    };
  }, [refreshAll]);

  const refreshCity = useCallback((city) => fetchOne(city), [fetchOne]);

  // Tambah lokasi baru dari pencarian (geocoding / koordinat).
  const addPlace = useCallback(
    (place) => {
      const existing = citiesRef.current.find((city) => city.id === place.id);
      if (existing) return existing;

      const city = { ...place, ...projectToMap(place.lat, place.lon) };
      setCities((prev) =>
        prev.some((item) => item.id === city.id) ? prev : [...prev, city]
      );
      fetchOne(city);
      return city;
    },
    [fetchOne]
  );

  return { cities, records, refreshAll, refreshCity, addPlace };
}