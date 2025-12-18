// Tipos para os Pilares do Método YLADA

export interface PilarSecao {
  id: string
  titulo: string
  conteudo: string
  exercicios_relacionados?: string[] // IDs dos exercícios
  ferramentas_relacionadas?: string[] // IDs das ferramentas
  checklist_items?: string[] // Itens de checklist quando aplicável
  order_index: number
}

export interface Pilar {
  id: string
  numero: number
  nome: string
  subtitulo: string
  descricao_curta: string
  descricao_introducao: string
  secoes: PilarSecao[]
  campo_anotacao?: string // Pergunta para o campo de anotação do Pilar
  created_at?: string
  updated_at?: string
}

// Configuração estática dos 5 Pilares - Versão simplificada e emocional
// A LYA aplica esses pilares na Jornada. Aqui é só para entender a filosofia.
export const pilaresConfig: Pilar[] = [
  {
    id: '1',
    numero: 1,
    nome: 'Filosofia YLADA',
    subtitulo: 'Você não é só nutricionista. Você é Nutri-Empresária.',
    descricao_curta: 'Quem você é determina como você cresce. Este pilar é sobre identidade, postura e a base que sustenta tudo.',
    descricao_introducao: `Você estudou anos para se formar. Passou por provas, estágios, TCC. Conquistou seu CRN.

Mas ninguém te ensinou a ser vista, a ser procurada, a ter uma agenda cheia de pessoas que confiam em você.

A Filosofia YLADA é sobre isso: você não precisa ser outra pessoa. Precisa ser você — com clareza, postura e um jeito certo de se mostrar.

Quando você entende quem você é como profissional, tudo muda. Como você fala, como você atende, como você se posiciona.

Você para de se sentir perdida. Para de se comparar. Para de duvidar.

E começa a agir como a referência que você já é — só ainda não tinha percebido.`,
    secoes: [
      {
        id: 'essencia',
        titulo: 'A essência deste pilar',
        conteudo: `A Nutri-Empresária não é sobre ser perfeita. É sobre ter clareza.

Clareza de quem você é.
Clareza do que você entrega.
Clareza de como você quer ser vista.

Quando você tem isso, as pessoas sentem. Elas confiam. Elas voltam. Elas indicam.

Você não precisa gritar para ser ouvida. Precisa se posicionar com segurança.

E isso começa aqui: entendendo que você já tem o que precisa. Só falta organizar.`,
        order_index: 1
      },
      {
        id: 'voce-vai-conseguir',
        titulo: 'Por que você vai conseguir (com a LYA)',
        conteudo: `Talvez você esteja pensando: "Será que isso funciona pra mim?"

A resposta é sim.

Não porque é fácil. Mas porque é simples. E porque você não está sozinha.

Milhares de nutricionistas já passaram pelo mesmo que você está sentindo agora. A mesma dúvida, o mesmo medo, a mesma vontade de dar certo.

E elas conseguiram. Não porque eram especiais. Porque seguiram um método — com a LYA guiando cada passo.

A LYA vai te mostrar o que fazer, quando fazer, e como fazer. Você só precisa confiar e seguir.

Confia no processo. Confia em você. Confia na LYA.`,
        order_index: 2
      }
    ],
    campo_anotacao: 'O que você sentiu lendo isso? Pode escrever aqui.'
  },
  {
    id: '2',
    numero: 2,
    nome: 'Rotina Mínima',
    subtitulo: 'Pequenas ações todo dia mudam tudo.',
    descricao_curta: 'Não é sobre fazer muito. É sobre fazer o certo, todo dia, sem se sobrecarregar.',
    descricao_introducao: `Você já tentou fazer mil coisas ao mesmo tempo e acabou não fazendo nada direito?

Já se sentiu exausta, trabalhando muito mas sem ver resultado?

A Rotina Mínima YLADA existe por causa disso.

Não é sobre lotar sua agenda de tarefas. É sobre ter poucas ações — mas as certas — que você consegue fazer todo dia.

Mesmo nos dias ruins. Mesmo quando não está motivada. Mesmo quando parece que nada está funcionando.

É isso que separa quem cresce de quem fica parada: consistência simples.`,
    secoes: [
      {
        id: 'essencia',
        titulo: 'A essência deste pilar',
        conteudo: `A rotina mínima é sua proteção contra o caos.

Quando você tem uma rotina mínima, você nunca volta ao zero. Você sempre mantém o movimento.

E movimento gera oportunidades.

Não precisa ser perfeita. Precisa ser constante.

3 momentos por dia:
• Um momento para atrair pessoas
• Um momento para atender
• Um momento para construir seu futuro

Só isso. Todo dia. Sem pressão de fazer tudo perfeito.

A LYA vai te ajudar a montar a sua. No seu ritmo, do seu jeito.`,
        order_index: 1
      },
      {
        id: 'voce-vai-conseguir',
        titulo: 'Por que você vai conseguir (com a LYA)',
        conteudo: `Você não precisa mudar sua vida inteira de uma vez.

Precisa de 15 minutos por dia. Às vezes menos.

A rotina mínima não é sobre fazer muito. É sobre nunca parar.

Quando você faz pouco, mas faz todo dia, os resultados aparecem. É matemática, não mágica.

Com a LYA, você vai conseguir porque ela te lembra, te guia, te ajusta. Você não precisa pensar em tudo sozinha.

A LYA vai te ajudar a montar sua rotina. No seu ritmo, do seu jeito.`,
        order_index: 2
      }
    ],
    campo_anotacao: 'Como você se sente sobre criar uma rotina simples?'
  },
  {
    id: '3',
    numero: 3,
    nome: 'Captação',
    subtitulo: 'Atrair pessoas sem parecer vendedora.',
    descricao_curta: 'Gerar movimento todo dia, de forma leve, para que pessoas certas cheguem até você.',
    descricao_introducao: `Você já se sentiu desconfortável tentando "vender" seu trabalho?

Já ficou sem saber o que postar, o que falar, como se mostrar sem parecer forçada?

A Captação YLADA resolve isso.

Não é sobre ser influencer. Não é sobre ter milhares de seguidores. Não é sobre fazer dancinhas ou aparecer todo dia nos stories.

É sobre uma coisa simples: gerar movimento.

Quando você se mostra — do seu jeito, com sua cara — as pessoas certas aparecem.`,
    secoes: [
      {
        id: 'essencia',
        titulo: 'A essência deste pilar',
        conteudo: `Captação é sobre criar oportunidades, não correr atrás de clientes.

Você não precisa implorar. Não precisa dar desconto. Não precisa se humilhar.

Você precisa de ferramentas que trabalham por você.

Um quiz que desperta curiosidade. Uma avaliação que ajuda de verdade. Um convite que faz a pessoa querer saber mais.

Quando você distribui valor, as pessoas vêm até você.

A LYA vai te mostrar exatamente como fazer isso, passo a passo.`,
        order_index: 1
      },
      {
        id: 'voce-vai-conseguir',
        titulo: 'Por que você vai conseguir (com a LYA)',
        conteudo: `Você não precisa ser extrovertida. Não precisa amar redes sociais.

Precisa de um método. E você tem. Precisa de uma guia. E você tem a LYA.

As ferramentas YLADA fazem o trabalho pesado. Você só distribui.

Muitas nutricionistas que tinham medo de aparecer hoje têm agenda cheia. Não porque viraram influencers. Porque aprenderam a gerar movimento do jeito certo — com a LYA mostrando o caminho.

A LYA vai te dizer qual ferramenta usar, quando postar, o que falar. Uma ação por dia. É assim que começa.`,
        order_index: 2
      }
    ],
    campo_anotacao: 'O que você sente quando pensa em se mostrar mais?'
  },
  {
    id: '4',
    numero: 4,
    nome: 'Atendimento que Encanta',
    subtitulo: 'Transformar conversas em clientes fiéis.',
    descricao_curta: 'Atender de um jeito que faz a pessoa querer ficar. Sem pressão, sem técnicas forçadas.',
    descricao_introducao: `Você já atendeu alguém que parecia super interessada... e depois sumiu?

Já se perguntou o que fez de errado? Por que a pessoa não fechou?

Na maioria das vezes, não é sobre o que você fez de errado. É sobre o que faltou fazer.

O Atendimento YLADA não é técnica de vendas. É sobre criar uma experiência tão boa que a pessoa não quer ir embora.

É sobre fazer ela se sentir ouvida, entendida, cuidada.`,
    secoes: [
      {
        id: 'essencia',
        titulo: 'A essência deste pilar',
        conteudo: `O atendimento não termina na conversa. Começa nela.

A maioria das nutricionistas perde clientes no "depois". Na mensagem que não enviou. No cuidado que não teve.

O Atendimento YLADA é sobre:
• Acolher de verdade
• Entender a dor real
• Orientar com clareza
• Cuidar depois

Quando você faz isso, a pessoa não some. Ela volta. E indica.

Não é manipulação. É profissionalismo com coração.`,
        order_index: 1
      },
      {
        id: 'voce-vai-conseguir',
        titulo: 'Por que você vai conseguir (com a LYA)',
        conteudo: `Você já sabe atender. Já sabe ouvir. Já sabe cuidar.

O que falta é um jeito organizado de fazer isso. E a LYA vai te dar exatamente isso.

Scripts simples. Perguntas certas. Momentos de cuidado. Tudo pronto pra você usar.

Não é sobre decorar falas. É sobre ter a LYA ao seu lado, te lembrando do que fazer em cada momento.

Quando você tem isso, atender fica leve. E os resultados aparecem.

Você vai encantar mais do que imagina. A LYA vai te mostrar como.`,
        order_index: 2
      }
    ],
    campo_anotacao: 'Como você quer que suas clientes se sintam depois de falar com você?'
  },
  {
    id: '5',
    numero: 5,
    nome: 'GSAL',
    subtitulo: 'Gerar, Servir, Acompanhar, Lucrar.',
    descricao_curta: 'O ciclo completo para ter uma agenda cheia de forma previsível e organizada.',
    descricao_introducao: `Você já se sentiu perdida sem saber o que fazer primeiro?

Já teve a sensação de que trabalha muito mas não vê dinheiro entrando?

O GSAL é a resposta.

É um ciclo simples que organiza tudo:

G — Gerar oportunidades todo dia
S — Servir de verdade, criando confiança
A — Acompanhar quem demonstrou interesse
L — Lucrar como consequência natural

Quando você segue esse ciclo, sua agenda enche. Sem desespero, sem correria.`,
    secoes: [
      {
        id: 'essencia',
        titulo: 'A essência deste pilar',
        conteudo: `O GSAL é o coração do Método YLADA.

Tudo que você faz cabe dentro dele:

• Postou uma ferramenta? É o G (Gerar)
• Respondeu uma dúvida com carinho? É o S (Servir)
• Mandou mensagem pra quem demonstrou interesse? É o A (Acompanhar)
• Fechou uma cliente? É o L (Lucrar)

Quando você entende o ciclo, para de se sentir perdida.

Você sabe o que fazer. Sabe por que está fazendo. E sabe que vai funcionar.`,
        order_index: 1
      },
      {
        id: 'voce-vai-conseguir',
        titulo: 'Por que você vai conseguir (com a LYA)',
        conteudo: `O GSAL não é complicado. É libertador. E com a LYA, fica ainda mais simples.

Você não precisa inventar nada. Só seguir o ciclo — e a LYA te mostra cada passo.

Gerar → Servir → Acompanhar → Lucrar → Repetir

Cada dia a LYA te guia pelo que fazer. E os resultados se acumulam.

Em semanas, você vai olhar pra trás e pensar: "Como eu vivia sem isso? Como eu vivia sem a LYA?"

Você está mais perto do que imagina. E a LYA está com você.`,
        order_index: 2
      }
    ],
    campo_anotacao: 'Qual parte do ciclo você sente mais dificuldade hoje?'
  }
]

