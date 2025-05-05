import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="select-role" options={{ headerShown: false }} />
      <Stack.Screen name="driver/login" options={{ title: 'Вход', headerBackTitle: 'Назад' }} />
      <Stack.Screen name="employee/login" options={{ title: 'Вход', headerBackTitle: 'Назад' }} />
      <Stack.Screen name="dispatcher/login" options={{ title: 'Вход', headerBackTitle: 'Назад' }} />
      <Stack.Screen name="airline/login" options={{ title: 'Вход', headerBackTitle: 'Назад' }} />
    </Stack>
  );
}
