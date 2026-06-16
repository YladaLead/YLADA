'use client'

import { useState } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { getApresentacaoNegocio } from '@/lib/ylada-flow/apresentacao-negocio'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'

function EnviarLinkApresentacaoPageContent() {
  const { profile } = useWellnessProfile()
  const apresentacao = getApresentacaoNegocio()
  const [linkCopiado, setLinkCopiado] = useState<string | null>(null)
  const [mensagemCopiada, setMensagemCopiada] = useState<string | null>(null)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'
  const linkApresentacao = `${baseUrl}/pt/wellness/system/recrutar/apresentacao`

  // Apresentações agendadas
  const apresentacoes = [
    {
      id: 'segunda-20h',
      dia: 'Segunda-feira',
      horario: '20:00',
      horarioTexto: '8h da noite',
      linkZoom: 'https://us02web.zoom.us/j/83406912762?pwd=leMxo4G4ImVKHGSx5oQ3ff2ldfHTMG.1'
    },
    {
      id: 'quarta-9h',
      dia: 'Quarta-feira',
      horario: '09:00',
      horarioTexto: '9h da manhã',
      linkZoom: 'https://us02web.zoom.us/j/88580290270?pwd=pawdvClnfRSS7ccDq7ibRI7iTVfzSx.1'
    }
  ]

  const copiarLink = (tipo: 'apresentacao' | string, link?: string, apresentacaoItem?: typeof apresentacoes[0]) => {
    // Se for link do Zoom de uma apresentação específica, copiar mensagem formatada
    if (apresentacaoItem && link && link.includes('zoom.us')) {
      const mensagem = `📅 Apresentação ao vivo:\n${apresentacaoItem.dia} às ${apresentacaoItem.horarioTexto}\n\n🔗 Link do Zoom:\n${link}\n\nAlguns minutos podem mudar a sua perspectiva! 🚀`
      navigator.clipboard.writeText(mensagem)
      setLinkCopiado(apresentacaoItem.id)
      setTimeout(() => setLinkCopiado(null), 2000)
      return
    }
    
    // Para outros casos, copiar apenas o link
    const textoParaCopiar = tipo === 'apresentacao' ? linkApresentacao : link || ''
    navigator.clipboard.writeText(textoParaCopiar)
    setLinkCopiado(tipo)
    setTimeout(() => setLinkCopiado(null), 2000)
  }

  const copiarMensagemComLink = (apresentacaoItem?: typeof apresentacoes[0]) => {
    let mensagem = `Olá! 👋

Tenho uma oportunidade interessante para compartilhar com você!

É sobre o mercado de bebidas funcionais - um mercado que está crescendo muito.

Quer conhecer? É só clicar no link abaixo:

${linkApresentacao}`

    if (apresentacaoItem) {
      mensagem += `\n\n📅 Apresentação ao vivo:\n${apresentacaoItem.dia} às ${apresentacaoItem.horarioTexto}\n\n🔗 Link do Zoom:\n${apresentacaoItem.linkZoom}`
    }

    mensagem += `\n\nSão apenas alguns minutos e pode mudar sua perspectiva sobre renda! 🚀`

    navigator.clipboard.writeText(mensagem)
    setMensagemCopiada(apresentacaoItem?.id || 'geral')
    setTimeout(() => setMensagemCopiada(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Enviar Link de Apresentação" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar ao Sistema - Bem visível no topo */}
        <div className="mb-6">
          <Link
            href="/pt/wellness/home"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Voltar ao Sistema</span>
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Enviar Link de Apresentação
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compartilhe o link da apresentação de negócio com pessoas interessadas
          </p>
        </div>

        {/* Apresentações Agendadas */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Apresentações Agendadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {apresentacoes.map((apresentacaoItem) => (
                <div key={apresentacaoItem.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {apresentacaoItem.dia}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {apresentacaoItem.horario}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {apresentacaoItem.horarioTexto}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Link do Zoom:</p>
                    <p className="text-xs text-gray-800 break-all font-mono">
                      {apresentacaoItem.linkZoom}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => copiarLink(apresentacaoItem.id, apresentacaoItem.linkZoom, apresentacaoItem)}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                        linkCopiado === apresentacaoItem.id
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {linkCopiado === apresentacaoItem.id ? '✓ Mensagem Copiada!' : '📋 Copiar Link do Zoom'}
                    </button>
                    <button
                      onClick={() => copiarMensagemComLink(apresentacaoItem)}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                        mensagemCopiada === apresentacaoItem.id
                          ? 'bg-green-600 text-white'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {mensagemCopiada === apresentacaoItem.id ? '✓ Mensagem Copiada!' : '📱 Copiar Mensagem Completa'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link da Apresentação Online */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Link da Apresentação Online
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              Compartilhe este link para que a pessoa possa ver a apresentação completa a qualquer momento.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
              <p className="text-sm text-gray-800 break-all font-mono">
                {linkApresentacao}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => copiarLink('apresentacao')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  linkCopiado === 'apresentacao'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {linkCopiado === 'apresentacao' ? '✓ Link Copiado!' : '📋 Copiar Link'}
              </button>
              <button
                onClick={() => copiarMensagemComLink()}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  mensagemCopiada === 'geral'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {mensagemCopiada === 'geral' ? '✓ Mensagem Copiada!' : '📱 Copiar Mensagem com Link'}
              </button>
            </div>
          </div>

          {/* Preview da Apresentação */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Preview da Apresentação
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Abertura</h3>
                <p className="text-gray-700">{apresentacao.estrutura.abertura}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Demonstração</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {apresentacao.estrutura.demonstracao.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3. História</h3>
                <p className="text-gray-700">{apresentacao.estrutura.historia}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4. Oportunidade</h3>
                <p className="text-gray-700">{apresentacao.estrutura.oportunidade}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">5. Plano Simples - 3 Ganhos</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>{apresentacao.estrutura.planoSimples.ganho1}</li>
                  <li>{apresentacao.estrutura.planoSimples.ganho2}</li>
                  <li>{apresentacao.estrutura.planoSimples.ganho3}</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">6. Fechamento</h3>
                <p className="text-gray-700">{apresentacao.estrutura.fechamento}</p>
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              💡 Dicas de Uso
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• Envie o link para pessoas que demonstraram interesse</li>
              <li>• Use os fluxos de recrutamento para identificar pessoas com potencial</li>
              <li>• Faça follow-up após enviar o link</li>
              <li>• Use os scripts da biblioteca para personalizar sua abordagem</li>
            </ul>
          </div>
        </div>

        {/* Voltar */}
        <div className="text-center mt-8">
          <Link
            href="/pt/wellness/home"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Voltar ao Sistema
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function EnviarLinkApresentacaoPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <EnviarLinkApresentacaoPageContent />
    </ProtectedRoute>
  )
}

