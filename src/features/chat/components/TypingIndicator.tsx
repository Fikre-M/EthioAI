export const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex gap-3 max-w-[80%]">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-green-500 to-blue-500">
          🤖
        </div>

        {/* Typing Animation */}
        <div className="flex flex-col items-start">
          <div className="rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
