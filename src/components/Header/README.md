# Medical Tourism Header

A beautiful, responsive header component designed specifically for medical tourism websites.

## Features

### Top Header Bar
- **Contact Information**: Email and phone number prominently displayed
- **Accreditation Badges**: ISO and HIPAA certification badges for trust
- **Gradient Background**: Professional blue-to-teal gradient

### Main Navigation
- **Logo & Branding**: Medical-themed logo with company name and tagline
- **Dropdown Menus**: 
  - Procedures (Cosmetic Surgery, Dental Care, Orthopedic, etc.)
  - Destinations (Thailand, India, Turkey, Mexico, etc.)
- **Quick Access Links**: Find a Clinic, Ask a Doctor, About Us, Visa Assistance, Pricing
- **Emergency Hotline**: Prominent emergency contact button
- **User Actions**: Login and Sign Up buttons

### Mobile Responsive
- **Hamburger Menu**: Clean mobile navigation
- **Touch-Friendly**: Large touch targets for mobile devices
- **Collapsible Sections**: Organized mobile menu structure

## Usage

### Basic Implementation

```tsx
import { ApplicationLayout } from '../application-layout'
import MedicalTourismHeader from '@/components/Header/MedicalTourismHeader'

export default function YourPage() {
  return (
    <ApplicationLayout header={<MedicalTourismHeader />}>
      {/* Your page content */}
    </ApplicationLayout>
  )
}
```

### Demo Page

Visit `/medical-tourism` to see the header in action with a complete medical tourism landing page.

## Customization

### Colors
The header uses a blue-to-teal color scheme that can be customized by modifying the Tailwind classes:

- Primary: `from-blue-600 to-teal-600`
- Hover states: `hover:from-blue-600 hover:to-teal-600`
- Emergency button: `bg-red-500 hover:bg-red-600`

### Menu Items

#### Procedures Menu
Edit the `procedures` array in the component to customize medical procedures:

```tsx
const procedures = [
  { name: 'Your Procedure', href: '/procedures/your-procedure' },
  // Add more procedures
]
```

#### Destinations Menu
Edit the `destinations` array to customize medical tourism destinations:

```tsx
const destinations = [
  { name: 'Your Destination', href: '/destinations/your-destination' },
  // Add more destinations
]
```

### Contact Information
Update the contact details in the top header bar:

```tsx
// Email
<span>your-email@domain.com</span>

// Phone
<span>+1 (555) YOUR-NUMBER</span>
```

### Logo & Branding
Customize the logo and company information:

```tsx
<div>
  <h1 className="text-2xl font-bold text-gray-900">Your Company</h1>
  <p className="text-sm text-gray-600">Your Tagline</p>
</div>
```

## Icons Used

The header uses Heroicons for consistent iconography:
- `HeartIcon` - Logo
- `PhoneIcon` - Contact
- `EnvelopeIcon` - Email
- `ShieldCheckIcon` - Certifications
- `UserIcon` - Login
- `Bars3Icon` / `XMarkIcon` - Mobile menu
- `ChevronDownIcon` - Dropdowns
- Various procedure-specific icons

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators
- **Touch Targets**: Minimum 44px touch targets for mobile

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on all screen sizes

## Dependencies

- React 18+
- Next.js 13+
- Tailwind CSS 3+
- Headless UI
- Heroicons
- clsx for conditional classes