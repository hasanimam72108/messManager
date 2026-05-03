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
    fixedTotal: 0,
    costPerMeal: 0,
    breakdownRows: [],
  };

  const fixedCostPerPerson =
    stats.memberCount > 0 ? stats.fixedTotal / stats.memberCount : 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Monthly Report</h1>
          <p className="text-gray-500 mt-1">Complete report for {monthKey}</p>
        </div>
        <input
          type="month"
          value={monthKey}
          onChange={(event) => setMonthKey(event.target.value)}
          className="bg-white border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">
            Total Members
          </p>
          <h2 className="text-3xl font-bold text-gray-800">
            {stats.memberCount}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Meals</p>
          <h2 className="text-3xl font-bold text-gray-800">
            {stats.totalMealsAllMembers}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">
            Total Expenses
          </p>
          <h2 className="text-3xl font-bold text-red-600">
            ৳{stats.totalExpenses.toFixed(2)}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">
            Cost Per Meal
          </p>
          <h2 className="text-3xl font-bold text-green-600">
            ৳{stats.costPerMeal.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Fixed Expense Summary
          </h3>
          <p className="text-gray-500 text-sm">
            Month-wise fixed expense overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Members
            </p>
            <h2 className="text-3xl font-bold text-gray-800">
              {stats.memberCount}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Expenses
            </p>
            <h2 className="text-3xl font-bold text-red-600">
              ৳{stats.fixedTotal.toFixed(2)}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500 text-sm font-medium mb-1">
              Cost Per Person
            </p>
            <h2 className="text-3xl font-bold text-green-600">
              ৳{fixedCostPerPerson.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {/* Expense Breakdown Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">Expense Breakdown</h3>
          <p className="text-gray-500 text-sm">Category-wise expense summary</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 mb-4 inline-table w-full">
                <th className="pb-3 text-sm font-semibold text-gray-600 w-1/3">
                  Category
                </th>
                <th className="pb-3 text-sm font-semibold text-gray-600 w-1/3">
                  Amount
                </th>
                <th className="pb-3 text-sm font-semibold text-gray-600 w-1/3 text-right md:text-left">
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
                    className={`flex items-center text-sm text-gray-700 ${index > 0 ? "border-t border-gray-50 pt-4" : ""}`}
                  >
                    <td className="w-1/3 font-medium">{row.category}</td>
                    <td className="w-1/3">৳{row.amount.toFixed(2)}</td>
                    <td className="w-1/3 flex items-center gap-3">
                      <div className="w-24 md:w-48 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-500">
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
