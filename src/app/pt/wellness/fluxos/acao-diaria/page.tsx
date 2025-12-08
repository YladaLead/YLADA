'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import FluxoTemplate from '@/components/wellness/FluxoTemplate'

const fluxo2510 = {
  id: 'fluxo-2-5-10',
  titulo: 'Fluxo 2-5-10 — Ação Diária',
  descricao: 'O método diário de crescimento: 2 convites, 5 follow-ups, 10 contatos. A base da duplicação.',
  objetivo: 'Criar um hábito diário de ação que gera resultados consistentes e duplicáveis.',
  quandoUsar: 'Todos os dias, como rotina principal. É o coração da duplicação e deve ser executado diariamente.',
  passos: [
    {
      numero: 1,
      titulo: '2 Convites Leves',
      descricao: 'Enviar 2 convites leves para pessoas próximas, sem pressão.',
      scripts: [
        `Oi [Nome]! 👋

Lembrei de você hoje e queria te contar uma novidade de bem-estar que estou testando. 

Posso te mostrar rapidinho? É bem simples e pode te interessar! 😊`,

        `Olá [Nome]! 😊

Estou participando de um projeto de bem-estar e queria te contar sobre algo que pode te interessar.

Tem 2 minutinhos pra eu te mostrar?`,

        `Oi [Nome]! 

Tenho uma novidade legal pra te contar sobre bem-estar. 

Quer que eu te mostre rapidinho? É bem simples! 💚`
      ],
      dicas: [
        'Use o nome da pessoa para personalizar',
        'Mantenha o tom leve e sem pressão',
        'Não mencione vendas ou negócio no primeiro contato',
        'Foque em bem-estar e novidade'
      ]
    },
    {
      numero: 2,
      titulo: '5 Follow-ups',
      descricao: 'Retornar conversas anteriores e acompanhar pessoas que já demonstraram interesse.',
      scripts: [
        `Oi [Nome]! 😊

Como você está? Lembrei da nossa conversa sobre [assunto] e queria saber se você ainda tem interesse.

Posso te ajudar com alguma coisa?`,

        `Olá [Nome]!

Tudo bem? Estava pensando em você e queria saber como está indo com [situação mencionada].

Se quiser, posso te mostrar algo que pode ajudar! 💚`,

        `Oi [Nome]! 👋

Passou um tempinho desde nossa última conversa. Queria saber se você ainda tem interesse em saber mais sobre [produto/oportunidade].

Posso te atualizar com as novidades?`
      ],
      dicas: [
        'Referencie a conversa anterior para criar conexão',
        'Mostre interesse genuíno pela pessoa',
        'Ofereça valor, não apenas venda',
        'Seja consistente mas não insistente'
      ]
    },
    {
      numero: 3,
      titulo: '10 Contatos Novos',
      descricao: 'Adicionar 10 pessoas novas à sua lista de contatos para expandir sua rede.',
      dicas: [
        'Use redes sociais para encontrar pessoas com interesse em bem-estar',
        'Participe de grupos relacionados ao seu público',
        'Conecte-se com pessoas que você conhece mas não tem contato',
        'Mantenha um cadastro organizado com nome e contexto',
        'Não precisa abordar imediatamente, apenas adicionar à lista'
      ]
    }
  ],
  variacoes: [
    {
      titulo: 'Tom Mais Casual',
      scripts: [
        `E aí [Nome]! 😄

Tem uma parada de bem-estar que eu tô testando e achei que você ia curtir.

Quer que eu te mostre? É rapidinho!`
      ]
    },
    {
      titulo: 'Tom Mais Profissional',
      scripts: [
        `Olá [Nome],

Gostaria de compartilhar uma oportunidade de bem-estar que pode ser interessante para você.

Teríamos alguns minutos para uma conversa breve?`
      ]
    }
  ],
  comandosNoel: [
    'NOEL, personalize o Fluxo 2-5-10 para [situação específica]',
    'NOEL, crie uma variação do convite leve para [tipo de pessoa]',
    'NOEL, me ajude a fazer follow-up com [nome] sobre [assunto]'
  ]
}

export default function FluxoAcaoDiariaPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <FluxoTemplate fluxo={fluxo2510} />
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
