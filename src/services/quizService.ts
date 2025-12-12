// Quiz Service - API endpoints for cultural quiz functionality

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  points: number
}

export interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  percentage: number
  rank: string
}

export interface LeaderboardEntry {
  id: string
  name: string
  score: number
  percentage: number
  completedAt: string
  avatar?: string
}

class QuizService {
  private baseUrl = '/api/cultural'

  // Get quiz questions by category and difficulty
  async getQuestions(category?: string, difficulty?: string): Promise<QuizQuestion[]> {
    try {
      const params = new URLSearchParams()
      if (category && category !== 'all') params.append('category', category)
      if (difficulty && difficulty !== 'all') params.append('difficulty', difficulty)
      
      const response = await fetch(`${this.baseUrl}/quiz/questions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch questions')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching quiz questions:', error)
      // Return mock data for now
      return this.getMockQuestions(category, difficulty)
    }
  }

  // Submit quiz results
  async submitResults(result: QuizResult): Promise<{ success: boolean; rank?: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result)
      })
      
      if (!response.ok) throw new Error('Failed to submit results')
      
      return await response.json()
    } catch (error) {
      console.error('Error submitting quiz results:', error)
      return { success: false }
    }
  }

  // Get leaderboard
  async getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/leaderboard?limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      // Return mock data for now
      return this.getMockLeaderboard()
    }
  }

  // Mock data methods (for development)
  private getMockQuestions(category?: string, difficulty?: string): QuizQuestion[] {
    const allQuestions: QuizQuestion[] = [
      {
        id: '1',
        question: 'What is the traditional Ethiopian New Year called?',
        options: ['Enkutatash', 'Timkat', 'Meskel', 'Genna'],
        correctAnswer: 0,
        explanation: 'Enkutatash is the Ethiopian New Year, celebrated on September 11th (or 12th in leap years).',
        difficulty: 'easy',
        category: 'festivals',
        points: 10
      },
      {
        id: '2',
        question: 'Which spice blend is essential in Ethiopian cuisine?',
        options: ['Curry powder', 'Berbere', 'Garam masala', 'Za\'atar'],
        correctAnswer: 1,
        explanation: 'Berbere is a complex spice blend that forms the foundation of many Ethiopian dishes.',
        difficulty: 'easy',
        category: 'food',
        points: 10
      },
      {
        id: '3',
        question: 'What is the traditional Ethiopian bread called?',
        options: ['Naan', 'Pita', 'Injera', 'Chapati'],
        correctAnswer: 2,
        explanation: 'Injera is a spongy sourdough flatbread made from teff flour, served with most Ethiopian meals.',
        difficulty: 'easy',
        category: 'food',
        points: 10
      },
      {
        id: '4',
        question: 'Which ancient city is known as the "New Jerusalem" of Ethiopia?',
        options: ['Axum', 'Gondar', 'Lalibela', 'Harar'],
        correctAnswer: 2,
        explanation: 'Lalibela is famous for its rock-hewn churches and is considered the "New Jerusalem" of Ethiopia.',
        difficulty: 'medium',
        category: 'history',
        points: 15
      },
      {
        id: '5',
        question: 'What does "Selam" mean in Amharic?',
        options: ['Hello', 'Peace/Hello', 'Goodbye', 'Thank you'],
        correctAnswer: 1,
        explanation: 'Selam means both "peace" and is used as a greeting similar to "hello" in Amharic.',
        difficulty: 'easy',
        category: 'language',
        points: 10
      },
      {
        id: '6',
        question: 'Which Ethiopian festival celebrates the finding of the True Cross?',
        options: ['Timkat', 'Meskel', 'Enkutatash', 'Fasika'],
        correctAnswer: 1,
        explanation: 'Meskel celebrates the finding of the True Cross by Empress Helena in the 4th century.',
        difficulty: 'medium',
        category: 'festivals',
        points: 15
      },
      {
        id: '7',
        question: 'What is the traditional Ethiopian coffee ceremony called?',
        options: ['Buna', 'Kawa', 'Qahwa', 'Café'],
        correctAnswer: 0,
        explanation: 'Buna is the traditional Ethiopian coffee ceremony, an important social and cultural ritual.',
        difficulty: 'medium',
        category: 'traditions',
        points: 15
      },
      {
        id: '8',
        question: 'Which empire was centered in northern Ethiopia and was known for its obelisks?',
        options: ['Zagwe Dynasty', 'Aksumite Empire', 'Solomonic Dynasty', 'Gondarine Period'],
        correctAnswer: 1,
        explanation: 'The Aksumite Empire was famous for its towering obelisks and was a major trading power.',
        difficulty: 'hard',
        category: 'history',
        points: 20
      },
      {
        id: '9',
        question: 'What is the main ingredient in Ethiopian honey wine (tej)?',
        options: ['Barley', 'Honey and water', 'Grapes', 'Teff'],
        correctAnswer: 1,
        explanation: 'Tej is a traditional Ethiopian honey wine made from honey, water, and sometimes hops.',
        difficulty: 'medium',
        category: 'food',
        points: 15
      },
      {
        id: '10',
        question: 'Which UNESCO World Heritage site features rock-hewn churches?',
        options: ['Axum', 'Harar', 'Lalibela', 'Gondar'],
        correctAnswer: 2,
        explanation: 'Lalibela is famous for its 11 medieval rock-hewn churches, carved directly into volcanic rock.',
        difficulty: 'easy',
        category: 'history',
        points: 10
      }
    ]

    let filtered = allQuestions

    if (category && category !== 'all') {
      filtered = filtered.filter(q => q.category === category)
    }

    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficulty)
    }

    return filtered.slice(0, 10) // Limit to 10 questions
  }

  private getMockLeaderboard(): LeaderboardEntry[] {
    return [
      { id: '1', name: 'Almaz T.', score: 180, percentage: 90, completedAt: '2024-01-15' },
      { id: '2', name: 'Dawit M.', score: 165, percentage: 85, completedAt: '2024-01-14' },
      { id: '3', name: 'Hanan A.', score: 150, percentage: 80, completedAt: '2024-01-13' },
      { id: '4', name: 'Yonas K.', score: 140, percentage: 75, completedAt: '2024-01-12' },
      { id: '5', name: 'Sara B.', score: 130, percentage: 70, completedAt: '2024-01-11' },
      { id: '6', name: 'Meron L.', score: 125, percentage: 68, completedAt: '2024-01-10' },
      { id: '7', name: 'Tekle H.', score: 120, percentage: 65, completedAt: '2024-01-09' },
      { id: '8', name: 'Rahel G.', score: 115, percentage: 62, completedAt: '2024-01-08' },
      { id: '9', name: 'Binyam S.', score: 110, percentage: 60, completedAt: '2024-01-07' },
      { id: '10', name: 'Tigist W.', score: 105, percentage: 58, completedAt: '2024-01-06' }
    ]
  }
}

export const quizService = new QuizService()