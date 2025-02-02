import { Wifi, WifiOff, Clock } from 'lucide-react';

const VehicleStatus = ({ status = 'offline' }) => {
  const statusConfigs:any = {
    moving: {
      icon: Wifi,
      text: 'Moving',
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500'
    },
    offline: {
      icon: WifiOff,
      text: 'Offline',
      color: 'bg-red-100 text-red-700',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500'
    },
    idle: {
      icon: Clock,
      text: 'Idle',
      color: 'bg-yellow-100 text-yellow-700',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500'
    }
  };

  const config = statusConfigs[status] || statusConfigs.offline;
  const Icon = config.icon;

  return (
    <div className="flex flex-col space-y-2">
      {/* Badge Style */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full ${config.color} border ${config.borderColor}`}>
        <Icon className={`w-4 h-4 ${config.iconColor} mr-2`} />
        <span className="text-sm font-medium">{config.text}</span>
      </div>

      {/* Card Style */}
      {/* <div className={`p-4 rounded-lg border ${config.borderColor} ${config.color}`}>
        <div className="flex items-center">
          <Icon className={`w-6 h-6 ${config.iconColor} mr-3`} />
          <div className="flex flex-col">
            <span className="text-base font-medium">{config.text}</span>
            <span className="text-sm opacity-75">
              {status === 'online' && 'Vehicle is currently active'}
              {status === 'offline' && 'Last seen 2 hours ago'}
              {status === 'idle' && 'No movement for 30 minutes'}
            </span>
          </div>
        </div>
      </div> */}

      {/* Minimal Style */}
      {/* <div className={`flex items-center ${config.iconColor}`}>
        <Icon className="w-4 h-4 mr-2" />
        <span className="text-sm">{config.text}</span>
      </div> */}
    </div>
  );
};

export default VehicleStatus;