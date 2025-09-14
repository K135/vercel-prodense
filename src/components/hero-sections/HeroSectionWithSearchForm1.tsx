import clsx from 'clsx'
import HeroImageGrid from '@/components/HeroImageGrid'

const HeroSectionWithSearchForm1 = ({
  className,
  searchForm,
  description,
  heading,
}: {
  className?: string
  heading: string | React.ReactNode
  description: string | React.ReactNode
  searchForm: React.ReactNode
}) => {
  return (
    <div className={clsx('relative flex flex-col-reverse pt-10 lg:flex-col lg:pt-12', className)}>
      <div className="flex flex-col lg:flex-row">
        <div className="relative flex w-full flex-col items-start gap-y-3 pb-16 lg:pe-10 lg:pt-24 lg:pb-60 xl:gap-y-4 xl:pe-14">
          {/* Prodense Orange Logo */}
          <div className="mb-1 -ml-10 -mt-10">
            <img 
              src="/images/prodense orange.png" 
              alt="Prodense Logo" 
              className="h-auto w-140 sm:w-148 lg:w-156 xl:w-164"
            />
          </div>
          
          <h2
            className="text-1xl/[1.15] font-medium tracking-wide whitespace-nowrap xl:text-4xl/[1.1] mb-6 -ml-[5px]"
            dangerouslySetInnerHTML={{ __html: heading || '' }}
          />
          {description}
          <div className="w-full max-w-2xl -ml-10 lg:block mt-2">{searchForm}</div>
        </div>

        <div className="w-full relative">
          <HeroImageGrid />
        </div>
      </div>
    </div>
  )
}

export default HeroSectionWithSearchForm1
