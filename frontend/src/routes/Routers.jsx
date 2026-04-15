import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import AddExpense from "../pages/Manager/Dashboard/AddExpense";
import Dashboard from "../pages/Manager/Dashboard/Dashboard";
import Members from "../pages/Manager/Dashboard/Members";
import MonthlyReport from "../pages/Manager/Dashboard/MonthlyReport";
import NotFound from "../pages/NotFound";
import Register from "../pages/Registration/Register";
import Unauthorized from "../pages/Unauthorized";
import Balance from "../pages/User/Dashboard/Balance";
import UserDashboard from "../pages/User/Dashboard/Dashboard";
import MealEntry from "../pages/User/Dashboard/MealEntry";
import MyBill from "../pages/User/Dashboard/MyBill";
import RoleProtected from "./RoleProtected";

const Routers = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Route - Login */}
      <Route
        path="/Login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

      {/* Manager Routes */}
      <Route path="/manager" element={<DashboardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="add-expense" element={<AddExpense />} />
        <Route path="monthly-report" element={<MonthlyReport />} />
      </Route>

      {/* User Routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="meal-entry" element={<MealEntry />} />
        <Route path="my-bill" element={<MyBill />} />
        <Route path="balance" element={<Balance />} />
      </Route>

      {/* Protected Routes with Layout */}
      <Route
        element={
          <RoleProtected requiredRoles={["admin", "user"]}>
            <MainLayout />
          </RoleProtected>
        }
      >
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route
          path="/settings"
          element={
            <RoleProtected requiredRoles={["admin"]}>
              <div>Settings Page Coming Soon</div>
            </RoleProtected>
          }
        />
        <Route
          path="/profile"
          element={
            <RoleProtected requiredRoles={["admin", "user"]}>
              <div>Profile Page Coming Soon</div>
            </RoleProtected>
          }
        />
      </Route>

      {/* Error Pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />

      {/* Default redirect */}
      <Route path="/" element={<Home />} />

      {/* Catch all route - show 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
