import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useSharedValue, withTiming, useAnimatedStyle, } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { BASE_URL } from '@/shared/config';
import RoutePath from '@/shared/ui/RoutePath';
import BottomActionBar from '@/shared/ui/BottomActionBar';

const getCoordinatesFromAddress = async (address) => {
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
    const {
      lat, lon } = data[0];
    return {
      latitude: parseFloat(lat), longitude: parseFloat(lon)
    };
  } else {

    throw new Error('Адрес не найден');
  }
};

const fetchRoute = async (from, to) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson&steps=true`;
  const res = await fetch(url);
  const data = await res.json();
  const coords = data.routes[0].geometry.coordinates.map(([lon, lat]) => ({
    latitude: lat, longitude: lon,
  }));
  const steps = data.routes[0].legs[0].steps.map(step => step.maneuver.instruction);
  return {
    coords, steps
  };
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '89%'], []);
  const [order, setOrder] = useState(null);
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [myCoords, setMyCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [directions, setDirections] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const isVisible = useSharedValue(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BASE_URL}/orders/${id}`);
        const data = await res.json();
        setOrder(data);
        const from = await getCoordinatesFromAddress(data.from);
        const to = await getCoordinatesFromAddress(data.to);
        setFromCoords(from);
        setToCoords(to);
        await locateMe(); // сразу получить текущие координаты
        setTimeout(() => bottomSheetRef.current?.present(), 100);
      } catch (error) {

        console.error('Ошибка загрузки заказа или координат:', error);
      }
    };
    fetchOrder();
  }, [id]);

  const locateMe = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const location = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setMyCoords(coords);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: withTiming(isVisible.value === 1 ? 0 : 100, {
        duration: 250
      })
    }],
    opacity: withTiming(isVisible.value, {
      duration: 250
    }),
  }));

  const centerMap = (coords) => {
    mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
  };

  const buildRoute = async () => {
    if (!fromCoords || !toCoords) return;

    const result = await fetchRoute(fromCoords, toCoords);
    setRouteCoords(result.coords);
    setDirections(result.steps);
    setShowDirections(true);

    bottomSheetRef.current?.dismiss();

    setTimeout(() => {
      mapRef.current?.animateToRegion({
        latitude: fromCoords.latitude, // сдвиг вверх
        longitude: fromCoords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);
    }, 300);
  };


  return (
    <View style={styles.container}>{
      fromCoords && toCoords && (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{ ...fromCoords, latitudeDelta: 0.1, longitudeDelta: 0.1 }}
        >
          <Marker coordinate={fromCoords} title="Откуда" />
          <Marker coordinate={toCoords} title="Куда" />
          {
            myCoords && (
              <Marker coordinate={myCoords}>
                <View style={styles.userLocationDot} />
              </Marker>
            )}
          {
            accepted && routeCoords.length > 0 && (
              <Polyline coordinates={routeCoords} strokeColor="#285FE5" strokeWidth={4} />
            )}
        </MapView>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.detailsButton} onPress={() => bottomSheetRef.current?.present()}>
        <Text style={styles.detailsButtonText}>Детали заказа</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.locateButton} onPress={locateMe}>
        <Ionicons name="locate" size={24} color="#000" />
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onAnimate={(fromIndex, toIndex) => {
          isVisible.value = toIndex >= 0 ? 1 : 0;
        }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.content}>{
          order ? (
            <>
              <View style={styles.avatarSection}>
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: order.avatar }} style={styles.avatar} />
                </View>
                <Text style={styles.name}>{order.fullName} ⭐️ {
                  order.rating?.toFixed(1) ?? '—'}</Text>
              </View>

              <Text style={styles.status}>Ожидает принятия</Text>

              <View style={styles.routeWrapper}>
                <View style={styles.routeIcons}>
                  <View style={[styles.circle, { borderColor: "#000000" }]} />
                  <View style={[styles.verticalLine, { backgroundColor: "#000000" }]} />
                  <View style={[styles.circle, { borderColor: "#000000", backgroundColor: "#38bdf8" }]} />
                </View>

                <View style={styles.routeTexts}>
                  <TouchableOpacity onPress={() => centerMap(fromCoords)}>
                    <Text style={[styles.pointTop, { color: "#000000" }]}>{order.from}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => centerMap(toCoords)}>
                    <Text style={[styles.point, { color: "#000000" }]}>{order.to}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Время заказа</Text>
                <Text style={styles.value}>{new Date(order.departureTime).toLocaleString('ru-RU')}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Комментарий</Text>
                <Text style={styles.value}>{order.comment || 'Нет комментария'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Информация о багаже</Text>
                <Text style={styles.value}>{order.baggageInfo || 'Не указано'}</Text>
              </View>
            </>
          ) : (
            <Text>Загрузка данных...</Text>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>

      <BottomActionBar animatedStyle={animatedStyle}>{
        !accepted ? (
          <>
            <TouchableOpacity style={styles.rejectButton}>
              <Text style={styles.rejectText}>Отклонить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => setAccepted(true)}
            >
              <Text style={styles.acceptText}>Принять заказ</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.acceptButton} onPress={buildRoute}>
            <Text style={styles.acceptText}>Построить маршрут</Text>
          </TouchableOpacity>
        )}
      </BottomActionBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backButton: {
    position: 'absolute', top: 50, left: 20, zIndex: 10,
    backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 5,
  },
  locateButton: {
    position: 'absolute', bottom: 100, right: 20, zIndex: 10,
    backgroundColor: '#fff', padding: 10, borderRadius: 30, elevation: 5,
  },
  detailsButton: {
    position: 'absolute', bottom: 30, alignSelf: 'center',
    backgroundColor: '#285FE5', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, zIndex: 5,
  },
  detailsButtonText: {
    fontSize: 16, fontWeight: '500', color: '#fff'
  },
  content: {
    padding: 16, paddingBottom: 100
  },
  avatarSection: {
    alignItems: 'center', marginBottom: 12
  },
  avatarWrapper: {
    width: 64, height: 64, borderRadius: 32, overflow: 'hidden', marginBottom: 8
  },
  avatar: {
    width: '100%', height: '100%', resizeMode: 'cover'
  },
  name: {
    fontWeight: 'bold', fontSize: 16
  },
  status: {
    backgroundColor: '#FFF1A6', padding: 10, borderRadius: 8, marginVertical: 8, textAlign: 'center', fontWeight: '500'
  },
  point: {
    fontSize: 14, color: '#007aff', marginBottom: 6
  },
  infoRow: {
    marginVertical: 6
  },
  label: {
    fontWeight: 'bold', marginBottom: 4
  },
  value: {
    fontSize: 14, color: '#444', backgroundColor: '#F2F2F2', padding: 8, borderRadius: 6
  },
  step: {
    fontSize: 13, color: '#333', marginBottom: 3
  },
  directionsBox: {
    position: 'absolute', bottom: 130, left: 10, right: 10, backgroundColor: '#fff',
    padding: 10, borderRadius: 10, maxHeight: 150, zIndex: 9999, elevation: 8,
  },
  rejectButton: {
    flex: 1, backgroundColor: '#E5E5E5', padding: 12, borderRadius: 10, marginRight: 8
  },
  acceptButton: {
    flex: 1, backgroundColor: '#285FE5', padding: 12, borderRadius: 10, marginLeft: 8
  },
  rejectText: {
    color: '#000', textAlign: 'center', fontWeight: '600'
  },
  acceptText: {
    color: '#fff', textAlign: 'center', fontWeight: '600'
  },

  routeWrapper: {
    flexDirection: 'row',
    gap: 15,
  },
  routeIcons: {
    alignItems: 'center',
    marginTop: 2,
  },
  routeTexts: {
    flex: 1,
    justifyContent: 'space-between',
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  verticalLine: {
    width: 1,
    flex: 1,
  },
  pointTop: {
    fontSize: 14,
    marginBottom: 15,
  },
  point: {
    fontSize: 14,
  },

  userLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    borderWidth: 3,
    borderColor: 'white',
  }
});
