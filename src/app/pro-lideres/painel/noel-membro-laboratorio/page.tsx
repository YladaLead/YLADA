'use client'

import Link from 'next/link'
import { PRO_LIDERES_BASE_PATH } from '@/config/pro-lideres-menu'
import ProLideresMemberNoelLabPanel from '@/components/pro-lideres/ProLideresMemberNoelLabPanel'

export default function ProLideresMemberNoelLaboratorioPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <div>
        <p className="text-sm font-medium text-emerald-700">Laboratório · Noel da equipe (membro)</p>
        <h1 className="text-2xl font-bold text-gray-900">Testes de campo</h1>
        <p className="mt-2 text-sm text-gray-600">
          Você entra como <strong>líder</strong> — não precisa de assinatura Noel membro. Ative{' '}
          <strong>Noel equipe</strong> na configuração antes.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`${PRO_LIDERES_BASE_PATH}/noel-membro`}
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
          >
            Chat manual (Noel equipe)
          </Link>
          <Link
            href={`${PRO_LIDERES_BASE_PATH}/noel`}
            className="rounded-lg px-3 py-2 text-sm font-medium text-violet-700 hover:underline"
          >
            Noel do líder (gestão)
          </Link>
        </div>
      </div>

      <ProLideresMemberNoelLabPanel />

      <p className="text-xs text-gray-500">
        Terminal (sem login, só prompt):{' '}
        <code className="rounded bg-gray-100 px-1">npm run smoke:noel-membro:full</code>
      </p>
    </div>
  )
}
