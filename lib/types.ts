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
  availableLeverages: LeveragePowerUp[]; // Each leverage can only be used once
  currentQuestionLeverage: number | null; // Multiplier for current question: 0.5, 2, or 3
  questionLeverages: (number | null)[]; // Track which leverage was used on each question
  questionPoints: number[]; // Track points earned per question
}

export interface LeveragePowerUp {
  multiplier: number;
  used: boolean;
}

export interface AIQuizResponse {
  questions: Question[];
}

export type QuizGenerationResult =
  | { data: AIQuizResponse }
  | { error: string };

