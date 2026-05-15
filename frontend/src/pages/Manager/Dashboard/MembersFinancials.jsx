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

          {/* Members Table */}
          <div className="rounded-2xl border border-slate-100 bg-white/90 p-8 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Member Breakdown for {month}
            </h2>

            {members.length === 0 ? (
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
                        Paid
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
                    {members.map((member, index) => (
                      <tr
                        key={member.id}
                        className={
                          index !== members.length - 1
                            ? "border-b border-slate-100"
                            : ""
                        }
                      >
                        <td className="py-4 px-2 font-medium text-slate-900">
                          {member.name}
                        </td>
                        <td className="py-4 px-2 text-right text-slate-700">
                          ৳{Number(member.totalCost || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-2 text-right font-medium text-emerald-600">
                          ৳{Number(member.paid || 0).toFixed(2)}
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
        </>
      )}
    </div>
  );
};

export default MembersFinancials;
