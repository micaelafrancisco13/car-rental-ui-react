import { ChevronDownIcon } from "@heroicons/react/24/outline";
import EmptyStates from "../components/feedback/EmptyState";
import TableLoading from "../components/loaders/TableLoading";
import {useGetBookings} from "../hooks/booking/useGetBookings";
import Wrapper from "../layouts/Wrapper";
import useBookingStore from "../stores/useBookings";

const Rentals = () => {
	const { isFetching } = useGetBookings()
    const {
        bookings
    } = useBookingStore();

    const getColor = (status: string) => {
        switch(status){
            case "PAID":
                return "green-500"
            case "FAILED":
                return "red-500"
            case "PENDING":
                return "yellow-500"
            default:
                return "gray-500"
        }
    }

    const headers: string[] = ["id","Booking #", "Booker", "Vehicle", "Rental Date", "Payment Status", "Action"]
    return (
        <Wrapper currentTab={"rentals"}>
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                <h1 className="text-base font-semibold text-gray-900">Rentals</h1>
                {/* <p className="mt-2 text-sm text-gray-700">
                    A list of all the users in your account including their name, title, email and role.
                </p> */}
                </div>
                {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                { bookings.length > 0 && (<button
                    type="button"
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Add Vehicle
                </button>)}
                </div> */}
            </div>
            <div className="mt-8 flow-root">
                <div className="mx-4 h-5/6 overflow-hidden  overflow-x-auto  sm:-mx-6 lg:-mx-8">
                <div className="inline-block border-2 border-indigo-100  min-w-full p-0 overflow-y-auto max-h-80 sm:max-h-96 scrollbar align-middle">
                   {
                    
                    isFetching ? <TableLoading /> :
                    (bookings && bookings?.length > 0) ? <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-indigo-600 sticky left-0 p-0 m-0 top-0 z-10">
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
                        {bookings.map((booking) => (
                        <tr key={booking.id} >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                            {`${booking.bookerId}`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {`${booking?.vehicle?.make} ${booking?.vehicle?.model} ${booking?.vehicle?.year}`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                {`${booking.booker?.firstName} ${booking.booker?.lastName}`}
                            </td>
                            <td>
                                {`${booking.startTime} ${booking.endDate}`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 grid grid-cols-1">
                            <select
                                    id="location"
                                    name="location"
                                    defaultValue={booking.paymentStatus}
                                    onChange={(_event) => {
                                        // setVehicle(vehicle)
                                        // updateVehicleStatus({availabilityStatus: event.target.value},  {
                                        //     onSuccess: () => {
                                        //         updateStatus(vehicle.id, event.target.value)
                                        //         toast.success("Vehicle's status has been successfully updated.")
                                        //     },
                                        //     onError: (error) => {
                                        //         const err = error as AxiosError
                                        //         const errMsg = err.response?.data || ""
                                        //         toast.error(String(errMsg))    
                                        //     }
                                        // })
                                    }}
                                    className={`col-start-1 row-start-1 text-${getColor(String(booking.paymentStatus))} appearance-none rounded-md bg-white py-1.5 pl-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                                    >
                                    <option value={"PENDING"} className="text-green-500">PENDING</option>
                                    <option value={"PAID"} className="text-blue-500">PAID</option>
                                    <option value={"FAILED"}  className="text-yellow-500">FAILED</option>
                                </select>
                                <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                />
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-0 space-x-3">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                    Track
                                </a>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                    : <EmptyStates name={"rental"} />    
                }
                </div>
                </div>
            </div>
        </div>
        </Wrapper>
    )
}

export default Rentals;