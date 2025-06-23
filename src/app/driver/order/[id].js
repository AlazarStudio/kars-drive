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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
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
              <RoutePolyline coordinates={routeCoords} />
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
                onPress={() => setAccepted(true)}
              >
                <Text style={styles.acceptText}>Принять заказ</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptText}>Выполнить заказ</Text>
            </TouchableOpacity>
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
