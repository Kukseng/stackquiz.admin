
import { RegisterRequest, RegisterResponse, LoginResponse, LoginRequest } from "./types/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Logout (optional)
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User", "UserQuizzes"],
    }),
  }),
});

export const { 
  useRegisterMutation, 
  useLoginMutation,
  useLogoutMutation 
} = authApi;