export interface Destination {
  city: string
  state: string
  country: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface Treatment {
  _id?: string
  bookingId: string
  treatmentType: string
  dentistName: string
  clinicName: string
  appointmentDate: Date
  appointmentTime: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  notes?: string
}

export interface Accommodation {
  type?: 'hotel' | 'guesthouse' | 'apartment' | 'hostel' | 'other'
  name?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    pincode?: string
  }
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
  checkIn?: Date
  checkOut?: Date
  roomType?: string
  bookingReference?: string
  cost?: {
    amount?: number
    currency?: string
    perNight?: boolean
  }
  amenities?: string[]
  rating?: number
  notes?: string
}

export interface TransportationDetails {
  flightNumber?: string
  trainNumber?: string
  busOperator?: string
  departureLocation?: string
  arrivalLocation?: string
  departureTime?: Date
  arrivalTime?: Date
  bookingReference?: string
  cost?: {
    amount?: number
    currency?: string
  }
}

export interface Transportation {
  arrival?: {
    mode?: 'flight' | 'train' | 'bus' | 'car' | 'other'
    details?: TransportationDetails
  }
  departure?: {
    mode?: 'flight' | 'train' | 'bus' | 'car' | 'other'
    details?: TransportationDetails
  }
  local?: Array<{
    date?: Date
    mode?: 'taxi' | 'uber' | 'auto' | 'bus' | 'metro' | 'walking' | 'other'
    from?: string
    to?: string
    estimatedCost?: {
      amount?: number
      currency?: string
    }
    notes?: string
  }>
}

export interface Activity {
  _id?: string
  title: string
  description?: string
  date: Date
  time?: string
  duration?: number
  location?: {
    name?: string
    address?: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  cost?: {
    amount?: number
    currency?: string
  }
  category?: 'sightseeing' | 'cultural' | 'adventure' | 'relaxation' | 'shopping' | 'dining' | 'other'
  bookingRequired?: boolean
  bookingReference?: string
  notes?: string
}

export interface Budget {
  total?: {
    amount?: number
    currency?: string
  }
  breakdown?: {
    treatment?: { amount?: number; currency?: string }
    accommodation?: { amount?: number; currency?: string }
    transportation?: { amount?: number; currency?: string }
    food?: { amount?: number; currency?: string }
    activities?: { amount?: number; currency?: string }
    miscellaneous?: { amount?: number; currency?: string }
  }
  spent?: {
    amount?: number
    currency?: string
  }
}

export interface EmergencyContact {
  _id?: string
  name: string
  relationship: string
  phone: string
  email?: string
  isLocal?: boolean
}

export interface ItineraryDocument {
  _id?: string
  type: 'passport' | 'visa' | 'ticket' | 'hotel-booking' | 'insurance' | 'medical-records' | 'other'
  title: string
  documentId?: string
  notes?: string
}

export interface SharedWith {
  email: string
  name: string
  sharedAt: Date
  permissions: 'view' | 'edit'
}

export interface Reminder {
  _id?: string
  title: string
  description?: string
  reminderDate: Date
  type: 'appointment' | 'travel' | 'document' | 'payment' | 'other'
  isCompleted?: boolean
  completedAt?: Date
}

export interface Itinerary {
  _id: string
  userId: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  destination: Destination
  treatments: Treatment[]
  accommodation?: Accommodation
  transportation?: Transportation
  activities: Activity[]
  budget?: Budget
  emergencyContacts: EmergencyContact[]
  documents: ItineraryDocument[]
  status: 'draft' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  isShared: boolean
  sharedWith: SharedWith[]
  reminders: Reminder[]
  notes?: string
  createdAt: Date
  updatedAt: Date
  
  // Virtual fields
  duration?: number
  totalTreatments?: number
  completedTreatments?: number
  progressPercentage?: number
  budgetUtilization?: number
  isCurrent?: boolean
  isUpcoming?: boolean
}

export interface ItineraryResponse {
  success: boolean
  message: string
  data: Itinerary | Itinerary[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  time?: string
  type: 'trip-start' | 'trip-end' | 'treatment' | 'activity'
  status?: string
  category?: string
  itineraryId: string
  bookingId?: string
  destination?: Destination
}

export interface CalendarResponse {
  success: boolean
  message: string
  data: {
    events: CalendarEvent[]
    month: number
    year: number
  }
}