'use client'

import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import FluxoTemplate from '@/components/wellness/FluxoTemplate'

const fluxoApresentacaoGravada = {
  id: 'fluxo-apresentacao-gravada',
  titulo: 'Fluxo de Apresentação Gravada',
  descricao: 'Como entregar o vídeo de apresentação, mensagens antes e depois, e perguntas que geram decisão.',
  objetivo: 'Apresentar a oportunidade através de vídeo gravado de forma eficaz, gerando interesse e decisão.',
  quandoUsar: 'Quando você quer apresentar a oportunidade de forma profissional, mas sem precisar estar presente ao vivo.',
  passos: [
    {
      numero: 1,
      titulo: 'Mensagem Antes de Enviar',
      descricao: 'Preparar a pessoa para assistir a apresentação.',
      scripts: [
        `Oi [Nome]! 😊

Que legal que você tem interesse em saber mais!

Vou te enviar uma apresentação em vídeo que explica tudo direitinho: os produtos, como funciona, a oportunidade, e como começar.

São uns 15-20 minutos. Quando você conseguir assistir, me fala o que achou! 

Se tiver alguma dúvida durante a apresentação, pode me chamar. Estou à disposição! 💚`
      ],
      dicas: [
        'Confirme o interesse antes de enviar',
        'Mencione o tempo aproximado',
        'Peça feedback após assistir',
        'Esteja disponível para dúvidas'
      ]
    },
    {
      numero: 2,
      titulo: 'Enviar o Vídeo',
      descricao: 'Enviar o link da apresentação (HOM gravada).',
      scripts: [
        `Aqui está a apresentação completa:

[LINK DO VÍDEO]

Assista quando puder e depois me fala o que achou! 

Se tiver alguma dúvida durante a apresentação, pode me chamar. Estou à disposição! 💚`
      ],
      dicas: [
        'Use o link oficial da HOM',
        'Envie o link de forma clara',
        'Reitere que está disponível para dúvidas',
        'Aguarde a pessoa assistir antes de fazer follow-up'
      ]
    },
    {
      numero: 3,
      titulo: 'Follow-up Após 1-2 Dias',
      descricao: 'Retornar para verificar se assistiu e o que achou.',
      scripts: [
        `Oi [Nome]! 😊

Conseguiu assistir a apresentação? O que você achou?

Tem alguma dúvida? Posso te ajudar a entender melhor qualquer parte! 💚`
      ],
      dicas: [
        'Aguarde 1-2 dias antes de fazer follow-up',
        'Pergunte se assistiu e o que achou',
        'Esteja aberto para dúvidas',
        'Não pressione para decidir'
      ]
    },
    {
      numero: 4,
      titulo: 'Perguntas que Geram Decisão',
      descricao: 'Fazer perguntas estratégicas após a pessoa assistir.',
      scripts: [
        `Que legal que você assistiu! 😊

Agora queria saber: o que você achou mais interessante na apresentação?

E tem alguma parte que você gostaria de entender melhor?`
      ],
      dicas: [
        'Faça perguntas abertas',
        'Escute mais do que fale',
        'Identifique o interesse real',
        'Trate objeções se surgirem'
      ]
    }
  ],
  comandosNoel: [
    'NOEL, me ajude a criar uma mensagem antes de enviar a apresentação para [nome]',
    'NOEL, crie perguntas estratégicas para fazer após [nome] assistir a apresentação'
  ]
}

export default function FluxoApresentacaoGravadaPage() {
  // Layout server-side já valida autenticação, perfil e assinatura
  return (
    
      
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <FluxoTemplate fluxo={fluxoApresentacaoGravada} />
          </div>
        </ConditionalWellnessSidebar>
      
    
  )
}
