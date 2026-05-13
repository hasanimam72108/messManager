import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useAddDepositMutation,
  useGetUserBillSummaryQuery,
  useGetUserTransactionsQuery,
} from "../../../features/expenses/expensesSlice";
import useAuth from "../../../hooks/useAuth";

// Payment Modal Component
const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  type,
  onConfirm,
  isLoading,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [mobileBankingProvider, setMobileBankingProvider] = useState("");
  const [mobileBankingNumber, setMobileBankingNumber] = useState("");
  const [mobileBankingPin, setMobileBankingPin] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  const handleConfirm = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    const paymentData = { paymentMethod };

    if (paymentMethod === "hand_cash") {
      // No additional data needed
    } else if (paymentMethod === "mobile_banking") {
      if (!mobileBankingProvider || !mobileBankingNumber || !mobileBankingPin) {
        toast.error("Please fill all mobile banking details");
        return;
      }
      paymentData.mobileBankingProvider = mobileBankingProvider;
      paymentData.mobileBankingNumber = mobileBankingNumber;
      paymentData.mobileBankingPin = mobileBankingPin;
    } else if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvc || !cardHolderName) {
        toast.error("Please fill all card details");
        return;
      }
      if (cardNumber.length !== 16) {
        toast.error("Card number must be 16 digits");
        return;
      }
      paymentData.cardNumber = cardNumber;
      paymentData.cardExpiry = cardExpiry;
      paymentData.cardCvc = cardCvc;
      paymentData.cardHolderName = cardHolderName;
    }

    onConfirm(paymentData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            Select Payment Method
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Amount Display */}
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Amount: {type}</p>
            <p className="text-2xl font-bold text-green-600">
              ৳{Number(amount).toFixed(2)}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Hand Cash */}
            <button
              onClick={() => setPaymentMethod("hand_cash")}
              className={`w-full min-h-36 p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "hand_cash"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <img
                  src="/hand-cash.png"
                  alt="Hand Cash"
                  className="h-10 w-10 object-contain"
                />
                <div className="min-w-0">
                  <p className="text-base font-semibold leading-tight text-gray-900">
                    Hand Cash
                  </p>
                  <p className="mt-1 text-sm leading-snug text-gray-500">
                    Pay with cash
                  </p>
                </div>
              </div>
            </button>

            {/* Mobile Banking */}
            <button
              onClick={() => setPaymentMethod("mobile_banking")}
              className={`w-full min-h-36 p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "mobile_banking"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <img
                  src="/mobile-banking.png"
                  alt="Mobile Banking"
                  className="h-10 w-10 object-contain"
                />
                <div className="min-w-0">
                  <p className="text-base font-semibold leading-tight text-gray-900">
                    Mobile Banking
                  </p>
                  <p className="mt-1 text-sm leading-snug text-gray-500">
                    Bkash, Nagad, Rocket
                  </p>
                </div>
              </div>
            </button>

            {/* Card Payment */}
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full min-h-36 p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "card"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <img
                  src="/card-payment.png"
                  alt="Card Payment"
                  className="h-10 w-10 object-contain"
                />
                <div className="min-w-0">
                  <p className="text-base font-semibold leading-tight text-gray-900">
                    Card Payment
                  </p>
                  <p className="mt-1 text-sm leading-snug text-gray-500">
                    Credit/Debit card
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Payment Details Input */}
          {paymentMethod === "mobile_banking" && (
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
                      onClick={() => setMobileBankingProvider(provider.value)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 px-3 py-3 transition-all ${
                        mobileBankingProvider === provider.value
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
                  type="text"
                  value={mobileBankingNumber}
                  onChange={(e) => setMobileBankingNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN
                </label>
                <input
                  type="password"
                  value={mobileBankingPin}
                  onChange={(e) => setMobileBankingPin(e.target.value)}
                  placeholder="Enter PIN"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number (16 digits)
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 16),
                    )
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
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length >= 2) {
                        val = val.slice(0, 2) + "/" + val.slice(2, 4);
                      }
                      setCardExpiry(val);
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
                    value={cardCvc}
                    onChange={(e) =>
                      setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
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
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Balance Component
const Balance = () => {
  const { user } = useAuth();
  const [mealExpenseAmount, setMealExpenseAmount] = useState("");
  const [fixedExpenseAmount, setFixedExpenseAmount] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(null);

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

  const handleAddExpenseClick = (event, amount, type, resetAmount) => {
    event.preventDefault();
    if (!amount || !user?.id) {
      toast.error("Please enter an amount");
      return;
    }
    setPendingPayment({ amount, type, resetAmount });
    setPaymentModalOpen(true);
  };

  const handlePaymentConfirm = async (paymentData) => {
    if (!pendingPayment) return;

    const { amount, type, resetAmount } = pendingPayment;

    try {
      const response = await addDeposit({
        amount: Number(amount),
        type,
        ...paymentData,
      }).unwrap();
      toast.success(response?.message || "Request sent for manager approval.");
      resetAmount("");
      setPaymentModalOpen(false);
      setPendingPayment(null);
    } catch (error) {
      toast.error(error?.data?.message || `${type} save failed.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setPendingPayment(null);
        }}
        amount={pendingPayment?.amount}
        type={pendingPayment?.type}
        onConfirm={handlePaymentConfirm}
        isLoading={isLoading}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Balance</h1>
        <p className="text-gray-500">
          Manage your account balance and transactions
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Total Deposit
        </h2>
        <p className="text-gray-500 text-sm mb-4">Your available balance</p>
        <div className="text-4xl font-bold text-[#16a34a]">
          ৳{Number(stats.currentBalance || 0).toFixed(2)}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Meals Expense
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Add meal-related deposit amount
          </p>

          <form
            onSubmit={(event) =>
              handleAddExpenseClick(
                event,
                mealExpenseAmount,
                "Meals Expense",
                setMealExpenseAmount,
              )
            }
          >
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  value={mealExpenseAmount}
                  onChange={(e) => setMealExpenseAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#16a34a] text-white font-medium rounded-xl hover:bg-green-700 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Add Meals Expense"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Fixed Expense
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Add fixed-cost deposit amount
          </p>

          <form
            onSubmit={(event) =>
              handleAddExpenseClick(
                event,
                fixedExpenseAmount,
                "Fixed Expense",
                setFixedExpenseAmount,
              )
            }
          >
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  value={fixedExpenseAmount}
                  onChange={(e) => setFixedExpenseAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#16a34a] text-white font-medium rounded-xl hover:bg-green-700 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Add Fixed Expense"}
              </button>
            </div>
          </form>
        </div>
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
                  Deposit
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
