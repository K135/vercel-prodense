import { ApplicationLayout } from '@/app/(app)/application-layout'
import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import SectionGridAuthorBox from '@/components/SectionGridAuthorBox'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { getAuthors } from '@/data/authors'
import { getDentalCategories } from '@/data/dental'
import Heading from '@/shared/Heading'
import { ReactNode } from 'react'

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <ApplicationLayout>
      <BgGlassmorphism />
      {children}
    </ApplicationLayout>
  )
}

export default Layout
