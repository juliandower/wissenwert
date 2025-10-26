import { QuizState, Question } from "./types";

export type Action =
  | { type: "ANSWER_QUESTION"; payload: number }
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
      return {
        ...state,
        userAnswers: newAnswers,
        score: state.score + (isCorrect ? 1 : 0),
      };
    }
    case "NEXT_QUESTION": {
      const nextIdx = state.currentQuestionIndex + 1;
      const isComplete = nextIdx >= state.questions.length;
      return {
        ...state,
        currentQuestionIndex: Math.min(nextIdx, state.questions.length - 1),
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
      };
    }
    default:
      return state;
  }
}

