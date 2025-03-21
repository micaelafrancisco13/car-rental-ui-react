import { useState } from "react";
import { formatMoney } from "../../utils/helper";
import { ChevronUp, ChevronDown } from "lucide-react";

const TableRecords = ({ data, columns, keys }: { data: any[]; columns: string[]; keys: string[] }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" | null }>({
    key: null,
    direction: null,
  });

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return sortConfig.direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="p-2 text-left border-b cursor-pointer" onClick={() => handleSort(keys[index])}>
                <div className="flex items-center">
                  {col}
                  <span className="ml-1 flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortConfig.key === keys[index] && sortConfig.direction === "asc" ? "text-black" : "text-gray-400"}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortConfig.key === keys[index] && sortConfig.direction === "desc" ? "text-black" : "text-gray-400"}`}
                    />
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              {keys.map((key, idx) => {
                let label = item[key];
                if (key === "revenue") {
                  label = formatMoney(item[key]);
                }
                let color = "";
                if (key === "status") {
                  switch (item[key]) {
                    case "AVAILABLE":
                    case "COMPLETED":
                      color = "text-green-500";
                      break;
                    case "BOOKED":
                      color = "text-red-500";
                      break;
                    case "MAINTENANCE":
                    case "IN_PROGRESS":
                      color = "text-orange-500";
                      break;
                  }
                }

                return <td key={idx} className={`p-2 border-r ${color}`}>{label}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableRecords;
