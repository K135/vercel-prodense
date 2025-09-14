import { ChatSession, UserSettings } from '@/types/prodense-ai'

// Storage keys
const STORAGE_KEYS = {
  CHAT_SESSIONS: 'prodense-ai-chat-sessions',
  USER_SETTINGS: 'prodense-ai-user-settings',
  CURRENT_SESSION: 'prodense-ai-current-session'
} as const

// Default user settings
const DEFAULT_SETTINGS: UserSettings = {
  darkMode: false,
  sidebarOpen: true,
  autoSave: true,
  maxSessions: 50,
  defaultModel: 'prodense-ai-pro'
}

// Storage utility class
export class ChatStorage {
  // Check if localStorage is available
  private static isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  // Get all chat sessions
  static getSessions(): ChatSession[] {
    if (!this.isStorageAvailable()) return []
    
    try {
      const sessions = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS)
      if (!sessions) return []
      
      const parsed = JSON.parse(sessions)
      // Convert date strings back to Date objects
      return parsed.map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
    } catch (error) {
      console.error('Error loading chat sessions:', error)
      return []
    }
  }

  // Save chat sessions
  static saveSessions(sessions: ChatSession[]): void {
    if (!this.isStorageAvailable()) return
    
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions))
    } catch (error) {
      console.error('Error saving chat sessions:', error)
    }
  }

  // Add a new session
  static addSession(session: ChatSession): void {
    const sessions = this.getSessions()
    sessions.unshift(session)
    
    // Limit the number of sessions
    const settings = this.getSettings()
    if (sessions.length > settings.maxSessions) {
      sessions.splice(settings.maxSessions)
    }
    
    this.saveSessions(sessions)
  }

  // Update an existing session
  static updateSession(sessionId: string, updates: Partial<ChatSession>): void {
    const sessions = this.getSessions()
    const index = sessions.findIndex(s => s.id === sessionId)
    
    if (index !== -1) {
      sessions[index] = {
        ...sessions[index],
        ...updates,
        updatedAt: new Date()
      }
      this.saveSessions(sessions)
    }
  }

  // Delete a session
  static deleteSession(sessionId: string): void {
    const sessions = this.getSessions()
    const filtered = sessions.filter(s => s.id !== sessionId)
    this.saveSessions(filtered)
  }

  // Get user settings
  static getSettings(): UserSettings {
    if (!this.isStorageAvailable()) return DEFAULT_SETTINGS
    
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS)
      if (!settings) return DEFAULT_SETTINGS
      
      return { ...DEFAULT_SETTINGS, ...JSON.parse(settings) }
    } catch (error) {
      console.error('Error loading user settings:', error)
      return DEFAULT_SETTINGS
    }
  }

  // Save user settings
  static saveSettings(settings: Partial<UserSettings>): void {
    if (!this.isStorageAvailable()) return
    
    try {
      const currentSettings = this.getSettings()
      const newSettings = { ...currentSettings, ...settings }
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(newSettings))
    } catch (error) {
      console.error('Error saving user settings:', error)
    }
  }

  // Get current session ID
  static getCurrentSessionId(): string | null {
    if (!this.isStorageAvailable()) return null
    
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION)
    } catch (error) {
      console.error('Error loading current session ID:', error)
      return null
    }
  }

  // Set current session ID
  static setCurrentSessionId(sessionId: string | null): void {
    if (!this.isStorageAvailable()) return
    
    try {
      if (sessionId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, sessionId)
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION)
      }
    } catch (error) {
      console.error('Error saving current session ID:', error)
    }
  }

  // Clear all data
  static clearAll(): void {
    if (!this.isStorageAvailable()) return
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }

  // Export data for backup
  static exportData(): string {
    const sessions = this.getSessions()
    const settings = this.getSettings()
    
    return JSON.stringify({
      sessions,
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2)
  }

  // Import data from backup
  static importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data)
      
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        this.saveSessions(parsed.sessions)
      }
      
      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveSettings(parsed.settings)
      }
      
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }
}