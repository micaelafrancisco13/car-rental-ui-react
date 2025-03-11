import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useGlobalStore } from '../../stores/useGlobal';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import LoadingButton from '../loaders/LoadingButton';
import useVehicleStore from '../../stores/useVehicles';
import useBookCar from '../../hooks/booking/useBookCar';
import { calcualteTotalRate } from '../../utils/helper';
import { jwtDecode } from 'jwt-decode';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useBookingStore from '../../stores/useBookings';
import { Calendar } from 'lucide-react';
import './style.css'
import { useGetBookings } from '../../hooks/booking/useGetBookings';
import TableLoading from '../loaders/TableLoading';

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
    paymentMode: Yup.string().required("Payment mode is required"),
    agreed: Yup.boolean()
    .oneOf([true], "You must agree to the Terms and Conditions.")
    .required("You must agree to the Terms and Conditions."),
  });

  const { mutate: rentCar, isPending: isPendingUpdate } = useBookCar();
  const {
    setMyBookings
  } = useBookingStore()
  const { selectedVehicle } = useVehicleStore()

  const { isPending } = useGetBookings(`isAll=true&&status=IN_PROGRESS&&vehicleId=${selectedVehicle?.id}`)
  const { bookings } = useBookingStore()
  const initialValues = selectedVehicle ? 
  { 
    vehicleId:selectedVehicle.id, startDate: "", endDate: "", agreed: false
  } : {
      vehicleId: '', startDate: "", endDate: ""
  }
  const getLocation = () => {
   const details = jwtDecode(localStorage.getItem("authToken") || "")
   return String(details.iat) || ""
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position: GeolocationPosition) => {
    //       return JSON.stringify({
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       });
    //     },
    //     (err: GeolocationPositionError) => {
    //       console.log(err)
    //       // setError(err.message);
    //     }
    //   );
    // } else {
    //   // setError('Geolocation is not supported by this browser.');
    // }
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
  const generateDateList = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];

    while (startDate <= endDate) {
      dates.push(startDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
      startDate.setDate(startDate.getDate() + 1); // Move to next day
    }

    return dates;
  };
  const filterBookings = bookings.map(item => generateDateList(String(item.startDate), String(item.endDate)))?.[0] || []
  const unavailableDates = filterBookings.map(date => new Date(date));

  const isDateUnavailable = (date: Date) =>
    unavailableDates.some(unavailableDate => unavailableDate.toDateString() === date.toDateString());
  const isRangeBlocked = (start: Date, end: Date) => {
    if (end <= start) return true;
    return unavailableDates.some(date => date > start && date < end);
  };

