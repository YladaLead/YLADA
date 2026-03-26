/**
 * Exemplo no lugar do cliente final (quem compra ou contrata). Tom neutro; o vendedor vê como essa pessoa responderia.
 */

export type SellerDemoNicho =
  | 'catalogo_revenda'
  | 'produto_direto'
  | 'servico'
  | 'digital'

export interface SellerDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface SellerDemoNichoClienteConfig {
  value: SellerDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: SellerDemoPerguntaCliente[]
}

const NICHOS: SellerDemoNichoClienteConfig[] = [
  {
    value: 'catalogo_revenda',
    label: 'Muitas opções: portfólio amplo ou várias linhas',
    tituloQuiz: 'Muita opção na oferta e a pessoa trava antes de escolher?',
    subtitulo: 'Exemplo imparcial: o cliente chega mais organizado — você encaixa no que realmente vende.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que descreve melhor a pessoa neste momento?',
        opcoes: [
          { label: 'Quer comparar opções antes de decidir', valor: 0 },
          { label: 'Já tem uma ideia, mas tem dúvidas', valor: 1 },
          { label: 'Está começando do zero', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que mais pesa na decisão dela?',
        opcoes: [
          { label: 'Preço ou condição de pagamento', valor: 0 },
          { label: 'Confiar que é o produto certo', valor: 1 },
          { label: 'Prazo, entrega ou troca', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Como prefere continuar com você?',
        opcoes: [
          { label: 'Tirar dúvidas no WhatsApp', valor: 0 },
          { label: 'Receber uma sugestão objetiva', valor: 1 },
          { label: 'Ver lista curta e decidir depois', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'Fechar pedido ou reserva', valor: 0 },
          { label: 'Experimentar ou ver ao vivo', valor: 1 },
          { label: 'Pensar com calma e retomar', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'produto_direto',
    label: 'Marca própria ou poucos produtos em foco',
    tituloQuiz: 'Poucos produtos e mesmo assim o primeiro contato vira aula?',
    subtitulo: 'Como o cliente organiza a cabeça antes de fechar com você.',
    perguntas: [
      {
        id: 'p1',
        texto: 'A pessoa já conhece o que você vende?',
        opcoes: [
          { label: 'Já viu de longe, quer detalhes', valor: 0 },
          { label: 'Ouviu falar, não sabe se serve', valor: 1 },
          { label: 'Chegou por indicação ou anúncio', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que ela quer resolver na prática?',
        opcoes: [
          { label: 'Resolver um problema específico', valor: 0 },
          { label: 'Substituir algo que já usa', valor: 1 },
          { label: 'Experimentar algo novo', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que pode travar a compra?',
        opcoes: [
          { label: 'Dúvida se funciona pra ela', valor: 0 },
          { label: 'Comparar com outras opções', valor: 1 },
          { label: 'Tempo ou prioridade', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Melhor forma de seguir?',
        opcoes: [
          { label: 'Conversa rápida e fechar', valor: 0 },
          { label: 'Ver foto, vídeo ou prova social', valor: 1 },
          { label: 'Ver ao vivo ou retirar no local', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'servico',
    label: 'Serviço ou consulta (mensagem ou agenda)',
    tituloQuiz: 'Bateu um papo bom e ficou na dúvida do próximo passo?',
    subtitulo: 'Exemplo na pele de quem contrata: da dúvida a marcar ou decidir, sem enrolação.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que você busca neste momento?',
        opcoes: [
          { label: 'Saber se isso é pra mim', valor: 0 },
          { label: 'Preço, horário ou vaga', valor: 1 },
          { label: 'Resolver algo mais urgente', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já passou por algo parecido antes?',
        opcoes: [
          { label: 'Nunca', valor: 0 },
          { label: 'Já fiz ou contratei algo parecido', valor: 1 },
          { label: 'Só estou olhando opções', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que precisa ficar claro antes de você decidir?',
        opcoes: [
          { label: 'Como funciona, passo a passo', valor: 0 },
          { label: 'Quanto tempo leva e o que está incluso', valor: 1 },
          { label: 'Se tem garantia ou acompanhamento depois', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como você gostaria de seguir?',
        opcoes: [
          { label: 'Marcar data e horário', valor: 0 },
          { label: 'Receber valor e condições por mensagem', valor: 1 },
          { label: 'Conversar mais um pouco antes', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'digital',
    label: 'Digital: curso, e-book, assinatura ou infoproduto',
    tituloQuiz: 'Clique no anúncio e some antes de concluir?',
    subtitulo: 'Exemplo: dúvidas comuns antes de fechar — você vê o que ajuda a destravar.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Onde você está na jornada?',
        opcoes: [
          { label: 'Só conheci, quero entender o que é', valor: 0 },
          { label: 'Já acompanhei conteúdo sobre isso', valor: 1 },
          { label: 'Quase fechei e travei no final', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que mais pesa pra você decidir?',
        opcoes: [
          { label: 'Se vou conseguir usar de verdade', valor: 0 },
          { label: 'Preço e como acesso funciona', valor: 1 },
          { label: 'Ter suporte ou grupo pra tirar dúvida', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que mais te segura?',
        opcoes: [
          { label: 'Falta de tempo', valor: 0 },
          { label: 'Medo de não ser o que preciso', valor: 1 },
          { label: 'Comprar ou pagar online', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere concluir?',
        opcoes: [
          { label: 'Link de pagamento', valor: 0 },
          { label: 'Tirar últimas dúvidas no WhatsApp', valor: 1 },
          { label: 'Teste ou amostra grátis antes', valor: 2 },
        ],
      },
    ],
  },
]

export const SELLER_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getSellerDemoClienteConfig(nicho: string | null | undefined): SellerDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}
