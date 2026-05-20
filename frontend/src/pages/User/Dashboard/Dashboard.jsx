import {
  CalendarDays,
  Eye,
  EyeOff,
  FileText,
  Home,
  Mail,
  Utensils,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  updateAuthenticatedUser,
  useCompleteFirstLoginPasswordSetupMutation,
  useGetProfileQuery,
} from "../../../features/auth/authSlice";
import {
  useGetUserDashboardStatsQuery,
  useGetUserMealsQuery,
} from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";
import { getUserDashboardStats } from "../../../mock/mockBackend";

const Dashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [completeFirstLoginPasswordSetup, { isLoading }] =
    useCompleteFirstLoginPasswordSetupMutation();
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const { data: profileResponse } = useGetProfileQuery(undefined, {
    skip: !user?.id,
  });
  const messName = profileResponse?.user?.messName || user?.messName || "N/A";
  const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());
  const { data: userStatsResponse } = useGetUserDashboardStatsQuery(
    { monthKey },
    { skip: !user?.id },
  );
  const { data: mealsResponse } = useGetUserMealsQuery(
    { monthKey },
    { skip: !user?.id },
  );

  const fallbackStats = useMemo(
    () => getUserDashboardStats(user?.id),
    [user?.id],
  );
  const stats = userStatsResponse?.data ?? fallbackStats;
  const recentMeals = mealsResponse?.data?.slice(0, 6) ?? [];
  const mealCurrentBalance =
    Number(stats.mealPaidAmount || 0) - Number(stats.mealSubtotal || 0);
  const fixedExpenseRemainingDue =
    stats.fixedDueAmount ??
    Math.max((stats.fixedShareTotal || 0) - (stats.fixedPaidAmount || 0), 0);

  useEffect(() => {
    if (profileResponse?.user) {
      dispatch(updateAuthenticatedUser(profileResponse.user));
    }
  }, [dispatch, profileResponse]);

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

  return (
    <div className="space-y-8">
      <div className="mb-8 rounded-3xl border border-sky-100 bg-linear-to-r from-sky-50 via-white to-emerald-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-3 py-1 text-sm font-medium text-sky-700">
              <Home className="h-4 w-4" />
              User Dashboard
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              User Dashboard
            </h1>
            <p className="text-gray-500">
              Welcome back! Here's your overview for {monthKey}.
            </p>
          </div>
          <input
            type="month"
            value={monthKey}
            onChange={(e) => setMonthKey(e.target.value)}
            max={getCurrentMonthKey()}
            className="bg-white border border-sky-100 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <div className="mt-4 grid gap-3 rounded-2xl border border-sky-100 bg-white/90 p-4 text-sm text-gray-700 sm:grid-cols-3">
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-sky-500" />
            <span className="font-semibold">Name:</span> {user?.name || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold">Email:</span> {user?.email || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <Home className="h-4 w-4 text-amber-500" />
            <span className="font-semibold">Mess:</span> {messName}
          </p>
        </div>
      </div>

      {user?.mustChangePassword && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/90 p-6 rounded-2xl shadow-sm border border-emerald-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">Total Meals</p>
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">
            {stats.totalMeals}
          </h3>
          <p className="text-gray-400 text-xs">this month</p>
        </div>

        <div className="bg-white/90 p-6 rounded-2xl shadow-sm border border-sky-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">Per Meal Cost</p>
            <div className="p-2 bg-sky-50 text-sky-500 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">
            ৳{stats.costPerMeal.toFixed(2)}
          </h3>
          <p className="text-gray-400 text-xs">current rate</p>
        </div>

        <div className="bg-white/90 p-6 rounded-2xl shadow-sm border border-amber-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">Total Meal Cost</p>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">
            ৳{(stats.mealSubtotal || 0).toFixed(2)}
          </h3>
          <p className="text-gray-400 text-xs">this month meals</p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-amber-100 bg-white/90 p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Meal Payment Summary
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Your meal payment details for this month
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50/40 p-6 rounded-2xl shadow-sm border border-emerald-100">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm">Paid Amount</p>
              <div className="p-2 bg-emerald-100 text-emerald-500 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">
              ৳{(stats.mealPaidAmount || 0).toFixed(2)}
            </h3>
            <p className="text-gray-400 text-xs">meal deposits paid</p>
          </div>

          <div className="bg-rose-50/50 p-6 rounded-2xl shadow-sm border border-rose-100">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm">Remaining Due</p>
              <div className="p-2 bg-rose-100 text-rose-500 rounded-lg">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">
              ৳{Number(stats.mealDueAmount || 0).toFixed(2)}
            </h3>
            <p className="text-gray-400 text-xs">after your deposits</p>
          </div>

          <div
            className={`p-6 rounded-2xl shadow-sm border ${
              mealCurrentBalance >= 0
                ? "bg-emerald-50/40 border-emerald-100"
                : "bg-rose-50/50 border-rose-100"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm">Current Balance</p>
              <div
                className={`p-2 rounded-lg ${
                  mealCurrentBalance >= 0
                    ? "bg-emerald-100 text-emerald-500"
                    : "bg-rose-100 text-rose-500"
                }`}
              >
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">
              ৳{mealCurrentBalance.toFixed(2)}
            </h3>
            <p className="text-gray-400 text-xs">
              paid amount - total meal cost
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-sky-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Fixed Expense Summary
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Your fixed expense details for this month
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-sky-50/40 p-6 rounded-2xl shadow-sm border border-sky-100">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm">Total Cost</p>
              <div className="p-2 bg-sky-100 text-sky-500 rounded-lg">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">
              ৳{(stats.fixedShareTotal || 0).toFixed(2)}
            </h3>
            <p className="text-gray-400 text-xs">fixed share amount</p>
          </div>

          <div className="bg-amber-50/40 p-6 rounded-2xl shadow-sm border border-amber-100">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm">Paid Amount</p>
              <div className="p-2 bg-amber-100 text-amber-500 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">
              ৳{(stats.fixedPaidAmount || 0).toFixed(2)}
            </h3>
            <p className="text-gray-400 text-xs">fixed expense deposits</p>
          </div>

          <div className="bg-rose-50/40 p-6 rounded-2xl shadow-sm border border-rose-100">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm">Remaining Due</p>
              <div className="p-2 bg-rose-100 text-rose-500 rounded-lg">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">
              ৳{fixedExpenseRemainingDue.toFixed(2)}
            </h3>
            <p className="text-gray-400 text-xs">after your deposits</p>
          </div>
        </div>
      </div>

      <div className="bg-white/90 rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="p-7">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-emerald-500" />
            Recent Meal Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-2 text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="py-4 px-2 text-sm font-semibold text-gray-900">
                    Meal Type
                  </th>
                  <th className="py-4 px-2 text-sm font-semibold text-gray-900">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentMeals.length === 0 ? (
                  <tr>
                    <td className="py-4 px-2 text-gray-500" colSpan={3}>
                      No meal activity yet.
                    </td>
                  </tr>
                ) : (
                  recentMeals.map((meal) => (
                    <tr
                      key={meal.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-2 text-sm text-gray-700">
                        {meal.date}
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-700">
                        {meal.mealType}
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-700">
                        {meal.quantity}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
