import Wrapper from "../layouts/Wrapper";
import { useGetUsers } from "../hooks/user/useGetUsers";
import TableLoading from "../components/loaders/TableLoading";
import useUserStore from "../stores/useUsers";
import useBookingStore from "../stores/useBookings";
import { useGetBookings } from "../hooks/booking/useGetBookings";
import { IUsersDetails, IVehicle } from "../interfaces/shared";
import { jwtDecode } from "jwt-decode";
import useVehicleStore from "../stores/useVehicles";
import { formatDate, formatMoney } from "../utils/helper";
import Badge from "../components/GetColors";
import { useState } from "react";

const ReportSection = () => {

  const { isFetching } = useGetUsers()
  const {
        users: people,
        user: selectedUser,
        setUser,
    } = useUserStore();
    const { isFetching: isBookingFetching } = useGetBookings()
    const {
        bookings,
    } = useBookingStore();

    const {
        selectedVehicle,
        setVehicle
    } = useVehicleStore()
    const role = localStorage.getItem("role") || ""

    const details: IUsersDetails = jwtDecode(localStorage.getItem("authToken") || "")
    
    const [selectedView, setSelectedView] = useState<string>("vehicles")
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const isBooker = role === "booker" 

    const getFilteredBookings = () => {
      return bookings.filter(booking => {
        if (startDate && endDate) {
          const bookingStart = new Date(booking.startDate);
          const bookingEnd = new Date(booking.endDate);
          const filterStart = new Date(startDate);
          const filterEnd = new Date(endDate);
          return bookingStart >= filterStart && bookingEnd <= filterEnd;
        }
        return true;
      }).filter(item => isBooker ? item.bookerId === details.id : true);
    };

    const getVehicles = () => {
        const filterBooking = bookings.filter(item => isBooker ? item.bookerId === details.id : true)
        return Object.values(
            filterBooking.reduce((acc, booking) => {
              if (booking.vehicleId && booking.vehicle) {
                acc[booking.vehicleId] = booking.vehicle;
              }
              return acc;
            }, {} as Record<string, IVehicle>)
          );
    }

    const handleClear = () => {
      setStartDate('')
      setEndDate('')
    }

    const getAggregatedRentals = () => {
        const rentalMap: Record<string, { vehicle: IVehicle; count: number }> = {};
        bookings
          .filter((booking) => booking.bookerId === selectedUser?.id)
          .forEach(({ vehicle }) => {
            if (vehicle) {
              const key = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
              if (!rentalMap[key]) {
                rentalMap[key] = { vehicle, count: 0 };
              }
              rentalMap[key].count++;
            }
          });
        return Object.entries(rentalMap).map(([key, value]) => ({ ...value, key })).sort((a, b) => b.count - a.count); ;
      };
  return (
    <Wrapper currentTab="reports">
        {
            ((!isBooker && isFetching) || isBookingFetching) && <TableLoading />
        }
        <div className="text-gray-900 min-h-screen">
          <div className="grid grid-cols-1 sm:grid-cols-2 mb-2">
            <h2 className="text-3xl font-bold font-weight-500 uppercase text-cyan-900 mb-3">Reports</h2>
            <div className="flex justify-end pr-5">
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                {!isBooker && <option value="bookers">Bookers</option>}
                <option value="vehicles">Vehicles</option>
                <option value="rentals">Rentals</option>
              </select>
            </div>
          </div>
      <div className="grid grid-cols-1 gap-6">
        {/* Clients List */}
        {!isBooker && selectedView === "bookers" && <div className="shadow-lg rounded-lg bg-white p-4">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Clients</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {people.filter(item => item.role === "BOOKER").map((client) => (
                <button
                    key={client.id}
                    className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-cyan-700/90 hover:bg-blue-600 text-white rounded-md"
                    onClick={() => setUser(client)}
                >
                    {client.firstName} {client.lastName}
                </button>
                ))}
            </div>
          </div>
        </div>}
        { selectedView === "vehicles" && <div className="shadow-lg rounded-lg bg-white p-4">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Vehicle</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {getVehicles().map((item) => (
                <button
                    key={item.id}
                    className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-cyan-700/90 hover:bg-blue-600 text-white rounded-md"
                    onClick={() => setVehicle(item)}
                >
                    {item.model} {item.make} {item.year}
                </button>
                ))}
            </div>
          </div>
        </div>}
      {/* Bookers */}
      {selectedUser && selectedView === "bookers" && (
        <div className="mt-6 shadow-lg rounded-lg bg-white p-4">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">{selectedUser.firstName}'s Rental History</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded-lg">
            {getAggregatedRentals().map(({ key, count }) => (
               <div key={key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800">{key}</span>
                  <span className="font-medium text-cyan-600">Rented {count} time(s)</span>
                </div>
             </div>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle View */}
      { selectedVehicle && selectedView === "vehicles" && (
        <div className="mt-6 shadow-lg rounded-lg bg-white p-4">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">{selectedVehicle.model} {selectedVehicle.make} {selectedVehicle.year} Rental History</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded-lg">
            {getFilteredBookings().filter(item => item.vehicleId === selectedVehicle.id).map(booking => (
              <div key={booking.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{booking.vehicle?.make} {booking.vehicle?.model}</span>
                  <div className="text-sm text-gray-600">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </div>
                  {!isBooker && <div className="text-sm text-gray-600">
                    Booked by: {booking.booker.firstName} {booking.booker.lastName}
                  </div>}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{formatMoney(booking.totalPrice)}</span>
                  <Badge status={booking.status === "IN_PROGRESS" ? "RESERVED" : booking.status} />
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}
      {/* Rentals View */}
      {
        selectedView === "rentals" &&
        <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">All Rentals</h3>
              
              <div className="mb-6 sm:flex gap-4">
                <div className="grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div className="grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div className="flex-none flex justify-center pt-5">
                  <button onClick={handleClear} className="text-cyan-700 hover:text-cyan-900 hover:underline">
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded-lg">
                {getFilteredBookings().map((booking) => (
                  <div key={booking.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{booking.vehicle?.make} {booking.vehicle?.model}</span>
                        <div className="text-sm text-gray-600">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </div>
                        {!isBooker && <div className="text-sm text-gray-600">
                          Booked by: {booking.booker.firstName} {booking.booker.lastName}
                        </div>}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{formatMoney(booking.totalPrice)}</span>
                        <Badge status={booking.status === "IN_PROGRESS" ? "RESERVED" : booking.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
      }
      
    </div>
    </div>
    </Wrapper>
  );
}

export default ReportSection;
