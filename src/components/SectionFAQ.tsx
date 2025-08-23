'use client'

import React, { useState } from 'react'
import HeadingWithSub from '@/shared/Heading'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface FAQItem {
  question: string
  answer: string
}

interface SectionFAQProps {
  className?: string
}

const faqData: FAQItem[] = [
  {
    question: "What is Prodense?",
    answer: "Prodense is India's first dental tourism enabler — connecting international patients with accredited dentists in India's top destinations. We combine treatment, travel, and accommodation into one seamless experience, with global aftercare support when you return home."
  },
  {
    question: "How do I know the dentists are qualified?",
    answer: "Every clinic and dentist on Prodense is verified for credentials, certifications, and international standards (JCI, HIPAA, local councils). You can view their profiles, qualifications, and patient reviews before booking."
  },
  {
    question: "How much will my treatment cost?",
    answer: "We provide a Good Faith Cost Estimator that gives you a transparent, upfront range based on your treatment, location, and stay duration. Final pricing is confirmed by the chosen clinic before booking."
  },
  {
    question: "Can Prodense help with my travel and stay?",
    answer: "Yes! Through our partners, we offer hotel and travel booking support. You can choose accommodation near your clinic and even add sightseeing packages."
  },
  {
    question: "What happens after I return home?",
    answer: "Your treatment records are securely stored online, and with our partner network, you can book follow-up consultations with local dentists in your own country. This ensures continuity of care after your trip."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept PayPal, Stripe, international credit/debit cards, and UPI (for Indian users). All transactions are secure and transparent."
  },
  {
    question: "Is the platform multilingual?",
    answer: "Yes. Our website and AI assistant support multiple languages (English, Spanish, Russian, French, and more), making it easy for patients across regions."
  },
  {
    question: "What if I face an emergency during treatment or aftercare?",
    answer: "We provide 24/7 emergency support through chat, call, and dedicated hotlines, ensuring that you're never alone in your dental journey."
  },
  {
    question: "Do I need a visa for dental treatment in India?",
    answer: "Yes, international patients require a valid Medical Visa or Tourist Visa to travel for dental procedures. Our support team can guide you through the process."
  },
  {
    question: "How do loyalty points work?",
    answer: "With each booking, you earn loyalty points that can be redeemed for discounts on future treatments, travel add-ons, or hotel stays."
  }
]

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle
}) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <div className="pt-2 border-t border-gray-100">
            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const SectionFAQ: React.FC<SectionFAQProps> = ({ className = '' }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  // Split FAQ items into two columns
  const midPoint = Math.ceil(faqData.length / 2)
  const leftColumnItems = faqData.slice(0, midPoint)
  const rightColumnItems = faqData.slice(midPoint)

  return (
    <section className={`py-16 lg:py-20 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <HeadingWithSub 
            subheading="Get answers to the most common questions about dental tourism with Prodense."
            isCenter
          >
            Frequently Asked Questions
          </HeadingWithSub>
        </div>

        {/* 50-50 Split FAQ Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="space-y-0">
              {leftColumnItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  item={item}
                  isOpen={openItems.has(index)}
                  onToggle={() => toggleItem(index)}
                />
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-0">
              {rightColumnItems.map((item, index) => {
                const actualIndex = index + midPoint
                return (
                  <AccordionItem
                    key={actualIndex}
                    item={item}
                    isOpen={openItems.has(actualIndex)}
                    onToggle={() => toggleItem(actualIndex)}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Still have questions? Our support team is here to help.
          </p>
          <button className="bg-black text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  )
}

export default SectionFAQ