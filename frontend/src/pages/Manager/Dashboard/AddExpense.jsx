import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import {
  getFixedCostsByMess,
  upsertFixedCostsByManager,
} from "../../../mock/mockBackend";

const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);

const getFormFromCosts = (costs) => ({
  rent: String(costs.rent),
  khala: String(costs.khala),
  utilities: String(costs.utilities),
  wifi: String(costs.wifi),
});

const AddExpense = () => {
  const { user } = useAuth();
  const [generalExpenseForm, setGeneralExpenseForm] = useState({
    title: "Bazaar",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());
  const [form, setForm] = useState(() => {
    const messId = user?.messId;
    if (!messId) {
      return {
        rent: "0",
        khala: "0",
        utilities: "0",
        wifi: "0",
      };
    }
    return getFormFromCosts(
      getFixedCostsByMess({ messId, monthKey: getCurrentMonthKey() }),
    );
  });

  const fixedTotal = useMemo(() => {
    const rent = Number(form.rent) || 0;
    const khala = Number(form.khala) || 0;
    const utilities = Number(form.utilities) || 0;
    const wifi = Number(form.wifi) || 0;
    return rent + khala + utilities + wifi;
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMonthChange = (event) => {
    const nextMonthKey = event.target.value;
    setMonthKey(nextMonthKey);

    if (!user?.messId) return;
    const existing = getFixedCostsByMess({
      messId: user.messId,
      monthKey: nextMonthKey,
    });
    setForm(getFormFromCosts(existing));
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!user?.id) return;

    try {
      upsertFixedCostsByManager({
        managerUserId: user.id,
        monthKey,
        rent: form.rent,
        khala: form.khala,
        utilities: form.utilities,
        wifi: form.wifi,
      });
      toast.success("Monthly fixed expenses saved.");
    } catch (error) {
      toast.error(error.message || "Failed to save fixed expenses.");
    }
  };

  const handleGeneralExpenseChange = (event) => {
    const { name, value } = event.target;
    setGeneralExpenseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneralExpenseSubmit = (event) => {
    event.preventDefault();
    toast.success("Expense added.");
    setGeneralExpenseForm((prev) => ({
      ...prev,
      amount: "",
      description: "",
    }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add Expense</h1>
        <p className="text-gray-500 mt-1">
          Manage general expense and monthly fixed expense separately
        </p>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-gray-600 font-medium mb-2">
          Total Fixed Expenses This Month
        </p>
        <h2 className="text-4xl font-bold text-red-600">
          ৳{fixedTotal.toFixed(2)}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 text-left">
          Add New Expense
        </h3>
        <p className="text-gray-500 text-sm mb-6 text-left">
          Enter expense details below
        </p>

        <form
          className="space-y-6 text-left"
          onSubmit={handleGeneralExpenseSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Title
              </label>
              <select
                name="title"
                value={generalExpenseForm.title}
                onChange={handleGeneralExpenseChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>Bazaar</option>
                <option>House Rent</option>
                <option>Utility Bill</option>
                <option>Others</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (৳)
              </label>
              <input
                type="number"
                min="0"
                name="amount"
                value={generalExpenseForm.amount}
                onChange={handleGeneralExpenseChange}
                placeholder="Enter amount"
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={generalExpenseForm.date}
              onChange={handleGeneralExpenseChange}
              className="w-full md:w-1/2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows="3"
              name="description"
              value={generalExpenseForm.description}
              onChange={handleGeneralExpenseChange}
              placeholder="Enter description"
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-6 py-2.5 transition-colors"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Add Fixed Expense Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 text-left">
          Add Fixed Expense
        </h3>
        <p className="text-gray-500 text-sm mb-6 text-left">
          Select month and update fixed categories
        </p>

        <form className="space-y-6 text-left" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <input
              type="month"
              value={monthKey}
              onChange={handleMonthChange}
              className="w-full md:w-1/2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Rent (৳)
              </label>
              <input
                type="number"
                min="0"
                name="rent"
                value={form.rent}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khala Bill (৳)
              </label>
              <input
                type="number"
                min="0"
                name="khala"
                value={form.khala}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilities (Gas + Electricity + Water) (৳)
              </label>
              <input
                type="number"
                min="0"
                name="utilities"
                value={form.utilities}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WiFi Bill (৳)
              </label>
              <input
                type="number"
                min="0"
                name="wifi"
                value={form.wifi}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-6 py-2.5 transition-colors"
          >
            Save Fixed Expenses
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
