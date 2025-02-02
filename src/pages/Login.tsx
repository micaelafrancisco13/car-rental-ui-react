import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { setJwt } from '../services/api-client';
import { IUsersDetails } from '../interfaces/shared';
import { Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuthLogin } from '../hooks/auth/useAuthLogin';
import { useNavigate } from 'react-router-dom';

const Login = () => {
const navigate = useNavigate()
  // Handle navigation without react-router
  const handleHomeClick = () => {
    navigate("/")
  };

  const handleRegisterClick = () => {
    navigate("/register")
  };

  const { mutate, isPending } = useAuthLogin();

  const schema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const saveToken = (token: string) => {
    localStorage.setItem("authToken", token);
    const decoded: IUsersDetails = jwtDecode(token);
    localStorage.setItem("role", decoded.role.toLowerCase());
    setJwt(token);
  };

  const handleSubmit = (values: { email: string; password: string }) => {
    mutate(values, {
      onSuccess: (data) => {
        saveToken(data);
        toast.success("Login Success");
        // Implement your navigation logic here
        console.log('Navigate to dashboard');
      },
      onError: (error) => {
        const err = error as AxiosError;
        const errMsg = err.response?.data || "";
        toast.error(String(errMsg));
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-gray-100 flex flex-col">
      {/* Header */}
      <button
        onClick={handleHomeClick}
        className="absolute top-6 left-6 flex items-center space-x-2 text-cyan-700 hover:text-cyan-900 transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Back to Home</span>
      </button>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white/80 backdrop-blur-lg w-full max-w-md rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <Formik
            validationSchema={schema}
            initialValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
          >
            {({ errors, handleChange, handleBlur }) => (
              <Form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 px-3 py-2 border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 px-3 py-2 border ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-2 px-4 rounded-lg
                    font-medium hover:from-cyan-600 hover:to-cyan-700 focus:outline-none focus:ring-2 
                    focus:ring-cyan-500 focus:ring-offset-2 transform transition-all duration-300 
                    hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account?{' '}
                  <button
                    onClick={handleRegisterClick}
                    className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-300"
                  >
                    Register here
                  </button>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default Login;