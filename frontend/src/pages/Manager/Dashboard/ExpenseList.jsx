import { CircleDollarSign, ListFilter, NotebookText } from "lucide-react";
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
    <div className="min-h-screen rounded-3xl bg-gradient-to-br from-amber-50 via-white to-cyan-50 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-600 shadow-sm">
            <NotebookText className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Expense List</h1>
            <p className="mt-1 text-slate-500">
              View all expenses for {monthKey}
            </p>
          </div>
        </div>
        <div className="relative">
          <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="month"
            value={monthKey}
            onChange={handleMonthChange}
            className="rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl border border-rose-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <CircleDollarSign className="h-4 w-4 text-rose-500" />
            <p className="text-sm font-medium">Total Expenses</p>
          </div>
          <h2 className="text-3xl font-bold text-rose-600">
            ৳{total.toFixed(2)}
          </h2>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <NotebookText className="h-4 w-4 text-sky-500" />
            <p className="text-sm font-medium">Number of Expenses</p>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{count}</h2>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-amber-100 bg-amber-50/70 text-slate-600">
                <th className="py-3 px-2 font-semibold">Date</th>
                <th className="py-3 px-2 font-semibold">Title</th>
                <th className="py-3 px-2 font-semibold">Amount</th>
                <th className="py-3 px-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={4}>
                    Loading expenses...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={4}>
                    No expenses found for this month.
                  </td>
                </tr>
              ) : (
                expenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    className={`border-b border-slate-50 ${
                      index % 2 === 0 ? "bg-slate-50/60" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-2 font-medium text-slate-800">
                      {new Date(expense.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-700">
                      {expense.title}
                    </td>
                    <td className="py-3 px-2 font-semibold text-rose-600">
                      ৳{expense.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-slate-600">
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
