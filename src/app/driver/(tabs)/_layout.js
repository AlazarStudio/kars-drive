import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DriverTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'История',
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Поддержка',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
