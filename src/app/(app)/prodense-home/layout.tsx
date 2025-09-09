import { Metadata } from 'next'
import { ApplicationLayout } from '../application-layout'

export const metadata: Metadata = {
  title: "Prodense - Royal Dental Care in India's Paradise",
  description:
    "Experience world-class dental treatments in India's most beautiful tourist destinations. Affordable, accredited, hassle-free dental tourism.",
  keywords: ['Dental Tourism', 'India', 'Dental Care', 'Prodense', 'Medical Tourism', 'Dental Treatments', 'Affordable Dentistry'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ApplicationLayout>{children}</ApplicationLayout>
}