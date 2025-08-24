'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/shared/Button'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  UserIcon, 
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  PhoneArrowUpRightIcon
} from '@heroicons/react/24/outline'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
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

  const procedures = [
    { name: 'Dental Implants', href: '/procedures/dental-implants' },
    { name: 'Teeth Whitening', href: '/procedures/teeth-whitening' },
    { name: 'Root Canal Treatment', href: '/procedures/root-canal' },
    { name: 'Orthodontics', href: '/procedures/orthodontics' },
    { name: 'Oral Surgery', href: '/procedures/oral-surgery' },
    { name: 'Cosmetic Dentistry', href: '/procedures/cosmetic-dentistry' },
  ]

  const destinations = [
    { name: 'Goa', href: '/destinations/goa' },
    { name: 'Kerala', href: '/destinations/kerala' },
    { name: 'Rajasthan', href: '/destinations/rajasthan' },
    { name: 'Tamil Nadu', href: '/destinations/tamil-nadu' },
    { name: 'Karnataka', href: '/destinations/karnataka' },
    { name: 'Himachal Pradesh', href: '/destinations/himachal-pradesh' },
  ]

  return (
    <div className={clsx('', className)}>
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-[#0480ea] to-[#f07499] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            {/* Contact Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>info@prodense.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4" />
                <span>+91 (800) 123-4567</span>
              </div>
            </div>

            {/* Find Clinic Link */}
            <div className="hidden md:flex items-center">
              <Link 
                href="/find-clinic" 
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-bold text-white transition-colors"
              >
                <MapPinIcon className="h-4 w-4" />
                <span>Find Nemotec Clinic</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      {/* Placeholder to prevent content jump when header becomes fixed */}
      {isScrolled && <div className="h-[72px]" />}
      
      <div className={clsx(
        'z-50 bg-white shadow-sm transition-all duration-300',
        isScrolled 
          ? 'fixed top-0 left-0 right-0'
          : 'relative'
      )}>
        <div className="container mx-auto px-2">
          <div className="flex items-center py-4">
            {/* Logo & Branding */}
            <div className="flex items-center flex-shrink-0 mr-4">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/images/logos/Prodense health logo.png?v=2" 
                  alt="Prodense Health" 
                  width={160} 
                  height={160} 
                  className="rounded-lg"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {/* Procedures Dropdown */}
            <Popover className="relative">
              <PopoverButton className="flex items-center space-x-1 text-gray-700 hover:text-[#0480ea] font-bold transition-colors">
                <span>Procedures</span>
                <ChevronDownIcon className="h-4 w-4" />
              </PopoverButton>
              <PopoverPanel className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                {procedures.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-[#0480ea]/10 hover:text-[#0480ea] transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </PopoverPanel>
            </Popover>

            {/* Destinations Dropdown */}
            <Popover className="relative">
              <PopoverButton className="flex items-center space-x-1 text-gray-700 hover:text-[#0480ea] font-bold transition-colors">
                <span>Destinations</span>
                <ChevronDownIcon className="h-4 w-4" />
              </PopoverButton>
              <PopoverPanel className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                {destinations.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-[#0480ea]/10 hover:text-[#0480ea] transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </PopoverPanel>
            </Popover>

            {/* Other Menu Items */}
            <Link href="/ask-doctor" className="flex items-center space-x-1 text-gray-700 hover:text-[#0480ea] font-bold transition-colors">
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              <span>Ask a Doctor</span>
            </Link>

            {/* About Prodense Dropdown */}
            <Popover className="relative">
              <PopoverButton className="flex items-center space-x-1 text-gray-700 hover:text-[#0480ea] font-bold transition-colors">
                <InformationCircleIcon className="h-4 w-4" />
                <span>About Prodense</span>
                <ChevronDownIcon className="h-4 w-4" />
              </PopoverButton>
              <PopoverPanel className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <Link
                  href="/about"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#0480ea]/10 hover:text-[#0480ea] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/brand-story"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#0480ea]/10 hover:text-[#0480ea] transition-colors"
                >
                  Brand Story
                </Link>
                <Link
                  href="/prodense-promise"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#0480ea]/10 hover:text-[#0480ea] transition-colors"
                >
                  Prodense Promise
                </Link>
                <Link
                  href="/csr"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#0480ea]/10 hover:text-[#0480ea] transition-colors"
                >
                  CSR
                </Link>
              </PopoverPanel>
            </Popover>

            <Link href="/travel-assistance" className="flex items-center space-x-1 text-gray-700 hover:text-[#0480ea] font-bold transition-colors">
              <DocumentTextIcon className="h-4 w-4" />
              <span>Travel Assistance</span>
            </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0 ml-auto">
              {/* Emergency Hotline - Always Visible */}
              <Link 
                href="tel:+918001234567" 
                className="hidden sm:flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-bold transition-colors text-sm"
              >
                <PhoneArrowUpRightIcon className="h-4 w-4" />
                <span>Emergency</span>
              </Link>

              {/* Login */}
              <div className="hidden md:flex items-center">
                <Button 
                  href="/login" 
                  className="bg-[#0480ea] hover:bg-[#0480ea]/90 text-white flex items-center space-x-1 px-3 py-2 text-sm"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
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
            {/* Mobile Procedures */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Procedures</h3>
              <div className="space-y-2 pl-4">
                {procedures.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-600 hover:text-[#0480ea] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Destinations */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Destinations</h3>
              <div className="space-y-2 pl-4">
                {destinations.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-600 hover:text-[#0480ea] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Other Links */}
            <div className="space-y-2">
              <Link href="/ask-doctor" className="block text-gray-600 hover:text-[#0480ea] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Ask a Doctor
              </Link>
              
              {/* Mobile About Prodense Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">About Prodense</h3>
                <div className="space-y-2 pl-4">
                  <Link href="/about" className="block text-gray-600 hover:text-[#0480ea] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    About Us
                  </Link>
                  <Link href="/brand-story" className="block text-gray-600 hover:text-[#0480ea] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    Brand Story
                  </Link>
                  <Link href="/prodense-promise" className="block text-gray-600 hover:text-[#0480ea] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    Prodense Promise
                  </Link>
                  <Link href="/csr" className="block text-gray-600 hover:text-[#0480ea] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    CSR
                  </Link>
                </div>
              </div>
              
              <Link href="/travel-assistance" className="block text-gray-600 hover:text-[#0480ea] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Travel Assistance
              </Link>
            </div>

            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Link 
                href="tel:+918001234567" 
                className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-bold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PhoneArrowUpRightIcon className="h-5 w-5" />
                <span>Emergency Hotline</span>
              </Link>
              <Button 
                href="/login" 
                className="w-full flex items-center justify-center space-x-2 bg-[#0480ea] hover:bg-[#0480ea]/90 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserIcon className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicalTourismHeader