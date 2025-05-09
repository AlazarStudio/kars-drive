import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Host } from 'react-native-portalize'; // <-- добавляем Host

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Host>
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </BottomSheetModalProvider>
        </Host>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
