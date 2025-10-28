"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetQuizByIdQuery } from '@/services/adminApi';
import { ArrowLeft, Clock, Users, Star, Award, Share2, Eye, EyeOff } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const [showAnswers, setShowAnswers] = useState(false);
  
  const { data: quiz, isLoading, error } = useGetQuizByIdQuery(quizId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOptionColor = (index: number, isCorrect: boolean) => {
    if (showAnswers && isCorrect) {
      return 'bg-green-500 text-white hover:bg-green-600';
    }
    
    const colors = [
      'bg-red-500 text-white hover:bg-red-600',
      'bg-blue-500 text-white hover:bg-blue-600',
      'bg-orange-500 text-white hover:bg-orange-600',
      'bg-green-500 text-white hover:bg-green-600',
    ];
    return colors[index % 4];
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-24 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-60 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">Quiz Not Found</h2>
            <p className="text-muted-foreground">
              The quiz you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/explore')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explore
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative h-80 lg:h-96">
                <Image
                  src={quiz.thumbnailUrl || "/default-quiz-thumbnail.jpg"}
                  alt={quiz.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={`${getDifficultyColor(quiz.difficulty)} backdrop-blur-sm`}>
                      {quiz.difficulty || "Medium"}
                    </Badge>
                    {quiz.categories?.map((cat: any) => (
                      <Badge key={cat.id} variant="secondary" className="backdrop-blur-sm bg-white/25 text-white border-0">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">{quiz.title}</h1>
                  <p className="text-white/90 text-lg">{quiz.description}</p>
                </div>
              </div>
            </Card>

            {/* About Quiz */}
            <Card>
              <CardHeader>
                <CardTitle>About This Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {quiz.description || "Test your knowledge and challenge yourself with this engaging quiz. Perfect for learning and entertainment!"}
                </p>
                
                {/* Quiz Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{quiz.questionTimeLimit || "10"}s</p>
                    <p className="text-xs text-muted-foreground">Per Question</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-xs text-muted-foreground">Participants</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Star className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">0.0</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Award className="h-6 w-6 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-600">{quiz.questions?.length || "0"}</p>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions Section */}
            {quiz.questions && quiz.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Questions ({quiz.questions.length})</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAnswers(!showAnswers)}
                      className="flex items-center gap-2"
                    >
                      {showAnswers ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Hide answers
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Show answers
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {quiz.questions.map((question: any, qIndex: number) => (
                      <Card key={question.id} className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
                        {/* Question Header with Gradient */}
                        <div className="relative h-32 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 p-4 flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 via-blue-500/50 to-purple-600/50" />
                          <p className="relative text-white text-center font-medium text-sm leading-snug px-2">
                            {question.questionText}
                          </p>
                        </div>

                        {/* Answer Options */}
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-2">
                            {question.options?.map((option: any, oIndex: number) => (
                              <Button
                                key={option.id}
                                variant="secondary"
                                className={`h-auto py-3 px-3 text-xs font-medium transition-all ${getOptionColor(oIndex, option.isCorrect)}`}
                                disabled
                              >
                                <span className="line-clamp-2 text-center w-full">
                                  {option.optionText}
                                </span>
                              </Button>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground text-center mt-3">
                            Question {qIndex + 1}/{quiz.questions.length}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Topics Covered */}
            {/* {quiz.topics && quiz.topics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Topics Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {quiz.topics.map((topic: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start Quiz Card */}
            <Card className="border-2 border-blue-200 shadow-lg sticky top-8">
              <CardContent className="pt-6 space-y-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Quiz
                </Button>

                <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium text-foreground">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {quiz.updatedAt && (
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span className="font-medium text-foreground">
                        {new Date(quiz.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Creator Info */}
            {/* {quiz.creator && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Created By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {quiz.creator.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-semibold">{quiz.creator.name}</p>
                      <p className="text-sm text-muted-foreground">{quiz.creator.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}