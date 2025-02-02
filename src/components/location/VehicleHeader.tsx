import { Calendar, Car } from 'lucide-react';
import { FC } from 'react';

interface IVehicleHeader {
    name: string,
    date: string,
    endDate: string,
}
const VehicleHeader:FC<IVehicleHeader> = ({ name, date, endDate }) => {
  return (
    <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 shadow-lg w-full">
      <div className="max-w-screen mx-auto">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Vehicle Information */}
            <div className="flex items-center space-x-3">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {name}
                </h1>
              </div>
            </div>

            {/* Rental Date Information */}
            <div className="flex items-center space-x-3">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-center sm:text-right">
                <div className="text-cyan-100 text-sm">Rental Period</div>
                <div className="text-white font-medium">
                  {date} - {endDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleHeader;