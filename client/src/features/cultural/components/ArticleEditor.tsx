import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaSave, FaEye, FaImage, FaVideo, FaVolumeUp, FaQuoteLeft,
  FaInfoCircle, FaLink, FaPlus, FaTrash, FaArrowUp, FaArrowDown,
  FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaCode
} from 'react-icons/fa'

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'audio'
  url: string
  title?: string
  description?: string
}

interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'video' | 'audio' | 'gallery' | 'quote' | 'info' | 'embed'
  content: any
  position: number
}

interface ArticleData {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  blocks: ContentBlock[]
  gallery: MediaItem[]
  videos: MediaItem[]
  audios: MediaItem[]
}

interface ArticleEditorProps {
  initialData?: Partial<ArticleData>
  onSave: (data: ArticleData) => void
  onPreview: (data: ArticleData) => void
  className?: string
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  initialData,
  onSave,
  onPreview,
  className = ''
}) => {
  const [articleData, setArticleData] = useState<ArticleData>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    author: initialData?.author || '',
    blocks: initialData?.blocks || [],
    gallery: initialData?.gallery || [],
    videos: initialData?.videos || [],
    audios: initialData?.audios || []
  })

  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'settings'>('content')
  const [newTag, setNewTag] = useState('')

  const handleInputChange = (field: keyof ArticleData, value: any) => {
    setArticleData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !articleData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...articleData.tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', articleData.tags.filter(tag => tag !== tagToRemove))
  }

  const addContentBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      position: articleData.blocks.length
    }
    handleInputChange('blocks', [...articleData.blocks, newBlock])
  }

  const getDefaultContent = (type: ContentBlock['type']) => {
    switch (type) {
      case 'text':
        return '<p>Enter your text here...</p>'
      case 'quote':
        return { quote: '', author: '', source: '' }
      case 'info':
        return { title: 'Information', content: '', type: 'info' }
      case 'embed':
        return { title: '', url: '', description: '' }
      default:
        return {}
    }
  }

  const updateBlock = (blockId: string, content: any) => {
    handleInputChange('blocks', articleData.blocks.map(block =>
      block.id === blockId ? { ...block, content } : block
    ))
  }

  const removeBlock = (blockId: string) => {
    handleInputChange('blocks', articleData.blocks.filter(block => block.id !== blockId))
  }

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blocks = [...articleData.blocks]
    const index = blocks.findIndex(block => block.id === blockId)
    
    if (direction === 'up' && index > 0) {
      [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]]
    } else if (direction === 'down' && index < blocks.length - 1) {
      [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]]
    }
    
    handleInputChange('blocks', blocks)
  }

  const addMediaItem = (type: 'gallery' | 'videos' | 'audios') => {
    const newItem: MediaItem = {
      id: Date.now().toString(),
      type: type === 'gallery' ? 'image' : type === 'videos' ? 'video' : 'audio',
      url: '',
      title: '',
      description: ''
    }
    
    handleInputChange(type, [...articleData[type], newItem])
  }

  const updateMediaItem = (type: 'gallery' | 'videos' | 'audios', itemId: string, updates: Partial<MediaItem>) => {
    handleInputChange(type, articleData[type].map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ))
  }

  const removeMediaItem = (type: 'gallery' | 'videos' | 'audios', itemId: string) => {
    handleInputChange(type, articleData[type].filter(item => item.id !== itemId))
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Article Editor</h2>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => onPreview(articleData)}>
              <FaEye className="mr-2" />
              Preview
            </Button>
            <Button variant="primary" onClick={() => onSave(articleData)}>
              <FaSave className="mr-2" />
              Save Article
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'content', label: 'Content', icon: FaCode },
            { id: 'media', label: 'Media', icon: FaImage },
            { id: 'settings', label: 'Settings', icon: FaInfoCircle }
          ].map(tab => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="mr-2 inline" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="p-6">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  value={articleData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter article title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={articleData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category...</option>
                  <option value="Religious Heritage">Religious Heritage</option>
                  <option value="History & Archaeology">History & Archaeology</option>
                  <option value="Art & Culture">Art & Culture</option>
                  <option value="Music & Dance">Music & Dance</option>
                  <option value="Food & Cuisine">Food & Cuisine</option>
                  <option value="Cultural Traditions">Cultural Traditions</option>
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Excerpt
              </label>
              <textarea
                value={articleData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the article..."
              />
            </div>

            {/* Main Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Content
              </label>
              <div className="border border-gray-300 rounded-lg">
                {/* Toolbar */}
                <div className="border-b border-gray-200 p-3 flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                    <FaBold />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                    <FaItalic />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                    <FaUnderline />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                    <FaListUl />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                    <FaListOl />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                    <FaLink />
                  </button>
                </div>
                
                <textarea
                  value={articleData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border-0 focus:outline-none resize-none"
                  placeholder="Write your article content here... You can use HTML tags for formatting."
                />
              </div>
            </div>

            {/* Content Blocks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Content Blocks</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => addContentBlock('quote')}>
                    <FaQuoteLeft className="mr-1" />
                    Quote
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addContentBlock('info')}>
                    <FaInfoCircle className="mr-1" />
                    Info Box
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addContentBlock('embed')}>
                    <FaLink className="mr-1" />
                    Embed
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {articleData.blocks.map((block, index) => (
                  <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {block.type} Block
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveBlock(block.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <FaArrowUp />
                        </button>
                        <button
                          onClick={() => moveBlock(block.id, 'down')}
                          disabled={index === articleData.blocks.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <FaArrowDown />
                        </button>
                        <button
                          onClick={() => removeBlock(block.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {block.type === 'quote' && (
                      <div className="space-y-3">
                        <textarea
                          value={block.content.quote || ''}
                          onChange={(e) => updateBlock(block.id, { ...block.content, quote: e.target.value })}
                          placeholder="Enter quote text..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={block.content.author || ''}
                            onChange={(e) => updateBlock(block.id, { ...block.content, author: e.target.value })}
                            placeholder="Author name..."
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={block.content.source || ''}
                            onChange={(e) => updateBlock(block.id, { ...block.content, source: e.target.value })}
                            placeholder="Source..."
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {block.type === 'info' && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={block.content.title || ''}
                          onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                          placeholder="Info box title..."
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={block.content.content || ''}
                          onChange={(e) => updateBlock(block.id, { ...block.content, content: e.target.value })}
                          placeholder="Info box content..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={block.content.type || 'info'}
                          onChange={(e) => updateBlock(block.id, { ...block.content, type: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="info">Info</option>
                          <option value="warning">Warning</option>
                          <option value="success">Success</option>
                          <option value="error">Error</option>
                        </select>
                      </div>
                    )}

                    {block.type === 'embed' && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={block.content.title || ''}
                          onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                          placeholder="Embed title..."
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="url"
                          value={block.content.url || ''}
                          onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                          placeholder="Embed URL..."
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={block.content.description || ''}
                          onChange={(e) => updateBlock(block.id, { ...block.content, description: e.target.value })}
                          placeholder="Description..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            {/* Image Gallery */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaImage className="mr-2 text-blue-600" />
                  Image Gallery
                </h3>
                <Button variant="outline" onClick={() => addMediaItem('gallery')}>
                  <FaPlus className="mr-2" />
                  Add Image
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articleData.gallery.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Image {item.id}</span>
                      <button
                        onClick={() => removeMediaItem('gallery', item.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => updateMediaItem('gallery', item.id, { url: e.target.value })}
                        placeholder="Image URL..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => updateMediaItem('gallery', item.id, { title: e.target.value })}
                        placeholder="Image title..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => updateMediaItem('gallery', item.id, { description: e.target.value })}
                        placeholder="Image description..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaVideo className="mr-2 text-red-600" />
                  Videos
                </h3>
                <Button variant="outline" onClick={() => addMediaItem('videos')}>
                  <FaPlus className="mr-2" />
                  Add Video
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articleData.videos.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Video {item.id}</span>
                      <button
                        onClick={() => removeMediaItem('videos', item.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => updateMediaItem('videos', item.id, { url: e.target.value })}
                        placeholder="Video URL..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => updateMediaItem('videos', item.id, { title: e.target.value })}
                        placeholder="Video title..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => updateMediaItem('videos', item.id, { description: e.target.value })}
                        placeholder="Video description..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaVolumeUp className="mr-2 text-green-600" />
                  Audio Content
                </h3>
                <Button variant="outline" onClick={() => addMediaItem('audios')}>
                  <FaPlus className="mr-2" />
                  Add Audio
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articleData.audios.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Audio {item.id}</span>
                      <button
                        onClick={() => removeMediaItem('audios', item.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => updateMediaItem('audios', item.id, { url: e.target.value })}
                        placeholder="Audio URL..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => updateMediaItem('audios', item.id, { title: e.target.value })}
                        placeholder="Audio title..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => updateMediaItem('audios', item.id, { description: e.target.value })}
                        placeholder="Audio description..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={articleData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Author name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a tag..."
                />
                <Button variant="outline" onClick={addTag}>
                  <FaPlus />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {articleData.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleEditor