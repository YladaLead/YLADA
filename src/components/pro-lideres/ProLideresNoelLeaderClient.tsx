'use client'

import NoelChat from '@/components/ylada/NoelChat'

/**
 * Noel do painel do líder — piloto unificado usa motor da matriz + overlay líder.
 */
export default function ProLideresNoelLeaderClient({
  useUnifiedMatrixNoel = false,
}: {
  useUnifiedMatrixNoel?: boolean
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <NoelChat
        area="pro_lideres"
        className="flex min-h-[min(70vh,560px)] flex-1 flex-col"
        chatApiPath={useUnifiedMatrixNoel ? '/api/ylada/noel' : '/api/pro-lideres/noel'}
        proLideresPapel={useUnifiedMatrixNoel ? 'leader' : undefined}
        skipYladaContextualWelcome
        skipWelcomeMessage
        hideSuggestions
        showChatHeaderTitle
        showHeaderEmoji={false}
        headerTitle="Noel"
        headerTagline="Estou aqui para ajudar, pergunte o que precisar para desenvolver você e sua equipe."
        hideInputHint
        sendButtonLabel="Enviar"
        locale="pt"
      />
    </div>
  )
}
