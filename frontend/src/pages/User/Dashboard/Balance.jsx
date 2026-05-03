import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useAddDepositMutation,
  useGetUserBillSummaryQuery,
  useGetUserTransactionsQuery,
} from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

const Balance = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const monthKey = new Date().toISOString().slice(0, 7);
  const { data: transactionsResponse } = useGetUserTransactionsQuery(
    undefined,
    {
      skip: !user?.id,
    },
  );
  const { data: billSummaryResponse } = useGetUserBillSummaryQuery(
    { monthKey },
    { skip: !user?.id },
  );
  const [addDeposit, { isLoading }] = useAddDepositMutation();

  const transactions = transactionsResponse?.data ?? [];
  const stats = billSummaryResponse?.data ?? {
    currentBalance: 0,
  };

  const handleAddDeposit = async (e) => {
    e.preventDefault();
    if (!amount || !user?.id) return;

    try {
      await addDeposit({ amount: Number(amount) }).unwrap();
      toast.success("Deposit added successfully.");
      setAmount("");
    } catch (error) {
      toast.error(error?.data?.message || "Deposit save failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Balance</h1>
        <p className="text-gray-500">
          Manage your account balance and transactions
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Current Balance
        </h2>
        <p className="text-gray-500 text-sm mb-4">Your available balance</p>
        <div className="text-4xl font-bold text-[#16a34a]">
          ৳{Number(stats.currentBalance || 0).toFixed(2)}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Add Deposit
        </h2>
        <p className="text-gray-500 text-sm mb-6">Add money to your account</p>

        <form onSubmit={handleAddDeposit}>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (৳)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-[#16a34a] text-white font-medium rounded-xl hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              {isLoading ? "Saving..." : "Add Deposit"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Transaction History
          </h2>
          <p className="text-gray-500 text-sm">All your account transactions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 font-semibold text-gray-900">Date</th>
                <th className="py-4 px-4 font-semibold text-gray-900">Type</th>
                <th className="py-4 px-4 font-semibold text-gray-900">
                  Amount
                </th>
                <th className="py-4 px-4 font-semibold text-gray-900">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0"
                >
                  <td className="py-4 px-4 text-gray-600">{tx.date}</td>
                  <td className="py-4 px-4 text-gray-600">{tx.type}</td>
                  <td
                    className={`py-4 px-4 font-medium ${Number(tx.amount) < 0 ? "text-red-500" : "text-[#16a34a]"}`}
                  >
                    {Number(tx.amount) < 0
                      ? `-৳${Math.abs(Number(tx.amount)).toFixed(2)}`
                      : `৳${Number(tx.amount).toFixed(2)}`}
                  </td>
                  <td className="py-4 px-4 text-gray-900 font-medium">
                    ৳{Number(tx.balance || 0).toFixed(2)}
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

export default Balance;
