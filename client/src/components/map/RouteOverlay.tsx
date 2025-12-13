export interface RouteOverlayProps {
  id: string
  coordinates: Array<{ lat: number; lng: number }>
  color?: string
  width?: number
  dashed?: boolean
  label?: string
  distance?: string
  duration?: string
}

export const RouteOverlay = ({
  color = '#F97316',
  width = 3,
  dashed = false,
  label,
  distance,
  duration,
}: RouteOverlayProps) => {
  return (
    <div className="route-overlay">
      {/* Route Info Card */}
      {(label || distance || duration) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Route Color Indicator */}
            <div
              className="w-1 h-12 rounded-full"
              style={{ backgroundColor: color }}
            />

            <div className="flex-1">
              {label && (
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {label}
                </h4>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {distance && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span>{distance}</span>
                  </div>
                )}
                {duration && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Route Style Indicator */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-16 h-1 rounded-full ${dashed ? 'border-t-2 border-dashed' : ''}`}
                style={{
                  backgroundColor: dashed ? 'transparent' : color,
                  borderColor: dashed ? color : 'transparent',
                  height: `${width}px`,
                }}
              />
              <span className="text-xs text-gray-500">
                {dashed ? 'Optional' : 'Main Route'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Route Legend Component
export const RouteLegend = ({
  routes,
}: {
  routes: Array<{
    id: string
    label: string
    color: string
    dashed?: boolean
  }>
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Route Legend</h4>
      <div className="space-y-2">
        {routes.map((route) => (
          <div key={route.id} className="flex items-center gap-3">
            <div
              className={`w-12 h-1 rounded-full ${route.dashed ? 'border-t-2 border-dashed' : ''}`}
              style={{
                backgroundColor: route.dashed ? 'transparent' : route.color,
                borderColor: route.dashed ? route.color : 'transparent',
              }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{route.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Waypoint Component
export const Waypoint = ({
  number,
  title,
  description,
  color = '#F97316',
}: {
  number: number
  title: string
  description?: string
  color?: string
}) => {
  return (
    <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {/* Number Badge */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: color }}
      >
        {number}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h5>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>

      {/* Arrow */}
      <svg
        className="flex-shrink-0 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

// Route Timeline Component
export const RouteTimeline = ({
  waypoints,
  color = '#F97316',
}: {
  waypoints: Array<{
    id: string
    title: string
    description?: string
    time?: string
  }>
  color?: string
}) => {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div
        className="absolute left-4 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: color }}
      />

      {/* Waypoints */}
      <div className="space-y-6">
        {waypoints.map((waypoint, index) => (
          <div key={waypoint.id} className="relative pl-12">
            {/* Timeline Dot */}
            <div
              className="absolute left-0 w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: color }}
            >
              {index + 1}
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-semibold text-gray-900 dark:text-white">
                  {waypoint.title}
                </h5>
                {waypoint.time && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {waypoint.time}
                  </span>
                )}
              </div>
              {waypoint.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {waypoint.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
