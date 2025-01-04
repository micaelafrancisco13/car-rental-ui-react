import { createBrowserRouter, Navigate } from "react-router-dom";
import Test from "../pages/Test";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

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
    path: "/user",
    element: <ProtectedRoute element={<Test />} allowedRoles={["admin"]} />,
  },
  {
    path: "/vehicle",
    element: <ProtectedRoute element={<Test />} allowedRoles={["admin", "emoloyee"]} />,
  },
  {
    path: "/rental",
    element: <ProtectedRoute element={<Test />} allowedRoles={["customer"]} />,
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