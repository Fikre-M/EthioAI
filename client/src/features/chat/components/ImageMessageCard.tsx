import { ImageMessage } from '@/types/richMessage'

export interface ImageMessageCardProps {
  message: ImageMessage
}

export const ImageMessageCard = ({ message }: ImageMessageCardProps) => {
  return (
    <div className="max-w-md">
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <img
          src={message.imageUrl}
          alt={message.caption || 'Shared image'}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        {message.caption && (
          <div className="p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">{message.caption}</p>
          </div>
        )}
      </div>
    </div>
  )
}
