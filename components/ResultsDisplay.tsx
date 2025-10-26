"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { QuizState } from "@/lib/types";
import { QuestionReview } from "./QuestionReview";
import { ScoreWaterfall } from "./ScoreWaterfall";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface ResultsDisplayProps {
  quizState: QuizState;
}

export function ResultsDisplay({ quizState }: ResultsDisplayProps) {
  const t = useTranslations('results');
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
      <ScoreWaterfall
        questionPoints={quizState.questionPoints}
        questionLeverages={quizState.questionLeverages}
        finalScore={score}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">{t('questionReview')}</h2>
        {quizState.questions.map((question, index) => (
          <QuestionReview
            key={question.id}
            question={question}
            userAnswer={quizState.userAnswers[index] ?? -1}
            questionNumber={index + 1}
            leverageUsed={quizState.questionLeverages[index]}
            pointsEarned={quizState.questionPoints[index]}
          />
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          size="lg"
          onClick={() => {
            const locale = window.location.pathname.split('/')[1] || 'en';
            router.push(`/${locale}`);
          }}
          variant="default"
          className="flex-1"
        >
          {t('playAgain')}
        </Button>
        <Button
          size="lg"
          onClick={() => {
            const locale = window.location.pathname.split('/')[1] || 'en';
            router.push(`/${locale}`);
          }}
          variant="outline"
          className="flex-1"
        >
          {t('tryDifferentTopic')}
        </Button>
      </div>
    </div>
  );
}

