import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import DentalHeroSectionCentered from '@/components/hero-sections/DentalHeroSectionCentered'
import DentalHeroSearchForm from '@/components/HeroSearchForm/DentalHeroSearchForm'
import PopularProceduresGrid from '@/components/PopularProceduresGrid'
import SectionBecomeAnAuthor from '@/components/SectionBecomeAnAuthor'
import SectionClientSay from '@/components/SectionClientSay'
import SectionGridAuthorBox from '@/components/SectionGridAuthorBox'
import SectionGridCategoryBox from '@/components/SectionGridCategoryBox'
import SectionGridFeaturePlaces from '@/components/SectionGridFeaturePlaces'
import SectionHowItWork from '@/components/SectionHowItWork'
import SectionOurFeatures from '@/components/SectionOurFeatures'

import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import SectionTrustedStats from '@/components/SectionTrustedStats'
import SectionVideos from '@/components/SectionVideos'
import SectionYouTubeGrid from '@/components/SectionYouTubeGrid'
import SectionPatientFlow from '@/components/SectionPatientFlow'
import SectionGetToKnowAboutUs from '@/components/SectionGetToKnowAboutUs'
import SectionInfoCards from '@/components/SectionInfoCards'
import SectionFAQ from '@/components/SectionFAQ'
import SectionSearchTerms from '@/components/SectionSearchTerms'
import ThrillophiliaHero from '@/components/ThrillophiliaHero'
import { getAuthors } from '@/data/authors'
import { getStayCategories } from '@/data/categories'
import { getStayListings } from '@/data/listings'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import HeadingWithSub from '@/shared/Heading'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prodense - Royal Dental Care in India\'s Paradise',
  description: 'Experience world-class dental treatments in India\'s most beautiful tourist destinations. Affordable, accredited, hassle-free dental tourism.',
}

async function Page() {
  const categories = await getStayCategories()
  const stayListings = await getStayListings()
  const authors = await getAuthors()

  return (
    <main className="relative overflow-hidden">
      {/* Thrillophilia Hero Section - Exact Replica */}
      <ThrillophiliaHero />
      
      {/* Popular Dental Procedures - moved right after hero */}
      <div className="container mx-auto px-4 mb-8 lg:mb-12">
        <HeadingWithSub subheading="Explore our most sought-after dental treatments and procedures.">
          Popular Dental Procedures
        </HeadingWithSub>
        <PopularProceduresGrid />
      </div>

      {/* Trusted Stats Section - We Create Smiles Without Borders & Prodense Is Peoples 1st Choice */}
      <SectionTrustedStats className="mb-4 lg:mb-6" />

      {/* YouTube Video Grid Section */}
      <SectionYouTubeGrid className="" />

      {/* Patient Flow Section - Moved very close to YouTube section */}
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