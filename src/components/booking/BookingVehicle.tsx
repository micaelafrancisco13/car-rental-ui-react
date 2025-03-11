import { PaperAirplaneIcon } from '@heroicons/react/24/solid'; // Ensure you have this installed
import { useGlobalStore } from '../../stores/useGlobal';
import { FC } from 'react';
import useVehicleStore from '../../stores/useVehicles';
import { IVehicle } from '../../interfaces/shared';
import { WrenchIcon, CalendarIcon } from 'lucide-react';
import { formatMoney } from '../../utils/helper';

interface IBookingVehicle {
    paginatedVehicles: IVehicle[]
}

const BookingVehicle:FC<IBookingVehicle> = ({ paginatedVehicles }) => {
    const { toggleModal } = useGlobalStore()
    const {
        setVehicle,
        } = useVehicleStore();

        const getStatusBadge = (status: string) => {
            switch (status) {
              case 'MAINTENANCE':
                return (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    <WrenchIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Under Maintenance</span>
                  </div>
                );
              case 'BOOKED1':
                return (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Currently Booked</span>
                  </div>
                );
              default:
                return null;
            }
          };
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 flex flex-col">
            {paginatedVehicles.map((vehicle) => (
                <div
                key={vehicle.id}
                className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow flex flex-col h-full "
                >
                {getStatusBadge(vehicle.availabilityStatus)}
                
                <div className="p-6 flex-grow">
                    <img
                        alt=""
                        src={vehicle.images[0]}
                        className="mx-auto h-32 w-full object-cover rounded-lg"
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                    {`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
                    </h3>
                    
                    <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Description</h4>
                    <p className="mt-2 text-sm text-gray-500">{vehicle.briefDescription}</p>
                    </div>
                    
                    <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Rate</h4>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                         {formatMoney(vehicle.dailyRate)}
                    </p>
                    </div>
                </div>

                <button
                    onClick={() => {
                    setVehicle(vehicle);
                    toggleModal();
                    }}
                    disabled={vehicle.availabilityStatus === 'MAINTENANCE'}
                    className={`relative mt-auto -mr-px inline-flex w-full items-center justify-center gap-x-2 py-3 text-sm font-semibold transition-colors duration-300
                    ${
                        vehicle.availabilityStatus === 'MAINTENANCE' 
                        // || vehicle.availabilityStatus === 'BOOKED'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-cyan-600 text-white hover:bg-cyan-700/50'
                    }`}
                >
                    <PaperAirplaneIcon className="h-4 w-4" />
                    {vehicle.availabilityStatus === 'MAINTENANCE'
                    ? 'Under Maintenance'
                    // : vehicle.availabilityStatus === 'BOOKED'
                    // ? 'Currently Booked'
                    : 'Check Availability'}
                </button>
                </div>
            ))}
            </div>
    );
};

export default BookingVehicle;