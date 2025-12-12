import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import { Itinerary } from '../pages/ItineraryPage'
import DayPlan from './DayPlan'
import {
  FaShare, FaUsers, FaComment, FaHeart, FaCopy,
  FaExclamationTriangle, FaCheckCircle, FaArrowLeft, FaEye
} from 'react-icons/fa'

interface SharedItineraryProps {
  shareToken?: string
}

interface Comment {
  id: string
  author: string
  avatar?: string
  content: string
  timestamp: string
  dayIndex?: number
  itemId?: string
  replies?: Comment[]
}

interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: string
  lastActive: string
}

const SharedItinerary: React.FC<SharedItineraryProps> = ({
  shareToken
}) => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(true)
  const [showCollaborators, setShowCollaborators] = useState(false)
  const [userRole, setUserRole] = useState<'owner' | 'editor' | 'viewer'>('viewer')
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  const currentToken = shareToken || token

  useEffect(() => {
    if (currentToken) {
      loadSharedItinerary(currentToken)
    }
  }, [currentToken])

  const loadSharedItinerary = async (token: string) => {
    setIsLoading(true)
    
    try {
      // Simulate API call to load shared itinerary
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock shared itinerary data
      const mockItinerary: Itinerary = {
        id: 'shared-001',
        title: 'Ethiopian Highlands Adventure (Shared)',
        description: 'A collaborative 7-day journey through Ethiopia\'s stunning highlands',
        destination: 'Ethiopia',
        startDate: '2024-03-15',
        endDate: '2024-03-22',
        travelers: 4,
        totalBudget: 3000,
        actualCost: 2650,
        status: 'confirmed',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-25',
        days: [
          {
            date: '2024-03-15',
            totalCost: 380,
            totalDuration: 420,
            items: [
              {
                id: 'shared-item-1',
                type: 'flight',
                title: 'Arrival in Addis Ababa',
                description: 'Ethiopian Airlines flight from international destination',
                location: 'Bole International Airport',
                startTime: '15:30',
                endTime: '16:30',
                duration: 60,
                price: 0,
                category: 'Transportation',
                bookingStatus: 'confirmed'
              },
              {
                id: 'shared-item-2',
                type: 'hotel',
                title: 'Sheraton Addis Check-in',
                description: 'Luxury accommodation in the heart of Addis Ababa',
                location: 'Addis Ababa',
                startTime: '17:00',
                endTime: '17:30',
                duration: 30,
                price: 180,
                category: 'Accommodation',
                bookingStatus: 'confirmed'
              },
              {
                id: 'shared-item-3',
                type: 'restaurant',
                title: 'Welcome Dinner at Yod Abyssinia',
                description: 'Traditional Ethiopian feast with cultural show',
                location: 'Yod Abyssinia Cultural Restaurant',
                startTime: '19:00',
                endTime: '21:30',
                duration: 150,
                price: 45,
                category: 'Dining',
                bookingStatus: 'confirmed'
              }
            ],
            notes: 'Welcome to Ethiopia! First day to settle in and experience local culture.'
          }
        ]
      }
      
      // Mock comments
      const mockComments: Comment[] = [
        {
          id: 'comment-1',
          author: 'Sarah Johnson',
          avatar: '/avatars/sarah.jpg',
          content: 'This itinerary looks amazing! I\'m so excited for the Yod Abyssinia dinner.',
          timestamp: '2024-01-22T10:30:00Z',
          dayIndex: 0
        },
        {
          id: 'comment-2',
          author: 'Mike Chen',
          content: 'Should we book the Sheraton or look for something more budget-friendly?',
          timestamp: '2024-01-22T14:15:00Z',
          itemId: 'shared-item-2',
          replies: [
            {
              id: 'reply-1',
              author: 'Emily Davis',
              content: 'I think Sheraton is worth it for the first night. We can do budget places later.',
              timestamp: '2024-01-22T15:00:00Z'
            }
          ]
        }
      ]
      
      // Mock collaborators
      const mockCollaborators: Collaborator[] = [
        {
          id: 'user-1',
          name: 'Emily Davis',
          email: 'emily@example.com',
          avatar: '/avatars/emily.jpg',
          role: 'owner',
          joinedAt: '2024-01-20T08:00:00Z',
          lastActive: '2024-01-25T16:30:00Z'
        },
        {
          id: 'user-2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          role: 'editor',
          joinedAt: '2024-01-20T10:15:00Z',
          lastActive: '2024-01-25T14:20:00Z'
        }
      ]
      
      setItinerary(mockItinerary)
      setComments(mockComments)
      setCollaborators(mockCollaborators)
      setUserRole('editor')
      setLikes(12)
      setIsLoading(false)
      
    } catch (error) {
      console.error('Error loading shared itinerary:', error)
      setIsLoading(false)
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'Current User',
      content: newComment,
      timestamp: new Date().toISOString(),
      dayIndex: selectedDay
    }
    
    setComments([...comments, comment])
    setNewComment('')
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/itinerary/shared/${currentToken}`
    navigator.clipboard.writeText(shareUrl)
    alert('Share link copied to clipboard!')
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-purple-600 bg-purple-100'
      case 'editor': return 'text-blue-600 bg-blue-100'
      case 'viewer': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared itinerary...</p>
        </div>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary Not Found</h2>
          <p className="text-gray-600 mb-6">This shared itinerary may have been removed or the link is invalid.</p>
          <Button onClick={() => navigate('/itinerary')} className="bg-red-600 hover:bg-red-700 text-white">
            Go to My Itineraries
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button
                onClick={() => navigate('/itinerary')}
                variant="outline"
                className="mr-4"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center mb-2">
                  <FaShare className="text-2xl text-blue-600 mr-3" />
                  <h1 className="text-2xl font-bold text-gray-900">{itinerary.title}</h1>
                  <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Shared
                  </span>
                </div>
                <p className="text-gray-600">{itinerary.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                  isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                }`}
              >
                <FaHeart className={`mr-1 ${isLiked ? 'text-red-500' : ''}`} />
                {likes}
              </button>
              
              <Button
                onClick={handleCopyLink}
                variant="outline"
              >
                <FaCopy className="mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Collaboration Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaUsers className="mr-1" />
                {collaborators.length} collaborators
              </div>
              <div className="flex items-center">
                <FaComment className="mr-1" />
                {comments.length} comments
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded text-xs ${getRoleColor(userRole)}`}>
                  Your role: {userRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Day Navigation */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex overflow-x-auto">
                  {itinerary.days.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all ${
                        selectedDay === index
                          ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div>Day {index + 1}</div>
                      <div className="text-xs opacity-75">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Day Content */}
              {itinerary.days[selectedDay] && (
                <DayPlan
                  day={itinerary.days[selectedDay]}
                  dayNumber={selectedDay + 1}
                  isEditing={userRole === 'owner' || userRole === 'editor'}
                  onUpdate={(updatedDay) => {
                    if (userRole === 'owner' || userRole === 'editor') {
                      const updatedDays = [...itinerary.days]
                      updatedDays[selectedDay] = updatedDay
                      setItinerary({ ...itinerary, days: updatedDays })
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Collaborators */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Collaborators</h3>
                <Button
                  onClick={() => setShowCollaborators(!showCollaborators)}
                  variant="outline"
                  size="sm"
                >
                  {showCollaborators ? <FaEye /> : <FaUsers />}
                </Button>
              </div>
              
              {showCollaborators ? (
                <div className="space-y-3">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          {collaborator.avatar ? (
                            <img src={collaborator.avatar} alt={collaborator.name} className="w-8 h-8 rounded-full" />
                          ) : (
                            <span className="text-xs font-medium">
                              {collaborator.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{collaborator.name}</div>
                          <div className="text-xs text-gray-500">
                            Active {formatTimestamp(collaborator.lastActive)}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getRoleColor(collaborator.role)}`}>
                        {collaborator.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex -space-x-2">
                  {collaborators.slice(0, 5).map((collaborator) => (
                    <div key={collaborator.id} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                      {collaborator.avatar ? (
                        <img src={collaborator.avatar} alt={collaborator.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <span className="text-xs font-medium">
                          {collaborator.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Comments</h3>
                <Button
                  onClick={() => setShowComments(!showComments)}
                  variant="outline"
                  size="sm"
                >
                  {showComments ? <FaEye /> : <FaComment />}
                </Button>
              </div>
              
              {showComments && (
                <div className="space-y-4">
                  {/* Add Comment */}
                  <div className="border-b border-gray-200 pb-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Comment
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-l-2 border-blue-200 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs font-medium">
                                {comment.author.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-sm">{comment.author}</div>
                              <div className="text-xs text-gray-500">
                                {formatTimestamp(comment.timestamp)}
                              </div>
                            </div>
                          </div>
                          {comment.dayIndex !== undefined && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Day {comment.dayIndex + 1}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                        
                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-4 space-y-2 border-l border-gray-200 pl-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="text-sm">
                                <div className="flex items-center mb-1">
                                  <span className="font-medium mr-2">{reply.author}</span>
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(reply.timestamp)}
                                  </span>
                                </div>
                                <p className="text-gray-700">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sharing Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <FaCheckCircle className="text-blue-600 mr-3 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Collaborative Itinerary</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {userRole === 'owner' ? 'You own this itinerary and can manage all settings' : 
                     userRole === 'editor' ? 'You can edit activities and add comments' :
                     'You can view and comment on this itinerary'}</li>
                <li>• Comments and changes are visible to all collaborators in real-time</li>
                <li>• Export to PDF or calendar to save your own copy</li>
                <li>• Share the link with others to invite them to collaborate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharedItinerary