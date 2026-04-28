import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import DashboardLayout from "../layouts/DashboardLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import AddExpense from "../pages/Manager/Dashboard/AddExpense";
import Dashboard from "../pages/Manager/Dashboard/Dashboard";
import Members from "../pages/Manager/Dashboard/Members";
import MonthlyReport from "../pages/Manager/Dashboard/MonthlyReport";
import NotFound from "../pages/NotFound";
import Register from "../pages/Registration/Register";
import SuperAdminDashboard from "../pages/SuperAdmin/Dashboard/Dashboard";
import ManagerDetails from "../pages/SuperAdmin/Dashboard/Manager";
import MessGroup from "../pages/SuperAdmin/Dashboard/MessGroup";
import SystemReport from "../pages/SuperAdmin/Dashboard/SystemReport";
import Unauthorized from "../pages/Unauthorized";
import Balance from "../pages/User/Dashboard/Balance";
import UserDashboard from "../pages/User/Dashboard/Dashboard";
import MealEntry from "../pages/User/Dashboard/MealEntry";
import MyBill from "../pages/User/Dashboard/MyBill";
import { getRoleHomePath } from "../utils/roleBasedNavigation";
import RoleProtected from "./RoleProtected";

const Routers = () => {
  const { isAuthenticated, user } = useAuth();
  const authHomePath = user ? getRoleHomePath(user.role) : "/login";

  return (
    <Routes>
      {/* Public Route - Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to={authHomePath} replace /> : <Login />
        }
      />
      <Route path="/Login" element={<Navigate to="/login" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

      {/* Super Admin Routes */}
      <Route
        path="/super-admin"
        element={
          <RoleProtected requiredRoles={["superAdmin"]}>
            <SuperAdminLayout />
          </RoleProtected>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="mess-group" element={<MessGroup />} />
        <Route path="manager" element={<ManagerDetails />} />
        <Route path="system-report" element={<SystemReport />} />
      </Route>

      {/* Manager Routes */}
      <Route
        path="/manager"
        element={
          <RoleProtected requiredRoles={["manager"]}>
            <DashboardLayout />
          </RoleProtected>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="add-expense" element={<AddExpense />} />
        <Route path="monthly-report" element={<MonthlyReport />} />
      </Route>

      {/* User Routes */}
      <Route
        path="/user"
        element={
          <RoleProtected requiredRoles={["user"]}>
            <UserLayout />
          </RoleProtected>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="meal-entry" element={<MealEntry />} />
        <Route path="my-bill" element={<MyBill />} />
        <Route path="balance" element={<Balance />} />
      </Route>

      {/* Error Pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />

      {/* Default redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to={authHomePath} replace /> : <Home />
        }
      />

      {/* Catch all route - show 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
