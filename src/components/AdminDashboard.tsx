import ReactApexChart from "react-apexcharts";
import useDashboardStore from "../stores/useDashboard";
import { useGetDashboard } from "../hooks/booking/useGetBookings";
import TableLoading from "./loaders/TableLoading";
import { Car, CreditCard, Calendar, TrendingUp } from "lucide-react";

const AdminDashboard= () => {
	const { isFetching } = useGetDashboard()
    
    const { vehicleCount, bookingsCount, bookingsPaymentCount, result } = useDashboardStore()

    const stats = [
      {
        title: "Total Vehicles",
        value: (vehicleCount?.AVAILABLE || 0) + (vehicleCount?.BOOKED || 0) + (vehicleCount?.MAINTENANCE || 0),
        icon: <Car className="h-8 w-8" />
      },
      {
        title: "Total Bookings",
        value: (bookingsCount?.ACCEPTED || 0) + (bookingsCount?.COMPLETED || 0) + (bookingsCount?.PENDING || 0) + 
               (bookingsCount?.CANCELLED || 0) + (bookingsCount?.IN_PROGRESS || 0),
        icon: <Calendar className="h-8 w-8" />
      },
      {
        title: "Total Payments",
        value: (bookingsPaymentCount?.PAID || 0) + (bookingsPaymentCount?.PENDING || 0) + (bookingsPaymentCount?.FAILED || 0),
        icon: <CreditCard className="h-8 w-8" />
      },
      {
        title: "Revenue",
        value: `₱${result.reduce((acc: number, curr: { totalPrice: any; }) => acc + parseFloat(curr?.totalPrice || "0"), 0).toLocaleString()}`,
        icon: <TrendingUp className="h-8 w-8" />
      }
    ];
    return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen text-cyan-800 uppercase">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Car Rental Dashboard</h1>
      </div>
      {
        isFetching && <TableLoading /> 
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="p-3">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <h3 className="text-xl font-bold">{stat.value}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Revenue Overview</h2>
          </div>
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
                text: 'Total Income by Month',
                align: 'left'
            },
            grid: {
                row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
                },
            },
            xaxis: {
                categories: result.map((data:any) => data.formattedEndDate),
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            }
          }} 
          // series={result.map((data: any) => data?.totalPrice || "0")} 
          series={[
            {
              name: 'Total Income', // Legend label for the series
              data: result.map((data: any) => parseFloat(data?.totalPrice || "0")), // Ensure values are numbers
            },
          ]}
          type="bar" height={350} />
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Payment Status</h2>
          </div>
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
              labels:["With Balance", "PAID", "FAILED"],
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Booking Status</h2>
          </div>
        <ReactApexChart
           type="pie" width={380}
           series={[
                // bookingsCount?.ACCEPTED || 0,
                bookingsCount?.COMPLETED || 0,
                // bookingsCount?.PENDING || 0,
                bookingsCount?.CANCELLED || 0,
                bookingsCount?.IN_PROGRESS || 0,
            ]}
            options={{
                chart: {
                    width: 380,
                    type: 'pie',
                  },
              labels:[ "COMPLETED", "CANCELLED", "RESERVED"],
              colors: ["lightgreen", "red", "blue"],
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Vehicle Status</h2>
          </div>
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
