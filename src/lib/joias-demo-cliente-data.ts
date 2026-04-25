/**
 * Exemplo no lugar da cliente final (joias, semijoias, bijuterias). Tom neutro; a vendedora vê como essa pessoa responderia.
 */

/** Foco comercial no funil (após escolher linha: joia fina / semijoia / bijuteria). */
export type JoiasFunilFoco = 'marca_propria' | 'loja_online' | 'equipe_revenda' | 'iniciando'

/** @deprecated Use JoiasFunilFoco — mantido para imports existentes. */
export type JoiasDemoNicho = JoiasFunilFoco

export interface JoiasDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface JoiasDemoNichoClienteConfig {
  value: JoiasFunilFoco
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: JoiasDemoPerguntaCliente[]
}

const NICHOS: JoiasDemoNichoClienteConfig[] = [
  {
    value: 'semijoia',
    label: 'Semijoias',
    tituloQuiz: 'Cliente compara preço antes de ver estilo?',
    subtitulo: 'Organize a conversa antes do catálogo. Você encaixa no que realmente vende.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que descreve melhor a cliente neste momento?',
        opcoes: [
          { label: 'Quer comparar várias peças', valor: 0 },
          { label: 'Já tem um estilo em mente', valor: 1 },
          { label: 'Está descobrindo o que combina com ela', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que mais pesa na decisão dela?',
        opcoes: [
          { label: 'Preço ou parcelamento', valor: 0 },
          { label: 'Confiar na qualidade e garantia', valor: 1 },
          { label: 'Prazo, troca ou ajuste', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Como prefere continuar com você?',
        opcoes: [
          { label: 'Tirar dúvidas no WhatsApp', valor: 0 },
          { label: 'Receber sugestões por ocasião', valor: 1 },
          { label: 'Ver poucas opções e decidir', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'Fechar pedido ou reserva', valor: 0 },
          { label: 'Experimentar ou ver ao vivo', valor: 1 },
          { label: 'Pensar e retomar depois', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'bijuteria',
    label: 'Bijuterias',
    tituloQuiz: 'Muito volume barato e a conversa vira só preço?',
    subtitulo: 'Cliente mais clara antes do primeiro contato.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que ela busca primeiro?',
        opcoes: [
          { label: 'Tendência e troca frequente', valor: 0 },
          { label: 'Peça para evento ou presente', valor: 1 },
          { label: 'Montar kit ou conjunto', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Sensibilidade a preço?',
        opcoes: [
          { label: 'Muito — compara com marketplace', valor: 0 },
          { label: 'Média — quer custo-benefício', valor: 1 },
          { label: 'Baixa — prioriza estilo', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Canal preferido para fechar?',
        opcoes: [
          { label: 'WhatsApp com fotos', valor: 0 },
          { label: 'Loja ou prova presencial', valor: 1 },
          { label: 'Compra direta no link', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'Lista curta personalizada', valor: 0 },
          { label: 'Indicação por ocasião', valor: 1 },
          { label: 'Orçamento com prazo', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'marca_propria',
    label: 'Marca própria',
    tituloQuiz: 'Cliente não entende por que pagar mais que genérico?',
    subtitulo: 'Valor de marca antes do preço.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Ela já conhece sua marca?',
        opcoes: [
          { label: 'Primeiro contato', valor: 0 },
          { label: 'Já viu nas redes', valor: 1 },
          { label: 'Indicação de alguém', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que precisa entender melhor?',
        opcoes: [
          { label: 'História e diferencial', valor: 0 },
          { label: 'Materiais e cuidados', valor: 1 },
          { label: 'Coleção e lançamentos', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Como prefere ser conduzida?',
        opcoes: [
          { label: 'Conversa consultiva', valor: 0 },
          { label: 'Conteúdo e depoimentos', valor: 1 },
          { label: 'Proposta objetiva', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'Pedido com identidade da marca', valor: 0 },
          { label: 'Newsletter ou grupo VIP', valor: 1 },
          { label: 'Agendar call ou visita', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'loja_online',
    label: 'Loja online / vitrine digital',
    tituloQuiz: 'Carrinho abandona ou some no direct?',
    subtitulo: 'Clareza de intenção antes do checkout.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Onde ela está na jornada?',
        opcoes: [
          { label: 'Navegando sem pressa', valor: 0 },
          { label: 'Quer uma peça específica', valor: 1 },
          { label: 'Comparando lojas', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que trava a compra?',
        opcoes: [
          { label: 'Frete ou prazo', valor: 0 },
          { label: 'Medo de tamanho ou troca', valor: 1 },
          { label: 'Dúvida se combina com ela', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Suporte desejado?',
        opcoes: [
          { label: 'Chat ou WhatsApp rápido', valor: 0 },
          { label: 'Guia de medidas / estilo', valor: 1 },
          { label: 'Vídeo ou prova virtual', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'Finalizar pedido', valor: 0 },
          { label: 'Receber link de pagamento', valor: 1 },
          { label: 'Salvar favoritos e voltar', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'equipe_revenda',
    label: 'Equipe / revendedoras',
    tituloQuiz: 'Revendedora traz lead frio e você explica tudo de novo?',
    subtitulo: 'Fluxo que a equipe replica.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Quem está no primeiro contato?',
        opcoes: [
          { label: 'Cliente final da revendedora', valor: 0 },
          { label: 'Revendedora pedindo suporte', valor: 1 },
          { label: 'Líder buscando material', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que falta padronizar?',
        opcoes: [
          { label: 'Argumento de valor', valor: 0 },
          { label: 'Perguntas antes do preço', valor: 1 },
          { label: 'Follow-up após orçamento', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Canal principal da equipe?',
        opcoes: [
          { label: 'WhatsApp em grupo ou lista', valor: 0 },
          { label: 'Instagram de cada uma', valor: 1 },
          { label: 'Eventos e catálogo físico', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'Link modelo para copiar', valor: 0 },
          { label: 'Treino rápido em áudio', valor: 1 },
          { label: 'Script de 3 perguntas', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'iniciando',
    label: 'Estou começando',
    tituloQuiz: 'Primeira venda e a conversa some depois do “oi”?',
    subtitulo: 'Cliente mais segura para quem está no começo.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que ela quer descobrir?',
        opcoes: [
          { label: 'Se a peça combina com ela', valor: 0 },
          { label: 'Se o preço é justo', valor: 1 },
          { label: 'Se pode confiar em você', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Nível de urgência?',
        opcoes: [
          { label: 'Presente com data', valor: 0 },
          { label: 'Desejo, sem pressa', valor: 1 },
          { label: 'Só curiosidade', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp com fotos', valor: 0 },
          { label: 'Indicação de 1 a 3 peças', valor: 1 },
          { label: 'Agendar retorno', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'Pedido pequeno para testar', valor: 0 },
          { label: 'Lista de desejos', valor: 1 },
          { label: 'Indicação para amiga', valor: 2 },
        ],
      },
    ],
  },
]

export const JOIAS_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getJoiasDemoClienteConfig(
  nicho: string | null | undefined
): JoiasDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isJoiasDemoNicho(s: string): s is JoiasDemoNicho {
  return NICHOS.some((n) => n.value === s)
}
