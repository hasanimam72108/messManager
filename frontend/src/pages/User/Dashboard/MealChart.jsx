import { CalendarDays, Trash2, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useDeleteUserMealEntriesMutation,
  useGetUserMealsQuery,
} from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

const MealChart = () => {
  const { user } = useAuth();
  const [monthKey, setMonthKey] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const currentMonthLabel = useMemo(() => {
    const [year, month] = monthKey.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [monthKey]);

  const { data: mealsResponse } = useGetUserMealsQuery(
    { monthKey },
    { skip: !user?.id },
  );
  const [deleteUserMealEntries, { isLoading }] =
    useDeleteUserMealEntriesMutation();

  const meals = useMemo(() => mealsResponse?.data ?? [], [mealsResponse]);

  const { rows, totalLunch, totalDinner } = useMemo(() => {
    const mealMap = meals.reduce((accumulator, meal) => {
      const date = meal.date;

      if (!accumulator[date]) {
        accumulator[date] = { lunch: 0, dinner: 0, count: 0 };
      }

      const mealType = String(meal.mealType || "").toLowerCase();
      const quantity = Number(meal.quantity) || 0;

      if (mealType === "lunch") {
        accumulator[date].lunch += quantity;
      } else if (mealType === "dinner") {
        accumulator[date].dinner += quantity;
      }

      accumulator[date].count += 1;

      return accumulator;
    }, {});

    const [year, month] = monthKey.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const generatedRows = Array.from({ length: daysInMonth }, (_, index) => {
      const day = String(index + 1).padStart(2, "0");
      const date = `${monthKey}-${day}`;
      const bucket = mealMap[date] ?? { lunch: 0, dinner: 0, count: 0 };
      const dateObject = new Date(`${date}T00:00:00`);

      return {
        date,
        lunch: bucket.lunch,
        dinner: bucket.dinner,
        count: bucket.count,
        canDelete: dateObject > today,
      };
    });

    return {
      rows: generatedRows,
      totalLunch: generatedRows.reduce((sum, row) => sum + row.lunch, 0),
      totalDinner: generatedRows.reduce((sum, row) => sum + row.dinner, 0),
    };
  }, [monthKey, meals]);

  const handleDelete = async (date, mealType) => {
    if (!window.confirm(`Delete ${mealType} meal for ${date}?`)) {
      return;
    }

    try {
      await deleteUserMealEntries({ date, mealType }).unwrap();
      toast.success(`${mealType} meal deleted for ${date}.`);
    } catch (error) {
      toast.error(error?.data?.message || "Meal delete failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="rounded-3xl border border-sky-100 bg-linear-to-r from-sky-50 via-white to-emerald-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-100 p-2 text-sky-600">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meal Chart</h1>
              <p className="text-gray-500">
                Meal chart for {currentMonthLabel}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Month
            </label>
            <input
              type="month"
              value={monthKey}
              onChange={(event) => setMonthKey(event.target.value)}
              className="w-full sm:w-52 rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Utensils className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-gray-900">Lunch Total</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalLunch}</p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sky-600 mb-2">
            <Utensils className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-gray-900">
              Dinner Total
            </h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalDinner}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Monthly Meals</h2>
          <p className="text-sm text-gray-500">
            Past and today&apos;s meals are locked. Future meal dates can be
            deleted.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/70">
                <th className="py-4 px-4 font-semibold text-gray-900">Date</th>
                <th className="py-4 px-4 font-semibold text-gray-900">Lunch</th>
                <th className="py-4 px-4 font-semibold text-gray-900">
                  Dinner
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.date}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4 text-gray-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{row.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    <div className="flex items-center justify-between gap-3">
                      <span>{row.lunch}</span>
                      {row.canDelete && row.lunch > 0 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(row.date, "Lunch")}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    <div className="flex items-center justify-between gap-3">
                      <span>{row.dinner}</span>
                      {row.canDelete && row.dinner > 0 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(row.date, "Dinner")}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MealChart;
