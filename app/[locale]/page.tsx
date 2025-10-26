"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { PromptInput } from "@/components/PromptInput";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { QuizGenerationResult } from "@/lib/types";

export default function Home() {
  const locale = useLocale();
  const t = useTranslations('home');
  const errorT = useTranslations('errors');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGenerateQuiz = async (topic: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, locale }),
      });

      const result: QuizGenerationResult = await response.json();

      if ("error" in result) {
        setError(result.error);
        return;
      }

      // Clear old quiz state and store new quiz data
      localStorage.setItem("quizData", JSON.stringify(result.data));
      localStorage.setItem("quizTopic", topic);
      localStorage.removeItem("userAnswers");
      localStorage.removeItem("score");
      localStorage.removeItem("availableLeverages");
      localStorage.removeItem("currentQuestionLeverage");
      localStorage.removeItem("questionLeverages");
      localStorage.removeItem("questionPoints");

      // Navigate to quiz page with locale
      router.push(`/${locale}/quiz`);
    } catch (err) {
      setError(errorT('failedToGenerate'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </header>

        <PromptInput onSubmit={handleGenerateQuiz} isLoading={isLoading} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          <p>{t('exampleTopics')}</p>
        </div>
      </div>
    </main>
  );
}
