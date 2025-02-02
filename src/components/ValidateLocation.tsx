import { useEffect } from "react";
import BookerDashbaord from "./BookerDashboard";
const ValidateLocation = () => {

    useEffect(() => {
        if ('Notification' in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              console.log('Notification permission granted');
            }
          });
        }
      
        if ('geolocation' in navigator) {
          navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
              console.log('Geolocation permission granted');
            }
          });
        }
      }, []);

      
    return (
        <>
        <BookerDashbaord />
        </>
    )
}

export default ValidateLocation;