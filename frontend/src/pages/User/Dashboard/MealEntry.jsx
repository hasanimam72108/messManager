import { CalendarDays, PlusCircle, Utensils } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useAddMealMutation,
  useGetUserMealsQuery,
} from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

const MealEntry = () => {
  const { user } = useAuth();
  const [date, setDate] = useState("");
  const [mealType, setMealType] = useState("Lunch");
  const [quantity, setQuantity] = useState(1);
  const monthKey = new Date().toISOString().slice(0, 7);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const { data: mealsResponse } = useGetUserMealsQuery(
    { monthKey },
    { skip: !user?.id },
  );
  const [addMeal, { isLoading }] = useAddMealMutation();

  const handleMealTypeChange = (e) => {
    const selectedMealType = e.target.value;
    setMealType(selectedMealType);
    if (selectedMealType === "Off") {
      setQuantity(0);
    } else if (Number(quantity) === 0) {
      setQuantity(1);
    }
  };

  const meals = mealsResponse?.data ?? [];

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!date || !user?.id) return;

    try {
      await addMeal({
        date,
        mealType,
        quantity: mealType === "Off" ? 0 : Number(quantity),
      }).unwrap();

      toast.success("Meal added successfully.");
      setDate("");
      setMealType("Lunch");
      setQuantity(1);
    } catch (error) {
      toast.error(error?.data?.message || "Meal save failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="rounded-3xl border border-emerald-100 bg-linear-to-r from-emerald-50 via-white to-sky-50 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meal Entry</h1>
            <p className="text-gray-500">Record your daily meals here</p>
          </div>
        </div>
      </div>

      <div className="bg-white/90 rounded-2xl shadow-sm border border-emerald-100 p-6">
        <div className="mb-6 flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Add New Meal
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Enter your meal details below
        </p>

        <form onSubmit={handleAddMeal} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <CalendarDays className="h-4 w-4 text-sky-500" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Utensils className="h-4 w-4 text-emerald-500" />
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={handleMealTypeChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors appearance-none"
              >
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Off">Off</option>
              </select>
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <PlusCircle className="h-4 w-4 text-amber-500" />
                Quantity
              </label>
              <input
                type="number"
                min={mealType === "Off" ? "0" : "1"}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={mealType === "Off"}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            {isLoading ? "Saving..." : "Add Meal"}
          </button>
        </form>
      </div>

      <div className="bg-white/90 rounded-2xl shadow-sm border border-sky-100 p-6">
        <div className="mb-6 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-sky-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Monthly Meal Summary
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Your meal records for this month
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 font-semibold text-gray-900">Date</th>
                <th className="py-4 px-4 font-semibold text-gray-900">
                  Meal Type
                </th>
                <th className="py-4 px-4 font-semibold text-gray-900">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr
                  key={meal.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0"
                >
                  <td className="py-4 px-4 text-gray-600">{meal.date}</td>
                  <td className="py-4 px-4 text-gray-600">{meal.mealType}</td>
                  <td className="py-4 px-4 text-gray-600">{meal.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MealEntry;
