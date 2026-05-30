import { redirect } from 'next/navigation'
import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'
import ProLideresResetSettings from '@/components/pro-lideres/ProLideresResetSettings'

export default async function ProLideresResetPainelPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const ui = await loadProLideresPainelUiForRequest(gate)
  if (!ui.isLeaderWorkspace) redirect('/pro-lideres/painel')

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#5A8D2A]">Ferramentas · Bebida</p>
        <h1 className="text-2xl font-bold text-gray-900">Reset Metabólico</h1>
        <p className="max-w-2xl text-gray-600">
          Configure o vídeo sobre a bebida e copie os links da equipe. Cada membro compartilha a página com o WhatsApp
          dele para encomendas de sacola.
        </p>
      </div>
      <ProLideresResetSettings />
    </div>
  )
}
