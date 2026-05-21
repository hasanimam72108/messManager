import { apiSlice } from "../api/apiSlice";

const getMonthKeysInRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return [new Date().toISOString().slice(0, 7)];
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    return [String(startDate).slice(0, 7)];
  }

  const monthKeys = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMarker = new Date(end.getFullYear(), end.getMonth(), 1);

  while (cursor <= endMarker) {
    monthKeys.push(
      `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`,
    );
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return monthKeys;
};

export const expensesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFixedCosts: builder.query({
      query: ({ monthKey } = {}) =>
        monthKey
          ? `/manager/fixed-costs?monthKey=${encodeURIComponent(monthKey)}`
          : "/manager/fixed-costs",
      providesTags: (result, error, arg) => [
        { type: "FixedCost", id: arg?.monthKey || "CURRENT" },
      ],
    }),
    getMonthlyExpenseSummary: builder.query({
      query: ({ monthKey } = {}) =>
        monthKey
          ? `/manager/expenses/summary?monthKey=${encodeURIComponent(monthKey)}`
          : "/manager/expenses/summary",
      providesTags: (result, error, arg) => [
        { type: "Expense", id: `SUMMARY-${arg?.monthKey || "CURRENT"}` },
      ],
    }),
    getExpensesList: builder.query({
      query: ({ monthKey } = {}) =>
        monthKey
          ? `/manager/expenses/list?monthKey=${encodeURIComponent(monthKey)}`
          : "/manager/expenses/list",
      providesTags: (result, error, arg) => [
        { type: "Expense", id: `LIST-${arg?.monthKey || "CURRENT"}` },
      ],
    }),
    getManagerDashboardStats: builder.query({
      query: ({ monthKey } = {}) =>
        monthKey
          ? `/manager/dashboard/stats?monthKey=${encodeURIComponent(monthKey)}`
          : "/manager/dashboard/stats",
      providesTags: (result, error, arg) => [
        { type: "Dashboard", id: arg?.monthKey || "CURRENT" },
        { type: "FixedCost", id: arg?.monthKey || "CURRENT" },
        { type: "Expense", id: `SUMMARY-${arg?.monthKey || "CURRENT"}` },
      ],
    }),
    getManagerDailyMeals: builder.query({
      query: ({ monthKey } = {}) =>
        monthKey
          ? `/manager/meals/daily?monthKey=${encodeURIComponent(monthKey)}`
          : "/manager/meals/daily",
      providesTags: (result, error, arg) => [
        { type: "Meal", id: `MANAGER-DAILY-${arg?.monthKey || "CURRENT"}` },
      ],
    }),
    getUserDashboardStats: builder.query({
      query: ({ monthKey } = {}) =>
        monthKey
          ? `/user/dashboard/stats?monthKey=${encodeURIComponent(monthKey)}`
          : "/user/dashboard/stats",
      providesTags: (result, error, arg) => [
        { type: "Expense", id: `USER-DASHBOARD-${arg?.monthKey || "CURRENT"}` },
      ],
    }),
    getUserMeals: builder.query({
      query: ({ monthKey } = {}) =>
        monthKey
          ? `/user/meals?monthKey=${encodeURIComponent(monthKey)}`
          : "/user/meals",
      providesTags: (result, error, arg) => [
        { type: "Meal", id: `USER-MEALS-${arg?.monthKey || "CURRENT"}` },
      ],
    }),
    getUserBillSummary: builder.query({
      query: ({ monthKey } = {}) =>
        monthKey
          ? `/user/bill/summary?monthKey=${encodeURIComponent(monthKey)}`
          : "/user/bill/summary",
      providesTags: (result, error, arg) => [
        { type: "Expense", id: `USER-BILL-${arg?.monthKey || "CURRENT"}` },
        { type: "Meal", id: `USER-BILL-${arg?.monthKey || "CURRENT"}` },
      ],
    }),
    getUserTransactions: builder.query({
      query: () => "/user/transactions",
      providesTags: (result) => [
        { type: "Transaction", id: "LIST" },
        ...(Array.isArray(result?.data)
          ? result.data.map(({ id }) => ({ type: "Transaction", id }))
          : []),
      ],
    }),
    getMembersFinancials: builder.query({
      query: ({ monthKey } = {}) =>
        monthKey
          ? `/manager/financials/members?monthKey=${encodeURIComponent(monthKey)}`
          : "/manager/financials/members",
      providesTags: (result, error, arg) => [
        { type: "Financials", id: `MEMBERS-${arg?.monthKey || "CURRENT"}` },
      ],
    }),
    refundMemberExtra: builder.mutation({
      query: ({ memberId, monthKey, amount, method }) => ({
        url: `/manager/financials/members/${memberId}/refund`,
        method: "POST",
        body: { monthKey, amount, method },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Financials", id: `MEMBERS-${arg?.monthKey || "CURRENT"}` },
        { type: "Transaction", id: "LIST" },
      ],
    }),
    upsertFixedCosts: builder.mutation({
      query: (body) => ({
        url: "/manager/fixed-costs",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Dashboard", id: arg?.monthKey || "CURRENT" },
        { type: "FixedCost", id: arg?.monthKey || "CURRENT" },
      ],
    }),
    addExpense: builder.mutation({
      query: (body) => ({
        url: "/manager/expenses",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => {
        const monthKey = String(
          arg?.date || new Date().toISOString().split("T")[0],
        ).slice(0, 7);

        return [
          { type: "Dashboard", id: monthKey },
          { type: "Expense", id: "LIST" },
          { type: "Expense", id: `SUMMARY-${monthKey}` },
        ];
      },
    }),
    addMeal: builder.mutation({
      query: (body) => ({
        url: "/user/meals",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => {
        const monthKey = String(
          arg?.date || new Date().toISOString().split("T")[0],
        ).slice(0, 7);

        return [
          { type: "Dashboard", id: monthKey },
          { type: "Meal", id: `USER-MEALS-${monthKey}` },
        ];
      },
    }),
    addMealsBulk: builder.mutation({
      query: (body) => ({
        url: "/user/meals/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => {
        const monthKeys = getMonthKeysInRange(arg?.fromDate, arg?.toDate);

        return monthKeys.flatMap((monthKey) => [
          { type: "Dashboard", id: monthKey },
          { type: "Meal", id: `USER-MEALS-${monthKey}` },
          { type: "Expense", id: `USER-BILL-${monthKey}` },
        ]);
      },
    }),
    deleteUserMealEntries: builder.mutation({
      query: ({ date, mealType }) => ({
        url: `/user/meals?date=${encodeURIComponent(date)}&mealType=${encodeURIComponent(mealType)}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => {
        const monthKey = String(
          arg?.date || new Date().toISOString().split("T")[0],
        ).slice(0, 7);

        return [
          { type: "Dashboard", id: monthKey },
          { type: "Meal", id: `USER-MEALS-${monthKey}` },
          { type: "Expense", id: `USER-BILL-${monthKey}` },
        ];
      },
    }),
    addDeposit: builder.mutation({
      query: (body) => ({
        url: "/user/transactions",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => {
        const monthKey = String(
          arg?.date || new Date().toISOString().split("T")[0],
        ).slice(0, 7);

        return [
          { type: "Dashboard", id: monthKey },
          { type: "Transaction", id: "LIST" },
        ];
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFixedCostsQuery,
  useGetMonthlyExpenseSummaryQuery,
  useGetExpensesListQuery,
  useGetManagerDashboardStatsQuery,
  useGetManagerDailyMealsQuery,
  useGetUserDashboardStatsQuery,
  useGetUserMealsQuery,
  useGetUserBillSummaryQuery,
  useGetUserTransactionsQuery,
  useGetMembersFinancialsQuery,
  useRefundMemberExtraMutation,
  useUpsertFixedCostsMutation,
  useAddExpenseMutation,
  useAddMealMutation,
  useAddMealsBulkMutation,
  useDeleteUserMealEntriesMutation,
  useAddDepositMutation,
} = expensesApiSlice;
