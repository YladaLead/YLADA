import ProLideresResetMembroClient from '@/components/pro-lideres/ProLideresResetMembroClient'

export default function ProLideresResetMembroPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#5A8D2A]">Ferramentas · Bebida</p>
        <h1 className="text-2xl font-bold text-gray-900">Reset Metabólico</h1>
        <p className="max-w-2xl text-gray-600">
          Seu link personalizado para apresentar a bebida. Quem abrir vê o vídeo do líder e pode encomendar sacola pelo
          seu WhatsApp.
        </p>
      </div>
      <ProLideresResetMembroClient />
    </div>
  )
}
