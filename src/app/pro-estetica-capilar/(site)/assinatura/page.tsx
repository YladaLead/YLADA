import { redirect } from 'next/navigation'
import {
  PRO_ESTETICA_CAPILAR_ASSINATURA_PAINEL_PATH,
  PRO_ESTETICA_CAPILAR_ENTRAR_ASSINATURA_PATH,
} from '@/lib/pro-estetica-capilar-subscription'
import { ensureEsteticaCapilarTenantAccess } from '@/lib/pro-estetica-capilar-server'

/**
 * Entrada curta para renovação/assinatura (link no WhatsApp).
 * Sem sessão → login com retorno ao checkout; com tenant → painel de assinatura.
 */
export default async function ProEsteticaCapilarAssinaturaPublicPage() {
  const gate = await ensureEsteticaCapilarTenantAccess({ skipConsultoriaAccessCheck: true })

  if (!gate.ok) {
    if (gate.redirect === '/pro-estetica-capilar/entrar') {
      redirect(PRO_ESTETICA_CAPILAR_ENTRAR_ASSINATURA_PATH)
    }
    redirect(gate.redirect)
  }

  redirect(PRO_ESTETICA_CAPILAR_ASSINATURA_PAINEL_PATH)
}
