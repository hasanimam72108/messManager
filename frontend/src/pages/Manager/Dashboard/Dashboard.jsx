import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  updateAuthenticatedUser,
  useCompleteFirstLoginPasswordSetupMutation,
} from "../../../features/auth/authSlice";
import { useGetManagerDashboardStatsQuery } from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);

const DEFAULT_DASHBOARD_STATS = {
  monthKey: getCurrentMonthKey(),
  memberCount: 0,
  totalMealsAllMembers: 0,
  costPerMeal: 0,
  mealCostTotal: 0,
  fixedBreakdown: {
    rent: 0,
    khala: 0,
    utilities: 0,
    wifi: 0,
  },
  fixedTotal: 0,
  fixedCostPerPerson: 0,
  totalExpenses: 0,
  recentActivity: [],
  breakdownRows: [],
};

const Dashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [completeFirstLoginPasswordSetup, { isLoading }] =
    useCompleteFirstLoginPasswordSetupMutation();
  const managerUserId = user?.id;
  const currentMonthKey = getCurrentMonthKey();

  const hasDeletedMess = !user?.messId;

  const { data: dashboardStatsResponse } = useGetManagerDashboardStatsQuery(
    { monthKey: currentMonthKey },
    { skip: !managerUserId || hasDeletedMess },
  );

  const dashboardStats =
    dashboardStatsResponse?.data ?? DEFAULT_DASHBOARD_STATS;
  const recentActivity = dashboardStats.recentActivity ?? [];

  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSetupPassword = async (event) => {
    event.preventDefault();
    if (!user?.id) return;

    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await completeFirstLoginPasswordSetup({
        newPassword: passwordForm.password,
      }).unwrap();
      dispatch(updateAuthenticatedUser(response.user));
      setPasswordForm({ password: "", confirmPassword: "" });
      setIsNewPasswordVisible(false);
      setIsConfirmPasswordVisible(false);
      toast.success("Password updated successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Password setup failed.");
    }
  };

  const formatCurrency = (value) => `৳${Number(value || 0).toFixed(2)}`;

  if (hasDeletedMess) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-rose-100 bg-white/90 p-8 shadow-sm backdrop-blur">
        <h2 className="mb-3 text-3xl font-bold text-rose-700">
          Manager Dashboard
        </h2>
        <p className="text-base text-slate-700">
          Your mess is deleted by admin.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Please contact the super admin if you think this was a mistake.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-start gap-4 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-6">
        <div className="rounded-2xl bg-sky-100 p-3 text-sky-600 shadow-sm">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Manager Dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage your mess and track all activities
          </p>
        </div>
      </div>

      {user?.mustChangePassword && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-xl font-semibold text-amber-900">
            Set Your New Password
          </h3>
          <p className="text-sm text-amber-700 mt-1 mb-4">
            This is your first login. Please set a new password to continue.
          </p>
          <form
            onSubmit={handleSetupPassword}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <div className="relative">
              <input
                type={isNewPasswordVisible ? "text" : "password"}
                name="password"
                value={passwordForm.password}
                onChange={handlePasswordChange}
                placeholder="New password"
                className="bg-white border border-amber-200 rounded-lg px-3 py-2 pr-10 text-sm w-full"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setIsNewPasswordVisible((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900 focus:outline-none"
                aria-label={
                  isNewPasswordVisible ? "Hide password" : "Show password"
                }
                title={isNewPasswordVisible ? "Hide password" : "Show password"}
              >
                {isNewPasswordVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm password"
                className="bg-white border border-amber-200 rounded-lg px-3 py-2 pr-10 text-sm w-full"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900 focus:outline-none"
                aria-label={
                  isConfirmPasswordVisible ? "Hide password" : "Show password"
                }
                title={
                  isConfirmPasswordVisible ? "Hide password" : "Show password"
                }
              >
                {isConfirmPasswordVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white rounded-lg px-4 py-2 text-sm font-medium"
            >
              {isLoading ? "Saving..." : "Save Password"}
            </button>
          </form>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm text-slate-500">
              Total
              <br />
              Members
            </p>
            <div className="rounded-lg bg-sky-100 p-2 text-sky-500">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="mb-1 text-4xl font-bold text-slate-900">
            {dashboardStats.memberCount}
          </h3>
          <p className="text-xs text-slate-400">active members</p>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm text-slate-500">Total Meals Expenses</p>
            <div className="rounded-lg bg-rose-100 px-3 py-1 text-lg font-bold text-rose-500">
              ৳
            </div>
          </div>
          <h3 className="mb-1 text-4xl font-bold text-slate-900">
            ৳{dashboardStats.mealCostTotal.toFixed(2)}
          </h3>
          <p className="text-xs text-slate-400">this month</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm text-slate-500">Total Meals</p>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-500">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
          </div>
          <h3 className="mb-1 text-4xl font-bold text-slate-900">
            {dashboardStats.totalMealsAllMembers}
          </h3>
          <p className="text-xs text-slate-400">meals consumed</p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm text-slate-500">Per Meal Rate</p>
            <div className="rounded-lg bg-violet-100 p-2 text-violet-500">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <h3 className="mb-1 text-4xl font-bold text-slate-900">
            ৳{dashboardStats.costPerMeal.toFixed(2)}
          </h3>
          <p className="text-xs text-slate-400">per meal</p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-100 bg-white/90 p-8 shadow-sm backdrop-blur">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-slate-900">
            Fixed Expense Summary
          </h4>
          <p className="text-sm text-slate-500">
            Current month: {dashboardStats.monthKey}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4">
            <p className="mb-2 text-sm text-slate-500">Total Fixed Expense</p>
            <p className="text-2xl font-bold text-rose-600">
              ৳{dashboardStats.fixedTotal.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4">
            <p className="mb-2 text-sm text-slate-500">Per Person Expense</p>
            <p className="text-2xl font-bold text-slate-900">
              ৳{dashboardStats.fixedCostPerPerson.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              based on {dashboardStats.memberCount} members
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-100 bg-white/90 p-8 shadow-sm backdrop-blur">
        <h4 className="mb-6 text-lg font-medium text-slate-900">
          Recent Activity
        </h4>
        {recentActivity.length > 0 ? (
          <div className="space-y-6">
            {recentActivity.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-sm font-semibold text-slate-600">
                    {item.avatarInitials || "NA"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.timeLabel}
                    </p>
                  </div>
                  {item.amount !== null && item.amount !== undefined ? (
                    <div className="whitespace-nowrap text-sm font-semibold text-slate-900">
                      {formatCurrency(item.amount)}
                    </div>
                  ) : null}
                </div>
                {index < recentActivity.length - 1 ? (
                  <hr className="mt-6 border-slate-50" />
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            No recent activity yet.
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
