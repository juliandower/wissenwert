# AI Pointed Quiz Game

A Next.js quiz game where users can generate AI-powered quizzes on any topic.

## Features

- 🎯 Generate quizzes on any topic
- 📊 Track your score as you play
- 🔍 Review detailed explanations after each question
- 📱 Fully responsive design
- ⚡ Fast loading with Next.js 16

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing the Game

The app uses mock data to test game mechanics. Try these topics:
- "World History"
- "JavaScript Programming"
- "Space Exploration"

Or any topic - the mock service will match keywords or return a default quiz.

## Project Structure

```
/
├── app/                      # Next.js app directory
│   ├── layout.tsx          # Root layout
│   ├── page.tsx             # Landing page
│   ├── quiz/page.tsx        # Quiz game page
│   └── results/page.tsx     # Results page
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── PromptInput.tsx      # Topic input component
│   ├── QuizQuestion.tsx     # Question display
│   ├── AnswerOption.tsx     # Answer buttons
│   ├── QuizProgress.tsx     # Progress bar
│   ├── ResultsDisplay.tsx   # Results summary
│   └── QuestionReview.tsx   # Question review
└── lib/                     # Utilities
    ├── types.ts             # TypeScript types
    ├── mock-data.ts         # Test quiz data
    ├── mock-ai.ts           # Mock AI service
    ├── quiz-reducer.ts      # State management
    └── utils.ts             # Helper functions
```

## Connecting OpenAI

When you're ready to connect OpenAI:

1. Create `actions/generate-quiz.ts` (see spec lines 220-268)
2. Create `lib/ai.ts` with OpenAI client setup
3. Add your API key to `.env.local`:
```
OPENAI_API_KEY=sk-...
```
4. Replace import in `app/page.tsx` from `lib/mock-ai.ts` to `actions/generate-quiz.ts`

The mock service uses the same interface, so the switch is seamless!

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- Zod for validation
- localStorage for state persistence

## Build for Production

```bash
npm run build
npm start
```

