import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomButton from '@/shared/ui/CustomButton';
import { BASE_URL } from '@/shared/config';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Выход', 'Вы действительно хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['userId', 'role']);
          router.replace('/select-role');
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert('Удаление', 'Вы действительно хотите удалить аккаунт?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await fetch(`${BASE_URL}/users/${user.id}`, {
            method: 'DELETE',
          });
          await AsyncStorage.multiRemove(['userId', 'role']);
          router.replace('/select-role');
        },
      },
    ]);
  };

  const toggleStatus = async () => {
    const updated = { ...user, isActive: !user.isActive };
    await fetch(`${BASE_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: updated.isActive }),
    });
    setUser(updated);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading || !user) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View >
        <Image source={{ uri: user.photoDriver }} style={styles.avatar} />
        <Text style={styles.name}>
          {user.fio} ★{user.rating}
        </Text>

        <View style={styles.block}>
          <Text style={styles.label}>АВТОМОБИЛЬ</Text>
          <View style={styles.carBox}>
            <View style={styles.carBlock}>
              <Text>{user.carBrand}</Text>
              <Text style={styles.grayText}>{user.carColor}</Text>
            </View>
            <Text style={styles.carNumber}>{user.carNumber}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>НОМЕР ТЕЛЕФОНА</Text>
          <View style={styles.inputMock}>
            <Text>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>УПРАВЛЕНИЕ АККАУНТОМ</Text>


          <View style={styles.inputMockSetting}>
            <TouchableOpacity style={styles.settingItem}>
              <Image source={require('@/shared/assets/icons/settingsProfile.png')} style={styles.settingImg} />
              <Text style={[styles.settingText, { marginLeft: 4 }]}>Настройки</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAccount}>
              <Image source={require('@/shared/assets/icons/deleteProfile.png')} style={styles.settingImg} />
              <Text style={[styles.settingText, { color: 'red' }]}> Удалить аккаунт</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItemLast} onPress={handleLogout}>
              <Image source={require('@/shared/assets/icons/exitProfile.png')} style={styles.settingImg} />
              <Text style={[styles.settingText, { color: '#007AFF' }]}> Выйти из аккаунта</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.statusBtn, { backgroundColor: user.isActive ? '#007AFF' : '#ccc' }]}
          onPress={toggleStatus}
        >
          <Text style={styles.statusText}>
            {user.isActive ? 'Активен' : 'Не активен'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  settingImg: {
    width: 24,
    height: 24,
    objectFit: 'contain'
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  block: {
    marginBottom: 20,
  },
  label: {
    color: '#999',
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 20
  },
  carBox: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carBlock: {
    flexDirection: 'row',
    gap: 6
  },
  grayText: {
    color: '#666',
  },
  carNumber: {
    fontWeight: '600',
  },
  inputMock: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    padding: 15,
  },
  inputMockSetting: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  settingItem: {
    paddingVertical: 10,
    borderBottomColor: '#D0D0D0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  settingItemLast: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  settingText: {
    fontSize: 16
  },
  statusBtn: {
    marginTop: 'auto',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
