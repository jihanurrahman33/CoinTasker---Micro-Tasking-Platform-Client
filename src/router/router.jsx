import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/auth/Register/Register";
import Login from "../pages/auth/Login/Login";
import PublicRoute from "./PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/home/DashboardHome";
import Tasklist from "../pages/dashboard/Worker/Tasklist/Tasklist";
import TaskDetails from "../pages/dashboard/Worker/TaskDetails/TaskDetails";
import MySubmissions from "../pages/dashboard/Worker/MySubmissions/MySubmissions";
import Withdrawals from "../pages/dashboard/Worker/Withdrawals/Withdrawals";
import AddTask from "../pages/dashboard/Buyer/AddTask/AddTask";
import MyTask from "../pages/dashboard/Buyer/MyTask/MyTask";
import PurchaseCoin from "../pages/dashboard/Buyer/PurchaseCoin/PurchaseCoin";
import PaymentHistory from "../pages/dashboard/Buyer/PaymentHistory/PaymentHistory";
import ManageUsers from "../pages/dashboard/Admin/ManageUsers/ManageUsers";
import ManageTasks from "../pages/dashboard/Admin/ManageTasks/ManageTasks";
import PaymentSuccess from "../pages/dashboard/PaymentSuccess/PaymentSuccess";
import PaymentCancelled from "../pages/dashboard/PaymentSuccess/PaymentCancelled";

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
      // Worker Routes
      {
        path: "task-list",
        element: <Tasklist />,
      },
      {
        path: "task-list/:id",
        element: <TaskDetails />,
      },
      {
        path: "my-submissions",
        element: <MySubmissions />,
      },
      {
        path: "withdrawals",
        element: <Withdrawals />,
      },
      //Buyer Routes
      {
        path: "add-task",
        element: <AddTask />,
      },
      {
        path: "my-tasks",
        element: <MyTask />,
      },
      {
        path: "purchase-coin",
        element: <PurchaseCoin />,
      },
      {
        path: "payment-history",
        element: <PaymentHistory />,
      },
      //admin Routes
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
      {
        path: "manage-tasks",
        element: <ManageTasks />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
