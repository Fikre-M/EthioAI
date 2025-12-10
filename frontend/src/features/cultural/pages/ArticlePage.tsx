import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import ContentCard, { CulturalContent } from '../components/ContentCard'
import { FaArrowLeft, FaCalendar, FaUser, FaClock, FaEye, FaHeart, FaShare, FaBookmark, FaPrint, FaComment } from 'react-icons/fa'

interface Article extends CulturalContent {
  content: string
  readingTime: number
  tags: string[]
  relatedArticles: string[]
  comments: Comment[]
}

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  likes: number
}

// Mock article data
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Ancient Rock Churches of Lalibela',
    description: 'Discover the magnificent 12th-century rock-hewn churches that make Lalibela a UNESCO World Heritage site and a center of Ethiopian Orthodox Christianity.',
    image: '/images/lalibela-churches.jpg',
    type: 'heritage',
    category: 'Religious Heritage',
    location: 'Lalibela, Amhara Region',
    date: '2024-12-15T00:00:00Z',
    duration: '2-3 hours read',
    views: 15420,
    likes: 892,
    featured: true,
    author: 'Dr. Alemayehu Teshome',
    publishedAt: '2024-12-01T10:00:00Z',
    readingTime: 12,
    tags: ['UNESCO', 'Christianity', 'Architecture', 'Medieval', 'Pilgrimage'],
    relatedArticles: ['3', '5'],
    content: `
# The Ancient Rock Churches of Lalibela

Lalibela, a small town in the Amhara region of Ethiopia, is home to one of the world's most remarkable architectural achievements. The eleven medieval monolithic rock-hewn churches, carved directly into the volcanic rock in the 12th and 13th centuries, represent a unique artistic achievement and bear exceptional testimony to the medieval and post-medieval civilization of Ethiopia.

## Historical Background

The churches were commissioned by King Lalibela (originally named Gebre Mesqel Lalibela) of the Zagwe dynasty, who ruled Ethiopia during the late 12th and early 13th centuries. According to Ethiopian Orthodox tradition, King Lalibela was divinely inspired to create a "New Jerusalem" in Ethiopia after Muslim conquests halted Christian pilgrimages to the Holy Land.

## Architectural Marvel

The churches are carved below ground level in solid volcanic rock, with complex drainage systems to protect them from flooding during the rainy season. The most famous of these churches is the Church of St. George (Bet Giyorgis), carved in the shape of a Greek cross and considered the masterpiece of the complex.

### The Church Groups

The churches are traditionally divided into two main groups:

**Northern Group:**
- Bet Maryam (House of Mary)
- Bet Meskel (House of the Cross)
- Bet Danaghel (House of Virgins)
- Bet Mikael (House of Michael)
- Bet Golgotha (House of Golgotha)

**Southern Group:**
- Bet Amanuel (House of Emmanuel)
- Bet Qeddus Mercoreus (House of St. Mercoreus)
- Bet Abba Libanos (House of Abbot Libanos)
- Bet Gabriel-Rufael (House of Gabriel and Raphael)
- Bet Lehem (House of Bethlehem)

## Religious Significance

Lalibela remains an active pilgrimage site for Ethiopian Orthodox Christians, particularly during Timkat (Ethiopian Orthodox Epiphany) and Genna (Ethiopian Orthodox Christmas). The churches continue to serve their original religious function, hosting regular services and religious ceremonies.

## UNESCO World Heritage Status

In 1978, the rock-hewn churches of Lalibela were inscribed on the UNESCO World Heritage List as a cultural site of outstanding universal value. The inscription recognizes both the architectural achievement and the continuing religious significance of the site.

## Conservation Challenges

The churches face several conservation challenges, including:
- Water infiltration and drainage issues
- Structural stability concerns
- Tourist impact management
- Balancing preservation with continued religious use

## Visiting Lalibela

Today, Lalibela welcomes thousands of visitors annually who come to witness this architectural wonder. The best time to visit is during the dry season (October to March), though the religious festivals offer unique cultural experiences despite larger crowds.

The churches represent not just architectural achievement, but a living testament to Ethiopian Orthodox Christianity and the ingenuity of medieval Ethiopian civilization.
    `,
    comments: [
      {
        id: '1',
        author: 'Sarah Johnson',
        content: 'Incredible article! I visited Lalibela last year and this perfectly captures the spiritual atmosphere of the place.',
        createdAt: '2024-12-02T14:30:00Z',
        likes: 12
      },
      {
        id: '2',
        author: 'Michael Tadesse',
        content: 'As an Ethiopian, I appreciate the detailed historical context provided here. Well researched!',
        createdAt: '2024-12-03T09:15:00Z',
        likes: 8
      }
    ]
  },
  {
    id: '4',
    title: 'Coffee Ceremony: The Heart of Ethiopian Culture',
    description: 'Learn about the traditional Ethiopian coffee ceremony, a social ritual that brings communities together and honors the birthplace of coffee.',
    image: '/images/coffee-ceremony.jpg',
    type: 'tradition',
    category: 'Cultural Traditions',
    location: 'Throughout Ethiopia',
    duration: '15 minutes read',
    views: 9840,
    likes: 523,
    featured: false,
    author: 'Cultural Heritage Society',
    publishedAt: '2024-11-30T16:45:00Z',
    readingTime: 8,
    tags: ['Coffee', 'Tradition', 'Social Ritual', 'Community', 'Culture'],
    relatedArticles: ['1', '5'],
    content: `
# Coffee Ceremony: The Heart of Ethiopian Culture

Ethiopia is widely recognized as the birthplace of coffee, and nowhere is this heritage more celebrated than in the traditional Ethiopian coffee ceremony. This ancient ritual is far more than simply preparing a beverage; it is a cornerstone of Ethiopian social life, community bonding, and cultural identity.

## The Sacred Ritual

The Ethiopian coffee ceremony is a time-honored tradition that brings people together in a spirit of community and respect. The ceremony typically takes place three times a day and can last for hours, emphasizing the importance of slowing down and connecting with others.

### The Three Rounds

The ceremony consists of three distinct rounds, each with its own significance:

1. **Abol** - The first round, representing blessing
2. **Tona** - The second round, symbolizing transformation  
3. **Baraka** - The third round, meaning blessing and is considered the most important

## The Ceremony Process

### Preparation
The ceremony begins with the washing of green coffee beans, followed by roasting them in a pan over an open flame. The aromatic smoke is wafted toward guests, who inhale deeply and offer blessings.

### Grinding and Brewing
The roasted beans are ground by hand using a mortar and pestle called "mukecha" and "zenezena." The ground coffee is then brewed in a traditional clay pot called a "jebena."

### Serving
Coffee is served in small cups called "cini" without handles, accompanied by popcorn, roasted barley, or other snacks.

## Cultural Significance

The coffee ceremony serves multiple important functions in Ethiopian society:

- **Community Building**: Neighbors, friends, and family gather to share news, discuss issues, and strengthen relationships
- **Conflict Resolution**: Disputes are often resolved during these gatherings
- **Spiritual Connection**: The ceremony includes prayers and blessings
- **Cultural Transmission**: Elders pass down traditions and wisdom to younger generations

## Regional Variations

While the basic structure remains consistent, different regions of Ethiopia have their own variations:

- **Sidamo Region**: Known for elaborate incense burning
- **Harrar**: Features unique serving vessels and preparation methods
- **Kaffa Province**: Considered the birthplace of coffee, with the most traditional ceremonies

## Modern Relevance

Despite modernization, the coffee ceremony remains central to Ethiopian culture. Even in urban areas and among the diaspora, families maintain this tradition as a way to preserve their cultural identity and stay connected to their roots.

The ceremony represents the Ethiopian values of hospitality, community, and respect for tradition, making it an essential experience for anyone seeking to understand Ethiopian culture.
    `,
    comments: [
      {
        id: '3',
        author: 'Almaz Bekele',
        content: 'This brings back so many memories of my grandmother\'s coffee ceremonies. Thank you for preserving this knowledge.',
        createdAt: '2024-12-01T11:20:00Z',
        likes: 15
      }
    ]
  }
]

const ArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>()
  const navigate = useNavigate()
  
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<CulturalContent[]>([])
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const foundArticle = mockArticles.find(a => a.id === articleId)
      if (foundArticle) {
        setArticle(foundArticle)
        
        // Fetch related articles
        const related = mockArticles.filter(a => 
          foundArticle.relatedArticles.includes(a.id)
        )
        setRelatedArticles(related)
      }
      
      setLoading(false)
    }

    if (articleId) {
      fetchArticle()
    }
  }, [articleId])

  const handleLike = () => {
    setIsLiked(!isLiked)
    // TODO: Implement actual like functionality
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // TODO: Implement actual bookmark functionality
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.description,
        url: window.location.href
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      // TODO: Implement comment submission
      console.log('New comment:', newComment)
      setNewComment('')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The requested article could not be found.</p>
          <Button variant="primary" onClick={() => navigate('/cultural')}>
            Back to Cultural Hub
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/cultural')}
              className="flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              Back to Cultural Hub
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleBookmark}
                className={isBookmarked ? 'text-yellow-600' : ''}
              >
                <FaBookmark className="mr-2" />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <FaShare className="mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <FaPrint className="mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
          {/* Hero Image */}
          <div className="h-64 md:h-96 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
            <span className="text-8xl">🏛️</span>
          </div>

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {article.category}
              </span>
              <span className="flex items-center">
                <FaCalendar className="mr-1" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center">
                <FaUser className="mr-1" />
                {article.author}
              </span>
              <span className="flex items-center">
                <FaClock className="mr-1" />
                {article.readingTime} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-6">
              {article.description}
            </p>

            {/* Article Stats */}
            <div className="flex items-center justify-between py-4 border-t border-b">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <FaEye className="mr-1" />
                  {article.views.toLocaleString()} views
                </span>
                <span className="flex items-center">
                  <FaHeart className="mr-1" />
                  {article.likes.toLocaleString()} likes
                </span>
                <span className="flex items-center">
                  <FaComment className="mr-1" />
                  {article.comments.length} comments
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center ${isLiked ? 'text-red-600 border-red-600' : ''}`}
                >
                  <FaHeart className="mr-1" />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mt-8">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: article.content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '<h2>').replace(/<h2>/g, '</p><h2 class="text-2xl font-bold mt-8 mb-4">').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }}
              />
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Comments ({article.comments.length})
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowComments(!showComments)}
            >
              {showComments ? 'Hide' : 'Show'} Comments
            </Button>
          </div>

          {showComments && (
            <div className="space-y-6">
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="border-b pb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this article..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <Button type="submit" variant="primary" disabled={!newComment.trim()}>
                    Post Comment
                  </Button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {article.comments.map(comment => (
                  <div key={comment.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {comment.author.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <FaHeart />
                        <span>{comment.likes}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map(relatedArticle => (
                <ContentCard
                  key={relatedArticle.id}
                  content={relatedArticle}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticlePage