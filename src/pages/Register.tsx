import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {useAuthRegister} from "../hooks/auth/useAuthLogin";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { setJwt } from "../services/api-client";
import LoadingButton from "../components/loaders/LoadingButton";

const Register = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken"); // Check for auth token
    if (authToken) {
        navigate("/dashboard")
    }

    const { mutate, isPending } = useAuthRegister();
    
    const schema = Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        email: Yup.string().required("Email is required").email("Invalid email"),
        phoneNumber: Yup.number().test(
                "len",
                "Phone number must be exactly 10 digits",
                (value) => value?.toString().length === 10
            ).typeError("Phone number must be a valid number"),
        role: Yup.string().required("Role is required"),
        password: Yup.string()
            .required("Password is a required field")
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
        
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), undefined], 'Passwords must match'),
        
    });

    const saveToken = (token: string) => {
        localStorage.setItem("authToken", token);
        setJwt(token)
    };

    const handleSubmit = (values: {email: string, password: string}) => {
        mutate(values, {
            onSuccess: (data) => {
                saveToken(data)
                toast.success("Register Success")
                navigate("/dashboard")
            },
            onError: (error) => {
                const err = error as AxiosError
                const errMsg = err.response?.data || ""
                toast.error(String(errMsg))    
            }
        })
    }

    return (
        <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="mx-auto h-10 w-auto"
            /> */}
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Create an account
            </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
            <Formik
                validationSchema={schema}
                initialValues={{ email: "", password: "" }}
                onSubmit={handleSubmit}
            >
            {({
            // errors,
            // // touched,
            // handleChange,
            // handleBlur,
            // handleSubmit,
            }) => (
                <>
                
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
                    
                    <div className="flex flex-col">
                      <label htmlFor="passowrd" className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Field
                        type="passowrd"
                        id="passowrd"
                        name="passowrd"
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="passowrd" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div className="flex flex-col">
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
                    </div>
                  </div>
                  </div>
                  <LoadingButton 
                    isLoading={isPending}
                    text={`Create an account`}
                  />
                </Form>
                </>
            )}
            </Formik>
    
            <p className="mt-10 text-center text-sm/6 text-gray-500">
                Already have an account?{' '}
                <button onClick={() => navigate("/")} className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Login here
                </button>
            </p>
            </div>
        </div>
        <Toaster />
        </>
    )
}

export default Register;