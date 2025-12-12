import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { useSpeech } from '@hooks/useSpeech'
import 'highlight.js/styles/github-dark.css'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface ChatMessageProps {
  message: Message
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { i18n } = useTranslation()
  const [copied, setCopied] = useState(false)
  const { speak, stop, isSpeaking, isSupported: isSpeechSupported } = useSpeech()
  const isUser = message.role === 'user'

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      stop()
    } else {
      speak(message.content)
    }
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
            isUser
              ? 'bg-gradient-to-br from-orange-500 to-red-500'
              : 'bg-gradient-to-br from-green-500 to-blue-500'
          }`}
        >
          {isUser ? '👤' : '🤖'}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1`}>
          <div
            className={`rounded-2xl px-4 py-3 relative ${
              isUser
                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            }`}
          >
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100">
              {/* Speaker Button (AI messages only) */}
              {!isUser && isSpeechSupported && (
                <button
                  onClick={handleSpeak}
                  className="p-1.5 rounded-md transition-colors bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                >
                  {isSpeaking ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                    </svg>
                  )}
                </button>
              )}

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`p-1.5 rounded-md transition-colors ${
                  isUser
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                title="Copy message"
              >
              {copied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
              </button>
            </div>

            {/* Message Content with Markdown */}
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap break-words pr-8">{message.content}</p>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none pr-8">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    code({ className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      const isInline = !match
                      return !isInline ? (
                        <div className="relative group/code">
                          <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                            {match[1]}
                          </div>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <span className="text-xs text-muted-foreground mt-1 px-2">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  )
}
