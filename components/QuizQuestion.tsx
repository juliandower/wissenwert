"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AnswerOption } from "./AnswerOption";
import { Question } from "@/lib/types";
import { QuizProgress } from "./QuizProgress";
import { Button } from "./ui/button";

interface QuizQuestionProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  userAnswer: number | null;
  isAnswered: boolean;
  onSelectAnswer: (answerIndex: number) => void;
  onNext: () => void;
}

export function QuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  userAnswer,
  isAnswered,
  onSelectAnswer,
  onNext,
}: QuizQuestionProps) {
  const t = useTranslations('quiz');
  const currentQuestionNum = questionIndex + 1;
  const correctAnswerIndex = question.correctAnswer;

  const getOptionState = (optionIndex: number) => {
    const isSelected = userAnswer === optionIndex;
    const isCorrect = optionIndex === correctAnswerIndex;
    const isWrong = isSelected && optionIndex !== correctAnswerIndex;

    return {
      isSelected,
      isCorrect,
      isWrong,
      isAnswered,
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <QuizProgress current={currentQuestionNum} total={totalQuestions} />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.options.map((option, index) => {
            const state = getOptionState(index);
            return (
              <AnswerOption
                key={index}
                option={option}
                index={index}
                isSelected={state.isSelected}
                isCorrect={state.isCorrect}
                isWrong={state.isWrong}
                isAnswered={state.isAnswered}
                onClick={() => onSelectAnswer(index)}
              />
            );
          })}

          {isAnswered && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                {t('explanation')}
              </p>
              <p className="text-sm text-blue-800">
                {question.explanation || t('noExplanation')}
              </p>
            </div>
          )}

          {isAnswered && (
            <div className="pt-4">
              <Button
                onClick={onNext}
                size="lg"
                className="w-full"
              >
                {currentQuestionNum === totalQuestions ? t('viewResults') : t('nextQuestion')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

