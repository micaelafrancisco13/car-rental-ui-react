import { Form, Formik } from "formik";
import * as Yup from "yup";
import {useAuthLogin} from "../hooks/auth/useAuthLogin";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { setJwt } from "../services/api-client";
import { jwtDecode } from "jwt-decode";
import { IUsersDetails } from "../interfaces/shared";

const Login = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken"); // Check for auth token
    if (authToken) {
        navigate("/dashboard")
    }

    const { mutate, isPending } = useAuthLogin();
    
    const schema = Yup.object().shape({
        email: Yup.string(),
        password: Yup.string(),
    });

    const saveToken = (token: string) => {
        localStorage.setItem("authToken", token);
        const decoded:IUsersDetails = jwtDecode(token)
        localStorage.setItem("role", decoded.role.toLowerCase());
        setJwt(token)
    };

    const handleSubmit = (values: {email: string, password: string}) => {
        mutate(values, {
            onSuccess: (data) => {
                saveToken(data)
                toast.success("Login Success")
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
        
        <div>
            <button
                className="text-xl text-cyan-900 uppercase font-mono font-bold absolute tracking-wider pl-5 mt-5 hover:text-cyan-700"
                onClick={()=> navigate("/")}>
                Home
            </button>
        </div>
        <div className="flex min-h-full h-screen bg-gray-100 justify-center px-6 py-12 lg:px-8">
            <div className="bg-white px-20 shadow-xl shadow-cyan-500/50 py-5">
            <div className="mx-auto">
            {/* <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="mx-auto h-10 w-auto"
            /> */}
            <h2 className="mt-10 text-center uppercase font-mono text-2xl/9 font-bold tracking-tight text-gray-900">
                Sign in to your account
            </h2>
            </div>
    
            <div className="mt-10 mx-auto sm:max-w-md">
            <Formik
                validationSchema={schema}
                initialValues={{ email: "", password: "" }}
                onSubmit={handleSubmit}
            >
            {({
            errors,
            // touched,
            handleChange,
            handleBlur,
            // handleSubmit,
            }) => (
                <>
                <Form
                    className="space-y-6"
                >
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
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-cyan-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            { isPending && (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>)}
                            Sign In 
                        </button>
                    </div>
                </Form>
                </>
            )}
            </Formik>
    
            <p className="mt-10 text-center text-sm/6 text-gray-500">
                Not yet registered?{' '}
                <button
                    onClick={() => navigate("/register")}
                className="font-semibold text-cyan-700 hover:text-cyan-700/50">
                    Register here
                </button>
            </p>
            </div>
            </div>
        </div>
        <Toaster />
        </>
    )
}

export default Login;