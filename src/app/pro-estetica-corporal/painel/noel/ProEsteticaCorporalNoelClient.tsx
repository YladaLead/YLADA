'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import NoelChat from '@/components/ylada/NoelChat'
import {
  PRO_ESTETICA_CORPORAL_NOEL_FOCUS_MESSAGES,
  PRO_ESTETICA_CORPORAL_NOEL_FOCUS_PARAM,
  isProEsteticaCorporalNoelFocus,
} from '@/config/pro-estetica-corporal-noel-focus'

export default function ProEsteticaCorporalNoelClient() {
  const searchParams = useSearchParams()
  const initialMessage = useMemo(() => {
    const raw = searchParams.get(PRO_ESTETICA_CORPORAL_NOEL_FOCUS_PARAM)
    if (!raw || !isProEsteticaCorporalNoelFocus(raw)) return undefined
    return PRO_ESTETICA_CORPORAL_NOEL_FOCUS_MESSAGES[raw]
  }, [searchParams])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <NoelChat
        area="pro_estetica_corporal"
        className="flex min-h-[min(70vh,560px)] flex-1 flex-col"
        chatApiPath="/api/pro-estetica-corporal/noel"
        skipYladaContextualWelcome
        headerTitle="Noel — Estética corporal"
        hideSuggestionsHeading
        hideInputHint={false}
        sendButtonLabel="Enviar para o Noel"
        locale="pt"
        initialMessage={initialMessage}
      />
    </div>
  )
}
