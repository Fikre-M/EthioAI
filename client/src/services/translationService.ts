import { api } from '@api/axios.config'

export interface TranslationRequest {
  text: string
  fromLanguage: string
  toLanguage: string
}

export interface TranslationResponse {
  translatedText: string
  fromLanguage: string
  toLanguage: string
  confidence: number
}

export const translationService = {
  translateText: async (data: TranslationRequest): Promise<TranslationResponse> => {
    try {
      const response = await api.post<TranslationResponse>('/translate', data)
      return response.data
    } catch (error: any) {
      // Fallback to simulated translation
      return simulatedTranslationService.translateText(data)
    }
  },

  detectLanguage: async (text: string): Promise<{ language: string; confidence: number }> => {
    try {
      const response = await api.post<{ language: string; confidence: number }>('/detect-language', {
        text,
      })
      return response.data
    } catch (error: any) {
      return simulatedTranslationService.detectLanguage(text)
    }
  },
}

// Simulated translation service for development
export const simulatedTranslationService = {
  translateText: async (data: TranslationRequest): Promise<TranslationResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockTranslations: Record<string, Record<string, Record<string, string>>> = {
      en: {
        am: {
          'hello': 'ሰላም',
          'thank you': 'አመሰግናለሁ',
          'good morning': 'እንደምን አደሩ',
          'how are you': 'እንዴት ነዎት',
          'ethiopia': 'ኢትዮጵያ',
          'coffee': 'ቡና',
        },
        om: {
          'hello': 'nagaa',
          'thank you': 'galateeffadha',
          'ethiopia': 'itoophiyaa',
          'coffee': 'buna',
        }
      },
      am: {
        en: {
          'ሰላም': 'hello',
          'አመሰግናለሁ': 'thank you',
          'ኢትዮጵያ': 'ethiopia',
          'ቡና': 'coffee',
        }
      }
    }

    let translatedText = data.text
    let confidence = 0.5

    const fromLangTranslations = mockTranslations[data.fromLanguage]
    const toLangTranslations = fromLangTranslations?.[data.toLanguage]

    if (toLangTranslations) {
      const lowerText = data.text.toLowerCase()
      const exactMatch = toLangTranslations[lowerText]
      
      if (exactMatch) {
        translatedText = exactMatch
        confidence = 0.95
      }
    }

    if (translatedText === data.text && data.fromLanguage !== data.toLanguage) {
      translatedText = `[Translation: ${data.text}]`
      confidence = 0.3
    }

    return {
      translatedText,
      fromLanguage: data.fromLanguage,
      toLanguage: data.toLanguage,
      confidence,
    }
  },

  detectLanguage: async (text: string): Promise<{ language: string; confidence: number }> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (/[\u1200-\u137F]/.test(text)) {
      return { language: 'am', confidence: 0.9 }
    }
    if (/[\u0600-\u06FF]/.test(text)) {
      return { language: 'ar', confidence: 0.9 }
    }
    
    return { language: 'en', confidence: 0.6 }
  },
}

export default translationService
