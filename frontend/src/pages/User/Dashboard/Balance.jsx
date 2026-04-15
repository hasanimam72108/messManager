import { useState } from "react";

const Balance = () => {
  const [amount, setAmount] = useState("");

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2026-02-01",
      type: "Deposit",
      amount: "৳2000",
      balance: "৳2000",
    },
    {
      id: 2,
      date: "2026-02-15",
      type: "Expense",
      amount: "-৳250",
      balance: "৳1750",
    },
  ]);

  const handleAddDeposit = (e) => {
    e.preventDefault();
    if (!amount) return;

    const newTx = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: "Deposit",
      amount: `৳${amount}`,
      balance: `৳${1750 + Number(amount)}`,
    };
    setTransactions([newTx, ...transactions]);
    setAmount("");
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
        <div className="text-4xl font-bold text-[#16a34a]">৳1750</div>
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
              className="px-6 py-3 bg-[#16a34a] text-white font-medium rounded-xl hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              Add Deposit
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
                    className={`py-4 px-4 font-medium ${tx.amount.startsWith("-") ? "text-red-500" : "text-[#16a34a]"}`}
                  >
                    {tx.amount}
                  </td>
                  <td className="py-4 px-4 text-gray-900 font-medium">
                    {tx.balance}
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
