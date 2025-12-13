import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import ArticleEditor from '../components/ArticleEditor'

interface ArticleData {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  blocks: any[]
  gallery: any[]
  videos: any[]
  audios: any[]
}

const ArticleEditorPage: React.FC = () => {
  const navigate = useNavigate()
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<ArticleData | null>(null)

  const handleSave = (data: ArticleData) => {
    console.log('Saving article:', data)
    // TODO: Implement save functionality
    alert('Article saved successfully!')
  }

  const handlePreview = (data: ArticleData) => {
    setPreviewData(data)
    setShowPreview(true)
  }

  const sampleData = {
    title: 'Sample Article: Ethiopian Coffee Culture',
    excerpt: 'Explore the rich tradition of Ethiopian coffee ceremonies and their cultural significance.',
    content: `
      <p>Ethiopia is widely recognized as the birthplace of coffee, and the Ethiopian coffee ceremony is one of the most important cultural traditions in the country.</p>
      
      <h2>The Coffee Ceremony</h2>
      <p>The traditional Ethiopian coffee ceremony is a social event that brings families and communities together. It involves roasting green coffee beans, grinding them by hand, and brewing the coffee in a traditional clay pot called a jebena.</p>
      
      <h2>Cultural Significance</h2>
      <p>The ceremony is more than just making coffee - it's a time for conversation, community bonding, and spiritual reflection. The process can take several hours and is often performed three times, with each round having its own name and significance.</p>
    `,
    category: 'Cultural Traditions',
    tags: ['coffee', 'ceremony', 'tradition', 'culture'],
    author: 'Cultural Heritage Team'
  }

  if (showPreview && previewData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <FaArrowLeft className="mr-2" />
              Back to Editor
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Article Preview</h1>
            <Button variant="primary" onClick={() => handleSave(previewData)}>
              <FaSave className="mr-2" />
              Save Article
            </Button>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {previewData.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{previewData.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{previewData.excerpt}</p>
            
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: previewData.content }} />
            
            {previewData.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {previewData.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/cultural')}>
            <FaArrowLeft className="mr-2" />
            Back to Culture Hub
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Create New Article</h1>
          <div className="w-32"></div> {/* Spacer for alignment */}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ArticleEditor
          initialData={sampleData}
          onSave={handleSave}
          onPreview={handlePreview}
        />
      </div>
    </div>
  )
}

export default ArticleEditorPage