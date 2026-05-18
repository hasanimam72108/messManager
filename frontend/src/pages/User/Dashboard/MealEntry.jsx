import { CalendarDays, PlusCircle, Utensils } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useAddMealMutation,
  useAddMealsBulkMutation,
  useGetUserMealsQuery,
} from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

const MealEntry = () => {
  const { user } = useAuth();
  const [entryMode, setEntryMode] = useState("single");
  const [date, setDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [mealType, setMealType] = useState("Lunch");
  const [quantity, setQuantity] = useState(1);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const monthKey = new Date().toISOString().slice(0, 7);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const { data: mealsResponse } = useGetUserMealsQuery(
    { monthKey },
    { skip: !user?.id },
  );
  const [addMeal, { isLoading: isSingleLoading }] = useAddMealMutation();
  const [addMealsBulk, { isLoading: isBulkLoading }] =
    useAddMealsBulkMutation();
  const isSubmitting = isSingleLoading || isBulkLoading;

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
    if (!user?.id) return;

    try {
      const selectedMealTypes =
        mealType === "Both" ? ["Lunch", "Dinner"] : [mealType];

      if (entryMode === "single") {
        if (!date) return;

        await Promise.all(
          selectedMealTypes.map((type) =>
            addMeal({
              date,
              mealType: type,
              quantity: type === "Off" ? 0 : Number(quantity),
            }).unwrap(),
          ),
        );

        toast.success("Meal added successfully.");
        setDate("");
      } else {
        if (!fromDate || !toDate) return;

        const results = await Promise.all(
          selectedMealTypes.map((type) =>
            addMealsBulk({
              fromDate,
              toDate,
              mealType: type,
              quantity: type === "Off" ? 0 : Number(quantity),
              overwriteExisting,
            }).unwrap(),
          ),
        );

        const summary = results.reduce(
          (accumulator, result) => {
            const data = result?.data ?? {};
            accumulator.createdCount += Number(data.createdCount) || 0;
            accumulator.overwrittenCount += Number(data.overwrittenCount) || 0;
            accumulator.skippedCount += Number(data.skippedCount) || 0;

            return accumulator;
          },
          { createdCount: 0, overwrittenCount: 0, skippedCount: 0 },
        );

        toast.success(
          `Meals processed: ${summary.createdCount} added, ${summary.overwrittenCount} overwritten, ${summary.skippedCount} skipped.`,
        );

        setFromDate("");
        setToDate("");
        setOverwriteExisting(false);
      }

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
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setEntryMode("single")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                entryMode === "single"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Single Day
            </button>
            <button
              type="button"
              onClick={() => setEntryMode("range")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                entryMode === "range"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Multiple Days
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {entryMode === "single" ? (
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
                  required={entryMode === "single"}
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CalendarDays className="h-4 w-4 text-sky-500" />
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    min={minDate}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                    required={entryMode === "range"}
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CalendarDays className="h-4 w-4 text-sky-500" />
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    min={fromDate || minDate}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                    required={entryMode === "range"}
                  />
                </div>
              </>
            )}
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
                <option value="Both">Both (Lunch + Dinner)</option>
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

          <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
            {entryMode === "range" && (
              <label className="inline-flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={overwriteExisting}
                  onChange={(e) => setOverwriteExisting(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-green-500"
                />
                Overwrite existing entries for same date and meal type
              </label>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              {isSubmitting
                ? "Saving..."
                : entryMode === "single"
                  ? "Add Meal"
                  : "Add Meals"}
            </button>
          </div>
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
