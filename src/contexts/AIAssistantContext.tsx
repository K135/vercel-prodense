'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AIAssistantContextType {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  openAssistant: () => void
  closeAssistant: () => void
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined)

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext)
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider')
  }
  return context
}

export const AIAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const openAssistant = () => setIsExpanded(true)
  const closeAssistant = () => setIsExpanded(false)

  return (
    <AIAssistantContext.Provider value={{
      isExpanded,
      setIsExpanded,
      openAssistant,
      closeAssistant
    }}>
      {children}
    </AIAssistantContext.Provider>
  )
}