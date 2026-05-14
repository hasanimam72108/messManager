import {
  BarChart3,
  CalendarRange,
  Coins,
  ReceiptText,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useGetManagerDashboardStatsQuery } from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);

const MonthlyReport = () => {
  const { user } = useAuth();
  const managerUserId = user?.id;
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());

  const { data: dashboardStatsResponse } = useGetManagerDashboardStatsQuery(
    { monthKey },
    { skip: !managerUserId },
  );

  const stats = dashboardStatsResponse?.data ?? {
    memberCount: 0,
    totalMealsAllMembers: 0,
    totalExpenses: 0,
    mealCostTotal: 0,
    fixedTotal: 0,
    costPerMeal: 0,
    breakdownRows: [],
  };

  const fixedCostPerPerson =
    stats.memberCount > 0 ? stats.fixedTotal / stats.memberCount : 0;

  return (
    <div className="min-h-screen rounded-3xl bg-linear-to-br from-indigo-50 via-white to-amber-50 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 shadow-sm">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Monthly Report
            </h1>
            <p className="mt-1 text-slate-500">
              Complete report for {monthKey}
            </p>
          </div>
        </div>
        <div className="relative">
          <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="month"
            value={monthKey}
            onChange={(event) => setMonthKey(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Users className="h-4 w-4 text-sky-500" />
            <p className="text-sm font-medium">Total Members</p>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {stats.memberCount}
          </h2>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <ReceiptText className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-medium">Total Meals</p>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {stats.totalMealsAllMembers}
          </h2>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Coins className="h-4 w-4 text-rose-500" />
            <p className="text-sm font-medium">Total Meals Expenses</p>
          </div>
          <h2 className="text-3xl font-bold text-rose-600">
            ৳{stats.mealCostTotal.toFixed(2)}
          </h2>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <BarChart3 className="h-4 w-4 text-violet-500" />
            <p className="text-sm font-medium">Cost Per Meal</p>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            ৳{stats.costPerMeal.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Fixed Expense Summary
          </h3>
          <p className="text-sm text-slate-500">
            Month-wise fixed expense overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
            <p className="mb-1 text-sm font-medium text-slate-500">
              Total Members
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              {stats.memberCount}
            </h2>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white/90 p-6 shadow-sm backdrop-blur">
            <p className="mb-1 text-sm font-medium text-slate-500">
              Total Expenses
            </p>
            <h2 className="text-3xl font-bold text-rose-600">
              ৳{stats.fixedTotal.toFixed(2)}
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-sm backdrop-blur">
            <p className="mb-1 text-sm font-medium text-slate-500">
              Cost Per Person
            </p>
            <h2 className="text-3xl font-bold text-emerald-600">
              ৳{fixedCostPerPerson.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {/* Expense Breakdown Section */}
      <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Expense Breakdown
          </h3>
          <p className="text-sm text-slate-500">
            Category-wise expense summary
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="mb-4 inline-table w-full border-b border-sky-100 bg-sky-50/70">
                <th className="w-1/3 pb-3 text-sm font-semibold text-slate-600">
                  Category
                </th>
                <th className="w-1/3 pb-3 text-sm font-semibold text-slate-600">
                  Amount
                </th>
                <th className="w-1/3 pb-3 text-sm font-semibold text-slate-600 text-right md:text-left">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="block mt-2 space-y-4">
              {stats.breakdownRows.map((row, index) => {
                const percentage =
                  stats.totalExpenses > 0
                    ? (row.amount / stats.totalExpenses) * 100
                    : 0;

                return (
                  <tr
                    key={row.category}
                    className={`flex items-center text-sm text-slate-700 ${index > 0 ? "border-t border-slate-50 pt-4" : ""}`}
                  >
                    <td className="w-1/3 font-medium">{row.category}</td>
                    <td className="w-1/3">৳{row.amount.toFixed(2)}</td>
                    <td className="w-1/3 flex items-center gap-3">
                      <div className="h-2 w-24 rounded-full bg-slate-100 md:w-48">
                        <div
                          className="h-2 rounded-full bg-linear-to-r from-emerald-400 to-cyan-500"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-slate-500">
                        {percentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
