import ProLideresHOMMembroClient from '@/components/pro-lideres/ProLideresHOMMembroClient'

export default function ProLideresMembroHOMPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-emerald-600">Ferramentas · Apresentação</p>
        <h1 className="text-2xl font-bold text-gray-900">Apresentação HOM</h1>
        <p className="max-w-2xl text-gray-600">
          O seu link personalizado da Home Open Meeting. Envie para os seus prospects — quando clicarem,
          eles assistem ao vídeo e falam diretamente com você pelo WhatsApp.
        </p>
      </div>
      <ProLideresHOMMembroClient />
    </div>
  )
}
