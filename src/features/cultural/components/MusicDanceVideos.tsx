import React, { useState, useRef } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress,
  FaMusic, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaHeart,
  FaShare, FaDownload, FaFilter, FaSearch, FaEye, FaClock,
  FaForward, FaBackward, FaRandom, FaList, FaThLarge
} from 'react-icons/fa'

interface MusicDanceVideo {
  id: string
  title: string
  description: string
  type: 'music' | 'dance' | 'both'
  region: string
  ethnicity: string
  genre: string
  duration: number
  videoUrl: string
  thumbnailUrl: string
  artist?: string
  dancers?: string[]
  instruments?: string[]
  occasion: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  views: number
  likes: number
  uploadDate: string
  tags: string[]
  relatedVideos?: string[]
}

interface MusicDanceVideosProps {
  videos?: MusicDanceVideo[]
  className?: string
}

const MusicDanceVideos: React.FC<MusicDanceVideosProps> = ({
  videos: propVideos,
  className = ''
}) => {
  const [selectedVideo, setSelectedVideo] = useState<MusicDanceVideo | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterRegion, setFilterRegion] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [playlist, setPlaylist] = useState<string[]>([])
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Mock music and dance videos data
  const mockVideos: MusicDanceVideo[] = propVideos || [
    {
      id: '1',
      title: 'Eskista - Traditional Shoulder Dance',
      description: 'Learn the traditional Ethiopian shoulder dance Eskista, performed at celebrations and cultural events.',
      type: 'dance',
      region: 'Amhara',
      ethnicity: 'Amhara',
      genre: 'Traditional Dance',
      duration: 480,
      videoUrl: '/videos/eskista-dance.mp4',
      thumbnailUrl: '/images/video-thumbs/eskista.jpg',
      dancers: ['Melaku Belay', 'Selamawit Yohannes'],
      occasion: 'Weddings, festivals, celebrations',
      difficulty: 'intermediate',
      views: 25400,
      likes: 1200,
      uploadDate: '2024-11-15',
      tags: ['eskista', 'shoulder dance', 'traditional', 'amhara', 'celebration'],
      relatedVideos: ['2', '3']
    },
    {
      id: '2',
      title: 'Krar Music Performance',
      description: 'Beautiful performance on the traditional Ethiopian krar (lyre) with authentic melodies.',
      type: 'music',
      region: 'Amhara',
      ethnicity: 'Amhara',
      genre: 'Traditional Music',
      duration: 360,
      videoUrl: '/videos/krar-performance.mp4',
      thumbnailUrl: '/images/video-thumbs/krar.jpg',
      artist: 'Girma Yohannes',
      instruments: ['Krar', 'Voice'],
      occasion: 'Cultural performances, meditation',
      difficulty: 'advanced',
      views: 18200,
      likes: 890,
      uploadDate: '2024-11-10',
      tags: ['krar', 'traditional music', 'lyre', 'amhara', 'instrumental'],
      relatedVideos: ['1', '4']
    },
    {
      id: '3',
      title: 'Oromo Gada Ceremony Dance',
      description: 'Traditional dance performed during Oromo Gada ceremonies, showcasing cultural heritage.',
      type: 'dance',
      region: 'Oromia',
      ethnicity: 'Oromo',
      genre: 'Ceremonial Dance',
      duration: 600,
      videoUrl: '/videos/gada-dance.mp4',
      thumbnailUrl: '/images/video-thumbs/gada.jpg',
      dancers: ['Oromo Cultural Group'],
      occasion: 'Gada ceremonies, cultural festivals',
      difficulty: 'intermediate',
      views: 32100,
      likes: 1580,
      uploadDate: '2024-11-20',
      tags: ['oromo', 'gada', 'ceremony', 'traditional dance', 'cultural'],
      relatedVideos: ['5', '6']
    },
    {
      id: '4',
      title: 'Masinko Violin Performance',
      description: 'Soulful performance on the traditional Ethiopian masinko (one-string violin).',
      type: 'music',
      region: 'Amhara',
      ethnicity: 'Amhara',
      genre: 'Traditional Music',
      duration: 420,
      videoUrl: '/videos/masinko-performance.mp4',
      thumbnailUrl: '/images/video-thumbs/masinko.jpg',
      artist: 'Alemayehu Eshete',
      instruments: ['Masinko'],
      occasion: 'Cultural performances, storytelling',
      difficulty: 'advanced',
      views: 15600,
      likes: 720,
      uploadDate: '2024-11-08',
      tags: ['masinko', 'violin', 'traditional music', 'amhara', 'instrumental']
    },
    {
      id: '5',
      title: 'Tigray Traditional Dance',
      description: 'Energetic traditional dance from Tigray region, performed during cultural celebrations.',
      type: 'dance',
      region: 'Tigray',
      ethnicity: 'Tigray',
      genre: 'Folk Dance',
      duration: 540,
      videoUrl: '/videos/tigray-dance.mp4',
      thumbnailUrl: '/images/video-thumbs/tigray.jpg',
      dancers: ['Tigray Cultural Ensemble'],
      occasion: 'Festivals, weddings, cultural events',
      difficulty: 'beginner',
      views: 21800,
      likes: 980,
      uploadDate: '2024-11-12',
      tags: ['tigray', 'folk dance', 'traditional', 'cultural', 'celebration']
    },
    {
      id: '6',
      title: 'Sidama Coffee Ceremony Songs',
      description: 'Traditional songs performed during Sidama coffee ceremonies, celebrating coffee culture.',
      type: 'both',
      region: 'Sidama',
      ethnicity: 'Sidama',
      genre: 'Ceremonial Music',
      duration: 450,
      videoUrl: '/videos/sidama-coffee-songs.mp4',
      thumbnailUrl: '/images/video-thumbs/sidama.jpg',
      artist: 'Sidama Cultural Group',
      occasion: 'Coffee ceremonies, cultural gatherings',
      difficulty: 'beginner',
      views: 19400,
      likes: 850,
      uploadDate: '2024-11-18',
      tags: ['sidama', 'coffee ceremony', 'traditional songs', 'cultural', 'music']
    },
    {
      id: '7',
      title: 'Gurage Traditional Music and Dance',
      description: 'Vibrant performance combining Gurage traditional music and dance elements.',
      type: 'both',
      region: 'Gurage Zone',
      ethnicity: 'Gurage',
      genre: 'Folk Performance',
      duration: 480,
      videoUrl: '/videos/gurage-performance.mp4',
      thumbnailUrl: '/images/video-thumbs/gurage.jpg',
      artist: 'Gurage Cultural Association',
      dancers: ['Gurage Dance Troupe'],
      instruments: ['Traditional drums', 'Flute'],
      occasion: 'Cultural festivals, community celebrations',
      difficulty: 'intermediate',
      views: 16700,
      likes: 760,
      uploadDate: '2024-11-14',
      tags: ['gurage', 'traditional', 'music and dance', 'folk', 'cultural']
    },
    {
      id: '8',
      title: 'Afar Traditional Chants',
      description: 'Ancient chants and rhythms from the Afar people, reflecting nomadic culture.',
      type: 'music',
      region: 'Afar',
      ethnicity: 'Afar',
      genre: 'Traditional Chants',
      duration: 300,
      videoUrl: '/videos/afar-chants.mp4',
      thumbnailUrl: '/images/video-thumbs/afar.jpg',
      artist: 'Afar Elders Group',
      occasion: 'Ceremonial events, storytelling',
      difficulty: 'beginner',
      views: 12300,
      likes: 580,
      uploadDate: '2024-11-06',
      tags: ['afar', 'chants', 'nomadic', 'traditional', 'ceremonial']
    }
  ]

  const filteredVideos = mockVideos.filter(video => {
    const matchesType = filterType === 'all' || video.type === filterType
    const matchesRegion = filterRegion === 'all' || video.region === filterRegion
    const matchesSearch = searchTerm === '' || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesRegion && matchesSearch
  })

  const regions = [...new Set(mockVideos.map(video => video.region))]

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const toggleFavorite = (videoId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(videoId)) {
      newFavorites.delete(videoId)
    } else {
      newFavorites.add(videoId)
    }
    setFavorites(newFavorites)
  }

  const addToPlaylist = (videoId: string) => {
    if (!playlist.includes(videoId)) {
      setPlaylist([...playlist, videoId])
    }
  }

  const playVideo = (video: MusicDanceVideo) => {
    setSelectedVideo(video)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaMusic className="mr-3 text-red-600" />
            Ethiopian Music & Dance Videos
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <FaThLarge className="mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <FaList className="mr-1" />
              List
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Types</option>
              <option value="music">Music</option>
              <option value="dance">Dance</option>
              <option value="both">Music & Dance</option>
            </select>

            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{filteredVideos.length} videos</span>
            {playlist.length > 0 && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                {playlist.length} in playlist
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Video Player */}
      {selectedVideo && (
        <div className="border-b border-gray-200">
          <div className="p-6">
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              <div className="aspect-w-16 aspect-h-9">
                <div className="flex items-center justify-center h-64 bg-gradient-to-br from-red-600 to-pink-600">
                  <FaPlay className="text-6xl text-white" />
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex items-center space-x-4">
                  <button onClick={togglePlay} className="text-white hover:text-gray-300">
                    {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
                  </button>
                  
                  <div className="flex-1 bg-gray-600 rounded-full h-1">
                    <div 
                      className="bg-red-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / selectedVideo.duration) * 100}%` }}
                    ></div>
                  </div>
                  
                  <span className="text-white text-sm">
                    {formatDuration(currentTime)} / {formatDuration(selectedVideo.duration)}
                  </span>
                  
                  <button onClick={toggleMute} className="text-white hover:text-gray-300">
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  
                  <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h3>
                <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FaEye className="mr-1" />
                    {formatViews(selectedVideo.views)} views
                  </div>
                  <div className="flex items-center">
                    <FaHeart className="mr-1" />
                    {selectedVideo.likes} likes
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {selectedVideo.region}
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {new Date(selectedVideo.uploadDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedVideo.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFavorite(selectedVideo.id)}
                >
                  <FaHeart className={favorites.has(selectedVideo.id) ? 'text-red-500 mr-1' : 'mr-1'} />
                  {favorites.has(selectedVideo.id) ? 'Favorited' : 'Favorite'}
                </Button>
                <Button variant="outline" size="sm">
                  <FaShare className="mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <FaDownload className="mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid/List */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => playVideo(video)}
              >
                <div className="relative aspect-w-16 aspect-h-9 bg-gradient-to-br from-red-500 to-pink-600">
                  <div className="flex items-center justify-center h-32">
                    <FaPlay className="text-3xl text-white group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {formatDuration(video.duration)}
                  </div>
                  
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      video.type === 'music' ? 'bg-blue-500 text-white' :
                      video.type === 'dance' ? 'bg-green-500 text-white' :
                      'bg-purple-500 text-white'
                    }`}>
                      {video.type}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{video.title}</h3>
                  
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    {video.region} • {video.ethnicity}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <FaEye className="mr-1" />
                      {formatViews(video.views)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(video.id)
                        }}
                        className="hover:text-red-500"
                      >
                        <FaHeart className={favorites.has(video.id) ? 'text-red-500' : ''} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToPlaylist(video.id)
                        }}
                        className="hover:text-blue-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => playVideo(video)}
              >
                <div className="relative flex-shrink-0 w-32 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
                  <div className="flex items-center justify-center h-full">
                    <FaPlay className="text-2xl text-white" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded text-xs">
                    {formatDuration(video.duration)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded ${
                      video.type === 'music' ? 'bg-blue-100 text-blue-800' :
                      video.type === 'dance' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {video.type}
                    </span>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {video.region}
                    </div>
                    <div className="flex items-center">
                      <FaEye className="mr-1" />
                      {formatViews(video.views)}
                    </div>
                    <div className="flex items-center">
                      <FaHeart className="mr-1" />
                      {video.likes}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(video.id)
                    }}
                    className={`p-2 rounded-full hover:bg-gray-200 ${
                      favorites.has(video.id) ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    <FaHeart />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addToPlaylist(video.id)
                    }}
                    className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-blue-500"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Playlist */}
      {playlist.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaList className="mr-2" />
            Playlist ({playlist.length} videos)
          </h3>
          <div className="space-y-2">
            {playlist.map((videoId, index) => {
              const video = mockVideos.find(v => v.id === videoId)
              return video ? (
                <div
                  key={videoId}
                  className="flex items-center space-x-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => playVideo(video)}
                >
                  <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                  <div className="w-12 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded flex items-center justify-center">
                    <FaPlay className="text-white text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{video.title}</div>
                    <div className="text-xs text-gray-500">{video.region} • {formatDuration(video.duration)}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPlaylist(playlist.filter(id => id !== videoId))
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MusicDanceVideos