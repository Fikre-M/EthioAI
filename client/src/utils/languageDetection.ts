export interface LanguageDetectionResult {
  language: string
  confidence: number
}

const languagePatterns: Record<string, string[]> = {
  en: [
    'hello', 'hi', 'thank', 'please', 'yes', 'no', 'good', 'bad', 'how', 'what', 'where', 'when',
    'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would',
    'tour', 'travel', 'visit', 'ethiopia', 'coffee', 'culture', 'history', 'mountain', 'church'
  ],
  am: [
    'ሰላም', 'እንዴት', 'ምን', 'የት', 'መቼ', 'ለምን', 'አዎ', 'አይ', 'እባክዎ', 'አመሰግናለሁ',
    'ጥሩ', 'መጥፎ', 'ትልቅ', 'ትንሽ', 'ብዙ', 'እኔ', 'አንተ', 'እሱ', 'እሷ', 'እኛ', 'እናንተ',
    'ኢትዮጵያ', 'ቡና', 'ባህል', 'ታሪክ', 'ተራራ', 'ቤተክርስቲያን', 'ጉዞ', 'ጎብኝ'
  ],
  om: [
    'nagaa', 'akkam', 'maal', 'eessa', 'yoom', 'maaliif', 'akkamitti', 'eeyyee', 'lakki', 'maaloo', 'galateeffadha',
    'gaarii', 'hamaa', 'guddaa', 'xiqqaa', 'baayee', 'muraasa', 'ani', 'ati', 'inni', 'ishee', 'nuyi', 'isin',
    'itoophiyaa', 'buna', 'aadaa', 'seenaa', 'tulluu', 'mana', 'imala', 'daawwachuu'
  ],
  ti: [
    'ሰላም', 'ከመይ', 'እንታይ', 'ኣበይ', 'መዓስ', 'ስለምንታይ', 'እወ', 'አይ', 'በጃኻ', 'የቐንየለይ',
    'ጽቡቕ', 'ሕማቕ', 'ዓቢ', 'ንእሽቶ', 'ብዙሕ', 'ቁሩብ', 'አነ', 'ንስኻ', 'ንሱ', 'ንሳ', 'ንሕና', 'ንስኻትኩም'
  ],
  so: [
    'nabadgelyo', 'sidee', 'maxay', 'xagee', 'goorma', 'haa', 'maya', 'fadlan', 'mahadsanid',
    'wanaagsan', 'xun', 'weyn', 'yar', 'badan', 'aniga', 'adiga', 'isaga', 'iyada', 'annaga', 'idinka'
  ],
  ar: [
    'السلام', 'مرحبا', 'كيف', 'ماذا', 'أين', 'متى', 'لماذا', 'نعم', 'لا', 'من فضلك', 'شكرا',
    'جيد', 'سيء', 'كبير', 'صغير', 'كثير', 'قليل', 'أنا', 'أنت', 'هو', 'هي', 'نحن', 'أنتم'
  ]
}

export const detectLanguage = (text: string): LanguageDetectionResult => {
  const normalizedText = text.toLowerCase().trim()
  
  if (!normalizedText) {
    return { language: 'en', confidence: 0 }
  }

  // Check for Ethiopic script (Amharic/Tigrinya)
  if (/[\u1200-\u137F]/.test(text)) {
    return { language: 'am', confidence: 0.9 }
  }

  // Check for Arabic script
  if (/[\u0600-\u06FF]/.test(text)) {
    return { language: 'ar', confidence: 0.9 }
  }

  const scores: Record<string, number> = {}
  
  // Initialize scores
  Object.keys(languagePatterns).forEach(lang => {
    scores[lang] = 0
  })

  // Check for patterns in each language
  Object.entries(languagePatterns).forEach(([lang, patterns]) => {
    patterns.forEach(pattern => {
      if (normalizedText.includes(pattern.toLowerCase())) {
        scores[lang] += 1
      }
    })
  })

  // Find the language with the highest score
  let maxScore = 0
  let detectedLanguage = 'en'
  
  Object.entries(scores).forEach(([lang, score]) => {
    if (score > maxScore) {
      maxScore = score
      detectedLanguage = lang
    }
  })

  // Calculate confidence (0-1)
  const totalWords = normalizedText.split(/\s+/).length
  const confidence = Math.min(maxScore / Math.max(totalWords * 0.3, 1), 1)

  return {
    language: detectedLanguage,
    confidence: confidence
  }
}

export const getLanguageName = (code: string): string => {
  const names: Record<string, string> = {
    en: 'English',
    am: 'አማርኛ',
    om: 'Afaan Oromoo',
    ti: 'ትግርኛ',
    so: 'Soomaali',
    ar: 'العربية',
  }
  return names[code] || 'English'
}
