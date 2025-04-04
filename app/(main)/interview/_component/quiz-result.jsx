"use client";

import { Trophy, CheckCircle2, XCircle, ArrowRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";
export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
}) {
  if (!result) return null;

  const scoreColor = result.quizScore >= 80 
    ? "text-emerald-500" 
    : result.quizScore >= 50 
      ? "text-amber-500" 
      : "text-rose-500";

  const scoreMessage = result.quizScore >= 80
    ? "Excellent work! You've mastered these concepts."
    : result.quizScore >= 50
      ? "Good effort! You're on your way to mastery."
      : "Keep practicing! Review these concepts to improve.";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 space-y-6"
    >
      {/* Header with Trophy */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20"
        >
          <Trophy className="h-8 w-8 text-yellow-500" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
          Assessment Results
        </h1>
        <p className="text-muted-foreground">{scoreMessage}</p>
      </div>

      <CardContent className="space-y-8">
        {/* Score Overview with Animated Progress */}
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={cn(
              "inline-flex items-center justify-center text-5xl font-bold tracking-tight",
              scoreColor
            )}
          >
            {result.quizScore.toFixed(1)}%
          </motion.div>
          
          <div className="space-y-2">
            <Progress 
              value={result.quizScore} 
              className="h-3 bg-gray-200 dark:bg-gray-800"
              indicatorClassName={cn(
                result.quizScore >= 80 
                  ? "bg-emerald-500" 
                  : result.quizScore >= 50 
                    ? "bg-amber-500" 
                    : "bg-rose-500"
              )}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Expert Recommendation
                </h3>
                <p className="text-muted-foreground">{result.improvementTip}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Detailed Review</h3>
          <div className="space-y-4">
            {result.questions.map((q, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={cn(
                  "p-4 rounded-xl border transition-all",
                  q.isCorrect
                    ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800"
                    : "bg-rose-50/50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{q.question}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        Your answer:{" "}
                        <span
                          className={cn(
                            "font-medium",
                            q.isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          )}
                        >
                          {q.userAnswer}
                        </span>
                      </p>
                      {!q.isCorrect && (
                        <p className="text-muted-foreground">
                          Correct answer:{" "}
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            {q.answer}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  {q.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-muted/50">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button
              onClick={onStartNew}
              className="w-full py-6 text-base font-medium gap-2"
              variant="outline"
            >
              <RotateCw className="h-5 w-5" />
              Retake Assessment
            </Button>
          </motion.div>
        </CardFooter>
      )}
    </motion.div>
  );
}