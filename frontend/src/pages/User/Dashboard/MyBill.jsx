import { CalendarDays, Coins, ReceiptText } from "lucide-react";
import { useGetUserBillSummaryQuery } from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

const MyBill = () => {
  const { user } = useAuth();
  const monthKey = new Date().toISOString().slice(0, 7);
  const { data: billResponse } = useGetUserBillSummaryQuery(
    { monthKey },
    { skip: !user?.id },
  );

  const stats = billResponse?.data ?? {
    monthKey,
    totalMeals: 0,
    costPerMeal: 0,
    mealSubtotal: 0,
    fixedShareTotal: 0,
    shareBreakdown: {
      rentShare: 0,
      khalaShare: 0,
      utilitiesShare: 0,
      wifiShare: 0,
    },
    totalBill: 0,
    paidAmount: 0,
    currentBalance: 0,
    dueAmount: 0,
    mealBreakdown: { lunch: 0, dinner: 0, off: 0 },
  };
  const breakdown = stats.mealBreakdown;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="rounded-3xl border border-rose-100 bg-linear-to-r from-rose-50 via-white to-amber-50 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-600">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bill</h1>
            <p className="text-gray-500">View your monthly bill details</p>
          </div>
        </div>
      </div>

      <div className="bg-white/90 rounded-2xl shadow-sm border border-rose-100 p-6">
        <div className="mb-6 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-rose-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Bill Overview - {stats.monthKey || "Current Month"}
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-8">
          Your complete billing information for this month
        </p>

        <div className="space-y-2 text-sm sm:text-base mb-8">
          <div className="flex justify-between items-center py-4 border-b border-gray-50 flex-wrap gap-2">
            <span className="text-gray-600">Total Bill</span>
            <span className="font-bold text-gray-900 text-lg">
              ৳{Number(stats.totalBill || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-50 flex-wrap gap-2">
            <span className="text-gray-600">Paid Amount</span>
            <span className="font-medium text-[#16a34a]">
              ৳{Number(stats.paidAmount || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center py-4 flex-wrap gap-2">
            <span className="text-gray-600">Remaining Due</span>
            <span className="font-bold text-[#ea580c] text-lg">
              ৳{Number(stats.dueAmount || 0).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-emerald-100 bg-emerald-50/30 rounded-xl p-4">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
              <Coins className="h-4 w-4 text-emerald-500" />
              Meal Expense Summary
            </h3>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between items-center py-3 border-b border-gray-50 flex-wrap gap-2">
                <span className="text-gray-600">Total Meals Consumed</span>
                <span className="font-medium text-gray-900">
                  {stats.totalMeals} meals
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50 flex-wrap gap-2">
                <span className="text-gray-600">Cost Per Meal</span>
                <span className="font-medium text-gray-900">
                  ৳{Number(stats.costPerMeal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 flex-wrap gap-2">
                <span className="text-gray-600">Meal Subtotal</span>
                <span className="font-medium text-gray-900">
                  ৳{Number(stats.mealSubtotal || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-sky-100 bg-sky-50/30 rounded-xl p-4">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
              <ReceiptText className="h-4 w-4 text-sky-500" />
              Fixed Expense Summary
            </h3>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between items-center py-3 border-b border-gray-50 flex-wrap gap-2">
                <span className="text-gray-600">Fixed Bill Total</span>
                <span className="font-medium text-gray-900">
                  ৳{Number(stats.fixedShareTotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50 flex-wrap gap-2">
                <span className="text-gray-600">Rent Bill</span>
                <span className="font-medium text-gray-900">
                  ৳{Number(stats.shareBreakdown?.rentShare || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50 flex-wrap gap-2">
                <span className="text-gray-600">Khala Bill</span>
                <span className="font-medium text-gray-900">
                  ৳{Number(stats.shareBreakdown?.khalaShare || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50 flex-wrap gap-2">
                <span className="text-gray-600">Utilities Bill</span>
                <span className="font-medium text-gray-900">
                  ৳
                  {Number(stats.shareBreakdown?.utilitiesShare || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 flex-wrap gap-2">
                <span className="text-gray-600">WiFi Bill</span>
                <span className="font-medium text-gray-900">
                  ৳{Number(stats.shareBreakdown?.wifiShare || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/90 rounded-2xl shadow-sm border border-sky-100 p-6">
        <div className="mb-6 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-sky-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Meal Breakdown
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">Existing meal system </p>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
            <span className="text-gray-600">Lunch Meals</span>
            <span className="font-semibold text-gray-900">
              {breakdown?.lunch || 0}
            </span>
          </div>
          <div className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
            <span className="text-gray-600">Dinner Meals</span>
            <span className="font-semibold text-gray-900">
              {breakdown?.dinner || 0}
            </span>
          </div>
          <div className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
            <span className="text-gray-600">Off Days</span>
            <span className="font-semibold text-gray-900">
              {breakdown?.off || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBill;
