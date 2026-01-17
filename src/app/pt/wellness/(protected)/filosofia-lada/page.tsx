'use client'

import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'

/**
 * Página Filosofia YLADA - Conexões Saudáveis e Trabalho Leve
 * 
 * A Filosofia YLADA foi criada para criar conexões saudáveis onde o seu trabalho
 * não é mais força venda ou tentar vender, e sim atender pessoas interessadas.
 * 
 * Por quê? Porque antes de tudo, através dos Links Inteligentes, você agregou
 * valor à vida da pessoa.
 */
export default function FilosofiaLADAPage() {
  return (
    <ConditionalWellnessSidebar>
      <FilosofiaYLADAContent />
    </ConditionalWellnessSidebar>
  )
}

function FilosofiaYLADAContent() {
  const pilares = [
    {
      id: 1,
      titulo: 'Agregar Valor Primeiro',
      descricao: 'Servir antes de vender',
      icon: '💎',
      conteudo: 'Através dos Links Inteligentes Wellness, você entrega algo que realmente interessa e agrega valor à vida da pessoa antes mesmo de qualquer proposta comercial.'
    },
    {
      id: 2,
      titulo: 'Deixar os Interessados Chegarem',
      descricao: 'Não correr atrás, atrair',
      icon: '🎯',
      conteudo: 'Quando você agrega valor primeiro, as pessoas interessadas chegam até você naturalmente. Não é mais você tentando vender, são elas querendo o que você oferece.'
    },
    {
      id: 3,
      titulo: 'Quebrar o Gelo',
      descricao: 'Identificar temperatura do contato',
      icon: '🌡️',
      conteudo: 'O NOEL te orienta sobre como identificar se a pessoa está quente, morna ou fria. Isso te ajuda a saber a melhor abordagem para cada situação.'
    },
    {
      id: 4,
      titulo: 'Rotina Leve e Divertida',
      descricao: 'Trabalho mágico e simples',
      icon: '✨',
      conteudo: 'A Filosofia YLADA transforma seu trabalho em uma rotina leve, agradável, simples, mágica e divertida. Não é mais sobre pressão, é sobre conexão genuína.'
    },
    {
      id: 5,
      titulo: 'Atender, Não Vender',
      descricao: 'Conexões saudáveis',
      icon: '🤝',
      conteudo: 'Seu trabalho não é mais força venda ou tentar vender. É atender pessoas interessadas que já receberam valor através dos seus links e querem mais.'
    },
    {
      id: 6,
      titulo: 'Conexões Duradouras',
      descricao: 'Relacionamentos genuínos',
      icon: '❤️',
      conteudo: 'Quando você serve primeiro, cria relacionamentos baseados em confiança e valor. As vendas acontecem naturalmente como consequência do serviço oferecido.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Filosofia <span className="text-purple-600">YLADA</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Criada para criar conexões saudáveis onde o seu trabalho não é mais força venda ou tentar vender. É <strong>atender pessoas interessadas</strong>.
          </p>
        </div>

        {/* Conceito Central */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-semibold mb-4">
            Por que a Filosofia YLADA funciona?
          </h2>
          <p className="text-lg text-purple-50 mb-4">
            Porque <strong>antes de tudo</strong>, através dos <strong>Links Inteligentes</strong>, você agregou valor à vida da pessoa.
          </p>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-white font-medium">
              ✨ Quando você serve primeiro, as pessoas interessadas chegam até você naturalmente. Não é mais você correndo atrás. São elas querendo o que você oferece.
            </p>
          </div>
        </div>

        {/* Fluxo YLADA */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Como funciona a Filosofia YLADA
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Você compartilha um Link Inteligente</h3>
                <p className="text-gray-600">
                  Através dos Links Wellness, você entrega algo que realmente interessa: um quiz, uma calculadora, uma avaliação que agrega valor real à vida da pessoa.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">A pessoa recebe valor primeiro</h3>
                <p className="text-gray-600">
                  Ela descobre algo sobre si mesma, aprende algo útil, recebe uma orientação personalizada. Tudo isso ANTES de qualquer proposta comercial.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Os interessados chegam até você</h3>
                <p className="text-gray-600">
                  Quando a pessoa está interessada, ela mesma entra em contato. Não é você correndo atrás. É ela querendo mais do que você oferece.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">O NOEL te orienta sobre temperatura</h3>
                <p className="text-gray-600">
                  O NOEL te ajuda a identificar se a pessoa está quente, morna ou fria, e qual a melhor abordagem para quebrar o gelo e criar conexão.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Você atende, não vende</h3>
                <p className="text-gray-600">
                  Seu trabalho agora é atender pessoas interessadas. A venda acontece naturalmente porque você já agregou valor e a pessoa quer mais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pilares da Filosofia */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Pilares da Filosofia YLADA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pilares.map((pilar) => (
              <div
                key={pilar.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{pilar.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {pilar.titulo}
                </h3>
                <p className="text-gray-600 mb-3 font-medium">{pilar.descricao}</p>
                <p className="text-sm text-gray-500">{pilar.conteudo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Foco Principal: Multiplicação */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            🚀 Foco Principal: Multiplicação
          </h2>
          <p className="text-xl text-blue-50 mb-6">
            O coração da Filosofia YLADA é <strong>espalhar os Links Inteligentes</strong>
          </p>
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📱</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">Espalhe os Links em Todos os Lugares</h3>
                <p className="text-blue-50">
                  Compartilhe seus Links Inteligentes no WhatsApp, Instagram, Facebook, Stories, grupos, 
                  com amigos, família, conhecidos. Quanto mais você espalha, mais pessoas recebem valor 
                  e mais interessados chegam até você.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">🌱</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">Multiplicação Natural</h3>
                <p className="text-blue-50">
                  Quando você espalha Links que agregam valor, a multiplicação acontece naturalmente. 
                  As pessoas compartilham porque receberam algo útil. Você não precisa pedir, elas fazem porque querem.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">💫</span>
              <div>
                <h3 className="font-semibold text-lg mb-2">Cada Link é uma Semente</h3>
                <p className="text-blue-50">
                  Cada Link Inteligente que você compartilha é uma semente plantada. Algumas vão germinar 
                  imediatamente, outras vão levar tempo. Mas todas têm potencial de criar conexões e resultados.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confiança e Segurança */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Você vai se sentir muito melhor, muito mais confiante e muito mais segura
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              A Filosofia YLADA não transforma apenas o seu trabalho. Ela transforma <strong>como você se sente</strong> trabalhando.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
                <h3 className="font-semibold text-green-900 mb-2 text-lg">
                  💰 Para Vender
                </h3>
                <p className="text-green-800">
                  Você não precisa mais se sentir pressionada ou insegura ao abordar alguém. 
                  Quando você espalha Links Inteligentes, você já agregou valor primeiro. 
                  As pessoas interessadas chegam até você, e você se sente <strong>confiante</strong> porque 
                  sabe que está <strong>servindo</strong>, não apenas vendendo.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 mb-2 text-lg">
                  👥 Para Recrutar
                </h3>
                <p className="text-blue-800">
                  Recrutar deixa de ser sobre "convencer" alguém a entrar no negócio. 
                  Quando você espalha Links que agregam valor, as pessoas veem o potencial 
                  naturalmente. Você se sente <strong>segura</strong> porque está mostrando 
                  o valor real, não apenas prometendo resultados.
                </p>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mt-6">
              <p className="text-purple-900 font-medium mb-2">
                ✨ A Transferência de Tudo Isso
              </p>
              <p className="text-purple-800">
                Quando você entende e pratica a Filosofia YLADA, essa confiança e segurança 
                se transferem para <strong>tudo</strong> que você faz: vendas, recrutamento, 
                relacionamentos, apresentações. Você trabalha com mais leveza, mais confiança 
                e mais segurança porque sabe que está sempre <strong>servindo primeiro</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Rotina Leve e Divertida */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Uma Rotina Leve, Agradável, Simples, Mágica e Divertida
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              A Filosofia YLADA transforma completamente a forma como você trabalha. Não é mais sobre:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600">
              <li>Correr atrás de pessoas que não estão interessadas</li>
              <li>Forçar vendas ou pressionar para fechar</li>
              <li>Tentar convencer alguém que não quer ser convencido</li>
              <li>Sentir que está "vendendo" o tempo todo</li>
            </ul>
            <p className="mb-4">
              Agora é sobre:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600">
              <li><strong>Espalhar Links Inteligentes</strong> que agregam valor real (foco principal na multiplicação)</li>
              <li><strong>Atender pessoas interessadas</strong> que chegam até você</li>
              <li><strong>Criar conexões genuínas</strong> baseadas em serviço</li>
              <li><strong>Trabalhar de forma leve e divertida</strong>, sem pressão</li>
              <li><strong>Sentir-se confiante e segura</strong> tanto para vender quanto para recrutar</li>
            </ul>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mt-6">
              <p className="text-purple-900 font-medium mb-2">
                ✨ A Mágica da Filosofia YLADA
              </p>
              <p className="text-purple-800">
                Quando você espalha Links Inteligentes e serve primeiro, você não precisa mais "vender" ou "convencer". 
                As pessoas interessadas chegam até você porque já receberam valor e querem mais. 
                Seu trabalho se torna leve, agradável, simples, mágico e divertido. 
                E você se sente muito melhor, muito mais confiante e muito mais segura em tudo que faz.
              </p>
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-semibold mb-4">
            Como começar agora
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="font-semibold mb-1">Espalhe seus Links Inteligentes (Foco Principal)</h3>
                <p className="text-green-100 text-sm">
                  Multiplique! Compartilhe seus Links Wellness em todos os lugares: WhatsApp, Instagram, Stories, grupos. 
                  Quanto mais você espalha, mais pessoas recebem valor e mais interessados chegam até você. 
                  O NOEL pode te ajudar a escolher o melhor link para cada situação.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-semibold mb-1">Converse com o NOEL</h3>
                <p className="text-green-100 text-sm">
                  O NOEL te orienta sobre como quebrar o gelo, identificar se a pessoa está quente/morna/fria, e qual a melhor abordagem para cada situação.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💎</span>
              <div>
                <h3 className="font-semibold mb-1">Lembre-se: Servir primeiro</h3>
                <p className="text-green-100 text-sm">
                  Sempre que for compartilhar algo, pergunte: "Isso agrega valor à vida da pessoa?" Se sim, compartilhe. Se não, não compartilhe.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-semibold mb-1">Aproveite o trabalho leve</h3>
                <p className="text-green-100 text-sm">
                  Quando você serve primeiro, seu trabalho se torna leve, agradável, simples, mágico e divertido. 
                  Você não está mais "vendendo", está criando conexões saudáveis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
