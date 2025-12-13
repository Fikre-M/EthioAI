import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaArrowLeft, FaUpload, FaImage, FaVideo, FaFileAlt,
  FaMapMarkerAlt, FaUsers, FaHeart,
  FaShare, FaTimes, FaEye, FaEdit
} from 'react-icons/fa'

interface UserContribution {
  id: string
  type: 'story' | 'photo' | 'video' | 'experience' | 'recipe' | 'tradition'
  title: string
  content: string
  media?: {
    type: 'image' | 'video'
    url: string
    caption?: string
  }[]
  location?: string
  date?: Date
  tags: string[]
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  moderationNotes?: string
  likes: number
  views: number
  createdAt: Date
}

const ContributePage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'submit' | 'my-contributions' | 'community'>('submit')
  const [contributionType, setContributionType] = useState<'story' | 'photo' | 'experience'>('story')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    tags: '',
    category: 'general'
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contributionTypes = [
    {
      id: 'story',
      name: 'Cultural Story',
      icon: FaFileAlt,
      description: 'Share stories about Ethiopian traditions, customs, or personal experiences'
    },
    {
      id: 'photo',
      name: 'Photo Collection',
      icon: FaImage,
      description: 'Upload photos of festivals, traditional clothing, food, or cultural sites'
    },
    {
      id: 'experience',
      name: 'Travel Experience',
      icon: FaMapMarkerAlt,
      description: 'Share your travel experiences and recommendations in Ethiopia'
    }
  ]

  const categories = [
    'General Culture', 'Festivals & Celebrations', 'Traditional Food', 'Music & Dance',
    'Arts & Crafts', 'Historical Sites', 'Religious Traditions', 'Regional Customs'
  ]

  // Mock user contributions
  const mockContributions: UserContribution[] = [
    {
      id: '1',
      type: 'story',
      title: 'My First Timkat Experience in Gondar',
      content: 'Witnessing Timkat in Gondar was a life-changing experience. The devotion of the people, the colorful processions, and the spiritual atmosphere created memories that will last forever...',
      location: 'Gondar, Ethiopia',
      date: new Date('2024-01-19'),
      tags: ['timkat', 'gondar', 'festival', 'spiritual'],
      author: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        verified: false
      },
      status: 'approved',
      likes: 45,
      views: 234,
      createdAt: new Date('2024-01-25')
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Contribution submitted successfully! It will be reviewed by our community moderators.')
      setFormData({ title: '', content: '', location: '', tags: '', category: 'general' })
      setUploadedFiles([])
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/cultural')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FaUsers className="mr-3 text-purple-600" />
                  Community Contributions
                </h1>
                <p className="text-gray-600 mt-1">Share your Ethiopian cultural experiences with the community</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 max-w-md">
          {[
            { id: 'submit', label: 'Submit Content', icon: FaUpload },
            { id: 'my-contributions', label: 'My Contributions', icon: FaEdit },
            { id: 'community', label: 'Community Feed', icon: FaUsers }
          ].map(tab => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="text-sm" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Submit Content Tab */}
        {activeTab === 'submit' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Cultural Experience</h2>
              
              {/* Contribution Type Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What would you like to share?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contributionTypes.map(type => {
                    const IconComponent = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setContributionType(type.id as any)}
                        className={`p-6 rounded-lg border-2 text-left transition-colors ${
                          contributionType === type.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className={`text-2xl mb-3 ${
                          contributionType === type.id ? 'text-purple-600' : 'text-gray-400'
                        }`} />
                        <h4 className="font-semibold text-gray-900 mb-2">{type.name}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Submission Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Give your contribution a descriptive title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Share your story, experience, or cultural insights..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Where did this take place?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add tags separated by commas (e.g., timkat, festival, gondar)"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos/Videos (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload photos or videos</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, MP4 up to 10MB each</p>
                    </label>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {file.type.startsWith('image/') ? (
                              <FaImage className="text-blue-500" />
                            ) : (
                              <FaVideo className="text-red-500" />
                            )}
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Community Guidelines */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Community Guidelines</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Share authentic and respectful cultural content</li>
                    <li>• Ensure you have permission to share photos of people</li>
                    <li>• Provide accurate information about locations and traditions</li>
                    <li>• Be respectful of different cultural practices and beliefs</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <Button variant="outline" type="button">
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* My Contributions Tab */}
        {activeTab === 'my-contributions' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Contributions</h2>
              
              <div className="space-y-4">
                {mockContributions.map(contribution => (
                  <div key={contribution.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{contribution.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {contribution.location} • {contribution.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contribution.status)}`}>
                        {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-2">{contribution.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaEye className="mr-1" />
                          {contribution.views} views
                        </div>
                        <div className="flex items-center">
                          <FaHeart className="mr-1" />
                          {contribution.likes} likes
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <FaEdit className="mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <FaShare className="mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Community Feed Tab */}
        {activeTab === 'community' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Community Contributions</h2>
              
              <div className="text-center py-12">
                <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Community Feed Coming Soon</h3>
                <p className="text-gray-600">Discover amazing cultural stories and experiences shared by our community.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContributePage