import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchHeader({ data = [], onSearch, searchFields = [] }) {
  const [query, setQuery] = useState('');

  const handleSearch = (text) => {
    setQuery(text);

    if (!text.trim()) {
      onSearch(data); // вернём все данные, если строка пуста
      return;
    }

    const lowerText = text.toLowerCase();

    const filtered = data.filter((item) =>
      searchFields.some((field) =>
        String(item[field] || '')
          .toLowerCase()
          .includes(lowerText)
      )
    );

    onSearch(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#aaa" />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleSearch}
          placeholder="Поиск"
          placeholderTextColor="#aaa"
        />
      </View>
      <Pressable style={styles.bell}>
        <Ionicons name="notifications-outline" size={20} color="#000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5fa',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: '#000',
  },
  bell: {
    padding: 8,
  },
});
