import { useEffect, useState } from "react";
import useVehicleStore from "../stores/useVehicles";
import BookingVehicle from "./booking/BookingVehicle";

const ValidateRent = () => {
    const [_location, setLocation] = useState<{ latitude: number | null, longitude: number | null }>({ latitude: null, longitude: null });
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);


    const checkLocation = (lat: number, lon: number) => {
        // Coordinates for San Fernando Pampanga and Angeles City
        const sanFernandoPampanga = { latitude: 15.0319, longitude: 120.6895 };
        const angelesCity = { latitude: 15.1450, longitude: 120.5847 };

        const isInSanFernando = Math.abs(lat - sanFernandoPampanga.latitude) < 0.1 && Math.abs(lon - sanFernandoPampanga.longitude) < 0.1;
        const isInAngelesCity = Math.abs(lat - angelesCity.latitude) < 0.1 && Math.abs(lon - angelesCity.longitude) < 0.1;

        setIsAvailable(isInSanFernando || isInAngelesCity);
    };
    const {
        paginatedVehicles,
        // setVehicle,
    } = useVehicleStore();
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

    return (
        <>
          {isAvailable === null  ? (
                    <p className="text-gray-600">Checking your location...</p>
                ) : isAvailable ? 
                
                <BookingVehicle 
                    paginatedVehicles={paginatedVehicles}
                />
                    // <RentVehicle />
                : 
                (
                    <p className="text-red-600 text-xl">Sorry, the app is not available in your current location.</p>
                )
            }
        </>
    )
}

export default ValidateRent