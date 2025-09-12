# Prodense Clinic Dashboard

A comprehensive clinic management dashboard for dental care providers, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🏥 Clinic Management
- **Profile & Credentials Management**: Edit clinic details, upload images, manage accreditation badges
- **Doctor Management**: Add/edit doctor profiles, set availability, toggle public visibility
- **Specialties & Procedures**: Manage clinic specialties and available procedures

### 📅 Appointment System
- **Calendar Views**: Day, week, and month views for appointment management
- **Booking Management**: Accept/reject bookings, reschedule requests
- **Patient Details**: View comprehensive patient information
- **Virtual Consultations**: Schedule and manage video consultations

### 💬 Patient Interaction
- **AI-Assisted Responses**: Smart reply suggestions for patient queries
- **Direct Chat**: Real-time messaging with booked patients
- **Treatment Plans**: Share and discuss treatment plans
- **Follow-up**: Post-treatment follow-up messaging

### 📊 Reports & Analytics
- **Financial Tracking**: Earnings, settlements, and payment analytics
- **Patient Records**: Secure document management
- **Treatment History**: Comprehensive treatment tracking
- **Performance Metrics**: Clinic performance insights

### 🌟 Additional Features
- **Reviews & Ratings**: Patient feedback management
- **Community Forum**: Professional discussion space
- **Notifications**: Real-time alerts and updates
- **Security**: HIPAA-compliant data handling

## Tech Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **State Management**: React Hooks & Context

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the Clinic directory:
```bash
cd Clinic
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Start the development server:
```bash
yarn dev
# or
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Build for Production

```bash
yarn build
yarn start
```

## Project Structure

```
Clinic/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── appointments/     # Appointment management
│   │   │   ├── earnings/         # Financial tracking
│   │   │   ├── profile/          # Clinic profile
│   │   │   └── ...              # Other dashboard pages
│   │   ├── login/               # Authentication
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   └── components/              # Reusable components
├── public/                      # Static assets
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Key Pages

### 🔐 Authentication
- **Login Page**: Secure clinic login with email/password
- **Registration**: New clinic registration flow

### 📊 Dashboard
- **Overview**: Key metrics, quick actions, recent activity
- **Profile Management**: Clinic details, doctor profiles, credentials
- **Appointments**: Calendar view, booking management
- **Earnings**: Financial analytics, payment tracking
- **Patient Interaction**: Messaging, communication tools

## Design System

### Colors
- **Primary**: #D35C2F (Prodense Red) with gradients
- **Secondary**: Teal/Emerald for accents
- **Status Colors**: Green (success), Yellow (warning), Red (error), Blue (info)

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Forms**: Clean inputs with focus states
- **Navigation**: Animated sidebar with active states

## Development

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Tailwind**: Utility-first CSS

### Best Practices
- Component-based architecture
- TypeScript interfaces for type safety
- Responsive design (mobile-first)
- Accessibility considerations
- Performance optimization

## Deployment

The application can be deployed on any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
# Add other environment variables as needed
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for Prodense clinic management platform.

## Support

For support and questions, please contact the development team or refer to the internal documentation.