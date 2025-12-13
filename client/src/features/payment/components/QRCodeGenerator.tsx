import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  includeMargin?: boolean
  className?: string
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  level = 'M',
  includeMargin = true,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <QRCodeSVG
          value={value}
          size={size}
          level={level}
          includeMargin={includeMargin}
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">
          Scan with your phone to access booking details
        </p>
        <p className="text-xs text-gray-400 font-mono break-all max-w-xs">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </p>
      </div>
    </div>
  )
}

export default QRCodeGenerator