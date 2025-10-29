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

interface UpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  profileUser?: string;
}

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

interface UnsuspendQuizResponse {
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
  respondedBy: {
    adminId: string;
    role: string;
  };
  timestamp: string;
  message: string;
}

interface MediaUploadResponse {
  name: string;
  extension: string;
  mimeTypeFile: string;
  uri: string;
  size: number;
}

interface QuizFeedback {
  id: string;
  quizId: string;
  quizTitle?: string;
  participantId: string;
  participantName?: string;
  rating?: number;
  comment?: string;
  message?: string;
  createdAt: string;
}

interface QuizReport {
  id: string;
  quizId: string;
  quizTitle?: string;
  reporterId: string;
  reporterName?: string;
  reason: string;
  description?: string;
  status: string;
  createdAt: string;
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

    updateCurrentUser: builder.mutation<User, UpdateUserDto>({
      query: (data) => ({
        url: "users/update/me",
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
        url: "admin/dashboard/period",
        params,
      }),
      providesTags: ["Analytics"],
    }),

    // ==================== QUIZ REPORTS & FEEDBACK ====================
    getQuizReports: builder.query<QuizReport[], string>({
  query: (quizId) => `quiz-reports/quizzes/${quizId}`,
  providesTags: (result, error, quizId) => [
    { type: "Quiz", id: `quiz-reports-${quizId}` },
    "Quiz"
  ],
}),

    getMyReports: builder.query<QuizReport[], void>({
  query: () => "quiz-reports/me",
  providesTags: ["Quiz"],
}),

getAllFeedback: builder.query<QuizFeedback[], void>({
  query: () => "quizzes/feedback",
  providesTags: ["Quiz"],
}),

    getMyFeedback: builder.query<QuizFeedback[], void>({
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

    getSuspendedQuizzes: builder.query<Quiz[], void>({
      query: () => "quizzes/suspend",
      providesTags: ["Quizzes"],
    }),

    getDraftQuizzes: builder.query<Quiz[], void>({
      query: () => "quizzes/draft",
      providesTags: ["Quiz"],
    }),

    // SUSPEND QUIZ - Fixed endpoint
    suspendQuiz: builder.mutation<SuspendQuizResponse, { quizId: string; reason: string }>({
      query: ({ quizId, reason }) => ({
        url: `quizzes/admin/${quizId}/suspend`,  // Fixed: removed 's' from suspends
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Quizzes", "Quiz"],
    }),

    // UNSUSPEND QUIZ - New endpoint
    unsuspendQuiz: builder.mutation<UnsuspendQuizResponse, string>({
      query: (quizId) => ({
        url: `quizzes/${quizId}/unsuspend`,
        method: "POST",
      }),
      invalidatesTags: ["Quizzes", "Quiz"],
    }),

    updateQuizStatus: builder.mutation<void, { quizId: string; status: string }>({
      query: ({ quizId, status }) => ({
        url: `quizzes/${quizId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Quizzes", "Quiz"],
    }),

    deleteQuiz: builder.mutation<void, string>({
      query: (quizId) => ({
        url: `quizzes/${quizId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quizzes", "Quiz"],
    }),

    forkQuiz: builder.mutation<Quiz, string>({
      query: (quizId) => ({
        url: `quizzes/${quizId}/fork`,
        method: "POST",
      }),
      invalidatesTags: ["Quizzes", "Quiz"],
    }),

    // ==================== FAVORITE ENDPOINTS ====================
    favoriteQuiz: builder.mutation<void, string>({
      query: (quizId) => ({
        url: `quizzes/${quizId}/favorite`,
        method: "POST",
      }),
      invalidatesTags: ["Quiz"],
    }),

    unfavoriteQuiz: builder.mutation<void, string>({
      query: (quizId) => ({
        url: `quizzes/${quizId}/favorite`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz"],
    }),

    getAllFavorites: builder.query<Quiz[], void>({
      query: () => "quizzes/favorite",
      providesTags: ["Quiz"],
    }),

    getMyFavorites: builder.query<Quiz[], void>({
      query: () => "quizzes/favorite/me",
      providesTags: ["Quiz"],
    }),

    // ==================== MEDIA ENDPOINTS ====================
    uploadSingleMedia: builder.mutation<MediaUploadResponse, File>({
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

    downloadMedia: builder.query<Blob, string>({
      query: (fileName) => ({
        url: `medias/download/${fileName}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteMedia: builder.mutation<void, string>({
      query: (fileName) => ({
        url: `medias/delete/${fileName}`,
        method: "DELETE",
      }),
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
  useGetSuspendedQuizzesQuery,
  useGetDraftQuizzesQuery,
  useSuspendQuizMutation,
  useUnsuspendQuizMutation,
  useUpdateQuizStatusMutation,
  useDeleteQuizMutation,
  useForkQuizMutation,
  
  // Favorite hooks
  useFavoriteQuizMutation,
  useUnfavoriteQuizMutation,
  useGetAllFavoritesQuery,
  useGetMyFavoritesQuery,
  
  // Media hooks
  useUploadSingleMediaMutation,
  useDownloadMediaQuery,
  useDeleteMediaMutation,
} = adminApi;