import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal } from 'react-native-portalize';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export function useBottomActionVisibility() {
  const visible = useSharedValue(0);

  const show = () => (visible.value = 1);
  const hide = () => (visible.value = 0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(visible.value === 1 ? 0 : 100, { duration: 500 }),
      },
    ],
    opacity: withTiming(visible.value, { duration: 500 }),
  }));

  return { visible, show, hide, animatedStyle };
}

export default function BottomActionBar({ children, animatedStyle }) {
  return (
    <Portal>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 26,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 9999,
    elevation: 20,
  },
});
