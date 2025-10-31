# Tavily API Setup Guide

This guide will help you set up Tavily API to enable web search functionality for accurate quiz generation.

## Why Web Search?

Adding web search helps ensure that quiz questions are based on accurate, up-to-date information from the web, reducing hallucinations and improving fact accuracy.

## Steps

### 1. Get Your Tavily API Key

1. Go to https://tavily.com/
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key (it will look like `tvly-xxxxxxxxxxxxx`)

### 2. Add Environment Variable

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add your Tavily API key:
   ```bash
   TAVILY_API_KEY=tvly-your-actual-api-key-here
   ```

   Your `.env.local` should now look something like:
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   TAVILY_API_KEY=tvly-your-actual-api-key-here
   ```

### 3. Restart Your Dev Server

Stop your current dev server (Ctrl+C) and restart it:
```bash
pnpm dev
```

### 4. Test It Out

1. Go to http://localhost:3000
2. Enter a topic like "Python programming" or "World War 2"
3. Click "Generate Quiz"
4. The system will now search the web for accurate information before generating questions!

## How It Works

- When you submit a quiz topic, the system first performs a web search using Tavily API
- The search results are formatted and included in the AI prompt
- The AI model uses these verified facts to generate accurate quiz questions
- This helps prevent hallucinations and ensures questions are based on real information

## Pricing

Tavily offers a free tier with:
- 1,000 API calls per month
- Perfect for development and small-scale usage

For production use, check their pricing plans at https://tavily.com/pricing

## Troubleshooting

**Warning: "Tavily API key not configured"**
- This is just a warning - quiz generation will still work without web search
- To enable web search, add `TAVILY_API_KEY` to your `.env.local` file
- Make sure you restarted the dev server after adding the environment variable

**Quiz generation still works without Tavily**
- Web search is optional - if the API key isn't set, quizzes will be generated using only the AI model's training data
- For best accuracy, we recommend setting up Tavily API

**API errors**
- Check that your API key is correct
- Verify you haven't exceeded your API call limit
- Check the console for detailed error messages

