import clsx from 'clsx'
import { CarDentalSearchForm } from './CarDentalSearchForm'

const CarDentalHeroSearchForm = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('hero-search-form mt-8', className)}>
      <CarDentalSearchForm formStyle={'default'} />
    </div>
  )
}

export default CarDentalHeroSearchForm