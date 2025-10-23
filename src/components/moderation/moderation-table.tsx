"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal, RefreshCw, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useGetAllQuizzesQuery, useSuspendQuizMutation, useUpdateQuizStatusMutation } from "@/services/adminApi"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ModerationTable() {
  const { data: quizzes = [], isLoading, refetch } = useGetAllQuizzesQuery({ active: true })
  const [suspendQuiz] = useSuspendQuizMutation()
  const [updateQuizStatus] = useUpdateQuizStatusMutation()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [suspendReason, setSuspendReason] = useState("")
  const { toast } = useToast()

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
      await suspendQuiz({ quizId: selectedQuizId, reason: suspendReason }).unwrap()
      toast({
        title: "Success",
        description: "Quiz suspended successfully",
      })
      setSuspendDialogOpen(false)
      setSuspendReason("")
      setSelectedQuizId(null)
      refetch()
    } catch (error) {
      console.error("Error suspending quiz:", error)
      toast({
        title: "Error",
        description: "Failed to suspend quiz",
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
    } catch (error) {
      console.error("Error updating quiz:", error)
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} quiz`,
        variant: "destructive",
      })
    }
  }

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || quiz.status === statusFilter
    const matchesDifficulty = difficultyFilter === "all" || quiz.difficulty === difficultyFilter
    
    return matchesSearch && matchesStatus && matchesDifficulty
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "default"
      case "DRAFT":
        return "secondary"
      case "ARCHIVED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading quizzes...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sticky Header Card */}
      <Card className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b rounded-b-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Quiz Moderation</CardTitle>
              <CardDescription>
                Manage and moderate quizzes ({filteredQuizzes.length} of {quizzes.length} quizzes)
              </CardDescription>
            </div>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="shrink-0"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title or description..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
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
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title & Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8" />
                      <p>No quizzes found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <TableRow key={quiz.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium line-clamp-1">{quiz.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {quiz.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {quiz.categories.slice(0, 2).map((cat) => (
                          <Badge key={cat.id} variant="outline" className="text-xs">
                            {cat.name}
                          </Badge>
                        ))}
                        {quiz.categories.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{quiz.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`font-medium ${getDifficultyColor(quiz.difficulty)}`}
                      >
                        {quiz.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(quiz.status)} className="capitalize">
                        {quiz.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={() => handleAction(quiz.id, "Approve")}
                            className="text-green-600 focus:text-green-600"
                          >
                            Approve & Publish
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction(quiz.id, "Review")}
                            className="text-blue-600 focus:text-blue-600"
                          >
                            Send for Review
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction(quiz.id, "Suspend")}
                            className="text-orange-600 focus:text-orange-600"
                          >
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction(quiz.id, "Reject")}
                            className="text-destructive focus:text-destructive"
                          >
                            Reject & Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Suspension Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-orange-500">⚠️</span>
              Suspend Quiz
            </DialogTitle>
            <DialogDescription>
              Please provide a detailed reason for suspending this quiz. The creator will be notified of this action.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter specific reasons for suspension (e.g., inappropriate content, copyright issues, etc.)..."
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSuspend} 
              variant="destructive"
              disabled={!suspendReason.trim()}
            >
              Suspend Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}