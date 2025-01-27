import EmptyStates from "../components/feedback/EmptyState";
import TableLoading from "../components/loaders/TableLoading";
import useVehicleStore from "../stores/useVehicles";
import useGetVehicles from "../hooks/vehicle/useGetVehicles";
import Wrapper from "../layouts/Wrapper";
import { useGlobalStore } from "../stores/useGlobal";
import { useEffect, useState } from "react";
import TablePagination from "../components/pagination/Table";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import useUpdateStatus from "../hooks/vehicle/useUpdateStatus";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import VehicleFormModal from "../components/modal/UpsertVehicle";
import ConfirmationDelete from "../components/feedback/ConfirmationButton";
import { useDeleteVehicle } from "../hooks/useDelete";

const Vehicles = () => {
	const {  isFetching } = useGetVehicles()
    const { toggleModal, toggleConfirmation, open, } = useGlobalStore();

    const {
        vehicles,
        selectedVehicle,
        currentPage,
        itemsPerPage,
        setPage,
        setItemsPerPage,
        setPaginatedVehicles,
        setVehicle,
        updateStatus,
      } = useVehicleStore();

    const [searchQuery, setSearchQuery] = useState(""); // State for the search query
    const [filteredVehicles, setFilteredVehicles] = useState(vehicles); // Filtered list of vehicles

    useEffect(() => {
        const filtered = vehicles.filter((vehicle) =>
            `${vehicle.make} ${vehicle.model} ${vehicle.year}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
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
    };
    const { mutate: updateVehicleStatus, isPending: _isPendingStatusUpdate } = useUpdateStatus();

    const headers: string[] = ["id","Car", "License Plate", "Daily Rate", "Available Status", "Action"]

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedVehicles = filteredVehicles.slice(
        startIndex,
        startIndex + itemsPerPage
      );

    const getColor = (status: string) => {
        switch(status){
            case "AVAILABLE":
                return "green-500"
            case "BOOKED":
                return "red-500"
            case "MAINTENANCE":
                return "yellow-500"
            default:
                return "gray-500"
        }
    }
    const deleteMutation = useDeleteVehicle();

    const handleDelete = () => {
        deleteMutation.mutate({id: selectedVehicle?.id}, {
            onSuccess: () => {
                // Handle success
                toast.success("Vehicle deleted successfully")
            },
            onError: (error) => {
                // Handle error
                toast.success("Error deleting vehicles")

                console.error("Error deleting vehicles:", error);
            }
        });
    };

    return (
        <Wrapper currentTab={"vehicles"}>
        <VehicleFormModal />
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                <h1 className="text-base sm:text-2xl font-mono uppercase font-semibold text-cyan-900 my-3 sm:my-0">Vehicles</h1>
                </div>
                <div className="flex rounded-md border border-cyan-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                    <input 
                        type="search" 
                        onChange={handleSearch} 
                        placeholder="Search Vehicle..." 
                        className="w-full outline-none border border-cyan-500 bg-white text-gray-600 text-sm px-4 py-2 rounded-l-md" 
                    />
                    <button 
                        type="button" 
                        className="flex items-center justify-center bg-cyan-600 px-5">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 192.904 192.904" 
                            width="16px" 
                            className="fill-white">
                            <path
                                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                            </path>
                        </svg>
                    </button>
                </div>

                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    
                    { vehicles.length > 0 && (<button
                        type="button"
                        onClick={()=> {
                            toggleModal()
                            setVehicle(null)
                        }}
                        className="block rounded-md bg-cyan-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                    >
                        Add Vehicle
                    </button>)}
                </div>
            </div>
            <div className="mt-8 flow-root ">
                <div className="mx-4 h-5/6 overflow-hidden  overflow-x-auto  sm:-mx-6 lg:-mx-8">
                <div className="inline-block border-2 border-cyan-100  min-w-full p-0 overflow-y-auto max-h-80 sm:max-h-96 scrollbar align-middle">
                   {
                    
                    isFetching ? <TableLoading /> :
                    vehicles.length > 0 ? <table className="min-w-full divide-y divide-gray-300 ">
                    <thead className="bg-cyan-600 sticky left-0 p-0 m-0 top-0 z-10">
                        <tr>
                            {
                                headers.map((item, idx) => {
                                    return (
                                        <th scope="col" key={idx} className={`py-3.5 pl-4 pr-3 text-white text-left text-sm font-semibold text-gray-900 ${item === "id" ? 'hidden' : ""}`}>
                                            {item}
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedVehicles.map((vehicle) => {
                            
                            return(
                        <tr key={vehicle.id} >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                            {`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{vehicle.licensePlate}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{vehicle.dailyRate}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 grid grid-cols-1">
                                <select
                                    id="location"
                                    name="location"
                                    defaultValue={vehicle.availabilityStatus}
                                    onChange={(event) => {
                                        setVehicle(vehicle)
                                        updateVehicleStatus({availabilityStatus: event.target.value},  {
                                            onSuccess: () => {
                                                updateStatus(vehicle.id, event.target.value)
                                                toast.success("Vehicle's status has been successfully updated.")
                                            },
                                            onError: (error) => {
                                                const err = error as AxiosError
                                                const errMsg = err.response?.data || ""
                                                toast.error(String(errMsg))    
                                            }
                                        })
                                    }}
                                    className={`col-start-1 row-start-1 text-${getColor(String(vehicle.availabilityStatus))} appearance-none rounded-md bg-white py-1.5 pl-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6`}
                                    >
                                    <option value={"AVAILABLE"} className="text-green-500">Available</option>
                                    <option value={"BOOKED"} className="text-blue-500">Booked</option>
                                    <option value={"MAINTENANCE"}  className="text-yellow-500">Maintenance</option>
                                </select>
                                <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                />
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-0 space-x-3">
                                <button onClick={()=> {
                                    setVehicle(vehicle)
                                    toggleModal();
                                }} className="text-cyan-600 hover:text-cyan-900">
                                    Edit
                                </button>
                                <button onClick={()=> {
                                    setVehicle(vehicle)
                                    toggleConfirmation()
                                }}className="text-cyan-600 hover:text-cyan-900">
                                    Delete
                                </button>
                            </td>
                        </tr>
                        )})}
                    </tbody>
                    </table>
                    : <EmptyStates name={"vehicle"} toggleModal={()=>toggleModal()} />    
                }
                </div>
                </div>
            </div>
            <TablePagination 
                handleItemsPerPageChange={(number) => handleItemsPerPageChange(number)}
                handlePrevious={()=> handlePageChange(currentPage - 1)}
                handleNext={()=> handlePageChange(currentPage + 1)}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                totalNumber={vehicles.length}
            />
            
        </div>
        {open && <ConfirmationDelete handleConfirm={()=> {
            handleDelete()
        }} />}
        </Wrapper>
    )
}

export default Vehicles;