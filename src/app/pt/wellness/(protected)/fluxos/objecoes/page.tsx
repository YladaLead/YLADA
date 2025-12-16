'use client'

import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import FluxoTemplate from '@/components/wellness/FluxoTemplate'

const fluxoObjecoes = {
  id: 'fluxo-objecoes',
  titulo: 'Pacote de Objeções — Produto + Negócio',
  descricao: 'Respostas estruturadas para as principais objeções, com 3 níveis: curta, explicada e estratégica.',
  objetivo: 'Tratar objeções de forma empática, clara e eficaz, conduzindo a conversa de volta ao interesse.',
  quandoUsar: 'Quando a pessoa apresenta uma dúvida, preocupação ou objeção sobre produtos ou oportunidade.',
  passos: [
    {
      numero: 1,
      titulo: 'Falta de Dinheiro',
      descricao: 'Quando a pessoa diz que não tem dinheiro para comprar produtos ou começar.',
      scripts: [
        `Entendo perfeitamente! 💚

A boa notícia é que você pode começar com um kit bem acessível, e os produtos duram bastante. 

Além disso, quando você indica para outras pessoas, você ganha comissão, então o investimento se paga rápido.

Quer que eu te mostre as opções de kit? Tem desde R$ 39,90.`,

        `Compreendo sua situação! 😊

Pensa assim: você vai usar os produtos mesmo, então não é um gasto, é um investimento no seu bem-estar.

E quando você indica para outras pessoas, você ganha uma parte de volta. Muita gente consegue pagar o próprio consumo assim.

Quer que eu te mostre como funciona?`,

        `Oi [Nome]! 

Entendo perfeitamente. Dinheiro é uma preocupação real.

Deixa eu te mostrar uma coisa: você pode começar com um kit bem pequeno, e os produtos duram bastante. 

E o legal é que, quando você indica para outras pessoas e elas compram, você ganha uma comissão. Então muita gente consegue pagar o próprio consumo assim.

Além disso, você não precisa comprar todo mês. Você compra quando quiser, no seu ritmo.

Quer que eu te mostre as opções? Tem kits desde R$ 39,90.`
      ],
      dicas: [
        'Seja empático e compreensivo',
        'Mencione opções acessíveis',
        'Explique que é investimento, não gasto',
        'Fale sobre comissão e retorno',
        'Não pressione, apenas ofereça opções'
      ]
    },
    {
      numero: 2,
      titulo: 'Falta de Tempo',
      descricao: 'Quando a pessoa diz que não tem tempo para trabalhar com isso.',
      scripts: [
        `Entendo! Tempo é precioso mesmo! 😊

A boa notícia é que você não precisa de muito tempo. Com 15-30 minutos por dia já dá pra começar.

E você pode fazer no seu ritmo, quando conseguir. Não precisa virar sua vida de cabeça pra baixo.

Quer que eu te mostre como funciona na prática?`,

        `Compreendo! Todos temos rotina corrida! 💚

Pensa assim: você já usa WhatsApp, certo? Então você já tem a ferramenta principal.

É só indicar produtos para pessoas próximas quando surgir a oportunidade. Não precisa de muito tempo, só consistência.

E você pode fazer no seu ritmo, sem pressão. Quer que eu te explique melhor?`
      ],
      dicas: [
        'Valide a preocupação da pessoa',
        'Mencione que precisa de pouco tempo',
        'Enfatize que pode fazer no próprio ritmo',
        'Use exemplos práticos (WhatsApp, etc)',
        'Não minimize a rotina da pessoa'
      ]
    },
    {
      numero: 3,
      titulo: 'Medo / Não Sei Vender',
      descricao: 'Quando a pessoa tem medo de vender ou acha que não sabe vender.',
      scripts: [
        `Entendo! Esse medo é super comum! 😊

Mas pensa assim: você não precisa "vender" no sentido tradicional. Você só precisa usar os produtos, ver os resultados, e contar sua experiência.

Quando você fala de algo que você mesmo usa e acredita, não é venda, é compartilhamento.

E eu vou te ajudar em cada passo. Você não vai estar sozinho nisso. Quer que eu te mostre como começar?`,

        `Compreendo perfeitamente! 💚

A boa notícia é que você não precisa ser vendedor profissional. Você só precisa ser você mesmo e compartilhar sua experiência.

Quando você usa os produtos e vê resultados, você naturalmente quer compartilhar com pessoas próximas. E é exatamente isso que você vai fazer.

E eu vou te dar todos os scripts e materiais. Você não precisa inventar nada, só seguir o passo a passo.

Quer que eu te mostre?`
      ],
      dicas: [
        'Valide o medo da pessoa',
        'Reframe: não é "vender", é "compartilhar"',
        'Mencione que vai ter suporte',
        'Fale sobre scripts e materiais prontos',
        'Enfatize que pode ser ela mesma'
      ]
    },
    {
      numero: 4,
      titulo: 'É Pirâmide?',
      descricao: 'Quando a pessoa questiona se é esquema de pirâmide.',
      scripts: [
        `Ótima pergunta! 😊

Não, não é pirâmide. É uma empresa multinível legítima, com mais de 40 anos no mercado, produtos reais e regulamentados.

A diferença é que em pirâmide você paga para entrar e não recebe nada. Aqui você compra produtos que você vai usar, e se indicar para outras pessoas, você ganha comissão.

É como ser representante de uma marca, só que você também pode usar os produtos.

Quer que eu te explique melhor como funciona?`,

        `Entendo a preocupação! 💚

Não é pirâmide. É uma empresa séria, com produtos reais que você pode usar e indicar.

A diferença é simples: em pirâmide você paga e não recebe nada. Aqui você compra produtos (que você vai usar), e se alguém comprar através de você, você ganha uma comissão.

É como ser afiliado ou representante de uma marca, mas você também usa os produtos.

A empresa tem mais de 40 anos, está em mais de 90 países, e é regulamentada. Quer que eu te mostre mais informações?`
      ],
      dicas: [
        'Não fique na defensiva',
        'Explique a diferença claramente',
        'Mencione legitimidade da empresa',
        'Use analogias (representante, afiliado)',
        'Ofereça mais informações se quiser'
      ]
    },
    {
      numero: 5,
      titulo: 'Preciso Pensar',
      descricao: 'Quando a pessoa pede tempo para pensar.',
      scripts: [
        `Claro! Faz todo sentido pensar bem! 😊

Não tem pressa nenhuma. Pensa com calma e, se tiver alguma dúvida, me chama que eu te ajudo.

Quando você decidir, estarei aqui para te ajudar a começar. 💚`,

        `Perfeito! É importante pensar bem mesmo! 💚

Enquanto você pensa, se tiver alguma dúvida ou quiser saber mais sobre alguma coisa, me chama que eu te ajudo.

Não tem pressa. Quando você decidir, estarei aqui. 😊`
      ],
      dicas: [
        'Respeite o tempo da pessoa',
        'Não pressione',
        'Deixe a porta aberta para dúvidas',
        'Seja paciente',
        'Faça follow-up respeitoso após alguns dias'
      ]
    },
    {
      numero: 6,
      titulo: 'Funciona Mesmo?',
      descricao: 'Quando a pessoa questiona se realmente funciona.',
      scripts: [
        `Ótima pergunta! 😊

Funciona sim! Eu mesmo uso e vejo resultados. E conheço muitas pessoas que também usam e estão satisfeitas.

Os produtos são baseados em ciência, têm estudos que comprovam a eficácia, e são regulamentados.

Quer que eu te mostre alguns resultados e depoimentos?`,

        `Entendo a dúvida! 💚

Funciona sim! Eu uso os produtos há [tempo] e posso te mostrar os resultados que eu mesmo tive.

Além disso, a empresa tem mais de 40 anos no mercado, está em mais de 90 países, e tem milhões de clientes satisfeitos.

Os produtos são baseados em ciência e têm estudos que comprovam. Quer que eu te mostre mais informações?`
      ],
      dicas: [
        'Use prova social (você mesmo, outras pessoas)',
        'Mencione estudos e ciência',
        'Fale sobre legitimidade da empresa',
        'Ofereça depoimentos e resultados',
        'Seja honesto e transparente'
      ]
    }
  ],
  comandosNoel: [
    'NOEL, me ajude a responder a objeção "[objeção específica]" de [nome]',
    'NOEL, crie uma resposta empática para "[objeção]"',
    'NOEL, me dê estratégias para tratar "[objeção]" de forma respeitosa'
  ]
}

// Layout server-side já valida autenticação, perfil e assinatura
export default function FluxoObjecoesPage() {
  return (
    <ConditionalWellnessSidebar>
      <div className="min-h-screen bg-gray-50 py-8">
        <FluxoTemplate fluxo={fluxoObjecoes} />
      </div>
    </ConditionalWellnessSidebar>
  )
}
