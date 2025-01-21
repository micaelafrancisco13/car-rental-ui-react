import useBookingStore from "../../stores/useBookings"
import { useGlobalStore } from "../../stores/useGlobal"
import ViewDetails from "../ViewDetails"

const BookingDetails = () => {

    const { openDetails, toggleView } = useGlobalStore()

    const { setBookingDetails } = useBookingStore()

    return (
        <>
        
      {openDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white w-5/6 p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => { 
                toggleView()
                setBookingDetails(null)
              }}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className='text-black font-bold text-xl mb-5'>Booking's Details</div>
            <ViewDetails />
          </div>
        </div>
      )}
        </>
    )
}

export default BookingDetails;