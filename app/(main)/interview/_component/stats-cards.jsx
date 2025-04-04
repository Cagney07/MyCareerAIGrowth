import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility for class merging

const StatsCards = ({ assessments }) => {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0];
  };

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-300">
            Average Score
          </CardTitle>
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-800/50">
            <Trophy className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-800 dark:text-blue-100">
            {getAverageScore()}%
          </div>
          <p className="text-xs text-blue-600/80 dark:text-blue-300/80 mt-1">
            Across all assessments
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-300">
            Questions Practiced
          </CardTitle>
          <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-800/50">
            <Brain className="h-4 w-4 text-purple-600 dark:text-purple-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-800 dark:text-purple-100">
            {getTotalQuestions()}
          </div>
          <p className="text-xs text-purple-600/80 dark:text-purple-300/80 mt-1">
            Total questions
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-600 dark:text-green-300">
            Latest Score
          </CardTitle>
          <div className="rounded-full bg-green-100 p-2 dark:bg-green-800/50">
            <Target className="h-4 w-4 text-green-600 dark:text-green-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-800 dark:text-green-100">
            {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-green-600/80 dark:text-green-300/80 mt-1">
            Most recent quiz
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;