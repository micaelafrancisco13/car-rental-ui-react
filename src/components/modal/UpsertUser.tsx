import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useGlobalStore } from '../../stores/useGlobal';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import LoadingButton from '../loaders/LoadingButton';
import { useAddUser } from '../../hooks/user/useAddUsers';
import useUpdateUser from '../../hooks/user/useUpdateUser';
import useUserStore from '../../stores/useUsers';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const UserFormModal: React.FC = () => {
  const { isOpen, toggleModal } = useGlobalStore(); 
  const mutationPut = useUpdateUser();

  const generalSchema = {
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string().required("Email is required").email("Invalid email"),
      phoneNumber: Yup.number().test(
            "len",
            "Phone number must be exactly 10 digits",
            (value) => value?.toString().length === 10
        ).typeError("Phone number must be a valid number"),
      role: Yup.string().required("Role is required"),
  }
  const validationSchema = Yup.object({
    ...generalSchema,
    password: Yup.string()
      .required("Password is a required field")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match'),
  });

  const validationUpdateSchema = Yup.object({
    ...generalSchema,
  });

  const { mutate, isPending } = useAddUser();
  const { isPending: isPendingUpdate } = useUpdateUser();

  const {
    updateUser,
    addUsers,
    setUser,
    user: selectedUser,
  } = useUserStore()

  const initialValues = selectedUser ? 
  { 
    ...selectedUser,
  } : {
      firstName: "", lastName: "", email: "", phoneNumber: "", role: "BOOKER", password: "", confirmPassword:""
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white w-3/4 max-w-2xl p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => { 
                toggleModal()
                setUser(null)
              }}
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
            <div className='text-black font-bold text-xl mb-5'>User Form</div>
            <Formik
              initialValues={initialValues} 
              validationSchema={selectedUser ? validationUpdateSchema : validationSchema }
              onSubmit={async (values) => {
                const formValues = {
                  ...Object.fromEntries(
                    Object.entries(values).filter(([key]) => !["id", "createdAt", "updatedAt", "confirmPassword"].includes(key))
                  )
                }
                if (selectedUser) {
                  const updatedUser = await mutationPut.mutateAsync({
                    id: selectedUser.id,
                    data: formValues,
                  });
                  updateUser(updatedUser.id, updatedUser)
                  setUser(null)
                  toast.success("User has been successfully updated.")

                  toggleModal()
                //   updateMutate([{id: selectedUser.id, user: formValues}],  {
                //     onSuccess: (data) => {
                //         updateUser(data[0].id, data[0])
                //         toggleModal();
                //         setUser(null)

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
                        setUser(null)

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
              {({  }) => (
                <Form className="h-5/6 overflow-hidden text-black">
                  <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200  w-full max-h-96 ">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <Field
                        type="text"
                        id="firstName"
                        name="firstName" 
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <Field
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <Field
                        type="number"
                        id="phoneNumber"
                        name="phoneNumber"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="phoneNumber" component="div" className="text-red-600 text-sm" />
                    </div>
                    
                    { !selectedUser?.id && (<div className="flex flex-col">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Field
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                    </div>)}

                    { !selectedUser?.id && (<div className="flex flex-col">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <Field
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
                    </div>)}
                  </div>
                  <div className="text-sm text-gray-900 grid grid-cols-1">
                          <select
                              id="location"
                              name="location"
                              defaultValue={selectedUser?.role || "BOOKER"}
                              className={`col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pl-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                              >
                              <option value={"ADMIN"} >Admin</option>
                              <option value={"EMPLOYEE"} >Employee</option>
                              <option value={"BOOKER"}  >Booker</option>
                          </select>
                          <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          />
                      </div>
                  </div>
                  <LoadingButton 
                    isLoading={isPending || isPendingUpdate}
                    text={`${selectedUser ? "Update" : "Create"} User`}
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

export default UserFormModal
