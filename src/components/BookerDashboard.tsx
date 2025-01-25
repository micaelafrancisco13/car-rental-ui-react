import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import useBookingStore from "../stores/useBookings";
import useVehicleStore from "../stores/useVehicles";
import useGetVehicles from "../hooks/vehicle/useGetVehicles";
import { useEffect, useState } from "react";
import TablePagination from "./pagination/Table";
import TableLoading from "./loaders/TableLoading";
import RentCarModal from "./modal/UpsertBook";
import { useGlobalStore } from "../stores/useGlobal";
import { useMyBookings } from "../hooks/booking/useGetBookings";
import { IBooking } from "../interfaces/shared";
import { MdCancel } from "react-icons/md";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import ConfirmationDelete from "./feedback/ConfirmationButton";
import { patchBookingStatus } from "../hooks/useUpdate";
import { formatDate, formatDateNumber, formatMoney } from "../utils/helper";
const BookerDashbaord = () => {
	const {  isFetching } = useGetVehicles()
    const { toggleModal, isOpen, toggleConfirmation, open } = useGlobalStore()
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
        selectedBooking,
    } = useBookingStore();

    
	const { isFetching: isFetchingBookings} = useMyBookings()
    const { mutate: updateVehicleStatus, isPending: isPendingStatusUpdate } = patchBookingStatus()


    const {
        bookings,
        inProgressBookings,
        cancelledBookings,
        completedBookings,
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
    const paginatedVehicles = filteredVehicles.slice(
        startIndex,
        startIndex + itemsPerPage
      );

    const getStatusColor = (status: string) => {
        switch(status) {
            case "PENDING":
                return`inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/10`
            case "IN_PROGRESS":
                return`inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10`
            case "ACCEPTED":
                return`inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/10`
            case "COMPLETED":
            case "PAID":
                return`inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10`
            case "FAILED":
            case "CANCELLED":
                return`inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10`
        }
    }

    const bookingTable = (list: IBooking[]) => {
        return <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rental Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {
                    list.map((item) => {
                        const { vehicle } = item
                        return (
                            <tr>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{`${vehicle?.make} ${vehicle?.model} ${vehicle?.licensePlate}`}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {`${formatDateNumber(item.startDate)} - ${formatDateNumber(item.endDate)}`}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {`${formatMoney(item.totalPrice)}`}
                                </td>
                                {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">lindsay.walton@example.com</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Member</td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit<span className="sr-only">, Lindsay Walton</span></a> */}
                                {/* </td> */}
                            </tr>
                        )
                    })
                }

            </tbody>
          </table>
        </div>
      </div>
    }

    const BookingVehicle = () => {
        return <div className="">
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

    return (
        <>
        <div style={{
            height: "75vh"
        }}>
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
                                <h2 className="text-xl font-semibold text-indigo-600">My Bookings</h2>
                                <div className="mt-6  gap-4 sm:mt-5 lg:grid-cols-6 lg:grid-rows-2 space-y-3">
                                {/* In Porgreess */}
                                { inProgressBookings ? (<div className="flex p-px ">
                                    <div className="overflow-hidden w-full rounded-lg ring-1 ring-white/15 max-lg:rounded-t-[3rem] ">
                                    <img className="h-96 w-full object-cover" src={inProgressBookings?.vehicle?.images[0]} alt="" />
                                    <div className="p-10 bg-white">
                                        <h1 className="text-xl font-mono uppercase font-semibold text-gray-900">{ `${inProgressBookings?.vehicle?.make} ${inProgressBookings?.vehicle?.model} ${inProgressBookings?.vehicle?.licensePlate}` }</h1>
                                        <div className="flex space-x-3">
                                        <p className="mt-2 text-md font-medium tracking-tight text-indigo-900">
                                           <span className="font-mono font-bold"> Status:</span> <span className={getStatusColor(inProgressBookings?.status || "")}>{inProgressBookings?.status}</span>
                                        </p>
                                        <p className="mt-2 text-md font-medium tracking-tight text-indigo-900">
                                        <span className="font-mono font-bold"> Payment Status:</span> <span className={getStatusColor(inProgressBookings?.paymentStatus || "")}>{inProgressBookings?.paymentStatus}</span>
                                        </p>
                                        </div>
                                        <p className="mt-2 text-md font-medium tracking-tight text-indigo-900">
                                        <span className="font-mono font-bold"> Rental Date:</span> <span>{(inProgressBookings?.startDate && inProgressBookings?.endDate) && `${formatDate(inProgressBookings.startDate)} - ${formatDate(inProgressBookings?.endDate)}`}</span>
                                        </p>
                                        
                                        <p className="mt-2 text-md font-medium tracking-tight text-indigo-900">
                                        <span className="font-mono font-bold"> Total Rate:</span> <span>{formatMoney(inProgressBookings?.totalPrice || 1)}</span>
                                        </p>
                                        { (inProgressBookings?.status === "PENDING") && (<button
                                            type="button"
                                            onClick={() =>{
                                                toggleConfirmation()
                                            }}
                                            className=" mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                        { (isPendingStatusUpdate ? (
                                            <span
                                            >
                                            <svg
                                                aria-hidden="true"
                                                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-white fill-gray-600"
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
                                            </span>
                                        ) : (
                                               <div className="flex justify-center items-center"><MdCancel className="mr-3" />Cancel</div>
                                        ))}

                                        </button>)}
                                        </div>
                                    </div>
                                </div>) : 
                                BookingVehicle()
                                }
                                {/* Completed */}
                                {/* <div className="flex p-px lg:col-span-2">
                                <div className="overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 lg:rounded-tr-[2rem]">
                                    {
                                        completedBookings?.length > 0 ? 
                                        <div>
                                            {bookingTable(completedBookings)}
                                        </div>
                                        : <div>
                                            No Bookings has been completed
                                        </div>
                                    }
                                    </div>
                                </div> */}
                                {/* Cancelled */}

                                <div className="flex">
                                <div className="overflow-hidden rounded-lg font-mono w-full bg-gray-100 ring-1 ring-white/15 ">
                                    <div className="p-5">
                                    {
                                        completedBookings?.length > 0 ? 
                                        <div>
                                            <h3 className="text-lg text-green-900 font-bold uppercase tracking-[.15em]">Completed Bookings</h3>
                                            {bookingTable(completedBookings)}
                                        </div>
                                        : <div className="font-semibold font-mono text-xl text-gray-900">
                                            No Bookings has been completed
                                        <h3 className="text-sm/4 font-semibold text-gray-400">Book Now!</h3>
                                        </div>
                                        
                                    }
                                        {/* <p className="mt-2 text-lg font-medium tracking-tight text-white">Advanced access control</p>
                                        <p className="mt-2 max-w-lg text-sm/6 text-gray-400">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.</p> */}
                                    </div>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="overflow-hidden font-mono w-full rounded-lg bg-gray-100 ring-1 ring-white/15 ">
                                    {/* <img className="h-80 object-cover object-left" src="https://tailwindui.com/plus/img/component-images/bento-02-performance.png" alt="" /> */}
                                    <div className="p-5">
                                    {
                                        cancelledBookings?.length > 0 ? 
                                        <div>
                                            <h3 className="text-lg text-red-900 font-bold uppercase tracking-[.15em]">Cancelled Bookings</h3>

                                            {bookingTable(cancelledBookings)}
                                        </div>
                                        : <div className="font-semibold font-mono text-xl text-gray-900">
                                            No Bookings has been Cancelled
                                        <h3 className="text-sm/4 font-semibold text-gray-400">Book Now!</h3>
                                        </div>
                                    }
                                        {/* <p className="mt-2 text-lg font-medium tracking-tight text-white">Lightning-fast builds</p>
                                        <p className="mt-2 max-w-lg text-sm/6 text-gray-400">Sed congue eros non finibus molestie. Vestibulum euismod augue vel commodo vulputate. Maecenas at augue sed elit dictum vulputate.</p> */}
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                    ) :
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
                
               { !inProgressBookings && (<TablePagination 
                    isGrid={true}
                    handleItemsPerPageChange={(number) => handleItemsPerPageChange(number)}
                    handlePrevious={()=> handlePageChange(currentPage - 1)}
                    handleNext={()=> handlePageChange(currentPage + 1)}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    totalNumber={vehicles.length}
                />)}
        </div>
        {isOpen && <RentCarModal />}
        {open && <ConfirmationDelete handleConfirm={handleCancel} />}
        </>
    )
}

export default BookerDashbaord;