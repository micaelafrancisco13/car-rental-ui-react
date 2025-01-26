import { PaperAirplaneIcon } from '@heroicons/react/24/solid'; // Ensure you have this installed
import { useGlobalStore } from '../../stores/useGlobal';
import { FC } from 'react';
import useVehicleStore from '../../stores/useVehicles';
import { IVehicle } from '../../interfaces/shared';

interface IBookingVehicle {
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
    paginatedVehicles: IVehicle[]
}

const BookingVehicle:FC<IBookingVehicle> = ({ paginatedVehicles, handleSearch }) => {
    const { toggleModal } = useGlobalStore()
    const {
        setVehicle,
        } = useVehicleStore();
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex m-1 rounded-lg border-2 border-indigo-500 overflow-hidden max-w-lg mx-auto font-[sans-serif] shadow-sm">
                <input
                    type="search"
                    onChange={handleSearch}
                    placeholder="Search User..."
                    className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-3"
                />
                <button
                    type="button"
                    className="flex items-center justify-center bg-indigo-600 px-6 hover:bg-indigo-700 transition-colors duration-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 192.904 192.904"
                        width="16px"
                        className="fill-white"
                    >
                        <path
                            d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"
                        />
                    </svg>
                </button>
            </div>

            <div style={{ height: "65vh" }} className="mt-6">
                <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto h-full">
                    {paginatedVehicles.map((vehicle) => (
                        <li
                            key={vehicle.id}
                            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex flex-1 flex-col p-6">
                                <img
                                    alt=""
                                    src={vehicle.images[0]}
                                    className="mx-auto h-32 w-full object-cover rounded-lg"
                                />
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">{`${vehicle.make} ${vehicle.model} ${vehicle.year}`}</h3>
                                <dl className="mt-2 flex flex-col space-y-2">
                                    <dt className="sr-only">Description</dt>
                                    <dd className="text-sm text-gray-600">{vehicle.briefDescription}</dd>
                                    <dt className="sr-only">Rate</dt>
                                    <dd className="mt-2">
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                            PHP {vehicle.dailyRate}
                                        </span>
                                    </dd>
                                </dl>
                            </div>
                            <div className="flex divide-x divide-gray-200">
                                <div className="flex w-0 flex-1">
                                    <button
                                        onClick={() => {
                                            setVehicle(vehicle);
                                            toggleModal();
                                        }}
                                        className="relative -mr-px inline-flex w-full items-center justify-center gap-x-2 rounded-bl-lg border border-transparent bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors duration-300"
                                    >
                                        <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
                                        Rent
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BookingVehicle;