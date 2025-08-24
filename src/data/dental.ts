// Dental procedures and specialties
export const dentalProcedures = [
  'General Dentistry',
  'Teeth Cleaning',
  'Dental Fillings',
  'Root Canal',
  'Tooth Extraction',
  'Dental Crowns',
  'Dental Bridges',
  'Dental Implants',
  'Orthodontics',
  'Braces',
  'Invisalign',
  'Teeth Whitening',
  'Veneers',
  'Periodontics',
  'Oral Surgery',
  'Pediatric Dentistry',
  'Cosmetic Dentistry',
  'Emergency Dental Care',
]

export const dentalSpecialties = [
  'General Dentist',
  'Orthodontist',
  'Oral Surgeon',
  'Periodontist',
  'Endodontist',
  'Prosthodontist',
  'Pediatric Dentist',
  'Cosmetic Dentist',
  'Oral Pathologist',
]

export const insuranceProviders = [
  'Delta Dental',
  'Cigna',
  'Aetna',
  'MetLife',
  'Blue Cross Blue Shield',
  'Humana',
  'United Healthcare',
  'Guardian',
  'Principal',
  'Anthem',
]

// Dental categories (locations)
export async function getDentalCategories() {
  const defaultCoverImage = {
    src: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
    width: 800,
    height: 600,
  }

  return [
    {
      id: 'dental-cat://1',
      name: 'New York, NY',
      region: 'New York',
      handle: 'new-york-ny',
      href: '/stay-categories/new-york-ny',
      count: 1250,
      thumbnail: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg',
      coverImage: defaultCoverImage,
      description: 'Find top-rated dental clinics in New York City',
    },
    {
      id: 'dental-cat://2',
      name: 'Los Angeles, CA',
      region: 'California',
      handle: 'los-angeles-ca',
      href: '/stay-categories/los-angeles-ca',
      count: 980,
      thumbnail: 'https://images.pexels.com/photos/161963/hollywood-sign-los-angeles-california-161963.jpeg',
      coverImage: defaultCoverImage,
      description: 'Quality dental clinics in Los Angeles',
    },
    {
      id: 'dental-cat://3',
      name: 'Chicago, IL',
      region: 'Illinois',
      handle: 'chicago-il',
      href: '/stay-categories/chicago-il',
      count: 750,
      thumbnail: 'https://images.pexels.com/photos/1823680/pexels-photo-1823680.jpeg',
      coverImage: defaultCoverImage,
      description: 'Professional dental clinics in Chicago',
    },
    {
      id: 'dental-cat://4',
      name: 'Houston, TX',
      region: 'Texas',
      handle: 'houston-tx',
      href: '/stay-categories/houston-tx',
      count: 650,
      thumbnail: 'https://images.pexels.com/photos/2363/skyline-buildings-new-york-skyscrapers.jpg',
      coverImage: defaultCoverImage,
      description: 'Dental clinic professionals in Houston',
    },
    {
      id: 'dental-cat://5',
      name: 'Miami, FL',
      region: 'Florida',
      handle: 'miami-fl',
      href: '/stay-categories/miami-fl',
      count: 580,
      thumbnail: 'https://images.pexels.com/photos/210012/pexels-photo-210012.jpeg',
      coverImage: defaultCoverImage,
      description: 'Top dental clinics in Miami',
    },
  ]
}

export async function getDentalCategoryByHandle(handle?: string) {
  handle = handle?.toLowerCase()

  if (!handle || handle === 'all') {
    return {
      id: 'dental://all',
      name: 'Find Dental Clinics',
      handle: 'all',
      href: '/stay-categories/all',
      region: 'Nationwide',
      count: 15000,
      description: 'Find qualified dental clinics in your area',
      thumbnail: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
      coverImage: {
        src: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
        width: 800,
        height: 600,
      },
    }
  }

  const categories = await getDentalCategories()
  return categories.find((category) => category.handle === handle)
}

// Dental Clinic listings
export type TDentalClinicListing = {
  id: string
  name: string
  handle: string
  title: string
  specialty: string
  description: string
  profileImage: string
  galleryImgs: string[]
  address: string
  phone: string
  email: string
  website?: string
  rating: number
  reviewCount: number
  yearsExperience: number
  procedures: string[]
  insuranceAccepted: string[]
  languages: string[]
  education: string[]
  certifications: string[]
  officeHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  emergencyAvailable: boolean
  newPatientsAccepted: boolean
  consultationFee: string
  isVerified: boolean
  map: { lat: number; lng: number }
}

