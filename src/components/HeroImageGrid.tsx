'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

// Define the grid layout: 8 items in 3 unequal columns
// Column 1 (2fr): 2 wide images with 3/4 aspect ratio
// Column 2 (1.5fr): 3 square images 
// Column 3 (1fr): 3 images (1st longer, 2nd square, 3rd longer)
const gridLayout = [
  // Column 1 - 2 wide images with 15px gap (i1 spans rows 1-2, i2 spans rows 3-4)
  { id: 1, folder: 1, className: 'col-start-1 col-span-1 row-start-1 row-span-2', size: 'wide' }, // i1: col 1, rows 1-2
  { id: 2, folder: 2, className: 'col-start-1 col-span-1 row-start-3 row-span-2', size: 'wide' }, // i2: col 1, rows 3-4
  
  // Column 2 - 3 equal square images (206.6px each, custom positioned)
  { id: 3, folder: 3, className: 'col-start-2 col-span-1 row-start-1 row-span-1', size: 'square' }, // i3: col 2, row 1
  { id: 4, folder: 4, className: 'col-start-2 col-span-1 row-start-2 row-span-1', size: 'square' }, // i4: col 2, row 2  
  { id: 5, folder: 5, className: 'col-start-2 col-span-1 row-start-3 row-span-1', size: 'square' }, // i5: col 2, row 3
  
  // Column 3 - 3 images (1st longer, 2nd square, 3rd longer)
  { id: 6, folder: 6, className: 'col-start-3 col-span-1 row-start-1 row-span-1', size: 'longer' }, // i6: col 3, row 1 (longer)
  { id: 7, folder: 7, className: 'col-start-3 col-span-1 row-start-2 row-span-1', size: 'longer' }, // i7: col 3, row 2 (longer)
  { id: 8, folder: 8, className: 'col-start-3 col-span-1 row-start-3 row-span-2', size: 'longer' }, // i8: col 3, rows 3-4 (longer)
]

// Image data for each folder (based on the structure we found)
const imageData: Record<number, string[]> = {
  1: ['p-1.jpg', 'p-2.jpg', 'p-3.jpg'],
  2: ['p-4.jpg', 'p-5.jpg', 'p-6.jpg'],
  3: ['p-7.jpg', 'p-8.jpg'],
  4: ['p-9.jpg', 'p-10.jpg'],
  5: ['p-11.jpg', 'p-12.jpg'],
  6: ['p-13.jpg', 'p-14.jpg'],
  7: ['p-15.jpg', 'p-16.jpg'],
  8: ['p-17.jpg', 'p-18.jpg'],
  9: ['p-19.jpg', 'p-20.jpg'],
  10: ['p-21.jpg', 'p-22.jpg'],
  11: ['p-23.jpg', 'p-24.jpg'],
  12: ['p-25.jpg', 'p-26.jpg'],
}

interface GridItemProps {
  folder: number
  className: string
  size: string
  noFlip?: boolean
  slowFlip?: boolean
}

const GridItem = ({ folder, className, size, noFlip = false, slowFlip = false }: GridItemProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const images = imageData[folder] || []

  useEffect(() => {
    if (images.length <= 1 || noFlip) return

    // Different intervals based on flip speed
    const baseInterval = slowFlip ? 30000 : 8000 // 30 seconds for slow, 8 seconds for normal
    const randomRange = slowFlip ? 15000 : 4000  // +0-15s for slow, +0-4s for normal

    const interval = setInterval(() => {
      setIsFlipping(true)
      
      // Change image after flip animation starts
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
        setIsFlipping(false)
      }, 400) // Half of flip duration
      
    }, baseInterval + Math.random() * randomRange) // Very slow: 30-45 seconds, Normal: 8-12 seconds

    return () => clearInterval(interval)
  }, [images.length, noFlip, slowFlip])

  if (images.length === 0) return null

  const currentImage = images[currentImageIndex]

  return (
    <div className={clsx(
      'relative overflow-hidden rounded-xl bg-gray-100 group cursor-pointer transition-all duration-400 hover:scale-[1.02] hover:shadow-lg',
      className,
      {
        'h-[230px]': size === 'square', // Column 2: exactly 206.6px height
        'h-[300px]': size === 'wide' || size === 'tall', // Column 1: 300px height OR Column 3: 1st image 300px
        'h-[200px]': size === 'medium', // Column 3: 2nd image (200px)
        'h-[100px]': size === 'longer', // Column 3: 3rd image
      }
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#E6B862]/10 to-transparent z-10" />
      
      {/* Flip container */}
      <div className={clsx(
        'w-full h-full transition-transform duration-600 transform-gpu',
        isFlipping ? 'scale-x-0' : 'scale-x-100'
      )}>
        <Image
          src={`/hero-flip/${folder}/${currentImage}`}
          alt={`Hero image ${folder}`}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
    </div>
  )
}

const HeroImageGrid = () => {
  return (
    <div className="w-full h-full relative">
      {/* Independent Columns using Flexbox */}
      <div className="flex p-4 gap-3 h-[720px]">
        
        {/* Column 1: 2 wide images with 15px gap */}
        <div className="flex-[2] flex flex-col gap-[15px]">
          <GridItem folder={1} className="" size="wide" noFlip={true} />
          <GridItem folder={2} className="" size="wide" />
        </div>
        
        {/* Column 2: 3 square images with 15.1px gaps */}
        <div className="flex-[1.5] flex flex-col gap-[15.1px]">
          <GridItem folder={3} className="" size="square" slowFlip={true} />
          <GridItem folder={4} className="" size="square" />
          <GridItem folder={5} className="" size="square" slowFlip={true} />
        </div>
        
        {/* Column 3: 3 images with custom heights (300px, 200px, 100px) */}
        <div className="flex-1 flex flex-col gap-3">
          <GridItem folder={6} className="" size="tall" noFlip={true} />
          <GridItem folder={7} className="" size="medium" />
          <GridItem folder={8} className="" size="longer" />
        </div>
        
      </div>
      
      {/* Optional: Add a subtle animation overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E6B862]/30 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E6B862]/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  )
}

export default HeroImageGrid