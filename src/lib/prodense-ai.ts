import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

// Prodense AI API configuration
const PRODENSE_AI_API_KEY = 'AIzaSyAaNVQW0KuVwtUE6vQmwvTLtkKsfWdIXGQ'

if (!PRODENSE_AI_API_KEY) {
  throw new Error('PRODENSE_AI_API_KEY is not defined')
}

// Initialize the Prodense AI client
export const prodenseAI = new GoogleGenerativeAI(PRODENSE_AI_API_KEY)

// Get the Prodense AI model (use supported 1.5 family)
export const getProdenseAIModel = () => {
  // Prefer fast, general-purpose text model
  return prodenseAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
}

// Configuration for different model types
export const PRODENSE_AI_MODELS = {
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

// Custom knowledge base for Prodense AI
export const PRODENSE_KNOWLEDGE_BASE = {
  company: {
    name: "Prodense",
    description: "Leading medical tourism platform connecting patients with world-class healthcare providers",
    specialties: ["Dental Tourism", "Medical Procedures", "Healthcare Travel", "Patient Care"],
    values: ["Quality Care", "Affordability", "Trust", "Innovation"]
  },
  services: {
    dental: ["Dental Implants", "Cosmetic Dentistry", "Orthodontics", "Oral Surgery"],
    medical: ["Cardiology", "Orthopedics", "Plastic Surgery", "Oncology"],
    travel: ["Medical Visa Assistance", "Accommodation", "Transportation", "Interpreter Services"]
  },
  destinations: ["India"],
  languages: ["English", "Spanish", "Turkish", "Hindi", "Thai"]
}

// System prompt for Prodense AI
const PRODENSE_SYSTEM_PROMPT = `You are Prodense AI, a friendly and caring assistant for Prodense - India's leading medical tourism platform! 😊

CRITICAL: You must ALWAYS follow the friendly, conversational style shown in the training examples. Never be formal or medical-sounding!

Your personality:
- Warm, friendly, and empathetic (like talking to a caring friend)
- Use emojis to make conversations engaging
- Ask diagnostic questions to understand user needs
- Be genuinely helpful and caring
- Show excitement about helping people get better
- NEVER sound like a formal medical website or disclaimer

Your expertise:
- Medical tourism in Jaipur and Chandigarh, India
- Dental and medical treatments at 60-80% savings
- Travel assistance and patient care services
- Helping users find the RIGHT treatment for their specific needs

Your approach (MANDATORY):
1. ALWAYS start with empathy and understanding ("Oh no!" "I'm sorry you're dealing with this!")
2. ALWAYS ask specific diagnostic questions with multiple choice options
3. Be friendly and use emojis appropriately 
4. Help them understand what treatment they might need
5. Provide personalized recommendations based on their answers
6. Focus on Jaipur for dental/cosmetic and Chandigarh for medical procedures
7. Emphasize cost savings and quality care in India
8. Never give formal medical disclaimers - be helpful and caring instead
9. Always end with a question to keep the conversation going

FORBIDDEN: Never say "I can't provide medical advice" or "consult a healthcare professional" - instead, help them understand their options and guide them to the right treatment!

Remember: You're like a caring friend who happens to know a lot about medical tourism in India. Make them feel understood and excited about getting better!`

// Enhanced content generation with custom context
export async function generateContent(prompt: string, includeContext: boolean = true) {
  try {
    const model = getProdenseAIModel()
    
    // Prepare the full prompt with context
    const fullPrompt = includeContext 
      ? `${PRODENSE_SYSTEM_PROMPT}\n\nUser Query: ${prompt}`
      : prompt
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
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

// Generate content with custom training data and conversation history
export async function generateContentWithTraining(
  prompt: string, 
  trainingData?: string[], 
  conversationHistory?: Array<{role: 'user' | 'assistant', content: string}>
) {
  try {
    const model = getProdenseAIModel()
    
    // Build the conversation contents array
    const contents: Array<{role: string, parts: Array<{text: string}>}> = []
    
    // Start with system prompt
    let systemPrompt = PRODENSE_SYSTEM_PROMPT
    
    // Include training examples if provided
    if (trainingData && trainingData.length > 0) {
      console.log('Adding training examples to prompt:', trainingData.length)
      systemPrompt += `\n\nTraining Examples:\n${trainingData.join('\n\n')}`
    } else {
      console.log('No training examples provided to AI')
    }
    
    // Add system prompt as first user message
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    })
    
    // Add a model response to acknowledge the system prompt
    contents.push({
      role: 'model',
      parts: [{ text: 'I understand! I\'m Prodense AI, ready to help with medical tourism in India. I\'ll be friendly, ask diagnostic questions, and help find the perfect treatment for each person. How can I help you today? 😊' }]
    })
    
    // Add conversation history if provided
    if (conversationHistory && conversationHistory.length > 0) {
      for (const message of conversationHistory) {
        contents.push({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }]
        })
      }
    }
    
    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    })
    
    const result = await model.generateContent({
      contents: contents,
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
  return !!PRODENSE_AI_API_KEY && PRODENSE_AI_API_KEY.length > 0
}