import { useEffect, useState } from 'react';

export default function useRoute(start, destinations, enabled = true) {
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (!enabled) return; // ⛔️ не запускаем пока не включено

    const fetchRoute = async () => {
      if (!start || !destinations?.length) return;

      const coords = [start, ...destinations]
        .map(p => `${p.longitude},${p.latitude}`)
        .join(';');

      const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes?.[0]) {
          const route = data.routes[0];
          const points = route.geometry.coordinates.map(([lng, lat]) => ({
            latitude: lat,
            longitude: lng,
          }));

          setRouteCoords(points);
          setDistance(route.distance);
          setDuration(route.duration);
        }
      } catch (err) {
        console.warn('Ошибка при получении маршрута:', err);
      }
    };

    fetchRoute();
  }, [start, destinations, enabled]);

  return { routeCoords, distance, duration };
}
