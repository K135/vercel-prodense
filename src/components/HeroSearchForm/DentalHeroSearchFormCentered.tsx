import { Link } from '@/shared/link'
import * as Headless from '@headlessui/react'
import { HeartIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Fragment } from 'react'
import { DentalSearchFormCentered } from './DentalSearchFormCentered'

export const dentalFormTabsCentered: {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  formComponent: React.ComponentType<{ formStyle: 'default' | 'small' }>
}[] = [
  { name: 'Procedures', icon: HeartIcon, href: '/', formComponent: DentalSearchFormCentered },
  { name: 'Destinations', icon: MapPinIcon, href: '/destinations', formComponent: DentalSearchFormCentered },
  { name: 'Packages', icon: SparklesIcon, href: '/packages', formComponent: DentalSearchFormCentered },
]

const DentalHeroSearchFormCentered = ({ className, initTab = 'Procedures' }: { className?: string; initTab?: string }) => {
  return (
    <div className={clsx('hero-search-form', className)}>
      <Headless.TabGroup defaultIndex={dentalFormTabsCentered.findIndex((tab) => tab.name === initTab)}>
        <Headless.TabList className="mb-8 flex justify-center sm:gap-x-6 xl:gap-x-10">
          {dentalFormTabsCentered.map((tab) => {
            const IconComponent = tab.icon
            return (
              <Headless.Tab
                key={tab.name}
                as={Link}
                href={tab.href}
                className="group/tab flex shrink-0 cursor-pointer items-center text-sm font-medium text-neutral-500 hover:text-[#0480ea] focus-visible:outline-hidden data-selected:text-[#0480ea] lg:text-base dark:hover:text-[#0480ea] dark:data-selected:text-[#0480ea] transition-colors"
              >
                <div className="me-1.5 hidden size-2.5 rounded-full bg-gradient-to-r from-[#0480ea] to-blue-600 group-data-selected/tab:block xl:me-2" />
                <IconComponent className="w-4 h-4 mr-2" />
                <span>{tab.name}</span>
              </Headless.Tab>
            )
          })}
        </Headless.TabList>
      </Headless.TabGroup>
      {dentalFormTabsCentered.map((tab) =>
        tab.name === initTab ? (
          <Fragment key={tab.name}>
            <tab.formComponent formStyle={'default'} />
          </Fragment>
        ) : null
      )}
    </div>
  )
}

export default DentalHeroSearchFormCentered