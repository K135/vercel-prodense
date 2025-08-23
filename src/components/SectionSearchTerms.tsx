import React from 'react'

interface SectionSearchTermsProps {
  className?: string
}

const SectionSearchTerms: React.FC<SectionSearchTermsProps> = ({ className = '' }) => {
  const searchCategories = [
    {
      title: "Dental Procedures",
      terms: [
        "Root Canal Treatment (RCT)",
        "Dental Crowns",
        "Laser Dentistry",
        "Clear Aligners / Invisible Braces",
        "Dental Fillings / Teeth Fillings",
        "Wisdom Teeth Removal",
        "Dental Implants",
        "Dental Bridges",
        "Porcelain Veneers",
        "Teeth Whitening",
        "Dentures",
        "Gum Treatment / Periodontal Therapy",
        "Smile Makeover",
        "Pediatric Dentistry",
        "Full Mouth Rehabilitation"
      ]
    },
    {
      title: "Places",
      terms: [
        "Dental Clinics in Delhi",
        "Dental Tourism in Mumbai",
        "Best Dentists in Bangalore",
        "Dental Implants in Chennai",
        "Dental Tourism in Hyderabad",
        "Affordable Dental Care in Goa",
        "Cosmetic Dentistry in Jaipur",
        "Dental Clinics in Kochi",
        "Dental Treatments in Pune",
        "Dental Crowns in Chandigarh",
        "Dental Tourism India",
        "Dental Tourism Thailand",
        "Dental Clinics in Dubai",
        "Dental Tourism Turkey",
        "Dental Implants in Hungary",
        "Dental Clinics in Spain",
        "Dental Care in Mexico",
        "Dental Tourism in Philippines",
        "Dental Tourism in Vietnam",
        "Dental Tourism in Malaysia"
      ]
    },
    {
      title: "Travel & Stay",
      terms: [
        "Dental Tourism Packages India",
        "Dentist with Hotel Package",
        "Medical Visa for Dental Treatment India",
        "Airport Transfers for Patients",
        "Hotels near Dental Clinics India",
        "Dental Care with Tourism Add-ons",
        "Affordable Stay with Dental Procedures",
        "Dental Tourism with Sightseeing Tours"
      ]
    },
    {
      title: "Aftercare & Support",
      terms: [
        "Post-Treatment Dental Care India",
        "Follow-up Consultations Abroad",
        "Access Dental Records Online",
        "Emergency Dental Support for Tourists",
        "Global Network Dentists for Aftercare",
        "24/7 Dental Assistance for Patients",
        "AI Chat Support for Dental Tourism"
      ]
    },
    {
      title: "Prodense",
      terms: [
        "Prodense Dental Tourism",
        "Prodense India Dental Care",
        "Prodense Dental Travel Portal",
        "Prodense Dental Packages",
        "Prodense Dentist Network",
        "Prodense AI Dental Assistant",
        "Prodense Good Faith Cost Estimator",
        "Prodense Dental Clinics India",
        "Prodense Accommodation and Travel",
        "Prodense Global Dental Care",
        "Prodense Dental Tourism Reviews",
        "Prodense Smiles Without Borders"
      ]
    }
  ]

  const createSlug = (term: string) => {
    return term.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  return (
    <section className={`py-8 bg-gray-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">People search for</h3>
            
            <div className="space-y-6">
              {searchCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="text-left">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    {category.title}
                  </h4>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    {category.terms.map((term, termIndex) => (
                      <span key={termIndex}>
                        <a 
                          href={`#${createSlug(term)}`}
                          className="hover:text-blue-600 hover:underline transition-colors duration-200"
                        >
                          {term}
                        </a>
                        {termIndex < category.terms.length - 1 && (
                          <span className="mx-1 text-gray-400">|</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SectionSearchTerms