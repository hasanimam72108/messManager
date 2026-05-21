import {
  Banknote,
  CreditCard,
  DollarSign,
  HandCoins,
  Smartphone,
  X,
} from "lucide-react";
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
    paymentMethod: null,
    mobileBankingProvider: "",
    mobileBankingNumber: "",
    mobileBankingPin: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardHolderName: "",
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

  const formatMoney = (value) => {
    const rounded = Number(Number(value || 0).toFixed(2));
    return (Object.is(rounded, -0) ? 0 : rounded).toFixed(2);
  };

  const getRoundedMoney = (value) => {
    const rounded = Number(Number(value || 0).toFixed(2));
    return Object.is(rounded, -0) ? 0 : rounded;
  };

  const refundGatewayOptions = [
    {
      value: "Cash",
      paymentMethod: "hand_cash",
      title: "Hand Cash",
      description: "Refund directly in cash",
      icon: HandCoins,
      image: "/hand-cash.png",
      iconClass: "text-emerald-500",
    },
    {
      value: "Bkash",
      paymentMethod: "mobile_banking",
      title: "Mobile Banking",
      description: "Bkash, Nagad, Rocket",
      icon: Smartphone,
      image: "/mobile-banking.png",
      iconClass: "text-sky-500",
    },
    {
      value: "Bank",
      paymentMethod: "card",
      title: "Card / Bank",
      description: "Bank transfer or card settlement",
      icon: CreditCard,
      image: "/card-payment.png",
      iconClass: "text-rose-500",
    },
  ];

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
      paymentMethod: null,
      mobileBankingProvider: "",
      mobileBankingNumber: "",
      mobileBankingPin: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      cardHolderName: "",
    });
  };

  const closeRefundModal = () => {
    setRefundModal({
      isOpen: false,
      memberId: null,
      memberName: "",
      extra: 0,
      amount: "",
      paymentMethod: null,
      mobileBankingProvider: "",
      mobileBankingNumber: "",
      mobileBankingPin: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      cardHolderName: "",
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

    if (!refundModal.paymentMethod) {
      toast.error("Please select a refund gateway");
      return;
    }

    if (
      refundModal.paymentMethod === "mobile_banking" &&
      (!refundModal.mobileBankingProvider ||
        !refundModal.mobileBankingNumber ||
        !refundModal.mobileBankingPin)
    ) {
      toast.error("Please fill all mobile banking details");
      return;
    }

    if (refundModal.paymentMethod === "card") {
      if (
        !refundModal.cardNumber ||
        !refundModal.cardExpiry ||
        !refundModal.cardCvc ||
        !refundModal.cardHolderName
      ) {
        toast.error("Please fill all card details");
        return;
      }

      if (String(refundModal.cardNumber).length !== 16) {
        toast.error("Card number must be 16 digits");
        return;
      }
    }

    try {
      await refundMemberExtra({
        memberId: refundModal.memberId,
        monthKey: month,
        amount: parsedAmount,
        method:
          refundModal.paymentMethod === "hand_cash"
            ? "Cash"
            : refundModal.paymentMethod === "mobile_banking"
              ? "Bkash"
              : "Bank",
        paymentMethod: refundModal.paymentMethod,
        mobileBankingProvider: refundModal.mobileBankingProvider,
        mobileBankingNumber: refundModal.mobileBankingNumber,
        mobileBankingPin: refundModal.mobileBankingPin,
        cardNumber: refundModal.cardNumber,
        cardExpiry: refundModal.cardExpiry,
        cardCvc: refundModal.cardCvc,
        cardHolderName: refundModal.cardHolderName,
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
                      getRoundedMoney(member.balance) >= 0
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    ৳{formatMoney(member.balance)}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <CreditCard className="h-5 w-5 text-emerald-500" />
                Select Refund Method
              </h3>
              <button
                onClick={closeRefundModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRefundSubmit}>
              <div className="p-6 space-y-4">
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-sm text-gray-600">
                    Amount: {refundModal.memberName}
                  </p>
                  <p className="flex items-center gap-2 text-2xl font-bold text-emerald-600">
                    <Banknote className="h-5 w-5" />৳
                    {Number(refundModal.amount || 0).toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {refundGatewayOptions.map((option) => {
                    const isSelected =
                      refundModal.paymentMethod === option.paymentMethod;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setRefundModal((prev) => ({
                            ...prev,
                            paymentMethod: option.paymentMethod,
                          }))
                        }
                        className={`w-full min-h-36 p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                          <img
                            src={option.image}
                            alt={option.title}
                            className="h-10 w-10 object-contain"
                          />
                          <div className="min-w-0">
                            <p className="flex items-center justify-center gap-2 text-base font-semibold leading-tight text-gray-900">
                              <option.icon
                                className={`h-4 w-4 ${option.iconClass}`}
                              />
                              {option.title}
                            </p>
                            <p className="mt-1 text-sm leading-snug text-gray-500">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {refundModal.paymentMethod === "mobile_banking" && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provider
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            value: "bkash",
                            name: "Bkash",
                            logo: "/Bkash-Logo.png",
                          },
                          {
                            value: "nagad",
                            name: "Nagad",
                            logo: "/Nagad-Logo.png",
                          },
                          {
                            value: "rocket",
                            name: "Rocket",
                            logo: "/Rocket-Logo.png",
                          },
                        ].map((provider) => (
                          <button
                            key={provider.value}
                            type="button"
                            onClick={() =>
                              setRefundModal((prev) => ({
                                ...prev,
                                mobileBankingProvider: provider.value,
                              }))
                            }
                            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 px-3 py-3 transition-all ${
                              refundModal.mobileBankingProvider ===
                              provider.value
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={provider.logo}
                              alt={provider.name}
                              className="h-8 w-auto object-contain"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {provider.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="refundMobileBankingNumber"
                        autoComplete="tel"
                        inputMode="numeric"
                        pattern="01[0-9]{9}"
                        maxLength="11"
                        placeholder="01XXXXXXXXX"
                        value={refundModal.mobileBankingNumber}
                        onChange={(e) =>
                          setRefundModal((prev) => ({
                            ...prev,
                            mobileBankingNumber: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN
                      </label>
                      <input
                        type="password"
                        name="refundMobileBankingPin"
                        autoComplete="new-password"
                        value={refundModal.mobileBankingPin}
                        onChange={(e) =>
                          setRefundModal((prev) => ({
                            ...prev,
                            mobileBankingPin: e.target.value,
                          }))
                        }
                        placeholder="Enter PIN"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                )}

                {refundModal.paymentMethod === "card" && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number (16 digits)
                      </label>
                      <input
                        type="text"
                        value={refundModal.cardNumber}
                        onChange={(e) =>
                          setRefundModal((prev) => ({
                            ...prev,
                            cardNumber: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 16),
                          }))
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength="16"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={refundModal.cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            if (val.length >= 2) {
                              val = val.slice(0, 2) + "/" + val.slice(2, 4);
                            }
                            setRefundModal((prev) => ({
                              ...prev,
                              cardExpiry: val,
                            }));
                          }}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={refundModal.cardCvc}
                          onChange={(e) =>
                            setRefundModal((prev) => ({
                              ...prev,
                              cardCvc: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 3),
                            }))
                          }
                          placeholder="123"
                          maxLength="3"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={refundModal.cardHolderName}
                        onChange={(e) =>
                          setRefundModal((prev) => ({
                            ...prev,
                            cardHolderName: e.target.value,
                          }))
                        }
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeRefundModal}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRefundLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
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
