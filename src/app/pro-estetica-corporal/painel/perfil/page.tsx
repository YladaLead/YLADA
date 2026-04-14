import { ProLideresPerfilForm } from '@/components/pro-lideres/ProLideresPerfilForm'

export default function ProEsteticaCorporalPerfilPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-blue-600">Conta</p>
        <h1 className="text-2xl font-bold text-gray-900">Perfil da operação</h1>
        <p className="mt-1 text-sm text-gray-600">
          Dados do teu espaço Pro Estética Corporal (nome, contacto, notas de foco para o Noel).
        </p>
      </div>
      <ProLideresPerfilForm tenantApiPath="/api/pro-estetica-corporal/tenant" />
    </div>
  )
}