const CustomDatePicker = ({ field, form, otherFieldValue, isDisabled, placeholder }: any) => {
  const isStartDate = field.name === "startDate";
  const isEndDate = field.name === "endDate";

  const handleChange = (date: Date | null) => {
    if (date && isDateUnavailable(date)) {
      form.setFieldError(field.name, "This date is unavailable for rental.");
    } else {
      form.setFieldValue(field.name, date ? date.toLocaleDateString('en-CA') : "");

      if (isStartDate) {
        const startDate = date ? new Date(date) : null;
        const endDate = otherFieldValue ? new Date(otherFieldValue) : null;
        if (startDate && endDate && isRangeBlocked(startDate, endDate)) {
          form.setFieldValue("endDate", "");
        }
      }
    }
  };

  return (
    <div className="customDatePickerWidth">
      <DatePicker
        selected={field.value ? new Date(field.value) : null}
        onChange={handleChange}
        filterDate={(date) => {
          if (isDateUnavailable(date)) return false;
          if (isEndDate && otherFieldValue) {
            const startDate = new Date(otherFieldValue);
            return date > startDate && !isRangeBlocked(startDate, date);
          }
          return true;
        }}
        minDate={new Date()}
        disabled={isDisabled}
        placeholderText={placeholder}
        icon={<Calendar />}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md" 
        dayClassName={(date) => (isDateUnavailable(date) ? "text-gray-400 cursor-not-allowed" : "")}
        dateFormat="yyyy-MM-dd"
      />
      <ErrorMessage name={field.name} component="div" className="text-red-600 text-sm" />
    </div>
  );
};

  // const CustomDatePicker = ({ field, form,  }: any) => {
  //   const name = field.name
  //   const selectedDate = field.value ? new Date(field.value) : null;
  //   return (
  //     <DatePicker
  //       selected={selectedDate}
  //       onChange={(date) => {
  //         if (date && isDateUnavailable(date)) {
  //           form.setFieldError(name, "This date is unavailable for rental.");
  //         } else {
  //           form.setFieldValue(name, date ? date.toISOString().split("T")[0] : "");
  //         }
  //       }}
  //       filterDate={(date) => !isDateUnavailable(date)}
  //       className="mt-1 p-2 border border-gray-300 rounded-md w-full"
  //       dayClassName={(date) => (isDateUnavailable(date) ? "text-gray-400 cursor-not-allowed" : "")}
  //       dateFormat="yyyy-MM-dd"
  //     />
  //   );
  // };
  if (isPending) {
    return <TableLoading />
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white w-3/4 max-w-2xl pl-6 pr-3 py-6 rounded-lg shadow-lg relative 
                          h-5/6 sm:h-auto overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-grow max-h-[90vh]">
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
              onSubmit={async(values) => {
                const formValues = {
                  ...Object.fromEntries(
                    Object.entries(values).filter(([key]) => !["id", "createdAt", "updatedAt","password", "confirmPassword"].includes(key))
                  )
                }
                // if (selectedUser) {
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
                // } else {
                  rentCar([{...formValues, startLocation: getLocation(), endLocation: getLocation()}], {
                    onSuccess: (data) => {
                      setMyBookings(data)
                      window.location.reload()
                        toggleModal();
                        toast.success("Booking has been successfully created.")
                    },
                    onError: (error) => {
                        const err = error as AxiosError
                        const errMsg = err.response?.data || ""
                        toast.error(String(errMsg))    
                    }
                })
                }}
                // }
              
            >
              {({ values, handleBlur, handleChange }) => (
                <Form className="h-5/6 overflow-hidden text-black">
                  <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200  w-full max-h-96 pr-2">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <Field name="startDate" className="w-full" component={CustomDatePicker} otherFieldValue={values.endDate} />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                      End Date
                      </label>
                      <Field name="endDate" component={CustomDatePicker} otherFieldValue={values.startDate} />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="paymentMode" className="text-sm font-medium text-gray-700">
                        Payment Mode
                        </label>
                        <Field
                        as="select"
                        id="paymentMode"
                        name="paymentMode"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="mt-1 p-2 border border-gray-300 rounded-md text-gray-700"
                        >
                        <option value="">Select Payment Mode</option>
                        <option value="cash">Cash</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="gcash">GCash</option>
                        </Field>
                        <ErrorMessage name="paymentMode" component="div" className="text-red-600 text-sm" />
                    </div>
                    <div className='flex flex-col justify-center h-100'>
                      <div>
                      <span className="font-bold text-slate-500 text-sm">Total Rate: </span><span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      PHP {calcualteTotalRate(values.startDate || "", values.endDate || "", selectedVehicle?.dailyRate || 1)}
                      </span>
                      </div>
                    </div>
                    
                    <div className='w-full'>
                    <div className="flex items-center space-x-2">
                      <input
                          type="checkbox"
                          id="terms"
                          name="agreed"
                          checked={values.agreed}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
                        />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                          I agree to the{" "}
                          <a href="/terms" target="_blank" className="text-blue-600 underline">
                            Terms and Conditions
                          </a>
                        </label>
                    </div>
                    <ErrorMessage name={"agreed"} component="div" className="text-red-600 text-sm mt-2" />
                    </div>
                  </div>
                  </div>
                  <LoadingButton 
                    isLoading={isPendingUpdate}
                    text={`Book`}
                  />
                </Form>
              )}
            </Formik>
          </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RentCarModal
