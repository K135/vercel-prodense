import { FC } from 'react'

export interface BgGlassmorphismProps {
  className?: string
}

const BgGlassmorphism: FC<BgGlassmorphismProps> = ({
  className = 'absolute inset-x-0 md:top-10 xl:top-40 min-h-0 pl-20 py-24 flex overflow-hidden -z-10',
}) => {
  return (
    <div className={` ${className}`}>
      <span className="block h-48 w-48 rounded-full opacity-10 mix-blend-multiply blur-3xl filter lg:h-64 lg:w-64" style={{ backgroundColor: '#DB3116' }}></span>
      <span className="nc-animation-delay-2000 mt-40 -ml-20 block h-48 w-48 rounded-full opacity-10 mix-blend-multiply blur-3xl filter lg:h-64 lg:w-64" style={{ backgroundColor: '#DB3116' }}></span>
    </div>
  )
}

export default BgGlassmorphism
