'use client'

import { FC } from 'react'

interface BusinessStep {
  number: string
  title: string
  description: string
}

interface Props {
  className?: string
  businessSteps?: BusinessStep[]
}

const SectionHowToGetCare: FC<Props> = ({
  className = '',
  businessSteps = [
    {
      number: '1',
      title: 'Book Consultation',
      description: 'Start with a virtual consultation with our certified dental specialists. Get personalized treatment plans and cost estimates.',
    },
    {
      number: '2',
      title: 'Plan Your Trip',
      description: 'We handle everything - from visa assistance to accommodation bookings. Choose from luxury resorts or budget-friendly options.',
    },
    {
      number: '3',
      title: 'Get Treatment',
      description: 'Receive world-class dental care in state-of-the-art facilities with internationally trained dentists.',
    },
    {
      number: '4',
      title: 'Enjoy & Recover',
      description: 'Relax and recover while exploring India\'s beautiful destinations. We provide 24/7 post-treatment support.',
    },
  ]
}) => {
  return (
    <div className={className}>
      {/* Business Platform Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-gray-100 dark:bg-neutral-800 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Section */}
              <div className="p-8 lg:p-12">
                <div className="relative rounded-3xl overflow-hidden">
                  <img 
                    className="w-full h-auto object-cover" 
                    src="/images/homepage7/img.png" 
                    alt="Business Platform" 
                  />
                  <h4 className="absolute top-6 left-6 text-blue-800 dark:text-blue-400 font-bold text-lg bg-white/90 dark:bg-neutral-800/90 px-4 py-2 rounded-lg">
                    Prodense Dental Platform
                  </h4>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 lg:p-12">
                <h2 className="text-2xl lg:text-3xl font-bold text-blue-800 dark:text-blue-400 mb-8">
                  How to get your <br className="hidden lg:block" />dental care fast
                </h2>
                
                <div className="space-y-6">
                  {businessSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 group hover:transform hover:translate-x-2 transition-transform duration-300">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-bold text-blue-800 dark:text-blue-400 mb-3">
                          {step.title}
                        </h5>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SectionHowToGetCare