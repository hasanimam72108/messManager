import { DollarSign } from "lucide-react";
import { useState } from "react";
import { useGetMembersFinancialsQuery } from "../../../features/expenses/expensesSlice";

const MembersFinancials = () => {
  const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(getCurrentMonthKey());

  const {
    data: financialsResponse,
    isLoading,
    error,
  } = useGetMembersFinancialsQuery({
    monthKey: month,
  });

  const financialsData = financialsResponse?.data || {};
  const members = financialsData.members || [];
  const totals = financialsData.totals || { cost: 0, paid: 0, due: 0 };
  const fixedCostPerPerson = Number(financialsData.fixedCostPerPerson || 0);

  const mealMembers = members.map((member) => {
    const mealTotalCost = Math.max(
      0,
      Number(member.totalCost || 0) - fixedCostPerPerson,
    );
    const paidAmount = Number(member.paidMeal || 0);

    return {
      id: `${member.id}-meal`,
      name: member.name,
      totalCost: mealTotalCost,
      paidAmount,
      balance: paidAmount - mealTotalCost,
      due: Math.max(0, mealTotalCost - paidAmount),
      lastPayment: member.lastPayment,
    };
  });

  const fixedMembers = members.map((member) => {
    const paidAmount = Number(member.paidFixed || 0);

    return {
      id: `${member.id}-fixed`,
      name: member.name,
      totalCost: fixedCostPerPerson,
      paidAmount,
      balance: paidAmount - fixedCostPerPerson,
      due: Math.max(0, fixedCostPerPerson - paidAmount),
      lastPayment: member.lastPayment,
    };
  });

  const renderMemberTable = (title, rows, accentClass) => (
    <div className="rounded-2xl border border-slate-100 bg-white/90 p-8 shadow-sm backdrop-blur">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">{title}</h2>

      {rows.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500">
            No member data available for this month.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Member
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900 text-right">
                  Total Cost
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900 text-right">
                  Paid Amount
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900 text-right">
                  Balance
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900 text-right">
                  Due
                </th>
                <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                  Last Payment
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-800">
              {rows.map((member, index) => (
                <tr
                  key={member.id}
                  className={
                    index !== rows.length - 1 ? "border-b border-slate-100" : ""
                  }
                >
                  <td className="py-4 px-2 font-medium text-slate-900">
                    {member.name}
                  </td>
                  <td className="py-4 px-2 text-right text-slate-700">
                    ৳{Number(member.totalCost || 0).toFixed(2)}
                  </td>
                  <td
                    className={`py-4 px-2 text-right font-medium ${accentClass}`}
                  >
                    ৳{Number(member.paidAmount || 0).toFixed(2)}
                  </td>
                  <td
                    className={`py-4 px-2 text-right font-medium ${
                      Number(member.balance || 0) >= 0
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    ৳{Number(member.balance || 0).toFixed(2)}
                  </td>
                  <td className="py-4 px-2 text-right font-medium text-rose-600">
                    ৳{Number(member.due || 0).toFixed(2)}
                  </td>
                  <td className="py-4 px-2 text-slate-600">
                    {member.lastPayment
                      ? new Date(member.lastPayment).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="mx-auto max-w-6xl rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <p className="text-rose-700 font-semibold">
          Error Loading Members Financials
        </p>
        <p className="text-rose-600 mt-2">
          {error?.data?.message ||
            "Failed to load members financials. Please refresh the page."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-3xl bg-linear-to-br from-emerald-50 via-white to-blue-50 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 shadow-sm">
          <DollarSign className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Members Financials
          </h1>
          <p className="mt-1 text-slate-500">
            View total costs, payments, and dues for each member by month
          </p>
        </div>
      </div>

      {/* Month Selector */}
      <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Month
        </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled={isLoading}
        />
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-100 bg-white/90 p-8 shadow-sm backdrop-blur text-center">
          <p className="text-slate-500">Loading financials data...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 shadow-sm">
              <p className="text-sm text-emerald-600 font-medium mb-2">
                Total Cost
              </p>
              <p className="text-3xl font-bold text-emerald-900">
                ৳{Number(totals.cost || 0).toFixed(2)}
              </p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-6 shadow-sm">
              <p className="text-sm text-sky-600 font-medium mb-2">
                Total Paid
              </p>
              <p className="text-3xl font-bold text-sky-900">
                ৳{Number(totals.paid || 0).toFixed(2)}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-6 shadow-sm">
              <p className="text-sm text-rose-600 font-medium mb-2">
                Total Due
              </p>
              <p className="text-3xl font-bold text-rose-900">
                ৳{Number(totals.due || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Members Tables */}
          <div className="space-y-6">
            {renderMemberTable(
              `Meal Breakdown for ${month}`,
              mealMembers,
              "text-emerald-600",
            )}
            {renderMemberTable(
              `Fixed Breakdown for ${month}`,
              fixedMembers,
              "text-sky-600",
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MembersFinancials;
