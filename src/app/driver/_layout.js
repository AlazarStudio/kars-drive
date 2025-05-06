import { Stack } from 'expo-router';

export default function DriverLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ title: 'Вход' }} />
      <Stack.Screen name="auth/register" options={{ title: 'Регистрация' }} />
      <Stack.Screen name="auth/status" options={{ headerShown: false }} />
    </Stack>
  );
}
