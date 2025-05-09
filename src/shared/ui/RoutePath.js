import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RoutePath({ from, to, outerColor = 'white', innerColor = '#38bdf8', textColor = '#fff' }) {
  return (
    <View style={styles.routeWrapper}>
      <View style={styles.routeIcons}>
        <View style={[styles.circle, { borderColor: outerColor }]} />
        <View style={[styles.verticalLine, { backgroundColor: outerColor }]} />
        <View style={[styles.circle, { borderColor: outerColor, backgroundColor: innerColor }]} />
      </View>

      <View style={styles.routeTexts}>
        <Text style={[styles.pointTop, { color: textColor }]}>{from}</Text>
        <Text style={[styles.point, { color: textColor }]}>{to}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  routeWrapper: {
    flexDirection: 'row',
    gap: 15,
  },
  routeIcons: {
    alignItems: 'center',
    marginTop: 2,
  },
  routeTexts: {
    flex: 1,
    justifyContent: 'space-between',
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  verticalLine: {
    width: 1,
    flex: 1,
  },
  pointTop: {
    fontSize: 14,
    marginBottom: 15,
  },
  point: {
    fontSize: 14,
  },
});
