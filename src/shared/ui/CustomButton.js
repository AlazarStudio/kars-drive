import { borders } from '@/shared/theme/borders';
import { colors } from '@/shared/theme/colors';
import { fonts } from '@/shared/theme/fonts';
import { paddings } from '@/shared/theme/paddings';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress, style }) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: colors.background,
        paddingVertical: paddings.p14,
        borderRadius: borders.br20,
        alignItems: 'center',
    },

    buttonText: {
        fontSize: fonts.fs17,
        fontWeight: fonts.fw600,
        fontStyle: "normal",
        textAlign: "center",
        color: "#FFFFFF"
    },
});
