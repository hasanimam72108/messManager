import { CalendarDays, Users, UtensilsCrossed } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useGetManagerDailyMealsQuery } from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

const MealsChart = () => {
  const { user } = useAuth();
  const managerUserId = user?.id;
  const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());
  const [selectedDate, setSelectedDate] = useState("");

  const { data: dailyMealsResponse } = useGetManagerDailyMealsQuery(
    { monthKey },
    { skip: !managerUserId },
  );

  const stats = dailyMealsResponse?.data ?? {
    totalMealsAllDates: 0,
    activeDates: 0,
    dateOptions: [],
    dailyRows: [],
  };

  const dateOptions = stats.dateOptions?.length
    ? stats.dateOptions
    : stats.dailyRows.map((row) => row.date);

  useEffect(() => {
    const firstDate = dateOptions?.[0] || "";

    if (!firstDate) {
      setSelectedDate("");
      return;
    }

    if (!selectedDate || !dateOptions.includes(selectedDate)) {
      setSelectedDate(firstDate);
    }
  }, [dateOptions, selectedDate]);

  const maxMealsPerDate = useMemo(() => {
    if (!stats.dailyRows?.length) return 0;
    return Math.max(
      ...stats.dailyRows.map((row) => Number(row.totalMeals) || 0),
    );
  }, [stats.dailyRows]);

  const selectedDay = useMemo(
    () => stats.dailyRows.find((row) => row.date === selectedDate),
    [selectedDate, stats.dailyRows],
  );

  return (
    <div className="min-h-screen rounded-3xl bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-600 shadow-sm">
            <UtensilsCrossed className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Meals Chart</h1>
            <p className="mt-1 text-slate-500">
              Select a date to see user-wise total, lunch, and dinner meals.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="month"
            value={monthKey}
            onChange={(event) => setMonthKey(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <select
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={!dateOptions.length}
          >
            {!dateOptions.length && <option value="">No dates found</option>}
            {dateOptions.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3 mb-2">
            <span className="rounded-lg bg-emerald-100 p-2">
              <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
            </span>
            <p className="text-sm font-medium text-slate-500">
              Total Meals (Month)
            </p>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {stats.totalMealsAllDates}
          </h2>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3 mb-2">
            <span className="rounded-lg bg-sky-100 p-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
            </span>
            <p className="text-sm font-medium text-slate-500">
              Active Meal Dates
            </p>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {stats.activeDates}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">
            Meals by Date
          </h3>

          {stats.dailyRows?.length ? (
            <div className="space-y-4 max-h-140 overflow-y-auto pr-1">
              {stats.dailyRows.map((row) => {
                const totalMeals = Number(row.totalMeals) || 0;
                const barWidth =
                  maxMealsPerDate > 0
                    ? (totalMeals / maxMealsPerDate) * 100
                    : 0;
                const isSelected = row.date === selectedDate;

                return (
                  <button
                    key={row.date}
                    type="button"
                    onClick={() => setSelectedDate(row.date)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-100 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-800">
                        {row.date}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {totalMeals} meals
                      </p>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500">
              No meal data found for this month.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            Meal Table on {selectedDate || "-"}
          </h3>
          <p className="mb-6 text-sm text-slate-500">
            User-wise total meal, lunch meal, and dinner meal details.
          </p>

          {selectedDay?.members?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-sky-50/70">
                    <th className="py-3 px-3 text-sm font-semibold text-slate-900">
                      User
                    </th>
                    <th className="py-3 px-3 text-sm font-semibold text-slate-900 text-right">
                      Total
                    </th>
                    <th className="py-3 px-3 text-sm font-semibold text-slate-900 text-right">
                      Lunch
                    </th>
                    <th className="py-3 px-3 text-sm font-semibold text-slate-900 text-right">
                      Dinner
                    </th>
                    <th className="py-3 px-3 text-sm font-semibold text-slate-900 text-right">
                      Off
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDay.members.map((member) => (
                    <tr
                      key={`${selectedDay.date}-${member.userId}`}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-3 px-3 text-sm text-slate-700">
                        {member.name}
                      </td>
                      <td className="py-3 px-3 text-sm text-slate-700 text-right">
                        {member.totalMeals}
                      </td>
                      <td className="py-3 px-3 text-sm text-slate-700 text-right">
                        {member.lunchMeals}
                      </td>
                      <td className="py-3 px-3 text-sm text-slate-700 text-right">
                        {member.dinnerMeals}
                      </td>
                      <td className="py-3 px-3 text-sm text-slate-700 text-right">
                        {member.offEntries}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No meal records found for selected date.
            </div>
          )}

          {selectedDay && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Date Total</p>
                <p className="font-semibold text-slate-900">
                  {selectedDay.totalMeals} meals
                </p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-slate-600">Active Users</p>
                <p className="font-semibold text-slate-900">
                  <Users className="inline w-4 h-4 mr-1 text-blue-600" />
                  {selectedDay.members.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealsChart;
