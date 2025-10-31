import { NextRequest, NextResponse } from 'next/server';
import { QuizGenerationResult } from '@/lib/types';

// Function to perform web search using Tavily API
async function searchWeb(query: string): Promise<string> {
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  
  if (!tavilyApiKey) {
    console.warn('Tavily API key not configured. Quiz generation will proceed without web search.');
    return '';
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: query,
        search_depth: 'basic',
        max_results: 5,
        include_answer: true,
      }),
    });

    if (!response.ok) {
      console.error('Tavily API error:', response.statusText);
      return '';
    }

    const data = await response.json();
    
    // Format search results for the AI prompt
    let searchContext = '';
    if (data.answer) {
      searchContext += `\n\nWEB SEARCH SUMMARY:\n${data.answer}\n`;
    }
    
    if (data.results && data.results.length > 0) {
      searchContext += '\nRELEVANT INFORMATION:\n';
      data.results.forEach((result: any, index: number) => {
        searchContext += `${index + 1}. ${result.title}\n   ${result.content}\n   Source: ${result.url}\n\n`;
      });
    }

    return searchContext;
  } catch (error) {
    console.error('Web search error:', error);
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { topic, locale = 'en' } = await request.json();

    // Validate input
    if (!topic || typeof topic !== 'string' || topic.trim().length < 3 || topic.length > 200) {
      return NextResponse.json(
        { error: 'Please provide a topic between 3 and 200 characters.' },
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured.' },
        { status: 500 }
      );
    }

    // Perform web search to get accurate information
    const searchContext = await searchWeb(topic);

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Wissenwert Quiz Generator',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: locale === 'de' 
              ? `Sie sind ein Quiz-Generator. Generieren Sie genau 10 Multiple-Choice-Fragen auf Deutsch über "${topic}". 
            Jede Frage sollte 4 Optionen (A, B, C, D) haben und eine kurze Erklärung enthalten.
            ${searchContext ? `\nVERWENDEN SIE DIE FOLGENDEN WEB-SUCHERGEBNISSE FÜR GENAUE FAKTEN:\n${searchContext}\n\nWICHTIG: Verwenden Sie nur Informationen aus den Web-Suchergebnissen, um sicherzustellen, dass alle Fakten korrekt sind.` : ''}
            Geben Sie NUR ein gültiges JSON-Objekt mit dieser Struktur zurück:
            {
              "questions": [
                {
                  "id": "unique-id",
                  "question": "Die Fragentext",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correctAnswer": 0,
                  "explanation": "Kurze Erklärung der richtigen Antwort"
                }
              ]
            }
            WICHTIG: 
            - Geben Sie NUR das JSON zurück, kein Markdown, keine Code-Blöcke
            - correctAnswer sollte 0, 1, 2 oder 3 sein (Index der richtigen Option)
            - Machen Sie Fragen vielfältig und decken Sie verschiedene Aspekte des Themas ab
            - Stellen Sie sicher, dass alle Fragen nur zum angegebenen Thema gehören
            - Alle Fragen, Optionen und Erklärungen müssen auf Deutsch sein
            - Verwenden Sie nur verifizierte Fakten aus den Web-Suchergebnissen${searchContext ? '' : ' (falls verfügbar)'}`
              : `You are a quiz generator. Generate exactly 10 multiple-choice questions in English about "${topic}". 
            Each question should have 4 options (A, B, C, D) and include a brief explanation.
            ${searchContext ? `\nUSE THE FOLLOWING WEB SEARCH RESULTS FOR ACCURATE FACTS:\n${searchContext}\n\nIMPORTANT: Use only information from the web search results to ensure all facts are accurate.` : ''}
            Return ONLY a valid JSON object with this exact structure:
            {
              "questions": [
                {
                  "id": "unique-id",
                  "question": "The question text",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correctAnswer": 0,
                  "explanation": "Brief explanation of the correct answer"
                }
              ]
            }
            IMPORTANT: 
            - Return ONLY the JSON, no markdown formatting, no code blocks
            - correctAnswer should be 0, 1, 2, or 3 (index of the correct option)
            - Make questions diverse and covering different aspects of the topic
            - Ensure all questions are about the specified topic only
            - Use only verified facts from the web search results${searchContext ? '' : ' (if available)'}`
          },
          {
            role: 'user',
            content: locale === 'de' 
              ? `Erstellen Sie ein Quiz über: ${topic}`
              : `Generate a quiz about: ${topic}`
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: `Failed to generate quiz: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No content received from API' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let quizData;
    try {
      // Try to parse directly
      quizData = JSON.parse(content);
    } catch (parseError) {
      // If direct parse fails, try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[1]);
      } else {
        // Try to find JSON object in the response
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          quizData = JSON.parse(content.substring(jsonStart, jsonEnd + 1));
        } else {
          throw new Error('No valid JSON found in response');
        }
      }
    }

    // Validate the quiz data structure
    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid quiz format received from API. Expected 10 questions.' },
        { status: 500 }
      );
    }

    // Validate each question
    for (const question of quizData.questions) {
      if (!question.id || !question.question || !Array.isArray(question.options) || 
          question.options.length !== 4 || typeof question.correctAnswer !== 'number' ||
          question.correctAnswer < 0 || question.correctAnswer > 3) {
        return NextResponse.json(
          { error: 'Invalid question format in quiz data' },
          { status: 500 }
        );
      }
    }

    // Return the quiz data
    return NextResponse.json({ data: quizData } as QuizGenerationResult);
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz. Please try again.' },
      { status: 500 }
    );
  }
}
