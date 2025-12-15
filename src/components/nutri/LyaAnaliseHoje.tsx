'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LyaAnalise {
  foco_prioritario: string
  acoes_recomendadas: string[]
  onde_aplicar: string
  metrica_sucesso: string
  link_interno: string
  mensagem_completa?: string
  created_at?: string
}

export default function LyaAnaliseHoje() {
  const [analise, setAnalise] = useState<LyaAnalise | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerando, setRegenerando] = useState(false)
  const [isPrimeiraAnalise, setIsPrimeiraAnalise] = useState(false)

  useEffect(() => {
    const carregarAnalise = async () => {
      try {
        // Primeiro, tentar buscar análise existente
        const getResponse = await fetch('/api/nutri/lya/analise', {
          credentials: 'include',
          method: 'GET'
        })
        
        if (getResponse.ok) {
          const getData = await getResponse.json()
          
          // Se tem análise no formato novo, usar
          if (getData.analise && getData.analise.foco_prioritario && 
              getData.analise.acoes_recomendadas && getData.analise.acoes_recomendadas.length > 0) {
            console.log('✅ [LYA] Análise encontrada no formato novo')
            setAnalise(getData.analise)
            // Verificar se é primeira análise (criada há menos de 1 hora)
            if (getData.analise.created_at) {
              const dataCriacao = new Date(getData.analise.created_at)
              const agora = new Date()
              const diffHoras = (agora.getTime() - dataCriacao.getTime()) / (1000 * 60 * 60)
              setIsPrimeiraAnalise(diffHoras < 1)
            }
            setLoading(false)
            return
          }
          
          // Se não tem análise ou está no formato antigo, gerar nova
          console.log('🔄 [LYA] Gerando nova análise (formato antigo ou ausente)...')
          setRegenerando(true)
          const postResponse = await fetch('/api/nutri/lya/analise', {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          if (postResponse.ok) {
            const postData = await postResponse.json()
            if (postData.analise && postData.analise.foco_prioritario) {
              console.log('✅ [LYA] Nova análise gerada com sucesso')
              setAnalise(postData.analise)
              setIsPrimeiraAnalise(true) // Se está gerando nova, é primeira análise
            } else {
              console.warn('⚠️ [LYA] Nova análise não retornou formato correto')
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar análise da LYA:', error)
      } finally {
        setLoading(false)
        setRegenerando(false)
      }
    }

    carregarAnalise()
  }, [])

  const regenerarAnalise = async () => {
    setRegenerando(true)
    try {
      const response = await fetch('/api/nutri/lya/analise', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.analise && data.analise.foco_prioritario) {
          setAnalise(data.analise)
          setIsPrimeiraAnalise(false) // Não é mais primeira após regenerar
        }
      }
    } catch (error) {
      console.error('❌ Erro ao regenerar análise:', error)
    } finally {
      setRegenerando(false)
    }
  }

  // Estado de loading - sempre mostrar
  if (loading || regenerando) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            LYA
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              LYA Mentora
            </h3>
            <p className="text-sm text-gray-600">
              {regenerando ? 'Regenerando análise...' : 'Analisando seu perfil...'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-gray-700">
              {regenerando 
                ? 'A LYA está analisando seu diagnóstico atualizado...' 
                : 'A LYA está analisando seu diagnóstico e preparando sua orientação personalizada...'}
            </p>
          </div>
          {regenerando && (
            <p className="text-xs text-gray-500 mt-2">
              Isso pode levar alguns segundos. Por favor, aguarde.
            </p>
          )}
        </div>
      </div>
    )
  }

  // Se não tem análise válida, mostrar card para gerar
  if (!analise || !analise.foco_prioritario || !analise.acoes_recomendadas || analise.acoes_recomendadas.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            LYA
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              LYA Mentora
            </h3>
            <p className="text-sm text-gray-600">
              Primeira Análise
            </p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-4">
            A LYA está pronta para analisar seu perfil Nutri-Empresária e criar sua orientação estratégica personalizada.
          </p>
          <button
            onClick={regenerarAnalise}
            disabled={regenerando}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {regenerando ? 'Gerando análise...' : 'Gerar minha primeira análise'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-2 ${isPrimeiraAnalise ? 'border-blue-400 shadow-lg' : 'border-blue-200'} rounded-xl p-6 mb-8 shadow-sm`}>
      {/* Badge de Primeira Análise */}
      {isPrimeiraAnalise && (
        <div className="mb-4 -mt-2 -mx-2">
          <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-2">
            <span>✨</span>
            <span>Primeira Análise da LYA — Baseada no seu diagnóstico</span>
          </div>
        </div>
      )}
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            LYA
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              LYA Mentora
            </h3>
            <p className="text-sm text-gray-600">
              {isPrimeiraAnalise ? 'Sua primeira análise personalizada' : 'Análise Estratégica — Hoje'}
            </p>
          </div>
        </div>
        {!isPrimeiraAnalise && (
          <button
            onClick={regenerarAnalise}
            disabled={regenerando}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline disabled:opacity-50"
            title="Atualizar análise baseada no seu perfil Nutri-Empresária atual"
          >
            Atualizar análise
          </button>
        )}
      </div>

      {/* Bloco 1: Foco Prioritário */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🎯</span>
          <h4 className="font-semibold text-gray-900">FOCO PRIORITÁRIO</h4>
        </div>
        <p className="text-gray-700 pl-8">
          {analise.foco_prioritario}
        </p>
      </div>

      {/* Bloco 2: Ação Recomendada */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">✅</span>
          <h4 className="font-semibold text-gray-900">AÇÃO DE HOJE</h4>
        </div>
        <ul className="space-y-2 pl-8">
          {analise.acoes_recomendadas.map((acao, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <span className="text-gray-400 mt-1">☐</span>
              <span>{acao}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bloco 3: Onde Aplicar */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📍</span>
          <h4 className="font-semibold text-gray-900">ONDE APLICAR</h4>
        </div>
        <p className="text-gray-700 pl-8">
          {analise.onde_aplicar}
        </p>
      </div>

      {/* Bloco 4: Métrica de Sucesso */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📊</span>
          <h4 className="font-semibold text-gray-900">MÉTRICA DE SUCESSO</h4>
        </div>
        <p className="text-gray-700 pl-8">
          {analise.metrica_sucesso}
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-200">
        <Link
          href={analise.link_interno}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-2"
        >
          Ir para a ação →
        </Link>
        <button
          className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          onClick={() => {
            // Abrir chat da LYA (o widget já está na página)
            const chatButton = document.querySelector('[aria-label="Abrir chat com Mentora LYA"]') as HTMLElement
            if (chatButton) {
              chatButton.click()
            } else {
              // Fallback: scroll até o widget se existir
              const chatWidget = document.querySelector('[class*="LyaChatWidget"]')
              if (chatWidget) {
                chatWidget.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            }
          }}
        >
          Falar com a LYA
        </button>
      </div>

      {/* Microcopy */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        A LYA usa seu perfil e seu progresso para te orientar com precisão.
      </p>
    </div>
  )
}
