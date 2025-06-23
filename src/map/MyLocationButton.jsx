import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MyLocationButton({ onPress, style, isFollowing }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
    >
      <Ionicons name="locate" size={20} color="white" />
      {!isFollowing && <Text style={styles.text}>Где я?</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  text: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
  },
});
