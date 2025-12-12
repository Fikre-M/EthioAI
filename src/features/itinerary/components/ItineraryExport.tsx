import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import { Itinerary } from '../pages/ItineraryPage'
import {
  FaDownload, FaFilePdf, FaCalendarAlt, FaShare, FaEnvelope,
  FaWhatsapp, FaFacebook, FaTwitter, FaCopy, FaQrcode,
  FaCheckCircle, FaTimes
} from 'react-icons/fa'

interface ItineraryExportProps {
  itinerary: Itinerary
  isOpen: boolean
  onClose: () => void
}

const ItineraryExport: React.FC<ItineraryExportProps> = ({
  itinerary,
  isOpen,
  onClose
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'calendar' | 'share'>('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleExportPDF = async () => {
    setIsExporting(true)
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would use a library like jsPDF or react-pdf
      const pdfContent = generatePDFContent()
      const blob = new Blob([pdfContent], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${itinerary.title.replace(/\s+/g, '_')}_itinerary.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error exporting PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCalendar = async () => {
    setIsExporting(true)
    
    try {
      // Simulate calendar generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const icsContent = generateICSContent()
      const blob = new Blob([icsContent], { type: 'text/calendar' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${itinerary.title.replace(/\s+/g, '_')}_calendar.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error exporting calendar:', error)
      alert('Error exporting calendar. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const generateShareUrl = () => {
    const shareToken = Math.random().toString(36).substring(2, 15)
    const url = `${window.location.origin}/itinerary/shared/${shareToken}`
    setShareUrl(url)
    return url
  }

  const handleCopyLink = () => {
    const url = shareUrl || generateShareUrl()
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSocialShare = (platform: string) => {
    const url = shareUrl || generateShareUrl()
    const text = `Check out my travel itinerary: ${itinerary.title}`
    
    let shareUrl = ''
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(itinerary.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank')
    }
  }

  const generatePDFContent = () => {
    // This is a simplified text representation
    // In a real implementation, you'd use a proper PDF library
    let content = `${itinerary.title}\n\n`
    content += `Destination: ${itinerary.destination}\n`
    content += `Duration: ${itinerary.days.length} days\n`
    content += `Travelers: ${itinerary.travelers}\n`
    content += `Total Budget: $${itinerary.totalBudget}\n\n`
    
    itinerary.days.forEach((day, index) => {
      content += `Day ${index + 1} - ${new Date(day.date).toLocaleDateString()}\n`
      content += `Total Cost: $${day.totalCost}\n\n`
      
      day.items.forEach((item, itemIndex) => {
        content += `${itemIndex + 1}. ${item.title}\n`
        content += `   Time: ${item.startTime} - ${item.endTime}\n`
        content += `   Location: ${item.location}\n`
        content += `   Price: $${item.price}\n`
        if (item.description) {
          content += `   Description: ${item.description}\n`
        }
        content += '\n'
      })
      
      if (day.notes) {
        content += `Notes: ${day.notes}\n`
      }
      content += '\n'
    })
    
    return content
  }

  const generateICSContent = () => {
    let icsContent = 'BEGIN:VCALENDAR\n'
    icsContent += 'VERSION:2.0\n'
    icsContent += 'PRODID:-//Travel Planner//Travel Itinerary//EN\n'
    
    itinerary.days.forEach((day, dayIndex) => {
      day.items.forEach((item, itemIndex) => {
        const startDate = new Date(`${day.date}T${item.startTime}:00`)
        const endDate = new Date(`${day.date}T${item.endTime}:00`)
        
        icsContent += 'BEGIN:VEVENT\n'
        icsContent += `UID:${itinerary.id}-${dayIndex}-${itemIndex}@travelplanner.com\n`
        icsContent += `DTSTART:${formatDateForICS(startDate)}\n`
        icsContent += `DTEND:${formatDateForICS(endDate)}\n`
        icsContent += `SUMMARY:${item.title}\n`
        icsContent += `DESCRIPTION:${item.description || ''}\n`
        icsContent += `LOCATION:${item.location}\n`
        icsContent += 'END:VEVENT\n'
      })
    })
    
    icsContent += 'END:VCALENDAR'
    return icsContent
  }

  const formatDateForICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Export & Share</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setExportFormat('pdf')}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                exportFormat === 'pdf'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFilePdf className="mr-2" />
              PDF Export
            </button>
            <button
              onClick={() => setExportFormat('calendar')}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                exportFormat === 'calendar'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaCalendarAlt className="mr-2" />
              Calendar
            </button>
            <button
              onClick={() => setExportFormat('share')}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                exportFormat === 'share'
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaShare className="mr-2" />
              Share Link
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {exportFormat === 'pdf' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Export as PDF</h3>
              <p className="text-gray-600 mb-6">
                Generate a beautifully formatted PDF document with your complete itinerary, 
                including all activities, timings, locations, and notes.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium mb-2">PDF will include:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete day-by-day schedule</li>
                  <li>• Activity details and locations</li>
                  <li>• Cost breakdown and budget summary</li>
                  <li>• Travel notes and recommendations</li>
                  <li>• Contact information and booking details</li>
                </ul>
              </div>

              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FaDownload className="mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          )}

          {exportFormat === 'calendar' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Export to Calendar</h3>
              <p className="text-gray-600 mb-6">
                Download an .ics file that you can import into any calendar application 
                like Google Calendar, Outlook, or Apple Calendar.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium mb-2">Calendar events will include:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All activities with correct dates and times</li>
                  <li>• Location information for each event</li>
                  <li>• Activity descriptions and notes</li>
                  <li>• Reminders and notifications</li>
                </ul>
              </div>

              <Button
                onClick={handleExportCalendar}
                disabled={isExporting}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Calendar...
                  </>
                ) : (
                  <>
                    <FaCalendarAlt className="mr-2" />
                    Download Calendar File
                  </>
                )}
              </Button>
            </div>
          )}

          {exportFormat === 'share' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Share Itinerary</h3>
              <p className="text-gray-600 mb-6">
                Create a shareable link that allows others to view and collaborate on your itinerary.
              </p>

              {/* Share Link */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shareable Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareUrl || 'Click "Generate Link" to create a shareable URL'}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-white text-sm"
                  />
                  <Button
                    onClick={handleCopyLink}
                    className={`rounded-l-none ${
                      copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {copied ? <FaCheckCircle /> : <FaCopy />}
                  </Button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 mt-2">Link copied to clipboard!</p>
                )}
              </div>

              {/* Social Sharing */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Share on Social Media</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleSocialShare('whatsapp')}
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <FaWhatsapp className="mr-2 text-green-600" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => handleSocialShare('facebook')}
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <FaFacebook className="mr-2 text-blue-600" />
                    Facebook
                  </Button>
                  <Button
                    onClick={() => handleSocialShare('twitter')}
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <FaTwitter className="mr-2 text-blue-400" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => handleSocialShare('email')}
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <FaEnvelope className="mr-2 text-gray-600" />
                    Email
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <FaQrcode className="text-4xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  QR Code generation will be available in the next update
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ItineraryExport