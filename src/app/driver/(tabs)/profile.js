import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomButton from '@/shared/ui/CustomButton'; // если используешь свою кнопку

export default function Profile() {
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      {/* Здесь может быть отображение ФИО, email и т.п. */}

      <CustomButton title="Выйти" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
