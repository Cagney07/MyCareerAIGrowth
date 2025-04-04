"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";
import { BookOpen, Clock, BarChart2, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function QuizList({ assessments }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Calculate performance trend (improving/declining)
  const getPerformanceTrend = (index) => {
    if (index === 0 || !assessments?.[index - 1]) return "neutral";
    const current = assessments[index].quizScore;
    const previous = assessments[index - 1].quizScore;
    return current > previous ? "improving" : current < previous ? "declining" : "neutral";
  };

  return (
    <>
      <Card className="border-none shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Quiz History
                </CardTitle>
              </div>
              <CardDescription className="dark:text-gray-300">
                Track your progress and identify areas for improvement
              </CardDescription>
            </div>
            <Button 
              onClick={() => router.push("/interview/mock")}
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
            >
              <Rocket className="w-4 h-4" />
              Start New Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments?.length > 0 ? (
              assessments.map((assessment, i) => (
                <Card
                  key={assessment.id}
                  className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/30 group ${
                    getPerformanceTrend(i) === "improving" 
                      ? "border-l-4 border-l-green-500" 
                      : getPerformanceTrend(i) === "declining" 
                        ? "border-l-4 border-l-rose-500" 
                        : "border-l-4 border-l-gray-300 dark:border-l-gray-600"
                  }`}
                  onClick={() => setSelectedQuiz(assessment)}
                >
                  <CardHeader className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            {assessment.quizType || `Quiz ${i + 1}`}
                          </span>
                          {getPerformanceTrend(i) === "improving" && (
                            <Badge variant="success" className="animate-pulse">
                              +{(assessment.quizScore - assessments[i-1]?.quizScore).toFixed(1)}%
                            </Badge>
                          )}
                          {getPerformanceTrend(i) === "declining" && (
                            <Badge variant="destructive">
                              -{(assessments[i-1]?.quizScore - assessment.quizScore).toFixed(1)}%
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <BarChart2 className="w-4 h-4" />
                            <span className="font-medium">
                              {assessment.quizScore.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>
                              {format(
                                new Date(assessment.createdAt),
                                "MMM dd, yyyy 'at' h:mm a"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="text-primary font-bold">
                            {assessment.quizScore.toFixed(0)}
                          </span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-sm">
                          <div className={`w-3 h-3 rounded-full ${
                            getPerformanceTrend(i) === "improving" 
                              ? "bg-green-500" 
                              : getPerformanceTrend(i) === "declining" 
                                ? "bg-rose-500" 
                                : "bg-gray-400"
                          }`} />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  {assessment.improvementTip && (
                    <CardContent className="pt-0">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-primary">
                          Improvement Tip:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {assessment.improvementTip}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No quiz history yet. Start your first quiz to track your progress!
                </p>
                <Button 
                  onClick={() => router.push("/interview/mock")}
                  className="mt-4 gap-2 bg-gradient-to-r from-primary to-purple-600"
                >
                  <Rocket className="w-4 h-4" />
                  Start Your First Quiz
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* dialog */}
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 p-6">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Quiz Details
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6">
            <QuizResult
              result={selectedQuiz}
              hideStartNew
              onStartNew={() => router.push("/interview/mock")}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}