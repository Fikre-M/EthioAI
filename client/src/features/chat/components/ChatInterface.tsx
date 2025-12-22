import { useRef, useEffect, useState } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { SuggestedQuestions } from './SuggestedQuestions'
import { ChatLanguageSelector } from './ChatLanguageSelector'
import { QuickActions } from './QuickActions'
import { useChat } from '@hooks/useChat'
import { detectLanguage } from '@utils/languageDetection'

export const ChatInterface = () => {
  const { 
    messages, 
    isTyping, 
    error, 
    chatLanguage,
    autoDetectLanguage,
    translationEnabled,
    sendMessage, 
    clearChat, 
    dismissError,
    changeChatLanguage,
    toggleAutoDetectLanguage,
    toggleTranslation
  } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (content: string) => {
    setShowSuggestions(false)
    
    // Auto-detect language if enabled
    if (autoDetectLanguage) {
      const detection = detectLanguage(content)
      if (detection.confidence > 0.7 && detection.language !== chatLanguage) {
        changeChatLanguage(detection.language)
      }
    }
    
    await sendMessage(content)
  }

  const handleQuestionClick = (question: string) => {
    // Remove emoji from question
    const cleanQuestion = question.replace(/^[^\s]+\s/, '')
    handleSendMessage(cleanQuestion)
  }

  const handleClearChat = () => {
    clearChat()
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat Header */}
      <div className="border-b bg-background p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
              🤖
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <h2 className="font-semibold text-base sm:text-lg truncate">AI Travel Guide</h2>
              <p className="text-xs text-muted-foreground truncate">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>

          {/* Clear Chat Button */}
          <button
            onClick={handleClearChat}
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors px-2 sm:px-3 py-1 rounded-md hover:bg-accent flex-shrink-0 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Clear Chat</span>
            <span className="sm:hidden">Clear</span>
          </button>
        </div>

        {/* Language Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
          <div className="flex-shrink-0 min-w-0">
            <ChatLanguageSelector
              selectedLanguage={chatLanguage}
              onLanguageChange={changeChatLanguage}
              disabled={isTyping}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm min-w-0 overflow-hidden">
            <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={autoDetectLanguage}
                onChange={(e) => toggleAutoDetectLanguage(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 flex-shrink-0"
              />
              <span className="text-muted-foreground whitespace-nowrap">Auto-detect</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={translationEnabled}
                onChange={(e) => toggleTranslation(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 flex-shrink-0"
              />
              <span className="text-muted-foreground whitespace-nowrap">Translate</span>
            </label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-3 sm:mx-4 mt-3 sm:mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0 flex-1">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs sm:text-sm text-red-700 dark:text-red-300 break-words">{error}</span>
          </div>
          <button
            onClick={dismissError}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 flex-shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin min-w-0"
        style={{ maxHeight: 'calc(100vh - 320px)' }}
      >
        <div className="min-w-0 w-full">
          {messages.map((message) => (
            <div key={message.id} className="min-w-0 w-full mb-3 sm:mb-4">
              <ChatMessage message={message} />
            </div>
          ))}
          {isTyping && (
            <div className="min-w-0 w-full">
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <QuickActions onActionClick={handleSendMessage} disabled={isTyping} />
      )}

      {/* Suggested Questions */}
      {showSuggestions && messages.length <= 1 && (
        <SuggestedQuestions onQuestionClick={handleQuestionClick} disabled={isTyping} />
      )}

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  )
}
