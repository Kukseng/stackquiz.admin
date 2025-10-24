"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal } from "lucide-react"
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

export function ModerationTable() {
  const { data: quizzes = [], isLoading, refetch } = useGetAllQuizzesQuery({ active: true })
  const [suspendQuiz] = useSuspendQuizMutation()
  const [updateQuizStatus] = useUpdateQuizStatusMutation()

  const [searchQuery, setSearchQuery] = useState("")
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
    } catch (error) {
      console.error("Error updating quiz:", error)
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} quiz`,
        variant: "destructive",
      })
    }
  }

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading quizzes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No quizzes found
                </TableCell>
              </TableRow>
            ) : (
              filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{quiz.description}</TableCell>
                  <TableCell>{quiz.categories.map((cat) => cat.name).join(", ")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{quiz.difficulty}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(quiz.status)}>{quiz.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction(quiz.id, "Approve")}>Approve</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(quiz.id, "Review")}>Review</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(quiz.id, "Suspend")}>Suspend</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleAction(quiz.id, "Reject")}>
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Quiz</DialogTitle>
            <DialogDescription>Please provide a reason for suspending this quiz.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter suspension reason..."
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSuspend} variant="destructive">
              Suspend Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
