import React, { useEffect, useState } from 'react';
import { useTrackingStore } from '../../stores/useTracking';
import { useSocket } from '../../hooks/useSocket';

import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet'
import SpeedIndicator from './SpeedIndicator';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import the marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
type GeolocationPosition = {
    lat: number
    lng: number
  }
  
function LocationMarker({ location }: { location: GeolocationPosition }) {

    const map = useMapEvents({})  
    const [position, setPosition] = useState({
      lat: location.lat,
      lng: location.lng
    })
  
    useEffect(() => {
      setPosition({
        lat: location.lat,
        lng: location.lng
      })
      map.flyTo([location.lat, location.lng]) 
    }, [location])
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here!</Popup>
      </Marker>
    )
  }
const BookerTrackingPage: React.FC<{ id: string }> = ({id}) => {
  const locations = useTrackingStore((state) => state.locations);

   const location = id ? locations[id] : null
  useSocket();

  return (
    <div className=''>
        {location && (
            <MapContainer
                center={[location.latitude, location.longitude]}
                zoom={30}
                scrollWheelZoom={true}
                className="h-96 z-10"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker
                location={{
                    lat: location.latitude,
                    lng: location.longitude,
                }}
                />
            </MapContainer>
            )}
            
            <div className="px-2 py-2 sm:px-3 flex items-center">
                <span>
                <SpeedIndicator 
                    speed={location?.speed || 0 }
                />
                </span>
            </div>
    </div>
  );
};

export default BookerTrackingPage;