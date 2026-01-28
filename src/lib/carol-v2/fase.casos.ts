/**
 * Tabela de casos: tags + contexto → fase.
 * Lei do sistema executável. Rodar: npx tsx src/lib/carol-v2/fase.casos.ts
 */

import { getFaseFromTagsAndContext } from './fase'
import type { Fase } from './fase'

interface CasoFase {
  tags: string[]
  contexto?: { workshop_session_id?: string | null } | null
  expected: Fase
  descricao?: string
}

export const CASOS_FASE: CasoFase[] = [
  { tags: [], expected: 'inscrito_nao_chamou', descricao: 'sem tags' },
  { tags: ['outra_tag'], expected: 'inscrito_nao_chamou', descricao: 'tags que não importam' },
  {
    tags: ['veio_aula_pratica'],
    expected: 'chamou_nao_fechou',
    descricao: 'veio do form, ainda não participou/não participou',
  },
  {
    tags: ['recebeu_link_workshop'],
    expected: 'chamou_nao_fechou',
    descricao: 'recebeu link, ainda não fechou',
  },
  {
    tags: ['veio_aula_pratica', 'primeiro_contato'],
    expected: 'chamou_nao_fechou',
    descricao: 'veio + primeiro_contato, sem participou/nao_participou',
  },
  {
    tags: ['veio_aula_pratica', 'agendou_aula'],
    expected: 'agendou',
    descricao: 'veio e agendou aula',
  },
  {
    tags: ['recebeu_link_workshop', 'agendou_aula'],
    expected: 'agendou',
    descricao: 'recebeu link e agendou',
  },
  {
    tags: ['veio_aula_pratica'],
    contexto: { workshop_session_id: 'sessao-123' },
    expected: 'agendou',
    descricao: 'veio + workshop_session_id no contexto',
  },
  {
    tags: ['participou_aula'],
    expected: 'participou',
    descricao: 'participou da aula',
  },
  {
    tags: ['veio_aula_pratica', 'participou_aula'],
    expected: 'participou',
    descricao: 'participou vence quaisquer outras',
  },
  {
    tags: ['nao_participou_aula'],
    expected: 'nao_participou',
    descricao: 'não participou, sem participou',
  },
  {
    tags: ['veio_aula_pratica', 'nao_participou_aula'],
    expected: 'nao_participou',
    descricao: 'não participou vence veio/recebeu',
  },
  {
    tags: ['participou_aula', 'nao_participou_aula'],
    expected: 'participou',
    descricao: 'participou tem prioridade sobre nao_participou',
  },
  {
    tags: ['nao_participou_aula', 'recebeu_segundo_link'],
    expected: 'nao_participou',
    descricao: 'não participou + recebeu segundo link',
  },
  {
    tags: ['agendou_aula'],
    expected: 'inscrito_nao_chamou',
    descricao: 'só agendou_aula sem veio/recebeu → inscrito (lei exige veio ou recebeu para agendou)',
  },
  {
    tags: [],
    contexto: { workshop_session_id: 'x' },
    expected: 'inscrito_nao_chamou',
    descricao: 'só sessão sem veio/recebeu não sobe para agendou',
  },
]

function runCasos(): void {
  let ok = 0
  let fail = 0
  for (const cas of CASOS_FASE) {
    const got = getFaseFromTagsAndContext(cas.tags, cas.contexto ?? undefined)
    if (got === cas.expected) {
      ok++
      console.log(`  ok: [${cas.tags.join(', ')}] + ${JSON.stringify(cas.contexto ?? {})} → ${got}${cas.descricao ? ` (${cas.descricao})` : ''}`)
    } else {
      fail++
      console.error(`  FAIL: [${cas.tags.join(', ')}] + ${JSON.stringify(cas.contexto ?? {})} → esperado ${cas.expected}, obtido ${got}${cas.descricao ? ` (${cas.descricao})` : ''}`)
    }
  }
  console.log(`\nCasos: ${ok} ok, ${fail} falhas`)
  if (fail > 0) process.exit(1)
}

runCasos()
