import { QuizGenerationResult } from "./types";
import {
  worldHistoryQuiz,
  javascriptQuiz,
  spaceQuiz,
} from "./mock-data";

export async function generateQuiz(topic: string): Promise<QuizGenerationResult> {
  // Validate input
  if (!topic || topic.trim().length < 3 || topic.length > 200) {
    return { error: "Please provide a topic between 3 and 200 characters." };
  }

  // Add artificial delay to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Try to match topics to available quizzes
  const lowerTopic = topic.toLowerCase();

  if (
    lowerTopic.includes("history") ||
    lowerTopic.includes("world") ||
    lowerTopic.includes("war") ||
    lowerTopic.includes("ancient")
  ) {
    return { data: worldHistoryQuiz };
  }

  if (
    lowerTopic.includes("javascript") ||
    lowerTopic.includes("js") ||
    lowerTopic.includes("programming") ||
    lowerTopic.includes("code")
  ) {
    return { data: javascriptQuiz };
  }

  if (
    lowerTopic.includes("space") ||
    lowerTopic.includes("astronomy") ||
    lowerTopic.includes("planet") ||
    lowerTopic.includes("universe")
  ) {
    return { data: spaceQuiz };
  }

  // Default: return world history quiz
  return { data: worldHistoryQuiz };
}

