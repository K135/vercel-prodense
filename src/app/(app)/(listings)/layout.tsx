import MedicalTourismHeader from '@/components/Header/MedicalTourismHeader'
import { ReactNode } from 'react'
import { ApplicationLayout } from '../application-layout'

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <ApplicationLayout header={<MedicalTourismHeader />}>
      <div>
        <div className="container">
          {children}
        </div>
      </div>
    </ApplicationLayout>
  )
}

export default Layout
