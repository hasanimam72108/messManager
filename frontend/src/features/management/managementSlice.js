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
    getMembers: builder.query({
      query: () => "/manager/members",
      providesTags: (result) => toCollectionTags("Member", result),
    }),
    addMember: builder.mutation({
      query: (body) => ({
        url: "/manager/members",
        method: "POST",
        body,
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
  useGetMembersQuery,
  useAddMemberMutation,
} = managementApiSlice;
