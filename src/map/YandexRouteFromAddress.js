import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';

const geocodeAddress = async (address) => {
  const encoded = encodeURIComponent(address);
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`
  );
  const data = await response.json();

  if (data.length === 0) return null;

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
};

const YandexRouteFromAddress = ({ destinationAddress }) => {
  const [currentCoords, setCurrentCoords] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нет доступа к геопозиции');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentCoords(location.coords);
    })();
  }, []);

  const buildRoute = async () => {
    if (!currentCoords) {
      Alert.alert('Ошибка', 'Местоположение не получено');
      return;
    }

    const geo = await geocodeAddress(destinationAddress);
    if (!geo) {
      Alert.alert('Ошибка', 'Не удалось найти адрес');
      return;
    }

    const from = `${currentCoords.latitude},${currentCoords.longitude}`;
    const to = `${geo.lat},${geo.lon}`;
    const url = `yandexmaps://maps.yandex.ru/?rtext=${from}~${to}&rtt=auto`;

    Linking.openURL(url).catch(() =>
      Alert.alert(
        'Ошибка',
        'Не удалось открыть Яндекс.Карты. Убедитесь, что приложение установлено.'
      )
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={buildRoute}>
        <Text style={styles.buttonText}>
          Построить маршрут в Яндекс.Картах
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default YandexRouteFromAddress;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    backgroundColor: '#ffcc00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
