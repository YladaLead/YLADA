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
    descricao_curta: 'A profissional que entende quem ela é, o que entrega de verdade e como se posiciona, se torna impossível de ser ignorada.',
    descricao_introducao: 'O que a faculdade não ensinou — a base que sustenta sua identidade profissional.',
    secoes: [
      {
        id: 'o-que-e-nutri-empresaria',
        titulo: 'O que é ser Nutri-Empresária',
        conteudo: `A profissional se posiciona como referência, não como prestadora.

É sobre comportamento, postura e clareza.

A Nutri-Empresária entende que:

• ela é a referência
• ela organiza tudo
• ela é a experiência
• ela define o padrão do seu atendimento e da sua carreira

Quando você se vê como Nutri-Empresária, tudo muda: como você fala, como você atende, como você se posiciona e como você cresce.`,
        order_index: 1
      },
      {
        id: 'fundamentos',
        titulo: 'Os 4 fundamentos da Filosofia YLADA',
        conteudo: `A Filosofia YLADA se baseia em 4 fundamentos que fazem toda a diferença:

🔹 Identidade

É saber quem você é como profissional. Quando você tem clareza sobre isso, fica fácil decidir quem você atende, como você fala e como você quer ser vista. Sem identidade clara, você fica perdida tentando agradar todo mundo.

🔹 Postura

É como você se mostra para o mundo. Não é sobre ser arrogante ou superior. É sobre ter segurança no que você sabe e no que você oferece. Quando você tem postura, as pessoas confiam em você naturalmente.

🔹 Estrutura

É ter um jeito certo de trabalhar que funciona no dia a dia. Não precisa ser complicado. Precisa ser simples e que você consiga fazer todo dia. Estrutura é o que evita que você viva apagando incêndio.

🔹 Consistência

É fazer todo dia, mesmo quando não está com vontade. Pequenas ações feitas com constância geram resultados grandes. É isso que separa quem cresce de quem fica parada no mesmo lugar.

Esses 4 fundamentos trabalham juntos. Quando você tem os quatro, você vira uma Nutri-Empresária de verdade.`,
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

Não é sobre trabalhar mais horas. É sobre trabalhar com um jeito certo.

Não é sobre fazer mais coisas. É sobre fazer as coisas certas.

Não é sobre correr atrás de clientes. É sobre criar uma rotina que faz clientes chegarem até você.

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
    descricao_introducao: `Sua rotina é o seu jeito certo de fazer.

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
        titulo: 'Os 3 momentos do dia da Nutri-Empresária',
        conteudo: `A rotina mínima da Nutri-Empresária se divide em 3 momentos essenciais:

🔹 Momento de Captação

Ações diárias para fazer clientes chegarem e atrair novas pessoas. Pode ser distribuir uma ferramenta, enviar um convite, fazer um story, iniciar conversas.

🔹 Momento de Atendimento

O tempo dedicado a atender clientes, responder mensagens, fazer acompanhamento, criar conexões reais.

🔹 Momento de Construção

Tempo para construir sua referência, estudar, usar o GSAL, organizar, planejar. É o investimento em você e no seu negócio.

Esses 3 momentos do seu dia trabalham juntos para criar um dia completo e produtivo, sem sobrecarga.`,
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
          'Salvar rotina'
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

Se você colocou muitas coisas, reduza. Rotina mínima é fazer o que importa, não fazer tudo.

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

Quando você se mostra, oportunidades aparecem.`,
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
        conteudo: `As ferramentas YLADA são o que faz a captação funcionar. Elas resolvem pequenos problemas e abrem conversas naturalmente.

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
        titulo: 'Convites que Funcionam',
        conteudo: `O jeito YLADA de convidar:

Clareza, ação simples, sem pressão.

Um bom convite não vende. Ele convida. Ele desperta curiosidade. Ele faz a pessoa querer saber mais.

Exemplos de convites YLADA:

• "Descubra seu perfil nutricional em 2 minutos"
• "Quer saber se você está no caminho certo?"
• "Teste grátis: como está sua rotina alimentar?"

O convite deve ser simples, claro e que desperte curiosidade.`,
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
        titulo: 'Organização de Pessoas Interessadas YLADA',
        conteudo: `Pessoas interessadas precisam ser organizadas para virar clientes.

A organização de pessoas interessadas YLADA ensina:

• como separar quem está muito interessada, quem está pensando, e quem ainda não decidiu
• como priorizar quem responde
• como registrar interesse
• como planejar retornos no momento certo

Pessoa interessada organizada vira cliente organizado.`,
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
    subtitulo: 'Atendimento não é conversa — é jeito certo de fazer.',
    descricao_curta: 'Ensinar a nutricionista a dominar as quatro partes da conversão natural: primeiro contato que cria conexão, atendimento que orienta sem pressionar, cuidado depois do atendimento que fideliza, e indicações e encantamentos que multiplicam oportunidades.',
    descricao_introducao: `Atendimento não é conversa — é jeito certo de fazer.`,
    secoes: [
      {
        id: 'o-que-e-atendimento-ylada',
        titulo: 'O que é um atendimento YLADA',
        conteudo: `Simples, leve, intencional e eficiente.

O atendimento YLADA não é técnico. É emocional e bem pensado.

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
        titulo: 'Como fazer um atendimento profissional',
        conteudo: `O atendimento YLADA se divide em 4 partes essenciais:

🔹 Acolhimento

O primeiro contato que cria conexão. Como você recebe a pessoa, como você inicia a conversa, como você mostra interesse genuíno.

🔹 Entendimento real

Como você identifica a dor principal, como você faz perguntas certas, como você demonstra que realmente entende o que a pessoa precisa.

🔹 Direcionamento

Como você conduz sem pressionar, como você orienta com clareza, como você faz a pessoa querer ser atendida por você.

🔹 Encerramento no momento certo

Como você fecha a conversa, como você faz o convite natural, como você cria expectativa positiva.

Essas 4 partes trabalham juntas para criar um atendimento completo e eficiente.`,
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
        titulo: 'Cuidado Depois do Atendimento YLADA',
        conteudo: `A maioria das nutricionistas perde clientes depois da conversa.

O cuidado depois do atendimento YLADA é onde a magia acontece:

• mensagem de cuidado
• lembrete no momento certo
• lembrar o que você ajudou
• acompanhamento leve
• criar confiança e proximidade

Clientes fiéis surgem do cuidado depois — não só da conversa.`,
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
    subtitulo: 'O jeito certo de lotar sua agenda.',
    descricao_curta: 'Transformar o crescimento da nutricionista em algo leve, organizado, sustentável, contínuo e previsível. E não algo caótico, por impulso ou por "sorte". Este pilar entrega o que toda profissional deseja: controle da própria carreira.',
    descricao_introducao: `O jeito certo de lotar sua agenda.

O GSAL é o jeito de organizar seu trabalho para que você saiba o que esperar. Quando você domina GSAL, sua agenda começa a encher naturalmente.`,
    secoes: [
      {
        id: 'explicacao-geral-gsal',
        titulo: 'Explicação geral do GSAL',
        conteudo: `O GSAL é o jeito de organizar seu trabalho para que você saiba o que esperar.

Organizar em 4 partes:

🔹 G — Gerar

Fazer oportunidades aparecerem todo dia. Fazer seu trabalho aparecer todo dia, criando novas chances de conversar.

🔹 S — Servir

Ajudar de verdade, de um jeito que aproxima. Não é trabalhar de graça — é ajudar de verdade antes de vender, aquilo que faz as pessoas confiarem em você.

🔹 A — Acompanhar

Transformar interesse em cliente. A maioria dos clientes aparece no acompanhamento — não na primeira conversa.

🔹 L — Lucrar

Organizar sua agenda para crescer. É organizar seu dia a dia para que tudo leve naturalmente a novos clientes.

Essas 4 partes trabalham juntas para criar um ciclo completo de crescimento.`,
        order_index: 1
      },
      {
        id: 'exercicio-gerar',
        titulo: 'Exercício G de Gerar',
        conteudo: `Fazer a primeira parte do GSAL: GERAR.

Gerar é fazer seu trabalho aparecer todo dia, criando novas chances de conversar.

Ações práticas:

• Escolher 1 ferramenta para se mostrar hoje
• Fazer 1 ação de distribuição
• Iniciar 5 novas conversas
• Anotar resultados aqui

Quem se mostra todo dia, cria oportunidades.`,
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
        conteudo: `Fazer o acompanhamento que realmente converte.

A maioria dos clientes aparece no acompanhamento — não na primeira conversa.

Ações práticas:

• Revisar pessoas muito interessadas dos últimos 7 dias
• Enviar mensagem de acompanhamento para 5 pessoas
• Anotar quem respondeu
• Marcar quem está mais próxima de virar cliente

Acompanhamento é profissionalismo, não insistência.`,
        order_index: 4,
        exercicios_relacionados: ['a-de-acompanhar']
      },
      {
        id: 'exercicio-lucrar',
        titulo: 'Exercício L de Lucrar',
        conteudo: `Criar uma organização da agenda que apoia seu crescimento.

Lucrar é organizar seu dia a dia para que tudo leve naturalmente a novos clientes.

Ações práticas:

• Definir horários fixos de atendimento
• Reservar horários de captação
• Definir agenda mínima da semana
• Salvar sua agenda oficial aqui

Lucrar é consequência de organizar.`,
        order_index: 5,
        exercicios_relacionados: ['l-de-lucrar', 'agenda-estrategica']
      }
    ],
    campo_anotacao: 'Qual parte do GSAL você quer fazer primeiro?'
  }
]

