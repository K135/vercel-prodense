'use client'

import { useInteractOutside } from '@/hooks/useInteractOutside'
import { Divider } from '@/shared/divider'
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

const demoInitSuggests: Suggest[] = [
  {
    id: '1',
    name: 'Mumbai - Financial Capital',
    icon: TwinTowerIcon,
  },
  {
    id: '2',
    name: 'Delhi - Capital City',
    icon: EiffelTowerIcon,
  },
  {
    id: '3',
    name: 'Bangalore - Silicon Valley of India',
    icon: HutIcon,
  },
  {
    id: '4',
    name: 'Chennai - Detroit of India',
    icon: BeachIcon,
  },
  {
    id: '5',
    name: 'Hyderabad - Cyberabad',
    icon: TwinTowerIcon,
  },
  {
    id: '6',
    name: 'Pune - Oxford of the East',
    icon: HutIcon,
  },
  {
    id: '7',
    name: 'Kolkata - City of Joy',
    icon: EiffelTowerIcon,
  },
  {
    id: '8',
    name: 'Ahmedabad - Manchester of India',
    icon: TwinTowerIcon,
  },
]

const demoSearchingSuggests: Suggest[] = [
  {
    id: '1',
    name: 'Mumbai - Financial Capital',
  },
  {
    id: '2',
    name: 'Delhi - Capital City',
  },
  {
    id: '3',
    name: 'Bangalore - Silicon Valley of India',
  },
  {
    id: '4',
    name: 'Chennai - Detroit of India',
  },
  {
    id: '5',
    name: 'Hyderabad - Cyberabad',
  },
  {
    id: '6',
    name: 'Pune - Oxford of the East',
  },
  {
    id: '7',
    name: 'Kolkata - City of Joy',
  },
  {
    id: '8',
    name: 'Ahmedabad - Manchester of India',
  },
  {
    id: '9',
    name: 'Jaipur - Pink City',
  },
  {
    id: '10',
    name: 'Surat - Diamond City',
  },
  {
    id: '11',
    name: 'Lucknow - City of Nawabs',
  },
  {
    id: '12',
    name: 'Kanpur - Manchester of the East',
  },
  {
    id: '13',
    name: 'Nagpur - Orange City',
  },
  {
    id: '14',
    name: 'Indore - Commercial Capital of MP',
  },
  {
    id: '15',
    name: 'Thane - City of Lakes',
  },
  {
    id: '16',
    name: 'Bhopal - City of Lakes',
  },
  {
    id: '17',
    name: 'Visakhapatnam - City of Destiny',
  },
  {
    id: '18',
    name: 'Pimpri-Chinchwad - Twin City',
  },
  {
    id: '19',
    name: 'Patna - Ancient City',
  },
  {
    id: '20',
    name: 'Vadodara - Cultural Capital of Gujarat',
  },
  {
    id: '21',
    name: 'Ghaziabad - Gateway of UP',
  },
  {
    id: '22',
    name: 'Ludhiana - Manchester of India',
  },
  {
    id: '23',
    name: 'Agra - City of Taj',
  },
  {
    id: '24',
    name: 'Nashik - Wine Capital of India',
  },
  {
    id: '25',
    name: 'Faridabad - Industrial City',
  },
  {
    id: '26',
    name: 'Meerut - Sports City',
  },
  {
    id: '27',
    name: 'Rajkot - Commercial Hub of Saurashtra',
  },
  {
    id: '28',
    name: 'Kalyan-Dombivali - Twin City',
  },
  {
    id: '29',
    name: 'Vasai-Virar - Fastest Growing City',
  },
  {
    id: '30',
    name: 'Varanasi - Spiritual Capital',
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

export const DentalLocationInputField: FC<Props> = ({
  placeholder = 'Tourist destination in India',
  description = 'Destination',
  className,
  fieldStyle = 'default',
  clearDataButtonClassName,
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [showPopover, setShowPopover] = useState(false)
  const [suggests, setSuggests] = useState<Suggest[]>(demoInitSuggests)
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
        setSuggests(demoSearchingSuggests)
      } else {
        setSuggests(demoInitSuggests)
      }
    }, 300),
    []
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
    setSuggests(demoInitSuggests)
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
                    Popular Indian Cities
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