import { notFound } from 'next/navigation'
import { ProLideresPreviewConviteClient } from '@/components/pro-lideres/ProLideresPreviewConviteClient'

/**
 * Pré-visualização do ecrã de convite + atalhos para testar pagamento.
 * - Em produção: só existe se NEXT_PUBLIC_PRO_LIDERES_PREVIEW_DEV=true (opcional para staging).
 */
export default function ProLideresPreviewConvitePage() {
  const allowPreview =
    process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_PRO_LIDERES_PREVIEW_DEV === 'true'
  if (!allowPreview) {
    notFound()
  }

  return <ProLideresPreviewConviteClient />
}
