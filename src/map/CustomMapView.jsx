import React from 'react';
import MapView from 'react-native-maps';

export default function CustomMapView({ children, mapRef, onPanDrag, ...props }) {
  return (
    <MapView
      ref={mapRef}
      key={'map-with-route'}
      style={{ flex: 1 }}
      showsUserLocation={true}
      onPanDrag={onPanDrag}
      {...props}
    >
      {children}
    </MapView>
  );
}
