import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export const VoiceInput = ({ onTranscript, disabled = false }: VoiceInputProps) => {
  const { i18n } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      // Set language based on current i18n language
      const langMap: Record<string, string> = {
        en: 'en-US',
        am: 'am-ET',
        om: 'om-ET',
      }
      recognitionRef.current.lang = langMap[i18n.language] || 'en-US'

      // Handle results
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onTranscript(transcript)
        setIsListening(false)
      }

      // Handle errors
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      // Handle end
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [i18n.language, onTranscript])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  if (!isSupported) {
    return null // Don't show button if not supported
  }

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={`p-3 rounded-lg transition-all ${
        isListening
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      )}
    </button>
  )
}
