'use client'

import NoelChat from '@/components/ylada/NoelChat'

export default function ProEsteticaCorporalNoelPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      <div>
        <p className="text-sm font-medium text-blue-600">Mentor</p>
        <h1 className="text-2xl font-bold text-gray-900">Noel (mentor)</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          Apoio para <strong className="text-gray-800">ti</strong> no dia a dia: o que postar, como responder, scripts e
          posicionamento de valor na estética corporal — sem substituir avaliação presencial nem normas do conselho de
          classe.
        </p>
      </div>

      <NoelChat
        area="pro_lideres"
        className="flex min-h-[min(70vh,560px)] flex-1 flex-col"
        chatApiPath="/api/pro-estetica-corporal/noel"
        skipYladaContextualWelcome
        disableYladaLinkEditor
        headerTitle="Noel — Pro Estética"
        locale="pt"
      />
    </div>
  )
}
