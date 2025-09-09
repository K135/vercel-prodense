import clsx from 'clsx'
import Image from 'next/image'

const HeroSectionWithSearchForm1 = ({
  className,
  searchForm,
  description,
  heading,
  imageAlt,
  image,
}: {
  className?: string
  heading: string | React.ReactNode
  description: string | React.ReactNode
  image: {
    src: string
    width: number
    height: number
  }
  imageAlt: string
  searchForm: React.ReactNode
}) => {
  return (
    <div className={clsx('relative flex flex-col-reverse pt-10 lg:flex-col lg:pt-12', className)}>
      <div className="flex flex-col lg:flex-row">
        <div className="relative flex w-full flex-col items-start gap-y-8 pb-16 lg:pe-10 lg:pt-12 lg:pb-60 xl:gap-y-10 xl:pe-14">
          {/* Prodense Orange Logo */}
          <div className="mb-1 -ml-10 -mt-10">
            <img 
              src="/images/prodense orange.png" 
              alt="Prodense Logo" 
              className="h-auto w-140 sm:w-148 lg:w-156 xl:w-164"
            />
          </div>
          
          <h2
            className="text-5xl/[1.15] font-medium tracking-tight text-pretty xl:text-7xl/[1.1]"
            dangerouslySetInnerHTML={{ __html: heading || '' }}
          />
          {description}
          <div className="absolute start-0 bottom-16 hidden w-screen max-w-4xl lg:block xl:max-w-6xl">{searchForm}</div>
        </div>

        <div className="w-full">
          <Image className="w-full" src={image} alt={imageAlt} priority />
        </div>
      </div>
    </div>
  )
}

export default HeroSectionWithSearchForm1
