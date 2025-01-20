import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useGlobalStore } from '../../stores/useGlobal';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import LoadingButton from '../loaders/LoadingButton';
import useAddUser from '../../hooks/user/useAddUsers';
import useUserStore from '../../stores/useUsers';
import useVehicleStore from '../../stores/useVehicles';
import useBookCar from '../../hooks/booking/useBookCar';

const RentCarModal: React.FC = () => {
  const { isOpen, toggleModal } = useGlobalStore(); 
  const today = new Date().toISOString().split("T")[0];
  const validationSchema = Yup.object({
    vehicleId: Yup.string().required("First Name is required"),
    startDate: Yup.string()
    .required("Start Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD")
    .test("is-not-past", "Start Date cannot be in the past", (value) => {
      if (!value) return false;
      return value >= today;
    })
    .test(
      "is-before-endDate",
      "Start Date cannot be after the End Date",
      function (value) {
        const { endDate } = this.parent;
        if (!value || !endDate) return true; // Skip if either date is not provided yet
        return value <= endDate;
      }
    ),
  endDate: Yup.string()
    .required("End Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD")
    .test(
      "is-after-startDate",
      "End Date cannot be before the Start Date",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true; // Skip if either date is not provided yet
        return value >= startDate;
      }
    ),
  });

  const { mutate, isPending } = useAddUser();
  const { mutate: _rentCar, isPending: isPendingUpdate } = useBookCar();

  const { selectedVehicle } = useVehicleStore()
  const {
    addUsers,
    user: selectedUser,
  } = useUserStore()

  const initialValues = selectedUser ? 
  { 
    ...selectedUser,
  } : {
      vehicleId: '', startDate: "", endDate: ""
  }
  const calcualteTotalRate = (startDate: string, endDate: string, rate: number) => {
    if (!startDate || !endDate) {
      return 1
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return 1
    }

    const timeDifference = end.getTime() - start.getTime();
    const days = timeDifference / (1000 * 60 * 60 * 24)
    
    return (rate*days)
  };
//  const getLocation = () => {
//     if (!navigator.geolocation) {
//       return null, null;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           error: null,
//         });
//       },
//       (error) => {
//         setLocation({
//           latitude: null,
//           longitude: null,
//           error: error.message,
//         });
//       }
//     );
//   };
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white w-3/4 max-w-2xl p-6 rounded-lg shadow-lg relative">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className='text-black font-bold text-xl mb-5'>Rent a Car Form</div>
            { !!selectedVehicle && (
                <>
                <div className='text-black text-center font-bold text-md'>Selected Vehicle</div>
                    <div className="flex flex-1 flex-col p-8">
                    <img alt="" src={selectedVehicle?.images[0]} className="mx-auto size-32 shrink-0 rounded-50" />
                    <h3 className="mt-6 text-sm font-medium text-gray-900">{`${selectedVehicle?.make} ${selectedVehicle?.model} ${selectedVehicle?.year}`}</h3>
                    <dl className="mt-1 flex grow flex-col justify-between">
                    <dt className="sr-only">Description</dt>
                    <dd className="text-sm text-gray-500">{selectedVehicle?.detailedDescription}</dd>
                    <dd className="text-sm text-gray-500"><span className="font-bold">Features: </span>{selectedVehicle?.features.join(", ")}</dd>
                    <dt className="sr-only">Daily Rate</dt>
                    <dd className="mt-3">
                    <span className="font-bold text-slate-500 text-sm">Daily Rate: </span><span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        PHP {selectedVehicle?.dailyRate}
                        </span>
                    </dd>
                    </dl>
                </div>
            </>
            
            )}
            <Formik
              initialValues={initialValues} 
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const formValues = {
                  ...Object.fromEntries(
                    Object.entries(values).filter(([key]) => !["id", "createdAt", "updatedAt","password", "confirmPassword"].includes(key))
                  )
                }
                if (selectedUser) {
                //   updateMutate([{id: selectedUser.id, user: formValues}],  {
                //     onSuccess: (data) => {
                //         updateUser(data[0].id, data[0])
                //         toggleModal();
                //         toast.success("User has been successfully updated.")
                //     },
                //     onError: (error) => {
                //         const err = error as AxiosError
                //         const errMsg = err.response?.data || ""
                //         toast.error(String(errMsg))    
                //     }
                // })
                } else {
                  mutate([formValues], {
                    onSuccess: (data) => {
                        addUsers(data)
                        toggleModal();
                        toast.success("User has been successfully created.")
                    },
                    onError: (error) => {
                        const err = error as AxiosError
                        const errMsg = err.response?.data || ""
                        toast.error(String(errMsg))    
                    }
                })
                }}
                }
              
            >
              {({ values }) => (
                <Form className="h-5/6 overflow-hidden text-black">
                  <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200  w-full max-h-96 ">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <Field 
                        name="startDate">
                        {({ field }: any) => (
                            <input
                            {...field}
                            id="startDate"
                            type="date"
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        )}
                        </Field>
                      <ErrorMessage name="startDate" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      End Date
                      </label>
                      <Field 
                        name="endDate">
                        {({ field }: any) => (
                            <input
                            {...field}
                            id="endDate"
                            type="date"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        )}
                        </Field>
                      <ErrorMessage name="endDate" component="div" className="text-red-600 text-sm" />
                    </div>
                      <div>
                        
                    <span className="font-bold text-slate-500 text-sm">Total Rate: </span><span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    PHP {calcualteTotalRate(values.startDate || "", values.endDate || "", selectedVehicle?.dailyRate || 1)}
                        </span>
                      </div>
                  </div>
                  </div>
                  <LoadingButton 
                    isLoading={isPending || isPendingUpdate}
                    text={`Book`}
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default RentCarModal
