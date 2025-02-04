import { Form, Formik } from "formik";
import * as Yup from "yup";
import {useAuthRegister} from "../hooks/auth/useAuthLogin";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import register from "../assets/images/register.jpg"
// import { setJwt } from "../services/api-client";
// import { IUsersDetails } from "../interfaces/shared";
// import { jwtDecode } from "jwt-decode";

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
                "Phone number must be exactly 9 digits",
                (value) => value?.toString().length === 10
            ).typeError("Phone number must be a valid number"),
        password: Yup.string()
            .required("Password is a required field")
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
        
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), undefined], 'Passwords must match'),
        
    });

    const handleSubmit = (values: any) => {
      const { confirmPassword, ...filteredValues } = values;
        mutate({...filteredValues, phoneNumber: `0${values.phoneNumber}`, latitude: 1, longitude: 1}, {
            onSuccess: () => {
                // saveToken(data)
                toast.success("Register Success")
                navigate("/")
            },
            onError: (error) => {
                const err = error as AxiosError
                const errMsg = err.response?.data || ""
                toast.error(String(errMsg))    
            }
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-gray-100 flex flex-col">
      {/* Background Image Carousel */}
      <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000`}
            style={{
              backgroundImage: `url('${register}')`,
              filter: "grayscale(30%)"
            }}
          />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 opacity-25" />

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-cyan-50 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-50 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        <button
        onClick={()=> navigate("/")}
        className="absolute top-6 left-6 flex items-center space-x-2 text-cyan-700 hover:text-cyan-900 transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Back to Home</span>
      </button>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        
      <div className="bg-white/80 backdrop-blur-lg w-full max-w-2xl rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
            <div className="mx-auto">

            {/* <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="mx-auto h-10 w-auto"
            /> */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
                <p className="text-gray-600">Create an account to continue</p>
            </div>
            </div>
    
            <div className="mt-5">
            <Formik
                validationSchema={schema}
                initialValues={{ firstName: "", lastName: "", email: "",phoneNumber:"", password:"", confirmPassword:"", role: "BOOKER" }}
                onSubmit={handleSubmit}
            >
            {({
            errors,
            // // touched,
            handleChange,
            handleBlur,
            // handleSubmit,
            }) => (
                <>
                
                <Form className="space-y-6">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-900">
                            First Name
                        </label>
                        <div className="mt-2">
                            <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                        </div>
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                    </div>

                    <div>
                    <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-900">
                            Last Name
                        </label>
                        <div className="mt-2">
                            <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                        </div>
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                    </div>
                    <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
        
                    <div>
                    <label htmlFor="phoneNumber" className="block text-sm/6 font-medium text-gray-900">
                            Phone Number
                        </label>
                        <div className="mt-2 relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                +63
                            </span>

                            <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="number"
                            required
                            className="block w-full pl-11 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                        </div>
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                        )}
                    </div>
                    <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                        Password
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                        />
                    </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>
                    
                    <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                        Confirm Password
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                        />
                    </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>
                    
                  </div>
                  <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-cyan-600/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            { isPending && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>)}
                            Register
                        </button>
                    </div>

                </Form>
                </>
            )}
            </Formik>
    
            <p className="mt-3 text-center text-sm/6 text-gray-500">
                Already have an account?{' '}
                <button onClick={() => navigate("/login")} className="font-semibold text-cyan-600 hover:text-cyan-600/50">
                    Login here
                </button>
            </p>
            </div>
        </div>
        </div>
        <Toaster />
        </div>
    )
}

export default Register;