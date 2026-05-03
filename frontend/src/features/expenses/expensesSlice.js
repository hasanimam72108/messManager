import { apiSlice } from "../api/apiSlice";

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
    getManagerDashboardStats: builder.query({
      query: ({ monthKey } = {}) =>
        monthKey
          ? `/manager/dashboard/stats?monthKey=${encodeURIComponent(monthKey)}`
          : "/manager/dashboard/stats",
      providesTags: (result, error, arg) => [
        { type: "FixedCost", id: arg?.monthKey || "CURRENT" },
        { type: "Expense", id: `SUMMARY-${arg?.monthKey || "CURRENT"}` },
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
    upsertFixedCosts: builder.mutation({
      query: (body) => ({
        url: "/manager/fixed-costs",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
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

        return [{ type: "Meal", id: `USER-MEALS-${monthKey}` }];
      },
    }),
    addDeposit: builder.mutation({
      query: (body) => ({
        url: "/user/transactions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Transaction", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFixedCostsQuery,
  useGetMonthlyExpenseSummaryQuery,
  useGetManagerDashboardStatsQuery,
  useGetUserDashboardStatsQuery,
  useGetUserMealsQuery,
  useGetUserBillSummaryQuery,
  useGetUserTransactionsQuery,
  useUpsertFixedCostsMutation,
  useAddExpenseMutation,
  useAddMealMutation,
  useAddDepositMutation,
} = expensesApiSlice;
