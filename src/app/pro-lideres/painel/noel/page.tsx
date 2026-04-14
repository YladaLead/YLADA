'use client'

import NoelChat from '@/components/ylada/NoelChat'

export default function ProLideresNoelPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <NoelChat
        area="pro_lideres"
        className="flex min-h-[min(70vh,560px)] flex-1 flex-col"
        chatApiPath="/api/pro-lideres/noel"
        skipYladaContextualWelcome
        skipWelcomeMessage
        hideSuggestions
        showChatHeaderTitle
        showHeaderEmoji={false}
        headerTitle="Noel"
        headerTagline="Estou aqui para ajudar, pergunte o que precisar para desenvolver você e sua equipe."
        hideInputHint
        sendButtonLabel="Enviar"
        disableYladaLinkEditor
        locale="pt"
      />
    </div>
  )
}
