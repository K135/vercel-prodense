import { Metadata } from 'next'
import { ApplicationLayout } from '../(app)/application-layout'

export const metadata: Metadata = {
  title: 'Home Tri',
  description:
    'Prodense is a modern and elegant template for Next.js, Tailwind CSS, and TypeScript. It is designed to be simple and easy to use, with a focus on performance and accessibility.',
  keywords: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Prodense', 'Travel', 'E-commerce', 'Booking', 'Cars'],
}

export default function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  return <ApplicationLayout>{children}</ApplicationLayout>
}