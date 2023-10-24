import React, { useState, useCallback, memo } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '20px',
  border: '1px solid #caccd1',
};

function ListingsMap(props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY,
  })
  const [map, setMap] = useState(null)
  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])
  return isLoaded && props.ready ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      defaultCenter={props.center}
      zoom={4.5}
      onLoad={(map) => {
        const bounds = new window.google.maps.LatLngBounds();
        props.markers.forEach((marker) => {
          if(marker.location.lat && marker.location.lng)
            bounds.extend({ lat: marker.location.lat, lng: marker.location.lng });
        })
        map.fitBounds(bounds);
        setMap(map);
      }}
      
      onUnmount={onUnmount}
    >
      {props.children}
    </GoogleMap>
  ) : <></>
}

export default React.memo(ListingsMap)