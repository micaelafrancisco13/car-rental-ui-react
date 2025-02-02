// public/service-worker.js
self.addEventListener('postMessage', (event) => {
  if (event.data === 'startTracking') {
    startBackgroundTracking();
  }
});

const startBackgroundTracking = () => {
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const speed = position.coords.speed || 0;
      const tripStatus = speed > 0 ? 'ON_TRIP' : 'IDLE';
      console.log({latitude, longitude, speed, tripStatus})
      // Send data to the server
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'locationUpdate',
            payload: { latitude, longitude, speed, tripStatus },
          });
        });
      });
    },
    (error) => {
      console.error('Error getting location', error);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
};