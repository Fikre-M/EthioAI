import { useState } from 'react'
import { ChatInterface } from '../components/ChatInterface'
import { ChatHistory } from '../components/ChatHistory'
import { Card } from '@components/common/Card'

export const ChatPage = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  return (
    <div className="relative">
      {/* Chat History Sidebar */}
      <ChatHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      <div className="container py-6 max-w-6xl">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-ethiopian mb-2">
              AI Travel Assistant
            </h1>
            <p className="text-muted-foreground">
              Ask me anything about Ethiopia - tours, culture, destinations, and more!
            </p>
          </div>
          {/* History Toggle Button */}
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle chat history"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">History</span>
          </button>
        </div>

        {/* Chat Interface Card */}
        <Card className="overflow-hidden" style={{ height: 'calc(100vh - 250px)', minHeight: '500px' }}>
          <ChatInterface />
        </Card>

        {/* Quick Suggestions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 hover-lift cursor-pointer">
            <div className="text-2xl mb-2">🏛️</div>
            <h3 className="font-semibold mb-1">Historic Sites</h3>
            <p className="text-sm text-muted-foreground">
              Explore ancient churches and monuments
            </p>
          </Card>

          <Card className="p-4 hover-lift cursor-pointer">
            <div className="text-2xl mb-2">🏔️</div>
            <h3 className="font-semibold mb-1">Adventure Tours</h3>
            <p className="text-sm text-muted-foreground">
              Trekking and outdoor experiences
            </p>
          </Card>

          <Card className="p-4 hover-lift cursor-pointer">
            <div className="text-2xl mb-2">🎭</div>
            <h3 className="font-semibold mb-1">Cultural Experiences</h3>
            <p className="text-sm text-muted-foreground">
              Immerse in local traditions
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
