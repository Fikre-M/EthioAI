import { useState } from 'react'
import { ItineraryMessage } from '@/types/richMessage'

export interface ItineraryMessageCardProps {
  message: ItineraryMessage
}

export const ItineraryMessageCard = ({ message }: ItineraryMessageCardProps) => {
  const { itinerary } = message
  const [expandedDay, setExpandedDay] = useState<number | null>(1)

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">{itinerary.title}</h3>
              <p className="text-orange-100 text-sm">{itinerary.duration}</p>
            </div>
            <div className="text-right">
              {itinerary.totalCost && (
                <div>
                  <p className="text-xs text-orange-100">Total Cost</p>
                  <p className="text-lg font-bold">
                    {itinerary.currency} {itinerary.totalCost.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
          {itinerary.startDate && itinerary.endDate && (
            <div className="mt-3 flex items-center gap-2 text-sm text-orange-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{itinerary.startDate} - {itinerary.endDate}</span>
            </div>
          )}
        </div>

        {/* Days */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {itinerary.days.map((day) => (
            <div key={day.day} className="p-4">
              <button
                onClick={() => toggleDay(day.day)}
                className="w-full flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {day.day}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Day {day.day}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {day.title}
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedDay === day.day ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Activities */}
              {expandedDay === day.day && (
                <div className="mt-3 ml-12 space-y-3">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="relative pl-6 pb-3 border-l-2 border-gray-200 dark:border-gray-700 last:border-0">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full" />
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                          {activity.activity}
                        </h5>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{activity.location}</span>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors">
            Save Itinerary
          </button>
        </div>
      </div>
    </div>
  )
}
