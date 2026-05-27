import { ProLideresInvitesPanel } from '@/components/pro-lideres/ProLideresInvitesPanel'

/**
 * Equipe Pro Joias — reutiliza o painel de convites do Pro Líderes.
 * O tenant é resolvido pelo contexto de painel (layout).
 */
export default function ProJoiasEquipePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Minha equipe</h1>
        <p className="text-gray-500 text-sm mt-1">
          Convide distribuidoras para acessar os scripts e ferramentas da sua rede.
        </p>
      </div>
      <ProLideresInvitesPanel />
    </div>
  )
}
