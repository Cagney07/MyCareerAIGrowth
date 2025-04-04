"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronRight, Lightbulb, CheckCircle2 } from "lucide-react";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed! View your results below.");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-gray-600">Generating your personalized quiz...</p>
      </div>
    );
  }

  if (resultData) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto px-4"
        >
          <QuizResult result={resultData} onStartNew={startNewQuiz} />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!quizData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto px-4"
      >
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Industry Knowledge Assessment
            </CardTitle>
            <p className="text-muted-foreground">
              Test your expertise with this personalized quiz tailored to your
              industry and skills.
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">10 Questions</h4>
                  <p className="text-sm text-muted-foreground">
                    Covering key industry concepts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-medium">Detailed Explanations</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn as you go with expert insights
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={generateQuizFn}
              className="px-8 py-6 text-lg font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Start Assessment
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  const question = quizData[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto px-4"
      >
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">
                Question {currentQuestion + 1} of {quizData.length}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-medium leading-relaxed"
            >
              {question.question}
            </motion.p>

            <RadioGroup
              onValueChange={handleAnswer}
              value={answers[currentQuestion]}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => handleAnswer(option)}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    className="h-5 w-5 border-2 text-blue-600"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="text-base font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Expert Insight
                    </p>
                    <p className="text-muted-foreground">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            {!showExplanation && answers[currentQuestion] && (
              <Button
                onClick={() => setShowExplanation(true)}
                variant="outline"
                className="w-full sm:w-auto gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                Show Explanation
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion] || savingResult}
              className="w-full sm:w-auto ml-auto gap-2"
            >
              {savingResult ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {currentQuestion < quizData.length - 1
                    ? "Next Question"
                    : "Finish Assessment"}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}