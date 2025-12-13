import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaArrowLeft, FaUsers, FaBroadcastTower, FaShoppingCart,
  FaCalendarAlt, FaComments, FaStar, FaFire, FaUserFriends, FaVideo
} from 'react-icons/fa'
import { LiveCulturalEvents } from '../components/LiveCulturalEvents'
import { CulturalMarketplace } from '../components/CulturalMarketplace'

const CulturalCommunityHub: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'events' | 'community' | 'marketplace' | 'discussions'>('events')

  const communityStats = {
    totalMembers: 12450,
    activeToday: 890,
    liveEvents: 3,
    totalEvents: 156,
    marketplaceItems: 234,
    discussions: 89
  }

  const featuredMembers = [
    {
      id: '1',
      name: 'Dr. Alemayehu Teshome',
      title: 'Cultural Historian',
      avatar: '/avatars/alemayehu.jpg',
      verified: true,
      followers: 2340,
      contributions: 45
    },
    {
      id: '2',
      name: 'Chef Meron Addis',
      title: 'Traditional Cuisine Expert',
      avatar: '/avatars/meron.jpg',
      verified: true,
      followers: 5200,
      contributions: 78
    },
    {
      id: '3',
      name: 'Almaz Tadesse',
      title: 'Coffee Ceremony Master',
      avatar: '/avatars/almaz.jpg',
      verified: true,
      followers: 2800,
      contributions: 32
    }
  ]

  const trendingTopics = [
    { tag: '#TimkatFestival', posts: 156, trend: 'up' },
    { tag: '#EthiopianCoffee', posts: 89, trend: 'up' },
    { tag: '#TraditionalClothing', posts: 67, trend: 'stable' },
    { tag: '#InjereRecipe', posts: 45, trend: 'up' },
    { tag: '#OromoMusic', posts: 34, trend: 'down' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/cultural')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FaUsers className="mr-3 text-blue-600" />
                  Cultural Community Hub
                </h1>
                <p className="text-gray-600 mt-1">Connect, learn, and celebrate Ethiopian culture together</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <FaVideo className="mr-2" />
                Go Live
              </Button>
              <Button>
                <FaUsers className="mr-2" />
                Join Community
              </Button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{communityStats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-blue-600">Members</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{communityStats.activeToday}</div>
              <div className="text-sm text-green-600">Active Today</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{communityStats.liveEvents}</div>
              <div className="text-sm text-red-600">Live Events</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{communityStats.totalEvents}</div>
              <div className="text-sm text-purple-600">Total Events</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">{communityStats.marketplaceItems}</div>
              <div className="text-sm text-orange-600">Marketplace</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-700">{communityStats.discussions}</div>
              <div className="text-sm text-yellow-600">Discussions</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'events', label: 'Live Events', icon: FaBroadcastTower },
              { id: 'community', label: 'Community Feed', icon: FaUserFriends },
              { id: 'marketplace', label: 'Marketplace', icon: FaShoppingCart },
              { id: 'discussions', label: 'Discussions', icon: FaComments }
            ].map(tab => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="text-sm" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'events' && <LiveCulturalEvents />}
            {activeTab === 'marketplace' && <CulturalMarketplace />}
            
            {activeTab === 'community' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Feed</h2>
                <div className="text-center py-12">
                  <FaUserFriends className="mx-auto text-4xl text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Community Feed Coming Soon</h3>
                  <p className="text-gray-600">Share your cultural experiences and connect with others.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'discussions' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Cultural Discussions</h2>
                <div className="text-center py-12">
                  <FaComments className="mx-auto text-4xl text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Discussions Coming Soon</h3>
                  <p className="text-gray-600">Join conversations about Ethiopian culture and traditions.</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Members */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaStar className="mr-2 text-yellow-500" />
                Featured Members
              </h3>
              <div className="space-y-4">
                {featuredMembers.map(member => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/default-avatar.png'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                        {member.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaStar className="text-white text-xs" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{member.title}</p>
                      <p className="text-xs text-gray-400">{member.followers} followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaFire className="mr-2 text-orange-500" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">{topic.tag}</p>
                      <p className="text-xs text-gray-500">{topic.posts} posts</p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      topic.trend === 'up' ? 'bg-green-100 text-green-800' :
                      topic.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {topic.trend === 'up' ? '↗' : topic.trend === 'down' ? '↘' : '→'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FaVideo className="mr-2" />
                  Start Live Event
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FaCalendarAlt className="mr-2" />
                  Schedule Event
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FaShoppingCart className="mr-2" />
                  Sell Item
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FaComments className="mr-2" />
                  Start Discussion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CulturalCommunityHub