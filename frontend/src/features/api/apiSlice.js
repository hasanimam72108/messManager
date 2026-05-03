import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const backendUrl =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";
const normalizedBackendUrl = backendUrl.replace(/\/$/, "");
const baseUrl = normalizedBackendUrl.endsWith("/api")
  ? normalizedBackendUrl
  : `${normalizedBackendUrl}/api`;

// Enhanced base query with error handling
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    headers.set("Accept", "application/json");

    // Get token from Redux state
    const token = getState().auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  // Enhanced tag types for better cache invalidation
  tagTypes: [
    "User",
    "MessRequest",
    "Manager",
    "Member",
    "FixedCost",
    "Expense",
    "Meal",
    "Transaction",
  ],
  // Optimal cache configuration
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: 300,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
