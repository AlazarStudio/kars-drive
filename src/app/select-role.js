import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '@/shared/ui/CustomButton';
import { fonts } from '@/shared/theme/fonts';
import { margins } from '@/shared/theme/margins';
import { paddings } from '@/shared/theme/paddings';
import { gaps } from '@/shared/theme/gaps';

export default function SelectRoleScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите тип учётной записи</Text>

      <CustomButton onPress={() => router.push('/driver/login')} title={'Водитель'} />
      <CustomButton onPress={() => router.push('/employee/login')} title={'Сотрудник'} />
      <CustomButton onPress={() => router.push('/dispatcher/login')} title={'Диспетчер'} />
      <CustomButton onPress={() => router.push('/airline/login')} title={'Авиакомпания'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: gaps.g14,
    padding: paddings.p24
  },

  title: {
    fontSize: fonts.fs21, 
    marginBottom: margins.mb20, 
    fontWeight: fonts.fw700
  }
});
