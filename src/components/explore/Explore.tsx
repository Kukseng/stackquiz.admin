"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useGetAllQuizzeQuery, useGetCategoriesQuery } from '@/services/adminApi';
import { Search, Users, Clock, Filter} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { any, unknown } from 'zod';

export default function ExploreComponent() {
  const { data: quizzes, isLoading } = useGetAllQuizzeQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Filter quizzes based on search and category
  const filteredQuizzes = quizzes?.filter(quiz=> {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           quiz.categories?.some((cat: any) => cat.name === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Sort quizzes
  const sortedQuizzes = filteredQuizzes?.sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.totalParticipants || 0) - (a.totalParticipants || 0);
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      default:
        return 0;
    }
  });

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

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-blue-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
      <div className="space-y-8">
        {/* Categories Filter */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              className="pl-9 pr-4 py-2 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
          <div className='grid grid-cols-2 gap-1.5'>
             <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Quizzes</option>
                {categories?.map((cat:any) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
           
          </div>
        </div>

        {/* Quizzes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-sm">
                <Skeleton className="h-40 w-full rounded-t-lg" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {sortedQuizzes?.length || 0} of {quizzes?.length || 0} quizzes
              </p>
            </div>

            {/* Quizzes Grid */}
            {sortedQuizzes?.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No quizzes found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search terms or browse different categories to find what you're looking for.
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedQuizzes?.map((quiz: any) => (
                <Card
  key={quiz.id}
  className="group cursor-pointer border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 rounded-2xl overflow-hidden bg-white"
>
  {/* Thumbnail section */}
  <div className="relative h-44 overflow-hidden">
    <Image
      src={quiz.thumbnailUrl || "/default-quiz-thumbnail.jpg"}
      alt={quiz.title}
      fill
      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
    />

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-70" />

    {/* Difficulty badge */}
    <div className="absolute top-3 left-3">
      <Badge
        variant="secondary"
        className={`px-2 py-1 text-xs font-medium backdrop-blur-sm bg-white/30 text-white border-0 shadow-sm ${getDifficultyColor(
          quiz.difficulty
        )}`}
      >
        {quiz.difficulty || "Medium"}
      </Badge>
    </div>

    {/* Categories */}
    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
      {quiz.categories?.slice(0, 2).map((cat) => (
        <Badge
          key={cat.id}
          variant="secondary"
          className="px-2 py-0.5 text-xs font-medium backdrop-blur-sm bg-white/25 text-white border-0 shadow-sm"
        >
          {cat.name}
        </Badge>
      ))}
    </div>
  </div>

  {/* Content */}
  <CardHeader className="p-4 pb-2">
    <CardTitle className="text-sm leading-snug text-gray-900 group-hover:text-orange-400 transition-colors line-clamp-1">
      {quiz.title}
    </CardTitle>
    <CardDescription className="text-sm text-gray-500 mt-1 line-clamp-1">
      {quiz.description || "Test your knowledge with this engaging quiz."}
    </CardDescription>
  </CardHeader>

  <CardContent className="p-4 pt-0">
    <div className="flex items-center justify-between text-sm text-gray-500">
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4 text-blue-500" />
        <span>{quiz.totalParticipants?.toLocaleString() || "0"}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-gray-500" />
        <span>{quiz.duration || "10"}s</span>
      </div>
    </div>
  </CardContent>
</Card>

                ))}
              </div>
            )}
          </>
        )}
      </div>
  );
}