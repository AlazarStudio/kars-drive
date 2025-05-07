import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomButton from '@/shared/ui/CustomButton';
import { colors } from '@/shared/theme/colors';
import { paddings } from '@/shared/theme/paddings';

const statusConfig = {
  pending: {
    title: 'Ваша заявка на рассмотрении!',
    description:
      'В данный момент ваши данные проходят верификацию, пожалуйста, подождите.\nПроверка может занять от 1 до 3 рабочих дней.',
    // image: require('@/shared/assets/status/pending.png'),
    button: { text: 'Отменить', action: 'cancel' },
  },
  approved: {
    title: 'Ваша регистрация успешно завершена.',
    description: 'Вы можете начать получать заказы.',
    image: require('@/shared/assets/status/success.png'),
    button: { text: 'Войти', action: 'login' },
  },
  rejected: {
    title: 'Ваша заявка не прошла проверку.',
    description:
      'Пожалуйста, свяжитесь с поддержкой для получения подробной информации.',
    image: require('@/shared/assets/status/rejected.png'),
    button: { text: 'Написать в поддержку', action: 'support' },
  },
};

export default function DriverStatusScreen() {
  const router = useRouter();
  const { status } = useLocalSearchParams();
  const config = statusConfig[status] || statusConfig.pending;

  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleButton = () => {
    switch (config.button.action) {
      case 'cancel':
        setConfirmVisible(true);
        break;
      case 'login':
        router.replace('/driver/auth/login');
        break;
      case 'support':
        router.push('/support');
        break;
    }
  };

  const handleCancelConfirm = () => {
    setConfirmVisible(false);
    router.replace('/driver/auth/register');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>KARSDRIVE</Text>
          <Image
            source={require('@/shared/assets/icons/profile-status.png')}
            style={styles.icon}
          />
        </View>

        {/* Center content */}
        <View style={styles.center}>
          <Image source={config.image} style={styles.statusImage} />
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.description}>{config.description}</Text>
        </View>

        {/* Action Button */}
        <CustomButton title={config.button.text} onPress={handleButton} />

        {/* Confirm Modal */}
        {confirmVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>
                Вы уверены, что хотите отменить регистрацию?
              </Text>
              <View style={styles.modalButtons}>
                <CustomButton
                  title="Нет"
                  onPress={() => setConfirmVisible(false)}
                  style={styles.noBtn}
                />
                <CustomButton
                  title="Да"
                  onPress={handleCancelConfirm}
                  style={styles.yesBtn}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: paddings.p20,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  icon: {
    width: 24,
    height: 24,
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statusImage: {
    width: 48,
    height: 54,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    color: colors.grayText,
    fontSize: 14,
  },

  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    width: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#333',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  noBtn: {
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  yesBtn: {
    flex: 1,
  },
});
