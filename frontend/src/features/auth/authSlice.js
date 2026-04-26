import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

// RTK Query endpoints for auth
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getProfile: builder.query({
      query: () => "/profile",
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

// Get initial state from localStorage safely
const getInitialState = () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const isValidSession = !!token && !!parsedUser;

    if (!isValidSession) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return {
      user: isValidSession ? parsedUser : null,
      token: isValidSession ? token : null,
      isAuthenticated: isValidSession,
    };
  } catch {
    // Clear corrupted data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Save to localStorage only here - centralized location
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    // Initialize auth from localStorage on app start
    initializeAuth: (state) => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
          state.token = token;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        } else {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      } catch {
        // Clear corrupted data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    updateAuthenticatedUser: (state, action) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

// Export hooks
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = authApiSlice;

// Export actions
export const {
  loginSuccess,
  logoutSuccess,
  initializeAuth,
  updateAuthenticatedUser,
} = authSlice.actions;

export default authSlice.reducer;
