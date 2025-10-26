"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { QuizQuestion } from "@/components/QuizQuestion";
import { LeverageSelector } from "@/components/LeverageSelector";
import { quizReducer, type Action } from "@/lib/quiz-reducer";
import { QuizState, Question } from "@/lib/types";

export default function QuizPage() {
  const t = useTranslations('quiz');
  const locale = useLocale();
  const router = useRouter();
  const [quizState, setQuizState] = useState<QuizState | null>(null);

  useEffect(() => {
    // Load quiz data from localStorage
    const quizDataStr = localStorage.getItem("quizData");
    const topic = localStorage.getItem("quizTopic") || "Unknown Topic";

    if (!quizDataStr) {
      router.push(`/${locale}`);
      return;
    }

    const quizData = JSON.parse(quizDataStr);
    const initialQuestions: Question[] = quizData.questions;

    // Load saved state or initialize new
    const savedLeverages = localStorage.getItem("availableLeverages");
    const savedLeverage = localStorage.getItem("currentQuestionLeverage");

    // Initialize state
    const initialState: QuizState = {
      topic,
      questions: initialQuestions,
      currentQuestionIndex: 0,
      userAnswers: Array(initialQuestions.length).fill(null),
      score: 0,
      isComplete: false,
      availableLeverages: savedLeverages 
        ? JSON.parse(savedLeverages)
        : [
            { multiplier: 0.5, used: false },
            { multiplier: 2, used: false },
            { multiplier: 3, used: false },
          ],
      currentQuestionLeverage: savedLeverage ? parseFloat(savedLeverage) : null,
      questionLeverages: Array(initialQuestions.length).fill(null),
      questionPoints: Array(initialQuestions.length).fill(0),
    };

    setQuizState(initialState);
  }, [router]);

  const handleDispatch = (action: Action) => {
    if (!quizState) return;
    const newState = quizReducer(quizState, action);
    setQuizState(newState);
    
    // Save state to localStorage after each action
    localStorage.setItem("userAnswers", JSON.stringify(newState.userAnswers));
    localStorage.setItem("score", newState.score.toString());
    localStorage.setItem("availableLeverages", JSON.stringify(newState.availableLeverages));
    localStorage.setItem("currentQuestionLeverage", newState.currentQuestionLeverage?.toString() || "");
    localStorage.setItem("questionLeverages", JSON.stringify(newState.questionLeverages));
    localStorage.setItem("questionPoints", JSON.stringify(newState.questionPoints));
  };

  if (!quizState) {
    return (
      <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loadingQuiz')}</p>
          </div>
      </main>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const userAnswer = quizState.userAnswers[quizState.currentQuestionIndex];
  const isAnswered = userAnswer !== null;
  const isLastQuestion = quizState.currentQuestionIndex === quizState.questions.length - 1;

  const handleSelectAnswer = (answerIndex: number) => {
    if (isAnswered) return;
    handleDispatch({ type: "ANSWER_QUESTION", payload: answerIndex });
  };

  const handleSelectLeverage = (multiplier: number) => {
    handleDispatch({ type: "SET_LEVERAGE", payload: multiplier });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // State is already saved by handleDispatch, just navigate
      router.push(`/${locale}/results`);
    } else {
      handleDispatch({ type: "NEXT_QUESTION" });
    }
  };

  return (
    <main className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Score Tracker */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {t('leverage')}: {quizState.currentQuestionLeverage 
              ? `${quizState.currentQuestionLeverage}x` 
              : t('leverageNormal')}
          </div>
          <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
            {t('score')}: {quizState.score}
          </div>
        </div>

        {/* Leverage Selector - only show before answering */}
        {!isAnswered && (
          <LeverageSelector
            availableLeverages={quizState.availableLeverages}
            currentLeverage={quizState.currentQuestionLeverage}
            onSelectLeverage={handleSelectLeverage}
          />
        )}

        {/* Question */}
        <QuizQuestion
          question={currentQuestion}
          questionIndex={quizState.currentQuestionIndex}
          totalQuestions={quizState.questions.length}
          userAnswer={userAnswer}
          isAnswered={isAnswered}
          onSelectAnswer={handleSelectAnswer}
          onNext={handleNext}
        />
      </div>
    </main>
  );
}

