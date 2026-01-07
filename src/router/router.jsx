import { createBrowserRouter } from "react-router";
import React, { Suspense, lazy } from "react";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import BuyerRoute from "./BuyerRoute";
import WorkerRoute from "./WorkerRoute";
import Loading from "../components/shared/Loading/Loading";

// Lazy load pages
const Home = lazy(() => import("../pages/Home/Home"));
const Register = lazy(() => import("../pages/auth/Register/Register"));
const Login = lazy(() => import("../pages/auth/Login/Login"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Dashboard - Home
const DashboardHome = lazy(() => import("../pages/dashboard/home/DashboardHome"));

// Dashboard - Worker
const Tasklist = lazy(() => import("../pages/dashboard/Worker/Tasklist/Tasklist"));
const TaskDetails = lazy(() => import("../pages/dashboard/Worker/TaskDetails/TaskDetails"));
const MySubmissions = lazy(() => import("../pages/dashboard/Worker/MySubmissions/MySubmissions"));
const Withdrawals = lazy(() => import("../pages/dashboard/Worker/Withdrawals/Withdrawals"));

// Dashboard - Buyer
const AddTask = lazy(() => import("../pages/dashboard/Buyer/AddTask/AddTask"));
const MyTask = lazy(() => import("../pages/dashboard/Buyer/MyTask/MyTask"));
const PurchaseCoin = lazy(() => import("../pages/dashboard/Buyer/PurchaseCoin/PurchaseCoin"));
const PaymentHistory = lazy(() => import("../pages/dashboard/Buyer/PaymentHistory/PaymentHistory"));
const PaymentSuccess = lazy(() => import("../pages/dashboard/PaymentSuccess/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("../pages/dashboard/PaymentSuccess/PaymentCancelled"));

// Dashboard - Admin
const ManageUsers = lazy(() => import("../pages/dashboard/Admin/ManageUsers/ManageUsers"));
const ManageTasks = lazy(() => import("../pages/dashboard/Admin/ManageTasks/ManageTasks"));

const SuspenseLayout = ({ children }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseLayout>
            <Home />
          </SuspenseLayout>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <SuspenseLayout>
              <Register />
            </SuspenseLayout>
          </PublicRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <SuspenseLayout>
              <Login />
            </SuspenseLayout>
          </PublicRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseLayout>
            <DashboardHome />
          </SuspenseLayout>
        ),
      },
      // Worker Routes
      {
        path: "task-list",
        element: (
          <WorkerRoute>
            <SuspenseLayout>
              <Tasklist />
            </SuspenseLayout>
          </WorkerRoute>
        ),
      },
      {
        path: "task-list/:id",
        element: (
          <WorkerRoute>
            <SuspenseLayout>
              <TaskDetails />
            </SuspenseLayout>
          </WorkerRoute>
        ),
      },
      {
        path: "my-submissions",
        element: (
          <WorkerRoute>
            <SuspenseLayout>
              <MySubmissions />
            </SuspenseLayout>
          </WorkerRoute>
        ),
      },
      {
        path: "withdrawals",
        element: (
          <WorkerRoute>
            <SuspenseLayout>
              <Withdrawals />
            </SuspenseLayout>
          </WorkerRoute>
        ),
      },
      //Buyer Routes
      {
        path: "add-task",
        element: (
          <BuyerRoute>
            <SuspenseLayout>
              <AddTask />
            </SuspenseLayout>
          </BuyerRoute>
        ),
      },
      {
        path: "my-tasks",
        element: (
          <BuyerRoute>
            <SuspenseLayout>
              <MyTask />
            </SuspenseLayout>
          </BuyerRoute>
        ),
      },
      {
        path: "purchase-coin",
        element: (
          <BuyerRoute>
            <SuspenseLayout>
              <PurchaseCoin />
            </SuspenseLayout>
          </BuyerRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <BuyerRoute>
            <SuspenseLayout>
              <PaymentHistory />
            </SuspenseLayout>
          </BuyerRoute>
        ),
      },
      //admin Routes
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <SuspenseLayout>
              <ManageUsers />
            </SuspenseLayout>
          </AdminRoute>
        ),
      },
      {
        path: "manage-tasks",
        element: (
          <AdminRoute>
            <SuspenseLayout>
              <ManageTasks />
            </SuspenseLayout>
          </AdminRoute>
        ),
      },
      //payment routes buyer
      {
        path: "payment-success",
        element: (
          <BuyerRoute>
            <SuspenseLayout>
              <PaymentSuccess />
            </SuspenseLayout>
          </BuyerRoute>
        ),
      },
      {
        path: "payment-cancelled",
        element: (
          <BuyerRoute>
            <SuspenseLayout>
              <PaymentCancelled />
            </SuspenseLayout>
          </BuyerRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <SuspenseLayout>
        <NotFound />
      </SuspenseLayout>
    ),
  },
]);
