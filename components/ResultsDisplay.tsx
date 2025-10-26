"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { QuizState } from "@/lib/types";
import { QuestionReview } from "./QuestionReview";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface ResultsDisplayProps {
  quizState: QuizState;
}

export function ResultsDisplay({ quizState }: ResultsDisplayProps) {
  const router = useRouter();
  const score = quizState.score;
  const total = quizState.questions.length;
  const percentage = Math.round((score / total) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return "Outstanding! 🌟";
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 70) return "Good job! 👍";
    if (percentage >= 60) return "Not bad! 📚";
    return "Keep studying! 💪";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={getScoreColor()}>
            <div className="text-6xl font-bold">{score}/{total}</div>
            <div className="text-2xl mt-2">{percentage}%</div>
          </div>
          <p className="text-xl font-semibold text-gray-700">
            {getScoreMessage()}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Question Review</h2>
        {quizState.questions.map((question, index) => (
          <QuestionReview
            key={question.id}
            question={question}
            userAnswer={quizState.userAnswers[index] ?? -1}
            questionNumber={index + 1}
          />
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          size="lg"
          onClick={() => router.push("/")}
          variant="default"
          className="flex-1"
        >
          Play Again
        </Button>
        <Button
          size="lg"
          onClick={() => router.push("/")}
          variant="outline"
          className="flex-1"
        >
          Try Different Topic
        </Button>
      </div>
    </div>
  );
}

