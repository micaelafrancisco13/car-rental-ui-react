import useBookingStore from "../stores/useBookings";
import useVehicleStore from "../stores/useVehicles";
import useGetVehicles from "../hooks/vehicle/useGetVehicles";
import { useEffect, useState } from "react";
import TablePagination from "./pagination/Table";
import TableLoading from "./loaders/TableLoading";
import RentCarModal from "./modal/UpsertBook";
import { useGlobalStore } from "../stores/useGlobal";
import { useMyBookings } from "../hooks/booking/useGetBookings";
import { MdCancel } from "react-icons/md";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import ConfirmationDelete from "./feedback/ConfirmationButton";
import { patchBookingStatus } from "../hooks/useUpdate";
import { carTypeOptions, formatDate, formatMoney } from "../utils/helper";
import BookingVehicle from "./booking/BookingVehicle";
// import BookingsSection from "./booking/Section";
import BookerLocationSender from "./location/BookerLocation";
import ValidateRent from "./ValidateRent";
import { motion } from "framer-motion";
import BookerTrackingPage from "./location/BookerTracking";
import Badge from "./GetColors";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
const BookerDashbaord = () => {
	const {  isFetching } = useGetVehicles()
    const { isOpen, toggleConfirmation, open } = useGlobalStore()
    const {
        vehicles,
        paginatedVehicles,
        currentPage,
        itemsPerPage,
        setPage,
        setItemsPerPage,
        setPaginatedVehicles,
        setFilterType,
      } = useVehicleStore();

    const {
        selectedBooking,
    } = useBookingStore();

	const { isFetching: isFetchingBookings} = useMyBookings()
    const { mutate: updateVehicleStatus, isPending: isPendingStatusUpdate } = patchBookingStatus()


    const {
        bookings,
        inProgressBookings,
        // cancelledBookings,
        // completedBookings,
        // setMyBookings,
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
            .includes(searchQuery.toLowerCase()) 
            // && vehicle.availabilityStatus == "AVAILABLE"
        );
        setFilteredVehicles(filtered);
        filtered
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
    
    const handleCancel = () => {
        const id = inProgressBookings?.id || ""
        try {
            const data = {
                status: "CANCELLED",
            }
            updateVehicleStatus({ id, data, name: "status" },  {
                onSuccess: () => {
                    // updateStatus(vehicle.id, event.target.value)
                    toast.success("Vehicle's status has been successfully cancelled.")
                    // const updatedBookings = [...bookings]
                    // if (inProgressBookings) {
                    //     updatedBookings.push({ ...inProgressBookings, status: "CANCELLED"})
                    // }
                    // setMyBookings(updatedBookings)
                    // toggleConfirmation()
                    window.location.reload()
                },
                onError: (error) => {
                    const err = error as AxiosError
                    const errMsg = err.response?.data || ""
                    toast.error(String(errMsg))    
                }
            })
        } catch (err1) {
            const err = err1 as AxiosError
            const errMsg = err.response?.data || ""
            toast.error(String(errMsg))   
        }
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;

    // const paginatedVehicles = filteredVehicles.slice(
    //     startIndex,
    //     startIndex + itemsPerPage
    //   );
    const handleSortType = (e:React.ChangeEvent<HTMLSelectElement>) => {
        console.log({startIndex})
        const { value } = e.target
        setFilterType(value); 
        setPaginatedVehicles();
    };
    return (
    <>
        <div style={{
            height: "75vh"
        }}>
            {inProgressBookings?.id && <BookerLocationSender
                bookingId={inProgressBookings?.id}
            />}
            <div className="shadow sm:rounded-lg px-4 py-5 ">
                {
                    selectedBooking ? 
                    <div>

                    </div>
                    : 
                    isFetching || isFetchingBookings ? <TableLoading /> :

                    bookings?.length > 0 ? (
                        <div className="">
                            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                                <div className="md:flex space-x-10 justify-center items-center">
                                    <h2 className="text-2xl font-bold text-cyan-600">My Bookings</h2>
                                </div>
                                <div className="mt-6  gap-4 sm:mt-5 lg:grid-cols-6 lg:grid-rows-2 space-y-3">
                                {/* In Porgreess */}
                                { inProgressBookings ? (
                                    <div className="grid grid-cols-3 gap-4 w-full">
                                    <div className="col-span-3 sm:col-span-1">
                                        <BookerTrackingPage 
                                            id={inProgressBookings.id}
                                        />
                                    </div>
                                    <motion.div
                                        className="flex p-px col-span-3 sm:col-span-2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                    <div className="overflow-hidden w-full rounded-lg ring-1 ring-gray-200 shadow-lg max-lg:rounded-t-[3rem] bg-white hover:shadow-xl transition-shadow duration-300">
                                        <motion.img
                                        className="h-96 w-full object-cover"
                                        src={inProgressBookings?.vehicle?.images[0]}
                                        alt="Vehicle"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                        />
                                        <div className="p-8">
                                        <motion.h1
                                            className="text-2xl font-mono font-bold text-gray-900"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {`${inProgressBookings?.vehicle?.make} ${inProgressBookings?.vehicle?.model} ${inProgressBookings?.vehicle?.licensePlate}`}
                                        </motion.h1>
                                        <div className="mt-4 space-y-3">
                                            <div className="flex space-x-4">
                                            <p className="text-md font-mono font-medium text-gray-700">
                                                <span className="font-bold">Status:</span>{" "}
                                                    <Badge key={inProgressBookings?.status || ""} status={inProgressBookings?.status === "IN_PROGRESS" ? "RESERVED" : inProgressBookings?.status} />
                                                {/* <span className={getStatusColor(inProgressBookings?.status || "")}> */}
                                                {/* <span>{inProgressBookings?.status === "IN_PROGRESS" ? "RESERVED" : inProgressBookings?.status} */}
                                                {/* </span> */}
                                            </p>
                                            <p className="text-md font-mono font-medium text-gray-700">
                                                <span className="font-bold">Payment Status:</span>{" "}
                                                {/* <span className={getStatusColor(inProgressBookings?.paymentStatus || "")}> */}
                                                <Badge key={inProgressBookings?.paymentStatus || ""} status={inProgressBookings?.paymentStatus === "PENDING" ? "WITH BALANCE" : inProgressBookings?.paymentStatus} />
                                                {/* </span> */}
                                            </p>
                                            </div>
                                            <p className="text-md font-mono font-medium text-gray-700">
                                                <span className="font-bold">Rental Date:</span>{" "}
                                                <span>
                                                    {inProgressBookings?.startDate &&
                                                    inProgressBookings?.endDate &&
                                                    `${formatDate(inProgressBookings.startDate)}`}
                                                </span>
                                            </p>
                                            <p className="text-md font-mono font-medium text-gray-700">
                                                <span className="font-bold">Return Date:</span>{" "}
                                                <span>
                                                    {inProgressBookings?.startDate &&
                                                    inProgressBookings?.endDate &&
                                                    `${formatDate(inProgressBookings.endDate)}`}
                                                </span>
                                            </p>
                                            <p className="text-md font-mono font-medium text-gray-700">
                                                <span className="font-bold">Total Rate:</span>{" "}
                                                <span>{formatMoney(inProgressBookings?.totalPrice || 1)}</span>
                                            </p>
                                            </div>
                                            {(inProgressBookings?.paymentStatus?.toLowerCase() === "with balance" && inProgressBookings?.balance == 0) && (
                                                <button
                                                    type="button"
                                                    onClick={toggleConfirmation}
                                                    className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center font-mono font-semibold"
                                                >
                                                    {isPendingStatusUpdate ? (
                                                        <svg
                                                            aria-hidden="true"
                                                            className="inline w-6 h-6 text-gray-200 animate-spin"
                                                            viewBox="0 0 100 101"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                fill="currentColor"
                                                            />
                                                            <path
                                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                fill="currentFill"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <MdCancel className="mr-2" /> Cancel
                                                        </div>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    </motion.div>
                                    </div>
                                ) : 
                                <>
                                <div>
                                    <div className="flex text-black">
                                        <div className="font-bold pt-1 pr-2">
                                        Sort by:
                                        </div>
                                        <div className="text-sm text-gray-900 grid grid-cols-3">
                                            <select
                                                id="location"
                                                name="location"
                                                onChange={handleSortType}
                                                // defaultValue={selectedUser?.role || "BOOKER"}
                                                className={`col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pl-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                                                >
                                                    <option value="">All</option>
                                                    {
                                                        carTypeOptions.map(item => {
                                                            return(
                                                                <option key={item} value={item}>{item}</option>
                                                            )
                                                        })
                                                    }
                                            </select>
                                            <ChevronDownIcon
                                            aria-hidden="true"
                                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="flex m-1 rounded-lg border-2 border-cyan-500 overflow-hidden max-w-lg mx-auto font-[sans-serif] shadow-sm">
                                        <input
                                            type="search"
                                            onChange={handleSearch}
                                            placeholder="Search User..."
                                            className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-3"
                                        />
                                        <button
                                            type="button"
                                            className="flex items-center justify-center bg-cyan-600 px-6 hover:bg-cyan-700 transition-colors duration-300"
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
                                    </div> */}
                                </div>
                                <BookingVehicle 
                                    paginatedVehicles={paginatedVehicles}
                                />
                                </>
                                }
                          
                                {/* <BookingsSection
                                    bookings={completedBookings}
                                    text={"Completed"}
                                />
                                <BookingsSection
                                    bookings={cancelledBookings}
                                    text={"Cancelled"}
                                /> */}
                                </div>
                            </div>
                            </div>
                    ) :
                    <div className="">
                       
                        <div className="flex m-1 hidden rounded-md border-2 border-indigo-500 overflow-hidden max-w-lg mx-auto font-[sans-serif]">
                            <input type="search" onChange={handleSearch} placeholder="Search Vehicle..."
                            className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-2" />
                            <button type='button' className="flex items-center justify-center bg-indigo-600 px-5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-white">
                                <path
                                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                                </path>
                            </svg>
                            </button>
                        </div>
                        <div className="flex text-black mb-3">
                            <div className="font-bold pt-1 pr-2">
                            Sort by:
                            </div>
                            <div className="text-sm text-gray-900 grid grid-cols-3">
                                <select
                                    id="location"
                                    name="location"
                                    onChange={handleSortType}
                                    // defaultValue={selectedUser?.role || "BOOKER"}
                                    className={`col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pl-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                                    >
                                        <option value="">All</option>
                                        {
                                            carTypeOptions.map(item => {
                                                return(
                                                    <option key={item} value={item}>{item}</option>
                                                )
                                            })
                                        }
                                </select>
                                <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                />
                            </div>
                        </div>
                        <ValidateRent />
                    </div>

                }
                </div>
                
               { !inProgressBookings && (
                <div className=""><TablePagination 
                    isGrid={true}
                    handleItemsPerPageChange={(number) => handleItemsPerPageChange(number)}
                    handlePrevious={()=> handlePageChange(currentPage - 1)}
                    handleNext={()=> handlePageChange(currentPage + 1)}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    totalNumber={vehicles.length}
                /></div>)}
        </div>
        {isOpen && <RentCarModal />}
        {open && <ConfirmationDelete handleConfirm={handleCancel} />}
        </>
    )
}

export default BookerDashbaord;