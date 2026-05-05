import { ProLideresPerfilForm } from '@/components/pro-lideres/ProLideresPerfilForm'

export default function ProLideresMembroPerfilPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Meu perfil</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <ProLideresPerfilForm memberTeamProfile />
      </div>
    </div>
  )
}
