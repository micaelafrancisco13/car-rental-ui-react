import useBookingStore from "../stores/useBookings"
import { calcualteTotalRate, formatDate } from "../utils/helper"

const ViewDetails = () => {
    const { selectedBooking } = useBookingStore()
    
    const startDate = formatDate(selectedBooking?.startDate || new Date())
    const endDate  = formatDate(selectedBooking?.endDate || new Date())
    const vehicle = selectedBooking?.vehicle

    const getStatusClasses = (status: string | undefined) => {
        switch (status) {
          case 'PAID':
          case 'COMPLETED':
            return 'bg-green-50 text-green-700 ring-green-600/20';
          case 'PENDING':
          case 'IN_PROGRESS':
            return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
          default:
            return 'bg-red-50 text-red-700 ring-red-600/20';
        }
      };

    return (
        <>
         <div className="bg-white">
          <div style={{
            maxHeight: "75vh"
          }} className="mx-auto overflow-y-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 sm:pb-5 sm:pt-5 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
         {/* Product details */}
            <div className="lg:max-w-lg lg:self-end">

              <div className="">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {`${ vehicle?.make } ${ vehicle?.model } ${ vehicle?.year } `}
                </h1>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    {`${ vehicle?.licensePlate }`}
                </h1>
              </div>

              <section aria-labelledby="information-heading" className="mt-4">
                <h2 id="information-heading" className="sr-only">
                  Product information
                </h2>

                <div className="flex items-center">
                    <span className="font-bold text-slate-500 pr-3 text-sm">Status: </span>
                    <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                        selectedBooking?.status
                    )}`}
                    > {selectedBooking?.status}
                    </span>
                    <span className="font-bold text-slate-500 pl-5 pr-3 text-sm">Payment Status: </span>
                    <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                        selectedBooking?.paymentStatus
                    )}`}
                    > 
                    {selectedBooking?.paymentStatus}
                    </span>
                </div>

                <div className="mt-3 space-y-6">
                  <p className="text-base text-gray-500">{vehicle?.briefDescription}</p>
                </div>

                {/* <div className="mt-6 flex items-center">
                  <CheckIcon aria-hidden="true" className="size-5 shrink-0 text-green-500" />
                  <p className="ml-2 text-sm text-gray-500">In stock and ready to ship</p>
                </div> */}
              </section>
            </div>

            {/* Product image */}
            <div className="mt-5 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
              <img
                alt={vehicle?.model}
                src={vehicle?.images[0]}
                className="aspect-square w-full rounded-lg object-cover"
              />
            </div>

            {/* Product form */}
            <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
              <section aria-labelledby="options-heading">
                <h2 id="options-heading" className="sr-only">
                  Booking Information
                </h2>
                  <div className="sm:flex sm:justify-between">
                    
                    <div className="mt-4 space-y-6">
                    <p className="text-base text-gray-900">
                        {startDate} - {endDate}
                    </p>
                    <p className="text-base text-gray-900">
                         <span className="font-bold text-slate-500 text-sm">Total Rate: </span><span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {calcualteTotalRate(startDate,endDate, vehicle?.dailyRate || 1)}
                        </span>
                    </p>
                    </div>
                    {/* <fieldset>
                      <legend className="block text-sm font-medium text-gray-700">Size</legend>
                      <RadioGroup
                        value={selectedSize}
                        onChange={setSelectedSize}
                        className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2"
                      >
                        {product.sizes.map((size) => (
                          <Radio
                            key={size.name}
                            as="div"
                            value={size}
                            aria-label={size.name}
                            aria-description={size.description}
                            className="group relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-indigo-500"
                          >
                            <p className="text-base font-medium text-gray-900">{size.name}</p>
                            <p className="mt-1 text-sm text-gray-500">{size.description}</p>
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
                            />
                          </Radio>
                        ))}
                      </RadioGroup>
                    </fieldset> */}
                  </div>
                 
                  <div className="mt-10">
                    <button
                      type="button"
                      onClick={()=> {}}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Track
                    </button>
                  </div>
                 
              </section>
            </div>
          </div>
        </div>
        </>
    )
}

export default ViewDetails