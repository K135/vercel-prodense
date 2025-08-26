import '@/styles/tailwind.css'
import { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import 'rc-slider/assets/index.css'
import ThemeProvider from './theme-provider'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s - Prodense',
    default: 'Prodense - Top Dental Booking ',
  },
  description: 'Top Dental Booking ',
  keywords: ['Prodense', 'Dental Booking online', 'Booking dental', 'Dental booking', 'Appointment online', 'Dentist'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <body 
        className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <SmoothScrollProvider />
          <div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
