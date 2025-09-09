# Dental Tourism Platform - API Documentation

## 🏥 Complete Backend API for Dental Tourism Platform

This comprehensive API provides all the functionality needed for a dental tourism platform, connecting patients with dentists across different locations, managing bookings, travel itineraries, medical records, and more.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Dentist Services](#dentist-services)
5. [Booking System](#booking-system)
6. [Medical Records & Reports](#medical-records--reports)
7. [Travel & Itinerary](#travel--itinerary)
8. [Cost Estimation](#cost-estimation)
9. [Loyalty Program](#loyalty-program)
10. [AI Assistant](#ai-assistant)
11. [Notifications](#notifications)
12. [Error Handling](#error-handling)
13. [File Upload](#file-upload)
14. [Response Formats](#response-formats)

---

## 🚀 Getting Started

### Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:5001/api
```

### Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔐 Authentication

### Register User
**POST** `/auth/register`

Register a new patient account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "isEmailVerified": false
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### Login
**POST** `/auth/login`

Authenticate user and get access tokens.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "patient"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### Refresh Token
**POST** `/auth/refresh`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

### Forgot Password
**POST** `/auth/forgot-password`

Request password reset email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password`

Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

### Verify Email
**POST** `/auth/verify-email`

Verify email address using verification token.

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

### Logout
**POST** `/auth/logout`
*Requires Authentication*

Logout user and invalidate tokens.

### Change Password
**POST** `/auth/change-password`
*Requires Authentication*

Change user password.

**Request Body:**
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewPassword123!"
}
```

---

## 👤 User Management

### Get User Profile
**GET** `/user/profile`
*Requires Authentication*

Get current user's complete profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-05-15",
    "gender": "male",
    "address": { ... },
    "healthProfile": {
      "allergies": ["Penicillin"],
      "medications": ["Aspirin"],
      "medicalConditions": ["Hypertension"],
      "emergencyContact": { ... }
    },
    "preferences": {
      "language": "en",
      "currency": "USD",
      "notifications": { ... }
    }
  }
}
```

### Update Profile
**PUT** `/user/profile`
*Requires Authentication*

Update user profile information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "country": "USA",
    "zipCode": "90210"
  }
}
```

### Upload Profile Picture
**POST** `/user/profile-picture`
*Requires Authentication*

Upload user profile picture.

**Request:** Multipart form data with `profilePicture` field

### Get Health Profile
**GET** `/user/health-profile`
*Requires Authentication*

Get user's health profile and medical history.

### Update Health Profile
**PUT** `/user/health-profile`
*Requires Authentication*

Update health profile information.

**Request Body:**
```json
{
  "allergies": ["Penicillin", "Latex"],
  "medications": ["Aspirin 81mg daily"],
  "medicalConditions": ["Hypertension", "Diabetes Type 2"],
  "surgicalHistory": ["Appendectomy 2015"],
  "familyHistory": ["Heart disease", "Diabetes"],
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1234567891"
  },
  "insurance": {
    "provider": "Blue Cross",
    "policyNumber": "BC123456789",
    "groupNumber": "GRP001"
  }
}
```

### Get User Documents
**GET** `/user/documents`
*Requires Authentication*

Get list of user's uploaded documents.

### Delete Account
**DELETE** `/user/account`
*Requires Authentication*

Permanently delete user account.

### Get Preferences
**GET** `/user/preferences`
*Requires Authentication*

Get user preferences and settings.

### Update Preferences
**PUT** `/user/preferences`
*Requires Authentication*

Update user preferences.

**Request Body:**
```json
{
  "language": "en",
  "currency": "USD",
  "timezone": "America/New_York",
  "notifications": {
    "email": true,
    "sms": false,
    "push": true,
    "marketing": false
  },
  "privacy": {
    "profileVisibility": "private",
    "shareHealthData": false
  }
}
```

---

## 🦷 Dentist Services

### Search Dentists
**GET** `/dentists`

Search and filter dentists.

**Query Parameters:**
- `search` - Search by name or specialization
- `city` - Filter by city
- `state` - Filter by state
- `country` - Filter by country
- `specialization` - Filter by specialization
- `minRating` - Minimum rating (1-5)
- `maxPrice` - Maximum consultation fee
- `availability` - Include availability info (true/false)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)
- `sort` - Sort by: rating, price-low, price-high, experience, name

**Example:**
```
GET /dentists?city=Mumbai&specialization=orthodontics&minRating=4&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dentists": [
      {
        "id": "dentist_id",
        "firstName": "Dr. Sarah",
        "lastName": "Johnson",
        "specializations": ["Orthodontics", "Cosmetic Dentistry"],
        "rating": 4.8,
        "reviewCount": 156,
        "experience": 12,
        "consultationFee": 150,
        "clinics": [
          {
            "name": "Smile Clinic",
            "address": {
              "city": "Mumbai",
              "state": "Maharashtra",
              "country": "India"
            }
          }
        ],
        "availableSlots": ["2024-01-20T10:00:00Z", "2024-01-20T14:00:00Z"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

### Get Featured Dentists
**GET** `/dentists/featured`

Get featured dentists.

**Query Parameters:**
- `limit` - Number of results (default: 6)

### Find Nearby Dentists
**GET** `/dentists/nearby`

Find dentists near a location.

**Query Parameters:**
- `lat` - Latitude (required)
- `lng` - Longitude (required)
- `radius` - Search radius in km (default: 10)
- `limit` - Number of results (default: 10)

### Get Dentist Details
**GET** `/dentists/:id`

Get detailed information about a specific dentist.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "dentist_id",
    "firstName": "Dr. Sarah",
    "lastName": "Johnson",
    "specializations": ["Orthodontics", "Cosmetic Dentistry"],
    "experience": 12,
    "rating": 4.8,
    "reviewCount": 156,
    "consultationFee": 150,
    "languages": ["English", "Hindi", "Marathi"],
    "education": [
      {
        "degree": "DDS",
        "institution": "Harvard School of Dental Medicine",
        "year": 2012
      }
    ],
    "certifications": ["American Board of Orthodontics"],
    "clinics": [ ... ],
    "treatments": [
      {
        "type": "orthodontics",
        "name": "Invisalign Treatment",
        "price": 2500,
        "duration": "12-18 months"
      }
    ],
    "workingHours": {
      "monday": { "start": "09:00", "end": "17:00" },
      "tuesday": { "start": "09:00", "end": "17:00" }
    },
    "recentReviews": [ ... ],
    "availableSlots": [ ... ],
    "stats": {
      "totalBookings": 1250,
      "completedTreatments": 1180
    }
  }
}
```

### Get Dentist Reviews
**GET** `/dentists/:id/reviews`

Get reviews for a specific dentist.

**Query Parameters:**
- `page` - Page number
- `limit` - Results per page
- `rating` - Filter by rating

### Add Dentist Review
**POST** `/dentists/:id/reviews`
*Requires Authentication*

Add a review for a dentist.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service and very professional!",
  "bookingId": "booking_id",
  "aspects": {
    "communication": 5,
    "professionalism": 5,
    "cleanliness": 5,
    "value": 4,
    "comfort": 5
  }
}
```

### Check Dentist Availability
**GET** `/dentists/:id/availability`

Check dentist's availability.

**Query Parameters:**
- `date` - Start date (YYYY-MM-DD)
- `days` - Number of days to check (default: 7)

### Get Dentist Treatments
**GET** `/dentists/:id/treatments`

Get dentist's treatment offerings and prices.

### Start Chat with Dentist
**POST** `/dentists/:id/chat`
*Requires Authentication*

Start a chat/consultation with a dentist.

**Request Body:**
```json
{
  "message": "I would like to inquire about orthodontic treatment options.",
  "consultationType": "pre-booking"
}
```

### Advanced Dentist Search
**GET** `/dentists/search/advanced`

Advanced search with multiple filters.

**Query Parameters:**
- `treatments` - Comma-separated treatment types
- `languages` - Comma-separated languages
- `insurance` - Comma-separated insurance providers
- `priceRange` - Price range (e.g., "100-500")
- `experience` - Minimum years of experience
- `gender` - Dentist gender
- `certifications` - Comma-separated certifications

---

## 📅 Booking System

### Create Booking
**POST** `/bookings`
*Requires Authentication*

Create a new appointment booking.

**Request Body:**
```json
{
  "dentistId": "dentist_id",
  "treatmentType": "orthodontics",
  "appointmentDate": "2024-02-15T10:00:00Z",
  "duration": 60,
  "notes": "First consultation for braces",
  "urgency": "routine",
  "preferredClinic": "clinic_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "id": "booking_id",
      "bookingNumber": "BK-2024-001234",
      "dentistId": "dentist_id",
      "userId": "user_id",
      "treatmentType": "orthodontics",
      "appointmentDate": "2024-02-15T10:00:00Z",
      "status": "pending",
      "totalAmount": 150,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Get User Bookings
**GET** `/bookings`
*Requires Authentication*

Get user's bookings with filtering options.

**Query Parameters:**
- `status` - Filter by status (pending, confirmed, completed, cancelled)
- `page` - Page number
- `limit` - Results per page
- `sort` - Sort by date-asc, date-desc, created-asc, created-desc

### Get Booking Details
**GET** `/bookings/:id`
*Requires Authentication*

Get detailed information about a specific booking.

**Response:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking_id",
      "bookingNumber": "BK-2024-001234",
      "status": "confirmed",
      "treatmentType": "orthodontics",
      "appointmentDate": "2024-02-15T10:00:00Z",
      "duration": 60,
      "totalAmount": 150,
      "dentist": {
        "name": "Dr. Sarah Johnson",
        "specializations": ["Orthodontics"],
        "clinic": {
          "name": "Smile Clinic",
          "address": "123 Dental St, Mumbai"
        }
      },
      "payment": {
        "status": "paid",
        "method": "card",
        "transactionId": "txn_123456"
      },
      "timeline": [
        {
          "status": "pending",
          "timestamp": "2024-01-15T10:30:00Z",
          "note": "Booking created"
        },
        {
          "status": "confirmed",
          "timestamp": "2024-01-15T11:00:00Z",
          "note": "Confirmed by dentist"
        }
      ]
    }
  }
}
```

### Update Booking
**PUT** `/bookings/:id`
*Requires Authentication*

Update booking details (reschedule, change notes, etc.).

**Request Body:**
```json
{
  "appointmentDate": "2024-02-16T14:00:00Z",
  "notes": "Updated: Need to discuss payment plans",
  "reason": "Schedule conflict"
}
```

### Cancel Booking
**POST** `/bookings/:id/cancel`
*Requires Authentication*

Cancel a booking.

**Request Body:**
```json
{
  "reason": "Personal emergency",
  "requestRefund": true
}
```

### Confirm Booking
**POST** `/bookings/:id/confirm`
*Requires Authentication*

Confirm a pending booking (usually done by dentist).

### Complete Booking
**POST** `/bookings/:id/complete`
*Requires Authentication*

Mark booking as completed.

**Request Body:**
```json
{
  "treatmentNotes": "Orthodontic consultation completed. Treatment plan discussed.",
  "nextAppointment": "2024-03-01T10:00:00Z",
  "prescriptions": ["Fluoride rinse", "Soft diet for 24 hours"]
}
```

### Get Booking History
**GET** `/bookings/history`
*Requires Authentication*

Get user's complete booking history.

### Reschedule Booking
**POST** `/bookings/:id/reschedule`
*Requires Authentication*

Request to reschedule a booking.

**Request Body:**
```json
{
  "newDate": "2024-02-20T15:00:00Z",
  "reason": "Work commitment conflict"
}
```

---

## 📋 Medical Records & Reports

### Upload Medical Report
**POST** `/reports/upload`
*Requires Authentication*

Upload medical reports and documents.

**Request:** Multipart form data
- `files` - Medical report files (PDF, images)
- `category` - Report category
- `description` - Report description
- `tags` - Comma-separated tags

**Response:**
```json
{
  "success": true,
  "message": "Reports uploaded successfully",
  "data": {
    "reports": [
      {
        "id": "report_id",
        "reportNumber": "RPT-2024-001234",
        "filename": "xray_report.pdf",
        "category": "diagnostic",
        "uploadDate": "2024-01-15T10:30:00Z",
        "fileSize": 2048576,
        "status": "uploaded"
      }
    ]
  }
}
```

### Get User Reports
**GET** `/reports`
*Requires Authentication*

Get user's medical reports.

**Query Parameters:**
- `category` - Filter by category
- `tags` - Filter by tags
- `dateFrom` - Filter from date
- `dateTo` - Filter to date
- `page` - Page number
- `limit` - Results per page

### Get Report Details
**GET** `/reports/:id`
*Requires Authentication*

Get detailed information about a specific report.

### Update Report
**PUT** `/reports/:id`
*Requires Authentication*

Update report information.

**Request Body:**
```json
{
  "category": "diagnostic",
  "description": "Updated description",
  "tags": ["x-ray", "dental", "routine"],
  "notes": "Additional notes about the report"
}
```

### Delete Report
**DELETE** `/reports/:id`
*Requires Authentication*

Delete a medical report.

### Share Report
**POST** `/reports/:id/share`
*Requires Authentication*

Share report with a dentist.

**Request Body:**
```json
{
  "dentistId": "dentist_id",
  "message": "Please review my recent X-ray results",
  "expiresAt": "2024-02-15T00:00:00Z"
}
```

### Get Shared Reports
**GET** `/reports/shared`
*Requires Authentication*

Get reports shared with user.

### Analyze Report (AI)
**POST** `/reports/:id/analyze`
*Requires Authentication*

Get AI analysis of medical report.

### Download Report
**GET** `/reports/:id/download`
*Requires Authentication*

Download report file.

### Get Report Categories
**GET** `/reports/categories`
*Requires Authentication*

Get available report categories.

---

## ✈️ Travel & Itinerary

### Create Itinerary
**POST** `/itinerary`
*Requires Authentication*

Create a new travel itinerary.

**Request Body:**
```json
{
  "title": "Dental Treatment in Mumbai",
  "destination": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  },
  "startDate": "2024-03-01",
  "endDate": "2024-03-07",
  "purpose": "dental-treatment",
  "bookingId": "booking_id",
  "budget": {
    "total": 2000,
    "currency": "USD"
  }
}
```

### Get User Itineraries
**GET** `/itinerary`
*Requires Authentication*

Get user's travel itineraries.

**Query Parameters:**
- `status` - Filter by status
- `upcoming` - Show only upcoming trips (true/false)
- `page` - Page number
- `limit` - Results per page

### Get Itinerary Details
**GET** `/itinerary/:id`
*Requires Authentication*

Get detailed itinerary information.

**Response:**
```json
{
  "success": true,
  "data": {
    "itinerary": {
      "id": "itinerary_id",
      "title": "Dental Treatment in Mumbai",
      "destination": {
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India"
      },
      "startDate": "2024-03-01",
      "endDate": "2024-03-07",
      "status": "active",
      "activities": [
        {
          "id": "activity_id",
          "date": "2024-03-01",
          "time": "10:00",
          "type": "appointment",
          "title": "Dental Consultation",
          "location": "Smile Clinic",
          "notes": "Initial consultation"
        }
      ],
      "accommodation": {
        "name": "Hotel Mumbai",
        "checkIn": "2024-03-01",
        "checkOut": "2024-03-07",
        "address": "123 Hotel St, Mumbai"
      },
      "transportation": [
        {
          "type": "flight",
          "from": "New York",
          "to": "Mumbai",
          "date": "2024-03-01",
          "details": "Flight AI 101"
        }
      ],
      "budget": {
        "total": 2000,
        "spent": 1200,
        "remaining": 800,
        "breakdown": {
          "accommodation": 400,
          "transportation": 600,
          "medical": 200
        }
      }
    }
  }
}
```

### Update Itinerary
**PUT** `/itinerary/:id`
*Requires Authentication*

Update itinerary details.

### Add Activity
**POST** `/itinerary/:id/activities`
*Requires Authentication*

Add activity to itinerary.

**Request Body:**
```json
{
  "date": "2024-03-02",
  "time": "14:00",
  "type": "sightseeing",
  "title": "Visit Gateway of India",
  "location": "Gateway of India, Mumbai",
  "duration": 120,
  "cost": 50,
  "notes": "Tourist attraction visit"
}
```

### Update Activity
**PUT** `/itinerary/:id/activities/:activityId`
*Requires Authentication*

Update specific activity.

### Delete Activity
**DELETE** `/itinerary/:id/activities/:activityId`
*Requires Authentication*

Delete activity from itinerary.

### Add Accommodation
**POST** `/itinerary/:id/accommodation`
*Requires Authentication*

Add accommodation details.

**Request Body:**
```json
{
  "name": "Hotel Mumbai",
  "type": "hotel",
  "checkIn": "2024-03-01",
  "checkOut": "2024-03-07",
  "address": "123 Hotel St, Mumbai",
  "cost": 400,
  "bookingReference": "HTL123456",
  "amenities": ["WiFi", "Breakfast", "Airport Shuttle"]
}
```

### Add Transportation
**POST** `/itinerary/:id/transportation`
*Requires Authentication*

Add transportation details.

### Update Budget
**PUT** `/itinerary/:id/budget`
*Requires Authentication*

Update budget information.

### Get Travel Packages
**GET** `/itinerary/packages`

Get available travel packages.

### Share Itinerary
**POST** `/itinerary/:id/share`
*Requires Authentication*

Share itinerary with others.

### Export Itinerary
**GET** `/itinerary/:id/export`
*Requires Authentication*

Export itinerary as PDF.

---

## 💰 Cost Estimation

### Create Cost Estimate
**POST** `/cost-estimator`
*Requires Authentication*

Create a new cost estimate for dental treatment.

**Request Body:**
```json
{
  "treatments": [
    {
      "type": "dental-implant",
      "quantity": 2,
      "complexity": "moderate"
    },
    {
      "type": "crown-bridge",
      "quantity": 1,
      "complexity": "simple"
    }
  ],
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  },
  "preferences": {
    "accommodationType": "hotel",
    "transportationType": "flight",
    "duration": 7
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "estimate": {
      "id": "estimate_id",
      "estimateNumber": "EST-2024-001234",
      "treatments": [
        {
          "type": "dental-implant",
          "name": "Dental Implant",
          "quantity": 2,
          "unitPrice": 800,
          "totalPrice": 1600
        }
      ],
      "costs": {
        "medical": 2100,
        "accommodation": 350,
        "transportation": 600,
        "meals": 200,
        "local": 150,
        "total": 3400
      },
      "savings": {
        "comparedToHome": 2600,
        "percentage": 43
      },
      "currency": "USD",
      "validUntil": "2024-02-15T00:00:00Z"
    }
  }
}
```

### Get User Estimates
**GET** `/cost-estimator`
*Requires Authentication*

Get user's cost estimates.

### Get Estimate Details
**GET** `/cost-estimator/:id`
*Requires Authentication*

Get detailed cost estimate.

### Update Estimate
**PUT** `/cost-estimator/:id`
*Requires Authentication*

Update cost estimate parameters.

### Compare Locations
**POST** `/cost-estimator/compare`
*Requires Authentication*

Compare costs across different locations.

**Request Body:**
```json
{
  "treatments": [
    {
      "type": "dental-implant",
      "quantity": 2
    }
  ],
  "locations": [
    {
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India"
    },
    {
      "city": "Bangkok",
      "country": "Thailand"
    }
  ]
}
```

### Save Estimate
**POST** `/cost-estimator/:id/save`
*Requires Authentication*

Save estimate for future reference.

### Share Estimate
**POST** `/cost-estimator/:id/share`
*Requires Authentication*

Share estimate with others.

---

## 🎁 Loyalty Program

### Get Loyalty Status
**GET** `/loyalty/status`
*Requires Authentication*

Get user's loyalty program status.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe"
    },
    "points": {
      "current": 2500,
      "lifetime": 5000,
      "pending": 150
    },
    "tier": {
      "current": "Gold",
      "nextTier": "Platinum",
      "pointsToNext": 500,
      "benefits": [
        "10% discount on treatments",
        "Priority booking",
        "Free consultation"
      ]
    },
    "referrals": {
      "code": "JOHN2024",
      "totalReferred": 5,
      "successfulReferrals": 3,
      "earnings": 300
    }
  }
}
```

### Get Points History
**GET** `/loyalty/points/history`
*Requires Authentication*

Get points earning and redemption history.

### Redeem Points
**POST** `/loyalty/points/redeem`
*Requires Authentication*

Redeem loyalty points.

**Request Body:**
```json
{
  "points": 500,
  "rewardType": "discount",
  "bookingId": "booking_id"
}
```

### Get Available Rewards
**GET** `/loyalty/rewards`
*Requires Authentication*

Get available rewards for redemption.

### Refer Friend
**POST** `/loyalty/refer`
*Requires Authentication*

Send referral invitation.

**Request Body:**
```json
{
  "email": "friend@example.com",
  "name": "Friend Name",
  "message": "Check out this great dental tourism platform!"
}
```

### Get Referral Status
**GET** `/loyalty/referrals`
*Requires Authentication*

Get referral program status and history.

### Check Tier Benefits
**GET** `/loyalty/tiers`
*Requires Authentication*

Get information about loyalty tiers and benefits.

---

## 🤖 AI Assistant

### Start AI Chat
**POST** `/ai/chat`
*Requires Authentication*

Start or continue chat with AI assistant.

**Request Body:**
```json
{
  "message": "I need help finding a dentist for root canal treatment",
  "context": {
    "location": "Mumbai",
    "treatmentType": "endodontics"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I can help you find qualified endodontists in Mumbai for root canal treatment. Based on your location, I found several highly-rated specialists. Would you like me to show you the top-rated dentists or help you with specific requirements?",
    "suggestions": [
      "Show top-rated endodontists",
      "Compare treatment costs",
      "Check availability this week"
    ],
    "sessionId": "ai_session_123"
  }
}
```

### Analyze Report
**POST** `/ai/analyze-report`
*Requires Authentication*

Get AI analysis of medical report.

**Request Body:**
```json
{
  "reportId": "report_id",
  "questions": [
    "What does this X-ray show?",
    "Are there any concerning findings?"
  ]
}
```

### Get Treatment Recommendations
**POST** `/ai/recommend-treatment`
*Requires Authentication*

Get AI treatment recommendations.

**Request Body:**
```json
{
  "symptoms": ["tooth pain", "sensitivity to cold"],
  "location": "upper right molar",
  "duration": "2 weeks",
  "severity": "moderate"
}
```

### Schedule Assistant
**POST** `/ai/schedule-help`
*Requires Authentication*

Get help with appointment scheduling.

**Request Body:**
```json
{
  "request": "I need to reschedule my appointment next week",
  "bookingId": "booking_id",
  "preferences": {
    "timePreference": "morning",
    "dateRange": "next 2 weeks"
  }
}
```

### Get AI Chat History
**GET** `/ai/chat/history`
*Requires Authentication*

Get AI chat conversation history.

---

## 🔔 Notifications

### Get Notifications
**GET** `/notifications`
*Requires Authentication*

Get user notifications.

**Query Parameters:**
- `type` - Filter by type
- `read` - Filter by read status (true/false)
- `page` - Page number
- `limit` - Results per page

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notification_id",
        "type": "booking_confirmed",
        "title": "Booking Confirmed",
        "message": "Your appointment with Dr. Sarah Johnson has been confirmed for March 15, 2024 at 10:00 AM.",
        "isRead": false,
        "createdAt": "2024-01-15T10:30:00Z",
        "data": {
          "bookingId": "booking_id",
          "dentistName": "Dr. Sarah Johnson"
        }
      }
    ],
    "unreadCount": 5
  }
}
```

### Mark as Read
**PUT** `/notifications/:id/read`
*Requires Authentication*

Mark notification as read.

### Mark All as Read
**PUT** `/notifications/read-all`
*Requires Authentication*

Mark all notifications as read.

### Delete Notification
**DELETE** `/notifications/:id`
*Requires Authentication*

Delete a notification.

### Get Notification Settings
**GET** `/notifications/settings`
*Requires Authentication*

Get notification preferences.

### Update Notification Settings
**PUT** `/notifications/settings`
*Requires Authentication*

Update notification preferences.

**Request Body:**
```json
{
  "email": {
    "bookingUpdates": true,
    "reminders": true,
    "marketing": false
  },
  "sms": {
    "bookingUpdates": true,
    "reminders": false,
    "marketing": false
  },
  "push": {
    "bookingUpdates": true,
    "reminders": true,
    "marketing": false
  }
}
```

---

## 🔧 Continuity Features

### Get Session Info
**GET** `/continuity/session`
*Requires Authentication*

Get current session information.

### Sync Data
**POST** `/continuity/sync`
*Requires Authentication*

Sync user data across devices.

### Get Recent Activity
**GET** `/continuity/activity`
*Requires Authentication*

Get user's recent activity.

### Save Draft
**POST** `/continuity/drafts`
*Requires Authentication*

Save form draft.

### Get Drafts
**GET** `/continuity/drafts`
*Requires Authentication*

Get saved drafts.

---

## ❌ Error Handling

### Test Error Scenarios
**GET** `/error/test/:type`

Test different error scenarios (development only).

**Types:**
- `validation` - Validation error
- `auth` - Authentication error
- `permission` - Permission error
- `notfound` - Not found error
- `server` - Server error
- `rate-limit` - Rate limit error

### Report Error
**POST** `/error/report`
*Requires Authentication*

Report application error.

### Get Error Logs
**GET** `/error/logs`
*Requires Authentication* (Admin only)

Get error logs.

### Session Errors
**GET** `/error/session-errors`

Get session-related error information.

### Upload Errors
**GET** `/error/upload-guide`

Get file upload error guidance.

### API Status
**GET** `/error/api-status`

Get API status and health information.

---

## 📁 File Upload

### Upload Guidelines

**Supported File Types:**
- **Documents:** PDF, DOC, DOCX, TXT
- **Images:** JPEG, JPG, PNG, GIF, WEBP
- **Medical:** DICOM files

**Size Limits:**
- **Profile Pictures:** 5MB
- **Documents:** 10MB
- **Medical Reports:** 50MB

**Upload Endpoints:**
- Profile pictures: `POST /user/profile-picture`
- Medical reports: `POST /reports/upload`
- General documents: `POST /documents/upload`

### Error Codes
- `FILE_REQUIRED` - No file uploaded
- `FILE_TOO_LARGE` - File exceeds size limit
- `INVALID_FILE_TYPE` - Unsupported file type
- `UPLOAD_ERROR` - General upload error
- `TOO_MANY_FILES` - Too many files in request
- `UNEXPECTED_FILE` - Unexpected file field

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 🔒 Security Features

### Rate Limiting
- **General API:** 100 requests per 15 minutes
- **Authentication:** 5 attempts per 15 minutes
- **File Upload:** 10 uploads per hour

### Authentication
- JWT tokens with 15-minute expiry
- Refresh tokens with 7-day expiry
- Secure password hashing with bcrypt

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Helmet security headers

---

## 📈 API Statistics

- **Total Endpoints:** 89
- **Authentication Required:** 75 endpoints
- **Public Endpoints:** 14 endpoints
- **File Upload Endpoints:** 3 endpoints
- **Real-time Features:** Chat, notifications
- **Search Endpoints:** 5 endpoints

---

## 🚀 Getting Started

1. **Base URL:** `http://localhost:5001/api`
2. **Register:** `POST /auth/register`
3. **Login:** `POST /auth/login`
4. **Get Profile:** `GET /user/profile`
5. **Search Dentists:** `GET /dentists`
6. **Create Booking:** `POST /bookings`

---

## 📞 Support

For API support and questions:
- **Documentation:** This comprehensive guide
- **Error Handling:** Detailed error messages with codes
- **Response Format:** Consistent JSON responses
- **Status Codes:** Standard HTTP status codes

---

*This API documentation covers the complete dental tourism platform backend with 89 endpoints across 12 major feature areas. All endpoints include proper authentication, validation, error handling, and comprehensive response formats.*