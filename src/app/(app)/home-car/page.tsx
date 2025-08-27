import BgGlassmorphism from '@/components/BgGlassmorphism'
import HeroSectionWithSearchForm1 from '@/components/hero-sections/HeroSectionWithSearchForm1'
import CarDentalHeroSearchForm from '@/components/HeroSearchForm/CarDentalHeroSearchForm'
import PopularProceduresGrid from '@/components/PopularProceduresGrid'
import SectionTrustedStats from '@/components/SectionTrustedStats'
import SectionYouTubeGrid from '@/components/SectionYouTubeGrid'
import SectionPatientFlow from '@/components/SectionPatientFlow'
import SectionGetToKnowAboutUs from '@/components/SectionGetToKnowAboutUs'
import SectionInfoCards from '@/components/SectionInfoCards'
import SectionFAQ from '@/components/SectionFAQ'
import SectionSearchTerms from '@/components/SectionSearchTerms'
import { getAuthors } from '@/data/authors'
import { getStayCategories } from '@/data/categories'
import { getStayListings } from '@/data/listings'
import ButtonPrimary from '@/shared/ButtonPrimary'
import HeadingWithSub from '@/shared/Heading'
import heroImage from '@/images/hero-right-car.png'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Prodense - Royal Dental Care in India's Paradise",
  description:
    "Experience world-class dental treatments in India's most beautiful tourist destinations. Affordable, accredited, hassle-free dental tourism.",
}

async function Page() {
  // Keep same data fetching as current home (even if not directly used)
  const categories = await getStayCategories()
  const stayListings = await getStayListings()
  const authors = await getAuthors()

  return (
    <main className="relative overflow-hidden">
      <BgGlassmorphism />

      {/* Hero Section replaced with dental hero */}
      <div className="relative container mb-24 lg:mb-28">
        <HeroSectionWithSearchForm1
          heading="Your Smile, <span style='color: #e6ba47;'>Perfectly Personalised!</span>"
          image={heroImage}
          imageAlt="hero"
          searchForm={<CarDentalHeroSearchForm />}
          description={
            <>
              <p className="max-w-xl text-base text-neutral-500 sm:text-xl dark:text-neutral-400 -mt-4 pb-6">
                Experience world-class dental treatments tailored to your unique needs in India
              </p>
            </>
          }
        />
      </div>

      {/* Popular Dental Procedures - Ultra Modern Background Design */}
      <div className="relative py-16 lg:py-20 mb-8 lg:mb-12 overflow-hidden">
        {/* Multi-layered Modern Background */}
        <div className="absolute inset-0">
          {/* Base gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E5BA47]/8 via-white/60 to-[#E5BA47]/12" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#E5BA47]/4 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-bl from-[#E5BA47]/6 via-transparent to-[#E5BA47]/8" />
          
          {/* Geometric pattern overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #E5BA47 1px, transparent 1px),
                               radial-gradient(circle at 75% 75%, #E5BA47 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
          </div>
          
          {/* Animated floating orbs */}
          <div className="absolute top-20 left-[10%] w-40 h-40 bg-gradient-to-br from-[#E5BA47]/15 to-[#E5BA47]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-[15%] w-56 h-56 bg-gradient-to-tl from-[#E5BA47]/12 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 left-[70%] w-32 h-32 bg-gradient-to-r from-[#E5BA47]/8 to-[#E5BA47]/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/3 left-[20%] w-48 h-48 bg-gradient-to-br from-transparent to-[#E5BA47]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          
          {/* Geometric shapes */}
          <div className="absolute top-16 right-[20%] w-24 h-24 border border-[#E5BA47]/20 rounded-2xl rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute bottom-24 left-[15%] w-16 h-16 border-2 border-[#E5BA47]/15 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/2 right-[10%] w-20 h-20 bg-gradient-to-br from-[#E5BA47]/10 to-transparent rounded-lg rotate-12 animate-pulse" />
          
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5BA47]/3 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E5BA47]/2 to-transparent" />
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-20 mix-blend-soft-light" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px'
          }} />
          
          {/* Glass morphism layers */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent backdrop-blur-sm" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white/15 to-transparent backdrop-blur-sm" />
        </div>
        
        {/* Content with enhanced backdrop */}
        <div className="container mx-auto px-4 relative z-10">
          {/* Heading container with subtle backdrop */}
          <div className="relative text-center mb-12 lg:mb-16">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl -m-8" />
            <div className="relative z-10 p-8">
              <HeadingWithSub 
                subheading="Discover our comprehensive range of advanced dental treatments designed to give you the perfect smile you deserve."
                isCenter={true}
              >
                Popular Dental <span className="text-[#E5BA47] drop-shadow-sm">Procedures</span>
              </HeadingWithSub>
            </div>
          </div>
          
          {/* Grid container with enhanced backdrop */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl -m-4" />
            <div className="relative z-10 p-4">
              <PopularProceduresGrid />
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Stats Section */}
      <SectionTrustedStats className="mb-4 lg:mb-6" />

      {/* YouTube Video Grid Section */}
      <SectionYouTubeGrid className="" />

      {/* Patient Flow Section */}
      <SectionPatientFlow className="mt-12 lg:mt-16 mb-8 lg:mb-12" />

      {/* Get To Know About Us Section */}
      <SectionGetToKnowAboutUs className="mb-2 lg:mb-4" />

      {/* Info Cards Section */}
      <SectionInfoCards />

      {/* FAQ Section */}
      <SectionFAQ />

      {/* Search Terms Section */}
      <SectionSearchTerms />
    </main>
  )
}

export default Page