import ReactApexChart from "react-apexcharts";
import useDashboardStore from "../stores/useDashboard";
import { useGetDashboard } from "../hooks/booking/useGetBookings";
import TableLoading from "./loaders/TableLoading";

const AdminDashboard= () => {
	const { isFetching } = useGetDashboard()
    
    const { vehicleCount, bookingsCount, bookingsPaymentCount, formattedData } = useDashboardStore()
    console.log({formattedData})
  return (
    <div className="p-3 min-h-screen ">
      <h1 className="text-2xl text-gray-900 font-bold mb-4">Car Rental Dashboard</h1>
      {
        isFetching && <TableLoading /> 
      }
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">
        <div className="bg-green-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Total Income</h2>
          <ReactApexChart options={{
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: 'Total Incone by Month',
                align: 'left'
            },
            grid: {
                row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
                },
            },
            xaxis: {
                categories: formattedData.map((data:any) => data.date),
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            }
          }} series={formattedData.map((data: any) => Number(data?.totalIncome || "0"))} type="bar" height={350} />
        </div>

        {/* Payment Status */}
        <div className="bg-indgo-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 shadow-md p-4 rounded-lg text-gray-900">
          <h2 className="text-lg font-semibold mb-2 ">Payment Status</h2>
          <ReactApexChart
           type="pie" width={380}
            series={[
                bookingsPaymentCount?.PENDING || 0,
                bookingsPaymentCount?.PAID || 0,
                bookingsPaymentCount?.FAILED || 0,
            ]}
            options={{
                chart: {
                    width: 380,
                    type: 'pie',
                  },
              labels:["PENDING", "PAID", "FAILED"],
              colors: ["orange", "lightgreen", "red"],
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">

      {/* Booking Metrics */}
      <div className="bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 p-4 rounded-lg mt-6 text-gray-900">
        <h2 className="text-lg font-semibold mb-2">Booking Status</h2>
        <ReactApexChart
           type="pie" width={380}
           series={[
                bookingsCount?.ACTIVE || 0,
                bookingsCount?.COMPLETED || 0,
                bookingsCount?.PENDING || 0,
                bookingsCount?.CANCELLED || 0,
                bookingsCount?.IN_PROGRESS || 0,
            ]}
            options={{
                chart: {
                    width: 380,
                    type: 'pie',
                  },
              labels:["ACTIVE", "COMPLETED", "PENDING", "CANCELLED", "IN PROGRESS"],
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            }}
          />
      </div>

      {/* Fleet Metrics */}
      <div className="bg-yellow-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-gray-100 p-4 rounded-lg mt-6 text-gray-900">
        <h2 className="text-lg font-semibold mb-2">Fleet Status</h2>
        <ReactApexChart
           type="pie" width={380}
            series={[
                vehicleCount?.AVAILABLE || 0,
                vehicleCount?.BOOKED || 0,
                vehicleCount?.MAINTENANCE || 0,
            ]}
            options={{
                chart: {
                    width: 380,
                    type: 'pie',
                  },
              labels:["AVAILABLE", "BOOKED", "MAINTENANCE", ],
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            }}
          />
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
