import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contract from "./pages/Contract";
import { ProtectedRoute } from "./components/ProtectedRoute";


const router = createBrowserRouter([
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/contracts/:id",
    element: (
      <ProtectedRoute>
        <Contract />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRoutes(){
    return <RouterProvider router={router} />;
}