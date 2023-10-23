import React, { useState } from 'react'
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
  const [map, setMap] = React.useState(null)
/*   const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])
 */
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      style={{ '&;hover': { boxShadow: '0 0 0 0.25rem rgba(13,110,253,.25)'}}}
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