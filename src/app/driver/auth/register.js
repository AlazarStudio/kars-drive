import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import CustomInput from '../../../shared/ui/CustomInput';
import PasswordInput from '../../../shared/ui/PasswordInput';
import CustomButton from '../../../shared/ui/CustomButton';
import Logo from '../../../shared/ui/Logo';
import { paddings } from '@/shared/theme/paddings';
import { colors } from '@/shared/theme/colors';
import { margins } from '@/shared/theme/margins';
import { fonts } from '@/shared/theme/fonts';
import { gaps } from '@/shared/theme/gaps';
import PhotoUpload from '@/shared/ui/PhotoUpload';
import CheckBoxGroup from '@/shared/ui/CheckBoxGroup';
import { Alert } from 'react-native';
import { BASE_URL } from '@/shared/config';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function DriverRegister() {
  const router = useRouter();
  const [fio, setFio] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [equipment, setEquipment] = useState([]);

  // Фото-файлы (можно использовать объекты или base64, по твоей архитектуре)
  const [photoDriver, setPhotoDriver] = useState(null);
  const [photoLicense, setPhotoLicense] = useState(null);
  const [photoSTS, setPhotoSTS] = useState(null);
  const [photoOSAGO, setPhotoOSAGO] = useState(null);
  const [photoCar, setPhotoCar] = useState(null);

  const handleRegister = async () => {
    if (!fio || !phone || !email || !password || !repeatPassword || !driverLicense || !carNumber) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fio,
          login: phone, // или email, если логин по нему
          password,
          email,
          phone,
          driverLicense,
          carNumber,
          photoDriver,
          photoLicense,
          photoSTS,
          photoOSAGO,
          photoCar,
          equipment,
          role: 'driver',
          status: 'pending'
        }),
      });

      if (response.ok) {
        const newUser = await response.json();
        
        await AsyncStorage.setItem('userId', String(newUser.id));
        await AsyncStorage.setItem('role', newUser.role);

        router.replace(`/driver/status?status=pending`);
      } else {
        Alert.alert('Ошибка', 'Не удалось зарегистрировать пользователя');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Ошибка соединения с сервером');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Logo />
        <Text style={styles.title}>Регистрация</Text>

        <CustomInput label="ФИО" value={fio} onChangeText={setFio} />
        <CustomInput label="Номер телефона" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <CustomInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <PasswordInput label="Пароль" value={password} onChangeText={setPassword} />
        <PasswordInput label="Повторите пароль" value={repeatPassword} onChangeText={setRepeatPassword} />

        <CustomInput label="Номер водительского удостоверения" value={driverLicense} onChangeText={setDriverLicense} />
        <CustomInput label="Номер транспортного средства" value={carNumber} onChangeText={setCarNumber} />

        <PhotoUpload label="Фото водителя" photo={photoDriver} onUpload={setPhotoDriver} />
        <PhotoUpload label="Фото ВУ" hint="Обратите внимание: фото водительского удостоверения должно быть четким" photo={photoLicense} onUpload={setPhotoLicense} />
        <PhotoUpload label="Фото СТС" hint="Обратите внимание: фото свидетельства о регистрации ТС должно быть четким" photo={photoSTS} onUpload={setPhotoSTS} />
        <PhotoUpload label="Фото ОСАГО" hint="Обратите внимание: фото полиса должно быть читаемым" photo={photoOSAGO} onUpload={setPhotoOSAGO} />
        <PhotoUpload label="Фото транспорта" photo={photoCar} onUpload={setPhotoCar} multiple />

        <CheckBoxGroup
          label="Наличие дополнительного оборудования"
          options={['Детское кресло', 'Кейтеринг', 'Рейлинги', 'Багажный бокс', 'Газовое оборудование']}
          selected={equipment}
          onChange={setEquipment}
        />
      </View>

      <View style={styles.bottomPart}>
        <CustomButton title="Регистрация" onPress={handleRegister} />

        <View style={styles.bottomContainer}>
          <Text style={styles.text}>Уже зарегистрированы? </Text>
          <Pressable onPress={() => router.push('/driver/auth/login')}>
            <Text style={styles.link}>Войти</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: paddings.p20,
    flex: 1,
    backgroundColor: colors.white,
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
