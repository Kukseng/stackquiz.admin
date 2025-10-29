import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal, RefreshCw, AlertCircle, CheckCircle, Eye, XCircle, PauseCircle, Filter, ChevronLeft, ChevronRight, PlayCircle, MessageSquare, Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useGetAllQuizzesQuery, useSuspendQuizMutation, useUnsuspendQuizMutation, useUpdateQuizStatusMutation, useGetAllFeedbackQuery } from "@/services/adminApi"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

const ITEMS_PER_PAGE = 10

export default function EnhancedModerationTable() {
  const { data: quizzes = [], isLoading, refetch } = useGetAllQuizzesQuery({ active: true })
  const { data: feedbackData = [] } = useGetAllFeedbackQuery()
  const [suspendQuiz, { isLoading: isSuspending }] = useSuspendQuizMutation()
  const [unsuspendQuiz, { isLoading: isUnsuspending }] = useUnsuspendQuizMutation()
  const [updateQuizStatus] = useUpdateQuizStatusMutation()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [suspendReason, setSuspendReason] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const { toast } = useToast()

  // Count unread notifications (feedback + reports)
  const unreadNotifications = feedbackData.length

  const handleSuspend = async () => {
    if (!selectedQuizId || !suspendReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for suspension",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("Attempting to suspend quiz:", { quizId: selectedQuizId, reason: suspendReason })
      
      const result = await suspendQuiz({ 
        quizId: selectedQuizId, 
        reason: suspendReason 
      }).unwrap()
      
      console.log("Suspend success:", result)
      
      toast({
        title: "Success",
        description: "Quiz suspended successfully",
      })
      setSuspendDialogOpen(false)
      setSuspendReason("")
      setSelectedQuizId(null)
      refetch()
    } catch (error: any) {
      console.error("Error suspending quiz:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      
      // Extract error message
      let errorMessage = "Failed to suspend quiz"
      
      if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.data?.error) {
        errorMessage = error.data.error
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.status) {
        errorMessage = `Server error: ${error.status}`
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleUnsuspend = async (quizId: string) => {
    try {
      console.log("Attempting to unsuspend quiz:", quizId)
      
      const result = await unsuspendQuiz(quizId).unwrap()
      
      console.log("Unsuspend success:", result)
      
      toast({
        title: "Success",
        description: "Quiz unsuspended successfully",
      })
      refetch()
    } catch (error: any) {
      console.error("Error unsuspending quiz:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      
      let errorMessage = "Failed to unsuspend quiz"
      
      if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.data?.error) {
        errorMessage = error.data.error
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.status) {
        errorMessage = `Server error: ${error.status}`
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleAction = async (quizId: string, action: string) => {
    if (action === "Suspend") {
      setSelectedQuizId(quizId)
      setSuspendDialogOpen(true)
      return
    }

    if (action === "Unsuspend") {
      handleUnsuspend(quizId)
      return
    }

    try {
      const statusMap: Record<string, string> = {
        Approve: "PUBLISHED",
        Review: "DRAFT",
        Reject: "ARCHIVED",
      }

      await updateQuizStatus({ quizId, status: statusMap[action] }).unwrap()

      toast({
        title: "Success",
        description: `Quiz ${action.toLowerCase()}d successfully`,
      })
      
      refetch()
    } catch (error: any) {
      console.error("Error updating quiz:", error)
      
      let errorMessage = `Failed to ${action.toLowerCase()} quiz`
      
      if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || quiz.status === statusFilter
    const matchesDifficulty = difficultyFilter === "all" || quiz.difficulty === difficultyFilter

    return matchesSearch && matchesStatus && matchesDifficulty
  })

  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedQuizzes = filteredQuizzes.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, difficultyFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return { variant: "default" as const, icon: CheckCircle, label: "Published", color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" }
      case "DRAFT":
        return { variant: "secondary" as const, icon: Eye, label: "Draft", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" }
      case "ARCHIVED":
        return { variant: "destructive" as const, icon: XCircle, label: "Archived", color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" }
      case "SUSPENDED":
        return { variant: "outline" as const, icon: PauseCircle, label: "Suspended", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" }
      default:
        return { variant: "outline" as const, icon: AlertCircle, label: status, color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20" }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toUpperCase()) {
      case "EASY":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      case "HARD":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      {/* Header - keeping your existing code */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Quiz Moderation
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Review and manage quiz submissions across the platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    <Badge variant="secondary" className="text-xs">
                      {unreadNotifications} new
                    </Badge>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {feedbackData.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No new notifications
                        </div>
                      ) : (
                        feedbackData.slice(0, 10).map((feedback: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5" />
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">New Feedback</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {feedback.comment || feedback.message || 'Participant submitted feedback'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Quiz: {feedback.quizTitle || 'Unknown'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>

            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="rounded-xl border bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Total Quizzes</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {quizzes.filter((q) => q.status === "PUBLISHED").length}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Published</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-white to-yellow-50 dark:from-gray-900 dark:to-yellow-950 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {quizzes.filter((q) => q.status === "DRAFT").length}
              </p>
              <p className="text-xs text-muted-foreground font-medium">In Review</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-950 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <PauseCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {quizzes.filter((q) => q.status === "SUSPENDED").length}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Suspended</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-950 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-500/10">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {quizzes.filter((q) => q.status === "ARCHIVED").length}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Archived</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b p-4 bg-muted/30">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              className="pl-9 w-full bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-background">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Title</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Description</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Difficulty</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedQuizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-muted">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">No quizzes found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {searchQuery || statusFilter !== "all" || difficultyFilter !== "all"
                            ? "Try adjusting your filters"
                            : "No quizzes available for moderation"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedQuizzes.map((quiz) => {
                  const statusConf = getStatusConfig(quiz.status)
                  const StatusIcon = statusConf.icon
                  const isSuspended = quiz.status === "SUSPENDED"
                  
                  return (
                    <TableRow key={quiz.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium max-w-[200px]">
                        <div className="truncate text-sm">{quiz.title}</div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate text-muted-foreground text-sm">
                          {quiz.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {quiz.categories.slice(0, 2).map((cat) => (
                            <Badge key={cat.name} variant="outline" className="text-xs font-medium">
                              {cat.name}
                            </Badge>
                          ))}
                          {quiz.categories.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{quiz.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getDifficultyColor(quiz.difficulty)} font-medium text-xs`}
                        >
                          {quiz.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1.5 ${statusConf.color} font-medium`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConf.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            {isSuspended ? (
                              <DropdownMenuItem 
                                onClick={() => handleAction(quiz.id, "Unsuspend")}
                                className="cursor-pointer text-green-600"
                                disabled={isUnsuspending}
                              >
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Unsuspend
                              </DropdownMenuItem>
                            ) : (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleAction(quiz.id, "Suspend")}
                                  className="cursor-pointer"
                                >
                                  <PauseCircle className="h-4 w-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleAction(quiz.id, "Reject")}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {paginatedQuizzes.length > 0 && (
          <div className="border-t bg-muted/30 px-4 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{startIndex + 1}-{Math.min(endIndex, filteredQuizzes.length)}</span> of{" "}
              <span className="font-medium text-foreground">{filteredQuizzes.length}</span> quizzes
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === '...' ? (
                      <span className="px-2 text-muted-foreground text-sm">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(page as number)}
                        className={`h-8 w-8 text-sm ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                      >
                        {page}
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PauseCircle className="h-5 w-5 text-yellow-600" />
              Suspend Quiz
            </DialogTitle>
            <DialogDescription>
              This quiz will be temporarily suspended and hidden from users. Please provide a clear reason for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="reason">Suspension Reason *</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Contains inappropriate content, violates community guidelines..."
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This reason will be recorded and may be shared with the quiz creator.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setSuspendDialogOpen(false)
                setSuspendReason("")
              }}
              disabled={isSuspending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSuspend} 
              variant="destructive"
              disabled={!suspendReason.trim() || isSuspending}
            >
              {isSuspending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Suspending...
                </>
              ) : (
                "Suspend Quiz"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}