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

// Configuração estática dos 5 Pilares (será substituída por dados do banco depois)
export const pilaresConfig: Pilar[] = [
  {
    id: '1',
    numero: 1,
    nome: 'Filosofia YLADA',
    subtitulo: 'O que a faculdade não ensinou — a base que sustenta sua identidade profissional.',
    descricao_curta: 'A profissional que entende quem ela é, o valor que entrega e como se posiciona, se torna impossível de ser ignorada.',
    descricao_introducao: 'O que a faculdade não ensinou — a base que sustenta sua identidade profissional.',
    secoes: [
      {
        id: 'o-que-e-nutri-empresaria',
        titulo: 'O que é ser Nutri-Empresária',
        conteudo: `A profissional age como marca, não como prestadora.

É sobre comportamento, postura e clareza.

A Nutri-Empresária entende que:

• ela é a marca
• ela é o sistema
• ela é a experiência
• ela define o padrão do seu atendimento e da sua carreira

Quando você se vê como Nutri-Empresária, tudo muda: como você fala, como você atende, como você se posiciona e como você cresce.`,
        order_index: 1
      },
      {
        id: 'fundamentos',
        titulo: 'Os 4 fundamentos da Filosofia YLADA',
        conteudo: `A Filosofia YLADA se sustenta em 4 fundamentos essenciais:

🔹 Identidade

Quem você é profissionalmente. Como você se vê e como quer ser vista. A identidade define o público, o posicionamento e o nível de autoridade.

🔹 Postura

Como você quer ser percebida. Postura não é arrogância — é clareza. Posicionamento não é marketing — é autoconsciência.

🔹 Estrutura

Como você organiza seu trabalho. Rotina mínima, processos simples, sistemas que mantêm tudo fluindo sem sobrecarga.

🔹 Consistência

A constância que transforma pequenas ações em grandes resultados. É fazer todos os dias, mesmo nos dias difíceis.

Esses 4 fundamentos trabalham juntos para criar a Nutri-Empresária completa.`,
        order_index: 2
      },
      {
        id: 'erro-silencioso',
        titulo: 'O erro silencioso da Nutri brasileira',
        conteudo: `A maioria das nutricionistas vive de improviso, sem estrutura, apagando incêndio.

A diferença entre Nutri Tradicional × Nutri-Empresária:

❌ Nutri Tradicional:
• Trabalha reativamente
• Sem rotina definida
• Sem processos claros
• Depende de sorte e indicações ocasionais
• Vive no modo "apagar incêndio"
• Agenda vazia ou lotada sem controle

✅ Nutri-Empresária:
• Trabalha com intenção
• Rotina mínima definida
• Processos simples e repetíveis
• Gera movimento diário
• Tem controle da própria agenda
• Crescimento previsível e sustentável

O erro silencioso é acreditar que técnica sozinha é suficiente. Técnica + método = transformação real.`,
        order_index: 3
      },
      {
        id: 'promessa',
        titulo: 'A promessa YLADA',
        conteudo: `"Menos corrida. Mais lucro. Mais identidade."

Essa é a promessa do Método YLADA.

Não é sobre trabalhar mais horas. É sobre trabalhar com método.

Não é sobre fazer mais coisas. É sobre fazer as coisas certas.

Não é sobre correr atrás de clientes. É sobre criar um sistema que traz clientes até você.

A promessa YLADA é transformar sua prática em uma carreira previsível, organizada e lucrativa — sem perder sua essência, sem perder sua humanidade, sem perder sua paixão pela nutrição.`,
        order_index: 4
      }
    ],
    campo_anotacao: 'O que mais fez sentido para você neste Pilar?'
  },
  {
    id: '2',
    numero: 2,
    nome: 'Rotina Mínima YLADA',
    subtitulo: 'Sua rotina é a sua estratégia.',
    descricao_curta: 'Transformar a forma como a nutricionista opera no seu dia a dia. Dar clareza, autonomia e estrutura prática para que ela pare de trabalhar em modo reativo, ganhe controle da sua agenda, tenha processos simples e finalmente consiga crescer sem caos.',
    descricao_introducao: `Sua rotina é a sua estratégia.

A rotina mínima mantém constância mesmo nos dias ruins. É o que diferencia a Nutri que cresce da Nutri que se perde.`,
    secoes: [
      {
        id: 'o-que-e-rotina-minima',
        titulo: 'O que é Rotina Mínima',
        conteudo: `Rotina mínima mantém constância mesmo nos dias ruins.

É o ritual diário que garante que você continue em movimento, mesmo quando não está motivada, mesmo quando está cansada, mesmo quando parece que nada está dando certo.

A rotina mínima não é sobre fazer muito. É sobre fazer o essencial, todos os dias, sem exceção.

Quando você tem uma rotina mínima definida, você nunca volta ao zero. Você sempre mantém o movimento, e o movimento gera oportunidades.`,
        order_index: 1
      },
      {
        id: 'tres-blocos-diarios',
        titulo: 'Os 3 blocos diários da Nutri-Empresária',
        conteudo: `A rotina mínima da Nutri-Empresária se divide em 3 blocos essenciais:

🔹 Bloco de Captação

Ações diárias para gerar movimento e atrair novas pessoas. Pode ser distribuir uma ferramenta, enviar um CTA, fazer um story, iniciar conversas.

🔹 Bloco de Atendimento

O tempo dedicado a atender clientes, responder mensagens, fazer follow-up, criar conexões reais.

🔹 Bloco de Construção

Tempo para construir marca, estudar, aplicar GSAL, organizar, planejar. É o investimento em você e no seu negócio.

Esses 3 blocos trabalham juntos para criar um dia completo e produtivo, sem sobrecarga.`,
        order_index: 2
      },
      {
        id: 'rotina-minima-parte-1',
        titulo: 'Rotina Mínima — Parte 1 (Dia 15)',
        conteudo: `No Dia 15 da Jornada, você começa a estruturar sua rotina mínima oficial.

Checklist:

☐ Definir horários fixos

Escolha horários fixos para cada bloco (Captação, Atendimento, Construção). Não precisa ser muitas horas — precisa ser consistente.

☐ Criar 1 ação obrigatória

Defina 1 ação mínima que você fará todos os dias, sem exceção. Pode ser distribuir 1 ferramenta, enviar 1 CTA, iniciar 3 conversas.

☐ Registrar rotina

Anote sua rotina oficial no app. Isso cria compromisso e clareza.

A rotina mínima começa pequena e cresce naturalmente.`,
        order_index: 3,
        checklist_items: [
          'Definir horários fixos',
          'Criar 1 ação obrigatória',
          'Registrar rotina'
        ]
      },
      {
        id: 'rotina-minima-parte-2',
        titulo: 'Rotina Mínima — Parte 2 (Dia 16)',
        conteudo: `No Dia 16, você revisa e ajusta sua rotina mínima.

Checklist:

☐ Revisar rotina

Olhe para o que você definiu no Dia 15. Está realista? Está aplicável? Está sustentável?

☐ Reduzir excessos

Se você colocou muitas coisas, reduza. Rotina mínima é sobre o essencial, não sobre fazer tudo.

☐ Confirmar rotina oficial

Depois de revisar e ajustar, confirme sua rotina oficial. Esta será sua base para os próximos dias.

A rotina mínima deve ser leve o suficiente para você fazer todos os dias, mas significativa o suficiente para gerar resultados.`,
        order_index: 4,
        checklist_items: [
          'Revisar rotina',
          'Reduzir excessos',
          'Confirmar rotina oficial'
        ]
      }
    ],
    campo_anotacao: 'Como será sua Rotina Mínima daqui para frente?'
  },
  {
    id: '3',
    numero: 3,
    nome: 'Captação YLADA (Gerar Movimento)',
    subtitulo: 'Como atrair pessoas todos os dias de forma leve e duplicável.',
    descricao_curta: 'Ensinar a nutricionista a construir atração diária, com estratégias simples que funcionam independentemente do número de seguidores. A profissional aprende a criar ferramentas que chamam atenção, usar frases que fazem as pessoas clicarem, distribuir sem timidez e organizar leads para priorizar quem está mais quente.',
    descricao_introducao: `Como atrair pessoas todos os dias de forma leve e duplicável.

Gerar movimento cria oportunidades.`,
    secoes: [
      {
        id: 'o-que-e-captacao',
        titulo: 'O que é Captação YLADA',
        conteudo: `Explicação resumida: "Gerar movimento cria oportunidades."

Captação YLADA não é sobre fazer anúncios caros ou ter milhares de seguidores. É sobre criar movimento diário, leve e consistente.

Quando você gera movimento, você cria oportunidades. E oportunidades viram leads. E leads viram clientes.`,
        order_index: 1
      },
      {
        id: 'ferramentas-captacao',
        titulo: 'Ferramentas de Captação',
        conteudo: `As ferramentas YLADA são o coração da captação. Elas resolvem microproblemas e abrem conversas automaticamente.

Lista de ferramentas disponíveis:

• Avaliações
• Quizzes
• Calculadoras
• Scripts
• Stories
• Lista de objeções

Cada ferramenta tem um propósito específico e pode ser personalizada com sua identidade.`,
        order_index: 2,
        exercicios_relacionados: [],
        ferramentas_relacionadas: ['avaliacoes', 'quizzes', 'calculadoras', 'scripts', 'stories', 'objecoes']
      },
      {
        id: 'ctas-inteligentes',
        titulo: 'CTAs Inteligentes',
        conteudo: `O formato YLADA de CTA:

Clareza → Ação simples → Zero pressão.

Uma boa CTA não vende. Ela convida. Ela desperta curiosidade. Ela faz a pessoa querer saber mais.

Exemplos de CTAs YLADA:

• "Descubra seu perfil nutricional em 2 minutos"
• "Quer saber se você está no caminho certo?"
• "Teste grátis: como está sua rotina alimentar?"

A CTA deve ser simples, clara e irresistível.`,
        order_index: 3
      },
      {
        id: 'metodo-10-10-10',
        titulo: 'Método de Distribuição 10–10–10',
        conteudo: `O método 10–10–10 é a fórmula oficial de distribuição YLADA.

Funciona assim:

• 10 pessoas por WhatsApp
• 10 pessoas por Instagram
• 10 pessoas por outras plataformas

Total: 30 pessoas por dia, sem esforço excessivo.

Este método garante que você alcance novas pessoas todos os dias, de forma leve e consistente.`,
        order_index: 4,
        exercicios_relacionados: ['distribuicao-10-10-10']
      },
      {
        id: 'gestao-leads-ylada',
        titulo: 'Gestão de Leads YLADA',
        conteudo: `Leads precisam ser organizados para virar clientes.

A gestão de leads YLADA ensina:

• como separar leads quentes, mornos e frios
• como priorizar quem responde
• como registrar interesse
• como planejar retornos estratégicos

Lead organizado = dinheiro organizado.`,
        order_index: 5,
        exercicios_relacionados: ['gestao-leads'],
        ferramentas_relacionadas: ['gestao-leads']
      }
    ],
    campo_anotacao: 'Qual ferramenta você vai usar esta semana?'
  },
  {
    id: '4',
    numero: 4,
    nome: 'Atendimento que Encanta',
    subtitulo: 'Atendimento não é conversa — é estratégia.',
    descricao_curta: 'Ensinar a nutricionista a dominar as quatro etapas da conversão natural: primeiro contato que cria conexão, atendimento que orienta sem pressionar, pós-atendimento que fideliza, e indicações e encantamentos que multiplicam oportunidades.',
    descricao_introducao: `Atendimento não é conversa — é estratégia.`,
    secoes: [
      {
        id: 'o-que-e-atendimento-ylada',
        titulo: 'O que é um atendimento YLADA',
        conteudo: `Explicar: simples, leve, intencional e eficiente.

O atendimento YLADA não é técnico. É emocional + estratégico.

Ele faz a pessoa sentir:

• segurança
• clareza
• acolhimento
• profissionalismo
• e vontade de continuar

É sobre criar uma experiência tão boa, que o cliente não quer ir embora.`,
        order_index: 1
      },
      {
        id: 'estrutura-atendimento',
        titulo: 'Estrutura do atendimento profissional',
        conteudo: `O atendimento YLADA se divide em 4 blocos essenciais:

🔹 Acolhimento

O primeiro contato que cria conexão. Como você recebe a pessoa, como você inicia a conversa, como você mostra interesse genuíno.

🔹 Entendimento real

Como você identifica a dor principal, como você faz perguntas estratégicas, como você demonstra que realmente entende o que a pessoa precisa.

🔹 Direcionamento

Como você conduz sem pressionar, como você orienta com clareza, como você cria desejo genuíno pelo atendimento.

🔹 Encerramento estratégico

Como você fecha a conversa, como você faz o convite natural, como você cria expectativa positiva.

Esses 4 blocos trabalham juntos para criar um atendimento completo e eficiente.`,
        order_index: 2
      },
      {
        id: 'perguntas-poder',
        titulo: 'Perguntas-Poder YLADA',
        conteudo: `As perguntas-poder são aquelas que realmente fazem a diferença no atendimento.

Elas não são perguntas técnicas. São perguntas que:

• criam conexão emocional
• identificam necessidades reais
• geram reflexão
• abrem espaço para você orientar

Exemplos de perguntas-poder:

• "O que mais te incomoda na sua relação com a comida?"
• "Como você se sente quando pensa em mudar seus hábitos?"
• "O que seria diferente na sua vida se você tivesse mais energia?"

Perguntas-poder transformam conversas em conexões.`,
        order_index: 3
      },
      {
        id: 'pos-atendimento-ylada',
        titulo: 'Pós-atendimento YLADA',
        conteudo: `A maioria das nutricionistas perde clientes depois da conversa.

O pós-atendimento YLADA é onde a magia acontece:

• mensagem de cuidado
• lembrete estratégico
• reforço de valor
• acompanhamento leve
• criação do vínculo emocional

Clientes fiéis surgem do pós-atendimento — não do atendimento.`,
        order_index: 4,
        exercicios_relacionados: ['roteiro-atendimento'],
        ferramentas_relacionadas: ['modelo-pos-atendimento']
      }
    ],
    campo_anotacao: 'Como você quer que o cliente se sinta após falar com você?'
  },
  {
    id: '5',
    numero: 5,
    nome: 'GSAL: Gerar, Servir, Acompanhar, Lucrar',
    subtitulo: 'O método definitivo para lotar agendas.',
    descricao_curta: 'Transformar o crescimento da nutricionista em algo leve, organizado, sustentável, contínuo e previsível. E não algo caótico, por impulso ou por "sorte". Este pilar entrega o que toda profissional deseja: controle da própria carreira.',
    descricao_introducao: `O método definitivo para lotar agendas.

O GSAL é a estrutura que transforma seu trabalho em algo previsível. Quando você domina GSAL, sua agenda começa a encher naturalmente.`,
    secoes: [
      {
        id: 'explicacao-geral-gsal',
        titulo: 'Explicação geral do GSAL',
        conteudo: `O GSAL é a estrutura que transforma seu trabalho em algo previsível.

Criar 4 caixas:

🔹 G — Gerar

Criar fluxo contínuo de oportunidades. Colocar seu trabalho em movimento diário, criando novas oportunidades de contato.

🔹 S — Servir

Entregar valor que conecta. Não é trabalhar de graça — é entregar clareza e ajuda real, aquilo que aproxima as pessoas do seu método.

🔹 A — Acompanhar

Transformar interesses em fechamentos. A maioria das vendas acontece no acompanhamento — não na primeira conversa.

🔹 L — Lucrar

Estruturar sua agenda para crescer. É estruturar o fluxo de trabalho para que tudo leve naturalmente a fechamentos.

Essas 4 etapas trabalham juntas para criar um ciclo completo de crescimento.`,
        order_index: 1
      },
      {
        id: 'exercicio-gerar',
        titulo: 'Exercício G de Gerar',
        conteudo: `Aplicar a primeira etapa do GSAL: GERAR.

Gerar é colocar seu trabalho em movimento diário, criando novas oportunidades de contato.

Ações práticas:

• Escolher 1 ferramenta para gerar movimento hoje
• Executar 1 ação de distribuição
• Iniciar 5 novas conversas
• Registrar resultados no app

Quem gera movimento, cria oportunidades.`,
        order_index: 2,
        exercicios_relacionados: ['g-de-gerar']
      },
      {
        id: 'exercicio-servir',
        titulo: 'Exercício S de Servir',
        conteudo: `Dominar a etapa SERVIR para criar conexão e confiança.

Servir não é trabalhar de graça — é entregar clareza e ajuda real, aquilo que aproxima as pessoas do seu método.

Ações práticas:

• Escolher 1 microconteúdo de valor
• Enviar para 3 pessoas específicas
• Responder dúvidas com intenção
• Registrar impacto no app

Quando você serve, você se torna inesquecível.`,
        order_index: 3,
        exercicios_relacionados: ['s-de-servir']
      },
      {
        id: 'exercicio-acompanhar',
        titulo: 'Exercício A de Acompanhar',
        conteudo: `Dominar o acompanhamento que realmente converte.

A maioria das vendas acontece no acompanhamento — não na primeira conversa.

Ações práticas:

• Revisar leads quentes dos últimos 7 dias
• Enviar mensagem de acompanhamento para 5 pessoas
• Registrar quem respondeu
• Marcar quem avançou

Acompanhamento é profissionalismo, não insistência.`,
        order_index: 4,
        exercicios_relacionados: ['a-de-acompanhar']
      },
      {
        id: 'exercicio-lucrar',
        titulo: 'Exercício L de Lucrar',
        conteudo: `Criar uma estrutura de agenda que apoia seu crescimento.

Lucrar é estruturar o fluxo de trabalho para que tudo leve naturalmente a fechamentos.

Ações práticas:

• Definir horários fixos de atendimento
• Reservar horários de captação
• Ajustar agenda mínima semanal
• Registrar agenda oficial no app

Lucrar é consequência de estruturar.`,
        order_index: 5,
        exercicios_relacionados: ['l-de-lucrar', 'agenda-estrategica']
      }
    ],
    campo_anotacao: 'Qual etapa do GSAL você quer dominar primeiro?'
  }
]

