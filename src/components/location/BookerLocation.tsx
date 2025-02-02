// BookerLocationSender.tsx
import React, { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../../utils/config';

const socket: Socket = io(SOCKET_URL);

const BookerLocationSender: React.FC<{ bookingId: string }> = ({ bookingId }) => {
  // const [route] = useState([
  //   { lat: 37.7749, lng: -122.4194 }, // San Francisco
  //   { lat: 37.7858, lng: -122.4064 }, // Financial District
  //   { lat: 37.8019, lng: -122.4189 }, // Fisherman's Wharf
  //   { lat: 37.8199, lng: -122.4783 }, // Golden Gate Bridge
  // ]);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [isMoving, setIsMoving] = useState(false);
  // const [position, setPosition] = useState({ lat: 37.7749, lng: -122.4194 }); // Starting in SF
  // const [tripStatus, setTripStatus] = useState('IDLE');
  // useEffect(() => {
  //   let intervalId: number | undefined;

  //   if (isMoving) {
  //     intervalId = setInterval(() => {
  //       setCurrentIndex((prevIndex) => {
  //         const nextIndex = (prevIndex + 1) % route.length;
  //         const nextPosition = route[nextIndex];
          
  //         // Simulate gradual movement
  //         const steps = 10;
  //         const latDiff = (nextPosition.lat - position.lat) / steps;
  //         const lngDiff = (nextPosition.lng - position.lng) / steps;
  //         // Calculate mock speed (in km/h)
  //         const newSpeed = Math.random() * (60 - 30) + 30; // Random speed between 30-60 km/h
          
  //         const newPosition = {
  //           lat: position.lat + latDiff,
  //           lng: position.lng + lngDiff
  //         };
          
  //         setPosition(newPosition);
          
  //         // Emit location update via socket
  //         socket.emit('updateLocation', {
  //           bookingId,
  //           latitude: newPosition.lat,
  //           longitude: newPosition.lng,
  //           speed: newSpeed,
  //           tripStatus
  //         });

  //         setPosition(prev => ({
  //           lat: prev.lat + latDiff,
  //           lng: prev.lng + lngDiff
  //         }));
          
  //         return nextIndex;
  //       });
  //     }, 2000); // Update every 2 seconds
  //   }

  //   return () => {
  //     if (intervalId) clearInterval(intervalId);
  //   };
  // }, [isMoving, position.lat, position.lng, route, tripStatus]);
  
  // const toggleMovement = () => {
  //   setIsMoving(!isMoving);
  //   setTripStatus(tripStatus ===  "IDLE" ? "ON_TRIP" : "IDLE")
  //   if(tripStatus == "ON_TRIP") {
  //     socket.emit('updateLocation', {
  //       bookingId,
  //       latitude: 37.8199,
  //       longitude: -122.4783,
  //       speed: 0,
  //       tripStatus: "IDLE"
  //     });

  //   }
  // };
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const speed = position.coords.speed || 0;
        const tripStatus = speed > 0 ? 'ON_TRIP' : 'IDLE';
        socket.emit('updateLocation', { bookingId, latitude, longitude, speed, tripStatus });
      },
      (error) => {
        console.error('Error getting location', error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [bookingId]);

  return (
    <>
      {/* <button onClick={toggleMovement}>
        { isMoving ? "stop " : "start "} mock
      </button> */}
    </>
  );
};

export default BookerLocationSender;