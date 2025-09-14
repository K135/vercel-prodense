// Message types
export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  metadata?: {
    model?: string
    tokens?: number
    processingTime?: number
  }
}

// Chat session types
export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  metadata?: {
    totalMessages?: number
    totalTokens?: number
    model?: string
  }
}

// API response types
export interface GeminiResponse {
  text: string
  finishReason?: string
  safetyRatings?: SafetyRating[]
}

export interface SafetyRating {
  category: string
  probability: string
}

// Error types
export interface GeminiError {
  code: string
  message: string
  details?: any
}

// Configuration types
export interface GeminiConfig {
  temperature?: number
  topK?: number
  topP?: number
  maxOutputTokens?: number
}

// Chat context types
export interface ChatContext {
  messages: Message[]
  currentSession: ChatSession | null
  isLoading: boolean
  error: string | null
}

// Component prop types
export interface ChatMessageProps {
  message: Message
  isDarkMode: boolean
  onCopy?: (text: string) => void
  onEdit?: (messageId: string, newContent: string) => void
  onDelete?: (messageId: string) => void
}

export interface ChatSidebarProps {
  isOpen: boolean
  isDarkMode: boolean
  chatSessions: ChatSession[]
  currentSessionId: string | null
  onToggleDarkMode: () => void
  onCreateNewSession: () => void
  onSwitchSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
  onRenameSession?: (sessionId: string, newTitle: string) => void
}

export interface WelcomeScreenProps {
  isDarkMode: boolean
  onSuggestedPrompt: (prompt: string) => void
}

export interface TypingIndicatorProps {
  isDarkMode: boolean
  message?: string
}

// Storage types
export interface StorageData {
  sessions: ChatSession[]
  settings: UserSettings
}

export interface UserSettings {
  darkMode: boolean
  sidebarOpen: boolean
  autoSave: boolean
  maxSessions: number
  defaultModel: string
}

// Suggested prompts
export interface SuggestedPrompt {
  id: string
  title: string
  prompt: string
  category: 'creative' | 'technical' | 'educational' | 'business' | 'general'
  icon?: string
  color?: string
}

// Export utility types
export type MessageRole = Message['role']
export type SessionId = ChatSession['id']
export type MessageId = Message['id']