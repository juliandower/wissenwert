export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizState {
  topic: string;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  score: number;
  isComplete: boolean;
}

export interface AIQuizResponse {
  questions: Question[];
}

export type QuizGenerationResult =
  | { data: AIQuizResponse }
  | { error: string };

