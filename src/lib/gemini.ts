import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyAaNVQW0KuVwtUE6vQmwvTLtkKsfWdIXGQ'

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined')
}

// Initialize the Prodense AI client
export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// Get the Gemini model (use supported 1.5 family)
export const getGeminiModel = () => {
  // Prefer fast, general-purpose text model
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
}

// Configuration for different model types
export const GEMINI_MODELS = {
  TEXT_FAST: 'gemini-1.5-flash',
  TEXT_PRO: 'gemini-1.5-pro',
} as const

// Safety settings for content generation
export const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

// Generation configuration
export const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
}

// Helper function to generate content with error handling
export async function generateContent(prompt: string) {
  try {
    const model = getGeminiModel()
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    })
    
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating content:', error)
    throw new Error('Failed to generate content. Please try again.')
  }
}

// Helper function to validate API key
export function validateApiKey(): boolean {
  return !!GEMINI_API_KEY && GEMINI_API_KEY.length > 0
}