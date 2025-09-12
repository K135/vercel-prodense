import clsx from 'clsx'
import ProdenseAIAssistant from './ProdenseAIAssistant'

const ProdenseAIHeroForm = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('hero-ai-form mt-2', className)}>
      <ProdenseAIAssistant />
    </div>
  )
}

export default ProdenseAIHeroForm