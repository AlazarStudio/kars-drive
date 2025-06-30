import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomButton from '@/shared/ui/CustomButton';
import { BASE_URL } from '@/shared/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileComponent from '@/shared/ui/ProfileComponent';

export default function Profile() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <ProfileComponent userInfo={user} />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  }
});
