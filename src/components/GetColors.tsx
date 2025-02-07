export type Status = 
  | 'pending'
  | 'reserved'
  | 'with balance'
  | 'completed'
  | 'paid'
  | 'cancelled'
  | 'failed';

interface BadgeProps {
  status: string;
}

// Type guard to check if a string is a valid Status
const isValidStatus = (status: string): status is Status => {
  const validStatuses: Status[] = [
    'pending',
    'reserved',
    'with balance',
    'completed',
    'paid',
    'cancelled',
    'failed'
  ];
  return validStatuses.includes(status.toLowerCase() as Status);
};

// Type for the status styles mapping
type StatusStylesMap = {
  [key in Status]: string;
};

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getStatusStyles = (status: string): string => {
    const baseStyles = "px-3 py-1 text-xs font-bold rounded-full";
    
    const statusStyles: StatusStylesMap = {
      pending: "bg-yellow-500 text-white",
      reserved: "bg-blue-600 text-white ",
      "with balance": "bg-purple-600 text-white",
      completed: "bg-green-600 text-white",
      paid: "bg-emerald-600 text-white",
      cancelled: "bg-gray-600 text-white",
      failed: "bg-red-600 text-white"
    };

    const normalizedStatus = status.toLowerCase();
    
    if (!isValidStatus(normalizedStatus)) {
      return `${baseStyles} bg-gray-400 text-white`;
    }

    return `${baseStyles} ${statusStyles[normalizedStatus]}`;
  };

  return (
    <span className={getStatusStyles(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
};

export default Badge;