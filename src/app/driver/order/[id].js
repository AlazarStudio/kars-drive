import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BottomSheetModal, BottomSheetScrollView, TouchableWithoutFeedback } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { BASE_URL } from '@/shared/config';
import BottomActionBar from '@/shared/ui/BottomActionBar';
import CustomMapView from '@/map/CustomMapView';
import useCurrentLocation from '@/map/hooks/useCurrentLocation';
import useRoute from '@/map/hooks/useRoute';
import MyLocationButton from '@/map/MyLocationButton';
import RouteControlPanel from '@/map/RouteControlPanel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoutePolyline from '@/map/RoutePolyline';
import { Polyline } from 'react-native-maps';
import WaypointMarker from '@/map/WaypointMarker';
import * as Location from 'expo-location';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '89%'], []);
  const [order, setOrder] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const isVisible = useSharedValue(0);

  const mapRef = useRef(null);
  const location = useCurrentLocation();

  const [destinationPoints, setDestinationPoints] = useState([]);
  const [searchPreviewMarker, setSearchPreviewMarker] = useState(null);
  const [buildRoute, setBuildRoute] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [initialRegionSet, setInitialRegionSet] = useState(false);
  const [hasCenteredRoute, setHasCenteredRoute] = useState(false); // 🆕 флаг

  const [isNavigating, setIsNavigating] = useState(false);
  const [currentHeading, setCurrentHeading] = useState(null);
  const lastHeading = useRef(null);
  const lastUpdateTime = useRef(Date.now());
  const locationSubscription = useRef(null);

  const { routeCoords, distance, duration } = useRoute(
    location ? { latitude: location.latitude, longitude: location.longitude } : null,
    destinationPoints,
    buildRoute
  );

  const defaultRegion = {
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const initialRegion =
    location && !initialRegionSet
      ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
      : defaultRegion;

  useEffect(() => {
    if (location && !initialRegionSet) {
      setInitialRegionSet(true);
    }
  }, [location]);

  useEffect(() => {
    if (location && mapRef.current && initialRegionSet) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
      setIsFollowing(true);
    }
  }, [location, initialRegionSet]);


  // Масштабируем маршрут только один раз
  useEffect(() => {
    if (buildRoute && !hasCenteredRoute && routeCoords.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(routeCoords, {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
      setHasCenteredRoute(true);
    }
  }, [buildRoute, hasCenteredRoute, routeCoords]);

  const handleRecenter = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
      setIsFollowing(true);
    }
  };

  const handleMapInteraction = () => {
    if (isFollowing) setIsFollowing(false);
  };

  const handleAddPoint = (point) => {
    setDestinationPoints(prev => [...prev, point]);
  };

  const handleBuildRoute = (points) => {
    setDestinationPoints(points);
    setBuildRoute(true);
    setSearchPreviewMarker(null);
    setHasCenteredRoute(false); // 🆕 сбрасываем флаг
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BASE_URL}/orders/${id}`);
        const data = await res.json();
        setOrder(data);
        setAccepted(data.isActive);
        setTimeout(() => bottomSheetRef.current?.present(), 100);
      } catch (error) {
        console.error('Ошибка загрузки заказа:', error);
      }
    };
    fetchOrder();
  }, [id]);

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

  const handleAcceptOrder = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: true,
          status: 'active',
        }),
      });

      const userId = await AsyncStorage.getItem('userId');
      const resUser = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onOrder: id,
        }),
      });

      if (!res.ok) throw new Error('Ошибка при принятии заказа');
      if (!resUser.ok) throw new Error('Ошибка при принятии заказа');

      const updatedOrder = await res.json();
      const updatedUser = await resUser.json();
      setOrder(updatedOrder);
      setAccepted(true);
    } catch (error) {
      console.error('Не удалось обновить заказ:', error);
    }
  };

  const buildRouteToOrder = async () => {
    try {
      bottomSheetRef.current?.dismiss();

      if (!order || !order.from) {
        Alert.alert('Ошибка', 'Нет адреса клиента');
        return;
      }

      if (!location || !location.latitude || !location.longitude) {
        Alert.alert('Ошибка', 'Ожидаем геопозицию. Попробуйте ещё раз через пару секунд');
        return;
      }

      const geoRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(order.from)}&lang=default&limit=1`);
      const geoData = await geoRes.json();

      if (!geoData.features || geoData.features.length === 0) {
        Alert.alert('Ошибка', 'Адрес клиента не найден');
        return;
      }

      const destCoords = {
        latitude: geoData.features[0].geometry.coordinates[1],
        longitude: geoData.features[0].geometry.coordinates[0],
      };

      // console.log('📍 Строим маршрут от:', location, 'до:', destCoords);

      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${location.longitude},${location.latitude};${destCoords.longitude},${destCoords.latitude}?overview=full&geometries=geojson`;
      const routeRes = await fetch(osrmUrl);
      const routeData = await routeRes.json();

      if (!routeData.routes || routeData.routes.length === 0) {
        Alert.alert('Ошибка', 'Не удалось построить маршрут (OSRM не дал данных)');
        return;
      }

      const coords = routeData.routes[0].geometry.coordinates.map(([lon, lat]) => ({
        latitude: lat,
        longitude: lon,
      }));

      setDestinationPoints([destCoords]);
      setBuildRoute(true);
      setSearchPreviewMarker(null);
      setHasCenteredRoute(false);

      setTimeout(() => {
        mapRef.current?.animateCamera({
          center: coords[0],
          heading: location.heading || 0,
          pitch: 0,
          altitude: 1000,
        });
      }, 300);

    } catch (err) {
      console.error('❌ Ошибка построения маршрута:', err);
      Alert.alert('Ошибка', 'Не удалось построить маршрут до клиента');
    }
  };


  const startNavigation = async () => {
    if (isNavigating || !location) return;

    try {
      bottomSheetRef.current?.dismiss();
      setIsNavigating(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нет доступа к геопозиции');
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 500,
          distanceInterval: 0,
        },
        (pos) => {
          const newHeading = pos.coords.heading;
          const now = Date.now();

          // 🔄 Обновляем heading, но не location напрямую
          if (
            typeof newHeading === 'number' &&
            !isNaN(newHeading) &&
            (lastHeading.current === null || Math.abs(newHeading - lastHeading.current) > 3) &&
            now - lastUpdateTime.current > 1500
          ) {
            setCurrentHeading(newHeading);
            lastHeading.current = newHeading;
            lastUpdateTime.current = now;
          }

          // 🔁 Вращаем карту по heading
          if (mapRef.current) {
            mapRef.current.animateCamera({
              center: {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              },
              heading: newHeading || 0,
              pitch: 0,
              altitude: 1000,
            });
          }
        }
      );
    } catch (err) {
      console.error('Ошибка запуска навигации:', err);
      Alert.alert('Ошибка', 'Не удалось включить навигацию');
      setIsNavigating(false);
    }
  };



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>

        <CustomMapView
          key={buildRoute ? 'map-with-route' : 'map-empty'}
          mapRef={mapRef}
          initialRegion={initialRegion}
          onPanDrag={handleMapInteraction}
        >
          {buildRoute && (
            <>
              {/* <RoutePolyline coordinates={routeCoords} /> */}
              <Polyline coordinates={routeCoords} strokeWidth={6} strokeColor="#007AFF" />

              {destinationPoints.map((point, index) => (
                <WaypointMarker
                  key={index}
                  coordinate={point}
                  label={`Точка ${index + 1}`}
                />
              ))}
            </>
          )}
          {searchPreviewMarker && (
            <WaypointMarker coordinate={searchPreviewMarker} label="Найдено" />
          )}
        </CustomMapView>

        <MyLocationButton
          onPress={handleRecenter}
          isFollowing={isFollowing}
          style={styles.myButton}
        />

        {/* <RouteControlPanel
          mapRef={mapRef}
          onAddPoint={handleAddPoint}
          onBuildRoute={handleBuildRoute}
          onPreview={setSearchPreviewMarker}
        /> */}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.detailsButton} onPress={() => bottomSheetRef.current?.present()}>
          <Text style={styles.detailsButtonText}>Детали заказа</Text>
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
          <BottomSheetScrollView contentContainerStyle={styles.content}>
            {order ? (
              <>
                <View style={styles.avatarSection}>
                  <View style={styles.avatarWrapper}>
                    <Image source={{ uri: order.avatar }} style={styles.avatar} />
                  </View>
                  <Text style={styles.name}>
                    {order.fullName} ⭐️ {order.rating?.toFixed(1) ?? '—'}
                  </Text>
                </View>

                <Text style={styles.status}>Ожидает принятия</Text>

                <View style={styles.routeWrapper}>
                  <View style={styles.routeIcons}>
                    <View style={[styles.circle, { borderColor: "#000000" }]} />
                    <View style={[styles.verticalLine, { backgroundColor: "#000000" }]} />
                    <View style={[styles.circle, { borderColor: "#000000", backgroundColor: "#38bdf8" }]} />
                  </View>

                  <View style={styles.routeTexts}>
                    <Text style={[styles.pointTop, { color: "#000000" }]}>{order.from}</Text>
                    <Text style={[styles.point, { color: "#000000" }]}>{order.to}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Время заказа</Text>
                  <Text style={styles.value}>
                    {new Date(order.departureTime).toLocaleString('ru-RU')}
                  </Text>
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

        <BottomActionBar animatedStyle={animatedStyle}>
          {!accepted ? (
            <>
              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.rejectText}>Отклонить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAcceptOrder}
              >
                <Text style={styles.acceptText}>Принять заказ</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {accepted && location && (
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={buildRouteToOrder}
                >
                  <Text style={styles.acceptText}>Построить маршрут до клиента</Text>
                </TouchableOpacity>
              )}


              {buildRoute && !isNavigating && (
                <TouchableOpacity
                  style={[styles.acceptButton, { marginTop: 10 }]}
                  onPress={startNavigation}
                >
                  <Text style={styles.acceptText}>Начать навигацию</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </BottomActionBar>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  myButton: {
    top: 50,
    right: 20,
    zIndex: 10
  },
  backButton: {
    position: 'absolute', top: 50, left: 20, zIndex: 10,
    backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 5,
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
  infoRow: {
    marginVertical: 6
  },
  label: {
    fontWeight: 'bold', marginBottom: 4
  },
  value: {
    fontSize: 14, color: '#444', backgroundColor: '#F2F2F2', padding: 8, borderRadius: 6
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
  }
});
