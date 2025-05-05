import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { margins } from '../theme/margins';

export default function PhotoUpload({ label, hint, photo, onUpload, multiple = false }) {
    const photos = multiple ? photo || [] : photo ? [photo] : [];

    const handlePick = async () => {
        Alert.alert(
            'Загрузка фото',
            'Выберите источник',
            [
                { text: 'Камера', onPress: pickFromCamera },
                { text: 'Галерея', onPress: pickFromGallery },
                { text: 'Отмена', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const pickFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Ошибка', 'Разрешите доступ к фото');
          return;
        }
      
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
          allowsMultipleSelection: multiple,
        });
      
        if (!result.canceled && result.assets.length > 0) {
          const selected = multiple
            ? result.assets.map(asset => asset.uri)
            : result.assets[0].uri;
      
          if (multiple) {
            onUpload([...photos, ...selected]);
          } else {
            onUpload(selected);
          }
        }
      };
      

    const pickFromCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Ошибка', 'Разрешите доступ к камере');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selected = result.assets[0].uri;
            if (multiple) {
                onUpload([...photos, selected]);
            } else {
                onUpload(selected);
            }
        }
    };

    const handleRemove = (uriToRemove) => {
        if (multiple) {
            onUpload(photos.filter(uri => uri !== uriToRemove));
        } else {
            onUpload(null);
        }
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            {hint && <Text style={styles.hint}>{hint}</Text>}

            {photos.map((uri, index) => (
                <View key={index} style={styles.imageBox}>
                    <Image source={{ uri }} style={styles.image} />
                    <Pressable style={styles.removeBtn} onPress={() => handleRemove(uri)}>
                        <Ionicons name="close-circle" size={20} color="red" />
                    </Pressable>
                </View>
            ))}

            <Pressable onPress={handlePick} style={styles.uploadBox}>
                <Ionicons name="camera-outline" size={24} color="#999" />
                <Text style={styles.uploadText}>Загрузить фото</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: margins.mb20,
    },
    label: {
        fontWeight: '500',
        marginBottom: margins.mb4,
        fontSize: 14,
        color: '#333',
    },
    hint: {
        fontSize: 12,
        color: '#888',
        marginBottom: 6,
    },
    uploadBox: {
        backgroundColor: '#f5f5fa',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 10,
    },
    uploadText: {
        color: '#999',
        marginTop: 6,
    },
    imageBox: {
        position: 'relative',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    removeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
});
