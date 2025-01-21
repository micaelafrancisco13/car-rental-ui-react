import { DeliveryType, TripStatus } from "../utils/enums"

interface IBase {
    id: string
    createdAt: string
    updatedAt: string
}

export interface IUsersDetails extends IBase {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    role: string
}

export interface IVehicle extends IBase {
	make: string,
	model: string,
	year: string,
	licensePlate: string,
	dailyRate: number,
    briefDescription?: string,
    detailedDescription: string,
    features: string[],
    images: string[],
    availabilityStatus: string
}

export interface IBooking extends IBase {
    id: string,
    bookerId: string,
    booker: IUsersDetails,
    vehicleId?: string,
    vehicle?: IVehicle,
    startLocation: string,
    endLocation: string,
    startDate: Date,
    endDate: Date,
    totalPrince: number,
    status: string,
    paymentStatus: string,
    deliveryType: DeliveryType,
    // fleetTracking: Fle
}

export interface IFleetTracking extends IBase {
    bookingId: string,
    booking: string,
    bookerLatitutde: number,
    bookerLongitude: number,
    tripStatus: TripStatus,
    lastUpdatedAt: Date,
}

//Form
export interface IVehicleForm extends IBase {
    id: string
    make: string
    model: string
    year: number
    licensePlate: string
    features: string
    dailyRate: number
    availability: string
    briefDescription?: string
    detailedDescription: string
}