'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'
import { getTemplateBenefits } from '@/lib/template-benefits'

interface StoryTela {
  titulo: string
  texto: string
}

interface Resultado {
  nivel: 'engajamentoBasico' | 'engajamentoModerado' | 'engajamentoAvancado'
  roteiro: StoryTela[]
}

export default function StoryInterativo({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    objetivo: '', // leads|engajamento|educacao
    experiencia: '', // iniciante|intermediario|avancado
    tema: 'hidratação',
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const iniciar = () => setEtapa('formulario')

  const gerarRoteiro = () => {
    if (!dados.objetivo || !dados.experiencia) {
      alert('Preencha objetivo e experiência.')
      return
    }

    let nivel: Resultado['nivel'] = 'engajamentoBasico'
    if (dados.experiencia === 'intermediario') nivel = 'engajamentoModerado'
    if (dados.experiencia === 'avancado') nivel = 'engajamentoAvancado'

    const tema = dados.tema
    const roteiroBase: Record<Resultado['nivel'], StoryTela[]> = {
      engajamentoBasico: [
        { titulo: `Problema comum (${tema})`, texto: 'Você também passa por isso?' },
        { titulo: 'Dica prática', texto: 'Aplicação simples para hoje' },
        { titulo: 'Chamada', texto: 'Responda a enquete ou me mande um DM' },
      ],
      engajamentoModerado: [
        { titulo: 'Mito x Realidade', texto: `Um erro comum sobre ${tema}` },
        { titulo: 'Micro-aula', texto: '1 dica prática com passo a passo' },
        { titulo: 'Prova social', texto: 'Print/resultado de cliente' },
        { titulo: 'CTA', texto: 'Quer receber checklist? Responda aqui' },
      ],
      engajamentoAvancado: [
        { titulo: 'Hook forte', texto: `O que ninguém te conta sobre ${tema}` },
        { titulo: 'Dor', texto: 'Consequências do erro' },
        { titulo: 'Autoridade', texto: 'Por que confiar neste método' },
        { titulo: 'Prova', texto: 'Caso real ou métrica' },
        { titulo: 'Valor', texto: 'Checklist/roteiro gratuito' },
        { titulo: 'CTA', texto: 'Link/DM para receber o material' },
      ],
    }

    const roteiro = roteiroBase[nivel]
    setResultado({ nivel, roteiro })
    setDiagnostico(getDiagnostico('template-story-interativo', 'nutri', nivel) )
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-fuchsia-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Story Interativo"
        defaultDescription="Monte stories com roteiro pronto e CTA"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          const templateBenefits = getTemplateBenefits('story-interativo')
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="📱"
              defaultTitle="Story Interativo"
              defaultDescription={<p className="text-gray-600">Crie um roteiro de stories em 1 minuto</p>}
              discover={templateBenefits.discover}
              benefits={templateBenefits.whyUse}
              onStart={iniciar}
              buttonText="📱 Começar Story"
            />
          )
        })()}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo</label>
                <select
                  value={dados.objetivo}
                  onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="engajamento">Engajamento</option>
                  <option value="leads">Captura de Leads</option>
                  <option value="educacao">Educação</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experiência</label>
                <select
                  value={dados.experiencia}
                  onChange={(e) => setDados({ ...dados, experiencia: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                <select
                  value={dados.tema}
                  onChange={(e) => setDados({ ...dados, tema: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="hidratação">Hidratação</option>
                  <option value="proteína">Proteína</option>
                  <option value="planejamento">Planejamento de refeições</option>
                  <option value="saciedade">Saciedade</option>
                </select>
              </div>
            </div>

            <button
              onClick={gerarRoteiro}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all hover:scale-[1.02] shadow-lg"
              style={{ backgroundColor: '#8b5cf6' }}
            >
              Gerar Roteiro →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-purple-300">
              <h2 className="text-2xl font-bold mb-4">Roteiro de Stories</h2>
              <ol className="space-y-3 list-decimal list-inside">
                {resultado.roteiro.map((tela, i) => (
                  <li key={i} className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900">{tela.titulo}</p>
                    <p className="text-gray-700">{tela.texto}</p>
                  </li>
                ))}
              </ol>
            </div>

            {diagnostico && (
              <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Diretriz Estratégica</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4"><p className="whitespace-pre-line">{diagnostico.diagnostico}</p></div>
                  <div className="bg-white rounded-lg p-4"><p className="whitespace-pre-line">{diagnostico.causaRaiz}</p></div>
                  <div className="bg-white rounded-lg p-4"><p className="whitespace-pre-line">{diagnostico.acaoImediata}</p></div>
                  <div className="bg-white rounded-lg p-4"><p className="whitespace-pre-line">{diagnostico.plano7Dias}</p></div>
                </div>
              </div>
            )}

            {/* Formulário de coleta de dados temporariamente desabilitado */}
            {/* <LeadCapturePostResult
              config={config}
              ferramenta="Story Interativo"
              resultadoTexto={`Nível: ${resultado.nivel}`}
              mensagemConvite="📖 Quer continuar sua jornada de transformação?"
              beneficios={[
                'História personalizada para seu momento',
                'Conteúdo exclusivo adaptado ao seu perfil',
                'Acompanhamento da sua evolução',
                'Novos capítulos conforme progresso'
              ]}
            /> */}
          </div>
        )}
      </main>
    </div>
  )
}
