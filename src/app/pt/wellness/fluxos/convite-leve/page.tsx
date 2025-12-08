'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import FluxoTemplate from '@/components/wellness/FluxoTemplate'

const fluxoConviteLeve = {
  id: 'fluxo-convite-leve',
  titulo: 'Fluxo de Convite Leve',
  descricao: 'Mensagens curtas, elegantes e que não geram resistência. Ideal para destravar quem tem medo de convidar.',
  objetivo: 'Iniciar conversas de forma natural, sem pressão, focando em bem-estar e interesse genuíno.',
  quandoUsar: 'Quando você quer convidar alguém para conhecer produtos ou oportunidade, mas sem parecer "vendedor" ou insistente.',
  passos: [
    {
      numero: 1,
      titulo: 'Mensagem Inicial (Produto)',
      descricao: 'Abordagem leve focada em bem-estar e novidade.',
      scripts: [
        `Oi [Nome]! 👋

Lembrei de você hoje porque estou testando algo novo de bem-estar que pode te interessar.

É sobre bebidas funcionais que ajudam no dia a dia. Quer que eu te mostre rapidinho? 😊`,

        `Olá [Nome]! 😊

Tenho uma novidade legal pra te contar sobre bem-estar.

São bebidas que eu mesmo uso e estou adorando. Quer que eu te mostre? É bem simples! 💚`,

        `Oi [Nome]!

Estou participando de um projeto de bem-estar e queria te contar sobre algo que pode te interessar.

Tem 2 minutinhos pra eu te mostrar? É bem prático! ✨`
      ],
      dicas: [
        'Use o nome da pessoa para criar conexão',
        'Mencione "bem-estar" antes de "produto"',
        'Seja curto: 3-4 linhas no máximo',
        'Termine com pergunta aberta, não fechada',
        'Não mencione preço ou venda no primeiro contato'
      ]
    },
    {
      numero: 2,
      titulo: 'Mensagem Inicial (Negócio)',
      descricao: 'Abordagem para apresentar a oportunidade de forma leve.',
      scripts: [
        `Oi [Nome]! 👋

Lembrei de você porque estou participando de um projeto de bem-estar que pode ser interessante pra você também.

É uma forma de trabalhar com produtos que eu mesmo uso. Quer que eu te conte rapidinho? 😊`,

        `Olá [Nome]! 😊

Tenho uma novidade legal pra te contar. Estou trabalhando com algo relacionado a bem-estar e acho que pode te interessar.

Tem uns minutinhos pra eu te mostrar? É bem simples de entender! 💚`,

        `Oi [Nome]!

Estou envolvido em um projeto de bem-estar e queria saber se você tem interesse em conhecer.

Não é nada complicado, é bem direto. Quer que eu te explique rapidinho? ✨`
      ],
      dicas: [
        'Foque em "projeto" ou "trabalho", não em "negócio"',
        'Mencione que você mesmo participa (prova social)',
        'Enfatize simplicidade e praticidade',
        'Não use palavras como "renda extra" ou "oportunidade" no primeiro contato',
        'Deixe a pessoa curiosa, não pressionada'
      ]
    },
    {
      numero: 3,
      titulo: 'Follow-up Leve (se não responder)',
      descricao: 'Retornar de forma respeitosa após 2-3 dias sem resposta.',
      scripts: [
        `Oi [Nome]! 😊

Tudo bem? Lembrei da nossa conversa e queria saber se você ainda tem interesse em saber mais sobre [produto/oportunidade].

Se não for o momento, sem problemas! Mas se quiser, posso te mostrar rapidinho. 💚`,

        `Olá [Nome]!

Como você está? Passou um tempinho desde que te falei sobre [assunto].

Se ainda tiver interesse, posso te atualizar com as novidades. Se não, tudo bem também! 😊`
      ],
      dicas: [
        'Espere pelo menos 2-3 dias antes de fazer follow-up',
        'Seja respeitoso e dê opção de sair',
        'Mencione que entende se não for o momento',
        'Mantenha o tom leve e sem pressão',
        'Se não responder novamente, aguarde 1 semana antes de tentar de novo'
      ]
    }
  ],
  variacoes: [
    {
      titulo: 'Tom Mais Casual (Amigos)',
      scripts: [
        `E aí [Nome]! 😄

Tem uma parada de bem-estar que eu tô testando e achei que você ia curtir.

Quer que eu te mostre? É rapidinho!`
      ]
    },
    {
      titulo: 'Tom Mais Profissional (Contatos de Trabalho)',
      scripts: [
        `Olá [Nome],

Gostaria de compartilhar uma oportunidade de bem-estar que pode ser interessante para você.

Teríamos alguns minutos para uma conversa breve?`
      ]
    }
  ],
  comandosNoel: [
    'NOEL, personalize um convite leve para [nome] sobre [produto/oportunidade]',
    'NOEL, crie uma variação do convite leve com tom [casual/profissional]',
    'NOEL, me ajude a fazer follow-up leve com [nome] que não respondeu'
  ]
}

export default function FluxoConviteLevePage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <FluxoTemplate fluxo={fluxoConviteLeve} />
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
