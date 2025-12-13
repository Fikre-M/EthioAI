import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaMicrophone, FaStop, FaPlay, FaPause, FaRedo,
  FaCheck, FaTimes, FaWaveSquare
} from 'react-icons/fa'

interface VoiceRecorderProps {
  targetPhrase: string
  onRecordingComplete: (audioBlob: Blob, confidence: number) => void
  onClose: () => void
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  targetPhrase,
  onRecordingComplete,
  onClose
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<{
    confidence: number
    feedback: string
    suggestions: string[]
  } | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        analyzeRecording(blob)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const analyzeRecording = (_blob: Blob) => {
    // Simulate pronunciation analysis
    // In a real app, this would use speech recognition API
    setTimeout(() => {
      const confidence = Math.random() * 40 + 60 // 60-100% confidence
      let feedback = ''
      let suggestions: string[] = []

      if (confidence >= 90) {
        feedback = 'Excellent pronunciation! You sound very natural.'
        suggestions = ['Keep practicing to maintain this level!']
      } else if (confidence >= 80) {
        feedback = 'Good pronunciation with minor areas for improvement.'
        suggestions = [
          'Try to emphasize the vowel sounds more',
          'Pay attention to the rhythm of the phrase'
        ]
      } else if (confidence >= 70) {
        feedback = 'Fair pronunciation. Focus on clarity and pace.'
        suggestions = [
          'Speak more slowly and clearly',
          'Practice individual syllables first',
          'Listen to the target pronunciation again'
        ]
      } else {
        feedback = 'Keep practicing! Pronunciation takes time to develop.'
        suggestions = [
          'Break the phrase into smaller parts',
          'Practice vowel sounds separately',
          'Record yourself multiple times',
          'Listen to native speakers more'
        ]
      }

      setAnalysisResult({ confidence, feedback, suggestions })
    }, 2000) // Simulate processing time
  }

  const retryRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setAnalysisResult(null)
    setRecordingTime(0)
  }

  const acceptRecording = () => {
    if (audioBlob && analysisResult) {
      onRecordingComplete(audioBlob, analysisResult.confidence)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 80) return 'text-blue-600'
    if (confidence >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBackground = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100'
    if (confidence >= 80) return 'bg-blue-100'
    if (confidence >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Practice Pronunciation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        {/* Target Phrase */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Practice this phrase:</h4>
          <p className="text-xl font-amharic text-blue-800">{targetPhrase}</p>
        </div>

        {/* Recording Controls */}
        <div className="mb-6">
          {!isRecording && !audioBlob && (
            <div className="text-center">
              <Button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full"
              >
                <FaMicrophone className="mr-2" />
                Start Recording
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Tap to start recording your pronunciation
              </p>
            </div>
          )}

          {isRecording && (
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-2">
                  <FaWaveSquare className="text-red-600 text-2xl animate-pulse" />
                </div>
                <p className="text-lg font-medium text-red-600">Recording...</p>
                <p className="text-sm text-gray-600">{formatTime(recordingTime)}</p>
              </div>
              <Button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2"
              >
                <FaStop className="mr-2" />
                Stop Recording
              </Button>
            </div>
          )}

          {audioBlob && !analysisResult && (
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-lg font-medium text-blue-600">Analyzing...</p>
                <p className="text-sm text-gray-600">Processing your pronunciation</p>
              </div>
            </div>
          )}
        </div>

        {/* Playback Controls */}
        {audioUrl && (
          <div className="mb-6">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={playRecording}
                variant="outline"
                className="flex items-center"
              >
                {isPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                {isPlaying ? 'Pause' : 'Play Recording'}
              </Button>
              <span className="text-sm text-gray-600">
                Duration: {formatTime(recordingTime)}
              </span>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mb-6">
            <div className={`p-4 rounded-lg ${getConfidenceBackground(analysisResult.confidence)}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Pronunciation Score</h4>
                <span className={`text-2xl font-bold ${getConfidenceColor(analysisResult.confidence)}`}>
                  {Math.round(analysisResult.confidence)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    analysisResult.confidence >= 90 ? 'bg-green-500' :
                    analysisResult.confidence >= 80 ? 'bg-blue-500' :
                    analysisResult.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysisResult.confidence}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{analysisResult.feedback}</p>
              
              {analysisResult.suggestions.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Suggestions:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {analysisResult && (
          <div className="flex space-x-3">
            <Button
              onClick={retryRecording}
              variant="outline"
              className="flex-1"
            >
              <FaRedo className="mr-2" />
              Try Again
            </Button>
            <Button
              onClick={acceptRecording}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <FaCheck className="mr-2" />
              Accept
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}