'use client'

import { FC, useState, useRef, useEffect } from 'react'

interface VideoWrapperProps {
  videoSrc: string
  className?: string
  onVideoClick?: (videoSrc: string) => void
}

const VideoWrapper: FC<VideoWrapperProps> = ({ videoSrc, className = '', onVideoClick }) => {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Set initial state
      video.muted = true
      video.loop = true
      
      // Use Intersection Observer to only play videos when they're visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Auto play when video becomes visible
              const playVideo = async () => {
                try {
                  await video.play()
                } catch (error) {
                  console.log('Auto-play failed:', error)
                }
              }
              playVideo()
            } else {
              // Pause when video is not visible to save resources
              video.pause()
            }
          })
        },
        { threshold: 0.5 } // Play when 50% of video is visible
      )
      
      observer.observe(video)
      
      return () => {
        observer.disconnect()
      }
    }
  }, [])

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoClick = () => {
    if (onVideoClick) {
      onVideoClick(videoSrc)
    }
  }

  return (
    <div className={`relative group cursor-pointer ${className}`} onClick={handleVideoClick}>
      <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
          preload="none"
        />
        
        {/* Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default VideoWrapper