export async function getDentalClinicListings(): Promise<TDentalClinicListing[]> {
  return [
    {
      id: 'dental-clinic://1',
      name: 'DentSpa',
      handle: 'dentspa',
      title: 'Premium Dental Care & Smile Transformations',
      specialty: 'Cosmetic Dentistry',
      description: 'The clinic specializes in smile transformations with 50+ expert dentists across 17 branches. They prioritize patient-first care and use cutting-edge treatments. With multilingual staff and collaborations with top dental brands, they deliver exceptional results.',
      profileImage: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
      galleryImgs: [
        'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
        'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg',
        'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg',
      ],
      address: 'Shop No. 15, Connaught Place, New Delhi, Delhi 110001',
      phone: '(555) 123-4567',
      email: 'info@dentspa.com',
      website: 'www.dentspa.com',
      rating: 4.7,
      reviewCount: 2171,
      yearsExperience: 20,
      procedures: ['Dental', 'Dental Implants', 'All on 6', 'All on 4', 'Teeth Whitening', 'Veneers', 'Cosmetic Dentistry'],
      insuranceAccepted: ['Delta Dental', 'Cigna', 'Aetna', 'Blue Cross Blue Shield'],
      languages: ['English', 'Spanish'],
      education: ['DDS - Columbia University College of Dental Medicine'],
      certifications: ['American Dental Association', 'Academy of General Dentistry'],
      officeHours: {
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 4:00 PM',
        saturday: '9:00 AM - 2:00 PM',
        sunday: 'Closed',
      },
      emergencyAvailable: true,
      newPatientsAccepted: true,
      consultationFee: '$150',
      isVerified: true,
      map: { lat: 40.7128, lng: -74.0060 },
    },
    {
      id: 'dental-clinic://2',
      name: 'SmileCare Dental Center',
      handle: 'smilecare-dental-center',
      title: 'Advanced Orthodontics & Family Dentistry',
      specialty: 'Orthodontist',
      description: 'Modern dental facility offering comprehensive orthodontic treatments and family dental care. Our experienced team uses the latest technology to provide comfortable and effective treatments for patients of all ages.',
      profileImage: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg',
      galleryImgs: [
        'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg',
        'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
        'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg',
      ],
      address: '2nd Floor, Phoenix Mall, Kurla West, Mumbai, Maharashtra 400070',
      phone: '(555) 234-5678',
      email: 'contact@chenortho.com',
      website: 'www.chenorthodontics.com',
      rating: 4.9,
      reviewCount: 203,
      yearsExperience: 15,
      procedures: ['Orthodontics', 'Braces', 'Invisalign', 'Retainers'],
      insuranceAccepted: ['Delta Dental', 'MetLife', 'Guardian', 'United Healthcare'],
      languages: ['English', 'Mandarin', 'Cantonese'],
      education: ['DDS - NYU College of Dentistry', 'Orthodontics Residency - Columbia University'],
      certifications: ['American Board of Orthodontics', 'Invisalign Certified Provider'],
      officeHours: {
        monday: '9:00 AM - 7:00 PM',
        tuesday: '9:00 AM - 7:00 PM',
        wednesday: '9:00 AM - 7:00 PM',
        thursday: '9:00 AM - 7:00 PM',
        friday: '9:00 AM - 5:00 PM',
        saturday: '8:00 AM - 3:00 PM',
        sunday: 'Closed',
      },
      emergencyAvailable: false,
      newPatientsAccepted: true,
      consultationFee: '$200',
      isVerified: true,
      map: { lat: 40.7589, lng: -73.9851 },
    },
    {
      id: 'dental-clinic://3',
      name: 'KidsSmile Pediatric Dental',
      handle: 'kidssmile-pediatric-dental',
      title: 'Specialized Pediatric Dental Care',
      specialty: 'Pediatric Dentist',
      description: 'Specialized in providing gentle dental care for children and adolescents.',
      profileImage: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg',
      galleryImgs: [
        'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg',
        'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
        'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg',
      ],
      address: 'A-204, Cyber City, DLF Phase 2, Gurgaon, Haryana 122002',
      phone: '(555) 345-6789',
      email: 'info@kidsdentist.com',
      rating: 4.7,
      reviewCount: 89,
      yearsExperience: 8,
      procedures: ['Pediatric Dentistry', 'Teeth Cleaning', 'Dental Fillings', 'Fluoride Treatment'],
      insuranceAccepted: ['Cigna', 'Aetna', 'Humana', 'Blue Cross Blue Shield'],
      languages: ['English', 'Spanish', 'Portuguese'],
      education: ['DDS - Harvard School of Dental Medicine', 'Pediatric Dentistry Residency - Boston Children\'s Hospital'],
      certifications: ['American Board of Pediatric Dentistry', 'American Academy of Pediatric Dentistry'],
      officeHours: {
        monday: '8:00 AM - 5:00 PM',
        tuesday: '8:00 AM - 5:00 PM',
        wednesday: '8:00 AM - 5:00 PM',
        thursday: '8:00 AM - 5:00 PM',
        friday: '8:00 AM - 4:00 PM',
        saturday: '9:00 AM - 1:00 PM',
        sunday: 'Closed',
      },
      emergencyAvailable: true,
      newPatientsAccepted: true,
      consultationFee: '$120',
      isVerified: true,
      map: { lat: 40.7282, lng: -73.9942 },
    },
    {
      id: 'dental-clinic://4',
      name: 'Advanced Oral Surgery Center',
      handle: 'advanced-oral-surgery-center',
      title: 'Expert Oral & Maxillofacial Surgery',
      specialty: 'Oral Surgeon',
      description: 'Experienced oral and maxillofacial surgeon specializing in complex extractions and implants.',
      profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
      galleryImgs: [
        'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
        'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg',
        'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg',
      ],
      address: '15/2, Brigade Road, Near MG Road Metro, Bangalore, Karnataka 560025',
      phone: '(555) 456-7890',
      email: 'office@wilsonoralsurgery.com',
      website: 'www.wilsonoralsurgery.com',
      rating: 4.6,
      reviewCount: 124,
      yearsExperience: 18,
      procedures: ['Oral Surgery', 'Tooth Extraction', 'Dental Implants', 'Wisdom Teeth Removal'],
      insuranceAccepted: ['Delta Dental', 'MetLife', 'Principal', 'Anthem'],
      languages: ['English'],
      education: ['DDS - University of Pennsylvania', 'Oral Surgery Residency - Mount Sinai Hospital'],
      certifications: ['American Board of Oral and Maxillofacial Surgery'],
      officeHours: {
        monday: '7:00 AM - 4:00 PM',
        tuesday: '7:00 AM - 4:00 PM',
        wednesday: '7:00 AM - 4:00 PM',
        thursday: '7:00 AM - 4:00 PM',
        friday: '7:00 AM - 2:00 PM',
        saturday: 'By Appointment',
        sunday: 'Closed',
      },
      emergencyAvailable: true,
      newPatientsAccepted: false,
      consultationFee: '$250',
      isVerified: true,
      map: { lat: 40.7505, lng: -73.9934 },
    },
    {
      id: 'dental-clinic://5',
      name: 'Elite Cosmetic Dental Studio',
      handle: 'elite-cosmetic-dental-studio',
      title: 'Premium Cosmetic & Restorative Dentistry',
      specialty: 'Cosmetic Dentist',
      description: 'Specializing in smile makeovers, veneers, and advanced restorative dentistry.',
      profileImage: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg',
      galleryImgs: [
        'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg',
        'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
        'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg',
      ],
      address: 'Plot 47, Banjara Hills, Road No. 12, Hyderabad, Telangana 500034',
      phone: '(555) 567-8901',
      email: 'smile@thompsoncosmetic.com',
      website: 'www.thompsoncosmetic.com',
      rating: 4.9,
      reviewCount: 267,
      yearsExperience: 14,
      procedures: ['Cosmetic Dentistry', 'Veneers', 'Teeth Whitening', 'Dental Crowns', 'Smile Makeover'],
      insuranceAccepted: ['Delta Dental', 'Cigna', 'Guardian', 'United Healthcare'],
      languages: ['English', 'French'],
      education: ['DDS - UCLA School of Dentistry', 'Prosthodontics Residency - University of Washington'],
      certifications: ['American Board of Prosthodontics', 'American Academy of Cosmetic Dentistry'],
      officeHours: {
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 5:00 PM',
        saturday: '9:00 AM - 3:00 PM',
        sunday: 'Closed',
      },
      emergencyAvailable: false,
      newPatientsAccepted: true,
      consultationFee: '$175',
      isVerified: true,
      map: { lat: 40.7260, lng: -73.9897 },
    },
  ]
}

// Filter options for dental listings
export async function getDentalFilterOptions() {
  return [
    {
      name: 'procedures',
      label: 'Procedures',
      tabUIType: 'checkbox' as const,
      options: dentalProcedures.slice(0, 10).map((procedure) => ({
        name: procedure,
        value: procedure.toLowerCase().replace(/\s+/g, '_'),
        defaultChecked: ['General Dentistry', 'Teeth Cleaning'].includes(procedure),
      })),
    },
    {
      name: 'location',
      label: 'Location',
      tabUIType: 'checkbox' as const,
      options: [
        { name: 'New Delhi, India', value: 'new_delhi', defaultChecked: false },
        { name: 'Mumbai, India', value: 'mumbai', defaultChecked: false },
        { name: 'Bangalore, India', value: 'bangalore', defaultChecked: false },
        { name: 'Chennai, India', value: 'chennai', defaultChecked: false },
        { name: 'Hyderabad, India', value: 'hyderabad', defaultChecked: false },
        { name: 'Pune, India', value: 'pune', defaultChecked: false },
        { name: 'Kolkata, India', value: 'kolkata', defaultChecked: false },
        { name: 'Ahmedabad, India', value: 'ahmedabad', defaultChecked: false },
      ],
    },
  ]
}