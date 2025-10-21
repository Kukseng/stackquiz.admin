// ============================================================
// API Services - src/services/adminApi.ts
// ============================================================

import { baseApi } from "../lib/api/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================================
    // User endpoints
    // ============================================================
    getAllUsers: builder.query<any, void>({
      query: () => "users",
      providesTags: ["User"],
    }),
    
    getCurrentUser: builder.query<any, void>({
      query: () => "users/me",
      providesTags: ["User"],
    }),

    updateCurrentUser: builder.mutation<any, any>({
      query: (data) => ({
        url: "users/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<any, { userId: string; data: any }>({
      query: ({ userId, data }) => ({
        url: `users/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation<any, string>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // ============================================================
    // Quiz endpoints
    // ============================================================
    getAllQuizzes: builder.query<any, void>({
      query: () => "quizzes",
      providesTags: ["Quiz"],
    }),

    getUserQuizzes: builder.query<any, void>({
      query: () => "quizzes/users/me",
      providesTags: ["Quiz"],
    }),

    suspendQuiz: builder.mutation<any, { quizId: string; data: any }>({
      query: ({ quizId, data }) => ({
        url: `quizzes/admin/${quizId}/suspends`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quiz"],
    }),

    // ============================================================
    // Analytics endpoints
    // ============================================================
    getUserActivity: builder.query<any, string | void>({
      query: (timeRange) =>
        timeRange ? `analytics/activity/${timeRange}` : "analytics/activity",
      providesTags: ["User"],
    }),

    // ============================================================
    // Reports endpoints
    // ============================================================
    getQuizReports: builder.query<any, string>({
      query: (quizId) => `quiz-reports/quizzes/${quizId}`,
      providesTags: ["Quiz"],
    }),

    getMyReports: builder.query<any, void>({
      query: () => "quiz-reports/me",
      providesTags: ["Quiz"],
    }),

    // ============================================================
    // Feedback endpoints
    // ============================================================
    getAllFeedback: builder.query<any, void>({
      query: () => "quizzes/feedback",
      providesTags: ["Quiz"],
    }),

    getMyFeedback: builder.query<any, void>({
      query: () => "quizzes/feedback/me",
      providesTags: ["Quiz"],
    }),

    // ============================================================
    // Categories
    // ============================================================
    getCategories: builder.query<any, void>({
      query: () => "categories",
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation<any, { name: string; description?: string }>({
      query: (data) => ({
        url: "categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // ============================================================
    // Sessions
    // ============================================================
    getMySessions: builder.query<any, void>({
      query: () => "quiz-sessions/me",
      providesTags: ["Session"],
    }),

    // ============================================================
    // Media upload endpoint - Fixed to use FormData
    // ============================================================
    uploadSingleMedia: builder.mutation<{ uri: string; [key: string]: any }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "medias/upload-single",
          method: "POST",
          body: formData,
          // Don't set Content-Type header - let browser set it with boundary
          formData: true,
        };
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAllQuizzesQuery,
  useGetUserQuizzesQuery,
  useSuspendQuizMutation,
  useGetUserActivityQuery,
  useGetQuizReportsQuery,
  useGetMyReportsQuery,
  useGetAllFeedbackQuery,
  useGetMyFeedbackQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetMySessionsQuery,
  useUploadSingleMediaMutation,
} = adminApi;