# Pointed Quiz Game - Technical Specification

## Project Overview
An AI-powered quiz game where users provide a topic/prompt and receive 10 dynamically generated multiple-choice questions. Inspired by Bloomberg's "Pointed" game.

---

## Features & User Flow

### 1. Landing Page
- Header: App title "AI Pointed Quiz"
- Input Section:
  - Large text input for quiz topic/prompt
  - Placeholder: "Enter a topic (e.g., 'World History', 'JavaScript Programming', 'Space Exploration')"
  - Character limit: 200 characters
  - Generate button (disabled if input empty)
- Loading State: Show spinner/skeleton when generating questions
- Error Handling: Display error if AI generation fails

### 2. Quiz Game Page
- Progress Indicator: Question counter (e.g., "Question 3 of 10")
- Progress Bar: Visual indicator of completion
- Question Display:
  - Question text (large, readable)
  - 4 multiple choice options (A, B, C, D)
  - Options should be clickable cards/buttons
- Answer Feedback:
  - Immediate feedback after selection
  - Green highlight for correct answer
  - Red highlight for wrong answer (show correct one)
  - Brief explanation (optional)
- Navigation:
  - "Next Question" button (appears after answering)
  - No ability to go back (like original Pointed)
- Score Tracker: Running score visible at top

### 3. Results Page
- Final Score: Large display (e.g., "7/10 Correct!")
- Score Percentage: Visual representation
- Review Section:
  - List all questions with user's answer vs correct answer
  - Show explanations for each
- Actions:
  - "Play Again" button (returns to landing page)
  - "Try Different Topic" button
  - Share score (optional social media integration)

---

## Technical Architecture

### File Structure
```
app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Landing page with prompt input
├── quiz/
│   └── page.tsx              # Main quiz game component
├── results/
│   └── page.tsx              # Results display
├── api/
│   └── generate-quiz/
│       └── route.ts          # API route for AI generation (optional if using server actions)
├── actions/
│   └── generate-quiz.ts      # Server action for quiz generation
components/
├── ui/                       # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── progress.tsx
├── PromptInput.tsx           # Landing page input component
├── QuizQuestion.tsx          # Individual question component
├── QuizProgress.tsx          # Progress bar component
├── AnswerOption.tsx          # Answer choice button
├── ResultsDisplay.tsx        # Results summary component
└── QuestionReview.tsx        # Individual question review
lib/
├── ai.ts                     # AI provider setup & prompts
├── types.ts                  # TypeScript interfaces
└── utils.ts                  # Helper functions
```

### Data Models

#### Question Type
```ts
export interface Question {
  id: string;
  question: string;
  options: string[];        // Array of 4 options
  correctAnswer: number;    // Index of correct option (0-3)
  explanation?: string;     // Why this is the correct answer
}
```

#### Quiz State Type
```ts
export interface QuizState {
  topic: string;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  score: number;
  isComplete: boolean;
}
```

#### AI Response Type
```ts
export interface AIQuizResponse {
  questions: Question[];
}
```

---

## Implementation Steps

### Phase 1: Setup
1. Initialize Next.js project with TypeScript
```bash
npx create-next-app@latest pointed-quiz --typescript --tailwind --app
```
2. Install dependencies
```bash
npm install openai zod
npm install -D @types/node
```
3. Setup shadcn/ui
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input progress
```
4. Configure environment variables
```
OPENAI_API_KEY=your_key_here
```

### Phase 2: AI Integration
1. Create `lib/ai.ts` with OpenAI client setup
2. Design prompt for generating quiz questions
3. Create server action `actions/generate-quiz.ts`
4. Add Zod validation for AI responses
5. Test AI generation in isolation

#### Sample AI Prompt Template
```ts
export const SYSTEM_PROMPT = `You are a quiz generator. Generate exactly 10 multiple-choice
questions based on the user's topic.

Requirements:
- Each question must have exactly 4 options
- Questions should vary in difficulty
- Include diverse question types (facts, concepts, applications)
- Provide brief explanations for correct answers
- Return valid JSON only

Format:
{
  "questions": [
    {
      "id": "1",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation"
    }
  ]
}`;
```

### Phase 3: Landing Page
- Create `app/page.tsx` with input form
- Build `PromptInput.tsx` component
- Add form validation
- Connect to server action
- Handle loading and error states
- Store quiz data in URL params or React state

### Phase 4: Quiz Game Page
- Create `app/quiz/page.tsx`
- Build quiz state management with `useReducer` or `useState`
- Create `QuizQuestion.tsx` component
- Create `AnswerOption.tsx` with click handlers
- Implement answer checking logic
- Add immediate feedback (correct/incorrect highlighting)
- Create `QuizProgress.tsx` component
- Add animations and transitions
- Handle quiz completion

### Phase 5: Results Page
- Create `app/results/page.tsx`
- Build `ResultsDisplay.tsx` with score breakdown
- Create `QuestionReview.tsx` for detailed review
- Add visual score representation
- Implement "Play Again" functionality

### Phase 6: Polish & UX
- Add loading skeletons
- Implement error boundaries
- Add keyboard navigation (1-4 keys for answers)
- Mobile responsive design
- Optional: framer-motion animations
- Toast notifications for errors

### Phase 7: Optimization
- Add rate limiting for AI generation
- Cache AI responses (optional)
- Optimize bundle size
- Add meta tags for SEO
- Test accessibility

---

## API Design

### Server Action: generateQuiz

File: `actions/generate-quiz.ts`
```ts
'use server';

