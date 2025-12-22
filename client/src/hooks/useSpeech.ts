import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export const useSpeech = () => {
  const { i18n } = useTranslation()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Web Speech API is supported
    setIsSupported('speechSynthesis' in window)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Set language based on current i18n language
      const langMap: Record<string, string> = {
        en: 'en-US',
        am: 'am-ET',
        om: 'om-ET',
      }
      utterance.lang = langMap[i18n.language] || 'en-US'

      // Set voice properties
      utterance.rate = 0.9 // Slightly slower for clarity
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Event handlers
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      // Speak
      window.speechSynthesis.speak(utterance)
    },
    [i18n.language, isSupported]
  )

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause()
    }
  }, [isSupported, isSpeaking])

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume()
    }
  }, [isSupported])

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
  }
}
