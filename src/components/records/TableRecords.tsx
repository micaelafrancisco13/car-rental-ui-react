import { useState } from "react";
import { formatMoney } from "../../utils/helper";
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";

const TableRecords = ({ data, columns, keys }: { data: any[]; columns: string[]; keys: string[] }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" | null }>({
    key: null,
    direction: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of rows per page

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort data
  const filteredData = data.filter((item) =>
    keys.some((key) => item[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedData = [...filteredData].sort((a, b) => {
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

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="overflow-x-auto p-4">
      {/* Search Input */}
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded-md w-1/3"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      {/* Table */}
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
          {paginatedData.map((item, index) => (
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            className="p-2 border rounded-md disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            className="p-2 border rounded-md disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </button>
          <button
            className="p-2 border rounded-md disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
          <button
            className="p-2 border rounded-md disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableRecords;
