import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {

    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <header className="text-center mb-8">
                <h1 className="text-6xl font-bold text-blue-600">Rental Vehicle</h1>
                <p className="text-2xl text-gray-700 mt-2">Your Journey, Your Car, Your Way</p>
            </header>

            <main className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                <h2 className="text-4xl font-semibold text-gray-800 mb-6">Car Rental</h2>
                <p className="text-gray-600 mb-8">
                    Explore our wide range of vehicles and find the perfect car for your journey. Whether you're traveling for business or pleasure, we have the right car for you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-blue-600 mb-2">Vehicle Inventory</h3>
                        <p className="text-gray-600">Easy to navigate vehicles</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-blue-600 mb-2">Reservation</h3>
                        <p className="text-gray-600">Easy to rent a car</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-blue-600 mb-2">Fleet Tracking</h3>
                        <p className="text-gray-600">Easy to Vehicle tracking</p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button 
                    onClick={()=>navigate("/login")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                        Login
                    </button>
                </div>
            </main>

        </div>
    );
};

export default HomePage;