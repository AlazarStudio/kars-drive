import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/shared/config';
import SearchHeader from '@/shared/ui/SearchHeader';
import RoutePath from '@/shared/ui/RoutePath';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const res = await fetch(`${BASE_URL}/orders?driverId=${userId}`);
        const data = await res.json();

        const active = data.find(order => order.isActive);
        const upcoming = data
          .filter(order => !order.isActive)
          .sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));

        setActiveOrder(active || null);
        setOrders(upcoming);
      } catch (e) {
        console.error('Ошибка загрузки заказов:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader
        data={orders}
        searchFields={['from', 'to']}
        onSearch={setFilteredOrders}
      />

      {activeOrder && (
        <View style={styles.activeCard}>
          <Text style={styles.activeTime}>Через 4 мин.</Text>

          <RoutePath from={activeOrder.from} to={activeOrder.to} outerColor="white" innerColor="#38bdf8" textColor="#fff" />

          <TouchableOpacity style={styles.activeButton}>
            <Text style={styles.activeButtonText}>На месте</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/driver/order/${item.id}`)}>
            <RoutePath from={item.from} to={item.to} outerColor="#000000" innerColor="#38bdf8" textColor="#000000" />
            <Text style={styles.time}>
              {new Date(item.departureTime).toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} / Ожидает принятия
            </Text>
          </TouchableOpacity>


        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Больше заказов нет</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeCard: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 15
  },
  activeTime: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  activeButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  activeButtonText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#CACACA',
    backgroundColor: "#FFFFFF",
    gap: 15
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
});
