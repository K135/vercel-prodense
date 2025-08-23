'use client'

import { FC, useState } from 'react'
import VideoWrapper from './VideoWrapper'
import VideoLightbox from './VideoLightbox'

interface Props {
  className?: string
}

const SectionYouTubeGrid: FC<Props> = ({
  className = ''
}) => {
  const videos = [
    "/A radiant smile speaks volumes!.mp4",
    "/Patient Testimonial _ Clove Dental's Happy Patient _ Dental Care.mp4",
    "/Teeth Whitening in Dubai_ Patient Testimonial on Zoom! Teeth Whitening.mp4",
    "/_I'm glad I did the treatment..._ I Patient Testimonial I Dr. Mayssa Kalouche.mp4",
    "/patient-testimonial-there-s-a-huge-difference-dentalclinic-dentist-drmichaels-dentistry-1080-ytshorts.savetube.me.mp4",
    "/Smile Stories_ Unveiling the Transformative Journey at Aastha dentalcare testimonialsdentaltips.mp4"
  ]

  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const handleVideoClick = (videoSrc: string) => {
    const index = videos.findIndex(video => video === videoSrc)
    if (index !== -1) {
      setCurrentVideoIndex(index)
      setIsLightboxOpen(true)
    }
  }

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false)
  }

  const handleVideoChange = (index: number) => {
    setCurrentVideoIndex(index)
  }

  return (
    <>
      <section className={`pt-6 pb-2 lg:pt-8 lg:pb-3 ${className}`}>
        <div className="container mx-auto px-4">
          {/* Section Heading */}
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-3xl font-semibold text-neutral-950 sm:text-4xl/10 dark:text-white">
              Real Stories From Real Patients
            </h2>
            <h3 className="text-lg font-normal text-neutral-500 dark:text-neutral-400 mt-2">
              Hear directly from those who transformed their smiles with us
            </h3>
          </div>

          {/* Video Grid - Single Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {videos.map((videoSrc, index) => (
              <VideoWrapper
                key={index}
                videoSrc={videoSrc}
                className="w-full"
                onVideoClick={handleVideoClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Video Lightbox Modal */}
      <VideoLightbox
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        videos={videos}
        currentVideoIndex={currentVideoIndex}
        onVideoChange={handleVideoChange}
      />
    </>
  )
}

export default SectionYouTubeGrid