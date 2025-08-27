'use client'

import { useInteractOutside } from '@/hooks/useInteractOutside'
import * as Headless from '@headlessui/react'
import { MapPinIcon } from '@heroicons/react/24/outline'
import {
  BeachIcon,
  EiffelTowerIcon,
  HutIcon,
  LakeIcon,
  Location01Icon,
  TwinTowerIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import clsx from 'clsx'
import _ from 'lodash'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { ClearDataButton } from './ClearDataButton'

type Suggest = {
  id: string
  name: string
  icon?: IconSvgElement
}

const carDentalDestinations: Suggest[] = [
  {
    id: '1',
    name: 'Goa - Beach Paradise',
    icon: BeachIcon,
  },
  {
    id: '2',
    name: 'Kerala - God\'s Own Country',
    icon: LakeIcon,
  },
  {
    id: '3',
    name: 'Rajasthan - Royal Heritage',
    icon: EiffelTowerIcon,
  },
  {
    id: '4',
    name: 'Mumbai - Commercial Capital',
    icon: TwinTowerIcon,
  },
  {
    id: '5',
    name: 'Delhi - Historic Capital',
    icon: EiffelTowerIcon,
  },
  {
    id: '6',
    name: 'Bangalore - Garden City',
    icon: HutIcon,
  },
  {
    id: '7',
    name: 'Chennai - Cultural Hub',
    icon: BeachIcon,
  },
  {
    id: '8',
    name: 'Hyderabad - Pearl City',
    icon: TwinTowerIcon,
  },
]

const carDentalSearchingSuggests: Suggest[] = [
  {
    id: '1',
    name: 'Goa - Beach Paradise',
  },
  {
    id: '2',
    name: 'Kerala - God\'s Own Country',
  },
  {
    id: '3',
    name: 'Rajasthan - Royal Heritage',
  },
  {
    id: '4',
    name: 'Mumbai - Commercial Capital',
  },
  {
    id: '5',
    name: 'Delhi - Historic Capital',
  },
  {
    id: '6',
    name: 'Bangalore - Garden City',
  },
  {
    id: '7',
    name: 'Chennai - Cultural Hub',
  },
  {
    id: '8',
    name: 'Hyderabad - Pearl City',
  },
  {
    id: '9',
    name: 'Pune - Oxford of the East',
  },
  {
    id: '10',
    name: 'Kolkata - City of Joy',
  },
  {
    id: '11',
    name: 'Ahmedabad - Heritage City',
  },
  {
    id: '12',
    name: 'Jaipur - Pink City',
  },
  {
    id: '13',
    name: 'Kochi - Queen of Arabian Sea',
  },
  {
    id: '14',
    name: 'Mysore - City of Palaces',
  },
  {
    id: '15',
    name: 'Udaipur - City of Lakes',
  },
  {
    id: '16',
    name: 'Agra - City of Taj',
  },
  {
    id: '17',
    name: 'Varanasi - Spiritual Capital',
  },
  {
    id: '18',
    name: 'Rishikesh - Yoga Capital',
  },
  {
    id: '19',
    name: 'Shimla - Queen of Hills',
  },
  {
    id: '20',
    name: 'Manali - Valley of Gods',
  },
]

const styles = {
  button: {
    base: 'relative z-10 shrink-0 w-full cursor-pointer flex items-center gap-x-3 focus:outline-hidden text-start',
    focused: 'rounded-full bg-transparent focus-visible:outline-hidden dark:bg-white/5 custom-shadow-1',
    default: 'px-7 py-4 xl:px-8 xl:py-6',
    small: 'py-3 px-7 xl:px-8',
  },
  input: {
    base: 'block w-full truncate border-none bg-transparent p-0 font-semibold placeholder-neutral-800 focus:placeholder-neutral-300 focus:ring-0 focus:outline-hidden dark:placeholder-neutral-200',
    default: 'text-base xl:text-lg',
    small: 'text-base',
  },
  panel: {
    base: 'absolute start-0 top-full z-40 mt-3 hidden-scrollbar max-h-96 overflow-y-auto rounded-2xl bg-white shadow-2xl border border-neutral-100 transition duration-150 data-closed:translate-y-1 data-closed:opacity-0 dark:bg-neutral-800 dark:border-neutral-700',
    default: 'w-lg sm:py-4',
    small: 'w-md sm:py-3',
  },
}

interface Props {
  placeholder?: string
  description?: string
  className?: string
  fieldStyle: 'default' | 'small'
  clearDataButtonClassName?: string
}

export const CarDentalLocationInputField: FC<Props> = ({
  placeholder = 'Choose your destination',
  description = 'Destination',
  className,
  fieldStyle = 'default',
  clearDataButtonClassName,
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [showPopover, setShowPopover] = useState(false)
  const [suggests, setSuggests] = useState<Suggest[]>(carDentalDestinations)
  const [selectedSuggest, setSelectedSuggest] = useState<Suggest | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useInteractOutside(containerRef, () => {
    setShowPopover(false)
  })

  const handleSelectSuggest = useCallback((item: Suggest) => {
    setSelectedSuggest(item)
    setSearchValue(item.name)
    setShowPopover(false)
  }, [])

  const handleInputChange = useCallback(
    _.debounce((value: string) => {
      if (value) {
        setSuggests(carDentalSearchingSuggests)
      } else {
        setSuggests(carDentalDestinations)
      }
    }, 300),
    [carDentalSearchingSuggests, carDentalDestinations]
  )

  useEffect(() => {
    handleInputChange(searchValue)
  }, [searchValue, handleInputChange])

  const renderSearchValue = () => {
    return !!searchValue ? searchValue : ''
  }

  const handleClearData = () => {
    setSearchValue('')
    setSelectedSuggest(null)
    setSuggests(carDentalDestinations)
    inputRef.current?.focus()
  }

  return (
    <div className={clsx('relative flex', className)} ref={containerRef}>
      <div className="flex flex-1">
        <Headless.Popover className="relative flex flex-1">
          <Headless.PopoverButton
            className={clsx(
              styles.button.base,
              showPopover && styles.button.focused,
              styles.button[fieldStyle]
            )}
            onFocus={() => setShowPopover(true)}
          >
            <div className="text-neutral-300 dark:text-neutral-400">
              <MapPinIcon className={clsx(fieldStyle === 'small' ? 'h-4 w-4' : 'h-5 w-5')} />
            </div>
            <div className="flex-grow">
              <input
                className={clsx(styles.input.base, styles.input[fieldStyle])}
                placeholder={placeholder}
                value={renderSearchValue()}
                autoFocus={showPopover}
                onChange={(e) => {
                  setSearchValue(e.currentTarget.value)
                }}
                ref={inputRef}
                name="location"
              />
              <span className="mt-0.5 block text-sm text-neutral-400 font-light leading-none">
                {description}
              </span>
            </div>

            {!!searchValue && (
              <ClearDataButton
                className={clearDataButtonClassName}
                onClick={handleClearData}
              />
            )}
          </Headless.PopoverButton>

          {showPopover && (
            <Headless.PopoverPanel
              className={clsx(styles.panel.base, styles.panel[fieldStyle])}
              static
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <MapPinIcon className="h-5 w-5 text-[#0480ea]" />
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    Popular Dental Tourism Destinations
                  </div>
                </div>
                
                <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                  {suggests.map((item) => (
                    <button
                      key={item.id}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:ring-1 hover:ring-[#0480ea]/20"
                      onClick={() => handleSelectSuggest(item)}
                      type="button"
                    >
                      <div className="text-[#0480ea] flex-shrink-0">
                        {item.icon ? (
                          <HugeiconsIcon icon={item.icon} className="h-4 w-4" />
                        ) : (
                          <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
                        )}
                      </div>
                      <span className="font-medium text-neutral-700 dark:text-neutral-200 flex-1">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Headless.PopoverPanel>
          )}
        </Headless.Popover>
      </div>
    </div>
  )
}