'use client'

import { useState } from 'react'
import { 
  getScriptsNutriPorSlug, 
  getScriptsNutriPorNome,
  getScriptsNutriPorTipo,
  type ScriptsNutriConfig,
  type ScriptNutri 
} from '@/lib/nutri-system/scripts-nutri'

interface ScriptsNutriModalProps {
  isOpen: boolean
  onClose: () => void
  ferramentaNome: string
  ferramentaSlug?: string
  ferramentaIcon?: string
  linkFerramenta?: string
}

type TabTipo = 'lista_quente' | 'lista_fria' | 'indicacao'

export function ScriptsNutriModal({
  isOpen,
  onClose,
  ferramentaNome,
  ferramentaSlug,
  ferramentaIcon,
  linkFerramenta
}: ScriptsNutriModalProps) {
  const [tabAtiva, setTabAtiva] = useState<TabTipo>('lista_quente')
  const [copiado, setCopiado] = useState<string | null>(null)

  if (!isOpen) return null

  // Buscar scripts da ferramenta
  const config = ferramentaSlug 
    ? getScriptsNutriPorSlug(ferramentaSlug)
    : getScriptsNutriPorNome(ferramentaNome)

  if (!config) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6">
          <div className="text-center">
            <p className="text-gray-600">Scripts não disponíveis para esta ferramenta.</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { listaQuente, listaFria, indicacao } = getScriptsNutriPorTipo(config)

  const tabs: { id: TabTipo; label: string; icon: string; scripts: ScriptNutri[] }[] = [
    { id: 'lista_quente', label: 'Conhecidos', icon: '🔥', scripts: listaQuente },
    { id: 'lista_fria', label: 'Desconhecidos', icon: '❄️', scripts: listaFria },
    { id: 'indicacao', label: 'Pedir Indicação', icon: '🎁', scripts: indicacao }
  ]

  const scriptsAtivos = tabs.find(t => t.id === tabAtiva)?.scripts || []

  // Função para copiar script com link substituído
  const copiarScript = async (script: ScriptNutri) => {
    let texto = script.texto
    
    // Substituir [LINK] pelo link real da ferramenta
    if (linkFerramenta) {
      texto = texto.replace('[LINK]', linkFerramenta)
    }
    
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(script.id)
      setTimeout(() => setCopiado(null), 2000)
    } catch (error) {
      // Fallback para navegadores que não suportam clipboard
      const textarea = document.createElement('textarea')
      textarea.value = texto
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiado(script.id)
      setTimeout(() => setCopiado(null), 2000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{ferramentaIcon || config.icon}</span>
            <div>
              <h2 className="font-bold text-lg">Scripts</h2>
              <p className="text-sky-100 text-sm">{ferramentaNome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTabAtiva(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                tabAtiva === tab.id
                  ? 'bg-white text-sky-700 border-b-2 border-sky-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Descrição da Tab */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-xs text-gray-600">
            {tabAtiva === 'lista_quente' && '🔥 Amigos, família e indicações que já têm algum relacionamento com você'}
            {tabAtiva === 'lista_fria' && '❄️ Redes sociais, grupos ou pessoas que não te conhecem'}
            {tabAtiva === 'indicacao' && '🎁 Mensagens para pedir indicações depois que a pessoa usou a ferramenta'}
          </p>
        </div>

        {/* Scripts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {scriptsAtivos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum script disponível para esta categoria.
            </div>
          ) : (
            scriptsAtivos.map(script => (
              <div
                key={script.id}
                className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Título do Script */}
                <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{script.titulo}</h3>
                  <button
                    onClick={() => copiarScript(script)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      copiado === script.id
                        ? 'bg-green-600 text-white'
                        : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                    }`}
                  >
                    {copiado === script.id ? '✓ Copiado!' : '📋 Copiar'}
                  </button>
                </div>

                {/* Texto do Script */}
                <div className="p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                    {script.texto.replace('[LINK]', linkFerramenta || '[SEU LINK AQUI]')}
                  </pre>
                  
                  {/* Mostrar link completo se disponível */}
                  {linkFerramenta && (
                    <div className="mt-3 p-2 bg-sky-50 border border-sky-200 rounded-lg">
                      <p className="text-xs text-sky-700 font-medium mb-1">🔗 Seu link:</p>
                      <p className="text-xs text-sky-800 break-all font-mono">{linkFerramenta}</p>
                    </div>
                  )}
                </div>

                {/* Dica */}
                {script.dica && (
                  <div className="px-4 pb-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                      <span className="text-amber-500 flex-shrink-0">💡</span>
                      <p className="text-xs text-amber-800">{script.dica}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Dica: Substitua [Nome] pelo nome real da pessoa para personalizar a mensagem
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScriptsNutriModal

