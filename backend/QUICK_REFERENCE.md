# Dental Tourism Platform - Quick API Reference

## 🚀 Quick Start

### Base URL
```
Development: http://localhost:5001/api
```

### Authentication
```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"Password123!"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123!"}'

# Use token in subsequent requests
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5001/api/user/profile
```

## 📋 Essential Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| POST | `/auth/logout` | Logout user |

### 👤 User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/profile` | Get user profile |
| PUT | `/user/profile` | Update profile |
| GET | `/user/health-profile` | Get health profile |
| PUT | `/user/health-profile` | Update health profile |
| POST | `/user/profile-picture` | Upload profile picture |

### 🦷 Dentists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dentists` | Search dentists |
| GET | `/dentists/featured` | Get featured dentists |
| GET | `/dentists/nearby` | Find nearby dentists |
| GET | `/dentists/:id` | Get dentist details |
| GET | `/dentists/:id/reviews` | Get dentist reviews |
| POST | `/dentists/:id/reviews` | Add review |

### 📅 Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings` | Create booking |
| GET | `/bookings` | Get user bookings |
| GET | `/bookings/:id` | Get booking details |
| PUT | `/bookings/:id` | Update booking |
| POST | `/bookings/:id/cancel` | Cancel booking |

### 📋 Medical Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reports/upload` | Upload medical report |
| GET | `/reports` | Get user reports |
| GET | `/reports/:id` | Get report details |
| POST | `/reports/:id/share` | Share report |

### ✈️ Travel & Itinerary
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/itinerary` | Create itinerary |
| GET | `/itinerary` | Get user itineraries |
| GET | `/itinerary/:id` | Get itinerary details |
| POST | `/itinerary/:id/activities` | Add activity |

### 💰 Cost Estimation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cost-estimator` | Create cost estimate |
| GET | `/cost-estimator` | Get user estimates |
| POST | `/cost-estimator/compare` | Compare locations |

### 🎁 Loyalty Program
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/loyalty/status` | Get loyalty status |
| GET | `/loyalty/points/history` | Get points history |
| POST | `/loyalty/points/redeem` | Redeem points |
| POST | `/loyalty/refer` | Refer friend |

### 🤖 AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/chat` | Chat with AI |
| POST | `/ai/analyze-report` | Analyze report |
| POST | `/ai/recommend-treatment` | Get recommendations |

### 🔔 Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Get notifications |
| PUT | `/notifications/:id/read` | Mark as read |
| PUT | `/notifications/read-all` | Mark all as read |

## 🔍 Common Query Parameters

### Pagination
```
?page=1&limit=10
```

### Filtering
```
?status=active&category=diagnostic
?dateFrom=2024-01-01&dateTo=2024-12-31
```

### Sorting
```
?sort=rating (dentists)
?sort=date-desc (bookings)
?sort=created-asc (reports)
```

### Search
```
?search=orthodontics
?city=Mumbai&state=Maharashtra
?minRating=4&maxPrice=500
```

## 📝 Sample Requests

### Create Booking
```bash
curl -X POST http://localhost:5001/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dentistId": "dentist_id",
    "treatmentType": "orthodontics",
    "appointmentDate": "2024-02-15T10:00:00Z",
    "notes": "First consultation"
  }'
```

### Search Dentists
```bash
curl "http://localhost:5001/api/dentists?city=Mumbai&specialization=orthodontics&minRating=4&page=1&limit=10"
```

### Upload Medical Report
```bash
curl -X POST http://localhost:5001/api/reports/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@report.pdf" \
  -F "category=diagnostic" \
  -F "description=X-ray report"
```

### Create Cost Estimate
```bash
curl -X POST http://localhost:5001/api/cost-estimator \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "treatments": [
      {"type": "dental-implant", "quantity": 2}
    ],
    "location": {
      "city": "Mumbai",
      "country": "India"
    }
  }'
```

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ENTRY` | Resource already exists |
| `FILE_TOO_LARGE` | File exceeds size limit |
| `INVALID_FILE_TYPE` | Unsupported file type |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

## 📊 Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔒 Security Headers

```bash
# Required for authenticated requests
Authorization: Bearer <jwt_token>

# Optional headers
Content-Type: application/json
Accept: application/json
```

## 📱 File Upload

### Supported Types
- **Images:** JPEG, PNG, GIF, WEBP
- **Documents:** PDF, DOC, DOCX, TXT
- **Medical:** DICOM

### Size Limits
- **Profile Pictures:** 5MB
- **Documents:** 10MB
- **Medical Reports:** 50MB

### Upload Format
```bash
curl -X POST http://localhost:5001/api/reports/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@file1.pdf" \
  -F "files=@file2.jpg" \
  -F "category=diagnostic"
```

## 🌐 Environment Variables

```bash
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/prodance

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Frontend
FRONTEND_URL=http://localhost:3005
```

## 🧪 Testing Endpoints

```bash
# Health check
curl http://localhost:5001/api/health

# Test authentication
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/user/profile
```

## 📈 Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| General API | 100 req/15min |
| Authentication | 5 req/15min |
| File Upload | 10 req/hour |
| Password Reset | 3 req/hour |

## 🔧 Development Tips

1. **Always include Authorization header** for protected endpoints
2. **Use proper Content-Type** (application/json for JSON, multipart/form-data for files)
3. **Handle pagination** for list endpoints
4. **Check response status codes** for error handling
5. **Use query parameters** for filtering and searching
6. **Store JWT tokens securely** in your frontend application

## 📞 Quick Support

- **Full Documentation:** See `API_DOCUMENTATION.md`
- **Implementation Summary:** See `IMPLEMENTATION_SUMMARY.md`
- **Server Status:** `GET /api/health`
- **Error Testing:** `GET /api/error/test/:type`

---

*This quick reference covers the most commonly used endpoints and patterns. For complete documentation with detailed request/response examples, see the full API documentation.*