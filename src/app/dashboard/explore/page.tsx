"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useGetAllQuizzeQuery, useGetCategoriesQuery } from '@/services/adminApi';
import { Search, Users, Clock, Filter, TrendingUp, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExplorePage() {
  const { data: quizzes, isLoading } = useGetAllQuizzeQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Filter quizzes based on search and category
  const filteredQuizzes = quizzes?.filter(quiz => {
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
    <DashboardLayout currentPage="explore">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Explore Quizzes
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Discover and challenge yourself with amazing quizzes from our community
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              className="pl-9 pr-4 py-2 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Filter */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Categories</h2>
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
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={`whitespace-nowrap transition-all duration-200 ${
                selectedCategory === 'all' ? 'shadow-md' : ''
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              All Quizzes
            </Button>
            {categories?.map((cat: any) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.name ? 'default' : 'outline'}
                className={`whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.name ? 'shadow-md' : ''
                }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </Button>
            ))}
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
                {sortedQuizzes?.map((quiz: any, index: number) => (
                  <Card 
                    key={quiz.id} 
                    className="group cursor-pointer border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className={`h-40 bg-gradient-to-br ${getCategoryGradient(index)} relative overflow-hidden rounded-t-lg`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute top-3 left-3">
                        <Badge 
                          variant="secondary" 
                          className={`backdrop-blur-sm bg-white/20 text-white border-0 ${getDifficultyColor(quiz.difficulty)}`}
                        >
                          {quiz.difficulty || 'Medium'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex flex-wrap gap-1">
                          {quiz.categories?.slice(0, 2).map((cat: any) => (
                            <Badge 
                              key={cat.id} 
                              variant="secondary" 
                              className="backdrop-blur-sm bg-white/20 text-white border-0 text-xs"
                            >
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {quiz.description || 'Test your knowledge with this engaging quiz'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{quiz.totalParticipants?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{quiz.duration || '10'}m</span>
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
    </DashboardLayout>
  );
}