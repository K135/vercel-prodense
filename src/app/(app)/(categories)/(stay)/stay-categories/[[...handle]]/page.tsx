import DentalFilterSidebar from '@/components/DentalFilterSidebar'
import DentalClinicCard from '@/components/DentalClinicCard'
import { getDentalCategoryByHandle } from '@/data/dental'
import { getDentalFilterOptions, getDentalClinicListings } from '@/data/dental'
import Pagination from '@/shared/Pagination'

import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ handle?: string[] }> }): Promise<Metadata> {
  const { handle } = await params
  const category = await getDentalCategoryByHandle(handle?.[0])
  if (!category) {
    return {
      title: 'Dental Clinics not found',
      description: 'The dental clinic category you are looking for does not exist.',
    }
  }
  const { name, description } = category
  return { title: name, description }
}

const Page = async ({ params }: { params: Promise<{ handle?: string[] }> }) => {
  try {
    const { handle } = await params

    const category = await getDentalCategoryByHandle(handle?.[0])
    const dentalClinics = (await getDentalClinicListings()) || []
    const filterOptions = (await getDentalFilterOptions()) || []

    if (!category?.id) {
      return redirect('/stay-categories/all')
    }

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{category.name}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{category.description}</p>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <DentalFilterSidebar filterOptions={filterOptions} />
            </div>
          </div>

          {/* Right Content - Listings */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {dentalClinics.length} Dental Clinics Found
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Showing the best dental clinics in {category.name}
              </p>
            </div>
            
            <div className="space-y-6">
              {dentalClinics.length > 0 ? dentalClinics.map((clinic) => (
                <DentalClinicCard key={clinic.id} data={clinic} />
              )) : (
                <div className="text-center py-12">
                  <p className="text-neutral-500 dark:text-neutral-400">No dental clinics found matching your criteria.</p>
                </div>
              )}
            </div>

            {dentalClinics.length > 0 && (
              <div className="mt-12 flex items-center justify-center">
                <Pagination />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('Page error:', error)
    return (
      <div className="container py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            We&apos;re having trouble loading the dental listings. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}

export default Page
