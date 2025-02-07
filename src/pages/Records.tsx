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
    
    const getVehicles = () => {
        const filterBooking = bookings.filter(item => item.bookerId === details.id)
        return Object.values(
            filterBooking.reduce((acc, booking) => {
              if (booking.vehicleId && booking.vehicle) {
                acc[booking.vehicleId] = booking.vehicle;
              }
              return acc;
            }, {} as Record<string, IVehicle>)
          );
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
        return Object.entries(rentalMap).map(([key, value]) => ({ ...value, key }));
      };
  return (
    <Wrapper currentTab="reports">
        {
            ((role !== "booker" && isFetching) || isBookingFetching) && <TableLoading />
        }
        <div className="text-gray-900 min-h-screen">
        <h2 className="text-3xl font-bold mb-3 text-center">Report</h2>
      <div className="grid grid-cols-1 gap-6">
        {/* Clients List */}
        {role !== "booker" && <div className="shadow-lg rounded-lg bg-white p-4">
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
        {role === "booker" && <div className="shadow-lg rounded-lg bg-white p-4">
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
      {selectedUser && (
        <div className="mt-6 shadow-lg rounded-lg bg-white p-4">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">{selectedUser.firstName}'s Rental History</h3>
          <ul className="space-y-2">
            {getAggregatedRentals().map(({ key, count }) => (
              <li key={key} className="p-2 bg-gray-100 rounded-md">
                {key} - Rented {count} time(s)
              </li>
            ))}
          </ul>
        </div>
      )}
      {role === "booker" && selectedVehicle && (
        <div className="mt-6 shadow-lg rounded-lg bg-white p-4">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">{selectedVehicle.model} {selectedVehicle.make} {selectedVehicle.year} Rental History</h3>
          <ul className="space-y-2">
            {bookings.filter(item => item.vehicleId === selectedVehicle.id).map(item => (
              <li key={item.id} className="p-2 bg-gray-100 rounded-md">
                {formatDate(item.startDate)} - {formatDate(item.endDate)} <span className="px-3"> {formatMoney(item.totalPrice)} </span>
                <Badge key={item.status+item.id} status={item.status === "IN_PROGRESS" ? "RESERVED" : item.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
      
    </div>
    </div>
    </Wrapper>
  );
}

export default ReportSection;
