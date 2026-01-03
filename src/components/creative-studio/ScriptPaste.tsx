'use client'

import { useState } from 'react'
import { FileText, Sparkles, Loader2, Wand2 } from 'lucide-react'

interface ScriptPasteProps {
  onScriptPasted: (script: string) => void
  onRequestScript?: () => void
  isLoading?: boolean
  area?: string
  purpose?: string
}

export function ScriptPaste({ onScriptPasted, onRequestScript, isLoading = false, area = 'nutri', purpose = 'quick-ad' }: ScriptPasteProps) {
  const [script, setScript] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRequestingScript, setIsRequestingScript] = useState(false)

  const exampleScript = `0-5s: Hook - Você está cansada de olhar para uma agenda vazia?
5-15s: Problema - Consultas não marcadas significam menos clientes e menos renda
15-25s: Solução - Com YLADA NUTRI você tem uma plataforma que ajuda a lotar sua agenda
25-30s: CTA - Acesse /pt/nutri agora e comece a mudar sua história!`

  const handleRequestScript = async () => {
    if (onRequestScript) {
      setIsRequestingScript(true)
      await onRequestScript()
      setIsRequestingScript(false)
    }
  }

  const handlePaste = () => {
    if (script.trim()) {
      onScriptPasted(script.trim())
      setScript('')
      setIsExpanded(false)
    }
  }

  if (!isExpanded) {
    return (
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Criar Vídeo do Zero</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Cole seu roteiro completo ou peça para eu criar um roteiro para você!
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleRequestScript}
            disabled={isRequestingScript || isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequestingScript ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Criar Roteiro para Mim
              </>
            )}
          </button>
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Já Tenho Roteiro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Cole seu Roteiro</h3>
        </div>
        <button
          onClick={() => {
            setIsExpanded(false)
            setScript('')
          }}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Fechar
        </button>
      </div>
      
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder={exampleScript}
        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm font-mono"
      />
      
      <div className="mt-2 text-xs text-gray-500 mb-3">
        💡 Dica: Cole o roteiro completo com timestamps (ex: 0-5s: Hook - texto...)
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handlePaste}
          disabled={!script.trim() || isLoading}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Criar Vídeo Automaticamente
            </>
          )}
        </button>
      </div>
    </div>
  )
}

