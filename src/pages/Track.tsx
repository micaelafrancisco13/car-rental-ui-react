import Wrapper from "../layouts/Wrapper";
import "leaflet/dist/leaflet.css";
import useVehicleStore from "../stores/useVehicles";
import useBookingStore from "../stores/useBookings";
import AdminTrackingPage from "../components/location/AdminTracking";
import { formatDate } from "../utils/helper";
import { useBookingHistory, useGetBookingDetails } from "../hooks/booking/useGetBookings";
import { useParams } from "react-router-dom";
import TableLoading from "../components/loaders/TableLoading";
import TripMap from "../components/location/TripMap";
import useHistoryStore from "../stores/useHistory";
import { ITripHistory } from "../interfaces/shared";
import { useTrackingStore } from "../stores/useTracking";
import axios from "axios";
import { useEffect, useState } from "react";
import SpeedIndicator from "../components/location/SpeedIndicator";
import VehicleStatus from "../components/location/VehicleStatus";
import VehicleHeader from "../components/location/VehicleHeader";

const groupTripsByDay = (trips: ITripHistory[]) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groupedTrips = {
    today: [] as ITripHistory[],
    yesterday: [] as ITripHistory[],
    earlierThisWeek: [] as ITripHistory[],
  };

  trips.forEach((trip) => {
    const tripDate = new Date(trip.recordedAt);

    if (tripDate.toDateString() === today.toDateString()) {
      groupedTrips.today.push(trip);
    } else if (tripDate.toDateString() === yesterday.toDateString()) {
      groupedTrips.yesterday.push(trip);
    } else {
      groupedTrips.earlierThisWeek.push(trip);
    }
  });

  return groupedTrips;
};
const CarTracker: React.FC = () => {

  const {
    selectedVehicle,
  } = useVehicleStore()

  const {
    selectedBooking
  } = useBookingStore()
  const date = selectedBooking?.startDate ? `${formatDate(selectedBooking?.startDate)}` : ""
  const endDate = selectedBooking?.endDate ? `${formatDate(selectedBooking?.endDate)}` : ""
  
  const [status, setStatus] = useState<string>("offline")
  const { id = "" } = useParams<{ id: string }>(); 

  const { isFetching } = useGetBookingDetails(id);

  const { isFetching: historyFetching } = useBookingHistory(id)

  const { history } = useHistoryStore()

  const filter = groupTripsByDay(history)


  const locations = useTrackingStore((state) => state.locations);

  const location = id ? locations[id] : null

  const [nameAddress, setNameAddress] = useState<string>("offline")
  const getNameAddress = async () => {
    const lat = location?.latitude || ""
    const lon = location?.longitude || ""
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    try {
      const response = await axios.get(url)

      const address = response.data.display_name || "Address not found";
      setNameAddress(address)

    } catch (err) {

    }
  }
  useEffect(() => {
    getNameAddress()
    if (location) {
      
      setStatus(location.speed < 1 ? "idle" : "moving")
    } else {
      setStatus("offline")
    }
  }, [location])
  return (
    <Wrapper currentTab="vehicle" >
      {
        isFetching || historyFetching && <TableLoading />
      }
    <div className="h-96 w-full flex flex-col items-center">
      <VehicleHeader 
        name={`${selectedVehicle?.make} ${selectedVehicle?.model} ${selectedVehicle?.year}`}
        date={date}
        endDate={endDate}
      />
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="col-span-3 sm:col-span-2">
          <div className="">
          <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow text-cyan-700 font-bold">
        <div className="px-2 py-2 sm:px-2 flex items-center">
              <span className="pr-2">{status == "offline" ? "" : nameAddress}</span>
              <VehicleStatus 
                status={status}
              />
        </div>
        <div className="max-h-96">
          <AdminTrackingPage />
        </div>
        <div className="px-2 py-2 sm:px-3 flex items-center">
            <span>
              <SpeedIndicator 
                speed={location?.speed || 0 }
              />
            </span>
        </div>
    </div>
          </div>
        </div>
        <div className="col-span-3 sm:col-span-1 w-full">
          <div className="text-xl text-cyan-700 font-mono p-3">
            Tracking History
          </div>
          <div className="max-h-96 overflow-y-auto text-cyan-800">
          {history.length && 
            <>
              {filter.today.length > 0 && <div>Today</div>}
              {filter.today.map((item) => {
                return (
                  <div className="mb-3">
                    {<TripMap 
                      locations={item.locations}
                      speed={item.speed}
                    />}
                  </div>
                )
              })}
              {filter.yesterday.length > 0 && <div>Yesterday</div>}
              
              {filter.yesterday.map((item) => {
                return (
                  <div className="mb-3">
                    {<TripMap 
                      locations={item.locations}
                      speed={item.speed}
                    />}
                  </div>
                )
              })}
              {filter.earlierThisWeek.length > 0 && <div>Earlier This week</div>}
              
              {filter.earlierThisWeek.map((item) => {
                return (
                  <div className="mb-3">
                    {<TripMap 
                      locations={item.locations}
                      speed={item.speed}
                    />}
                  </div>
                )
              })}
            </>
          }
          </div>
        </div>
      </div>
    </div>
    </Wrapper>

  );
};

export default CarTracker;
