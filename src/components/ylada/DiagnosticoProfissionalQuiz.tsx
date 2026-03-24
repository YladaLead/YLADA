'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import { DIAGNOSTICO_PROFISSIONAL_QUESTIONS } from '@/config/diagnostico-profissional'

interface DiagnosticoProfissionalQuizProps {
  areaCodigo: string
  areaLabel: string
}

const STAGE_NAMES: Record<string, string> = {
  posicionamento: 'Posicionamento',
  atracao: 'Captação',
  diagnostico: 'Diagnóstico',
  conversa: 'Conversa',
  clientes: 'Clientes',
  fidelizacao: 'Fidelização',
  indicacoes: 'Indicações',
}

export default function DiagnosticoProfissionalQuiz({ areaCodigo, areaLabel }: DiagnosticoProfissionalQuizProps) {
  const fetchAuth = useAuthenticatedFetch()
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const segment = areaCodigo === 'ylada' ? 'ylada' : areaCodigo

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{
    profile_title: string
    main_blocker: string
    growth_potential: string
    recommended_strategy: string
    next_action: string
    growth_stage: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = DIAGNOSTICO_PROFISSIONAL_QUESTIONS[step]
  const isLastStep = step === DIAGNOSTICO_PROFISSIONAL_QUESTIONS.length - 1

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    setError(null)
  }

  const handleNext = () => {
    if (!currentQuestion || !answers[currentQuestion.id]) {
      setError('Selecione uma opção para continuar.')
      return
    }
    if (isLastStep) {
      handleSubmit()
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1))
    setError(null)
  }

  const handleSubmit = async () => {
    if (!currentQuestion || !answers[currentQuestion.id]) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetchAuth('/api/ylada/diagnostico-profissional/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, segment }),
      })
      const json = await res.json()
      if (!json.success) {
        setError(json.error || 'Erro ao processar diagnóstico.')
        return
      }
      setResult(json.result)
    } catch (e) {
      setError('Erro ao enviar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-6">
          <h2 className="text-lg font-semibold text-green-800">Seu diagnóstico</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p><span className="font-medium text-gray-700">Perfil:</span> {result.profile_title}</p>
            <p><span className="font-medium text-gray-700">Bloqueio principal:</span> {result.main_blocker}</p>
            <p><span className="font-medium text-gray-700">Potencial:</span> {result.growth_potential}</p>
            <p><span className="font-medium text-gray-700">Estratégia recomendada:</span> {result.recommended_strategy}</p>
            <p><span className="font-medium text-gray-700">Próximo passo:</span> {result.next_action}</p>
            <p>
              <span className="font-medium text-gray-700">Etapa atual:</span>{' '}
              {STAGE_NAMES[result.growth_stage] ?? result.growth_stage}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`${prefix}/crescimento`}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Ver sistema de crescimento
          </Link>
          <Link
            href={`${prefix}/home`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Conversar com o Noel
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Diagnóstico do seu negócio</h1>
        <p className="mt-1 text-gray-600">
          Responda 4 perguntas rápidas para entender seu perfil estratégico e próximo movimento.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm text-gray-500">
          Pergunta {step + 1} de {DIAGNOSTICO_PROFISSIONAL_QUESTIONS.length}
        </p>
        <h3 className="mb-4 font-medium text-gray-900">{currentQuestion?.label}</h3>
        <div className="space-y-2">
          {currentQuestion?.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(currentQuestion.id, opt.value)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                answers[currentQuestion.id] === opt.value
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Voltar
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : isLastStep ? 'Ver resultado' : 'Continuar'}
          </button>
        </div>
      </div>

      <Link href={`${prefix}/crescimento`} className="text-sm text-gray-500 hover:underline">
        ← Voltar ao sistema de crescimento
      </Link>
    </div>
  )
}
