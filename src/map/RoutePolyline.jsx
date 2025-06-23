import React from 'react';
import { Polyline } from 'react-native-maps';

export default function RoutePolyline({ coordinates }) {
  if (!coordinates?.length) return null;

  return (
    <Polyline
      coordinates={coordinates}
      strokeColor="#1b6ef3"
      strokeWidth={6}
    />
  );
}
