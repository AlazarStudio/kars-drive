import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Logo() {
  return (
    <View style={styles.logo}>
      <Text style={styles.text}>logo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#555',
  },
});
