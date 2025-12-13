import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaArrowLeft, FaShare, FaBookmark, FaHeart, FaEye, FaClock,
  FaCalendar, FaUser, FaTag, FaComment, FaPrint, FaDownload,
  FaPlay, FaImage, FaVolumeUp, FaExternalLinkAlt
} from 'react-icons/fa'
import {
  ImageGallery, VideoPlayer, AudioPlayer, ShareButtons,
  QuoteBlock, InfoBox, RichTextRenderer
} from '../components/RichContentRenderer'

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'audio'
  url: string
  thumbnail?: string
  title?: string
  description?: string
  duration?: number
  size?: string
}

interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'video' | 'audio' | 'gallery' | 'quote' | 'info' | 'embed'
  content: any
  position: number
}

interface Article {
  id: string
  title: string
  content: string
  richContent?: ContentBlock[]
  excerpt: string
  author: string
  authorBio?: string
  authorImage?: string
  publishedAt: string
  updatedAt?: string
  category: string
  tags: string[]
  readTime: number
  views: number
  likes: number
  comments: number
  shares: number
  image: string
  gallery?: MediaItem[]
  videos?: MediaItem[]
  audios?: MediaItem[]
  relatedArticles?: Article[]
  sources?: string[]
  externalLinks?: { title: string; url: string }[]
}

const ArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Mock article data with rich content
  const mockArticle: Article = {
    id: '1',
    title: 'The Ancient Rock Churches of Lalibela: A Marvel of Ethiopian Architecture',
    excerpt: 'Discover the magnificent 12th-century rock-hewn churches that make Lalibela a UNESCO World Heritage site.',
    author: 'Dr. Alemayehu Teshome',
    authorBio: 'Dr. Alemayehu Teshome is a renowned Ethiopian archaeologist and cultural historian specializing in medieval Ethiopian architecture and religious heritage sites.',
    authorImage: '/images/authors/alemayehu.jpg',
    publishedAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-05T14:30:00Z',
    category: 'Religious Heritage',
    tags: ['architecture', 'religion', 'UNESCO', 'medieval', 'pilgrimage', 'Lalibela'],
    readTime: 12,
    views: 15420,
    likes: 892,
    comments: 47,
    shares: 156,
    image: '/images/lalibela-main.jpg',
    content: `
      <p class="lead">The rock-hewn churches of Lalibela represent one of the most extraordinary architectural achievements in human history. Carved directly from solid volcanic rock in the 12th century, these eleven medieval monolithic churches continue to serve as active places of worship for Ethiopian Orthodox Christians.</p>
      
      <h2 id="historical-background">Historical Background</h2>
      <p>King Lalibela, who ruled Ethiopia in the late 12th and early 13th centuries, commissioned these remarkable structures as part of his vision to create a "New Jerusalem" in the Ethiopian highlands. The churches were designed to allow Christian pilgrims to experience the holy sites of Jerusalem without making the dangerous journey to the actual city.</p>
      
      <h2 id="architectural-marvel">Architectural Marvel</h2>
      <p>Each church was carved downward from a single piece of rock, creating both the exterior and interior spaces through subtraction rather than addition. The most famous of these churches is the Church of St. George (Bet Giyorgis), which stands as a perfect example of this unique construction technique.</p>
      
      <h2 id="religious-significance">Religious Significance</h2>
      <p>The churches remain active centers of worship, particularly during major Ethiopian Orthodox festivals like Timkat (Epiphany) and Meskel (Finding of the True Cross). During these celebrations, thousands of pilgrims gather to participate in colorful processions and religious ceremonies.</p>
      
      <h2 id="unesco-status">UNESCO World Heritage Status</h2>
      <p>Recognized by UNESCO in 1978, the Lalibela churches are considered one of the wonders of the world. The site faces ongoing conservation challenges due to weathering, tourism pressure, and the need to balance preservation with continued religious use.</p>
      
      <h2 id="visiting-today">Visiting Lalibela Today</h2>
      <p>Modern visitors can explore all eleven churches, each with its own unique architectural features and religious significance. The site offers guided tours that explain the historical context, construction techniques, and ongoing religious practices that make Lalibela a living heritage site.</p>
    `,
    gallery: [
      {
        id: '1',
        type: 'image',
        url: '/images/lalibela/church-george.jpg',
        title: 'Church of St. George (Bet Giyorgis)',
        description: 'The most famous and well-preserved of the Lalibela churches, carved in the shape of a Greek cross.'
      },
      {
        id: '2',
        type: 'image',
        url: '/images/lalibela/church-mary.jpg',
        title: 'Church of St. Mary (Bet Maryam)',
        description: 'One of the largest churches in the complex, featuring intricate carved windows and decorative elements.'
      },
      {
        id: '3',
        type: 'image',
        url: '/images/lalibela/church-emmanuel.jpg',
        title: 'Church of Emmanuel (Bet Emmanuel)',
        description: 'Known for its exceptional preservation and detailed architectural features.'
      },
      {
        id: '4',
        type: 'image',
        url: '/images/lalibela/pilgrims.jpg',
        title: 'Pilgrims during Timkat Festival',
        description: 'Thousands of Orthodox Christians gather annually for the Epiphany celebrations.'
      },
      {
        id: '5',
        type: 'image',
        url: '/images/lalibela/aerial-view.jpg',
        title: 'Aerial View of the Church Complex',
        description: 'The layout of the churches follows a symbolic representation of Jerusalem.'
      }
    ],
    videos: [
      {
        id: '1',
        type: 'video',
        url: '/videos/lalibela-documentary.mp4',
        thumbnail: '/images/video-thumbs/lalibela-doc.jpg',
        title: 'Lalibela: Engineering Marvel of Medieval Ethiopia',
        description: 'A comprehensive documentary exploring the construction techniques and religious significance of the rock churches.',
        duration: 1800
      },
      {
        id: '2',
        type: 'video',
        url: '/videos/timkat-celebration.mp4',
        thumbnail: '/images/video-thumbs/timkat.jpg',
        title: 'Timkat Festival at Lalibela',
        description: 'Experience the vibrant Epiphany celebrations at the holy site.',
        duration: 900
      }
    ],
    audios: [
      {
        id: '1',
        type: 'audio',
        url: '/audio/lalibela-guide.mp3',
        title: 'Audio Guide: Walking Tour of Lalibela',
        description: 'Professional narration guiding you through each church with historical context and architectural details.',
        duration: 2400
      },
      {
        id: '2',
        type: 'audio',
        url: '/audio/orthodox-chants.mp3',
        title: 'Ethiopian Orthodox Chants',
        description: 'Traditional religious music performed during ceremonies at Lalibela.',
        duration: 1200
      }
    ],
    richContent: [
      {
        id: '1',
        type: 'quote',
        content: {
          quote: 'Lalibela is not just a collection of ancient buildings; it is a living testament to the faith and ingenuity of medieval Ethiopian civilization.',
          author: 'Prof. Richard Pankhurst',
          source: 'Ethiopian Historical Review, 1995'
        },
        position: 1
      },
      {
        id: '2',
        type: 'info',
        content: {
          title: 'Did You Know?',
          content: 'The Church of St. George was carved from a single block of volcanic rock and stands 15 meters high. It took an estimated 24 years to complete.',
          type: 'info'
        },
        position: 2
      },
      {
        id: '3',
        type: 'embed',
        content: {
          title: 'Interactive 3D Model',
          url: 'https://sketchfab.com/models/lalibela-church',
          description: 'Explore a detailed 3D model of the Church of St. George'
        },
        position: 3
      }
    ],
    sources: [
      'Pankhurst, R. (1995). "The Rock Churches of Lalibela." Ethiopian Historical Review.',
      'UNESCO World Heritage Centre. (1978). "Rock-Hewn Churches, Lalibela." World Heritage List.',
      'Phillipson, D. W. (2009). "Ancient Churches of Ethiopia." Yale University Press.',
      'Gerster, G. (1970). "Churches in Rock: Early Christian Art in Ethiopia." Phaidon Press.'
    ],
    externalLinks: [
      { title: 'UNESCO World Heritage Site', url: 'https://whc.unesco.org/en/list/18/' },
      { title: 'Ethiopian Orthodox Church', url: 'https://www.ethiopianorthodox.org/' },
      { title: 'Lalibela Tourism Office', url: 'https://www.ethiopia.travel/lalibela' }
    ]
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setArticle(mockArticle)
      setLoading(false)
    }, 1000)
  }, [articleId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Article</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-4">The requested article could not be loaded.</p>
          <Button onClick={() => navigate('/cultural')} variant="primary">
            Return to Culture Hub
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/cultural')}
            >
              <FaArrowLeft className="mr-2" />
              Back to Culture Hub
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? 'text-red-600 border-red-600' : ''}
              >
                <FaHeart className="mr-1" />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? 'text-blue-600 border-blue-600' : ''}
              >
                <FaBookmark className="mr-1" />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <FaShare className="mr-1" />
                Share
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{article.category}</span>
            <span>•</span>
            <div className="flex items-center">
              <FaClock className="mr-1" />
              {article.readTime} min read
            </div>
            <span>•</span>
            <div className="flex items-center">
              <FaEye className="mr-1" />
              {article.views.toLocaleString()} views
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaUser className="mr-2 text-gray-400" />
                <span className="font-medium text-gray-900">{article.author}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaCalendar className="mr-2" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <FaHeart className="mr-1" />
                {article.likes.toLocaleString()}
              </div>
              <Button variant="outline" size="sm">
                <FaPrint className="mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <FaDownload className="mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg mb-8 relative overflow-hidden">
              <div className="flex items-center justify-center h-64">
                <span className="text-6xl">⛪</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black bg-opacity-50 text-white p-3 rounded-lg">
                  <p className="text-sm">Featured Image: {article.title}</p>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-8">
                <RichTextRenderer content={article.content} />

                {/* Rich Content Blocks */}
                {article.richContent?.map(block => (
                  <div key={block.id} className="my-8">
                    {block.type === 'quote' && (
                      <QuoteBlock
                        quote={block.content.quote}
                        author={block.content.author}
                        source={block.content.source}
                      />
                    )}
                    {block.type === 'info' && (
                      <InfoBox
                        title={block.content.title}
                        content={block.content.content}
                        type={block.content.type}
                      />
                    )}
                    {block.type === 'embed' && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                        <h4 className="font-semibold text-gray-900 mb-2">{block.content.title}</h4>
                        <p className="text-gray-600 mb-4">{block.content.description}</p>
                        <Button variant="primary">
                          <FaExternalLinkAlt className="mr-2" />
                          View Interactive Model
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Media Gallery */}
              {article.gallery && article.gallery.length > 0 && (
                <div className="border-t border-gray-200">
                  <ImageGallery 
                    images={article.gallery} 
                    title="Photo Gallery"
                  />
                </div>
              )}

              {/* Video Content */}
              {article.videos && article.videos.length > 0 && (
                <div className="border-t border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaPlay className="mr-2 text-red-600" />
                    Video Content
                  </h3>
                  <div className="space-y-6">
                    {article.videos.map(video => (
                      <VideoPlayer key={video.id} video={video} />
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Content */}
              {article.audios && article.audios.length > 0 && (
                <div className="border-t border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaVolumeUp className="mr-2 text-blue-600" />
                    Audio Content
                  </h3>
                  <div className="space-y-4">
                    {article.audios.map(audio => (
                      <AudioPlayer key={audio.id} audio={audio} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sources and References */}
              {article.sources && article.sources.length > 0 && (
                <div className="border-t border-gray-200 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources and References</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    {article.sources.map((source, index) => (
                      <li key={index}>{source}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* External Links */}
              {article.externalLinks && article.externalLinks.length > 0 && (
                <div className="border-t border-gray-200 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">External Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {article.externalLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <FaExternalLinkAlt className="mr-3 text-blue-600" />
                        <span className="font-medium text-gray-900">{link.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="border-t border-gray-200 p-8">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaTag className="mr-2" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 cursor-pointer transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share and Engagement */}
              <div className="border-t border-gray-200 p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isLiked 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FaHeart />
                      <span>{article.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      <FaComment />
                      <span>{article.comments}</span>
                    </button>
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isBookmarked 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FaBookmark />
                      <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                  
                  <ShareButtons
                    url={window.location.href}
                    title={article.title}
                    description={article.excerpt}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Article Metrics */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Article Metrics</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{article.views.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{article.likes.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{article.comments}</div>
                    <div className="text-xs text-gray-600">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{article.shares}</div>
                    <div className="text-xs text-gray-600">Shares</div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-blue-600">{article.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Read Time:</span>
                    <span className="font-medium">{article.readTime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published:</span>
                    <span className="font-medium">{formatDate(article.publishedAt)}</span>
                  </div>
                  {article.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Updated:</span>
                      <span className="font-medium">{formatDate(article.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Author Info */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">About the Author</h4>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {article.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{article.author}</div>
                    <div className="text-sm text-gray-600">Cultural Historian & Archaeologist</div>
                  </div>
                </div>
                {article.authorBio && (
                  <p className="text-sm text-gray-600 mb-4">{article.authorBio}</p>
                )}
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                  <Button variant="outline" size="sm">
                    More Articles
                  </Button>
                </div>
              </div>

              {/* Table of Contents */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Table of Contents</h4>
                <nav className="space-y-2">
                  <a href="#historical-background" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Historical Background
                  </a>
                  <a href="#architectural-marvel" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Architectural Marvel
                  </a>
                  <a href="#religious-significance" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Religious Significance
                  </a>
                  <a href="#unesco-status" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    UNESCO World Heritage Status
                  </a>
                  <a href="#visiting-today" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Visiting Lalibela Today
                  </a>
                </nav>
              </div>

              {/* Media Summary */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Media Content</h4>
                <div className="space-y-3">
                  {article.gallery && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaImage className="text-blue-600" />
                        <span className="text-sm text-gray-700">Photo Gallery</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{article.gallery.length} images</span>
                    </div>
                  )}
                  {article.videos && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaPlay className="text-red-600" />
                        <span className="text-sm text-gray-700">Videos</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{article.videos.length} videos</span>
                    </div>
                  )}
                  {article.audios && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaVolumeUp className="text-green-600" />
                        <span className="text-sm text-gray-700">Audio Content</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{article.audios.length} tracks</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Button variant="primary" className="w-full justify-start" onClick={handleShare}>
                    <FaShare className="mr-2" />
                    Share Article
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FaPrint className="mr-2" />
                    Print Article
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FaDownload className="mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FaBookmark className="mr-2" />
                    Save for Later
                  </Button>
                </div>
              </div>

              {/* Related Articles */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Related Articles</h4>
                <div className="space-y-4">
                  {[
                    { 
                      title: 'Timkat Festival: Ethiopian Orthodox Epiphany', 
                      readTime: 5, 
                      views: '8.2K',
                      category: 'Religious Festivals'
                    },
                    { 
                      title: 'Ancient Axum: Cradle of Ethiopian Civilization', 
                      readTime: 7, 
                      views: '12.1K',
                      category: 'History & Archaeology'
                    },
                    { 
                      title: 'Ethiopian Orthodox Art: Illuminated Manuscripts', 
                      readTime: 6, 
                      views: '6.8K',
                      category: 'Art & Culture'
                    }
                  ].map((related, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                      <h5 className="font-medium text-gray-900 text-sm mb-2 hover:text-blue-600">
                        {related.title}
                      </h5>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            {related.readTime} min
                          </div>
                          <div className="flex items-center">
                            <FaEye className="mr-1" />
                            {related.views}
                          </div>
                        </div>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{related.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticlePage