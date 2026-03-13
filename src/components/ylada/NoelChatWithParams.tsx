'use client'

import { useSearchParams } from 'next/navigation'
import NoelChat, { type NoelArea } from '@/components/ylada/NoelChat'

interface NoelChatWithParamsProps {
  area?: NoelArea
  className?: string
}

/** NoelChat que lê ?msg=... da URL para mensagem inicial (ex.: botão "Melhorar diagnóstico"). */
export default function NoelChatWithParams({ area = 'med', className = '' }: NoelChatWithParamsProps) {
  const searchParams = useSearchParams()
  const msg = searchParams.get('msg')
  return <NoelChat area={area} className={className} initialMessage={msg ?? undefined} />
}
