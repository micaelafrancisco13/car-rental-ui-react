import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import { Car, Navigation, Gauge } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface ILocation {
  latitude: number;
  longitude: number;
}

interface ITripMap {
  locations: ILocation[];
  speed: number;
}

const TripMap: React.FC<ITripMap> = ({ locations, speed }) => {
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const position: [number, number] = [locations[0]?.latitude || 0, locations[0]?.longitude || 0];

  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    let distance = 0;
    for (let i = 0; i < locations.length - 1; i++) {
      const { latitude: lat1, longitude: lon1 } = locations[i];
      const { latitude: lat2, longitude: lon2 } = locations[i + 1];
      distance += haversineDistance(lat1, lon1, lat2, lon2);
    }
    setTotalDistance(distance);
  }, [locations]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header with Trip Distance */}
      <div className="px-5 py-4 md:py-2 bg-gradient-to-r from-cyan-600 to-cyan-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-white">
            <div className="bg-white/10 p-2 rounded-lg">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm md:text-xs text-cyan-100 ">Total Distance</p>
              <p className="text-lg md:text-xs font-semibold">{totalDistance.toFixed(2)} km</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-white">
            <div className="bg-white/10 p-2 rounded-lg">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm md:text-xs text-cyan-100">Speed</p>
              <p className="text-lg md:text-xs font-semibold">{speed.toFixed(2)} km/h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <MapContainer 
          center={position} 
          zoom={13} 
          className="h-[200px] w-full z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline 
            positions={locations.map(loc => [loc.latitude, loc.longitude])}
            color="#0891b2"
            weight={3}
            opacity={0.8}
          >
            <Popup>Trip route</Popup>
          </Polyline>
        </MapContainer>

        {/* Map Controls Overlay */}
        <div className="absolute bottom-4 right-4 z-[400] bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 text-cyan-700">
            <Navigation className="h-5 w-5" />
            <span className="text-sm font-medium">
              {locations.length} waypoints
            </span>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="text-gray-500">Start Point</p>
            <p className="font-medium">
              {locations[0]?.latitude.toFixed(4)}, {locations[0]?.longitude.toFixed(4)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">End Point</p>
            <p className="font-medium">
              {locations[locations.length - 1]?.latitude.toFixed(4)}, 
              {locations[locations.length - 1]?.longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripMap;