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

    getUserActivity: builder.query<any, string | void>({
    query: (timeRange) =>
      timeRange
        ? `analytics/activity/${timeRange}`
        : "analytics/activity",
    providesTags: ["User"],
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
    // Admin Dashboard
    // ============================================================
    getAdminDashboard: builder.query<DashboardStats, void>({
        query: () => ({
          url: "admin/dashboard",
          method: "GET",
        }),
        providesTags: ["Analytics"],
      }),

    //=============================================================
    // Get by time
    //=============================================================

    getAdmindashboardbyTime: builder.query<any, { days?: number; timeRange?: string }>({
      query: (params) => ({
        url: `/admin/dashboard`,
        params,
      }),
    }),

     // ============================================================
    // Quiz Management
    // ============================================================
    getAllQuizzes: builder.query<Quiz[], { active?: boolean }>({
      query: ({ active = true }) => ({
        url: `/quizzes?active=${active}`,
        method: "GET",
      }),
      providesTags: ["Quizzes"],
    }),

    suspendQuiz: builder.mutation<SuspendQuizResponse, { quizId: string; reason: string }>({
      query: ({ quizId, reason }) => ({
        url: `/quizzes/admin/${quizId}/suspends`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Quizzes"],
    }),

    updateQuizStatus: builder.mutation<void, { quizId: string; status: string }>({
      query: ({ quizId, status }) => ({
        url: `/quizzes/${quizId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Quizzes"],
    }),

    // ============================================================
    // Add User endpoint
    // ============================================================

    // addUser: builder.mutation<any, any>({
    //   query: (data) => ({
    //     url: "",
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: ["Users"],
    // }),


    // ============================================================
    // Quiz endpoints
    // ============================================================
    getAllQuizze: builder.query<any, void>({
      query: () => "quizzes",
      providesTags: ["Quiz"],
    }),

    getUserQuizzes: builder.query<any, void>({
      query: () => "quizzes/users/me",
      providesTags: ["Quiz"],
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
  useGetUserQuizzesQuery,
  useGetQuizReportsQuery,
  useGetMyReportsQuery,
  useGetAllFeedbackQuery,
  useGetMyFeedbackQuery,
  useGetCategoriesQuery,
  useGetUserActivityQuery,
  useCreateCategoryMutation,
  useGetMySessionsQuery,
  useUploadSingleMediaMutation,
  useGetAdminDashboardQuery,
  useGetAdmindashboardbyTimeQuery,
  useGetAllQuizzesQuery,
  useSuspendQuizMutation,
  useUpdateQuizStatusMutation,
  useGetAllQuizzeQuery
} = adminApi;

interface TopQuiz {
  quizId: string
  quizTitle: string
  timesPlayed: number
  totalParticipants: number
  averageAccuracy: number
}

interface DashboardStats {
  totalSessions: number
  activeSessions: number
  completedSessions: number
  scheduledSessions: number
  totalParticipants: number
  activeParticipants: number
  totalUniqueParticipants: number
  totalQuizzes: number
  totalQuestions: number
  totalAnswers: number
  averageParticipantsPerSession: number
  averageSessionDuration: number
  overallAccuracyRate: number
  sessionsToday: number
  sessionsThisWeek: number
  sessionsThisMonth: number
  participantsToday: number
  participantsThisWeek: number
  participantsThisMonth: number
  topQuizzes: TopQuiz[]
  lastSessionCreated: string
  lastSessionCompleted: string
  mostActiveHost: string
}

interface Quiz {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  categories: Array<{ id: string; name: string }>
  visibility: string
  status: string
  difficulty: string
  questionTimeLimit: number
  createdAt: string
  updatedAt: string
  questions: Array<{
    id: string
    questionText: string
    options: Array<{
      id: string
      optionText: string
      isCorrect: boolean
    }>
  }>
}

interface SuspendQuizResponse {
  status: string
  action: string
  quiz: {
    id: string
    title: string
    previousStatus: string
    currentStatus: string
    isActive: boolean
    isFlagged: boolean
  }
  reason: string
  respondedBy: {
    adminId: string
    role: string
  }
  timestamp: string
  nextSteps: {
    appealUrl: string
    contactAdministration: string
  }
  message: string
}