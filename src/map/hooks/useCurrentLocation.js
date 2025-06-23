import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function useCurrentLocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Разрешение не предоставлено');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
    })();
  }, []);

  return location;
}
