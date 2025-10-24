import { baseApi } from "../lib/api/baseApi";

// ==================== INTERFACES ====================

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  profileUser?: string;
  isActive: boolean;
  createdAt: string;
}

// Updated to include username
interface UpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  profileUser?: string;
}

// Rest of interfaces remain the same...
interface TopQuiz {
  quizId: string;
  quizTitle: string;
  timesPlayed: number;
  totalParticipants: number;
  averageAccuracy: number;
}

interface DashboardStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  scheduledSessions: number;
  totalParticipants: number;
  activeParticipants: number;
  totalUniqueParticipants: number;
  totalQuizzes: number;
  totalQuestions: number;
  totalAnswers: number;
  averageParticipantsPerSession: number;
  averageSessionDuration: number;
  overallAccuracyRate: number;
  sessionsToday: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  participantsToday: number;
  participantsThisWeek: number;
  participantsThisMonth: number;
  topQuizzes: TopQuiz[];
  lastSessionCreated: string;
  lastSessionCompleted: string;
  mostActiveHost: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  categories: Array<{ id: string; name: string }>;
  visibility: string;
  status: string;
  difficulty: string;
  questionTimeLimit: number;
  createdAt: string;
  updatedAt: string;
  questions: Array<{
    id: string;
    questionText: string;
    options: Array<{
      id: string;
      optionText: string;
      isCorrect: boolean;
    }>;
  }>;
}

interface SuspendQuizResponse {
  status: string;
  action: string;
  quiz: {
    id: string;
    title: string;
    previousStatus: string;
    currentStatus: string;
    isActive: boolean;
    isFlagged: boolean;
  };
  reason: string;
  respondedBy: {
    adminId: string;
    role: string;
  };
  timestamp: string;
  nextSteps: {
    appealUrl: string;
    contactAdministration: string;
  };
  message: string;
}

// ==================== API ENDPOINTS ====================

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== USER ENDPOINTS ====================
    getAllUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["User"],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => "users/me",
      providesTags: ["User"],
    }),

    // Fixed: Use the correct endpoint from API docs
    updateCurrentUser: builder.mutation<User, UpdateUserDto>({
      query: (data) => ({
        url: "users/update/me",  // Changed from "users/me" to match API docs
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<User, { userId: string; data: UpdateUserDto }>({
      query: ({ userId, data }) => ({
        url: `users/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUserById: builder.mutation<User, { userId: string; data: UpdateUserDto }>({
      query: ({ userId, data }) => ({
        url: `users/update/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    disableUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `users/${userId}/disable`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    // ==================== ANALYTICS ENDPOINTS ====================
    getUserActivity: builder.query<any, string | void>({
      query: (timeRange) =>
        timeRange ? `analytics/activity/${timeRange}` : "analytics/activity",
      providesTags: ["User"],
    }),

    getAdminDashboard: builder.query<DashboardStats, void>({
      query: () => ({
        url: "admin/dashboard",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),

    getAdmindashboardbyTime: builder.query<DashboardStats, { days?: number; timeRange?: string }>({
      query: (params) => ({
        url: "admin/dashboard",
        params,
      }),
      providesTags: ["Analytics"],
    }),

    // ==================== QUIZ REPORTS & FEEDBACK ====================
    getQuizReports: builder.query<any, string>({
      query: (quizId) => `quiz-reports/quizzes/${quizId}`,
      providesTags: ["Quiz"],
    }),

    getMyReports: builder.query<any, void>({
      query: () => "quiz-reports/me",
      providesTags: ["Quiz"],
    }),

    getAllFeedback: builder.query<any, void>({
      query: () => "quizzes/feedback",
      providesTags: ["Quiz"],
    }),

    getMyFeedback: builder.query<any, void>({
      query: () => "quizzes/feedback/me",
      providesTags: ["Quiz"],
    }),

    // ==================== CATEGORY ENDPOINTS ====================
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

    // ==================== SESSION ENDPOINTS ====================
    getMySessions: builder.query<any, void>({
      query: () => "quiz-sessions/me",
      providesTags: ["Session"],
    }),

    // ==================== QUIZ ENDPOINTS ====================
    getAllQuizzes: builder.query<Quiz[], { active?: boolean }>({
      query: ({ active = true }) => ({
        url: `quizzes?active=${active}`,
        method: "GET",
      }),
      providesTags: ["Quizzes"],
    }),

    getAllQuizze: builder.query<any, void>({
      query: () => "quizzes",
      providesTags: ["Quiz"],
    }),

    getQuizById: builder.query<Quiz, string>({
      query: (quizId) => `quizzes/${quizId}`,
      providesTags: (result, error, quizId) => [{ type: "Quiz", id: quizId }],
    }),

    getUserQuizzes: builder.query<any, void>({
      query: () => "quizzes/users/me",
      providesTags: ["Quiz"],
    }),

    suspendQuiz: builder.mutation<SuspendQuizResponse, { quizId: string; reason: string }>({
      query: ({ quizId, reason }) => ({
        url: `quizzes/admin/${quizId}/suspends`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Quizzes"],
    }),

    updateQuizStatus: builder.mutation<void, { quizId: string; status: string }>({
      query: ({ quizId, status }) => ({
        url: `quizzes/${quizId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Quizzes"],
    }),

    // ==================== MEDIA ENDPOINTS ====================
    uploadSingleMedia: builder.mutation<{ uri: string; [key: string]: any }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "medias/upload-single",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

// ==================== EXPORTED HOOKS ====================

export const {
  // User hooks
  useGetAllUsersQuery,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useUpdateUserMutation,
  useUpdateUserByIdMutation,
  useDeleteUserMutation,
  useDisableUserMutation,
  
  // Analytics hooks
  useGetUserActivityQuery,
  useGetAdminDashboardQuery,
  useGetAdmindashboardbyTimeQuery,
  
  // Reports & Feedback hooks
  useGetQuizReportsQuery,
  useGetMyReportsQuery,
  useGetAllFeedbackQuery,
  useGetMyFeedbackQuery,
  
  // Category hooks
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  
  // Session hooks
  useGetMySessionsQuery,
  
  // Quiz hooks
  useGetAllQuizzesQuery,
  useGetAllQuizzeQuery,
  useGetQuizByIdQuery,
  useGetUserQuizzesQuery,
  useSuspendQuizMutation,
  useUpdateQuizStatusMutation,
  
  // Media hooks
  useUploadSingleMediaMutation,
} = adminApi;