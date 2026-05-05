import { ProLideresPerfilForm } from '@/components/pro-lideres/ProLideresPerfilForm'

export default function ProLideresMembroPerfilPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-blue-600">Conta · Equipe</p>
        <h1 className="text-2xl font-bold text-gray-900">Meu perfil</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <ProLideresPerfilForm memberTeamProfile />
      </div>
    </div>
  )
}
