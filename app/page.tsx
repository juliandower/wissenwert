"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PromptInput } from "@/components/PromptInput";
import { generateQuiz } from "@/lib/mock-ai";
import { AIQuizResponse } from "@/lib/types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGenerateQuiz = async (topic: string) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await generateQuiz(topic);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      // Store quiz data in localStorage for now (could also use URL params or context)
      localStorage.setItem("quizData", JSON.stringify(result.data));
      localStorage.setItem("quizTopic", topic);

      // Navigate to quiz page
      router.push("/quiz");
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">AI Pointed Quiz</h1>
          <p className="text-xl text-gray-600">
            Test your knowledge with AI-generated quizzes
          </p>
        </header>

        <PromptInput onSubmit={handleGenerateQuiz} isLoading={isLoading} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          <p>Try topics like: "World History", "JavaScript", "Space", etc.</p>
        </div>
      </div>
    </main>
  );
}

