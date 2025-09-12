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

export const DentalSearchForm = ({ className, formStyle = 'default' }: Props) => {
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
              className="text-sm font-medium text-[#D35C2F] hover:text-[#D35C2F]/80 transition-colors"
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
            'absolute z-10 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#D35C2F] to-[#D35C2F]/80 hover:from-[#D35C2F]/90 hover:to-[#D35C2F]/70 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center',
            formStyle === 'default' ? 'h-14 px-6 end-2 xl:end-4' : 'h-12 px-4 end-2'
          )}
        >
          <span className={clsx('whitespace-nowrap', formStyle === 'default' ? 'text-sm' : 'text-xs')}>
            Find Treatment
          </span>
        </button>
      </Form>
    </div>
  )
}