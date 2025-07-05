import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contract from "./pages/Contract";

const router = createBrowserRouter([
    { path: "/signup", element: <Signup />},
    { path: "/login", element: <Login />},
    { path: "/", element: <Dashboard />},
    { path: "/contracts/:id", element: <Contract />},
    { path: "*", element: <Navigate to="/" replace />},
]);

export function AppRoutes(){
    return <RouterProvider router={router} />;
}