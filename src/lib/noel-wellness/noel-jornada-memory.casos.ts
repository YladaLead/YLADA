/**
 * Casos: memória da jornada do Noel (eventos + Board).
 * Rodar: npx tsx src/lib/noel-wellness/noel-jornada-memory.casos.ts
 */
import {
  inferirEtapaJornada,
  resumirAcoesComportamentais,
  classificarGavetaBoard,
  montarSnapshotGavetas,
  buildJornadaMemorySnapshot,
  formatJornadaMemoryForPrompt,
} from './noel-jornada-memory'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

// 1) Etapas inferidas pela ordem do funil
{
  assert(inferirEtapaJornada([]) === 'entrada', 'sem eventos → entrada')
  assert(inferirEtapaJornada(['user_created']) === 'entrada', 'só conta → entrada')
  assert(inferirEtapaJornada(['diagnosis_created']) === 'link_criado', 'link criado')
  assert(
    inferirEtapaJornada(['diagnosis_created', 'diagnosis_shared']) === 'link_compartilhado',
    'compartilhou',
  )
  assert(
    inferirEtapaJornada(['diagnosis_shared', 'diagnosis_answered']) === 'leads_responderam',
    'leads responderam',
  )
  assert(
    inferirEtapaJornada(['diagnosis_answered', 'lead_contact_clicked']) === 'conversa_com_leads',
    'clique WhatsApp',
  )
}

// 2) Resumo de ações deduplica e conta uso do Noel
{
  const acoes = resumirAcoesComportamentais([
    { event_type: 'diagnosis_created', created_at: '2026-01-01' },
    { event_type: 'diagnosis_created', created_at: '2026-01-02' },
    { event_type: 'noel_analysis_used', created_at: '2026-01-03' },
    { event_type: 'noel_analysis_used', created_at: '2026-01-04' },
  ])
  assert(acoes.includes('criou um diagnóstico/link'), 'deduplica diagnosis_created')
  assert(acoes.some((a) => /usou o Noel 2 vezes/.test(a)), 'conta usos do Noel')
}

// 3) Gavetas do Board por nome
{
  assert(classificarGavetaBoard('Meu Norte') === 'norte', 'norte')
  assert(classificarGavetaBoard('Raio-X pessoal') === 'raio_x', 'raio-x')
  assert(classificarGavetaBoard('Scripts WhatsApp') === 'scripts', 'scripts')
  assert(classificarGavetaBoard('Meus Links') === 'links', 'links')
  assert(classificarGavetaBoard('Pasta aleatória') === null, 'desconhecido → null')
}

// 4) Snapshot e prompt respeitam LGPD (sem payload)
{
  const snap = buildJornadaMemorySnapshot({
    segment: 'estetica',
    boardArea: 'estetica',
    eventos: [
      { event_type: 'diagnosis_created', created_at: '2026-06-01' },
      { event_type: 'lead_contact_clicked', created_at: '2026-06-02' },
    ],
    boards: [
      { nome: 'Meu Norte', cardCount: 2 },
      { nome: 'Meus Scripts', cardCount: 0 },
    ],
  })
  assert(snap.etapaInferida === 'conversa_com_leads', 'etapa no snapshot')
  const gavetas = montarSnapshotGavetas([{ nome: 'Meu Norte', cardCount: 2 }])
  assert(gavetas.find((g) => g.gaveta === 'norte')?.acesa === true, 'norte acesa')

  const prompt = formatJornadaMemoryForPrompt(snap)
  assert(prompt.includes('NÃO repita'), 'instrução de não repetir')
  assert(prompt.includes('Board aceso em: Meu Norte'), 'gaveta acesa no prompt')
  assert(!prompt.includes('2026-06'), 'prompt não expõe timestamps')
  assert(prompt.length > 0, 'prompt não vazio')
}

console.log('\nTODOS OS CASOS PASSARAM — memória da jornada (eventos + Board).')
