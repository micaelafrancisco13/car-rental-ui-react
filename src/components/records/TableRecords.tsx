import { formatMoney } from "../../utils/helper";

const TableRecords = ({ data, columns, keys }: { data: any[]; columns: string[]; keys: string[] }) => {
  console.log({data})
    return (
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="p-2 text-left border-b">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                {keys.map((key, idx) => {
                  let label = item[key]
                  if (key === "revenue"){
                    label = formatMoney(item[key])
                  }
                  let color = ''
                  if (key=="status") {
                    switch(item[key]){
                      case "AVAILABLE":
                      case "COMPLETED":
                        color = 'text-green-500'; 
                        break;
                      case "BOOKED":
                        color = 'text-red-500'; 
                        break;
                      case "MAINTENANCE":
                      case "IN_PROGRESS":
                        color = 'text-orange-500'; 
                        break;
                    }
                  }

                  return (<td key={idx} className={`p-2 border-r ${color}`}>{label}</td>)
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

export default TableRecords;