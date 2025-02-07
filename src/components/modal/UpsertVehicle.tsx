import { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useGlobalStore } from '../../stores/useGlobal';
import useVehicleStore from '../../stores/useVehicles';
import useAddVehicle from '../../hooks/vehicle/useAddVehicle';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import LoadingButton from '../loaders/LoadingButton';
import useUpdateVehicle from '../../hooks/vehicle/useUpdateVehicle';

const VehicleFormModal: React.FC = () => {
  const { isOpen, toggleModal } = useGlobalStore(); 
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isChangeImage, setIsChangeImage] = useState<boolean>(false);
  
  const validationSchema = (existingLicensePlates: string[], current: string) => Yup.object({
    make: Yup.string().required('Make is required'),
    model: Yup.string().required('Model is required'),
    year: Yup.number().required('Year is required').min(1900, 'Year must be greater than 1900'),
    licensePlate: Yup.string().required('License plate is required').test(
      "unique-license-plate",
      "This license plate already exists",
      (value) => {
        if (!value) return false;
        return value === current || !existingLicensePlates.includes(value);
      }
    ),
    features: Yup.string().required('Features are required'),
    dailyRate: Yup.number().required('Daily rate is required').min(0, 'Rate cannot be negative'),
    briefDescription: Yup.string(),
    detailedDescription: Yup.string().required("Detailed Description is required"),
    
  });

  const { mutate, isPending } = useAddVehicle();
  const { mutate: updateVehicles, isPending: isPendingUpdate } = useUpdateVehicle();

  const updateVehicle= useVehicleStore((state) => state.updateVehicle)
  const addVehicles = useVehicleStore((state) => state.addVehicles);

  const { selectedVehicle:vehicle, vehicles } = useVehicleStore()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (file: File | undefined) => {
    // const file = e.target.files?.[0]; 
    const cloudName = "ddikg10os"

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'car_rental');  // Replace with your preset from Cloudinary
      

      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData)
      return response.data.url || ""
    }
    return
  };
  const initialValues = vehicle ? 
  { 
    ...vehicle,
    features: vehicle.features.join(", ")
  } : {
    dailyRate: 0,
    detailedDescription: "",
    features: "",
    images: [],
    image: undefined,
    licensePlate: "",
    make: "",
    model:"",
    year: "",
}
  useEffect(() => {
    setImagePreview(vehicle?.images[0] || "")
  }, [vehicle?.images])
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
            <div className='text-black font-bold text-xl mb-5'>Vehicle Form</div>
            <Formik
              initialValues={initialValues} 
              validationSchema={validationSchema(vehicles.map(item => item.licensePlate), initialValues.licensePlate)}
              onSubmit={async (values) => {
                const imageUrl = await handleImageUpload(values.image)
                const formValues = {
                  ...Object.fromEntries(
                    Object.entries(values).filter(([key]) => !["id", "createdAt", "updatedAt","availabilityStatus", "image"].includes(key))
                  ),
                  images: [imageUrl || initialValues.images[0] || ""],
                  features: values.features.split(",")
                }
                  if (vehicle) {
                    updateVehicles([{id: vehicle.id, vehicle: formValues}],  {
                      onSuccess: (data) => {
                          updateVehicle(data[0].id, data[0])
                          toggleModal();
                          toast.success("Vehicle has been successfully updated.")
                      },
                      onError: (error) => {
                          const err = error as AxiosError
                          const errMsg = err.response?.data || ""
                          toast.error(String(errMsg))    
                      }
                  })
                  } else {
                    mutate([formValues], {
                      onSuccess: (data) => {
                          addVehicles(data)
                          toggleModal();
                          toast.success("Vehicle has been successfully created.")
                      },
                      onError: (error) => {
                          const err = error as AxiosError
                          const errMsg = err.response?.data || ""
                          toast.error(String(errMsg))    
                      }
                  })
                  }
                }
                }
              
            >
              {({ setFieldValue }) => (
                <Form className="h-5/6 overflow-hidden text-black">
                  <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200  w-full max-h-96 ">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label htmlFor="make" className="text-sm font-medium text-gray-700">
                        Make
                      </label>
                      <Field
                        type="text"
                        id="make"
                        name="make" 
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="make" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="model" className="text-sm font-medium text-gray-700">
                        Model
                      </label>
                      <Field
                        type="text"
                        id="model"
                        name="model"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="model" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="year" className="text-sm font-medium text-gray-700">
                        Year
                      </label>
                      <Field
                        type="number"
                        id="year"
                        name="year"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="year" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="licensePlate" className="text-sm font-medium text-gray-700">
                        License Plate
                      </label>
                      <Field
                        type="text"
                        id="licensePlate"
                        name="licensePlate"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="licensePlate" component="div" className="text-red-600 text-sm" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="briefDescription" className="text-sm font-medium text-gray-700">
                      Brief Description
                    </label>
                    <Field
                      as="textarea"
                      id="briefDescription"
                      name="briefDescription"
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="briefDescription" component="div" className="text-red-600 text-sm" />
                  </div>
                  
                  <div className="flex flex-col">
                    <label htmlFor="detailedDescription" className="text-sm font-medium text-gray-700">
                      Detailed Description
                    </label>
                    <Field
                      as="textarea"
                      id="detailedDescription"
                      name="detailedDescription"
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="detailedDescription" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="features" className="text-sm font-medium text-gray-700">
                      Features
                    </label>
                    <Field
                      as="textarea"
                      id="features"
                      name="features"
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                    <span className='text-xs text-black-500'>Add comma between the features</span>
                    <ErrorMessage name="features" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div className="flex flex-col">
                    <button 
                      type="button"
                      className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => {
                      setIsChangeImage(!isChangeImage)
                    }}>
                      {`${ isChangeImage ? 'Cancel Upload' : 'Change Image' }`}
                    </button>
                 
                    { isChangeImage && (
                      <>
                      <label htmlFor="image" className="text-sm font-medium text-gray-700">
                        Upload Image
                      </label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setFieldValue('image', file);
                          handleImageChange(e);
                        }}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      /></> )
                    }
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded"
                        />
                      </div>
                    )}
                    <ErrorMessage name="image" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label htmlFor="dailyRate" className="text-sm font-medium text-gray-700">
                        Daily Rate
                      </label>
                      <Field
                        type="number"
                        id="dailyRate"
                        name="dailyRate"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="dailyRate" component="div" className="text-red-600 text-sm" />
                    </div>
                  </div>
                  </div>
                  <LoadingButton 
                    isLoading={isPending || isPendingUpdate}
                    text={`${vehicle ? "Update" : "Create"} Vehicle`}
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

export default VehicleFormModal
