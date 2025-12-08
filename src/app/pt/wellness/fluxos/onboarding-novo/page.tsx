'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import FluxoTemplate from '@/components/wellness/FluxoTemplate'

const fluxoOnboarding = {
  id: 'fluxo-onboarding-novo-distribuidor',
  titulo: 'Fluxo de Onboarding do Novo Distribuidor',
  descricao: 'Processo para levar o novo membro à ação em 24 horas, garantindo que ele comece com confiança e clareza.',
  objetivo: 'Onboardar o novo distribuidor de forma eficaz, garantindo que ele entenda os próximos passos e comece a agir rapidamente.',
  quandoUsar: 'Imediatamente após a pessoa decidir começar como distribuidor. Deve ser executado nas primeiras 24-48 horas.',
  passos: [
    {
      numero: 1,
      titulo: 'Parabéns e Boas-vindas',
      descricao: 'Celebrar a decisão e dar as boas-vindas.',
      scripts: [
        `Parabéns, [Nome]! 🎉

Que legal que você decidiu começar! Estou muito feliz e animado para te ajudar nessa jornada!

Você tomou uma decisão importante e eu vou estar aqui em cada passo para te apoiar.

Vamos começar? 💚`
      ],
      dicas: [
        'Celebre a decisão com entusiasmo',
        'Reafirme que vai ter suporte',
        'Crie conexão e confiança'
      ]
    },
    {
      numero: 2,
      titulo: 'Confirmar Pedido Inicial',
      descricao: 'Garantir que o pedido inicial foi feito.',
      scripts: [
        `Ótimo! Agora o primeiro passo é você fazer seu pedido inicial.

Você já escolheu qual kit você quer? Se ainda não, posso te mostrar as opções e te ajudar a escolher o que faz mais sentido pra você.

O importante é você começar com um kit que você vai usar e conhecer bem. 😊`
      ],
      dicas: [
        'Seja claro sobre o pedido inicial',
        'Ofereça ajuda para escolher o kit',
        'Enfatize que vai usar os produtos'
      ]
    },
    {
      numero: 3,
      titulo: 'Adicionar em Grupos de Treinamento',
      descricao: 'Incluir o novo distribuidor em grupos de apoio e treinamento.',
      scripts: [
        `Ótimo! Agora vou te adicionar em alguns grupos importantes:

1. Grupo de Treinamento - onde você vai aprender tudo sobre produtos e como trabalhar
2. Grupo de Apoio - onde você pode tirar dúvidas e trocar experiências
3. Grupo de Líderes - onde você vai ter acesso a materiais e estratégias

Vou te adicionar agora mesmo! 😊`
      ],
      dicas: [
        'Explique o que cada grupo oferece',
        'Adicione imediatamente',
        'Apresente no grupo'
      ]
    },
    {
      numero: 4,
      titulo: 'Enviar Materiais Iniciais',
      descricao: 'Enviar os materiais essenciais para começar.',
      scripts: [
        `Agora vou te enviar os materiais iniciais que você precisa:

1. Cartilha do Novo Distribuidor - tudo que você precisa saber
2. Guia de Produtos - informações sobre cada produto
3. Scripts Básicos - mensagens prontas para começar
4. Fluxo 2-5-10 - método diário de ação

Vou te enviar agora! Leia com calma e, se tiver dúvidas, me chama! 😊`
      ],
      dicas: [
        'Envie materiais essenciais primeiro',
        'Não sobrecarregue',
        'Explique o que cada material oferece'
      ]
    },
    {
      numero: 5,
      titulo: 'Primeira Ação (24 horas)',
      descricao: 'Garantir que o novo distribuidor faça sua primeira ação em 24 horas.',
      scripts: [
        `Ótimo! Agora, enquanto você espera seu kit chegar, que tal você começar a fazer sua primeira ação?

Você pode:
1. Listar 10 pessoas próximas que podem ter interesse
2. Enviar 2 convites leves usando os scripts que te enviei
3. Começar a usar o sistema e conhecer os materiais

Não precisa fazer tudo, só começar. O importante é você entrar em ação! 

Consegue fazer isso hoje? Se precisar de ajuda, me chama! 😊`
      ],
      dicas: [
        'Dê ações claras e simples',
        'Não sobrecarregue',
        'Encoraje a começar',
        'Ofereça suporte'
      ]
    }
  ],
  comandosNoel: [
    'NOEL, crie um plano de onboarding personalizado para [nome]',
    'NOEL, me dê scripts para a primeira conversa de onboarding com [nome]'
  ]
}

export default function FluxoOnboardingNovoPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <FluxoTemplate fluxo={fluxoOnboarding} />
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
