import { QuizState, Question } from "./types";

export type Action =
  | { type: "ANSWER_QUESTION"; payload: number }
  | { type: "SET_LEVERAGE"; payload: number }
  | { type: "NEXT_QUESTION" }
  | { type: "COMPLETE_QUIZ" }
  | { type: "RESET_QUIZ"; payload?: { topic?: string; questions?: Question[] } };

export function quizReducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "ANSWER_QUESTION": {
      const idx = state.currentQuestionIndex;
      const isCorrect = action.payload === state.questions[idx].correctAnswer;
      const newAnswers = [...state.userAnswers];
      newAnswers[idx] = action.payload;
      
      // Calculate score with leverage multiplier
      const multiplier = state.currentQuestionLeverage ?? 1;
      const basePoints = isCorrect ? 10 : -10;
      const pointsChange = Math.round(basePoints * multiplier);
      
      // Mark the leverage power-up as used if one was applied
      const updatedLeverages = state.availableLeverages.map(l => 
        l.multiplier === state.currentQuestionLeverage ? { ...l, used: true } : l
      );
      
      // Track leverage and points for this question
      const newQuestionLeverages = [...state.questionLeverages];
      newQuestionLeverages[idx] = state.currentQuestionLeverage;
      
      const newQuestionPoints = [...state.questionPoints];
      newQuestionPoints[idx] = pointsChange;
      
      return {
        ...state,
        userAnswers: newAnswers,
        score: state.score + pointsChange,
        currentQuestionLeverage: null, // Clear leverage after answering
        availableLeverages: updatedLeverages,
        questionLeverages: newQuestionLeverages,
        questionPoints: newQuestionPoints,
      };
    }
    case "SET_LEVERAGE": {
      // Check if this leverage is still available (not used yet)
      const leverage = state.availableLeverages.find(l => 
        l.multiplier === action.payload && !l.used
      );
      
      if (leverage && state.currentQuestionLeverage === null) {
        return {
          ...state,
          currentQuestionLeverage: action.payload,
        };
      }
      return state;
    }
    case "NEXT_QUESTION": {
      const nextIdx = state.currentQuestionIndex + 1;
      const isComplete = nextIdx >= state.questions.length;
      return {
        ...state,
        currentQuestionIndex: Math.min(nextIdx, state.questions.length - 1),
        currentQuestionLeverage: null, // Reset leverage for next question
        isComplete,
      };
    }
    case "COMPLETE_QUIZ": {
      return { ...state, isComplete: true };
    }
    case "RESET_QUIZ": {
      const topic = action.payload?.topic ?? state.topic;
      const questions = action.payload?.questions ?? state.questions;
      return {
        topic,
        questions,
        currentQuestionIndex: 0,
        userAnswers: Array(questions.length).fill(null),
        score: 0,
        isComplete: false,
        availableLeverages: [
          { multiplier: 0.5, used: false },
          { multiplier: 2, used: false },
          { multiplier: 3, used: false },
        ],
        currentQuestionLeverage: null,
        questionLeverages: Array(questions.length).fill(null),
        questionPoints: Array(questions.length).fill(0),
      };
    }
    default:
      return state;
  }
}

