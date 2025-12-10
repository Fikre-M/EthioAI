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
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xl">
              🤖
            </div>
            <div>
              <h2 className="font-semibold text-lg">AI Travel Guide</h2>
              <p className="text-xs text-muted-foreground">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>

          {/* Clear Chat Button */}
          <button
            onClick={handleClearChat}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-md hover:bg-accent"
          >
            Clear Chat
          </button>
        </div>

        {/* Language Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <ChatLanguageSelector
            selectedLanguage={chatLanguage}
            onLanguageChange={changeChatLanguage}
            disabled={isTyping}
          />
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoDetectLanguage}
                onChange={(e) => toggleAutoDetectLanguage(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-muted-foreground">Auto-detect</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={translationEnabled}
                onChange={(e) => toggleTranslation(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-muted-foreground">Translate</span>
            </label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
          <button
            onClick={dismissError}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
        style={{ maxHeight: 'calc(100vh - 280px)' }}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
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
