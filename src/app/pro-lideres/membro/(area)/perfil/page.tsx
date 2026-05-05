import { ProLideresPerfilForm } from '@/components/pro-lideres/ProLideresPerfilForm'

export default function ProLideresMembroPerfilPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Conta · Equipe</p>
        <h1 className="text-2xl font-bold text-gray-900">Meu perfil</h1>
        <p className="mt-2 text-gray-600">
          Actualiza o teu nome, contactos e slug de divulgação. O nome da operação é o que o líder definiu para a
          equipa.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold text-gray-900">Dados principais</h2>
        <p className="mt-1 text-xs text-gray-500">
          Podes editar os teus dados pessoais e o slug dos links. O nome da operação vem do espaço do líder (só leitura).
        </p>
        <div className="mt-5">
          <ProLideresPerfilForm memberTeamProfile />
        </div>
      </div>
    </div>
  )
}
