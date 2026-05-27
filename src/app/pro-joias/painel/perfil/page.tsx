import { ProLideresPerfilForm } from '@/components/pro-lideres/ProLideresPerfilForm'

export default function ProJoiasPerfilPage() {
  return (
    <div className="max-w-xl space-y-4">
      <div>
        <p className="text-sm font-medium text-amber-700">Conta</p>
        <h1 className="text-2xl font-bold text-gray-900">Perfil da rede</h1>
        <p className="mt-1 text-sm text-gray-600">
          Nome da sua rede, contato e contexto de negócio — usado pelo Noel para personalizar respostas.
        </p>
      </div>
      <ProLideresPerfilForm
        tenantApiPath="/api/pro-joias/tenant"
        copyProfile="joias_rede"
      />
    </div>
  )
}
