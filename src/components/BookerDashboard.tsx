import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import useBookingStore from "../stores/useBookings";
import useVehicleStore from "../stores/useVehicles";
import useGetVehicles from "../hooks/vehicle/useGetVehicles";
import { useEffect, useState } from "react";
import TablePagination from "./pagination/Table";
import TableLoading from "./loaders/TableLoading";
import RentCarModal from "./modal/UpsertBook";
import { useModalStore } from "../stores/useGlobal";

const BookerDashbaord = () => {
	const {  isFetching } = useGetVehicles()
    const { toggleModal, isOpen } = useModalStore()
    const {
        vehicles,
        currentPage,
        itemsPerPage,
        setPage,
        setItemsPerPage,
        setPaginatedVehicles,
        setVehicle,
      } = useVehicleStore();

    const {
        selectedBooker,
    } = useBookingStore();

    useEffect(() => {
        setItemsPerPage(8);
    }, [])
    const [searchQuery, setSearchQuery] = useState(""); // State for the search query
    const [filteredVehicles, setFilteredVehicles] = useState(vehicles); // Filtered list of vehicles

    useEffect(() => {
        const filtered = vehicles.filter((vehicle) =>
            `${vehicle.make} ${vehicle.model} ${vehicle.year}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) && vehicle.availabilityStatus == "AVAILABLE"
        );
        setFilteredVehicles(filtered);

        setPage(1);
    }, [searchQuery, vehicles, setPage]);

    useEffect(() => {
        setPaginatedVehicles();
    }, [filteredVehicles, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleItemsPerPageChange = (itemsPerPage: number) => {
        setItemsPerPage(itemsPerPage);
    }

    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedVehicles = filteredVehicles.slice(
        startIndex,
        startIndex + itemsPerPage
      );

    return (
        <>
        <div style={{
            height: "75vh"
        }}>
            <div className="bg-white shadow sm:rounded-lg px-4 py-5 ">
                {
                    selectedBooker ? 
                    <div>

                    </div>
                    : 
                    isFetching ? <TableLoading /> :
                    <div className="">
                        <div className="flex m-1 rounded-md border-2 border-indigo-500 overflow-hidden max-w-lg mx-auto font-[sans-serif]">
                            <input type="search" onChange={handleSearch} placeholder="Search User..."
                            className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-2" />
                            <button type='button' className="flex items-center justify-center bg-indigo-600 px-5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-white">
                                <path
                                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                                </path>
                            </svg>
                            </button>
                        </div>
                        <div style={{height: "65vh"}}>
                    <ul role="list" className="px-3 py-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-x-hidden overflow-y-auto h-full">
                        {
                        paginatedVehicles.map((vehicle) => (
                            <li
                            key={vehicle.id}
                            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-md "
                            >
                            <div className="flex flex-1 flex-col p-5">
                                <img alt="" src={vehicle.images[0]} className="mx-auto size-24 shrink-0 rounded-50" />
                                <h3 className="mt-6 text-sm font-medium text-gray-900">{`${vehicle.make} ${vehicle.model} ${vehicle.year}`}</h3>
                                <dl className="mt-1 flex grow flex-col justify-between">
                                <dt className="sr-only">Description</dt>
                                <dd className="text-sm text-gray-500">{vehicle.briefDescription}</dd>
                                <dt className="sr-only">Rate</dt>
                                <dd className="mt-3">
                                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    PHP {vehicle.dailyRate}
                                    </span>
                                </dd>
                                </dl>
                            </div>
                            <div>
                                <div className="-mt-px flex divide-x divide-gray-200">
                                    <div className="flex w-0 flex-1">
                                        <button
                                        onClick={() => {
                                            setVehicle(vehicle)
                                            toggleModal()
                                        }}
                                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                        >
                                        <PaperAirplaneIcon aria-hidden="true" className="size-5 text-gray-400" />
                                            Rent
                                        </button>
                                    </div>
                                </div>
                            </div>
                            </li>
                        ))
                    }
                    </ul>
                    </div>
                </div>

                }
                </div>
                
                <TablePagination 
                    isGrid={true}
                    handleItemsPerPageChange={(number) => handleItemsPerPageChange(number)}
                    handlePrevious={()=> handlePageChange(currentPage - 1)}
                    handleNext={()=> handlePageChange(currentPage + 1)}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    totalNumber={vehicles.length}
                />
        </div>
        {isOpen && <RentCarModal />}
        </>
    )
}

export default BookerDashbaord;