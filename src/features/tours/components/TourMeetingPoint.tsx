import { MapView } from '@/components/map'

export interface MeetingPoint {
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  instructions: string
  contactPhone?: string
  contactEmail?: string
  meetingTime: string
  landmarks?: string[]
}

interface TourMeetingPointProps {
  meetingPoint: MeetingPoint
}

export const TourMeetingPoint = ({ meetingPoint }: TourMeetingPointProps) => {
  const { name, address, coordinates, instructions, contactPhone, contactEmail, meetingTime, landmarks } = meetingPoint

  // Generate Google Maps URL
  const mapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="relative">
        <MapView
          center={coordinates}
          zoom={15}
          markers={[
            {
              id: 'meeting-point',
              lat: coordinates.lat,
              lng: coordinates.lng,
              title: name,
              description: address,
            },
          ]}
          className="h-64 md:h-80"
        />

        {/* Map Overlay Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow-lg text-sm font-medium transition-colors"
          >
            View on Google Maps
          </a>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-lg text-sm font-medium transition-colors"
          >
            Get Directions
          </a>
        </div>
      </div>

      {/* Meeting Point Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Location Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Meeting Point
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Meeting Time</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{meetingTime}</p>
                </div>
              </div>

              {contactPhone && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Contact Phone</p>
                    <a
                      href={`tel:${contactPhone}`}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </div>
              )}

              {contactEmail && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Contact Email</p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions & Landmarks */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How to Get There
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {instructions}
            </p>
          </div>

          {landmarks && landmarks.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nearby Landmarks</h4>
              <ul className="space-y-2">
                {landmarks.map((landmark, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>{landmark}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-orange-900 dark:text-orange-200 mb-1">
              Important Information
            </h4>
            <p className="text-sm text-orange-800 dark:text-orange-300">
              Please arrive at least 15 minutes before the scheduled meeting time. Our guide will be
              waiting at the designated meeting point with a sign displaying the tour name.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
