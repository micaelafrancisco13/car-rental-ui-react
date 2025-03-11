export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    licenseExpiry: string;
    membershipTier?: 'standard' | 'gold' | 'platinum';
  }
  
  export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    category: 'economy' | 'compact' | 'midsize' | 'suv' | 'luxury' | 'van';
    dailyRate: number;
    status: 'available' | 'rented' | 'maintenance' | 'reserved';
    fuelLevel: number; // percentage
    mileage: number;
    lastService: string;
    location: string;
    imageUrl?: string;
  }
  
  export interface Rental {
    id: string;
    vehicleId: string;
    customerId: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'completed' | 'canceled' | 'overdue';
    pickupLocation: string;
    returnLocation: string;
    initialMileage: number;
    returnMileage?: number;
    dailyRate: number;
    totalCost?: number;
    insuranceOption: 'basic' | 'premium' | 'full';
    fuelOption: 'full-to-full' | 'prepaid';
    additionalDrivers: number;
  }
  
  export interface MaintenanceRecord {
    id: string;
    vehicleId: string;
    type: 'routine' | 'repair' | 'inspection' | 'cleaning';
    description: string;
    status: 'scheduled' | 'in_progress' | 'completed';
    startDate: string;
    endDate?: string;
    cost?: number;
    serviceCenterId: string;
  }
  
  export interface RentalSummary {
    totalVehicles: number;
    availableVehicles: number;
    utilization: number; // percentage
    activeRentals: number;
    overdueRentals: number;
    todayPickups: number;
    todayReturns: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    vehiclesInMaintenance: number;
  }
  