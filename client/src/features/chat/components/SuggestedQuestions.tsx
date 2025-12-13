export interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void
  disabled?: boolean
}

const defaultQuestions = [
  '🏛️ What are the best historical sites to visit?',
  '🏔️ Tell me about trekking in Simien Mountains',
  '☕ What is the Ethiopian coffee ceremony?',
  '🍽️ What traditional foods should I try?',
  '📅 When is the best time to visit Ethiopia?',
  '🗣️ What languages are spoken in Ethiopia?',
]

export const SuggestedQuestions = ({ onQuestionClick, disabled = false }: SuggestedQuestionsProps) => {
  return (
    <div className="p-4 border-t bg-muted/30">
      <p className="text-sm font-medium text-muted-foreground mb-3">Suggested questions:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {defaultQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            disabled={disabled}
            className="text-left text-sm px-3 py-2 rounded-lg bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-border"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}
