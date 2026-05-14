import { useState } from "react";
import { useGetExpensesListQuery } from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);

const ExpenseList = () => {
  const { user } = useAuth();
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());

  const { data: expensesResponse, isLoading } = useGetExpensesListQuery(
    { monthKey },
    { skip: !user?.id },
  );

  const expenses = expensesResponse?.data?.expenses || [];
  const total = expensesResponse?.data?.total || 0;
  const count = expensesResponse?.data?.count || 0;

  const handleMonthChange = (event) => {
    setMonthKey(event.target.value);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Expense List</h1>
          <p className="text-gray-500 mt-1">View all expenses for {monthKey}</p>
        </div>
        <input
          type="month"
          value={monthKey}
          onChange={handleMonthChange}
          className="bg-white border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">
            Total Expenses
          </p>
          <h2 className="text-3xl font-bold text-red-600">
            ৳{total.toFixed(2)}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">
            Number of Expenses
          </p>
          <h2 className="text-3xl font-bold text-gray-800">{count}</h2>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-600">
                <th className="py-3 font-semibold">Date</th>
                <th className="py-3 font-semibold">Title</th>
                <th className="py-3 font-semibold">Amount</th>
                <th className="py-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={4}>
                    Loading expenses...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={4}>
                    No expenses found for this month.
                  </td>
                </tr>
              ) : (
                expenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    className={`border-b border-gray-50 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 font-medium text-gray-800">
                      {new Date(expense.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 font-medium text-gray-700">
                      {expense.title}
                    </td>
                    <td className="py-3 font-semibold text-red-600">
                      ৳{expense.amount.toFixed(2)}
                    </td>
                    <td className="py-3 text-gray-600">
                      {expense.description || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
