// Tipos para os Pilares do Método YLADA

export interface PilarSecao {
  id: string
  titulo: string
  conteudo: string // Placeholder por enquanto
  exercicios_relacionados?: string[] // IDs dos exercícios
  ferramentas_relacionadas?: string[] // IDs das ferramentas
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
  created_at?: string
  updated_at?: string
}

// Configuração estática dos 5 Pilares (será substituída por dados do banco depois)
export const pilaresConfig: Pilar[] = [
  {
    id: '1',
    numero: 1,
    nome: 'Filosofia YLADA',
    subtitulo: 'Clareza mental, posicionamento e direção',
    descricao_curta: 'A profissional que entende quem ela é, o valor que entrega e como se posiciona, se torna impossível de ser ignorada.',
    descricao_introducao: 'Dar clareza mental, posicionamento e direção. A profissional que entende quem ela é, o valor que entrega e como se posiciona, se torna impossível de ser ignorada.',
    secoes: [
      {
        id: 'o-que-e',
        titulo: 'O que é a Filosofia YLADA',
        conteudo: `A Filosofia YLADA é um conjunto de princípios que orienta a postura, o comportamento e a visão empresarial da nutricionista.

Ela ensina:

• como pensar
• como agir
• como se posicionar
• como comunicar valor
• como construir rotina e consistência

É o manual não escrito da profissão, agora organizado de forma aplicável.`,
        order_index: 1
      },
      {
        id: 'identidade',
        titulo: 'Identidade Profissional (Quem você é no mercado)',
        conteudo: `Nutricionistas que prosperam têm clareza de identidade.

Aqui, a usuária aprende a:

• definir quem ela é profissionalmente
• comunicar com firmeza e gentileza
• abandonar comportamentos que a sabotam
• assumir uma postura de liderança

A identidade define o público, o posicionamento e o nível de autoridade.`,
        order_index: 2
      },
      {
        id: 'postura',
        titulo: 'Postura & Posicionamento (Como você quer ser percebida)',
        conteudo: `Postura não é arrogância — é clareza.
Posicionamento não é marketing — é autoconsciência.

Nesta seção, a YLADA ensina:

• como ajustar a postura digital
• como responder mensagens com segurança
• como criar percepção de profissionalismo
• como se comunicar sem parecer insegura

A percepção que o mercado tem de você nasce aqui.`,
        order_index: 3
      },
      {
        id: 'metas',
        titulo: 'Metas Inteligentes para Nutris',
        conteudo: `A faculdade ensina nutrição, mas não ensina metas.
O YLADA ensina metas que funcionam para quem trabalha com pessoas.

Aqui, a usuária aprende a:

• definir metas práticas e reais
• criar metas de rotina e não só de resultado
• conectar metas ao estilo de vida e não ao medo
• evitar metas confusas impossíveis de sustentar

Metas claras geram ações claras.`,
        order_index: 4
      },
      {
        id: 'mentalidade',
        titulo: 'Mentalidade da Nutri-Empresária',
        conteudo: `Tudo muda quando a profissional entende que ela não vende consulta — ela entrega transformação.

Nesta seção, a usuária aprende:

• postura de responsabilidade e liderança
• como parar de pensar como técnica e começar a agir como solução
• como tomar decisões com critério
• como desenvolver visão de crescimento

É a transição da Nutri Tradicional → Nutri Empresária.`,
        order_index: 5
      },
      {
        id: 'rotina-minima',
        titulo: 'Rotina Mínima (O fundamento da consistência)',
        conteudo: `Rotina mínima é o ritual diário que mantém a nutricionista sempre em movimento, sem sobrecarga.

Nesta seção, ela aprende:

• como funciona a rotina mínima
• por que pequenos hábitos geram grandes resultados
• como aplicar diariamente em 5 a 10 minutos

Sem rotina, não existe método. Sem método, não existe crescimento.`,
        order_index: 6
      },
      {
        id: 'papel-metodo',
        titulo: 'O Papel do Método na Vida da Nutri',
        conteudo: `O YLADA devolve controle, clareza e direção.
Ele tira a profissional do improviso e a coloca no caminho da previsibilidade.

A filosofia explica:

• por que o método funciona
• como ele elimina ansiedade profissional
• como ele transforma prática clínica em carreira

É o coração do sistema.`,
        order_index: 7
      }
    ]
  },
  {
    id: '2',
    numero: 2,
    nome: 'Nutri-Empresária 2.0',
    subtitulo: 'De profissional que atende para profissional que lidera resultados',
    descricao_curta: 'Transformar a forma como a nutricionista opera no seu dia a dia. Dar clareza, autonomia e estrutura prática para que ela pare de trabalhar em modo reativo, ganhe controle da sua agenda, tenha processos simples e finalmente consiga crescer sem caos.',
    descricao_introducao: `O Pilar 2 é onde a nutricionista deixa de operar no improviso e passa a atuar com intenção, postura empresarial e processos claros. É neste pilar que ela se transforma de "profissional que atende" para profissional que lidera resultados, com rotina, organização e posicionamento.

A Nutri‑Empresária 2.0 entende que:

• ela é a marca
• ela é o sistema
• ela é a experiência
• ela define o padrão do seu atendimento e da sua carreira

Este pilar estabelece como ela deve agir todos os dias para ter consistência, agenda cheia e segurança profissional.`,
    secoes: [
      {
        id: 'transicao',
        titulo: 'A Transição: de Nutri Tradicional → Nutri‑Empresária',
        conteudo: `Aqui a profissional entende a diferença entre:

• trabalhar para sobreviver
• trabalhar para construir uma carreira

Ela aprende:

• por que muitos não conseguem crescer
• como abandonar o papel técnico e assumir o papel de líder
• como pensar como profissional que constrói valor, não apenas entrega serviço
• como se tornar referência aos olhos das pessoas

É o início da nova identidade.`,
        order_index: 1
      },
      {
        id: 'rotina-minima',
        titulo: 'Rotina Mínima da Nutri‑Empresária (A base da consistência)',
        conteudo: `Rotina mínima é o ritual diário YLADA que mantém tudo funcionando com leveza.
É simples. É possível. E é transformadora.

Aqui ela aprende:

• a lógica da rotina mínima
• por que 5–10 minutos mudam tudo
• como organizar seu dia sem sobrecarregar
• como transformar pequenas ações diárias em grandes resultados

Esta rotina sustenta o Método inteiro.`,
        order_index: 2
      },
      {
        id: 'organizacao',
        titulo: 'Organização Essencial (Digital e Física)',
        conteudo: `Organização é o que diferencia a Nutri que cresce da Nutri que se perde.

Nesta seção, a profissional descobre:

• como criar sua pasta YLADA
• como organizar materiais, scripts, ferramentas
• como definir o espaço mínimo de trabalho
• como evitar distrações
• como montar seu ambiente de performance

Organização gera clareza. Clareza gera ação. Ação gera resultado.`,
        order_index: 3
      },
      {
        id: 'prioridades',
        titulo: 'Prioridades e Foco (O que realmente importa)',
        conteudo: `O erro mais comum das nutricionistas é tentar fazer tudo ao mesmo tempo.
A Nutri‑Empresária aprende a fazer o que realmente importa.

Aqui ela descobre:

• como identificar prioridades
• como eliminar distrações camufladas de produtividade
• como decidir o que deve ser feito hoje, amanhã ou nunca
• como usar o GSAL para dar direção

Prioridade não é agenda cheia — é agenda consciente.`,
        order_index: 4
      },
      {
        id: 'sistemas',
        titulo: 'Sistemas Simples que Mantêm o Crescimento',
        conteudo: `A Nutri‑Empresária 2.0 não cresce por intensidade — cresce por consistência.

Nesta seção ela aprende:

• o que é um sistema dentro do YLADA
• como pensar em processos simples
• como criar micro‑sistemas (captação, atendimento, organização)
• como eliminar a sensação de estar sempre começando do zero

Sistema = paz mental. Sistema = previsibilidade. Sistema = crescimento.`,
        order_index: 5
      },
      {
        id: 'postura-presenca',
        titulo: 'O Papel da Rotina, da Postura e da Presença',
        conteudo: `A Nutri‑Empresária entende que seu resultado não depende apenas de técnica, mas de:

• como ela aparece
• como ela responde
• como ela se organiza
• como ela se comunica

Nesta seção ela aprende:

• o padrão de postura da Nutri‑Empresária
• como evitar mensagens inseguras
• como comunicar autoridade sem arrogância
• como manter constância mesmo em dias difíceis

Aqui nasce a profissional madura.`,
        order_index: 6
      },
      {
        id: 'implementacao',
        titulo: 'Implementando a Nutri‑Empresária na Vida Real',
        conteudo: `É aqui que a teoria vira prática.

Ela aprende:

• como colocar a rotina mínima em funcionamento
• como aplicar foco e prioridades
• como usar micro‑sistemas no dia a dia
• como lidar com dias ruins sem perder o ritmo
• como revisar e ajustar o próprio método

Esta seção prepara a profissional para a Semana 3 da Jornada (Encantamento e Conversão), quando a presença dela começa a gerar resultado real.`,
        order_index: 7
      }
    ]
  },
  {
    id: '3',
    numero: 3,
    nome: 'Captação com Ferramentas YLADA',
    subtitulo: 'Gerar leads diários de forma leve, consistente e estratégica',
    descricao_curta: 'Ensinar a nutricionista a construir atração diária, com estratégias simples que funcionam independentemente do número de seguidores. A profissional aprende a criar ferramentas que chamam atenção, usar frases que fazem as pessoas clicarem, distribuir sem timidez e organizar leads para priorizar quem está mais quente.',
    descricao_introducao: `O Pilar 3 ensina a nutricionista a gerar leads diários, de forma leve, consistente e estratégica, usando ferramentas simples, CTAs inteligentes, distribuição e organização. É aqui que a Nutri deixa de depender de algoritmo, sorte ou indicações ocasionais — e passa a criar fluxo constante de oportunidades.

A Captação YLADA tem 3 pilares centrais:

• Ferramentas que resolvem microproblemas
• CTAs que despertam curiosidade
• Distribuição diária sem esforço excessivo

Quando essas peças se encaixam, a Nutri entra no estado de "movimento", essencial para gerar clientes todos os dias.`,
    secoes: [
      {
        id: 'ferramentas',
        titulo: 'Ferramentas de Captação (O Motor do Movimento)',
        conteudo: `Ferramentas são o coração da captação YLADA. Elas não precisam ser complexas — precisam ser úteis.

Nesta seção, a profissional aprende:

• tipos de ferramentas que mais funcionam (checklists, testes, guias simples)
• como escolher sua primeira ferramenta
• como personalizar com sua identidade
• onde hospedar e como compartilhar

Ferramentas bem feitas abrem conversas automaticamente.`,
        order_index: 1
      },
      {
        id: 'ctas',
        titulo: 'Criação de CTAs (Frases que fazem pessoas clicarem)',
        conteudo: `A CTA é a "chamada" que move a pessoa do interesse para a ação.

A Nutri aprende:

• como escrever frases curtas que despertam curiosidade
• como evitar CTAs genéricas que não convertem
• como criar variações semanais
• como conectar CTA → ferramenta → conversa

Uma boa CTA é simples, clara e irresistível.`,
        order_index: 2
      },
      {
        id: 'distribuicao',
        titulo: 'Distribuição 10–10–10 (A Fórmula da Alcance Diário)',
        conteudo: `Distribuir é tão importante quanto criar.

Nesta seção, a profissional aprende:

• o método oficial de distribuição YLADA
• como alcançar novas pessoas todos os dias
• como organizar o envio em listas e grupos
• como crescer sem depender de anúncios

Distribuição diária = leads diários.`,
        order_index: 3
      },
      {
        id: 'story',
        titulo: 'Story de Captação (Conteúdo que gera clique, não curtida)',
        conteudo: `Stories são um dos maiores motores de captação.

A Nutri aprende:

• o modelo de story que realmente funciona
• como fazer stories simples, sem estética exagerada
• como inserir CTA de forma natural
• como medir o que gerou mais resposta

Story não vende pela beleza — vende pela clareza.`,
        order_index: 4
      },
      {
        id: 'objecoes',
        titulo: 'Objeções Inteligentes (Transformando dúvidas em oportunidades)',
        conteudo: `Objeções são parte natural do processo.

Aqui a profissional aprende:

• como interpretar objeções
• como responder de forma leve e segura
• frases‑curinga para usar no dia a dia
• como não perder leads por insegurança

Objeções bem respondidas viram clientes.`,
        order_index: 5
      },
      {
        id: 'gestao-leads',
        titulo: 'Gestão de Leads YLADA (Organização que gera conversões)',
        conteudo: `Leads precisam ser organizados para virar clientes.

Nesta seção, ela aprende:

• como separar leads quentes, mornos e frios
• como priorizar quem responde
• como registrar interesse
• como planejar retornos estratégicos

Lead organizado = dinheiro organizado.`,
        order_index: 6
      },
      {
        id: 'implementacao-captacao',
        titulo: 'Implementação da Semana de Captação',
        conteudo: `Nesta parte a nutricionista aprende a:

• montar sua semana de captação
• escolher suas ferramentas principais
• definir CTA da semana
• distribuir diariamente sem cansar
• revisar diariamente o movimento

A intenção aqui é criar constância.`,
        order_index: 7
      }
    ]
  },
  {
    id: '4',
    numero: 4,
    nome: 'Atendimento que Encanta',
    subtitulo: 'Conexão, conversão e fidelização',
    descricao_curta: 'Ensinar a nutricionista a dominar as quatro etapas da conversão natural: primeiro contato que cria conexão, atendimento que orienta sem pressionar, pós-atendimento que fideliza, e indicações e encantamentos que multiplicam oportunidades.',
    descricao_introducao: `O Pilar 4 é o coração da conversão dentro do Método YLADA. É aqui que a nutricionista aprende a transformar conversas em conexões reais, conexões em agendamentos, e agendamentos em clientes fiéis — tudo com leveza, humanidade e método.

O atendimento YLADA não é técnico. É emocional + estratégico. Ele faz a pessoa sentir:

• segurança
• clareza
• acolhimento
• profissionalismo
• e vontade de continuar

Este pilar é responsável por construir uma experiência tão boa, que o cliente não quer ir embora.`,
    secoes: [
      {
        id: 'primeiro-contato',
        titulo: 'Primeiro Contato YLADA (Abertura que Conecta)',
        conteudo: `O primeiro contato define todo o restante. Nesta seção, a profissional aprende:

• como iniciar conversas de forma acolhedora
• frases que geram conexão imediata
• como evitar respostas frias que afastam o lead
• como mostrar interesse sem parecer vendedora

Princípio YLADA: "Quem conecta, converte."`,
        order_index: 1
      },
      {
        id: 'script',
        titulo: 'Script Oficial de Atendimento (A Conversa que Conduz)',
        conteudo: `A nutricionista descobre o script que torna o atendimento mais leve e natural. Ela aprende:

• como identificar a dor principal da pessoa
• como conduzir sem pressionar
• como usar perguntas estratégicas
• como criar desejo genuíno pelo atendimento

Script não é rigidez. Script é um mapa.`,
        order_index: 2
      },
      {
        id: 'pos-atendimento',
        titulo: 'Pós-Atendimento que Fideliza (Onde a Magia Acontece)',
        conteudo: `A maioria das nutricionistas perde clientes depois da conversa. Aqui, ela aprende o ritual YLADA de fidelização:

• mensagem de cuidado
• lembrete estratégico
• reforço de valor
• acompanhamento leve
• criação do vínculo emocional

Clientes fiéis surgem do pós-atendimento — não do atendimento.`,
        order_index: 3
      },
      {
        id: 'momento-certo',
        titulo: 'Momento Certo de Convidar para Agendar',
        conteudo: `Conversão não é sobre empurrar — é sobre percepção do timing.

Nesta seção, ela aprende:

• identificar quando o lead está pronto
• como fazer o convite sem parecer venda
• frases de convite natural
• como evitar ansiedade na hora de convidar

"When você guia, o cliente diz sim com leveza."`,
        order_index: 4
      },
      {
        id: 'indicacoes',
        titulo: 'Indicações YLADA (O Sistema de Crescimento Orgânico)',
        conteudo: `Indicação não é milagre. É método.

Aqui, a nutricionista aprende:

• como pedir indicações com confiança
• quando pedir para não parecer forçada
• mensagens prontas para pedir indicações
• como organizar respostas

Indicação é o maior sinal de confiança que existe.`,
        order_index: 5
      },
      {
        id: 'encantamentos',
        titulo: 'Pequenos Encantamentos (Detalhes que Criam Memória)',
        conteudo: `Pequenos gestos criam grandes percepções. Nesta seção, ela descobre:

• como encantar sem gastar nada
• como surpreender através de pequenas atitudes
• mensagens curtas de impacto emocional
• como criar experiências memoráveis

Encantamento = retenção.`,
        order_index: 6
      },
      {
        id: 'implementacao-encantamento',
        titulo: 'Implementação da Semana de Encantamento',
        conteudo: `Nesta parte, a profissional aprende a:

• aplicar o script oficial
• encantar nos detalhes
• conduzir conversas reais
• fazer pós-atendimento estratégico
• pedir indicações naturalmente

Esta parte prepara completamente para a Semana 3 da Jornada.`,
        order_index: 7
      }
    ]
  },
  {
    id: '5',
    numero: 5,
    nome: 'GSAL & Crescimento',
    subtitulo: 'Gestão, organização, rotina e escala',
    descricao_curta: 'Transformar o crescimento da nutricionista em algo leve, organizado, sustentável, contínuo e previsível. E não algo caótico, por impulso ou por "sorte". Este pilar entrega o que toda profissional deseja: controle da própria carreira.',
    descricao_introducao: `O Pilar 5 é o fechamento do Método YLADA — o ponto onde tudo se conecta para criar rotina previsível, agenda organizada, crescimento contínuo e leveza profissional. É aqui que a nutricionista entende como manter o movimento sem perder energia, como crescer sem caos e como construir uma carreira estável.

O GSAL significa:

• G — Gestão (claridade sobre o que está acontecendo)
• S — Sistema (passos repetíveis que mantêm tudo fluindo)
• A — Agenda (previsibilidade e organização real)
• L — Leveza (crescimento sem exaustão)

O GSAL é o método que evita que a nutricionista volte ao improviso.`,
    secoes: [
      {
        id: 'fundamentos-gsal',
        titulo: 'Fundamentos do GSAL (A Nova Forma de Gerir Sua Rotina)',
        conteudo: `Aqui a nutricionista compreende que:

• crescer não é fazer mais; é fazer certo
• organização libera energia mental
• rotina previsível reduz ansiedade
• sistemas simples evitam sobrecarga

Ela aprende:

• o que é GSAL
• por que ele funciona
• como ele se relaciona com todos os outros pilares
• como iniciar o GSAL imediatamente

O GSAL é o antídoto oficial contra a correria.`,
        order_index: 1
      },
      {
        id: 'painel-prioridades',
        titulo: 'Painel de Prioridades YLADA (O Coração da Semana)',
        conteudo: `O painel de prioridades dá clareza sobre o que realmente precisa ser feito. Ele substitui a sensação de estar perdida por uma visão clara da semana.

Nesta seção, a profissional aprende:

• como montar seu painel semanal
• como definir 3 prioridades profissionais e 2 pessoais
• como revisar e ajustar ao longo da semana
• como manter foco mesmo com imprevistos

O painel é onde a semana nasce.`,
        order_index: 2
      },
      {
        id: 'organizacao-leads-gsal',
        titulo: 'Organização de Leads GSAL (Não Perder Oportunidades)',
        conteudo: `Leads desorganizados = dinheiro perdido.

Aqui, a nutricionista aprende:

• como dividir leads entre quentes, mornos e frios
• como identificar quem precisa de retorno imediato
• como criar lembretes (48h, 7 dias, 14 dias)
• como organizar tudo dentro do SAS

Lead organizado = conversão previsível.`,
        order_index: 3
      },
      {
        id: 'agenda-cheia',
        titulo: 'Agenda Cheia YLADA (Previsibilidade Real)',
        conteudo: `Agenda cheia não é lotar tudo. Agenda cheia é previsibilidade + constância.

Ela aprende:

• como criar blocos fixos de trabalho
• como organizar horários de captação, atendimento e GSAL
• como criar espaçamento inteligente
• como evitar exaustão

A agenda cheia YLADA é construída, não improvisada.`,
        order_index: 4
      },
      {
        id: 'checklist-gsal',
        titulo: 'Checklist GSAL (O Sistema que Mantém Tudo Fluindo)',
        conteudo: `O checklist GSAL é o mecanismo de manutenção diária e semanal.

Nesta seção, ela aprende:

• checklist diário (3–5 minutos)
• checklist semanal (10–15 minutos)
• como revisar o que ainda está travando
• como ajustar a rotina

Checklists garantem que o método continue funcionando.`,
        order_index: 5
      },
      {
        id: 'retencao',
        titulo: 'Retenção & Relacionamento (Crescimento Inteligente)',
        conteudo: `Crescer não é apenas vender — é manter.

Aqui, a profissional descobre:

• como criar relacionamento contínuo com clientes ativos
• como enviar mensagens de cuidado genuínas
• como acompanhar casos com estratégia
• como criar confiança de longo prazo

Retenção = crescimento silencioso, porém poderoso.`,
        order_index: 6
      },
      {
        id: 'crescimento-30-dias',
        titulo: 'Crescimento em 30 Dias (Plano Estratégico YLADA)',
        conteudo: `Nesta seção, a Nutri cria o seu plano de crescimento com base no que funciona.

Ela aprende:

• como definir metas reais para o próximo ciclo
• como escolher 3 ações de captação
• como escolher 2 ações de encantamento
• como escolher 1 foco principal de gestão
• como repetir o ciclo a cada 30 dias

Crescimento YLADA é repetição inteligente.`,
        order_index: 7
      }
    ]
  }
]

