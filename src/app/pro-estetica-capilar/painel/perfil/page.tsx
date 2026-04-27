import { ProLideresPerfilForm } from '@/components/pro-lideres/ProLideresPerfilForm'

export default function ProEsteticaCapilarPerfilPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-blue-600">Conta</p>
        <h1 className="text-2xl font-bold text-gray-900">Perfil da clínica — Terapia capilar</h1>
        <p className="mt-1 text-sm text-gray-600">
          Dados da tua clínica no YLADA Pro — Terapia capilar (nome, contacto e notas de foco comercial).
        </p>
      </div>
      <ProLideresPerfilForm
        tenantApiPath="/api/pro-estetica-capilar/tenant"
        copyProfile="estetica_clinica"
      />
    </div>
  )
}
