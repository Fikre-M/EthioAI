export interface QuickAction {
  id: string
  label: string
  icon: string
  prompt: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    id: 'plan-trip',
    label: 'Plan my trip',
    icon: '🗺️',
    prompt: 'I want to plan a trip to Ethiopia. Can you help me create an itinerary?',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'find-tours',
    label: 'Find tours',
    icon: '🎒',
    prompt: 'What are the best tours available in Ethiopia?',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'cultural-info',
    label: 'Cultural info',
    icon: '🎭',
    prompt: 'Tell me about Ethiopian culture, traditions, and customs.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'emergency-help',
    label: 'Emergency help',
    icon: '🆘',
    prompt: 'I need emergency assistance. What should I do?',
    color: 'from-red-500 to-red-600',
  },
]

export interface QuickActionsProps {
  onActionClick: (prompt: string) => void
  disabled?: boolean
}

export const QuickActions = ({ onActionClick, disabled = false }: QuickActionsProps) => {
  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action.prompt)}
            disabled={disabled}
            className={`
              relative overflow-hidden rounded-xl p-4 
              bg-gradient-to-br ${action.color}
              text-white font-medium text-sm
              transition-all duration-200
              hover:scale-105 hover:shadow-lg
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              flex flex-col items-center justify-center gap-2
              min-h-[100px]
            `}
            title={action.prompt}
          >
            {/* Icon */}
            <span className="text-3xl">{action.icon}</span>
            
            {/* Label */}
            <span className="text-center leading-tight">{action.label}</span>
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          </button>
        ))}
      </div>
    </div>
  )
}
