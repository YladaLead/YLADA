'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NovaFerramentaNutri() {
  const [tipoFerramenta, setTipoFerramenta] = useState('')
  const [nomeFerramenta, setNomeFerramenta] = useState('')
  const [descricaoFerramenta, setDescricaoFerramenta] = useState('')
  const [personalizacao, setPersonalizacao] = useState({
    cores: 'azul',
    logo: true,
    contato: true,
    especialidade: 'Nutrição Clínica'
  })

  const tiposFerramentas = [
    {
      id: 'quiz-interativo',
      nome: 'Quiz Interativo',
      descricao: 'Perguntas inteligentes que geram resultados personalizados',
      icon: '🧬',
      cor: 'blue',
      leadsMedio: '45/mês',
      conversao: '26%'
    },
    {
      id: 'calculadora',
      nome: 'Calculadora',
      descricao: 'Ferramentas de cálculo com interpretação personalizada',
      icon: '📊',
      cor: 'green',
      leadsMedio: '32/mês',
      conversao: '25%'
    },
    {
      id: 'conteudo-interativo',
      nome: 'Conteúdo Interativo',
      descricao: 'Posts, reels e conteúdo educativo engajante',
      icon: '📱',
      cor: 'purple',
      leadsMedio: '28/mês',
      conversao: '21%'
    },
    {
      id: 'desafio',
      nome: 'Desafio',
      descricao: 'Desafios de 7 ou 21 dias para engajamento',
      icon: '🏆',
      cor: 'orange',
      leadsMedio: '35/mês',
      conversao: '28%'
    },
    {
      id: 'guia-pdf',
      nome: 'Guia PDF',
      descricao: 'Guias educativos em PDF para download',
      icon: '📚',
      cor: 'red',
      leadsMedio: '22/mês',
      conversao: '23%'
    },
    {
      id: 'checklist',
      nome: 'Checklist',
      descricao: 'Listas de verificação interativas',
      icon: '✅',
      cor: 'yellow',
      leadsMedio: '18/mês',
      conversao: '20%'
    }
  ]

  const cores = [
    { id: 'azul', nome: 'Azul', cor: 'bg-blue-500' },
    { id: 'verde', nome: 'Verde', cor: 'bg-green-500' },
    { id: 'roxo', nome: 'Roxo', cor: 'bg-purple-500' },
    { id: 'laranja', nome: 'Laranja', cor: 'bg-orange-500' },
    { id: 'rosa', nome: 'Rosa', cor: 'bg-pink-500' },
    { id: 'azul-marinho', nome: 'Azul Marinho', cor: 'bg-indigo-500' }
  ]

  const especialidades = [
    'Nutrição Clínica',
    'Nutrição Esportiva',
    'Nutrição Materno-Infantil',
    'Nutrição Funcional',
    'Nutrição Oncológica',
    'Nutrição Geriátrica'
  ]

  const handleCriarFerramenta = () => {
    if (!tipoFerramenta || !nomeFerramenta) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    
    // Simular criação da ferramenta
    alert(`Ferramenta "${nomeFerramenta}" criada com sucesso!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/pt/nutri/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Nova Ferramenta NUTRI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/nutri/ferramentas"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar às Ferramentas
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Passo 1: Escolher Tipo de Ferramenta */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Passo 1: Escolha o Tipo de Ferramenta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiposFerramentas.map((tipo) => (
              <div
                key={tipo.id}
                onClick={() => setTipoFerramenta(tipo.id)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  tipoFerramenta === tipo.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">{tipo.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tipo.nome}</h3>
                    <p className="text-sm text-gray-600">{tipo.descricao}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">{tipo.leadsMedio} leads</span>
                  <span className="text-blue-600 font-medium">{tipo.conversao} conversão</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Passo 2: Configurar Ferramenta */}
        {tipoFerramenta && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Passo 2: Configure sua Ferramenta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Ferramenta *
                </label>
                <input
                  type="text"
                  value={nomeFerramenta}
                  onChange={(e) => setNomeFerramenta(e.target.value)}
                  placeholder="Ex: Quiz do Metabolismo"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidade
                </label>
                <select
                  value={personalizacao.especialidade}
                  onChange={(e) => setPersonalizacao({...personalizacao, especialidade: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {especialidades.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição da Ferramenta
              </label>
              <textarea
                value={descricaoFerramenta}
                onChange={(e) => setDescricaoFerramenta(e.target.value)}
                rows={3}
                placeholder="Descreva o que sua ferramenta faz e que valor oferece..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Passo 3: Personalização */}
        {tipoFerramenta && nomeFerramenta && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Passo 3: Personalize sua Ferramenta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor do Tema
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {cores.map((cor) => (
                    <div
                      key={cor.id}
                      onClick={() => setPersonalizacao({...personalizacao, cores: cor.id})}
                      className={`p-3 rounded-lg border-2 cursor-pointer ${
                        personalizacao.cores === cor.id 
                          ? 'border-blue-500' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className={`w-full h-8 rounded ${cor.cor} mb-2`}></div>
                      <p className="text-xs text-center text-gray-600">{cor.nome}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elementos Incluídos
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={personalizacao.logo}
                      onChange={(e) => setPersonalizacao({...personalizacao, logo: e.target.checked})}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Logo YLADA</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={personalizacao.contato}
                      onChange={(e) => setPersonalizacao({...personalizacao, contato: e.target.checked})}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Informações de Contato</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {tipoFerramenta && nomeFerramenta && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Preview da sua Ferramenta</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{nomeFerramenta}</h3>
                <p className="text-gray-600 mb-4">{descricaoFerramenta || 'Descrição da ferramenta aparecerá aqui'}</p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-2">Preview da ferramenta</p>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-400">Conteúdo da ferramenta será gerado aqui</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Link personalizado: <span className="font-mono bg-gray-200 px-2 py-1 rounded">ylada.com/{nomeFerramenta.toLowerCase().replace(/\s+/g, '-')}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ações */}
        {tipoFerramenta && nomeFerramenta && (
          <div className="flex justify-end space-x-4">
            <Link
              href="/pt/nutri/ferramentas"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              onClick={handleCriarFerramenta}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Ferramenta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
