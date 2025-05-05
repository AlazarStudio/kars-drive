import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '@/shared/ui/CustomButton';
import { fonts } from '@/shared/theme/fonts';
import { margins } from '@/shared/theme/margins';
import { paddings } from '@/shared/theme/paddings';
import { gaps } from '@/shared/theme/gaps';
import { colors } from '@/shared/theme/colors';
import { borders } from '@/shared/theme/borders';

export default function SelectRoleScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите тип учётной записи</Text>

      <View>
        <View style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 14,
        }}>
          <TouchableOpacity onPress={() => router.push('/driver/login')} style={styles.button}><Text style={{ color: colors.background }}>Водитель</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/employee/login')} style={styles.button}><Text style={{ color: colors.background }}>Сотрудник</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/dispatcher/login')} style={styles.button}><Text style={{ color: colors.background }}>Диспетчер</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/airline/login')} style={styles.button}><Text style={{ color: colors.background }}>Авиакомпания</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: gaps.g14,
    padding: paddings.p24,
    backgroundColor: colors.white
  },

  title: {
    fontSize: fonts.fs21,
    marginBottom: margins.mb20,
    fontWeight: fonts.fw700
  },

  button: {
    width: '48%',
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.background,
    borderWidth: 1,
    borderRadius: borders.br10,
  }
});
