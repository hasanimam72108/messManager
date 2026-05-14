import {
  CalendarDays,
  CircleDollarSign,
  FileText,
  PlusCircle,
  Save,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useAddExpenseMutation,
  useGetFixedCostsQuery,
  useGetMonthlyExpenseSummaryQuery,
  useUpsertFixedCostsMutation,
} from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);

const DEFAULT_FIXED_FORM = {
  rent: "0",
  khala: "0",
  utilities: "0",
  wifi: "0",
};

const getFormFromCosts = (costs) => ({
  rent: String(costs?.rent ?? 0),
  khala: String(costs?.khala ?? 0),
  utilities: String(costs?.utilities ?? 0),
  wifi: String(costs?.wifi ?? 0),
});

const AddExpense = () => {
  const { user } = useAuth();
  const [addExpense] = useAddExpenseMutation();
  const [upsertFixedCosts] = useUpsertFixedCostsMutation();
  const [generalExpenseForm, setGeneralExpenseForm] = useState({
    title: "Bazaar",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());
  const [draftForm, setDraftForm] = useState(null);

  const { data: fixedCostsResponse } = useGetFixedCostsQuery(
    { monthKey },
    { skip: !user?.id },
  );
  const { data: monthlyExpenseSummaryResponse } =
    useGetMonthlyExpenseSummaryQuery({ monthKey }, { skip: !user?.id });

  const fixedForm = useMemo(() => {
    if (draftForm) return draftForm;
    const fixedCosts = fixedCostsResponse?.data;
    if (!fixedCosts) return DEFAULT_FIXED_FORM;
    return getFormFromCosts(fixedCosts);
  }, [draftForm, fixedCostsResponse]);

  const fixedTotal = useMemo(() => {
    const rent = Number(fixedForm.rent) || 0;
    const khala = Number(fixedForm.khala) || 0;
    const utilities = Number(fixedForm.utilities) || 0;
    const wifi = Number(fixedForm.wifi) || 0;
    return rent + khala + utilities + wifi;
  }, [fixedForm]);

  const bazaarTotal = Number(
    monthlyExpenseSummaryResponse?.data?.bazaarTotal || 0,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDraftForm((prev) => ({ ...(prev ?? fixedForm), [name]: value }));
  };

  const handleMonthChange = (event) => {
    const nextMonthKey = event.target.value;
    setMonthKey(nextMonthKey);
    setDraftForm(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!user?.id) return;

    try {
      await upsertFixedCosts({
        monthKey,
        rent: fixedForm.rent,
        khala: fixedForm.khala,
        utilities: fixedForm.utilities,
        wifi: fixedForm.wifi,
      }).unwrap();
      toast.success("Monthly fixed expenses saved.");
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.data?.errors?.mess?.[0] ||
        error?.data?.errors?.monthKey?.[0] ||
        "Failed to save fixed expenses.";
      toast.error(message);
    }
  };

  const handleGeneralExpenseChange = (event) => {
    const { name, value } = event.target;
    setGeneralExpenseForm((prev) => ({ ...prev, [name]: value }));
  };

  const getDateLimits = () => {
    const today = new Date();
    const maxDate = today.toISOString().split("T")[0];

    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 20);
    const minDateString = minDate.toISOString().split("T")[0];

    return { minDate: minDateString, maxDate };
  };

  const getMonthLimits = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const maxMonth = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

    let prevYear = currentYear;
    let prevMonth = currentMonth - 1;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    const minMonth = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;

    return { minMonth, maxMonth };
  };

  const handleGeneralExpenseSubmit = async (event) => {
    event.preventDefault();

    try {
      await addExpense({
        title: generalExpenseForm.title,
        amount: generalExpenseForm.amount,
        date: generalExpenseForm.date,
        description: generalExpenseForm.description,
      }).unwrap();

      toast.success("Expense added.");
      setGeneralExpenseForm((prev) => ({
        ...prev,
        amount: "",
        description: "",
      }));
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.data?.errors?.amount?.[0] ||
        error?.data?.errors?.date?.[0] ||
        "Failed to add expense.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen rounded-3xl bg-linear-to-br from-emerald-50 via-white to-sky-50 p-6 md:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 shadow-sm">
          <CircleDollarSign className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add Expense</h1>
          <p className="mt-1 text-slate-500">
            Manage general expense and monthly fixed expense separately
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-slate-600">
            <WalletCards className="h-4 w-4 text-sky-500" />
            <p className="font-medium">Total Fixed Expenses This Month</p>
          </div>
          <h2 className="text-4xl font-bold text-rose-600">
            ৳{fixedTotal.toFixed(2)}
          </h2>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-slate-600">
            <CircleDollarSign className="h-4 w-4 text-emerald-500" />
            <p className="font-medium">Total Bazaar Expenses This Month</p>
          </div>
          <h2 className="text-4xl font-bold text-emerald-600">
            ৳{bazaarTotal.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="mb-6 flex items-center gap-3 text-left">
          <div className="rounded-xl bg-sky-100 p-2 text-sky-600">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 text-left">
              Add New Expense
            </h3>
            <p className="text-sm text-slate-500 text-left">
              Enter expense details below
            </p>
          </div>
        </div>

        <form
          className="space-y-6 text-left"
          onSubmit={handleGeneralExpenseSubmit}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Expense Title
              </label>
              <select
                name="title"
                value={generalExpenseForm.title}
                onChange={handleGeneralExpenseChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Bazaar</option>
                <option>Others</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Amount (৳)
              </label>
              <input
                type="number"
                min="0"
                name="amount"
                value={generalExpenseForm.amount}
                onChange={handleGeneralExpenseChange}
                placeholder="Enter amount"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date
            </label>
            <div className="relative w-full md:w-1/2">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                name="date"
                value={generalExpenseForm.date}
                onChange={handleGeneralExpenseChange}
                min={getDateLimits().minDate}
                max={getDateLimits().maxDate}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows="3"
              name="description"
              value={generalExpenseForm.description}
              onChange={handleGeneralExpenseChange}
              placeholder="Enter description"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <Save className="h-4 w-4" />
            Add Expense
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="mb-6 flex items-center gap-3 text-left">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 text-left">
              Add Fixed Expense
            </h3>
            <p className="text-sm text-slate-500 text-left">
              Select month and update fixed categories
            </p>
          </div>
        </div>

        <form className="space-y-6 text-left" onSubmit={handleSave}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Month
            </label>
            <div className="relative w-full md:w-1/2">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="month"
                value={monthKey}
                onChange={handleMonthChange}
                min={getMonthLimits().minMonth}
                max={getMonthLimits().maxMonth}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                House Rent (৳)
              </label>
              <input
                type="number"
                min="0"
                name="rent"
                value={fixedForm.rent}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Khala Bill (৳)
              </label>
              <input
                type="number"
                min="0"
                name="khala"
                value={fixedForm.khala}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Utilities (Gas + Electricity + Water) (৳)
              </label>
              <input
                type="number"
                min="0"
                name="utilities"
                value={fixedForm.utilities}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                WiFi Bill (৳)
              </label>
              <input
                type="number"
                min="0"
                name="wifi"
                value={fixedForm.wifi}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <Save className="h-4 w-4" />
            Save Fixed Expenses
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
