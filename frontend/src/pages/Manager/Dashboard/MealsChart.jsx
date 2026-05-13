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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meals Chart</h1>
          <p className="text-gray-500 mt-1">
            Select a date to see user-wise total, lunch, and dinner meals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="month"
            value={monthKey}
            onChange={(event) => setMonthKey(event.target.value)}
            className="bg-white border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <select
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="bg-white border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-emerald-100">
              <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
            </span>
            <p className="text-gray-500 text-sm font-medium">
              Total Meals (Month)
            </p>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {stats.totalMealsAllDates}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-lg bg-blue-100">
              <CalendarDays className="w-5 h-5 text-blue-600" />
            </span>
            <p className="text-gray-500 text-sm font-medium">
              Active Meal Dates
            </p>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {stats.activeDates}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Meals by Date
          </h3>

          {stats.dailyRows?.length ? (
            <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
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
                        ? "border-green-300 bg-green-50"
                        : "border-gray-100 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-800">
                        {row.date}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {totalMeals} meals
                      </p>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No meal data found for this month.
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Meal Table on {selectedDate || "-"}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            User-wise total meal, lunch meal, and dinner meal details.
          </p>

          {selectedDay?.members?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-3 text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th className="py-3 px-3 text-sm font-semibold text-gray-900 text-right">
                      Total
                    </th>
                    <th className="py-3 px-3 text-sm font-semibold text-gray-900 text-right">
                      Lunch
                    </th>
                    <th className="py-3 px-3 text-sm font-semibold text-gray-900 text-right">
                      Dinner
                    </th>
                    <th className="py-3 px-3 text-sm font-semibold text-gray-900 text-right">
                      Off
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDay.members.map((member) => (
                    <tr
                      key={`${selectedDay.date}-${member.userId}`}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-3 px-3 text-sm text-gray-700">
                        {member.name}
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-700 text-right">
                        {member.totalMeals}
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-700 text-right">
                        {member.lunchMeals}
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-700 text-right">
                        {member.dinnerMeals}
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-700 text-right">
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
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Date Total</p>
                <p className="font-semibold text-gray-900">
                  {selectedDay.totalMeals} meals
                </p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="font-semibold text-gray-900">
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
