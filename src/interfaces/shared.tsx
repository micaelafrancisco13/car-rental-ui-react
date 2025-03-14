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
    city?: string
    otherAddress?: string
    validIdNumber?: string
    validIdType?: string
}

export interface IVehicle extends IBase {
	make: string,
	model: string,
	year: string,
    type?: string,
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
    totalPrice: number,
    status: string,
    paymentStatus: string,
    paymentMode: string,
    deliveryType: DeliveryType,
    depositPaid: number,
    balance: number
    type?: string,
    // fleetTracking: Fle
}

export interface IFleetTracking extends IBase {
    bookingId: string,
    booking: string,
    bookerLatitutde: number,
    bookerLongitude: number,
    tripStatus: TripStatus,
    lastUpdatedAt: Date,
    speed: number
}

export interface ITripHistory extends IBase {
    bookingId: string,
    booking: string,
    latitude: number
    longitude: number
    drivingDuration: number
    speed: number
    locations: ILocation[]
    recordedAt: Date
    tripStatus: string
}

export interface ILocation {
    tripHistoryId: string
    latitude:number
    longitude: number
    recordedAt: Date
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