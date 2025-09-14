import { MessageOption } from '@/types/prodense-ai'

// Parse AI response to extract interactive options
export function parseMessageOptions(content: string): { cleanContent: string; options: MessageOption[] } {
  const options: MessageOption[] = []
  let cleanContent = content

  // Pattern to match options like "A) Teeth Whitening? ✨" or "1. Dental Implants 🦷"
  const optionPatterns = [
    // Pattern: A) Text ✨ or A) Text? ✨
    /([A-Z])\)\s*([^?\n]+)(\??)?\s*([^\n]*)/g,
    // Pattern: 1. Text 🦷 or 1) Text 🦷
    /(\d+)[\.\)]\s*([^?\n]+)(\??)?\s*([^\n]*)/g,
    // Pattern: - Text ✨
    /^-\s*([^?\n]+)(\??)?\s*([^\n]*)/gm
  ]

  // Try each pattern
  for (const pattern of optionPatterns) {
    const matches = Array.from(content.matchAll(pattern))
    
    if (matches.length >= 2) { // Only if we find multiple options
      matches.forEach((match, index) => {
        const [fullMatch, identifier, text, questionMark, emoji] = match
        
        // Extract emoji from the text or emoji part
        const emojiMatch = (text + ' ' + (emoji || '')).match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu)
        const extractedEmoji = emojiMatch ? emojiMatch[0] : undefined
        
        // Clean the text (remove emoji and extra spaces)
        const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()
        
        if (cleanText) {
          options.push({
            id: `option-${index}`,
            text: cleanText,
            value: cleanText.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            emoji: extractedEmoji
          })
        }
      })
      
      // Remove the options from the content
      cleanContent = content.replace(pattern, '').trim()
      break // Use the first pattern that matches
    }
  }

  // If no structured options found, don't try to create options from questions
  // Let the contextual options handler deal with it instead
  if (options.length === 0) {
    // Only create options if we find clear option patterns, not questions
    // Questions should be handled by generateContextualOptions()
  }

  return {
    cleanContent: cleanContent.trim(),
    options: options.slice(0, 6) // Limit to 6 options max
  }
}

// Generate options for common scenarios
export function generateContextualOptions(content: string): MessageOption[] {
  const lowerContent = content.toLowerCase()
  
  // Check for dental procedure questions
  if (lowerContent.includes('dental') && (lowerContent.includes('procedure') || lowerContent.includes('work'))) {
    return [
      { id: 'dental-1', text: 'Teeth Whitening', value: 'teeth-whitening', emoji: '✨' },
      { id: 'dental-2', text: 'Dental Implants', value: 'dental-implants', emoji: '🦷' },
      { id: 'dental-3', text: 'Cosmetic Dentistry', value: 'cosmetic-dentistry', emoji: '😊' },
      { id: 'dental-4', text: 'Orthodontics', value: 'orthodontics', emoji: '🦷' },
      { id: 'dental-5', text: 'Oral Surgery', value: 'oral-surgery', emoji: '🏥' },
      { id: 'dental-6', text: 'Something else', value: 'other', emoji: '🤔' }
    ]
  }
  
  // Check for pain-related questions and provide answer options
  if (lowerContent.includes('pain') && (lowerContent.includes('tooth') || lowerContent.includes('teeth'))) {
    // If asking about dental work history
    if (lowerContent.includes('dental work') || lowerContent.includes('work done')) {
      return [
        { id: 'history-1', text: 'Yes, I had work done recently', value: 'recent-dental-work', emoji: '🦷' },
        { id: 'history-2', text: 'Yes, but it was a while ago', value: 'old-dental-work', emoji: '📅' },
        { id: 'history-3', text: 'No, never had work on this tooth', value: 'no-dental-work', emoji: '❌' },
        { id: 'history-4', text: 'I\'m not sure', value: 'unsure-dental-work', emoji: '🤔' }
      ]
    }
    
    // If asking about temperature sensitivity
    if (lowerContent.includes('hot') || lowerContent.includes('cold') || lowerContent.includes('sweet')) {
      return [
        { id: 'temp-1', text: 'Yes, worse with cold drinks', value: 'cold-sensitive', emoji: '🧊' },
        { id: 'temp-2', text: 'Yes, worse with hot drinks', value: 'hot-sensitive', emoji: '☕' },
        { id: 'temp-3', text: 'Yes, worse with sweet foods', value: 'sweet-sensitive', emoji: '🍭' },
        { id: 'temp-4', text: 'No, temperature doesn\'t affect it', value: 'no-temperature-sensitivity', emoji: '🌡️' }
      ]
    }
    
    // Default pain type options
    return [
      { id: 'pain-1', text: 'Sharp shooting pain', value: 'sharp-pain', emoji: '⚡' },
      { id: 'pain-2', text: 'Dull throbbing ache', value: 'dull-ache', emoji: '😣' },
      { id: 'pain-3', text: 'Only when biting down', value: 'bite-pain', emoji: '🦷' },
      { id: 'pain-4', text: 'Constant pain', value: 'constant-pain', emoji: '😰' }
    ]
  }
  
  // General yes/no questions
  if (lowerContent.includes('?') && (lowerContent.includes('have you') || lowerContent.includes('do you') || lowerContent.includes('is the'))) {
    return [
      { id: 'general-1', text: 'Yes', value: 'yes', emoji: '✅' },
      { id: 'general-2', text: 'No', value: 'no', emoji: '❌' },
      { id: 'general-3', text: 'I\'m not sure', value: 'unsure', emoji: '🤔' },
      { id: 'general-4', text: 'Tell me more', value: 'more-info', emoji: '💬' }
    ]
  }
  
  return []
}