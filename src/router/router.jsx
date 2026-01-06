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
import AdminRoute from "./AdminRoute";
import BuyerRoute from "./BuyerRoute";
import WorkerRoute from "./WorkerRoute";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      // Worker Routes
      {
        path: "task-list",
        element: <WorkerRoute><Tasklist /></WorkerRoute>,
      },
      {
        path: "task-list/:id",
        element: <WorkerRoute><TaskDetails /></WorkerRoute>,
      },
      {
        path: "my-submissions",
        element: <WorkerRoute><MySubmissions /></WorkerRoute>,
      },
      {
        path: "withdrawals",
        element: <WorkerRoute><Withdrawals /></WorkerRoute>,
      },
      //Buyer Routes
      {
        path: "add-task",
        element: <BuyerRoute><AddTask /></BuyerRoute>,
      },
      {
        path: "my-tasks",
        element: <BuyerRoute><MyTask /></BuyerRoute>,
      },
      {
        path: "purchase-coin",
        element: <BuyerRoute><PurchaseCoin /></BuyerRoute>,
      },
      {
        path: "payment-history",
        element: <BuyerRoute><PaymentHistory /></BuyerRoute>,
      },
      //admin Routes
      {
        path: "manage-users",
        element: <AdminRoute><ManageUsers /></AdminRoute>,
      },
      {
        path: "manage-tasks",
        element: <AdminRoute><ManageTasks /></AdminRoute>,
      },
      //payment routes buyer
      {
        path: "payment-success",
        element: <BuyerRoute><PaymentSuccess /></BuyerRoute>,
      },
      {
        path: "payment-cancelled",
        element: <BuyerRoute><PaymentCancelled /></BuyerRoute>,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
