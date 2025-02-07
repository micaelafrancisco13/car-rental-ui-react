import React from 'react';
import useBookingStore from "../stores/useBookings";
import { calcualteTotalRate, formatDate } from "../utils/helper";
import { useNavigate } from 'react-router-dom';

enum BookingStatus {
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  ACCEPTED = 'ACCEPTED',
}

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const getStatusClasses = (status?: string) => {
    switch (status) {
      case BookingStatus.PAID:
      case BookingStatus.COMPLETED:
      case BookingStatus.ACCEPTED:
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case BookingStatus.PENDING:
      case BookingStatus.IN_PROGRESS:
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
      default:
        return 'bg-red-50 text-red-700 ring-red-600/20';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(status)}`}
    >
      {status === "IN_PROGRESSS" ? "RESERVED" : status === "PENDING" ? "WITH BALANCE" : status}
    </span>
  );
};

const ViewDetails: React.FC = () => {
  const { selectedBooking } = useBookingStore();
  
  const vehicle = selectedBooking?.vehicle;
  const startDate = selectedBooking && formatDate(selectedBooking?.startDate);
  const endDate = selectedBooking && formatDate(selectedBooking?.endDate);
  if (!vehicle){
    return
  }

  const totalRate = React.useMemo(() => 
    (startDate && endDate) && calcualteTotalRate(startDate, endDate, vehicle?.dailyRate ?? 1), 
    [startDate, endDate, vehicle?.dailyRate]
  );

  if (!selectedBooking) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        No booking selected
      </div>
    );
  }
  const navigate = useNavigate()

  const userRole = localStorage.getItem("role") || ""
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Vehicle Details */}
        <div className="lg:max-w-lg lg:self-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
            </h1>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {vehicle.licensePlate}
            </h2>
          </div>

          <section className="mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="font-bold text-slate-500 pr-2 text-sm">Status: </span>
                <StatusBadge status={selectedBooking.status} />
              </div>
              <div className="flex items-center">
                <span className="font-bold text-slate-500 pr-2 text-sm">Payment: </span>
                <StatusBadge status={selectedBooking.paymentStatus} />
              </div>
            </div>

            {vehicle.briefDescription && (
              <div className="mt-3">
                <p className="text-base text-gray-500">{vehicle.briefDescription}</p>
              </div>
            )}
          </section>
        </div>

        {/* Vehicle Image */}
        <div className="mt-5 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          {vehicle.images?.[0] ? (
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="aspect-square w-full rounded-lg object-cover"
            />
          ) : (
            <div className="aspect-square w-full rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Booking Information */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <div className="space-y-4">
            <p className="text-base text-gray-900">
              {startDate} - {endDate}
            </p>
            <div>
              <span className="font-bold text-slate-500 text-sm pr-2">Total Rate:</span>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                {totalRate}
              </span>
            </div>
          </div>
          
          { userRole === "booker" &&<div className="mt-10">
            <button
              type="button"
              onClick={()=> navigate(`/track/${selectedBooking.id}`)}
              className="w-full rounded-md bg-gradient-to-r from-cyan-500 to-cyan-700 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Track Booking
            </button>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;