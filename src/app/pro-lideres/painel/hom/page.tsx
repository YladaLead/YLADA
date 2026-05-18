import { redirect } from 'next/navigation'
import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'
import ProLideresHOMSettings from '@/components/pro-lideres/ProLideresHOMSettings'

export default async function ProLideresHOMPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const ui = await loadProLideresPainelUiForRequest(gate)
  if (!ui.isLeaderWorkspace) redirect('/pro-lideres/painel')

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-emerald-600">Ferramentas · Apresentação</p>
        <h1 className="text-2xl font-bold text-gray-900">Apresentação HOM</h1>
        <p className="max-w-2xl text-gray-600">
          Configure o vídeo da Home Open Meeting e copie os links únicos de cada membro.
          Cada prospect que receber o link vê o mesmo vídeo e fala diretamente com o distribuidor
          que o convidou.
        </p>
      </div>
      <ProLideresHOMSettings />
    </div>
  )
}
