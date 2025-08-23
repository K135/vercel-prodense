import MedicalTourismHeader from '@/components/Header/MedicalTourismHeader'
import { ApplicationLayout } from '../application-layout'

export default function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  return <ApplicationLayout header={<MedicalTourismHeader />}>{children}</ApplicationLayout>
}
