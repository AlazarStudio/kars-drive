const coordCache = {};

export const getCachedCoordinates = async (address) => {
  if (coordCache[address]) return coordCache[address];

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
    {
      headers: {
        'User-Agent': 'KarsDriveApp/1.0 (support@example.com)'
      }
    }
  );
  const data = await res.json();

  if (data.length > 0) {
    const coords = {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon)
    };
    coordCache[address] = coords;
    return coords;
  }

  throw new Error('Адрес не найден');
};
