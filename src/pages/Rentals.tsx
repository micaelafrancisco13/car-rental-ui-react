import { ChevronDownIcon } from "@heroicons/react/24/outline";
import EmptyStates from "../components/feedback/EmptyState";
import TableLoading from "../components/loaders/TableLoading";
import {useGetBookings} from "../hooks/booking/useGetBookings";
import Wrapper from "../layouts/Wrapper";
import useBookingStore from "../stores/useBookings";
import SelectMenu from "../components/feedback/SelectMenu";
import { useEffect, useState } from "react";
import TablePagination from "../components/pagination/Table";
import BookingDetails from "../components/modal/BookingDetails";
import { useGlobalStore } from "../stores/useGlobal";
import { formatDateNumber, sendEmail } from "../utils/helper";
import { patchBookingStatus } from "../hooks/useUpdate";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useVehicleStore from "../stores/useVehicles";
import dayjs from "dayjs";
import EditableBalanceCell from "../components/EditBalance";
import useUpdateBookings from "../hooks/booking/useUpdate";
import { AxiosError } from "axios";
import { ChevronUp, ChevronDown } from "lucide-react";

const Rentals = () => {

    const navigate = useNavigate();

	const { isFetching } = useGetBookings()
    const {
        // bookings,
        filteredBookings,
        paginated,
        currentPage,
        itemsPerPage,
        searchQuery,
        sortOrder,
        setSort,
        setPage,
        setItemsPerPage,
        setPaginatedBookings,
        filterBooking,
        setBookingDetails,
        updateBalance,
        setSearchQuery,

    } = useBookingStore();

    const {
        setVehicle
    } = useVehicleStore();

    const { openDetails, toggleView } = useGlobalStore()

    const patchBooking = patchBookingStatus()
    const { mutate: updateBooking, isPending: isPendingStatusUpdate } = useUpdateBookings();

    const [statusOption, setStatus] = useState<string>("")
    const [paymentStatusOption, setPaymentStatusOption] = useState<string>("")
    
    const handleChangeStatus = (id: string, key: string, status: string) => {
        const data = {
            status,
        }
        patchBooking.mutate({ id, data, name: key }, {
            onSuccess: (response) => {
                toast.success('Status Change Successfully')
                sendEmail({
                      email:response.booker.email, 
                      name: response.booker.firstName, 
                      message: `Your booking status has been updated to ${response.status}. 
                                Your booking ID is ${response.id} for the ${response.vehicle?.make || ""} ${response.vehicle?.model || ""}, 
                                scheduled for pickup on ${dayjs(response.startDate).format("DD/MM/YYYY")} and return on ${dayjs(response.endDate).format("DD/MM/YYYY")}.
                                For more details, please log into your account. Let us know if you need any assistance!`
                    })
            },
            onError: (error) => {
                toast.error('Error updating' + error,)
                console.error('Error updating:', error);
            }
        });
    }

    const getColor = (status: string) => {
        switch (status) {
            case "PAID":
            case "COMPLETED":
                return "green-500"; // Success
            case "RESERVED":
            case "IN_PROGRESS":
                return "blue-500"; // Active/Ongoing
            case "WITH_BALANCE":
            case "PENDING":
                return "yellow-500"; // Warning/Requires Attention
            case "FAILED":
            case "CANCELLED":
                return "red-500"; // Error/Negative
            default:
                return "gray-500"; // Default/Unknown status
        }
    };

    let headers: string[] = ["id", "Vehicle", "Booker", "Rental Date", "Return Date"]

    const userRole = localStorage.getItem("role") || "";

    if (userRole !== "booker"){
        headers = [...headers, "Balance"]
    }

    headers = [...headers,"Status", "Payment Status", "Mode", "Action"]
    useEffect(() => {
        setPaginatedBookings();
    }, [filteredBookings, currentPage]);

    useEffect(() => {
        filterBooking(statusOption === "RESERVED" ? "IN_PROGRESS" : statusOption, paymentStatusOption)
    }, [statusOption, paymentStatusOption])

    
    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleItemsPerPageChange = (itemsPerPage: number) => {
        setItemsPerPage(itemsPerPage);
    };

    const handleSaveBalance = async (bookingId: string, newValue: number) => {
        const booking = filteredBookings.find(item => item.id === bookingId)
        updateBooking({booking, depositPaid: newValue},  {
            onSuccess: () => {
                updateBalance(bookingId,newValue)
                toast.success("Booking's balance has been successfully updated.")
            },
            onError: (error) => {
                const err = error as AxiosError
                const errMsg = err.response?.data || ""
                toast.error(String(errMsg))    
            }
        })
      };

    const generatePaymentMode = (mode: string) => {
        switch(mode){
            case "cash":
                return "Cash"
            case "gcash":
                return "GCash"
            case "bank-transfer":
                return "Bank Transfer"
            default: 
            return ""
        }
    }
    return (
        <Wrapper currentTab={"rentals"}>
        {
            isPendingStatusUpdate && <TableLoading />
        }
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                <h1 className="text-base sm:text-2xl font-mono uppercase font-semibold text-cyan-900">Rentals</h1>
                {/* <p className="mt-2 text-sm text-gray-700">
                    A list of all the users in your account including their name, title, email and role.
                </p> */}
                </div>
            <div className="flex-none sm:flex justify-end space-x-5 mb-2">
                <div className="mt-5 px-2 sm:px-0">
                    <div className="flex rounded-md border border-cyan-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                        <input 
                            type="search" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Search bookings..." 
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
                </div>
                <SelectMenu 
                    defaultValue=""
                    handleFilter={(e:React.ChangeEvent<HTMLSelectElement>) => {
                        setStatus(e.target.value)
                    }}
                    options={
                        // ["", "PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
                        ["", "RESERVED", "COMPLETED"]
                    }
                    title="Status"
                />
                <SelectMenu 
                    defaultValue=""
                    handleFilter={(e:React.ChangeEvent<HTMLSelectElement>) => {
                        setPaymentStatusOption(e.target.value)
                    }}
                    options={
                        ["", "PENDING", "PAID", "FAILED"]
                    }
                    type="payment"
                    title="Payment Status"
                />
            </div>
                {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                { bookings.length > 0 && (<button
                    type="button"
                    className="block rounded-md bg-cyan-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                    Add Vehicle
                </button>)}
                </div> */}
            </div>
            <div className="mt-5 flow-root">
                <div className="mx-4 h-5/6 overflow-hidden  overflow-x-auto  sm:-mx-6 lg:-mx-8">
                <div className="inline-block border-2 border-cyan-100  min-w-full p-0 overflow-y-auto max-h-80 sm:max-h-96 scrollbar align-middle">
                   {
                    
                    isFetching ? <TableLoading /> :
                    (paginated && paginated?.length > 0) ? <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gradient-to-r from-cyan-600 to-cyan-700 sticky left-0 p-0 m-0 top-0 z-10">
                        <tr>
                            {
                                headers.map((item, idx) => {
                                    return (
                                        <th scope="col" key={idx} 
                                        onClick={() => {
                                            if(["Vehicle", "Booker"].includes(item)){
                                            const orderBy = sortOrder === "asc" ? "desc" : "asc"
                                            setSort(item, orderBy)
                                            
                                            }
                                        }}
                                        className={`whitespace-nowrap py-3.5 pl-4 pr-3 text-white text-left text-sm font-semibold text-gray-900 hover:cursor-pointer ${item === "id" ? 'hidden' : ""}`}>
                                            <div className="flex">
                                                {item}
                                                {["Vehicle", "Booker"].includes(item) && <span className="inline-flex flex-col ml-1">
                                                    <ChevronUp className={`w-3 h-3 text-gray-200`} />
                                                    <ChevronDown className={`w-3 h-3 -mt-1 text-gray-200`} />
                                                </span>}
                                                </div>
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {paginated.map((booking) => (
                        <tr key={booking.id} >
                            {/* <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                            {`${booking.bookerId}`}
                            </td> */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {booking?.vehicle ? `${booking?.vehicle?.make} ${booking?.vehicle?.model} ${booking?.vehicle?.year}` : "[Deleted Vehicle]"}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                {`${booking.booker?.firstName} ${booking.booker?.lastName}`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                {`${formatDateNumber(booking.startDate)}`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                {`${formatDateNumber(booking.endDate)}`}
                            </td>
                            { userRole !== "booker" && <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                 <EditableBalanceCell
                                    initialValue={booking.balance || 0}
                                    total={booking.totalPrice}
                                    onSave={(newValue) => {
                                        setBookingDetails(booking)
                                        handleSaveBalance(booking.id, newValue)
                                    }}
                                    disabled={booking.paymentStatus.toLowerCase() === 'paid'} // Example condition
                                    />
                            </td>}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                <div className="grid grid-cols-1">
                                    <select
                                        id="status"
                                        name="status"
                                        disabled={userRole === "booker"}
                                        defaultValue={booking.status}
                                        onChange={(event) => {
                                            handleChangeStatus(booking.id, "status", event.target.value)
                                        }}
                                        className={`col-start-1 row-start-1 text-${getColor(String(booking.status))} appearance-none rounded-md bg-white py-1.5 pl-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6`}
                                        >
                                        {/* <option value={"PENDING"} className="text-yellow-500">PENDING</option>
                                        <option value={"ACCEPTED"} className="text-blue-500">ACCEPTED</option> */}
                                        <option value={"IN_PROGRESS"} className="text-blue-500">RESERVED</option>
                                        <option value={"COMPLETED"} className="text-green-500">COMPLETED</option>
                                       { userRole === "booker" && <option value={"CANCELLED"}  className="text-red-500">CANCELLED</option>}
                                    </select>
                                    <ChevronDownIcon
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                    />
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 ">
                                <div className="grid grid-cols-1">
                                    <select
                                        id="paymentStatus"
                                        name="paymentStatus"
                                        disabled={userRole === "booker"}
                                        defaultValue={booking.paymentStatus}
                                        onChange={(event) => {
                                            handleChangeStatus(booking.id, "paymentStatus", event.target.value)
                                        }}
                                        className={`col-start-1 row-start-1 text-${getColor(String(booking.paymentStatus))} appearance-none rounded-md bg-white py-1.5 pl-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6`}
                                        >
                                        <option value={"PENDING"} className="text-yellow-500">WITH BALANCE</option>
                                        <option value={"PAID"} className="text-green-500">PAID</option>
                                        <option value={"FAILED"}  className="text-red-500">FAILED</option>
                                    </select>
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                    />
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                { generatePaymentMode(booking?.paymentMode || "cash") }
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-0 space-x-3">
                               { booking?.vehicle && <button
                                    onClick={() => {
                                        setBookingDetails(booking)
                                        toggleView()
                                    }}
                                    className="text-cyan-600 hover:text-cyan-900">
                                    View
                                    
                                </button>}
                                { (userRole !== "booker" && booking?.vehicle) && <button 
                                    onClick={()=>{
                                        setBookingDetails(booking)
                                        if(booking?.vehicle) {
                                            setVehicle(booking?.vehicle)
                                            navigate(`/track/${booking.id}`)}
                                        }
                                    }
                                    className="text-cyan-600 hover:text-cyan-900">
                                    Track
                                </button>}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                    : <EmptyStates name={"rental"} toggleModal={()=>{}} />    
                }
                </div>
                </div>
            </div>
        </div>
        {openDetails && <BookingDetails />}
        <TablePagination 
            handleItemsPerPageChange={(number) => handleItemsPerPageChange(number)}
            handlePrevious={()=> handlePageChange(currentPage - 1)}
            handleNext={()=> handlePageChange(currentPage + 1)}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalNumber={filteredBookings.length}
        />
        </Wrapper>
    )
}

export default Rentals;