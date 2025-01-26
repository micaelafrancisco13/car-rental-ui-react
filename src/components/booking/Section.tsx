import { FC } from 'react';
import { IBooking } from '../../interfaces/shared';
import BookingTable from './BookingTable'; // Ensure you have this component

interface IBookingSection {
    bookings: IBooking[]
    text: string
}

const BookingsSection:FC<IBookingSection> = ({ bookings, text }) => {
    return (
        <div className="flex">
            <div className="overflow-hidden font-mono w-full rounded-lg bg-gray-100 ring-1 ring-gray-200 shadow-sm">
                <div className="p-6">
                    {bookings?.length > 0 ? (
                        <div>
                            <h3 className="text-lg text-red-900 font-bold uppercase tracking-[.15em] mb-4">
                                { text } Bookings
                            </h3>
                            <BookingTable list={bookings} />
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <h2 className="font-semibold font-mono text-xl text-gray-900 mb-2">
                                No Bookings Have Been { text }
                            </h2>
                            <p className="text-sm text-gray-500">Book Now!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingsSection;