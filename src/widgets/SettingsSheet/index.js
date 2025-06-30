import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import CustomButton from '@/shared/ui/CustomButton';

export default function SettingsSheet({ user, onOpenChangePassword }) {
  const [fio, setFio] = useState(user.fio);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [login, setLogin] = useState(user.login);
  const [password, setPassword] = useState(user.password);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <BottomSheetScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Настройки</Text>

      <Image source={{ uri: user.photoDriver }} style={styles.avatar} />
      <TouchableOpacity style={styles.avatarBtn}>
        <Text style={styles.avatarBtnText}>Сменить аватар</Text>
      </TouchableOpacity>

      <View style={styles.inputBox}>
        <Text style={styles.label}>ФИО</Text>
        <TextInput value={fio} onChangeText={setFio} style={styles.input} />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Номер телефона</Text>
        <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Логин</Text>
        <TextInput value={login} onChangeText={setLogin} style={styles.input} />
      </View>

      {/* <View style={styles.inputBox}>
        <Text style={styles.label}>Пароль</Text>
        <View style={styles.passwordRow}>
          <TextInput
            value={password}
            secureTextEntry={!passwordVisible}
            style={[styles.input, { flex: 1 }]}
            editable={false}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={{position: 'absolute', right: 10}}>
            {passwordVisible ?
              <Image
                source={require('@/shared/assets/icons/eye.png')}
                style={{ width: 22, height: 22, objectFit: 'contain' }}
              />
              :
              <Image
                source={require('@/shared/assets/icons/eyeClose.png')}
                style={{ width: 22, height: 22, objectFit: 'contain' }}
              />
            }
          </TouchableOpacity>
        </View>
      </View> */}

      <TouchableOpacity onPress={onOpenChangePassword}>
        <Text style={styles.changePassword}>Сменить пароль</Text>
      </TouchableOpacity>

      <CustomButton title="Сохранить" onPress={() => { }} />
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
  },
  avatarBtn: {
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  avatarBtnText: {
    color: '#007AFF',
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePassword: {
    color: '#007AFF',
    textAlign: 'left',
    marginBottom: 20,
  },
});
