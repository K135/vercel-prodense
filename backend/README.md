# Prodance Backend API

## Overview

This is a standalone Express.js backend API for the Prodance application, providing authentication and user management functionality using MongoDB, JWT tokens, and OTP-based verification.

## Features

- 📱 **Phone & Email Authentication**: Support for both phone and email login
- 🔐 **OTP Verification**: Secure 6-digit OTP system
- 🎫 **JWT Tokens**: Stateless authentication with refresh tokens
- 👤 **User Profiles**: Complete user management with profile data
- 🛡️ **Protected Routes**: Middleware-based route protection
- ✅ **Input Validation**: Comprehensive request validation
- 🏥 **Health Checks**: API status monitoring
- 🔒 **Security**: Rate limiting, CORS, helmet security headers

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── lib/
│   ├── jwt.js               # JWT token utilities
│   └── validation.js        # Input validation rules
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorMiddleware.js   # Error handling
├── models/
│   ├── User.js              # User data model
│   └── OTP.js               # OTP data model
├── routes/
│   ├── auth.js              # Authentication routes
│   └── user.js              # User management routes
├── test/
│   └── api-test.js          # API testing script
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
└── README.md                # This file
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/prodance
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/prodance

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# OTP Configuration
DEFAULT_OTP=123456

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI`
4. Whitelist your IP address

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5001/api`

### 5. Test the API

```bash
npm test
```

## API Endpoints

### Authentication

#### Request OTP
```http
POST /api/auth/request-otp
Content-Type: application/json

{
  "inputType": "phone", // or "email"
  "inputValue": "9999999999",
  "countryCode": "+1" // required for phone
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "otp": "123456",
  "identifier": "+19999999999",
  "type": "phone"
}
```

#### Complete Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "phone": "9999999999",
  "countryCode": "+1",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "country": "United States",
  "profession": "Developer"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### User Management

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe Updated",
  "profession": "Senior Developer"
}
```

### Health Check

```http
GET /api/health
```

## Testing

### Automated Testing
```bash
npm test
```

### Manual Testing with curl

1. **Health Check:**
```bash
curl http://localhost:5001/api/health
```

2. **Request OTP:**
```bash
curl -X POST http://localhost:5001/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"inputType":"phone","inputValue":"9999999999","countryCode":"+1"}'
```

3. **Verify OTP:**
```bash
curl -X POST http://localhost:5001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"otp":"123456","identifier":"+19999999999","type":"phone"}'
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  phone: String,
  email: String,
  countryCode: String,
  isPhoneVerified: Boolean,
  isEmailVerified: Boolean,
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: String, // 'male', 'female', 'other'
  country: String,
  profession: String,
  lastLogin: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Collection
```javascript
{
  _id: ObjectId,
  identifier: String, // phone or email
  otp: String,
  type: String, // 'phone' or 'email'
  purpose: String, // 'login', 'signup', 'verification'
  expiresAt: Date,
  isUsed: Boolean,
  attempts: Number,
  createdAt: Date
}
```

## Security Features

- **JWT Tokens**: Stateless authentication with configurable expiry
- **OTP Expiry**: OTPs expire after 10 minutes
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive validation for all inputs
- **CORS Protection**: Configured for frontend domain
- **Security Headers**: Helmet.js for security headers
- **Password Hashing**: Ready for future password-based auth

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error description",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (duplicate user)
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm test` - Run API tests

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5001` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiry time | `7d` |
| `DEFAULT_OTP` | Default OTP for testing | `123456` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Integration with Frontend

To integrate with your Next.js frontend:

1. **Update Frontend API Base URL:**
   ```typescript
   const API_BASE = 'http://localhost:5001/api'
   ```

2. **Create API Client:**
   ```typescript
   // lib/api-client.ts
   const apiClient = {
     async requestOTP(data: any) {
       const response = await fetch(`${API_BASE}/auth/request-otp`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
       })
       return response.json()
     },
     
     async verifyOTP(data: any) {
       const response = await fetch(`${API_BASE}/auth/verify-otp`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
       })
       return response.json()
     }
   }
   ```

## Production Deployment

### Environment Setup
1. Update `JWT_SECRET` with a strong secret
2. Set `NODE_ENV=production`
3. Configure production MongoDB URI
4. Set proper `FRONTEND_URL`

### Deployment Options
- **Heroku**: Add `Procfile` with `web: node server.js`
- **Railway**: Connect GitHub repo and deploy
- **DigitalOcean**: Use App Platform
- **AWS**: Use Elastic Beanstalk or EC2

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running
   - Verify MONGODB_URI in .env
   - Check network connectivity for Atlas

2. **JWT Token Invalid**
   - Verify JWT_SECRET is set
   - Check token expiry
   - Ensure proper Authorization header format

3. **OTP Not Working**
   - Default OTP is "123456" for testing
   - Check OTP hasn't expired (10 minutes)
   - Verify identifier format matches

4. **CORS Errors**
   - Check FRONTEND_URL matches your frontend
   - Verify CORS configuration in server.js

### Debug Mode

Set `NODE_ENV=development` to see detailed error logs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.