'use client'

import clsx from 'clsx'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { VerticalDividerLine } from './ui'
import { CarProcedureSelectField } from './ui/CarProcedureSelectField'
import { CarDentalLocationInputField } from './ui/CarDentalLocationInputField'

interface Props {
  className?: string
  formStyle: 'default' | 'small'
}

export const CarDentalSearchForm = ({ className, formStyle = 'default' }: Props) => {
  const router = useRouter()

  // Prefetch the dental categories page to improve performance
  useEffect(() => {
    router.prefetch('/dental-categories/all')
  }, [router])

  const handleFormSubmit = (formData: FormData) => {
    const formDataEntries = Object.fromEntries(formData.entries())
    console.log('Car Dental form submitted', formDataEntries)
    
    // Build URL with search parameters
    const location = formDataEntries['location'] as string
    const procedure = formDataEntries['procedure'] as string
    
    let url = '/dental-categories/all'
    const params = new URLSearchParams()
    
    if (location) {
      params.append('location', location)
    }
    if (procedure) {
      params.append('procedure', procedure)
    }
    
    if (params.toString()) {
      url = url + `?${params.toString()}`
    }
    
    router.push(url)
  }

  return (
    <div className="space-y-4">
      <Form
        className={clsx(
          'relative z-10 flex w-full rounded-full bg-white [--form-bg:var(--color-white)] dark:bg-neutral-800 dark:[--form-bg:var(--color-neutral-800)]',
          className,
          formStyle === 'small' && 'custom-shadow-1',
          formStyle === 'default' && 'shadow-xl dark:shadow-2xl'
        )}
        action={handleFormSubmit}
      >
        <CarProcedureSelectField className="hero-search-form__field-after flex-4/12" fieldStyle={formStyle} />
        <VerticalDividerLine />
        <CarDentalLocationInputField 
          className="hero-search-form__field-before hero-search-form__field-after flex-5/12" 
          fieldStyle={formStyle}
          placeholder="Choose your destination"
        />
        <VerticalDividerLine />
        <div className="hero-search-form__field-before flex-3/12 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-xs text-neutral-500 dark:text-neutral-400"></div>
            <button
              type="button"
              className="text-sm font-medium text-[#DB3116] hover:text-[#DB3116]/80 transition-colors"
              onClick={() => {
                // Handle consultation action
                console.log('Consultation requested')
              }}
            >
              
            </button>
          </div>
        </div>

        {/* Custom Dental Search Button */}
        <button 
          type="submit" 
          className={clsx(
            'absolute z-10 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#DB3116] via-[#FF4A2B] to-[#DB3116] hover:from-[#B8280F] hover:via-[#DB3116] hover:to-[#B8280F] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center',
            formStyle === 'default' ? 'h-14 px-6 end-2 xl:end-4' : 'h-12 px-4 end-2'
          )}
        >
          <span className={clsx('whitespace-nowrap', formStyle === 'default' ? 'text-sm' : 'text-xs')}>
            Find Dentists
          </span>
        </button>
      </Form>

      {/* Features Section */}
      <div className="flex flex-wrap items-center justify-start gap-6 py-4 px-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
          <span className="font-medium">Premium Care</span>
        </div>
        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600 hidden sm:block"></div>
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
          <span className="font-medium">Certified Specialists</span>
        </div>
        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600 hidden sm:block"></div>
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0"></div>
          <span className="font-medium">Travel Assistance</span>
        </div>
      </div>
    </div>
  )
}