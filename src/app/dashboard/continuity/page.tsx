'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  ClockIcon,
  StarIcon,
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartIconSolid,
  MapPinIcon as MapPinIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface DentalClinic {
  id: string
  name: string
  place: string
  phone: string
  mapUrl: string
  state: string
  country: string
  rating?: number
  specialties?: string[]
  distance?: string
}

const dentalClinics: DentalClinic[] = [
  {
    id: '1',
    name: 'Oak Street Dental Care',
    place: 'Portland, OR',
    phone: '+1 503-555-0101',
    mapUrl: 'https://maps.google.com/?q=Oak+Street+Dental+Care+Portland+OR',
    state: 'Oregon',
    country: 'United States',
    rating: 4.8,
    specialties: ['General Dentistry', 'Cosmetic Dentistry'],
    distance: '2.3 miles'
  },
  {
    id: '2',
    name: 'Green Valley Family Dentistry',
    place: 'Denver, CO',
    phone: '+1 303-555-0202',
    mapUrl: 'https://maps.google.com/?q=Green+Valley+Family+Dentistry+Denver+CO',
    state: 'Colorado',
    country: 'United States',
    rating: 4.9,
    specialties: ['Family Dentistry', 'Pediatric Care'],
    distance: '1.8 miles'
  },
  {
    id: '3',
    name: 'Suncoast Pediatric Dental',
    place: 'Tampa, FL',
    phone: '+1 813-555-0303',
    mapUrl: 'https://maps.google.com/?q=Suncoast+Pediatric+Dental+Tampa+FL',
    state: 'Florida',
    country: 'United States',
    rating: 4.7,
    specialties: ['Pediatric Dentistry', 'Orthodontics'],
    distance: '3.1 miles'
  },
  {
    id: '4',
    name: 'Lakeside Dental Group',
    place: 'Cleveland, OH',
    phone: '+1 216-555-0404',
    mapUrl: 'https://maps.google.com/?q=Lakeside+Dental+Group+Cleveland+OH',
    state: 'Ohio',
    country: 'United States',
    rating: 4.6,
    specialties: ['General Dentistry', 'Oral Surgery'],
    distance: '4.2 miles'
  },
  {
    id: '5',
    name: 'Mountainview Oral Health',
    place: 'Salt Lake City, UT',
    phone: '+1 801-555-0505',
    mapUrl: 'https://maps.google.com/?q=Mountainview+Oral+Health+Salt+Lake+City+UT',
    state: 'Utah',
    country: 'United States',
    rating: 4.8,
    specialties: ['Oral Health', 'Preventive Care'],
    distance: '5.7 miles'
  },
  {
    id: '6',
    name: 'Midtown Smile Studio',
    place: 'New York, NY',
    phone: '+1 212-555-0606',
    mapUrl: 'https://maps.google.com/?q=Midtown+Smile+Studio+New+York+NY',
    state: 'New York',
    country: 'United States',
    rating: 4.9,
    specialties: ['Cosmetic Dentistry', 'Implants'],
    distance: '0.8 miles'
  },
  {
    id: '7',
    name: 'Golden Gate Dental Care',
    place: 'San Francisco, CA',
    phone: '+1 415-555-0707',
    mapUrl: 'https://maps.google.com/?q=Golden+Gate+Dental+Care+San+Francisco+CA',
    state: 'California',
    country: 'United States',
    rating: 4.7,
    specialties: ['General Dentistry', 'Periodontics'],
    distance: '1.2 miles'
  },
  {
    id: '8',
    name: 'Lone Star Family Dentistry',
    place: 'Austin, TX',
    phone: '+1 512-555-0808',
    mapUrl: 'https://maps.google.com/?q=Lone+Star+Family+Dentistry+Austin+TX',
    state: 'Texas',
    country: 'United States',
    rating: 4.8,
    specialties: ['Family Dentistry', 'Emergency Care'],
    distance: '2.9 miles'
  },
  {
    id: '9',
    name: 'Seaside Dental Arts',
    place: 'Virginia Beach, VA',
    phone: '+1 757-555-0909',
    mapUrl: 'https://maps.google.com/?q=Seaside+Dental+Arts+Virginia+Beach+VA',
    state: 'Virginia',
    country: 'United States',
    rating: 4.6,
    specialties: ['Dental Arts', 'Restorative Care'],
    distance: '6.3 miles'
  },
  {
    id: '10',
    name: 'Riverfront Dentistry',
    place: 'St. Louis, MO',
    phone: '+1 314-555-1010',
    mapUrl: 'https://maps.google.com/?q=Riverfront+Dentistry+St+Louis+MO',
    state: 'Missouri',
    country: 'United States',
    rating: 4.5,
    specialties: ['General Dentistry', 'Crowns & Bridges'],
    distance: '3.7 miles'
  },
  {
    id: '11',
    name: 'Windy City Gentle Dental',
    place: 'Chicago, IL',
    phone: '+1 312-555-1111',
    mapUrl: 'https://maps.google.com/?q=Windy+City+Gentle+Dental+Chicago+IL',
    state: 'Illinois',
    country: 'United States',
    rating: 4.8,
    specialties: ['Gentle Dentistry', 'Sedation Dentistry'],
    distance: '2.1 miles'
  },
  {
    id: '12',
    name: 'Twin Cities Dental Studio',
    place: 'Minneapolis, MN',
    phone: '+1 612-555-1212',
    mapUrl: 'https://maps.google.com/?q=Twin+Cities+Dental+Studio+Minneapolis+MN',
    state: 'Minnesota',
    country: 'United States',
    rating: 4.7,
    specialties: ['Dental Studio', 'Aesthetic Dentistry'],
    distance: '4.8 miles'
  },
  {
    id: '13',
    name: 'Sunshine State Smiles',
    place: 'Orlando, FL',
    phone: '+1 407-555-1313',
    mapUrl: 'https://maps.google.com/?q=Sunshine+State+Smiles+Orlando+FL',
    state: 'Florida',
    country: 'United States',
    rating: 4.9,
    specialties: ['Smile Makeovers', 'Whitening'],
    distance: '1.5 miles'
  },
  {
    id: '14',
    name: 'Capital City Dentistry',
    place: 'Washington, DC',
    phone: '+1 202-555-1414',
    mapUrl: 'https://maps.google.com/?q=Capital+City+Dentistry+Washington+DC',
    state: 'District of Columbia',
    country: 'United States',
    rating: 4.6,
    specialties: ['General Dentistry', 'Root Canal'],
    distance: '2.7 miles'
  },
  {
    id: '15',
    name: 'Beehive Dental Partners',
    place: 'Provo, UT',
    phone: '+1 801-555-1515',
    mapUrl: 'https://maps.google.com/?q=Beehive+Dental+Partners+Provo+UT',
    state: 'Utah',
    country: 'United States',
    rating: 4.7,
    specialties: ['Partnership Care', 'Family Dentistry'],
    distance: '8.2 miles'
  },
  {
    id: '16',
    name: 'Fox Valley Family Dentist',
    place: 'Aurora, IL',
    phone: '+1 630-555-1616',
    mapUrl: 'https://maps.google.com/?q=Fox+Valley+Family+Dentist+Aurora+IL',
    state: 'Illinois',
    country: 'United States',
    rating: 4.5,
    specialties: ['Family Dentistry', 'Preventive Care'],
    distance: '12.3 miles'
  },
  {
    id: '17',
    name: 'Bayou Dental Clinic',
    place: 'New Orleans, LA',
    phone: '+1 504-555-1717',
    mapUrl: 'https://maps.google.com/?q=Bayou+Dental+Clinic+New+Orleans+LA',
    state: 'Louisiana',
    country: 'United States',
    rating: 4.8,
    specialties: ['General Dentistry', 'Emergency Care'],
    distance: '3.4 miles'
  },
  {
    id: '18',
    name: 'Emerald City Smiles',
    place: 'Seattle, WA',
    phone: '+1 206-555-1818',
    mapUrl: 'https://maps.google.com/?q=Emerald+City+Smiles+Seattle+WA',
    state: 'Washington',
    country: 'United States',
    rating: 4.9,
    specialties: ['Smile Design', 'Implant Dentistry'],
    distance: '1.9 miles'
  },
  {
    id: '19',
    name: 'Palm Desert Dental Spa',
    place: 'Palm Springs, CA',
    phone: '+1 760-555-1919',
    mapUrl: 'https://maps.google.com/?q=Palm+Desert+Dental+Spa+Palm+Springs+CA',
    state: 'California',
    country: 'United States',
    rating: 4.7,
    specialties: ['Dental Spa', 'Luxury Care'],
    distance: '15.6 miles'
  },
  {
    id: '20',
    name: 'Bluegrass Dental Group',
    place: 'Lexington, KY',
    phone: '+1 859-555-2020',
    mapUrl: 'https://maps.google.com/?q=Bluegrass+Dental+Group+Lexington+KY',
    state: 'Kentucky',
    country: 'United States',
    rating: 4.6,
    specialties: ['Group Practice', 'Comprehensive Care'],
    distance: '7.1 miles'
  },
  {
    id: '21',
    name: 'Bay Area Bright Smiles',
    place: 'Oakland, CA',
    phone: '+1 510-555-2121',
    mapUrl: 'https://maps.google.com/?q=Bay+Area+Bright+Smiles+Oakland+CA',
    state: 'California',
    country: 'United States',
    rating: 4.8,
    specialties: ['Bright Smiles', 'Orthodontics'],
    distance: '4.3 miles'
  },
  {
    id: '22',
    name: 'Desert View Dentistry',
    place: 'Phoenix, AZ',
    phone: '+1 602-555-2222',
    mapUrl: 'https://maps.google.com/?q=Desert+View+Dentistry+Phoenix+AZ',
    state: 'Arizona',
    country: 'United States',
    rating: 4.7,
    specialties: ['Desert Care', 'General Dentistry'],
    distance: '9.8 miles'
  },
  {
    id: '23',
    name: 'Mile High Dental Studio',
    place: 'Denver, CO',
    phone: '+1 303-555-2323',
    mapUrl: 'https://maps.google.com/?q=Mile+High+Dental+Studio+Denver+CO',
    state: 'Colorado',
    country: 'United States',
    rating: 4.9,
    specialties: ['High Altitude Care', 'Studio Dentistry'],
    distance: '2.8 miles'
  },
  {
    id: '24',
    name: 'Ocean City Dental Care',
    place: 'Ocean City, MD',
    phone: '+1 410-555-2424',
    mapUrl: 'https://maps.google.com/?q=Ocean+City+Dental+Care+Ocean+City+MD',
    state: 'Maryland',
    country: 'United States',
    rating: 4.5,
    specialties: ['Coastal Care', 'Vacation Dentistry'],
    distance: '18.7 miles'
  },
  {
    id: '25',
    name: 'Queen City Dental Arts',
    place: 'Charlotte, NC',
    phone: '+1 704-555-2525',
    mapUrl: 'https://maps.google.com/?q=Queen+City+Dental+Arts+Charlotte+NC',
    state: 'North Carolina',
    country: 'United States',
    rating: 4.8,
    specialties: ['Dental Arts', 'Cosmetic Procedures'],
    distance: '5.2 miles'
  },
  {
    id: '26',
    name: 'Music City Dental Studio',
    place: 'Nashville, TN',
    phone: '+1 615-555-2626',
    mapUrl: 'https://maps.google.com/?q=Music+City+Dental+Studio+Nashville+TN',
    state: 'Tennessee',
    country: 'United States',
    rating: 4.7,
    specialties: ['Music City Care', 'Entertainment District'],
    distance: '6.9 miles'
  },
  {
    id: '27',
    name: 'River City Smiles',
    place: 'Sacramento, CA',
    phone: '+1 916-555-2727',
    mapUrl: 'https://maps.google.com/?q=River+City+Smiles+Sacramento+CA',
    state: 'California',
    country: 'United States',
    rating: 4.6,
    specialties: ['River City Care', 'Family Smiles'],
    distance: '11.4 miles'
  },
  {
    id: '28',
    name: 'Capital Region Family Dentistry',
    place: 'Albany, NY',
    phone: '+1 518-555-2828',
    mapUrl: 'https://maps.google.com/?q=Capital+Region+Family+Dentistry+Albany+NY',
    state: 'New York',
    country: 'United States',
    rating: 4.5,
    specialties: ['Capital Region', 'Family Care'],
    distance: '13.2 miles'
  },
  {
    id: '29',
    name: 'Granite State Dental Practice',
    place: 'Manchester, NH',
    phone: '+1 603-555-2929',
    mapUrl: 'https://maps.google.com/?q=Granite+State+Dental+Practice+Manchester+NH',
    state: 'New Hampshire',
    country: 'United States',
    rating: 4.7,
    specialties: ['Granite State Care', 'Practice Excellence'],
    distance: '8.7 miles'
  },
  {
    id: '30',
    name: 'Bluegrass Pediatric Dentistry',
    place: 'Louisville, KY',
    phone: '+1 502-555-3030',
    mapUrl: 'https://maps.google.com/?q=Bluegrass+Pediatric+Dentistry+Louisville+KY',
    state: 'Kentucky',
    country: 'United States',
    rating: 4.9,
    specialties: ['Pediatric Dentistry', 'Child Care'],
    distance: '4.6 miles'
  }
]

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' }
]

