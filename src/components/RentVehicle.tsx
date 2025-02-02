import { formatMoney } from "../utils/helper"
import { useGlobalStore } from "../stores/useGlobal"
import useVehicleStore from "../stores/useVehicles"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"


const RentVehicle = () => {
    const { toggleModal } = useGlobalStore()
    const {
        paginatedVehicles,
        setVehicle,
    } = useVehicleStore();
    return (
        <>
        <div className="">
        <div style={{height: "65vh"}}>
            <ul role="list" className="px-3 py-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-x-hidden overflow-y-auto h-full">
                {
                paginatedVehicles.map((vehicle) => (
                    <li
                    key={vehicle.id}
                    className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-md "
                    >
                    <div className="flex flex-1 flex-col p-5">
                        <img alt="" src={vehicle.images[0]} className="mx-auto size-24 shrink-0 rounded-50" />
                        <h3 className="mt-6 text-sm font-medium text-gray-900">{`${vehicle.make} ${vehicle.model} ${vehicle.year}`}</h3>
                        <dl className="mt-1 flex grow flex-col justify-between">
                        <dt className="sr-only">Description</dt>
                        <dd className="text-sm text-gray-500">{vehicle.briefDescription}</dd>
                        <dt className="sr-only">Rate</dt>
                        <dd className="mt-3">
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            { formatMoney(vehicle.dailyRate) }
                            </span>
                        </dd>
                        </dl>
                    </div>
                    <div>
                        <div className="-mt-px flex divide-x divide-gray-200">
                            <div className="flex w-0 flex-1">
                                <button
                                onClick={() => {
                                    setVehicle(vehicle)
                                    toggleModal()
                                }}
                                className="relative bg-cyan-500 -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                >
                                <PaperAirplaneIcon aria-hidden="true" className="size-5 text-gray-400" />
                                    Rent
                                </button>
                            </div>
                        </div>
                    </div>
                    </li>
                ))
            }
            </ul>
        </div>
    </div>
        </>
    )
}

export default RentVehicle;