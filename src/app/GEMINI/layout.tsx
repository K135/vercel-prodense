import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prodense AI Chat - Prodense',
  description: 'Chat with Google\'s advanced Prodense AI model. Get answers, creative help, and intelligent assistance.',
  keywords: ['AI', 'Chat', 'Gemini', 'Google AI', 'Artificial Intelligence', 'Assistant'],
}

export default function GeminiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}