import { OpenAI } from 'openai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/ai';

const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string().optional(),
});

const QuizSchema = z.object({
  questions: z.array(QuestionSchema).length(10),
});

export async function generateQuiz(topic: string) {
  if (!topic || topic.trim().length < 3 || topic.length > 200) {
    return { error: 'Please provide a topic between 3 and 200 characters.' };
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Generate a quiz about: ${topic}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content ?? '{}';
    const parsed = JSON.parse(content);
    const validated = QuizSchema.parse(parsed);

    return { data: validated };
  } catch (error) {
    console.error('Quiz generation error:', error);
    return { error: 'Failed to generate quiz. Please try again.' };
  }
}
```

---

## UI/UX Specifications

### Color Scheme
- Primary: Blue (#3b82f6) for buttons, progress
- Success: Green (#10b981) for correct answers
- Error: Red (#ef4444) for incorrect answers
- Background: White/Gray gradient
- Text: Dark gray (#1f2937)

### Typography
- Headings: font-bold text-3xl
- Questions: font-semibold text-xl
- Options: font-medium text-lg
- Body: font-normal text-base

### Animations
- Fade in questions
- Slide up for options
- Shake animation for incorrect answers
- Confetti for high scores (8+/10)

### Responsive Breakpoints
- Mobile: 640px
- Tablet: 768px
- Desktop: 1024px

---

## State Management Pattern

Use `useReducer` for quiz state:
```ts
type Action =
  | { type: 'ANSWER_QUESTION'; payload: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ'; payload?: { topic?: string; questions?: Question[] } };

export function quizReducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'ANSWER_QUESTION': {
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
    case 'NEXT_QUESTION': {
      const nextIdx = state.currentQuestionIndex + 1;
      const isComplete = nextIdx >= state.questions.length;
      return {
        ...state,
        currentQuestionIndex: Math.min(nextIdx, state.questions.length - 1),
        isComplete,
      };
    }
    case 'COMPLETE_QUIZ': {
      return { ...state, isComplete: true };
    }
    case 'RESET_QUIZ': {
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
```

---

## Error Handling
- API Errors: Show friendly message, offer retry
- Validation Errors: Highlight invalid fields
- Network Errors: Offline detection, retry button
- AI Generation Failures: Fallback message, manual retry

---

## Testing Checklist
- [ ] Quiz generates with valid topic
- [ ] All 10 questions display correctly
- [ ] Answer selection works
- [ ] Correct/incorrect feedback appears
- [ ] Score calculates accurately
- [ ] Results page shows all data
- [ ] Play again resets state
- [ ] Mobile responsive on all pages
- [ ] Loading states work
- [ ] Error states handled gracefully
- [ ] Keyboard shortcuts (1-4) select answers

---

## Future Enhancements
1. Difficulty Levels: Easy, Medium, Hard
2. Timed Mode: Add countdown timer
3. Multiplayer: Compete with friends
4. Leaderboards: Save high scores
5. Categories: Preset topic categories
6. Share: Social media sharing
7. History: Save completed quizzes
8. Custom Settings: Number of questions, time limits
9. Analytics: Track user performance over time
10. Moderation: Filter unsafe prompts or content

---

## Deployment

### Vercel Deployment
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables
```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Performance Targets
- Initial Load: < 2s
- Quiz Generation: < 5s
- Page Transitions: < 300ms
- Lighthouse Score: > 90

---

## Accessibility
- Keyboard navigation support
- ARIA labels for all interactive elements
- Focus indicators
- Screen reader compatible
- Sufficient color contrast (WCAG AA)

---

## Security Considerations
- API key stored in environment variables (never client-side)
- Server actions only (no client-side API calls)
- Input sanitization for prompts
- Rate limiting on AI generation
- Consider content moderation for generated items

---

## Quick Start Commands
```bash
# Create project
npx create-next-app@latest pointed-quiz --typescript --tailwind --app

# Install dependencies
cd pointed-quiz
npm install openai zod

# Setup shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input progress

# Create .env.local
echo "OPENAI_API_KEY=your_key_here" > .env.local

# Start development
npm run dev
```