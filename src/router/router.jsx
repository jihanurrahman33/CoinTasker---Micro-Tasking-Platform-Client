import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/auth/Register/Register";
import Login from "../pages/auth/Login/Login";
import PublicRoute from "./PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/home/DashboardHome";
import Tasklist from "../pages/dashboard/Worker/Tasklist/Tasklist";
import MySubmissions from "../pages/dashboard/Worker/MySubmissions/MySubmissions";
import Withdrawals from "../pages/dashboard/Worker/Withdrawals/Withdrawals";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "task-list",
        element: <Tasklist />,
      },

      {
        path: "my-submissions",
        element: <MySubmissions />,
      },
      {
        path: "withdrawals",
        element: <Withdrawals />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
