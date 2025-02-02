import { GaugeCircle } from 'lucide-react';

const SpeedIndicator = ({ speed = 0 }) => {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center space-x-3">
        <GaugeCircle className="w-6 h-6 text-cyan-600" />
        <div className="flex flex-col">
          <span className="text-lg font-medium text-gray-700">
            {speed.toFixed(2)} km/h
          </span>
          <span className="text-sm text-gray-500">
            Current Speed
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpeedIndicator;