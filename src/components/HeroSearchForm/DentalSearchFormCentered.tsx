'use client'

import clsx from 'clsx'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { VerticalDividerLine } from './ui'
import { ProcedureSelectField } from './ui/ProcedureSelectField'
import { DentalLocationInputField } from './ui/DentalLocationInputField'

interface Props {
  className?: string
  formStyle: 'default' | 'small'
}

export const DentalSearchFormCentered = ({ className, formStyle = 'default' }: Props) => {
  const router = useRouter()

  // Prefetch the dental categories page to improve performance
  useEffect(() => {
    router.prefetch('/dental-categories/all')
  }, [router])

  const handleFormSubmit = (formData: FormData) => {
    const formDataEntries = Object.fromEntries(formData.entries())
    console.log('Dental form submitted', formDataEntries)
    
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
        <ProcedureSelectField className="hero-search-form__field-after flex-4/12" fieldStyle={formStyle} />
        <VerticalDividerLine />
        <DentalLocationInputField 
          className="hero-search-form__field-before hero-search-form__field-after flex-5/12" 
          fieldStyle={formStyle}
          placeholder="Tourist destination in India"
        />
        <VerticalDividerLine />
        <div className="hero-search-form__field-before flex-3/12 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Quick Quote</div>
            <button
              type="button"
              className="text-sm font-medium text-[#0480ea] hover:text-blue-600 transition-colors"
              onClick={() => {
                // Handle quick quote action
                console.log('Quick quote requested')
              }}
            >
              Get Quote
            </button>
          </div>
        </div>

        {/* Custom Dental Search Button */}
        <button 
          type="submit" 
          className={clsx(
            'absolute z-10 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#DB3116] to-[#DB3116]/80 hover:from-[#DB3116]/90 hover:to-[#DB3116]/70 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center',
            formStyle === 'default' ? 'h-14 px-6 end-2 xl:end-4' : 'h-12 px-4 end-2'
          )}
        >
          <span className={clsx('whitespace-nowrap', formStyle === 'default' ? 'text-sm' : 'text-xs')}>
            Find a Dentist
          </span>
        </button>
      </Form>

      {/* Features Section - CENTERED */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-4 px-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
          <span className="font-medium">Affordable</span>
        </div>
        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600 hidden sm:block"></div>
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
          <span className="font-medium">Accredited</span>
        </div>
        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600 hidden sm:block"></div>
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
          <span className="font-medium">Hassle-free</span>
        </div>
        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600 hidden sm:block"></div>
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
          <span className="font-medium">World wide support</span>
        </div>
      </div>

      {/* Good Faith Estimation Button - CENTERED */}
      <div className="flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-black border border-black rounded-full hover:bg-gray-800 hover:border-gray-800 transition-all duration-200 shadow-sm"
          onClick={() => {
            // Handle good faith estimation
            console.log('Good faith estimation requested')
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Good Faith Estimation
        </button>
      </div>
    </div>
  )
}