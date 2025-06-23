import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Keyboard,
} from 'react-native';

export default function RouteControlPanel({ mapRef, onAddPoint, onBuildRoute, onPreview }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCoords, setSearchCoords] = useState(null);
  const [points, setPoints] = useState([]);

  const handleSearch = async () => {
    if (searchQuery.length < 3) {
      alert('Введите корректный адрес');
      return;
    }

    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lang=default&limit=1`
      );
      const data = await res.json();

      if (!data.features || data.features.length === 0) {
        alert('Адрес не найден');
        return;
      }

      const feature = data.features[0];
      const coords = {
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
      };

      setSearchCoords(coords);
      Keyboard.dismiss();

      // Центрируем карту
      mapRef?.current?.animateToRegion({
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);

      onPreview?.(coords); // Временный маркер
    } catch (err) {
      alert('Ошибка при поиске адреса');
      console.warn('Ошибка:', err);
    }
  };

  const handleAddPoint = () => {
    if (searchCoords) {
      const newPoint = { ...searchCoords };
      const updatedPoints = [...points, newPoint];
      setPoints(updatedPoints);
      setSearchCoords(null);
      setSearchQuery('');
      onAddPoint?.(newPoint);
      onPreview?.(null); // Убираем временный маркер
    }
  };

  const handleBuildRoute = () => {
    if (points.length === 0) {
      alert('Сначала добавьте точки');
      return;
    }
    onBuildRoute?.(points);
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Добавить точку</Text>

      <TextInput
        placeholder="Поиск места..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>🔍 Искать</Text>
      </TouchableOpacity>

      {searchCoords && (
        <TouchableOpacity style={styles.button} onPress={handleAddPoint}>
          <Text style={styles.buttonText}>➕ Добавить в маршрут</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={points}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <Text style={styles.pointText}>
            Точка {index + 1}: {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
          </Text>
        )}
        style={styles.pointList}
      />

      <TouchableOpacity style={[styles.button, styles.buildButton]} onPress={handleBuildRoute}>
        <Text style={styles.buttonText}>🚗 Построить маршрут</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#ffffffee',
    borderRadius: 10,
    padding: 12,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  buildButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  pointList: {
    maxHeight: 100,
    marginBottom: 8,
  },
  pointText: {
    fontSize: 13,
    marginBottom: 4,
  },
});
