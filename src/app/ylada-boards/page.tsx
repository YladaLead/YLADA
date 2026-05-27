import { Metadata } from 'next'
import YladaBoardsContent from '@/components/ylada-boards/YladaBoardsContent'

export const metadata: Metadata = {
  title: 'Ylada Boards — Mensagens prontas para WhatsApp',
  description: 'Organize seus scripts e mensagens por pasta. Copie com um toque e cole direto no WhatsApp.',
}

export default function YladaBoardsPage() {
  return <YladaBoardsContent area="geral" />
}
