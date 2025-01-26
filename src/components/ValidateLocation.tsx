import { useEffect, useState } from "react";
import BookerDashbaord from "./BookerDashboard";

const ValidateLocation = () => {
    const [_location, setLocation] = useState<{ latitude: number | null, longitude: number | null }>({ latitude: null, longitude: null });
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    checkLocation(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Error fetching location', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const checkLocation = (lat: number, lon: number) => {
        // Coordinates for San Fernando Pampanga and Angeles City
        const sanFernandoPampanga = { latitude: 15.0319, longitude: 120.6895 };
        const angelesCity = { latitude: 15.1450, longitude: 120.5847 };

        const isInSanFernando = Math.abs(lat - sanFernandoPampanga.latitude) < 0.1 && Math.abs(lon - sanFernandoPampanga.longitude) < 0.1;
        const isInAngelesCity = Math.abs(lat - angelesCity.latitude) < 0.1 && Math.abs(lon - angelesCity.longitude) < 0.1;

        setIsAvailable(isInSanFernando || isInAngelesCity);
    };
    return (
        <>
        {isAvailable === null ? (
                    <p className="text-gray-600">Checking your location...</p>
                ) : isAvailable ? 
                    <BookerDashbaord />
                :  (
                    <p className="text-red-600 text-xl">Sorry, the app is not available in your current location.</p>
                )
            }
        </>
    )
}

export default ValidateLocation;