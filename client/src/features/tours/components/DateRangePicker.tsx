import { useState } from 'react'

export interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

export interface DateRangePickerProps {
  value: DateRange
  onChange: (value: DateRange) => void
  minDate?: Date
  maxDate?: Date
}

export const DateRangePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null
    return new Date(dateString)
  }

  const handleStartDateChange = (dateString: string) => {
    const newStartDate = parseDate(dateString)
    onChange({
      ...value,
      startDate: newStartDate,
    })
  }

  const handleEndDateChange = (dateString: string) => {
    const newEndDate = parseDate(dateString)
    onChange({
      ...value,
      endDate: newEndDate,
    })
  }

  const handleClear = () => {
    onChange({ startDate: null, endDate: null })
  }

  const hasValue = value.startDate || value.endDate

  return (
    <div className="space-y-3">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {hasValue
              ? `${value.startDate ? formatDate(value.startDate) : 'Start'} - ${value.endDate ? formatDate(value.endDate) : 'End'}`
              : 'Select dates'}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Date Inputs */}
      {isOpen && (
        <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={formatDate(value.startDate)}
              onChange={(e) => handleStartDateChange(e.target.value)}
              min={minDate ? formatDate(minDate) : undefined}
              max={value.endDate ? formatDate(value.endDate) : maxDate ? formatDate(maxDate) : undefined}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={formatDate(value.endDate)}
              onChange={(e) => handleEndDateChange(e.target.value)}
              min={value.startDate ? formatDate(value.startDate) : minDate ? formatDate(minDate) : undefined}
              max={maxDate ? formatDate(maxDate) : undefined}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 text-sm text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
