import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaUsers, FaShare, FaDownload, FaEdit, FaEye, FaComments,
  FaCalendarAlt, FaFilePdf, FaLink, FaUserPlus, FaCog,
  FaCheckCircle, FaArrowRight, FaPlay
} from 'react-icons/fa'

const CollaborationDemoPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const features = [
    {
      id: 'sharing',
      title: 'Smart Sharing',
      description: 'Share itineraries with customizable permissions and access controls',
      icon: <FaShare className="text-3xl text-blue-600" />,
      highlights: [
        'Public or private sharing',
        'Role-based permissions (Owner, Editor, Viewer)',
        'Password protection',
        'Link expiration',
        'Access approval workflow'
      ]
    },
    {
      id: 'collaboration',
      title: 'Real-time Collaboration',
      description: 'Work together on itineraries with live editing and comments',
      icon: <FaUsers className="text-3xl text-green-600" />,
      highlights: [
        'Live collaborative editing',
        'Real-time cursor tracking',
        'Activity comments and discussions',
        'Change notifications',
        'Conflict resolution'
      ]
    },
    {
      id: 'export',
      title: 'Export & Integration',
      description: 'Export itineraries in multiple formats for offline use',
      icon: <FaDownload className="text-3xl text-purple-600" />,
      highlights: [
        'PDF export with custom formatting',
        'Calendar integration (.ics files)',
        'Social media sharing',
        'QR code generation',
        'Email sharing'
      ]
    },
    {
      id: 'comments',
      title: 'Discussion System',
      description: 'Engage with collaborators through contextual comments',
      icon: <FaComments className="text-3xl text-orange-600" />,
      highlights: [
        'Activity-specific comments',
        'Reply threads',
        'Mention notifications',
        'Comment history',
        'Emoji reactions'
      ]
    }
  ]

  const demoScenarios = [
    {
      title: 'Family Trip Planning',
      description: 'Multiple family members collaborating on a vacation itinerary',
      participants: ['Mom (Owner)', 'Dad (Editor)', 'Kids (Viewers)'],
      actions: ['Share with family', 'Assign activities', 'Vote on options', 'Export calendar']
    },
    {
      title: 'Business Travel',
      description: 'Corporate travel planning with approval workflow',
      participants: ['Employee (Editor)', 'Manager (Viewer)', 'Travel Admin (Owner)'],
      actions: ['Create itinerary', 'Request approval', 'Book activities', 'Export PDF']
    },
    {
      title: 'Group Adventure',
      description: 'Friends planning an adventure trip together',
      participants: ['Trip Leader (Owner)', 'Friends (Editors)', 'Partners (Viewers)'],
      actions: ['Brainstorm activities', 'Split costs', 'Share updates', 'Create memories']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Collaboration & Sharing Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of collaborative travel planning with real-time editing, 
            smart sharing, and seamless export capabilities.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`bg-white rounded-2xl shadow-lg p-6 transition-all cursor-pointer ${
                activeDemo === feature.id ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:shadow-xl'
              }`}
              onClick={() => setActiveDemo(activeDemo === feature.id ? null : feature.id)}
            >
              <div className="text-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              
              {activeDemo === feature.id && (
                <div className="space-y-2">
                  {feature.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                      {highlight}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Demo Scenarios */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo Scenarios</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {demoScenarios.map((scenario, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{scenario.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Participants:</h4>
                  <div className="space-y-1">
                    {scenario.participants.map((participant, pIndex) => (
                      <div key={pIndex} className="flex items-center text-sm text-gray-700">
                        <FaUserPlus className="text-blue-500 mr-2 text-xs" />
                        {participant}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Key Actions:</h4>
                  <div className="space-y-1">
                    {scenario.actions.map((action, aIndex) => (
                      <div key={aIndex} className="flex items-center text-sm text-gray-700">
                        <FaArrowRight className="text-green-500 mr-2 text-xs" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={() => navigate('/itinerary')}
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FaPlay className="mr-2" />
                  Try This Scenario
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Demo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Try the Features</h3>
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/itinerary/shared/demo-token')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                >
                  <FaEye className="mr-3" />
                  View Shared Itinerary
                </Button>
                
                <Button
                  onClick={() => navigate('/itinerary')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FaEdit className="mr-3" />
                  Collaborative Editor
                </Button>
                
                <Button
                  onClick={() => alert('Export demo will open export modal')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FaFilePdf className="mr-3" />
                  Export Features
                </Button>
                
                <Button
                  onClick={() => alert('Share settings demo will open share modal')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FaCog className="mr-3" />
                  Share Settings
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Experience</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <FaCheckCircle className="text-green-500 mr-2 mt-1 text-xs" />
                  <span>Real-time collaboration with multiple users editing simultaneously</span>
                </div>
                <div className="flex items-start">
                  <FaCheckCircle className="text-green-500 mr-2 mt-1 text-xs" />
                  <span>Contextual comments and discussions on specific activities</span>
                </div>
                <div className="flex items-start">
                  <FaCheckCircle className="text-green-500 mr-2 mt-1 text-xs" />
                  <span>Flexible sharing options with role-based permissions</span>
                </div>
                <div className="flex items-start">
                  <FaCheckCircle className="text-green-500 mr-2 mt-1 text-xs" />
                  <span>Professional PDF exports and calendar integration</span>
                </div>
                <div className="flex items-start">
                  <FaCheckCircle className="text-green-500 mr-2 mt-1 text-xs" />
                  <span>Social media sharing and QR code generation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Features */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Technical Highlights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Real-time Sync</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>• WebSocket connections</li>
                <li>• Operational transforms</li>
                <li>• Conflict resolution</li>
                <li>• Offline support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Security & Privacy</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>• End-to-end encryption</li>
                <li>• Access control lists</li>
                <li>• Audit logging</li>
                <li>• GDPR compliance</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Export & Integration</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>• PDF generation</li>
                <li>• Calendar standards</li>
                <li>• API integrations</li>
                <li>• Mobile apps</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/itinerary')}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
          >
            <FaUsers className="mr-3" />
            Start Collaborating Now
          </Button>
          <p className="text-gray-600 mt-4">
            Experience the future of collaborative travel planning
          </p>
        </div>
      </div>
    </div>
  )
}

export default CollaborationDemoPage