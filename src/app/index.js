import { useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/shared/config';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const role = await AsyncStorage.getItem('role');

        if (!userId || !role) {
          setRedirect('/select-role');
          return;
        }

        const res = await fetch(`${BASE_URL}/users/${userId}`);
        const user = await res.json();

        if (user.role === 'driver') {
          if (user.status === 'approved') {
            setRedirect('/driver/(tabs)/home');
          } else {
            setRedirect(`/driver/auth/status?status=${user.status}`);
          }
        } else {
          await AsyncStorage.multiRemove(['userId', 'role']);
          setRedirect('/select-role');
        }

      } catch (err) {
        await AsyncStorage.multiRemove(['userId', 'role']);
        setRedirect('/select-role');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={redirect} />;
}
