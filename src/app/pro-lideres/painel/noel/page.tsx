'use client'

import NoelChat from '@/components/ylada/NoelChat'

export default function ProLideresNoelPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      <div>
        <p className="text-sm font-medium text-blue-600">Principal</p>
        <h1 className="text-2xl font-bold text-gray-900">Noel (mentor)</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          O mesmo mentor visual da matriz YLADA, com contexto do <strong className="text-gray-800">teu espaço Pro Líderes</strong>{' '}
          (operador, notas de foco e papel: líder ou equipe). Ideal para scripts de WhatsApp, links e conversas de campo.
        </p>
      </div>

      <NoelChat
        area="pro_lideres"
        className="flex min-h-[min(70vh,560px)] flex-1 flex-col"
        chatApiPath="/api/pro-lideres/noel"
        skipYladaContextualWelcome
        disableYladaLinkEditor
        headerTitle="Noel — Pro Líderes"
        locale="pt"
      />
    </div>
  )
}
