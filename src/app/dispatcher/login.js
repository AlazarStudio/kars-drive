import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function DispatcherLogin() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход — Диспетчер</Text>

      <TextInput placeholder="Логин" style={styles.input} />
      <TextInput placeholder="Пароль" secureTextEntry style={styles.input} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff',
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 30,
  },
  input: {
    width: '100%', padding: 14, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 10, marginBottom: 15, fontSize: 16,
  },
  button: {
    width: '100%', backgroundColor: '#2563eb', paddingVertical: 14,
    borderRadius: 999, alignItems: 'center',
  },
  buttonText: {
    color: '#fff', fontWeight: '600', fontSize: 16,
  },
});
