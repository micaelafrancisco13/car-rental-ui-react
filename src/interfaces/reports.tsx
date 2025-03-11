export interface IVehicleReport {
    vehicle: string
    type: string
    bookings: number
    revenue: string
}

export interface IBookerReport {
    name: string
    email: string
    bookings: number
    spent: string
    lastBookings: string
}


export interface IBookingReport {
    booker: string
    vehicle: string
    rentedDates: string
    duration: string
    cost: string
    status: string
    lastBookings: string
}