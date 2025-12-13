import React from 'react'
import CulturalQuiz from '../components/CulturalQuiz'

const CulturalQuizPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <CulturalQuiz />
      </div>
    </div>
  )
}

export default CulturalQuizPage