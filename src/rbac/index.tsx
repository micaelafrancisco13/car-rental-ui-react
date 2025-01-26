import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Vehicles from "../pages/Vehicles";
import Rentals from "../pages/Rentals";
import Register from "../pages/Register";
import CarTracker from "../pages/Track";
import HomePage from "../pages/Homepage";
import ProfilePage from "../pages/Profile";

const ProtectedRoute = ({ element, allowedRoles }: { element: JSX.Element; allowedRoles: string[] }) => {
  const authToken = localStorage.getItem("authToken"); // Check for auth token
  const userRole = localStorage.getItem("role") || "";
  if (!authToken) {
    return <Navigate to="/" />;
  }
  return allowedRoles.includes(userRole) ? element : <Navigate to="/" />;
};

const RBAC: any[] = [
  {
    path: "/dashboard",
    element: <ProtectedRoute element={<Dashboard />} allowedRoles={["admin", "emplooyee", "booker"]} />,
  },
  {
    path: "/users",
    element: <ProtectedRoute element={<Users />} allowedRoles={["admin"]} />,
  },
  {
    path: "/vehicles",
    element: <ProtectedRoute element={<Vehicles />} allowedRoles={["admin", "emoloyee"]} />,
  },
  {
    path: "/vehicles/available",
    element: <ProtectedRoute element={<Vehicles />} allowedRoles={["booker"]} />,
  },
  {
    path: "/rentals",
    element: <ProtectedRoute element={<Rentals />} allowedRoles={["admin","booker"]} />,
  },
  {
    path:"/track",
    element: <ProtectedRoute element={<CarTracker />} allowedRoles={["admin", "employee"]} />,
  },
  {
    path:"/profile",
    element: <ProtectedRoute element={<ProfilePage />} allowedRoles={["booker","admin", "employee"]} />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  }
];

// Create the router
const routerRBAC = createBrowserRouter(RBAC);

export default routerRBAC;