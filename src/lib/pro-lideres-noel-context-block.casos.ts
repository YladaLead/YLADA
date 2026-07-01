/**
 * Casos do bloco de contexto Pro Líderes unificado na matriz.
 * Rodar: npm run test:noel-pl-unified-context
 */
import { formatProLideresCatalogForNoel } from '@/lib/pro-lideres-noel-catalog-context'
import {
  buildProLideresNoelContextBlock,
  buildProLideresNoelLeaderConducaoOverrideBlock,
  resolveProLideresNoelUnifiedPapel,
} from '@/lib/pro-lideres-noel-context-block'
import {
  isNoelProLideresUnifiedEnabled,
  isNoelProLideresUnifiedForTenant,
  isNoelProLideresUnifiedPilotOwnerEmail,
  NOEL_CHAT_MODEL,
} from '@/lib/pro-lideres-noel-unified-flag'

let ok = 0
let fail = 0

function assert(name: string, cond: boolean) {
  if (cond) {
    ok++
    console.log('✓', name)
  } else {
    fail++
    console.log('✗', name)
  }
}

function withEnv(value: string | undefined, fn: () => void) {
  const prev = process.env.NOEL_PRO_LIDERES_UNIFIED_ENABLED
  if (value === undefined) delete process.env.NOEL_PRO_LIDERES_UNIFIED_ENABLED
  else process.env.NOEL_PRO_LIDERES_UNIFIED_ENABLED = value
  try {
    fn()
  } finally {
    if (prev === undefined) delete process.env.NOEL_PRO_LIDERES_UNIFIED_ENABLED
    else process.env.NOEL_PRO_LIDERES_UNIFIED_ENABLED = prev
  }
}

function withPilotEmails(value: string | undefined, fn: () => void) {
  const prev = process.env.NOEL_PRO_LIDERES_UNIFIED_PILOT_EMAILS
  if (value === undefined) delete process.env.NOEL_PRO_LIDERES_UNIFIED_PILOT_EMAILS
  else process.env.NOEL_PRO_LIDERES_UNIFIED_PILOT_EMAILS = value
  try {
    fn()
  } finally {
    if (prev === undefined) delete process.env.NOEL_PRO_LIDERES_UNIFIED_PILOT_EMAILS
    else process.env.NOEL_PRO_LIDERES_UNIFIED_PILOT_EMAILS = prev
  }
}

assert('modelo padrão gpt-4o-mini', NOEL_CHAT_MODEL === 'gpt-4o-mini')

withEnv(undefined, () => {
  assert('flag unified default OFF', !isNoelProLideresUnifiedEnabled())
})

withEnv('true', () => {
  assert('flag unified true ON', isNoelProLideresUnifiedEnabled())
})

assert(
  'piloto por coluna tenant',
  isNoelProLideresUnifiedForTenant({ noel_unified_pilot_enabled: true })
)
assert(
  'piloto OFF sem coluna nem global',
  !isNoelProLideresUnifiedForTenant({ noel_unified_pilot_enabled: false })
)

withPilotEmails('deisefaula@gmail.com', () => {
  assert(
    'piloto por e-mail dono',
    isNoelProLideresUnifiedPilotOwnerEmail('deisefaula@gmail.com')
  )
})

assert('papel explícito leader', resolveProLideresNoelUnifiedPapel({ proLideresPapel: 'leader' }) === 'leader')
assert('papel explícito membro', resolveProLideresNoelUnifiedPapel({ proLideresPapel: 'membro' }) === 'member')
assert('área pro_lideres → leader', resolveProLideresNoelUnifiedPapel({ area: 'pro_lideres' }) === 'leader')
assert(
  'área pro_lideres_member → member',
  resolveProLideresNoelUnifiedPapel({ area: 'pro_lideres_member' }) === 'member'
)
assert('ylada neutro → null', resolveProLideresNoelUnifiedPapel({ area: 'ylada' }) === null)

const leaderBlock = buildProLideresNoelContextBlock({
  papel: 'leader',
  operationLabel: 'Equipe Demo',
  verticalCode: 'h-lider',
  focusNotes: 'Foco em convites',
  replyLanguage: 'Português (Brasil)',
  noelProfileId: 'noel_pro_lideres_h_lider_v1',
  tenantRole: 'leader',
  catalogContext: formatProLideresCatalogForNoel(['pl-abc-v-calc-imc']),
  linksAtivosContext: '[LINKS ATIVOS DO PROFISSIONAL]\n- Quiz teste',
  painelTarefasDiariasUrl: 'https://www.ylada.com/pro-lideres/painel/tarefas',
})

assert('líder: header papel', /papel:\*\* leader/.test(leaderBlock.replace(/\*\*/g, '')) || /papel:\*\* leader/.test(leaderBlock))
assert('líder: operação', leaderBlock.includes('Equipe Demo'))
assert('líder: override ENTREGA PRIMEIRO', /ENTREGA PRIMEIRO/.test(leaderBlock))
assert('líder: catálogo pl', leaderBlock.includes('CATÁLOGO DE FERRAMENTAS'))
assert('líder: links ativos', leaderBlock.includes('LINKS ATIVOS'))
assert('líder: URL tarefas', leaderBlock.includes('/pro-lideres/painel/tarefas'))

const override = buildProLideresNoelLeaderConducaoOverrideBlock()
assert('override menciona COMPORTAMENTO ESTRATÉGICO', override.includes('[COMPORTAMENTO ESTRATÉGICO]'))

const memberBlock = buildProLideresNoelContextBlock({
  papel: 'member',
  operationLabel: 'Rede Norte',
  verticalCode: 'h-lider',
  focusNotes: null,
  replyLanguage: 'Português (Brasil)',
  noelProfileId: 'noel_pro_lideres_h_lider_v1',
  tenantRole: 'member',
  tabulatorName: 'Ana',
  catalogExcerpt: '- **Quiz Energia**: https://www.ylada.com/l/pl-x',
  dailyTasksExcerpt: 'Checklist do líder para hoje',
})

assert('membro: ramo membro (campo)', memberBlock.includes('RAMO MEMBRO'))
assert('membro: campo da operação', /campo/i.test(memberBlock))
assert('membro: pode usar motor (não proíbe criar)', !/não cria.*links/i.test(memberBlock))
assert('membro: não escreve URL à mão', /invente uma URL|invente URL/i.test(memberBlock))
assert('membro: MEUS LINKS', memberBlock.includes('[MEUS LINKS'))
assert('membro: tabulador Ana', memberBlock.includes('Ana'))
assert('membro: tarefas hoje', memberBlock.includes('TAREFAS DE HOJE'))

console.log(`\n${ok} ok, ${fail} fail`)
process.exit(fail > 0 ? 1 : 0)
