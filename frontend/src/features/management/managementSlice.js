import { apiSlice } from "../api/apiSlice";

const toCollectionTags = (type, result) => {
  const records = result?.data || [];

  if (!Array.isArray(records)) {
    return [{ type, id: "LIST" }];
  }

  return [...records.map(({ id }) => ({ type, id })), { type, id: "LIST" }];
};

export const managementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessRequests: builder.query({
      query: (status) =>
        status
          ? `/admin/mess-requests?status=${encodeURIComponent(status)}`
          : "/admin/mess-requests",
      providesTags: (result) => toCollectionTags("MessRequest", result),
    }),
    approveMessRequest: builder.mutation({
      query: (messRequestId) => ({
        url: `/admin/mess-requests/${messRequestId}/approve`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "MessRequest", id: "LIST" },
        { type: "Manager", id: "LIST" },
      ],
    }),
    rejectMessRequest: builder.mutation({
      query: (messRequestId) => ({
        url: `/admin/mess-requests/${messRequestId}/reject`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "MessRequest", id: "LIST" }],
    }),
    getManagers: builder.query({
      query: () => "/admin/managers",
      providesTags: (result) => toCollectionTags("Manager", result),
    }),
    getSystemReport: builder.query({
      query: () => "/admin/system-report",
      providesTags: [{ type: "SystemReport", id: "MAIN" }],
    }),
    getMessesWithDetails: builder.query({
      query: () => "/admin/messes-with-details",
      providesTags: (result) => toCollectionTags("Mess", result),
    }),
    toggleMessStatusAsAdmin: builder.mutation({
      query: (messId) => ({
        url: `/admin/messes/${messId}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Mess", id: "LIST" },
        { type: "Manager", id: "LIST" },
        { type: "SystemReport", id: "MAIN" },
      ],
    }),
    toggleManagerStatusAsAdmin: builder.mutation({
      query: (managerId) => ({
        url: `/admin/managers/${managerId}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Manager", id: "LIST" },
        { type: "SystemReport", id: "MAIN" },
        { type: "Mess", id: "LIST" },
      ],
    }),
    getManagerMess: builder.query({
      query: () => "/manager/mess",
      providesTags: [{ type: "Mess", id: "CURRENT" }],
    }),
    updateManagerMess: builder.mutation({
      query: (body) => ({
        url: "/manager/mess",
        method: "PUT",
        body,
      }),
      invalidatesTags: [
        { type: "Mess", id: "CURRENT" },
        { type: "Mess", id: "LIST" },
      ],
    }),
    deleteManagerMess: builder.mutation({
      query: () => ({
        url: "/manager/mess",
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Mess", id: "CURRENT" },
        { type: "Mess", id: "LIST" },
        { type: "SystemReport", id: "MAIN" },
      ],
    }),
    getMembers: builder.query({
      query: () => "/manager/members",
      providesTags: (result) => toCollectionTags("Member", result),
    }),
    getPendingDepositRequests: builder.query({
      query: () => "/manager/deposit-requests",
      providesTags: (result) => toCollectionTags("PendingDeposit", result),
    }),
    approvePendingDepositRequest: builder.mutation({
      query: (id) => ({
        url: `/manager/deposit-requests/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "PendingDeposit", id: "LIST" },
        { type: "Member", id: "LIST" },
        { type: "Transaction", id: "LIST" },
      ],
    }),
    addMember: builder.mutation({
      query: (body) => ({
        url: "/manager/members",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Member", id: "LIST" }],
    }),
    updateMember: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/manager/members/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Member", id: "LIST" }],
    }),
    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/manager/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Member", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMessRequestsQuery,
  useApproveMessRequestMutation,
  useRejectMessRequestMutation,
  useGetManagersQuery,
  useGetSystemReportQuery,
  useGetMessesWithDetailsQuery,
  useToggleMessStatusAsAdminMutation,
  useToggleManagerStatusAsAdminMutation,
  useGetManagerMessQuery,
  useUpdateManagerMessMutation,
  useDeleteManagerMessMutation,
  useGetMembersQuery,
  useGetPendingDepositRequestsQuery,
  useApprovePendingDepositRequestMutation,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = managementApiSlice;
