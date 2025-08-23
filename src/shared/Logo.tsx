import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className = 'w-32 sm:w-36' }) => {
  return (
    <Link href="/" className={`inline-block focus:ring-0 focus:outline-hidden ${className}`}>
      <Image 
        src="/images/logos/Prodense health logo.png?v=2" 
        alt="Prodense Health" 
        width={120} 
        height={120} 
        className="rounded-lg max-w-full h-auto"
      />
    </Link>
  )
}

export default Logo
