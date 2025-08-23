import clsx from 'clsx'
import DentalHeroSearchForm from '../HeroSearchForm/DentalHeroSearchForm'

const CenteredDentalHeroSection = ({
  className,
}: {
  className?: string
}) => {
  return (
    <div className={clsx('relative h-[75vh] flex items-center justify-center', className)}>
      <div className="container mx-auto px-4">
        {/* Centered Content */}
        <div className="text-center max-w-6xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            Top Dental Procedures in India
          </h1>

          {/* Subheading */}
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Affordable • Accredited • Hassle-free Dental Tourism
          </p>

          {/* MAIN ATTRACTION - CENTERED SEARCH FORM */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
              <DentalHeroSearchForm initTab="Procedures" />
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="mb-12">
            <button className="bg-white/90 dark:bg-gray-800/90 text-[#0480ea] border-2 border-[#0480ea] hover:bg-[#0480ea] hover:text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg">
              Get a Quick Quote
            </button>
          </div>

          {/* Trust Logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">JCI</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">JCI Accredited</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-[#0480ea] rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">N</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nemotec</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">GP</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Global Partners</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CenteredDentalHeroSection