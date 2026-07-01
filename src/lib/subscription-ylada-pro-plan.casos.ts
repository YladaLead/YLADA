/**
 * Regressão: membro Pro Líderes com perfil `ylada` deve contar como Pro (sem teto freemium).
 * Rodar: npx tsx src/lib/subscription-ylada-pro-plan.casos.ts
 */
import { yladaMatrixProFromPerfilAndAccess } from './subscription-helpers'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

const casos: Array<{
  descricao: string
  signals: Parameters<typeof yladaMatrixProFromPerfilAndAccess>[0]
  expected: boolean
}> = [
  {
    descricao: 'Teresa: perfil ylada, sem assinatura, membro Pro Líderes ativo → Pro',
    signals: {
      wellnessCommercialSub: false,
      proLideresUnlock: true,
      segmentCommercialSub: false,
    },
    expected: true,
  },
  {
    descricao: 'Wellness comercial próprio → Pro',
    signals: {
      wellnessCommercialSub: true,
      proLideresUnlock: false,
      segmentCommercialSub: false,
    },
    expected: true,
  },
  {
    descricao: 'Free sem Pro Líderes nem segmento pago → não Pro',
    signals: {
      wellnessCommercialSub: false,
      proLideresUnlock: false,
      segmentCommercialSub: false,
    },
    expected: false,
  },
  {
    descricao: 'Segmento matriz pago (nutri mensal) → Pro',
    signals: {
      wellnessCommercialSub: false,
      proLideresUnlock: false,
      segmentCommercialSub: true,
    },
    expected: true,
  },
]

for (const c of casos) {
  const got = yladaMatrixProFromPerfilAndAccess(c.signals)
  assert(got === c.expected, `${c.descricao} (esperado ${c.expected}, obteve ${got})`)
}

console.log(`\n${casos.length} casos passaram.`)
