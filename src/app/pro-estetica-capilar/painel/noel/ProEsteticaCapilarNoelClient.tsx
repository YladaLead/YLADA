'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import NoelChat from '@/components/ylada/NoelChat'
import {
  PRO_ESTETICA_CAPILAR_NOEL_FOCUS_MESSAGES,
  PRO_ESTETICA_CAPILAR_NOEL_FOCUS_PARAM,
  isProEsteticaCapilarNoelFocus,
} from '@/config/pro-estetica-capilar-noel-focus'

export default function ProEsteticaCapilarNoelClient() {
  const searchParams = useSearchParams()
  const initialMessage = useMemo(() => {
    const raw = searchParams.get(PRO_ESTETICA_CAPILAR_NOEL_FOCUS_PARAM)
    if (!raw || !isProEsteticaCapilarNoelFocus(raw)) return undefined
    return PRO_ESTETICA_CAPILAR_NOEL_FOCUS_MESSAGES[raw]
  }, [searchParams])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <NoelChat
        area="pro_estetica_capilar"
        className="flex min-h-[min(70vh,560px)] flex-1 flex-col"
        chatApiPath="/api/pro-estetica-capilar/noel"
        skipYladaContextualWelcome
        headerTitle="Noel — Estética capilar"
        hideSuggestionsHeading
        hideInputHint={false}
        sendButtonLabel="Enviar para o Noel"
        locale="pt"
        initialMessage={initialMessage}
      />
    </div>
  )
}
