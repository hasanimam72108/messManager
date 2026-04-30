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
  }),
  overrideExisting: false,
});

export const {
  useGetFixedCostsQuery,
  useGetMonthlyExpenseSummaryQuery,
  useGetManagerDashboardStatsQuery,
  useUpsertFixedCostsMutation,
  useAddExpenseMutation,
} = expensesApiSlice;
