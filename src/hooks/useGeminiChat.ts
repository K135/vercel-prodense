'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message, ChatSession } from '@/types/gemini'
import { generateContent } from '@/lib/gemini'
import { ChatStorage } from '@/lib/storage'

export function useGeminiChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    const sessions = ChatStorage.getSessions()
    const currentId = ChatStorage.getCurrentSessionId()
    
    setChatSessions(sessions)
    
    if (currentId && sessions.find(s => s.id === currentId)) {
      setCurrentSessionId(currentId)
      const currentSession = sessions.find(s => s.id === currentId)
      if (currentSession) {
        setMessages(currentSession.messages)
      }
    } else if (sessions.length > 0) {
      setCurrentSessionId(sessions[0].id)
      setMessages(sessions[0].messages)
      ChatStorage.setCurrentSessionId(sessions[0].id)
    }
  }, [])

  // Save sessions when they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      ChatStorage.saveSessions(chatSessions)
    }
  }, [chatSessions])

  // Save current session ID when it changes
  useEffect(() => {
    ChatStorage.setCurrentSessionId(currentSessionId)
  }, [currentSessionId])

  // Create a new chat session
  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setChatSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setMessages([])
    setError(null)
    
    return newSession.id
  }, [])

  // Switch to a different session
  const switchSession = useCallback((sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
      setError(null)
    }
  }, [chatSessions])

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId))
    
    if (currentSessionId === sessionId) {
      const remainingSessions = chatSessions.filter(s => s.id !== sessionId)
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id)
        setMessages(remainingSessions[0].messages)
      } else {
        setCurrentSessionId(null)
        setMessages([])
      }
    }
  }, [chatSessions, currentSessionId])

  // Update session title
  const updateSessionTitle = useCallback((sessionId: string, title: string) => {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, title: title.slice(0, 50) + (title.length > 50 ? '...' : ''), updatedAt: new Date() }
          : session
      )
    )
  }, [])

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    setError(null)
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    }

    // If no current session, create one
    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = createNewSession()
    }

    // Add user message to current messages
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Generate AI response
      const aiResponse = await generateContent(content.trim())
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)

      // Update the session
      setChatSessions(prev => 
        prev.map(session => {
          if (session.id === sessionId) {
            const updatedSession = { 
              ...session, 
              messages: finalMessages,
              updatedAt: new Date()
            }
            
            // Update title if it's the first message
            if (session.messages.length === 0) {
              updatedSession.title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
            }
            
            return updatedSession
          }
          return session
        })
      )

    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message. Please try again.')
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please check your internet connection and try again.',
        role: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, currentSessionId, isLoading, createNewSession])

  // Clear current chat
  const clearChat = useCallback(() => {
    if (currentSessionId) {
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages: [], updatedAt: new Date() }
            : session
        )
      )
      setMessages([])
      setError(null)
    }
  }, [currentSessionId])

  // Get current session
  const currentSession = chatSessions.find(s => s.id === currentSessionId) || null

  return {
    // State
    messages,
    chatSessions,
    currentSessionId,
    currentSession,
    isLoading,
    error,
    
    // Actions
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    updateSessionTitle,
    clearChat,
    
    // Utilities
    setError
  }
}