const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming', 'District of Columbia'
]

export default function ContinuityPage() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [detectedLocation, setDetectedLocation] = useState<{country: string, state?: string} | null>(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [filteredClinics, setFilteredClinics] = useState<DentalClinic[]>([])
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showStateDropdown, setShowStateDropdown] = useState(false)

  // Simulate IP-based location detection
  useEffect(() => {
    const detectLocation = async () => {
      setIsDetectingLocation(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock detected location (in real app, this would be from IP geolocation API)
      const mockLocation = { country: 'United States', state: 'California' }
      setDetectedLocation(mockLocation)
      setSelectedCountry('US')
      setSelectedState('California')
      setIsDetectingLocation(false)
    }

    detectLocation()
  }, [])

  // Filter clinics based on selection and search
  useEffect(() => {
    let filtered = dentalClinics

    if (selectedCountry && selectedCountry !== 'all') {
      const countryName = countries.find(c => c.code === selectedCountry)?.name
      if (countryName) {
        filtered = filtered.filter(clinic => clinic.country === countryName)
      }
    }

    if (selectedState && selectedState !== 'all') {
      filtered = filtered.filter(clinic => clinic.state === selectedState)
    }

    if (searchTerm) {
      filtered = filtered.filter(clinic => 
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.specialties?.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    setFilteredClinics(filtered)
  }, [selectedCountry, selectedState, searchTerm])

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode)
    setSelectedState('') // Reset state when country changes
    setShowCountryDropdown(false)
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setShowStateDropdown(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-[#DB3116] to-red-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <HeartIconSolid className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Continuity Care
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
          Find our trusted partner clinics in your area for seamless follow-up care after your treatment in India
        </p>
      </motion.div>

      {/* Location Detection Banner */}
      {isDetectingLocation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              Detecting your location...
            </p>
          </div>
        </motion.div>
      )}

      {detectedLocation && !isDetectingLocation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <MapPinIconSolid className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-200 font-medium">
              Location detected: {detectedLocation.state}, {detectedLocation.country}
            </p>
          </div>
        </motion.div>
      )}

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Country Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Country
            </label>
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-5 w-5 text-slate-400" />
                <span className="text-slate-900 dark:text-white">
                  {selectedCountry ? 
                    `${countries.find(c => c.code === selectedCountry)?.flag} ${countries.find(c => c.code === selectedCountry)?.name}` : 
                    'Select Country'
                  }
                </span>
              </div>
              <ChevronDownIcon className="h-5 w-5 text-slate-400" />
            </button>
            
            <AnimatePresence>
              {showCountryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <button
                    onClick={() => handleCountryChange('all')}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    🌍 All Countries
                  </button>
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountryChange(country.code)}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2"
                    >
                      <span>{country.flag}</span>
                      <span className="text-slate-900 dark:text-white">{country.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* State Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              State/Region
            </label>
            <button
              onClick={() => setShowStateDropdown(!showStateDropdown)}
              disabled={!selectedCountry || selectedCountry === 'all'}
              className={clsx(
                "w-full flex items-center justify-between px-4 py-3 border rounded-lg text-left transition-colors",
                selectedCountry && selectedCountry !== 'all'
                  ? "bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed"
              )}
            >
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-slate-400" />
                <span className={clsx(
                  selectedState ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                )}>
                  {selectedState || 'Select State/Region'}
                </span>
              </div>
              <ChevronDownIcon className="h-5 w-5 text-slate-400" />
            </button>
            
            <AnimatePresence>
              {showStateDropdown && selectedCountry === 'US' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <button
                    onClick={() => handleStateChange('all')}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    All States
                  </button>
                  {usStates.map((state) => (
                    <button
                      key={state}
                      onClick={() => handleStateChange(state)}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white"
                    >
                      {state}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search Clinics
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, location, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#DB3116] focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>
            {filteredClinics.length} partner clinic{filteredClinics.length !== 1 ? 's' : ''} found
          </span>
          {selectedCountry && selectedCountry !== 'all' && (
            <span className="flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4" />
              <span>
                {countries.find(c => c.code === selectedCountry)?.name}
                {selectedState && selectedState !== 'all' && `, ${selectedState}`}
              </span>
            </span>
          )}
        </div>
      </motion.div>

      {/* Clinics Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredClinics.map((clinic, index) => (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Clinic Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#DB3116] transition-colors">
                      {clinic.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 mb-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="text-sm">{clinic.place}</span>
                    </div>
                    {clinic.distance && (
                      <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-500 mb-3">
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-sm">{clinic.distance} away</span>
                      </div>
                    )}
                  </div>
                  {clinic.rating && (
                    <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                      <StarIconSolid className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                        {clinic.rating}
                      </span>
                    </div>
                  )}
                </div>

                {/* Specialties */}
                {clinic.specialties && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {clinic.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Clinic Actions */}
              <div className="px-6 pb-6 space-y-3">
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <PhoneIcon className="h-4 w-4" />
                  <a 
                    href={`tel:${clinic.phone}`}
                    className="text-sm hover:text-[#DB3116] transition-colors"
                  >
                    {clinic.phone}
                  </a>
                </div>
                
                <div className="flex space-x-2">
                  <a
                    href={clinic.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                  >
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    View Map
                    <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
                  </a>
                  <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[#DB3116] text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    Book Visit
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredClinics.length === 0 && !isDetectingLocation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <BuildingOfficeIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No clinics found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Try adjusting your search criteria or selecting a different location
          </p>
          <button
            onClick={() => {
              setSelectedCountry('')
              setSelectedState('')
              setSearchTerm('')
            }}
            className="inline-flex items-center px-4 py-2 bg-[#DB3116] text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  )
}