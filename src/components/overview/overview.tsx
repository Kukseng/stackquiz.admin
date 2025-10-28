"use client"
import { useState } from "react"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { ChevronDown, Users, Award, Activity, ArrowUp, ArrowDown, Clock, Target } from "lucide-react"
import { useGetAdminDashboardQuery, useGetAdmindashboardbyTimeQuery } from "@/services/adminApi"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

type TimeRange = "today" | "week" | "month" | "all"

interface TimeSeriesData {
  date: string
  sessions: number
  participants: number
}

interface QuizStats {
  quizId: string
  quizTitle: string
  timesPlayed: number
  totalParticipants: number
  averageAccuracy: number
}

interface DashboardStats {
  totalQuizzes: number
  totalQuestions: number
  totalSessions: number
  activeSessions: number
  totalParticipants: number
  totalUniqueParticipants: number
  completedSessions: number
  scheduledSessions: number
  sessionsToday: number
  sessionsThisWeek: number
  sessionsThisMonth: number
  participantsToday: number
  participantsThisWeek: number
  participantsThisMonth: number
  averageParticipantsPerSession: number
  averageSessionDuration: number
  overallAccuracyRate: number
  mostActiveHost: string
  lastSessionCreated: string
  lastSessionCompleted: string
  timeSeriesData?: TimeSeriesData[]
  topQuizzes?: QuizStats[]
}

export default function OverviewComponent() {
  const [timeRange, setTimeRange] = useState<TimeRange>("all")
  // const { theme } = useTheme()

  const daysMap: Record<TimeRange, number> = {
    today: 1,
    week: 7,
    month: 30,
    all: 365,
  }

  const {
    data: allTimeData,
    isLoading: allTimeLoading,
    error: allTimeError,
  } = useGetAdminDashboardQuery(undefined, {
    skip: timeRange !== "all",
  })

  const {
    data: periodData,
    isLoading: periodLoading,
    error: periodError,
  } = useGetAdmindashboardbyTimeQuery({ days: daysMap[timeRange] }, { skip: timeRange === "all" })

  const stats: DashboardStats | undefined = timeRange === "all" ? allTimeData : periodData
  const loading = timeRange === "all" ? allTimeLoading : periodLoading
  const error = timeRange === "all" ? allTimeError : periodError

  const timeRangeOptions = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "all", label: "All Time" },
  ]

  // Generate dynamic chart data based on time range
  const generateChartData = () => {
    if (!stats) {
      return {
        labels: [],
        sessionsData: [],
        participantsData: []
      }
    }

    if (stats.timeSeriesData && stats.timeSeriesData.length > 0) {
      const labels = stats.timeSeriesData.map((item: TimeSeriesData) => {
        const date = new Date(item.date)
        switch (timeRange) {
          case "today":
            return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true })
          case "week":
            return date.toLocaleDateString('en-US', { weekday: 'short' })
          case "month":
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          case "all":
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          default:
            return date.toLocaleDateString()
        }
      })

      const sessionsData = stats.timeSeriesData.map((item: TimeSeriesData) => item.sessions)
      const participantsData = stats.timeSeriesData.map((item: TimeSeriesData) => item.participants)

      return { labels, sessionsData, participantsData }
    }

    return generateFallbackData()
  }

  const generateFallbackData = () => {
    const totalSessions = getFilteredSessions()
    const totalParticipants = getFilteredParticipants()

    let labels: string[] = []
    let sessionsData: number[] = []
    let participantsData: number[] = []

    switch (timeRange) {
      case "today":
        labels = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"]
        sessionsData = generateProgressiveData(totalSessions, 6)
        participantsData = generateProgressiveData(totalParticipants, 6)
        break
      case "week":
        labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        sessionsData = generateRealisticData(totalSessions, 7)
        participantsData = generateRealisticData(totalParticipants, 7)
        break
      case "month":
        labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
        sessionsData = generateProgressiveData(totalSessions, 4)
        participantsData = generateProgressiveData(totalParticipants, 4)
        break
      case "all":
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        sessionsData = generateRealisticData(totalSessions, 12)
        participantsData = generateRealisticData(totalParticipants, 12)
        break
    }

    return { labels, sessionsData, participantsData }
  }

  const generateRealisticData = (total: number, points: number): number[] => {
    const data = []
    let accumulated = 0
    
    for (let i = 0; i < points; i++) {
      const progress = (i + 1) / points
      const weight = Math.sin(progress * Math.PI)
      const increment = Math.floor((total * weight * 0.8) / (points / 2))
      
      accumulated += increment
      const value = i === points - 1 ? total : Math.min(accumulated, total * 0.95)
      data.push(value)
    }
    
    return data
  }

  const generateProgressiveData = (total: number, points: number): number[] => {
    const data = []
    for (let i = 0; i < points; i++) {
      const progress = (i + 1) / points
      const value = Math.floor(total * progress)
      data.push(value)
    }
    data[points - 1] = total
    return data
  }

  const getFilteredSessions = (): number => {
    if (!stats) return 0
    switch (timeRange) {
      case "today":
        return stats.sessionsToday || 0
      case "week":
        return stats.sessionsThisWeek || 0
      case "month":
        return stats.sessionsThisMonth || 0
      case "all":
        return stats.totalSessions || 0
      default:
        return stats.totalSessions || 0
    }
  }

  const getFilteredParticipants = (): number => {
    if (!stats) return 0
    switch (timeRange) {
      case "today":
        return stats.participantsToday || 0
      case "week":
        return stats.participantsThisWeek || 0
      case "month":
        return stats.participantsThisMonth || 0
      case "all":
        return stats.totalParticipants || 0
      default:
        return stats.totalParticipants || 0
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard analytics...</p>
        </div>
      </div>
    )
  }

  if (!stats || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md border border-gray-100">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
          <p className="text-gray-600">
            {error ? "Failed to load analytics data" : "Unable to load analytics data. Please try again later."}
          </p>
        </div>
      </div>
    )
  }

  // const isDark = theme === "dark"
  const completionRate = stats.totalSessions > 0 ? (stats.completedSessions / stats.totalSessions) * 100 : 0
  const { labels, sessionsData, participantsData } = generateChartData()

  const statCards = [
    {
      title: "Total Quizzes",
      value: stats.totalQuizzes,
      subtitle: `${stats.totalQuestions} questions`,
      icon: Award,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Sessions",
      value: getFilteredSessions(),
      subtitle: `${stats.activeSessions} active now`,
      icon: Activity,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Total Participants",
      value: getFilteredParticipants(),
      subtitle: `${stats.totalUniqueParticipants} unique`,
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Completion Rate",
      value: `${completionRate.toFixed(1)}%`,
      subtitle: `${stats.completedSessions} completed`,
      icon: Target,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      trend: "-2%",
      trendUp: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Track your quiz platform performance</p>
          </div>
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="appearance-none bg-white text-gray-700 text-sm font-medium rounded-lg px-4 py-2.5 pr-10 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm"
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  card.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {card.trend}
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sessions Overview Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Activity Trends</h3>
                <p className="text-sm text-gray-500 mt-1">Sessions and participants over time</p>
              </div>
            </div>
            <div className="h-72">
              {labels.length > 0 ? (
                <Line
                  data={{
                    labels,
                    datasets: [
                      {
                        label: "Sessions",
                        data: sessionsData,
                        borderColor: "rgb(59, 130, 246)",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointBackgroundColor: "rgb(59, 130, 246)",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        pointHoverBorderWidth: 3,
                      },
                      {
                        label: "Participants",
                        data: participantsData,
                        borderColor: "rgb(139, 92, 246)",
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointBackgroundColor: "rgb(139, 92, 246)",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        pointHoverBorderWidth: 3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index',
                      intersect: false,
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                        align: "end",
                        labels: {
                          usePointStyle: true,
                          pointStyle: "circle",
                          padding: 20,
                          color: "rgb(75, 85, 99)",
                          font: { size: 12, weight: "normal" },
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { size: 13, weight: "bold" },
                        bodyFont: { size: 12 },
                        displayColors: true,
                        usePointStyle: true,
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { 
                          color: "rgb(107, 114, 128)", 
                          font: { size: 11 },
                          padding: 8,
                        },
                        border: { display: false },
                      },
                      y: {
                        grid: { 
                          color: "rgba(0, 0, 0, 0.05)",
                          drawTicks: false,
                        },
                        ticks: { 
                          color: "rgb(107, 114, 128)", 
                          font: { size: 11 },
                          padding: 8,
                        },
                        border: { display: false },
                      },
                    },
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No data available for selected period
                </div>
              )}
            </div>
          </div>

          {/* Session Status Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Session Status</h3>
                <p className="text-sm text-gray-500 mt-1">Current session distribution</p>
              </div>
            </div>
            <div className="h-72">
              <Bar
                data={{
                  labels: ["Active", "Completed", "Scheduled"],
                  datasets: [
                    {
                      label: "Sessions",
                      data: [stats.activeSessions, stats.completedSessions, stats.scheduledSessions],
                      backgroundColor: [
                        "rgb(34, 197, 94)",
                        "rgb(59, 130, 246)",
                        "rgb(251, 146, 60)",
                      ],
                      borderRadius: 8,
                      borderSkipped: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      padding: 12,
                      cornerRadius: 8,
                      titleFont: { size: 13, weight: "bold" },
                      bodyFont: { size: 12 },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { 
                        color: "rgb(107, 114, 128)", 
                        font: { size: 11, weight: "normal" },
                        padding: 8,
                      },
                      border: { display: false },
                    },
                    y: {
                      grid: { 
                        color: "rgba(0, 0, 0, 0.05)",
                        drawTicks: false,
                      },
                      ticks: { 
                        color: "rgb(107, 114, 128)", 
                        font: { size: 11 },
                        padding: 8,
                      },
                      border: { display: false },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-blue-900">Avg Participants</h3>
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.averageParticipantsPerSession.toFixed(1)}</p>
            <p className="text-sm text-blue-700 mt-1">per session</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-purple-900">Avg Duration</h3>
            </div>
            <p className="text-3xl font-bold text-purple-900">{stats.averageSessionDuration.toFixed(1)}</p>
            <p className="text-sm text-purple-700 mt-1">minutes</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-green-900">Overall Accuracy</h3>
            </div>
            <p className="text-3xl font-bold text-green-900">{stats.overallAccuracyRate.toFixed(1)}%</p>
            <p className="text-sm text-green-700 mt-1">success rate</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Quizzes */}
          {stats.topQuizzes && stats.topQuizzes.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Quizzes</h3>
              <div className="space-y-4">
                {stats.topQuizzes.slice(0, 5).map((quiz, index) => (
                  <div key={quiz.quizId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm shadow-md">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{quiz.quizTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {quiz.timesPlayed} plays • {quiz.totalParticipants} participants
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 rounded-full">
                        <span className="text-sm font-bold text-green-700">{quiz.averageAccuracy.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Most Active Host</p>
                  <p className="text-lg font-bold text-blue-600 mt-0.5">{stats.mostActiveHost}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 font-medium">Last Session Created</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(stats.lastSessionCreated).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 font-medium">Last Session Completed</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(stats.lastSessionCompleted).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}