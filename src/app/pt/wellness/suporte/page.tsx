'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function WellnessSuportePage() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null)

  const categorias = [
    { id: 'inicio', nome: 'Como começar', icon: '🚀' },
    { id: 'ferramentas', nome: 'Ferramentas', icon: '🔧' },
    { id: 'links', nome: 'Links personalizados', icon: '🔗' },
    { id: 'templates', nome: 'Templates', icon: '📋' },
    { id: 'whatsapp', nome: 'WhatsApp', icon: '💬' },
    { id: 'tecnicos', nome: 'Problemas técnicos', icon: '⚙️' }
  ]

  const perguntasFrequentes = {
    inicio: [
      {
        pergunta: 'Como criar minha primeira ferramenta?',
        resposta: 'Acesse "Ferramentas" > "Criar Novo Link" e escolha um template. Configure as cores, emoji e CTA, e salve. Seu link personalizado estará pronto!'
      },
      {
        pergunta: 'Preciso configurar meu slug primeiro?',
        resposta: 'Sim! Vá em "Configurações" e defina seu slug pessoal (ex: joao-silva). Esse será usado nas URLs das suas ferramentas: ylada.app/wellness/joao-silva/nome-ferramenta'
      },
      {
        pergunta: 'Quantas ferramentas posso criar?',
        resposta: 'Não há limite! Crie quantas ferramentas precisar para seus clientes.'
      }
    ],
    ferramentas: [
      {
        pergunta: 'Como personalizar minhas ferramentas?',
        resposta: 'Ao criar um link, você pode personalizar: emoji, cores (principal e secundária), texto do botão e mensagem do WhatsApp.'
      },
      {
        pergunta: 'Posso editar uma ferramenta depois de criada?',
        resposta: 'Sim! Acesse "Ferramentas" e clique em "Editar" na ferramenta desejada. Você pode alterar cores, textos e configurações.'
      },
      {
        pergunta: 'Como compartilhar minhas ferramentas?',
        resposta: 'Copie o link completo exibido na lista de ferramentas e compartilhe onde quiser: WhatsApp, Instagram, email, etc.'
      }
    ],
    links: [
      {
        pergunta: 'Como funciona o slug da URL?',
        resposta: 'O slug é parte personalizada da URL. Exemplo: ylada.app/wellness/seu-nome/nome-ferramenta. Ele deve ser único e conter apenas letras minúsculas, números e hífens.'
      },
      {
        pergunta: 'E se meu slug já estiver em uso?',
        resposta: 'Escolha outro slug único. Sugerimos adicionar números ou outras palavras ao seu nome.'
      },
      {
        pergunta: 'Posso mudar meu slug depois?',
        resposta: 'Sim, mas isso afetará todos os links já criados. Recomendamos definir bem no início nas Configurações.'
      }
    ],
    templates: [
      {
        pergunta: 'Quantos templates estão disponíveis?',
        resposta: 'Atualmente temos 13 templates Wellness: 4 calculadoras (IMC, Proteína, Hidratação, Composição), 7 quizzes e 2 planilhas especializadas.'
      },
      {
        pergunta: 'Posso criar templates próprios?',
        resposta: 'Sim! Use a opção "Quiz Personalizado" para criar quizzes customizados do zero.'
      },
      {
        pergunta: 'Os templates funcionam em todos os países?',
        resposta: 'Sim! Os templates estão disponíveis em português e podem ser usados em qualquer país.'
      }
    ],
    whatsapp: [
      {
        pergunta: 'Como configurar o WhatsApp nas ferramentas?',
        resposta: 'Ao criar o link, escolha "WhatsApp" como tipo de CTA. Selecione o país, informe o número e personalize a mensagem pré-formatada.'
      },
      {
        pergunta: 'Posso usar placeholders na mensagem?',
        resposta: 'Sim! Use [RESULTADO], [NOME_CLIENTE] e [DATA] para personalizar automaticamente as mensagens enviadas.'
      },
      {
        pergunta: 'A mensagem abre diretamente no WhatsApp?',
        resposta: 'Sim! O botão abre o WhatsApp Web/App com a mensagem já formatada e pronta para enviar.'
      }
    ],
    tecnicos: [
      {
        pergunta: 'Minha ferramenta não está carregando',
        resposta: 'Verifique se: 1) O link está correto, 2) A ferramenta está ativa, 3) Seu navegador está atualizado. Se persistir, entre em contato.'
      },
      {
        pergunta: 'Os links não funcionam no celular',
        resposta: 'Os links são responsivos e funcionam em qualquer dispositivo. Se houver problema, verifique a conexão e tente abrir em modo anônimo.'
      },
      {
        pergunta: 'Como reportar um bug?',
        resposta: 'Envie um email para suporte@ylada.app com: descrição do problema, navegador usado, print/erro e link da ferramenta (se aplicável).'
      }
    ]
  }

  const categoriaAtual = categoriaSelecionada 
    ? perguntasFrequentes[categoriaSelecionada as keyof typeof perguntasFrequentes] 
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/wellness/dashboard">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Suporte</h1>
                <p className="text-sm text-gray-600">Central de ajuda e perguntas frequentes</p>
              </div>
            </div>
            <Link
              href="/pt/wellness/dashboard"
              className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Categorias */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setCategoriaSelecionada(
                categoriaSelecionada === categoria.id ? null : categoria.id
              )}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                categoriaSelecionada === categoria.id
                  ? 'border-green-600 bg-green-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
              }`}
            >
              <div className="text-3xl mb-2">{categoria.icon}</div>
              <p className="text-sm font-medium text-gray-900">{categoria.nome}</p>
            </button>
          ))}
        </div>

        {/* FAQ por Categoria */}
        {categoriaAtual ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {categorias.find(c => c.id === categoriaSelecionada)?.nome}
              </h2>
              <button
                onClick={() => setCategoriaSelecionada(null)}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-4">
              {categoriaAtual.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.pergunta}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.resposta}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <span className="text-6xl mb-4 block">💡</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Como podemos ajudar?</h2>
            <p className="text-gray-600 mb-6">
              Selecione uma categoria acima para ver perguntas frequentes relacionadas
            </p>
          </div>
        )}

        {/* Contato Direto */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ainda precisa de ajuda?</h2>
          <p className="mb-6 opacity-90">
            Nossa equipe está pronta para te atender. Entre em contato pelos canais abaixo:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">📧</div>
              <p className="font-semibold mb-1">Email</p>
              <p className="text-sm opacity-90">suporte@ylada.app</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">💬</div>
              <p className="font-semibold mb-1">WhatsApp</p>
              <p className="text-sm opacity-90">+55 11 99999-9999</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">⏰</div>
              <p className="font-semibold mb-1">Horário</p>
              <p className="text-sm opacity-90">Seg-Sex, 9h-18h</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


