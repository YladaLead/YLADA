/**
 * Hub administrativo — documentação do motor de crescimento (docs/growth-engine).
 * Links apontam para o repositório público no GitHub (branch main).
 */
export const GROWTH_ENGINE_GITHUB_BASE =
  'https://github.com/YladaLead/YLADA/blob/main/docs/growth-engine'

export type GrowthEngineDocItem = {
  file: string
  title: string
  description: string
}

export const growthEngineDocs: GrowthEngineDocItem[] = [
  {
    file: '00-brief-mestre-ylada.md',
    title: 'Brief mestre',
    description: 'ICP, promessa central, proibições, design/tom, free, modos por segmento',
  },
  {
    file: '01-principios-e-escopo.md',
    title: 'Princípios e escopo',
    description: 'Visão, premissas, o que é ou não automático',
  },
  {
    file: '02-catalogo-de-agentes.md',
    title: 'Catálogo de agentes',
    description: 'Papéis, entradas/saídas, orquestração',
  },
  {
    file: '03-fases-crescimento-e-agente-diretor.md',
    title: 'Fases e Agente Diretor',
    description: 'Validar → converter → escalar',
  },
  {
    file: '04-checklist-primeiros-usuarios.md',
    title: 'Primeiros usuários',
    description: 'Checklist manual de captação e validação',
  },
  {
    file: '05-unit-economics-free-pago.md',
    title: 'Free, pago e risco',
    description: 'Unit economics e agente financeiro (lógica)',
  },
  {
    file: '06-criativos-message-match-segmentos.md',
    title: 'Criativos e message match',
    description: 'Ferramentas externas, landing, segmentos',
  },
  {
    file: '07-metricas-e-control-center.md',
    title: 'Métricas e control center',
    description: 'O que medir para os agentes',
  },
  {
    file: '08-roadmap-implantacao.md',
    title: 'Roadmap de implantação',
    description: 'Fases documentação → prompts → produto',
  },
  {
    file: '09-proximos-passos-e-prazos.md',
    title: 'Próximos passos e prazos',
    description: 'Lista temporal para construir os agentes',
  },
  {
    file: '10-passo-a-passo-suas-acoes.md',
    title: 'Suas ações (operador)',
    description: 'Roteiro pessoal — espelhado no checklist do admin',
  },
  {
    file: 'README.md',
    title: 'Índice da pasta',
    description: 'Ordem sugerida de leitura',
  },
]

export function growthEngineDocUrl(file: string) {
  return `${GROWTH_ENGINE_GITHUB_BASE}/${encodeURIComponent(file)}`
}
