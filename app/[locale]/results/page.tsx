"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { QuizState } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [quizState, setQuizState] = useState<QuizState | null>(null);

  useEffect(() => {
    // Load quiz data from localStorage
    const quizDataStr = localStorage.getItem("quizData");
    const topic = localStorage.getItem("quizTopic") || "Unknown Topic";

    if (!quizDataStr) {
      const locale = window.location.pathname.split('/')[1] || 'en';
      router.push(`/${locale}`);
      return;
    }

    const quizData = JSON.parse(quizDataStr);
    const userAnswersStr = localStorage.getItem("userAnswers");
    const scoreStr = localStorage.getItem("score");
    const leveragesStr = localStorage.getItem("availableLeverages");
    const questionLeveragesStr = localStorage.getItem("questionLeverages");
    const questionPointsStr = localStorage.getItem("questionPoints");

    // Reconstruct quiz state
    const userAnswers = userAnswersStr
      ? JSON.parse(userAnswersStr)
      : Array(quizData.questions.length).fill(null);
    const score = scoreStr ? parseInt(scoreStr) : 0;
    const availableLeverages = leveragesStr 
      ? JSON.parse(leveragesStr)
      : [
          { multiplier: 0.5, used: false },
          { multiplier: 2, used: false },
          { multiplier: 3, used: false },
        ];
    const questionLeverages = questionLeveragesStr
      ? JSON.parse(questionLeveragesStr)
      : Array(quizData.questions.length).fill(null);
    const questionPoints = questionPointsStr
      ? JSON.parse(questionPointsStr)
      : Array(quizData.questions.length).fill(0);

    const finalState: QuizState = {
      topic,
      questions: quizData.questions,
      currentQuestionIndex: quizData.questions.length - 1,
      userAnswers,
      score,
      isComplete: true,
      availableLeverages,
      currentQuestionLeverage: null,
      questionLeverages,
      questionPoints,
    };

    setQuizState(finalState);
  }, [router]);

  if (!quizState) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 py-8">
      <ResultsDisplay quizState={quizState} />
    </main>
  );
}

