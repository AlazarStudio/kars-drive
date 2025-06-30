import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import CustomButton from '@/shared/ui/CustomButton';

export default function ChangePasswordSheet({ onClose }) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [repeatPass, setRepeatPass] = useState('');
  const [visible, setVisible] = useState(false);

  return (
    <BottomSheetScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Настройки</Text>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Нынешний пароль</Text>
        <TextInput
          value={oldPass}
          onChangeText={setOldPass}
          secureTextEntry={!visible}
          style={styles.input}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Новый пароль</Text>
        <TextInput
          value={newPass}
          onChangeText={setNewPass}
          secureTextEntry={!visible}
          style={styles.input}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Повторите новый пароль</Text>
        <TextInput
          value={repeatPass}
          onChangeText={setRepeatPass}
          secureTextEntry={!visible}
          style={styles.input}
        />
      </View>

      <CustomButton title="Сохранить" onPress={onClose} />
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputBox: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    color: '#777',
  },
  input: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    padding: 10,
  },
});
