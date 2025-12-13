import { LocationMessage } from '@/types/richMessage'

export interface LocationMessageCardProps {
  message: LocationMessage
}

export const LocationMessageCard = ({ message }: LocationMessageCardProps) => {
  const { location } = message

  // Generate static map URL (using OpenStreetMap)
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${location.coordinates.lng - 0.01},${location.coordinates.lat - 0.01},${location.coordinates.lng + 0.01},${location.coordinates.lat + 0.01}&layer=mapnik&marker=${location.coordinates.lat},${location.coordinates.lng}`

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`

  return (
    <div className="max-w-md">
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {/* Map Preview */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
          <iframe
            src={mapUrl}
            className="w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            title={`Map of ${location.name}`}
          />
        </div>

        {/* Location Details */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {location.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {location.address}
              </p>
              {location.description && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                  {location.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{location.coordinates.lat.toFixed(6)}, {location.coordinates.lng.toFixed(6)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
