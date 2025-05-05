import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import CustomInput from '../../shared/ui/CustomInput';
import PasswordInput from '../../shared/ui/PasswordInput';
import CustomButton from '../../shared/ui/CustomButton';
import Logo from '../../shared/ui/Logo';
import { paddings } from '@/shared/theme/paddings';
import { colors } from '@/shared/theme/colors';
import { margins } from '@/shared/theme/margins';
import { fonts } from '@/shared/theme/fonts';
import { gaps } from '@/shared/theme/gaps';

export default function DriverLogin() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Авторизация через json-server
    console.log('Login:', login);
    console.log('Password:', password);
  };

  return (
    <View style={styles.container}>
      <View>
        <Logo />
        <Text style={styles.title}>Войти</Text>

        <CustomInput
          label={'Логин'}
          value={login}
          onChangeText={setLogin}
        />
        <PasswordInput
          label='Пароль'
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.forgotContainer}>
          <Text>Не помните пароль от аккаунта? </Text>
          <Pressable onPress={() => router.push('/driver/restore')}>
            <Text style={styles.link}>Восстановить</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.bottomPart}>
        <CustomButton title="Войти" onPress={handleLogin} />

        <View style={styles.bottomContainer}>
          <Text style={styles.text}>Ещё не зарегистрированы? </Text>
          <Pressable onPress={() => router.push('/driver/register')}>
            <Text style={styles.link}>Регистрация</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: paddings.p20,
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: fonts.fs21,
    fontWeight: fonts.fw600,
    textAlign: 'center',
    marginVertical: margins.mb20,
  },
  forgotContainer: {
    flexDirection: 'row',
    marginLeft: paddings.pl11
  },
  bottomPart: {
    marginBottom: margins.mb40,
    gap: gaps.g22
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    color: colors.grayText,
  },
  link: {
    color: colors.link,
    fontWeight: fonts.fw500,
  },
});
