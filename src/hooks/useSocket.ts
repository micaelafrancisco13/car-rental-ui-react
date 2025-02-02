// useSocket.ts
import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { useTrackingStore } from '../stores/useTracking';
import { SOCKET_URL } from '../utils/config';

const socket: Socket = io(SOCKET_URL);

export const useSocket = () => {
  const updateLocation = useTrackingStore((state) => state.updateLocation);

  useEffect(() => {
    socket.on('locationUpdated', (data: { bookingId: string, latitude: number, longitude: number, speed: number }) => {
      updateLocation(data);
    });

    return () => {
      socket.off('locationUpdated');
    };
  }, [updateLocation]);
};