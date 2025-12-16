'use client'

import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import FluxoTemplate from '@/components/wellness/FluxoTemplate'

const fluxoRecrutamento = {
  id: 'fluxo-recrutamento-completo',
  titulo: 'Fluxo de Recrutamento Completo',
  descricao: 'Processo completo em 9 etapas para identificar, convidar, apresentar e fechar novos distribuidores.',
  objetivo: 'Recrutar novos distribuidores de forma profissional, sistemática e duplicável, seguindo as 9 etapas essenciais.',
  quandoUsar: 'Quando você identificou uma pessoa com perfil para ser distribuidor e quer conduzi-la através do processo completo de recrutamento.',
  passos: [
    {
      numero: 1,
      titulo: 'Identificação do Perfil',
      descricao: 'Reconhecer características que indicam potencial para ser distribuidor.',
      dicas: [
        'Pessoa interessada em bem-estar e saúde',
        'Tem tempo disponível (mesmo que pouco)',
        'Demonstra interesse em produtos',
        'Tem rede de contatos ou facilidade para se comunicar',
        'Busca renda extra ou crescimento profissional',
        'Já usa ou demonstrou interesse em usar os produtos'
      ]
    },
    {
      numero: 2,
      titulo: 'Convite Leve',
      descricao: 'Primeiro contato para apresentar a oportunidade de forma leve.',
      scripts: [
        `Oi [Nome]! 👋

Lembrei de você porque estou trabalhando com algo relacionado a bem-estar e acho que pode te interessar.

É uma forma de trabalhar com produtos que eu mesmo uso. Quer que eu te conte rapidinho? 😊`
      ],
      dicas: [
        'Use o Fluxo de Convite Leve como base',
        'Foque em "trabalho" ou "projeto", não em "negócio"',
        'Mencione que você mesmo participa',
        'Mantenha curto e sem pressão'
      ]
    },
    {
      numero: 3,
      titulo: 'Convite Direto',
      descricao: 'Se a pessoa demonstrou interesse, aprofundar a conversa.',
      scripts: [
        `Oi [Nome]! 😊

Que bom que você tem interesse! 

Basicamente, é trabalhar com produtos de bem-estar que você mesmo pode usar e indicar para outras pessoas.

Funciona assim: você usa os produtos, vê os resultados, e naturalmente acaba indicando para pessoas próximas. E quando alguém compra através de você, você ganha uma comissão.

Quer que eu te explique melhor como funciona?`
      ],
      dicas: [
        'Só use se a pessoa já demonstrou interesse',
        'Explique de forma simples e direta',
        'Mencione que ela pode usar os produtos',
        'Fale sobre comissão de forma natural',
        'Termine convidando para saber mais'
      ]
    },
    {
      numero: 4,
      titulo: 'Pré-Apresentação',
      descricao: 'Preparar a pessoa para a apresentação oficial.',
      scripts: [
        `Oi [Nome]! 😊

Que legal que você quer saber mais!

Vou te mostrar uma apresentação rápida que explica tudo direitinho: como funciona, os produtos, a oportunidade, e como começar.

São uns 15-20 minutos. Quando você conseguir assistir? Posso te enviar agora ou prefere agendar um horário?`
      ],
      dicas: [
        'Confirme o interesse antes de enviar',
        'Ofereça opção de assistir agora ou agendar',
        'Mencione o tempo aproximado',
        'Seja flexível com o horário',
        'Prepare o link da apresentação (HOM)'
      ]
    },
    {
      numero: 5,
      titulo: 'Apresentação (ao vivo ou gravada)',
      descricao: 'Enviar a apresentação oficial (HOM) e acompanhar.',
      scripts: [
        `Oi [Nome]! 😊

Aqui está a apresentação completa:

[LINK DA HOM]

Assista quando puder e depois me fala o que achou! 

Se tiver alguma dúvida durante a apresentação, pode me chamar. Estou à disposição! 💚`
      ],
      dicas: [
        'Envie o link da HOM (curta ou longa, conforme o caso)',
        'Peça feedback após assistir',
        'Esteja disponível para dúvidas',
        'Não pressione para assistir imediatamente',
        'Aguarde a pessoa assistir antes de fazer follow-up'
      ]
    },
    {
      numero: 6,
      titulo: 'Pós-Apresentação',
      descricao: 'Conversar após a pessoa assistir a apresentação.',
      scripts: [
        `Oi [Nome]! 😊

Conseguiu assistir a apresentação? O que você achou?

Tem alguma dúvida? Posso te ajudar a entender melhor qualquer parte! 💚`,

        `Olá [Nome]!

Tudo bem? Lembrei que você ia assistir a apresentação.

Conseguiu ver? O que achou? Se tiver dúvidas, estou aqui! 😊`
      ],
      dicas: [
        'Aguarde 1-2 dias após enviar antes de fazer follow-up',
        'Pergunte o que achou (feedback)',
        'Esteja aberto para dúvidas',
        'Não pressione para decidir',
        'Seja paciente e respeitoso'
      ]
    },
    {
      numero: 7,
      titulo: 'Tratamento de Objeções',
      descricao: 'Responder dúvidas e objeções de forma estruturada.',
      dicas: [
        'Use o Pacote de Objeções como referência',
        'Escute primeiro, depois responda',
        'Seja empático e compreensivo',
        'Não force, apenas esclareça',
        'Se não souber responder, peça ajuda ao NOEL ou seu líder',
        'Respeite o tempo da pessoa para decidir'
      ]
    },
    {
      numero: 8,
      titulo: 'Fechamento da Oportunidade',
      descricao: 'Ajudar a pessoa a tomar a decisão de começar.',
      scripts: [
        `Oi [Nome]! 😊

Entendi suas dúvidas e acho que faz sentido você pensar bem.

Só queria te dizer que, se você decidir começar, eu vou te ajudar em cada passo. Você não vai estar sozinho nisso.

E o legal é que você pode começar devagar, no seu ritmo, usando os produtos e indicando para pessoas próximas.

O que você acha? Quer que eu te mostre como começar?`,

        `Olá [Nome]!

Entendo que você quer pensar. Isso é super normal!

Só queria te dar uma informação: para começar, você precisa fazer um pedido inicial (kit de produtos). É um investimento inicial, mas você já começa usando os produtos e pode revender.

Se quiser, posso te mostrar os kits disponíveis e você escolhe o que faz mais sentido pra você. O que acha?`
      ],
      dicas: [
        'Não force a decisão',
        'Ofereça suporte e acompanhamento',
        'Mencione que pode começar devagar',
        'Explique o investimento inicial de forma clara',
        'Mostre os kits disponíveis',
        'Seja paciente e respeitoso'
      ]
    },
    {
      numero: 9,
      titulo: 'Onboarding do Novo Distribuidor',
      descricao: 'Acompanhar o novo distribuidor nas primeiras 24-48 horas.',
      scripts: [
        `Parabéns, [Nome]! 🎉

Que legal que você decidiu começar! Estou muito feliz!

Agora vou te ajudar a dar os primeiros passos:

1. Você já fez seu pedido inicial? Se sim, me avisa quando chegar!
2. Vou te adicionar em grupos de treinamento
3. Vou te enviar materiais para você começar a estudar
4. Vamos marcar uma conversa para eu te explicar os próximos passos

Por enquanto, comece usando os produtos e conhecendo eles. Depois a gente fala sobre como apresentar para outras pessoas.

Qualquer dúvida, me chama! Estou aqui pra te ajudar! 💚`
      ],
      dicas: [
        'Parabenize e celebre a decisão',
        'Seja claro sobre os próximos passos',
        'Ofereça suporte imediato',
        'Adicione em grupos de treinamento',
        'Envie materiais iniciais',
        'Marque uma conversa de onboarding',
        'Seja presente nas primeiras semanas'
      ]
    }
  ],
  comandosNoel: [
    'NOEL, me ajude a identificar o perfil de [nome] para recrutamento',
    'NOEL, personalize o convite direto para [nome] sobre a oportunidade',
    'NOEL, me dê scripts para tratar a objeção "[objeção específica]" de [nome]',
    'NOEL, crie um plano de onboarding para o novo distribuidor [nome]'
  ]
}

export default function FluxoRecrutamentoPage() {
  // Layout server-side já valida autenticação, perfil e assinatura
  return (
    
      
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <FluxoTemplate fluxo={fluxoRecrutamento} />
          </div>
        </ConditionalWellnessSidebar>
      
    
  )
}
