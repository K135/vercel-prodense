import clsx from 'clsx'

const DentalHeroSectionCentered = ({
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
        {/* Content Section - Left Side, leaving space for video on right */}
        <div className="relative flex w-full flex-col items-start justify-center gap-y-8 pb-16 lg:pe-10 lg:py-20 xl:gap-y-10 xl:pe-14 lg:w-1/2 xl:w-3/5 min-h-[80vh] lg:min-h-[80vh]">
          <h2
            className="text-5xl/[1.15] font-medium tracking-tight text-pretty xl:text-7xl/[1.1]"
            dangerouslySetInnerHTML={{ __html: heading || '' }}
          />
          
          {/* SEARCH FORM IN THE MIDDLE - RIGHT AFTER HEADING */}
          <div className="w-full max-w-4xl xl:max-w-6xl">{searchForm}</div>
          
          {description}
        </div>
      </div>
    </div>
  )
}

export default DentalHeroSectionCentered