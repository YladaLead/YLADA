'use client'

import { Suspense } from 'react'
import NoelChat from '@/components/ylada/NoelChat'

function ProJoiasNoelClient() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <NoelChat
        area="pro_joias"
        className="flex min-h-[min(70vh,560px)] flex-1 flex-col"
        chatApiPath="/api/noel"
        skipYladaContextualWelcome
        headerTitle="Noel, Pro Joias"
        hideSuggestionsHeading
        hideInputHint={false}
        sendButtonLabel="Enviar para o Noel"
        locale="pt"
      />
    </div>
  )
}

export default function ProJoiasNoelPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[40vh] items-center justify-center p-6 text-sm text-gray-500">
        Carregando o Noel…
      </div>
    }>
      <ProJoiasNoelClient />
    </Suspense>
  )
}
