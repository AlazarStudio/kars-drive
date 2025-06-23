import React from 'react';
import { Marker } from 'react-native-maps';

export default function WaypointMarker({ coordinate, label }) {
  if (!coordinate) return null;

  return (
    <Marker
      coordinate={coordinate}
      title={label}
    />
  );
}
