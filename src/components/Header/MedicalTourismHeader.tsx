'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { 
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface MedicalTourismHeaderProps {
  className?: string
}

const MedicalTourismHeader: React.FC<MedicalTourismHeaderProps> = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const topBarHeight = 44 // Approximate height of the top bar
      setIsScrolled(scrollTop > topBarHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [selectedCategory, setSelectedCategory] = useState('Dentistry')
  const [isServicesHovered, setIsServicesHovered] = useState(false)
  const [isAboutHovered, setIsAboutHovered] = useState(false)
  const [isPartnersHovered, setIsPartnersHovered] = useState(false)
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null)

  const serviceCategories = {
    'Dentistry': [
      { name: 'Dental Restoration', href: '/services/dental-restoration' },
      { name: 'Dental Implant', href: '/services/dental-implant' },
      { name: 'Root Canal Treatment', href: '/services/root-canal-treatment' },
      { name: 'Crown', href: '/services/crown' },
      { name: 'Teeth Whitening', href: '/services/teeth-whitening' },
      { name: 'Veneer', href: '/services/veneer' },
      { name: 'Dentures', href: '/services/dentures' },
      { name: 'Dental Braces', href: '/services/dental-braces' },
      { name: 'Dental Bonding', href: '/services/dental-bonding' },
      { name: 'Teeth Cleaning', href: '/services/teeth-cleaning' },
      { name: 'Dental Bridges', href: '/services/dental-bridges' },
      { name: 'Extractions', href: '/services/extractions' },
      { name: 'Bridge', href: '/services/bridge' },
      { name: 'Inlays and Onlays', href: '/services/inlays-onlays' },
      { name: 'Fluoride', href: '/services/fluoride' },
      { name: 'Sealants', href: '/services/sealants' },
      { name: 'Dental Sealant', href: '/services/dental-sealant' },
      { name: 'Cracked Teeth', href: '/services/cracked-teeth' },
      { name: 'Oral and Maxillofacial Surgery', href: '/services/oral-maxillofacial-surgery' },
      { name: 'Wisdom Teeth', href: '/services/wisdom-teeth' },
      { name: 'Tooth Extractions', href: '/services/tooth-extractions' },
    ],
    'Destination': [
      { name: 'Chandigarh', href: '/destinations/chandigarh' },
      { name: 'Jaipur', href: '/destinations/jaipur' },
    ]
  }

  // Get services for selected category
  const getFilteredServices = () => {
    return serviceCategories[selectedCategory as keyof typeof serviceCategories]
  }

  return (
    <div className={clsx('', className)}>
      {/* Main Header */}
      {/* Placeholder to prevent content jump when header becomes fixed */}
      {isScrolled && <div className="h-[72px]" />}
      
      <div className={clsx(
        'z-50 bg-[#D35C2F] shadow-sm transition-all duration-300',
        isScrolled 
          ? 'fixed top-0 left-0 right-0'
          : 'relative'
      )}>
        <div className="container mx-auto px-2">
          <div className="flex items-center py-4">


            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
              {/* Home */}
              <Link href="/" className="text-white hover:text-gray-200 font-bold transition-colors">
                Home
              </Link>

              {/* Services Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setIsServicesHovered(true)}
                onMouseLeave={() => setIsServicesHovered(false)}
              >
                <button className="flex items-center space-x-1 text-white hover:text-gray-200 font-bold transition-colors">
                  <span>Services</span>
                  <ChevronDownIcon className={clsx("h-4 w-4 transition-transform duration-200", isServicesHovered ? "rotate-180" : "")} />
                </button>
                
                {/* Mega Menu Panel */}
                <div className={clsx(
                  "absolute top-full left-0 -ml-5 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 transition-all duration-200",
                  isServicesHovered ? "opacity-100 visible" : "opacity-0 invisible"
                )}>
                  <div className="flex min-h-[500px]">
                    {/* Categories Sidebar */}
                    <div className="w-1/3 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200">
                      <div className="p-6">
                        <div className="space-y-2">
                          {Object.keys(serviceCategories).map((category) => (
                            <button
                              key={category}
                              onClick={() => setSelectedCategory(category)}
                              className={clsx(
                                "w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200",
                                selectedCategory === category
                                  ? "bg-[#D35C2F] text-white shadow-lg transform scale-105"
                                  : "text-gray-700 hover:bg-white hover:text-[#D35C2F] hover:shadow-md"
                              )}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Services Content */}
                    <div className="w-2/3 px-6 pt-6 pb-2">

                      
                      <div className="grid grid-cols-1 gap-0 max-h-[450px] overflow-y-auto custom-scrollbar">
                        {getFilteredServices().length > 0 ? (
                          getFilteredServices().map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="group flex items-center px-3 py-1.5 rounded-lg hover:bg-[#D35C2F]/5 hover:shadow-md transition-all duration-200 border border-transparent hover:border-[#D35C2F]/20"
                          >
                            <div className="w-2 h-2 bg-[#D35C2F] rounded-full mr-3 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-gray-700 group-hover:text-[#D35C2F] font-medium transition-colors">
                              {service.name}
                            </span>
                          </Link>
                          ))
                        ) : (
                          <div className="col-span-1 text-center py-8">
                            <div className="text-gray-400 mb-2">
                              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                            <p className="text-gray-500 font-medium">No procedures found</p>
                            <p className="text-gray-400 text-sm mt-1">Try searching with different keywords</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Prodense Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsAboutHovered(true)}
                onMouseLeave={() => setIsAboutHovered(false)}
              >
                <button className="flex items-center space-x-1 text-white hover:text-gray-200 font-bold transition-colors">
                  <span>About Prodense</span>
                  <ChevronDownIcon className={clsx("h-4 w-4 transition-transform duration-200", isAboutHovered ? "rotate-180" : "")} />
                </button>
                <div className={clsx(
                  "absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 transition-all duration-200",
                  isAboutHovered ? "opacity-100 visible" : "opacity-0 invisible"
                )}>
                  <Link
                    href="/who-we-are"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors"
                  >
                    Who We Are
                  </Link>
                  <Link
                    href="/brand-story"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors"
                  >
                    Brand Story
                  </Link>
                  <Link
                    href="/prodense-promises"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors"
                  >
                    Prodense Promises
                  </Link>
                  <Link
                    href="/d-ai-y"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors"
                  >
                    D-AI-Y
                  </Link>
                  <Link
                    href="/good-faith-estimation"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors"
                  >
                    Good Faith Estimation
                  </Link>
                  <Link
                    href="/csr"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors"
                  >
                    CSR
                  </Link>
                </div>
              </div>

              {/* Our Partners Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsPartnersHovered(true)}
                onMouseLeave={() => {
                  setIsPartnersHovered(false)
                  setHoveredPartner(null)
                }}
              >
                <button className="flex items-center space-x-1 text-white hover:text-gray-200 font-bold transition-colors">
                  <span>Our Partners</span>
                  <ChevronDownIcon className={clsx("h-4 w-4 transition-transform duration-200", isPartnersHovered ? "rotate-180" : "")} />
                </button>
                
                <div className={clsx(
                  "absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 transition-all duration-200",
                  isPartnersHovered ? "opacity-100 visible" : "opacity-0 invisible"
                )}>
                  {/* Nemotec */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setHoveredPartner('nemotec')}
                    onMouseLeave={() => setHoveredPartner(null)}
                  >
                    <div className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors cursor-pointer">
                      <span>Nemotec</span>
                      <ChevronDownIcon className="h-4 w-4 rotate-[-90deg]" />
                    </div>
                    
                    {/* Nemotec Submenu */}
                    <div className={clsx(
                      "absolute left-full top-0 ml-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 transition-all duration-200",
                      hoveredPartner === 'nemotec' ? "opacity-100 visible" : "opacity-0 invisible"
                    )}>
                      <Link
                        href="/partners/nemotec/about"
                        className="block px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors"
                      >
                        About Nemotec
                      </Link>
                      <Link
                        href="/partners/nemotec/centres"
                        className="block px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors"
                      >
                        Find nearest Nemotec Centre
                      </Link>
                    </div>
                  </div>

                  {/* Essence of India */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setHoveredPartner('essence')}
                    onMouseLeave={() => setHoveredPartner(null)}
                  >
                    <div className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors cursor-pointer">
                      <span>Essence of India</span>
                      <ChevronDownIcon className="h-4 w-4 rotate-[-90deg]" />
                    </div>
                    
                    {/* Essence of India Submenu */}
                    <div className={clsx(
                      "absolute left-full top-0 ml-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 transition-all duration-200",
                      hoveredPartner === 'essence' ? "opacity-100 visible" : "opacity-0 invisible"
                    )}>
                      <Link
                        href="/partners/essence-of-india/about"
                        className="block px-4 py-2 text-gray-700 hover:bg-[#D35C2F]/10 hover:text-[#D35C2F] transition-colors"
                      >
                        About Essence of India
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4 flex-shrink-0 ml-auto">
              {/* Beautiful Login/Signup Button */}
              <div className="hidden md:flex items-center">
                <Link 
                  href="/login"
                  className="relative group px-6 py-2.5 bg-white text-[#D35C2F] font-semibold rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Login / Signup</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-gray-200 transition-colors"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 sticky top-0 z-40 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Home */}
            <Link href="/" className="block text-gray-900 hover:text-[#D35C2F] font-semibold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>

            {/* Mobile Services */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
              
              {/* Mobile Dentistry Services */}
              <div className="mb-4">
                <h4 className="font-medium text-[#D35C2F] mb-2 pl-2">Dentistry</h4>
                <div className="space-y-1 pl-4">
                  {serviceCategories.Dentistry.slice(0, 8).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-gray-600 hover:text-[#D35C2F] transition-colors text-sm py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    className="block text-[#D35C2F] hover:text-[#B8491F] transition-colors text-sm py-1 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View All Dentistry Services →
                  </Link>
                </div>
              </div>

              {/* Mobile Destination Services */}
              <div>
                <h4 className="font-medium text-[#D35C2F] mb-2 pl-2">Destination</h4>
                <div className="space-y-1 pl-4">
                  {serviceCategories.Destination.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-gray-600 hover:text-[#D35C2F] transition-colors text-sm py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile About Prodense Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About Prodense</h3>
              <div className="space-y-2 pl-4">
                <Link href="/about" className="block text-gray-600 hover:text-[#D35C2F] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </Link>
                <Link href="/brand-story" className="block text-gray-600 hover:text-[#D35C2F] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Brand Story
                </Link>
                <Link href="/prodense-promise" className="block text-gray-600 hover:text-[#D35C2F] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Prodense Promise
                </Link>
                <Link href="/csr" className="block text-gray-600 hover:text-[#D35C2F] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  CSR
                </Link>
              </div>
            </div>
            
            {/* Mobile Our Partners */}
            <Link href="/partners" className="block text-gray-900 hover:text-[#D35C2F] font-semibold transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Our Partners
            </Link>

            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-gray-200">
              <Link 
                href="/login"
                className="flex items-center justify-center px-6 py-3 bg-[#D35C2F] text-white font-semibold rounded-lg hover:bg-[#B8491F] transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login / Signup
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicalTourismHeader

// Add custom scrollbar styles
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #D35C2F;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #B8491F;
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = customScrollbarStyles
  document.head.appendChild(styleElement)
}