import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomButton from '@/shared/ui/CustomButton';
import { BASE_URL } from '@/shared/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import SettingsSheet from '@/widgets/SettingsSheet';
import ChangePasswordSheet from '@/widgets/ChangePasswordSheet';


export default function ProfileComponent({ userInfo }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSettingOpened, setIsSettingOpened] = useState(false);
  const [isPasswordOpened, setIsPasswordOpened] = useState(false);

  const settingsRef = useRef(null);
  const passwordRef = useRef(null);

  const snapPoints = useMemo(() => ['85%'], []);
  const isVisible = useSharedValue(0);
  const bottomSheetRef = useRef(null);

  const handleLogout = async () => {
    Alert.alert('Выход', 'Вы действительно хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['userId', 'role']);
          router.replace('/select-role');
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert('Удаление', 'Вы действительно хотите удалить аккаунт?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await fetch(`${BASE_URL}/users/${user.id}`, {
            method: 'DELETE',
          });
          await AsyncStorage.multiRemove(['userId', 'role']);
          router.replace('/select-role');
        },
      },
    ]);
  };

  const toggleStatus = async () => {
    const updated = { ...user, isActive: !user.isActive };
    await fetch(`${BASE_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: updated.isActive }),
    });
    setUser(updated);
  };

  useEffect(() => {
    setUser(userInfo)
    setLoading(false)
  }, [userInfo]);

  if (loading || !user) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View >
        <Image source={{ uri: user.photoDriver }} style={styles.avatar} />
        <Text style={styles.name}>
          {user.fio} ★{user.rating}
        </Text>

        {user.role == 'driver' &&
          <View style={styles.block}>
            <Text style={styles.label}>АВТОМОБИЛЬ</Text>
            <View style={styles.carBox}>
              <View style={styles.carBlock}>
                <Text>{user.carBrand}</Text>
                <Text style={styles.grayText}>{user.carColor}</Text>
              </View>
              <Text style={styles.carNumber}>{user.carNumber}</Text>
            </View>
          </View>
        }

        <View style={styles.block}>
          <Text style={styles.label}>НОМЕР ТЕЛЕФОНА</Text>
          <View style={styles.inputMock}>
            <Text>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>УПРАВЛЕНИЕ АККАУНТОМ</Text>
          <View style={styles.inputMockSetting}>
            <TouchableOpacity style={styles.settingItem} onPress={() => bottomSheetRef.current?.present()}>
              <Image source={require('@/shared/assets/icons/settingsProfile.png')} style={styles.settingImg} />
              <Text style={[styles.settingText, { marginLeft: 4 }]}>Настройки</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAccount}>
              <Image source={require('@/shared/assets/icons/deleteProfile.png')} style={styles.settingImg} />
              <Text style={[styles.settingText, { color: 'red' }]}> Удалить аккаунт</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItemLast} onPress={handleLogout}>
              <Image source={require('@/shared/assets/icons/exitProfile.png')} style={styles.settingImg} />
              <Text style={[styles.settingText, { color: '#007AFF' }]}> Выйти из аккаунта</Text>
            </TouchableOpacity>
          </View>
        </View>

        {user.role == 'driver' &&
          <TouchableOpacity
            style={[styles.statusBtn, { backgroundColor: user.isActive ? '#007AFF' : '#ccc' }]}
            onPress={toggleStatus}
          >
            <Text style={styles.statusText}>
              {user.isActive ? 'Активен' : 'Не активен'}
            </Text>
          </TouchableOpacity>
        }

        {isSettingOpened &&
          <TouchableOpacity style={styles.backButton} onPress={() => bottomSheetRef.current?.dismiss()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        }
        {isPasswordOpened &&
          <TouchableOpacity style={styles.backButton} onPress={() => passwordRef.current?.dismiss()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        }

        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onAnimate={(fromIndex, toIndex) => {
            isVisible.value = toIndex >= 0 ? 1 : 0;
            setIsSettingOpened(toIndex >= 0 ? true : false)
            setIsPasswordOpened(false)
          }}
        >
          <BottomSheetScrollView>
            <SettingsSheet user={user} onOpenChangePassword={() => passwordRef.current?.present()} />
          </BottomSheetScrollView>
        </BottomSheetModal>


        <BottomSheetModal
          ref={passwordRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onAnimate={(fromIndex, toIndex) => {
            isVisible.value = toIndex >= 0 ? 1 : 0;
            setIsSettingOpened(true)
            setIsPasswordOpened(toIndex >= 0 ? true : false)
          }}
        >
          <BottomSheetScrollView>
            <ChangePasswordSheet onClose={() => passwordRef.current?.dismiss()} />
          </BottomSheetScrollView>
        </BottomSheetModal>

      </View>

      {(isSettingOpened || isPasswordOpened ) && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => bottomSheetRef.current?.dismiss()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  settingImg: {
    width: 24,
    height: 24,
    objectFit: 'contain'
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  block: {
    marginBottom: 20,
  },
  label: {
    color: '#999',
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 20
  },
  carBox: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carBlock: {
    flexDirection: 'row',
    gap: 6
  },
  grayText: {
    color: '#666',
  },
  carNumber: {
    fontWeight: '600',
  },
  inputMock: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    padding: 15,
  },
  inputMockSetting: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  settingItem: {
    paddingVertical: 10,
    borderBottomColor: '#D0D0D0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  settingItemLast: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  settingText: {
    fontSize: 16
  },
  statusBtn: {
    marginTop: 'auto',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute', top: 0, left: 0, zIndex: 10,
    backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 5,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },

});
