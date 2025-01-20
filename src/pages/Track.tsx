import React, { useState } from "react";
import Wrapper from "../layouts/Wrapper";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CarTracker: React.FC = () => {
  const [carId, setCarId] = useState<string>("");
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);

  const handleTrackCar = (): void => {
    const simulatedPosition: [number, number] = [
      51.505 + Math.random() * 0.02 - 0.01,
      -0.09 + Math.random() * 0.02 - 0.01,
    ];
    setPosition(simulatedPosition);
  };
  // const mapRef = useRef(null);
  // const latitude = 51.505;
  // const longitude = -0.09;

  return (
    <Wrapper currentTab="vehicle" >
    <div className="h-screen w-5/6 flex flex-col items-center bg-gray-100">
      <header className="w-full p-4 bg-blue-600 text-white text-center text-lg font-bold">
        Car Tracking Dashboard
      </header>

      <div className="p-4 mt-4 w-full max-w-md">
        <label className="block mb-2 text-gray-700 font-medium">Enter Car ID:</label>
        <input
          type="text"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
          placeholder="e.g., CAR123"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleTrackCar}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Track Car
        </button>
      </div>

      {/* Map Section */}
      <div className="w-full flex-grow">
        <MapContainer
          center={position}
          zoom={13}
          className="h-5/6 w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Marker position={position}>
            <Popup>
              Car {carId || "unknown"} is here.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
    </Wrapper>

  );
};

export default CarTracker;
