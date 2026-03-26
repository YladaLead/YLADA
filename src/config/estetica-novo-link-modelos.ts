/**
 * Modelos rápidos — criação de link estética (atalho de ação, não “montar fluxo”).
 * `tema` vai para a API; `defaultTitle` é o nome sugerido do link (editável).
 */
export interface EsteticaLinkModeloRapido {
  id: string
  label: string
  tema: string
  defaultTitle: string
  /** Destaque “Recomendado pra você” + CTA “Usar agora”. */
  recomendado?: boolean
}

export const ESTETICA_MODELOS_LINK_RAPIDO: EsteticaLinkModeloRapido[] = [
  {
    id: 'limpeza',
    label: 'Limpeza de pele',
    tema: 'limpeza de pele e hidratação facial',
    defaultTitle: 'Descubra o que sua pele precisa antes da limpeza',
    recomendado: true,
  },
  {
    id: 'acne',
    label: 'Acne',
    tema: 'acne e oleosidade da pele',
    defaultTitle: 'Entenda melhor sua pele com acne',
  },
  {
    id: 'manchas',
    label: 'Manchas',
    tema: 'manchas e uniformização da pele',
    defaultTitle: 'Manchas na pele: por onde começar',
  },
  {
    id: 'rejuvenescimento',
    label: 'Rejuvenescimento',
    tema: 'rejuvenescimento e firmeza facial',
    defaultTitle: 'O que sua pele pede para rejuvenescer',
  },
  {
    id: 'avaliacao',
    label: 'Avaliação geral',
    tema: 'avaliação de pele e rotina de cuidados',
    defaultTitle: 'Como está a saúde da sua pele hoje',
  },
]
