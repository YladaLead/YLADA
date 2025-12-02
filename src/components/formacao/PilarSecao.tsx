'use client'

import Link from 'next/link'
import type { PilarSecao as PilarSecaoType } from '@/types/pilares'

interface PilarSecaoProps {
  secao: PilarSecaoType
  pilarId: string
}

export default function PilarSecao({ secao, pilarId }: PilarSecaoProps) {
  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
      {/* Título da Seção */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {secao.titulo}
      </h3>

      {/* Conteúdo da Seção */}
      <div className="prose prose-lg max-w-none mb-6">
        {secao.conteudo ? (
          <div className="text-gray-700 leading-relaxed">
            {secao.conteudo.split('\n').map((line, index) => {
              const trimmedLine = line.trim()
              
              // Detectar emojis de caixas (🔹)
              if (trimmedLine.startsWith('🔹')) {
                return (
                  <div key={index} className="ml-6 mb-3 flex items-start">
                    <span className="mr-2 text-blue-600 text-lg">🔹</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">
                        {trimmedLine.substring(1).trim().split('\n')[0]}
                      </p>
                      {trimmedLine.includes('\n') && (
                        <p className="text-gray-700 text-sm">
                          {trimmedLine.substring(1).trim().split('\n').slice(1).join(' ')}
                        </p>
                      )}
                    </div>
                  </div>
                )
              }
              
              // Detectar listas com bullet points
              if (trimmedLine.startsWith('•')) {
                return (
                  <div key={index} className="ml-6 mb-2 flex items-start">
                    <span className="mr-2 text-blue-600">•</span>
                    <span>{trimmedLine.substring(1).trim()}</span>
                  </div>
                )
              }
              
              // Detectar checklists (☐)
              if (trimmedLine.startsWith('☐')) {
                return (
                  <div key={index} className="ml-6 mb-2 flex items-start">
                    <span className="mr-2 text-gray-400">☐</span>
                    <span>{trimmedLine.substring(1).trim()}</span>
                  </div>
                )
              }
              
              // Parágrafos normais
              if (trimmedLine) {
                return (
                  <p key={index} className="mb-4">
                    {trimmedLine}
                  </p>
                )
              }
              
              // Linhas vazias (espaçamento)
              return <div key={index} className="h-2" />
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-center italic">
              Conteúdo desta seção será preenchido em breve.
            </p>
          </div>
        )}
      </div>

      {/* Checklist Items (se houver) */}
      {secao.checklist_items && secao.checklist_items.length > 0 && (
        <div className="mb-4 bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
          <h4 className="font-semibold text-gray-900 mb-3">✔ Checklist</h4>
          <div className="space-y-2">
            {secao.checklist_items.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercícios Relacionados */}
      {secao.exercicios_relacionados && secao.exercicios_relacionados.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">💪 Exercícios Relacionados</h4>
          <div className="flex flex-wrap gap-2">
            {secao.exercicios_relacionados.map((exercicioId) => {
              // Mapear IDs para rotas corretas
              const getExercicioRoute = (id: string) => {
                if (id === 'g-de-gerar') return '/pt/nutri/metodo/exercicios/gsal-gerar'
                if (id === 's-de-servir') return '/pt/nutri/metodo/exercicios/gsal-servir'
                if (id === 'a-de-acompanhar') return '/pt/nutri/metodo/exercicios/gsal-acompanhar'
                if (id === 'l-de-lucrar') return '/pt/nutri/metodo/exercicios/gsal-lucrar'
                if (id === 'agenda-estrategica') return '/pt/nutri/metodo/painel/agenda'
                if (id === 'distribuicao-10-10-10') return '/pt/nutri/metodo/exercicios/distribuicao-101010'
                if (id === 'gestao-leads') return '/pt/nutri/metodo/exercicios/gestao-leads'
                if (id === 'roteiro-atendimento') return '/pt/nutri/metodo/exercicios/atendimento'
                return `/pt/nutri/metodo/exercicios/${id}`
              }

              const getExercicioLabel = (id: string) => {
                const labels: Record<string, string> = {
                  'g-de-gerar': 'G de Gerar',
                  's-de-servir': 'S de Servir',
                  'a-de-acompanhar': 'A de Acompanhar',
                  'l-de-lucrar': 'L de Lucrar',
                  'agenda-estrategica': 'Agenda Estratégica',
                  'distribuicao-10-10-10': 'Distribuição 10-10-10',
                  'gestao-leads': 'Gestão de Leads',
                  'roteiro-atendimento': 'Roteiro de Atendimento'
                }
                return labels[id] || `Exercício ${id}`
              }

              return (
                <Link
                  key={exercicioId}
                  href={getExercicioRoute(exercicioId)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Acessar {getExercicioLabel(exercicioId)} →
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Ferramentas Relacionadas */}
      {secao.ferramentas_relacionadas && secao.ferramentas_relacionadas.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">🛠️ Ferramentas Relacionadas</h4>
          <div className="flex flex-wrap gap-2">
            {secao.ferramentas_relacionadas.map((ferramentaId) => {
              // Mapear IDs para rotas corretas
              const getFerramentaRoute = (id: string) => {
                if (id === 'gestao-leads') return '/pt/nutri/metodo/exercicios/gestao-leads'
                if (id === 'modelo-pos-atendimento') return '/pt/nutri/metodo/exercicios/atendimento'
                return `/pt/nutri/metodo/ferramentas/${id}`
              }

              const getFerramentaLabel = (id: string) => {
                const labels: Record<string, string> = {
                  'avaliacoes': 'Avaliações',
                  'quizzes': 'Quizzes',
                  'calculadoras': 'Calculadoras',
                  'scripts': 'Scripts',
                  'stories': 'Stories',
                  'objecoes': 'Lista de Objeções',
                  'gestao-leads': 'Gestão de Leads',
                  'modelo-pos-atendimento': 'Modelo Pós-Atendimento'
                }
                return labels[id] || `Ferramenta ${id}`
              }

              return (
                <Link
                  key={ferramentaId}
                  href={getFerramentaRoute(ferramentaId)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Acessar {getFerramentaLabel(ferramentaId)} →
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

