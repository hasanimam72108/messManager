import { DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useGetMembersFinancialsQuery,
  useRefundMemberExtraMutation,
} from "../../../features/expenses/expensesSlice";

const MembersFinancials = () => {
  const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(getCurrentMonthKey());
  const [refundModal, setRefundModal] = useState({
    isOpen: false,
    memberId: null,
    memberName: "",
    extra: 0,
    amount: "",
    method: "Cash",
  });

  const {
    data: financialsResponse,
    isLoading,
    error,
  } = useGetMembersFinancialsQuery({
    monthKey: month,
  });
  const [refundMemberExtra, { isLoading: isRefundLoading }] =
    useRefundMemberExtraMutation();

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

  const settlementMembers = members
    .map((member) => {
      const paid = Number(member.paid || 0);
      const bill = Number(member.bill ?? member.totalCost ?? 0);
      const extra = Number((paid - bill).toFixed(2));

      return {
        memberId: member.id,
        name: member.name,
        paid,
        bill,
        extra,
        status: extra > 0 ? "Pending Refund" : extra < 0 ? "Due" : "Settled",
      };
    })
    .sort((a, b) => b.extra - a.extra);

  const openRefundModal = (memberRow) => {
    if (Number(memberRow.extra) <= 0) return;

    setRefundModal({
      isOpen: true,
      memberId: memberRow.memberId,
      memberName: memberRow.name,
      extra: Number(memberRow.extra),
      amount: Number(memberRow.extra).toFixed(2),
      method: "Cash",
    });
  };

  const closeRefundModal = () => {
    setRefundModal({
      isOpen: false,
      memberId: null,
      memberName: "",
      extra: 0,
      amount: "",
      method: "Cash",
    });
  };

  const handleRefundSubmit = async (event) => {
    event.preventDefault();

    const parsedAmount = Number(refundModal.amount || 0);

    if (!refundModal.memberId) {
      toast.error("Invalid member selected for refund.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Refund amount must be greater than 0.");
      return;
    }

    if (parsedAmount > Number(refundModal.extra || 0)) {
      toast.error("Refund amount cannot exceed extra paid amount.");
      return;
    }

    try {
      await refundMemberExtra({
        memberId: refundModal.memberId,
        monthKey: month,
        amount: parsedAmount,
        method: refundModal.method,
      }).unwrap();

      toast.success("Refund recorded successfully.");
      closeRefundModal();
    } catch (refundError) {
      toast.error(
        refundError?.data?.message ||
          "Failed to record refund. Please try again.",
      );
    }
  };

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

            <div className="rounded-2xl border border-slate-100 bg-white/90 p-8 shadow-sm backdrop-blur">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Extra Paid / Refund Settlement
              </h2>

              {settlementMembers.length === 0 ? (
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
                          Paid
                        </th>
                        <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900 text-right">
                          Bill
                        </th>
                        <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900 text-right">
                          Extra
                        </th>
                        <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900">
                          Status
                        </th>
                        <th className="py-4 px-2 text-sm font-semibold whitespace-nowrap text-slate-900 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-800">
                      {settlementMembers.map((member, index) => (
                        <tr
                          key={`settlement-${member.memberId}`}
                          className={
                            index !== settlementMembers.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          }
                        >
                          <td className="py-4 px-2 font-medium text-slate-900">
                            {member.name}
                          </td>
                          <td className="py-4 px-2 text-right text-slate-700">
                            ৳{member.paid.toFixed(2)}
                          </td>
                          <td className="py-4 px-2 text-right text-slate-700">
                            ৳{member.bill.toFixed(2)}
                          </td>
                          <td
                            className={`py-4 px-2 text-right font-medium ${
                              member.extra > 0
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }`}
                          >
                            ৳{member.extra.toFixed(2)}
                          </td>
                          <td className="py-4 px-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                member.extra > 0
                                  ? "bg-amber-100 text-amber-700"
                                  : member.extra < 0
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {member.status}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            {member.extra > 0 ? (
                              <button
                                type="button"
                                onClick={() => openRefundModal(member)}
                                className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
                                disabled={isRefundLoading}
                              >
                                Refund
                              </button>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {refundModal.isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Refund Settlement
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Record a manual refund for {refundModal.memberName}.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleRefundSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Refund Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={refundModal.amount}
                  onChange={(event) =>
                    setRefundModal((prev) => ({
                      ...prev,
                      amount: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">
                  Max refundable extra: ৳
                  {Number(refundModal.extra || 0).toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Refund Method
                </label>
                <select
                  value={refundModal.method}
                  onChange={(event) =>
                    setRefundModal((prev) => ({
                      ...prev,
                      method: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeRefundModal}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  disabled={isRefundLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
                  disabled={isRefundLoading}
                >
                  {isRefundLoading ? "Processing..." : "Confirm Refund"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MembersFinancials;
