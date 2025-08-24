'use client'

import { useState } from 'react'
import { Button } from '@/shared/Button'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonThird from '@/shared/ButtonThird'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/shared/Checkbox'
import { Description, Fieldset, Label } from '@/shared/fieldset'
import { PriceRangeSlider } from './PriceRangeSlider'
import { FilterVerticalIcon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Form from 'next/form'

type CheckboxFilter = {
  label: string
  name: string
  tabUIType: 'checkbox'
  options: {
    name: string
    value: string
    description?: string
    defaultChecked?: boolean
  }[]
}

type PriceRangeFilter = {
  name: string
  label: string
  tabUIType: 'price-range'
  min: number
  max: number
}

type FilterOption = CheckboxFilter | PriceRangeFilter

interface DentalFilterSidebarProps {
  filterOptions: FilterOption[]
  className?: string
}

const CheckboxPanel = ({ filterOption, className }: { filterOption: CheckboxFilter; className?: string }) => {
  const options = filterOption?.options || []
  
  return (
    <Fieldset>
      <CheckboxGroup className={className}>
        {options.map((option) => (
          <CheckboxField key={option.value} className="group">
            <Checkbox 
              name={`${filterOption.name}[]`} 
              value={option.value} 
              defaultChecked={!!option.defaultChecked}
              className="data-[checked]:bg-primary-600 data-[checked]:border-primary-600"
            />
            <Label className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors cursor-pointer">
              {option.name}
            </Label>
            {option.description && (
              <Description className="text-xs text-neutral-500 dark:text-neutral-400">
                {option.description}
              </Description>
            )}
          </CheckboxField>
        ))}
      </CheckboxGroup>
    </Fieldset>
  )
}

const PriceRangePanel = ({ filterOption: { min, max, name } }: { filterOption: PriceRangeFilter }) => {
  const [rangePrices, setRangePrices] = useState([min, max])

  return (
    <div className="space-y-4">
      <PriceRangeSlider 
        defaultValue={rangePrices} 
        onChange={setRangePrices} 
        min={min} 
        max={max} 
      />
      <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
        <span>${rangePrices[0]}</span>
        <span>${rangePrices[1]}</span>
      </div>
    </div>
  )
}

const DentalFilterSidebar: React.FC<DentalFilterSidebarProps> = ({ 
  filterOptions = [], 
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleFormSubmit = async (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData.entries())
    console.log('Dental filters submitted:', formDataObject)
    // Handle filter submission logic here
  }

  const handleClearAll = () => {
    // Reset all filters
    const form = document.querySelector('#dental-filters-form') as HTMLFormElement
    if (form) {
      form.reset()
    }
    setSearchQuery('')
  }

  return (
    <div className={`bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm dark:bg-neutral-900 dark:border-neutral-700 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <HugeiconsIcon icon={FilterVerticalIcon} size={20} className="text-primary-600" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Filter Clinics
        </h3>
      </div>

      <Form id="dental-filters-form" action={handleFormSubmit} className="space-y-6">
        {filterOptions && filterOptions.length > 0 ? filterOptions.map((filterOption, index) => (
          <div key={index} className="pb-6 last:pb-0">
            <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              {filterOption.label}
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full dark:bg-primary-900 dark:text-primary-300">
                {filterOption.tabUIType === 'checkbox' ? (filterOption as CheckboxFilter).options?.length || 0 : 0}
              </span>
            </h4>
            
            {filterOption.tabUIType === 'checkbox' && (
              <CheckboxPanel 
                filterOption={filterOption as CheckboxFilter} 
                className="space-y-3"
              />
            )}
            
            {filterOption.tabUIType === 'price-range' && (
              <PriceRangePanel filterOption={filterOption as PriceRangeFilter} />
            )}
          </div>
        )) : (
          <div className="text-center text-neutral-500 py-8">
            No filter options available
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <ButtonPrimary type="submit" className="w-full">
            Apply Filters
          </ButtonPrimary>
          <ButtonThird 
            type="button" 
            onClick={handleClearAll}
            className="w-full"
          >
            Clear All
          </ButtonThird>
        </div>
      </Form>
    </div>
  )
}

export default DentalFilterSidebar