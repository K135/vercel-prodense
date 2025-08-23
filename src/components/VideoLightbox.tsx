'use client'

import { FC, useEffect, useRef, useState } from 'react'

interface VideoLightboxProps {
  isOpen: boolean
  onClose: () => void
  videos: string[]
  currentVideoIndex: number
  onVideoChange: (index: number) => void
}

const VideoLightbox: FC<VideoLightboxProps> = ({
  isOpen,
  onClose,
  videos,
  currentVideoIndex,
  onVideoChange
}) => {
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus the modal for keyboard navigation
      modalRef.current?.focus()
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const video = videoRef.current
    if (video && isOpen) {
      video.muted = isMuted
      video.loop = true
      
      const playVideo = async () => {
        try {
          await video.play()
        } catch (error) {
          console.log('Auto-play failed:', error)
        }
      }
      
      playVideo()
    }
  }, [currentVideoIndex, isOpen, isMuted])

  const handlePrevious = () => {
    const newIndex = currentVideoIndex === 0 ? videos.length - 1 : currentVideoIndex - 1
    onVideoChange(newIndex)
  }

  const handleNext = () => {
    const newIndex = currentVideoIndex === videos.length - 1 ? 0 : currentVideoIndex + 1
    onVideoChange(newIndex)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowLeft') {
      handlePrevious()
    } else if (e.key === 'ArrowRight') {
      handleNext()
    } else if (e.key === ' ') {
      e.preventDefault()
      toggleMute()
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10"
        aria-label="Close video"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Video Container */}
      <div className="relative w-full max-w-md lg:max-w-lg mx-4">
        <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            src={videos[currentVideoIndex]}
            className="w-full h-full object-cover"
            muted={isMuted}
            loop
            playsInline
            controls={false}
          />

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous video"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            aria-label="Next video"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              )}
            </button>

            {/* Video Counter */}
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white text-sm font-medium">
                {currentVideoIndex + 1} / {videos.length}
              </span>
            </div>

            {/* Keyboard Hints */}
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white/70 text-xs">
                ← → Navigate • Space Mute • Esc Close
              </span>
            </div>
          </div>
        </div>

        {/* Video Dots Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => onVideoChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentVideoIndex
                  ? 'bg-white'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoLightbox