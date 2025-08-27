import { Link } from '@/shared/link'
import * as Headless from '@headlessui/react'
import { HeartIcon, MapPinIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Fragment } from 'react'
import { DentalSearchForm } from './DentalSearchForm'

export const dentalFormTabs: {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  formComponent: React.ComponentType<{ formStyle: 'default' | 'small' }>
}[] = [
  { name: 'Procedures', icon: HeartIcon, href: '/', formComponent: DentalSearchForm },
  { name: 'Destinations', icon: MapPinIcon, href: '/destinations', formComponent: DentalSearchForm },
  { name: 'Packages', icon: SparklesIcon, href: '/packages', formComponent: DentalSearchForm },
]

const DentalHeroSearchForm = ({ className, initTab = 'Procedures' }: { className?: string; initTab?: string }) => {
  return (
    <div className={clsx('hero-search-form', className)}>
      <Headless.TabGroup defaultIndex={dentalFormTabs.findIndex((tab) => tab.name === initTab)}>
        <Headless.TabList className="ms-3 mb-8 flex sm:gap-x-6 xl:ms-10 xl:gap-x-10">
          {dentalFormTabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <Headless.Tab
                key={tab.name}
                as={Link}
                href={tab.href}
                className="group/tab flex shrink-0 cursor-pointer items-center text-sm font-medium text-neutral-500 hover:text-[#e6ba47] focus-visible:outline-hidden data-selected:text-[#e6ba47] lg:text-base dark:hover:text-[#e6ba47] dark:data-selected:text-[#e6ba47] transition-colors"
              >
                <div className="me-1.5 hidden size-2.5 rounded-full bg-gradient-to-r from-[#e6ba47] to-[#e6ba47]/80 group-data-selected/tab:block xl:me-2" />
                <IconComponent className="w-4 h-4 mr-2" />
                <span>{tab.name}</span>
              </Headless.Tab>
            )
          })}
        </Headless.TabList>
      </Headless.TabGroup>
      {dentalFormTabs.map((tab) =>
        tab.name === initTab ? (
          <Fragment key={tab.name}>
            <tab.formComponent formStyle={'default'} />
          </Fragment>
        ) : null
      )}
    </div>
  )
}

export default DentalHeroSearchForm