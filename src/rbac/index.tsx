import { createBrowserRouter, Navigate } from "react-router-dom";
import Test from "../pages/Test";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Vehicles from "../pages/Vehicles";
import Rentals from "../pages/Rentals";

const userRole = "admin";

const ProtectedRoute = ({ element, allowedRoles }: { element: JSX.Element; allowedRoles: string[] }) => {
  return allowedRoles.includes(userRole) ? element : <Navigate to="/" />;
};

const RBAC: any[] = [
  {
    path: "/dashboard",
    element: <ProtectedRoute element={<Dashboard />} allowedRoles={["admin", "emplooyee", "customer"]} />,
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
    path: "/rentals",
    element: <ProtectedRoute element={<Rentals />} allowedRoles={["admin","customer"]} />,
  },
  {
    path:"/track/:id",
    element: <ProtectedRoute element={<Test />} allowedRoles={["admin", "employee"]} />,
  },
  {
    path: "/",
    element: <Login />,
  }
];

// Create the router
const routerRBAC = createBrowserRouter(RBAC);

export default routerRBAC;