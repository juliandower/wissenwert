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
      router.push("/");
      return;
    }

    const quizData = JSON.parse(quizDataStr);
    const userAnswersStr = localStorage.getItem("userAnswers");
    const scoreStr = localStorage.getItem("score");

    // Reconstruct quiz state
    const userAnswers = userAnswersStr
      ? JSON.parse(userAnswersStr)
      : Array(quizData.questions.length).fill(null);
    const score = scoreStr ? parseInt(scoreStr) : 0;

    const finalState: QuizState = {
      topic,
      questions: quizData.questions,
      currentQuestionIndex: quizData.questions.length - 1,
      userAnswers,
      score,
      isComplete: true,
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

