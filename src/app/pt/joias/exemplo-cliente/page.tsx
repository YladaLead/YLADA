import type { Metadata } from 'next'
import JoiasDemoClienteContent from './JoiasDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · cliente | Joias YLADA',
  description: 'Demonstração imparcial: como a cliente pode responder antes do WhatsApp.',
}

export default function JoiasExemploClientePage() {
  return (
    <div className="min-h-[100dvh] bg-white">
      <JoiasDemoClienteContent />
    </div>
  )
}
