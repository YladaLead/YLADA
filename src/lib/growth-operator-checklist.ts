/**
 * Checklist operador growth — espelha docs/growth-engine/10-passo-a-passo-suas-acoes.md
 * IDs estáveis para persistência em localStorage; não renomear sem migrar dados.
 */
export const GROWTH_CHECKLIST_STORAGE_VERSION = 1

export type GrowthChecklistTask = {
  id: string
  label: string
  docHint?: string
}

export type GrowthChecklistSection = {
  id: string
  title: string
  description?: string
  tasks: GrowthChecklistTask[]
}

export const growthOperatorChecklist: GrowthChecklistSection[] = [
  {
    id: 'antes',
    title: 'Antes de começar (uma vez)',
    description: 'Base para não dispersar mensagem nem violar o brief.',
    tasks: [
      {
        id: 'antes-ler-00',
        label: 'Ler o brief mestre (ICP, promessa, o que nunca fazer)',
        docHint: 'docs/growth-engine/00-brief-mestre-ylada.md',
      },
      {
        id: 'antes-nicho',
        label: 'Escolher um nicho para validar primeiro',
        docHint: 'docs/growth-engine/00-brief-mestre-ylada.md — § ICP',
      },
      {
        id: 'antes-link',
        label: 'Garantir link/fluxo funcional (diagnóstico → WhatsApp ou equivalente)',
      },
      {
        id: 'antes-frase',
        label: 'Escrever uma frase de oferta que um leigo entenda em segundos',
      },
    ],
  },
  {
    id: 'semana',
    title: 'Toda semana (fase de validação)',
    description: 'Repetir até ter prova clara. Sem planilha não há aprendizado.',
    tasks: [
      {
        id: 'sem-lista',
        label: 'Listar quem abordar (ex.: 20 próximos contatos)',
        docHint: 'docs/growth-engine/04-checklist-primeiros-usuarios.md',
      },
      {
        id: 'sem-enviar',
        label: 'Enviar mensagens com convite claro (no máx. 2 versões de texto na semana)',
      },
      {
        id: 'sem-mesmo-link',
        label: 'Usar o mesmo link para quem aceitar (comparar desempenho)',
      },
      {
        id: 'sem-planilha',
        label: 'Registrar na planilha: texto, respondeu?, clicou?, completou?, objeção',
        docHint: 'docs/growth-engine/07-metricas-e-control-center.md',
      },
      {
        id: 'sem-revisao',
        label: 'Reservar 30–60 min: o que gerou mais resposta? Ajustar só UMA variável na próxima semana',
      },
    ],
  },
  {
    id: 'paralelo',
    title: 'Em paralelo (quando tiver tempo)',
    description: 'Não atrase a captação por causa disso.',
    tasks: [
      {
        id: 'par-00-placeholders',
        label: 'Preencher placeholders do brief (cores/fontes oficiais quando existirem)',
        docHint: 'docs/growth-engine/00-brief-mestre-ylada.md — § 4.4',
      },
      {
        id: 'par-planilha-07',
        label: 'Criar/atualizar planilha mínima de métricas (mesmo com células manuais)',
        docHint: 'docs/growth-engine/07-metricas-e-control-center.md',
      },
      {
        id: 'par-free-preco',
        label: 'Se free/preços mudarem: anotar na planilha interna e referenciar no brief',
        docHint: 'docs/growth-engine/05-unit-economics-free-pago.md',
      },
    ],
  },
  {
    id: 'agentes',
    title: 'Quando existirem prompts dos agentes',
    description: 'Um pedido por vez; revisar antes de publicar.',
    tasks: [
      {
        id: 'ag-insumos',
        label: 'Levar objetivo, nicho, link e 3–5 mensagens reais + respostas',
        docHint: 'docs/growth-engine/10-passo-a-passo-suas-acoes.md',
      },
      {
        id: 'ag-um-pedido',
        label: 'Pedir uma coisa por vez ao modelo (ex.: só abertura da mensagem)',
      },
      {
        id: 'ag-revisar-00',
        label: 'Revisar saída com checklist do brief (promessa, compliance, message match)',
        docHint: 'docs/growth-engine/06-criativos-message-match-segmentos.md',
      },
      {
        id: 'ag-planilha',
        label: 'Levar o que funcionou de volta para a planilha e próximo prompt',
      },
    ],
  },
  {
    id: 'depois',
    title: 'Depois da validação “pura”',
    description: 'Critérios no checklist 04 e fases no 03.',
    tasks: [
      {
        id: 'dep-criterios',
        label: 'Conferir critérios para sair da validação pura',
        docHint: 'docs/growth-engine/04-checklist-primeiros-usuarios.md',
      },
      {
        id: 'dep-canal',
        label: 'Só então planejar testes de canal (ex.: anúncio pequeno) com message match',
        docHint: 'docs/growth-engine/06-criativos-message-match-segmentos.md',
      },
      {
        id: 'dep-gate',
        label: 'Antes de aumentar gasto: conferir gate free/pago e unit economics',
        docHint: 'docs/growth-engine/05-unit-economics-free-pago.md',
      },
    ],
  },
]

export function allGrowthTaskIds(): string[] {
  return growthOperatorChecklist.flatMap((s) => s.tasks.map((t) => t.id))
}
