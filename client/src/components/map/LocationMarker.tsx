export interface LocationMarkerProps {
  id: string
  lat: number
  lng: number
  title?: string
  description?: string
  icon?: 'default' | 'hotel' | 'restaurant' | 'attraction' | 'airport'
  color?: string
  onClick?: () => void
}

export const LocationMarker = ({
  title,
  description,
  icon = 'default',
  color = '#F97316',
  onClick,
}: LocationMarkerProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'hotel':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        )
      case 'restaurant':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        )
      case 'attraction':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'airport':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        )
    }
  }

  return (
    <button
      onClick={onClick}
      className="group relative"
      style={{ color }}
      aria-label={title || 'Location marker'}
    >
      {/* Marker Pin */}
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: color }} />
        
        {/* Main marker */}
        <div
          className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110"
          style={{ backgroundColor: color }}
        >
          <div className="text-white">{getIcon()}</div>
        </div>

        {/* Pointer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent"
          style={{ borderTopColor: color }}
        />
      </div>

      {/* Popup on hover */}
      {(title || description) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 min-w-[200px] max-w-[300px]">
            {title && (
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800" />
          </div>
        </div>
      )}
    </button>
  )
}

// Marker component for use in lists/legends
export const MarkerLegend = ({
  icon = 'default',
  color = '#F97316',
  label,
}: {
  icon?: LocationMarkerProps['icon']
  color?: string
  label: string
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'hotel':
        return '🏨'
      case 'restaurant':
        return '🍽️'
      case 'attraction':
        return '🎯'
      case 'airport':
        return '✈️'
      default:
        return '📍'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
        style={{ backgroundColor: color }}
      >
        <span className="text-white">{getIcon()}</span>
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  )
}
