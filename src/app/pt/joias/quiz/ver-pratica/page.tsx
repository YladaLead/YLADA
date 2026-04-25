import type { Metadata } from 'next'
import JoiasVerPraticaPosQuizContent from './JoiasVerPraticaPosQuizContent'

export const metadata: Metadata = {
  title: 'Ver na prática | Joias e bijuterias · YLADA',
  description: 'Veja como o fluxo funciona no lugar da sua cliente.',
}

export default function JoiasVerPraticaPosQuizPage() {
  return (
    <div className="min-h-[100dvh] bg-white">
      <JoiasVerPraticaPosQuizContent />
    </div>
  )
}
