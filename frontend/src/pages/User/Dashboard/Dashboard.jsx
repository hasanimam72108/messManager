import { FileText, Utensils, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateAuthenticatedUser } from "../../../features/auth/authSlice";
import useAuth from "../../../hooks/useAuth";
import {
  completeFirstLoginPasswordSetup,
  getMessNameById,
  getUserDashboardStats,
  listMealsByUser,
} from "../../../mock/mockBackend";

const Dashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const messName = getMessNameById(user?.messId);
  const stats = useMemo(() => getUserDashboardStats(user?.id), [user?.id]);
  const recentMeals = useMemo(
    () => listMealsByUser(user?.id).slice(0, 6),
    [user?.id],
  );

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSetupPassword = (event) => {
    event.preventDefault();
    if (!user?.id) return;

    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const updatedUser = completeFirstLoginPasswordSetup({
        userId: user.id,
        newPassword: passwordForm.password,
      });
      dispatch(updateAuthenticatedUser(updatedUser));
      setPasswordForm({ password: "", confirmPassword: "" });
      toast.success("Password updated successfully.");
    } catch (error) {
      toast.error(error.message || "Password setup failed.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          User Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome back! Here's your overview for this month.
        </p>
        <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">Name:</span> {user?.name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user?.email || "N/A"}
          </p>
          <p>
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
            <input
              type="password"
              name="password"
              value={passwordForm.password}
              onChange={handlePasswordChange}
              placeholder="New password"
              className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm"
              minLength={6}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm password"
              className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm"
              minLength={6}
              required
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 text-sm font-medium"
            >
              Save Password
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">Total Meals</p>
            <div className="p-2 bg-green-50 text-green-500 rounded-lg">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">
            {stats.totalMeals}
          </h3>
          <p className="text-gray-400 text-xs">this month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">Per Meal Cost</p>
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">
            ৳{stats.costPerMeal.toFixed(2)}
          </h3>
          <p className="text-gray-400 text-xs">current rate</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">Current Bill</p>
            <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">
            ৳{stats.totalBill.toFixed(2)}
          </h3>
          <p className="text-gray-400 text-xs">meal based total</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm">Remaining Due</p>
            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-1">
            ৳{stats.dueAmount.toFixed(2)}
          </h3>
          <p className="text-gray-400 text-xs">after deposits</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-7">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
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
