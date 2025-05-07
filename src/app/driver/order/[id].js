import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BottomSheetScrollView, BottomSheetModal } from '@gorhom/bottom-sheet';
import { BASE_URL } from '@/shared/config';
import { Ionicons } from '@expo/vector-icons';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '40%', '90%'], []);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BASE_URL}/orders/${id}`);
        const data = await res.json();
        setOrder(data);

        // Показать BottomSheet
        setTimeout(() => {
          bottomSheetRef.current?.present();
        }, 100);
      } catch (error) {
        console.error('Ошибка загрузки заказа:', error);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 44.2269,
          longitude: 42.0468,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: 44.2269, longitude: 42.0468 }} title="Место подачи" />
      </MapView>

      {/* Кнопка Назад */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Кнопка "Детали заказа" */}
      <TouchableOpacity style={styles.detailsButton} onPress={() => bottomSheetRef.current?.present()}>
        <Text style={styles.detailsButtonText}>Детали заказа</Text>
      </TouchableOpacity>

      {/* BottomSheetModal */}
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
      >
        <BottomSheetScrollView contentContainerStyle={styles.content}>
          {order ? (
            <>
              <Text style={styles.name}>Александр ⭐️ 5.0</Text>
              <Text style={styles.status}>Ожидает принятия</Text>

              <View style={styles.route}>
                <Text style={styles.point}>{order.from}</Text>
                <Text style={styles.point}>{order.to}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Время заказа</Text>
                <Text style={styles.value}>
                  {new Date(order.departureTime).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Комментарий</Text>
                <Text style={styles.value}>{order.comment || 'Нет комментария'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Багаж</Text>
                <Text style={styles.value}>{order.baggageInfo || 'Не указано'}</Text>
              </View>
            </>
          ) : (
            <Text>Загрузка данных...</Text>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
  },
  detailsButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#285FE5',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 5,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff'
  },
  content: {
    padding: 16,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  status: {
    backgroundColor: '#facc15',
    padding: 4,
    borderRadius: 8,
    marginVertical: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  route: {
    marginVertical: 10,
  },
  point: {
    marginVertical: 4,
    fontSize: 14,
  },
  infoRow: {
    marginVertical: 6,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    color: '#444',
  },
});
