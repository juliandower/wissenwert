"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent } from "./ui/card";
import { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuestionReviewProps {
  question: Question;
  userAnswer: number;
  questionNumber: number;
  leverageUsed?: number | null;
  pointsEarned?: number;
}

export function QuestionReview({
  question,
  userAnswer,
  questionNumber,
  leverageUsed,
  pointsEarned = 0,
}: QuestionReviewProps) {
  const t = useTranslations('results');
  // Validate userAnswer is a valid index
  const isValidAnswer = userAnswer >= 0 && userAnswer < question.options.length;
  const isCorrect = isValidAnswer && userAnswer === question.correctAnswer;
  const optionLabel = (index: number) => String.fromCharCode(65 + index);
  const getLeverageDisplay = (leverage: number | null) => {
    if (!leverage) return null;
    if (leverage === 0.5) return "½x";
    return `${leverage}x`;
  };

  return (
    <Card className={cn(
      "border-2",
      isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
    )}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Question {questionNumber}
            </h3>
            <div className="flex items-center gap-2">
              {leverageUsed && (
                <span className="px-2 py-1 rounded-md bg-purple-600 text-white text-xs font-bold">
                  {getLeverageDisplay(leverageUsed)}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-600 text-white">
                {pointsEarned > 0 ? "+" : ""}
                {pointsEarned}
              </span>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-bold",
                isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"
              )}>
                {isCorrect ? t('correct') : t('incorrect')}
              </span>
            </div>
          </div>

          <p className="text-lg font-medium">{question.question}</p>

          <div className="space-y-2">
            <div className="text-sm text-gray-600 font-semibold">{t('yourAnswer')}:</div>
            {isValidAnswer ? (
              <div className={cn(
                "p-3 rounded-lg border-2",
                isCorrect 
                  ? "bg-green-100 border-green-400" 
                  : "bg-red-100 border-red-400"
              )}>
                <span className="font-bold">{optionLabel(userAnswer)}.</span> {question.options[userAnswer]}
              </div>
            ) : (
              <div className="p-3 rounded-lg border-2 bg-gray-100 border-gray-400">
                <span className="text-gray-600">{t('noAnswerSelected')}</span>
              </div>
            )}

            {!isCorrect && (
              <>
                <div className="text-sm text-gray-600 font-semibold">{t('correctAnswer')}:</div>
                <div className="p-3 rounded-lg border-2 bg-green-100 border-green-400">
                  <span className="font-bold">{optionLabel(question.correctAnswer)}.</span> {question.options[question.correctAnswer]}
                </div>
              </>
            )}
          </div>

          {question.explanation && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-1">{t('explanation')}</p>
              <p className="text-sm text-blue-800">{question.explanation}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

