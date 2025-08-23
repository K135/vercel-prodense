'use client'

import Image from 'next/image'

const AsFeaturedIn = () => {
  return (
    <div className="py-6 lg:py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl">
            <Image
              src="/images/As-featured-on.png"
              alt="As Featured In - Media Publications"
              width={800}
              height={200}
              className="w-full h-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AsFeaturedIn