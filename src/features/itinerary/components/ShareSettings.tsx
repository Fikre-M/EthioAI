import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaShare, FaLock, FaUnlock, FaUsers, FaEye, FaEdit, FaCrown,
  FaTrash, FaCopy, FaEnvelope, FaGlobe, FaShieldAlt, FaTimes,
  FaCheckCircle, FaExclamationTriangle, FaUserPlus, FaCog
} from 'react-icons/fa'

interface ShareSettingsProps {
  itineraryId: string
  isOpen: boolean
  onClose: () => void
  onShare: (settings: ShareSettings) => void
}

interface ShareSettings {
  isPublic: boolean
  allowComments: boolean
  allowEditing: boolean
  requireApproval: boolean
  expiresAt?: string
  password?: string
}

interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: string
  lastActive: string
  status: 'active' | 'pending' | 'revoked'
}

const ShareSettings: React.FC<ShareSettingsProps> = ({
  itineraryId,
  isOpen,
  onClose,
  onShare
}) => {
  const [settings, setSettings] = useState<ShareSettings>({
    isPublic: false,
    allowComments: true,
    allowEditing: false,
    requireApproval: true
  })
  
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'editor',
      joinedAt: '2024-01-20T10:15:00Z',
      lastActive: '2024-01-25T14:20:00Z',
      status: 'active'
    },
    {
      id: 'user-2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'viewer',
      joinedAt: '2024-01-21T09:30:00Z',
      lastActive: '2024-01-24T18:45:00Z',
      status: 'active'
    },
    {
      id: 'user-3',
      name: 'David Wilson',
      email: 'david@example.com',
      role: 'viewer',
      joinedAt: '2024-01-22T11:00:00Z',
      lastActive: '2024-01-25T12:10:00Z',
      status: 'pending'
    }
  ])
  
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer')
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'collaborators' | 'advanced'>('general')

  if (!isOpen) return null

  const generateShareUrl = () => {
    const token = Math.random().toString(36).substring(2, 15)
    const url = `${window.location.origin}/itinerary/shared/${token}`
    setShareUrl(url)
    return url
  }

  const handleCopyLink = () => {
    const url = shareUrl || generateShareUrl()
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInviteUser = () => {
    if (!inviteEmail.trim()) return
    
    const newCollaborator: Collaborator = {
      id: `user-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      status: 'pending'
    }
    
    setCollaborators([...collaborators, newCollaborator])
    setInviteEmail('')
    alert(`Invitation sent to ${inviteEmail}!`)
  }

  const handleRoleChange = (userId: string, newRole: 'editor' | 'viewer') => {
    setCollaborators(collaborators.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
  }

  const handleRemoveUser = (userId: string) => {
    if (confirm('Are you sure you want to remove this collaborator?')) {
      setCollaborators(collaborators.filter(user => user.id !== userId))
    }
  }

  const handleSaveSettings = () => {
    onShare(settings)
    onClose()
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <FaCrown className="text-purple-600" />
      case 'editor': return <FaEdit className="text-blue-600" />
      case 'viewer': return <FaEye className="text-gray-600" />
      default: return <FaEye className="text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-purple-600 bg-purple-100'
      case 'editor': return 'text-blue-600 bg-blue-100'
      case 'viewer': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'revoked': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaShare className="text-2xl text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Share Settings</h2>
              <p className="text-gray-600">Manage who can access and edit your itinerary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-4 text-sm font-medium transition-all ${
                activeTab === 'general'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaCog className="mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab('collaborators')}
              className={`px-6 py-4 text-sm font-medium transition-all ${
                activeTab === 'collaborators'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaUsers className="mr-2" />
              Collaborators ({collaborators.length})
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-6 py-4 text-sm font-medium transition-all ${
                activeTab === 'advanced'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaShieldAlt className="mr-2" />
              Advanced
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Share Link */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Share Link</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex mb-3">
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
                    <p className="text-sm text-green-600">Link copied to clipboard!</p>
                  )}
                </div>
              </div>

              {/* Visibility Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Visibility</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {settings.isPublic ? <FaGlobe className="text-green-600 mr-3" /> : <FaLock className="text-gray-600 mr-3" />}
                      <div>
                        <div className="font-medium">
                          {settings.isPublic ? 'Public' : 'Private'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {settings.isPublic 
                            ? 'Anyone with the link can view this itinerary'
                            : 'Only invited collaborators can access this itinerary'
                          }
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.isPublic}
                        onChange={(e) => setSettings({ ...settings, isPublic: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Permissions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaEdit className="text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium">Allow Editing</div>
                        <div className="text-sm text-gray-600">
                          Collaborators can modify activities and details
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowEditing}
                        onChange={(e) => setSettings({ ...settings, allowEditing: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaUsers className="text-green-600 mr-3" />
                      <div>
                        <div className="font-medium">Allow Comments</div>
                        <div className="text-sm text-gray-600">
                          Collaborators can add comments and suggestions
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowComments}
                        onChange={(e) => setSettings({ ...settings, allowComments: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collaborators' && (
            <div className="space-y-6">
              {/* Invite New Collaborator */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Invite Collaborators</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex space-x-3 mb-3">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>
                    <Button
                      onClick={handleInviteUser}
                      disabled={!inviteEmail.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <FaUserPlus className="mr-2" />
                      Invite
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Invited users will receive an email with access to this itinerary
                  </p>
                </div>
              </div>

              {/* Current Collaborators */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Collaborators</h3>
                <div className="space-y-3">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          {collaborator.avatar ? (
                            <img src={collaborator.avatar} alt={collaborator.name} className="w-10 h-10 rounded-full" />
                          ) : (
                            <span className="text-sm font-medium">
                              {collaborator.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{collaborator.name}</span>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(collaborator.status)}`}>
                              {collaborator.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">{collaborator.email}</div>
                          <div className="text-xs text-gray-500">
                            Last active: {formatTimestamp(collaborator.lastActive)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(collaborator.role)}
                          <select
                            value={collaborator.role}
                            onChange={(e) => handleRoleChange(collaborator.id, e.target.value as 'editor' | 'viewer')}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                            disabled={collaborator.role === 'owner'}
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                            {collaborator.role === 'owner' && <option value="owner">Owner</option>}
                          </select>
                        </div>
                        
                        {collaborator.role !== 'owner' && (
                          <Button
                            onClick={() => handleRemoveUser(collaborator.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Security Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaShieldAlt className="text-orange-600 mr-3" />
                      <div>
                        <div className="font-medium">Require Approval</div>
                        <div className="text-sm text-gray-600">
                          New collaborators need approval before accessing
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.requireApproval}
                        onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Expiration */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Link Expiration</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Expires At (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={settings.expiresAt || ''}
                      onChange={(e) => setSettings({ ...settings, expiresAt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-600">
                      Leave empty for permanent access
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Protection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Password Protection</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Password (Optional)
                    </label>
                    <input
                      type="password"
                      value={settings.password || ''}
                      onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                      placeholder="Enter password for additional security"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-600">
                      Visitors will need this password to access the itinerary
                    </p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="text-red-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900 mb-2">Revoke All Access</h4>
                      <p className="text-sm text-red-800 mb-4">
                        This will immediately revoke access for all collaborators and disable the share link.
                        This action cannot be undone.
                      </p>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Revoke All Access
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSaveSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ShareSettings