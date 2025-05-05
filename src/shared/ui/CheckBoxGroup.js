import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CheckBoxGroup({ label, options, selected, onChange }) {
  const toggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {options.map((option, index) => (
        <Pressable key={index} onPress={() => toggle(option)} style={styles.optionRow}>
          <Ionicons
            name={selected.includes(option) ? 'checkbox-outline' : 'square-outline'}
            size={24}
            color="#2563eb"
          />
          <Text style={styles.optionText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#000',
  },
});
