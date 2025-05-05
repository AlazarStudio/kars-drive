import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../theme/fonts';
import { colors } from '../theme/colors';
import { paddings } from '../theme/paddings';
import { margins } from '../theme/margins';
import { borders } from '../theme/borders';

export default function PasswordInput({ value, label, onChangeText, placeholder, style }) {
  const [secure, setSecure] = useState(true);

  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.wrapper, style]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secure}
        />
        <Pressable onPress={() => setSecure(!secure)} style={styles.icon}>
          <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5fa',
    borderRadius: borders.br10,
    paddingHorizontal: paddings.p14,
    marginBottom: margins.m14
  },
  label: {
    fontSize: fonts.fs12,
    fontWeight: fonts.fw600,
    color: colors.grayText,
    textTransform: 'uppercase',
    paddingLeft: paddings.pl11,
    marginBottom: margins.mb6
  },
  input: {
    flex: 1,
    backgroundColor: colors.grayBackground,
    paddingVertical: paddings.p14,
    fontSize: fonts.fs16,
    color: colors.text,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    paddingLeft: 8,
  },
});
