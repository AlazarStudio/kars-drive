import React from 'react';
import { TextInput, StyleSheet, Text } from 'react-native';
import { fonts } from '../theme/fonts';
import { colors } from '../theme/colors';
import { paddings } from '../theme/paddings';
import { margins } from '../theme/margins';
import { borders } from '../theme/borders';

export default function CustomInput({ value, label, onChangeText, placeholder, style, ...props }) {
  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        {...props}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fonts.fs12,
    fontWeight: fonts.fw600,
    color: colors.grayText,
    textTransform: 'uppercase',
    paddingLeft: paddings.pl11,
    marginBottom: margins.mb6
  },
  input: {
    backgroundColor: colors.grayBackground,
    paddingHorizontal: paddings.p14,
    paddingVertical: paddings.p14,
    borderRadius: borders.br10,
    fontSize: fonts.fs16,
    color: colors.text,
    marginBottom: margins.m14
  },
});
