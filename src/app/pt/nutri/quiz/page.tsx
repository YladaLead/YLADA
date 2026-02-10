'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Grupo = 'recem_formada' | 'agenda_instavel' | 'sobrecarregada' | 'financeiro_travado' | 'confusa'

const PERGUNTA_1 = {
  titulo: 'Qual frase mais representa seu momento atual?',
  opcoes: [
    { valor: 'recem_formada' as Grupo, label: 'Sou recém-formada e não sei por onde começar' },
    { valor: 'agenda_instavel' as Grupo, label: 'Já atendo, mas minha agenda oscila muito' },
    { valor: 'sobrecarregada' as Grupo, label: 'Atendo bastante, mas me sinto sobrecarregada' },
    { valor: 'financeiro_travado' as Grupo, label: 'Trabalho muito e sinto que ganho menos do que deveria' },
    { valor: 'confusa' as Grupo, label: 'Quero crescer, mas me sinto confusa sobre o que fazer' },
  ],
}

// Perguntas comuns do grupo (simplificado: mesmas para todos; depois pode ramificar por grupo)
const PERGUNTAS_GRUPO = [
  { id: 'q2', titulo: 'Hoje, você sente que sabe exatamente para quem quer atender?', opcoes: ['Sim', 'Mais ou menos', 'Não'] },
  { id: 'q3', titulo: 'Quando pensa em postar no Instagram, você sente:', opcoes: ['Clareza', 'Dúvida', 'Trava total'] },
  { id: 'q4', titulo: 'Sua maior dificuldade hoje é:', opcoes: ['Me posicionar', 'Atrair pacientes', 'Organizar minha rotina'] },
]

// Textos de resultado por grupo (estrutura: acolhimento + problema + esperança + CTA)
const RESULTADO_POR_GRUPO: Record<Grupo, { titulo: string; subtitulo: string; bullets: string[]; esperanca: string }> = {
  recem_formada: {
    titulo: 'Você não está atrasada. Você está sem mapa.',
    subtitulo: 'O risco não é errar — é passar anos postando e se esforçando sem construir base. Com estrutura desde o início, você evita anos de tentativa e erro.',
    bullets: [
      'Falta clareza de posicionamento',
      'Dúvida na hora de postar',
      'Rotina ainda não organizada',
    ],
    esperanca: 'Você já tem o que precisa. O que falta é um método que organize o primeiro passo.',
  },
  agenda_instavel: {
    titulo: 'Seu principal travamento não é falta de pacientes. É falta de sistema.',
    subtitulo: 'Pelas suas respostas, você posta com boa intenção mas sem um caminho claro do post até a consulta. Isso gera meses cheios e meses vazios.',
    bullets: [
      'Posts não conduzem para conversa',
      'Dependência de indicação',
      'Falta previsibilidade na agenda',
    ],
    esperanca: 'Com uma estrutura simples, seus posts viram convites e sua agenda ganha mais previsibilidade.',
  },
  sobrecarregada: {
    titulo: 'Você não tem um problema de esforço. Tem um problema de rotina estratégica.',
    subtitulo: 'Trabalhar muito e decidir pouco gera cansaço e sensação de estar sempre correndo. O que falta é direção, não mais horas.',
    bullets: [
      'Rotina sem método',
      'Improviso no que postar',
      'Sensação de apagar incêndio',
    ],
    esperanca: 'Com um sistema que organize o que postar e quando, você trabalha com mais foco e menos desgaste.',
  },
  financeiro_travado: {
    titulo: 'Você já tem agenda. O problema é que ela não reflete seu valor.',
    subtitulo: 'Quando o posicionamento não sustenta o preço, a nutri trabalha muito e cresce pouco. Isso é perda silenciosa.',
    bullets: [
      'Preço abaixo do que deveria',
      'Conteúdo que informa mas não valoriza',
      'Falta clareza de posicionamento premium',
    ],
    esperanca: 'Ajustes na comunicação e no posicionamento podem fazer sua agenda refletir melhor o valor do seu trabalho.',
  },
  confusa: {
    titulo: 'Você não está sozinha. Você está sem direção.',
    subtitulo: 'Fazer tudo sozinha, sem clareza do próximo passo, gera ansiedade ou estagnação. O que falta é um mapa, não mais esforço.',
    bullets: [
      'Falta clareza do próximo passo',
      'Sensação de estar parada ou perdida',
      'Muitas coisas ao mesmo tempo',
    ],
    esperanca: 'Existe um próximo passo possível. O primeiro é ter clareza do que mudar e por onde começar.',
  },
}

export default function QuizNutriPage() {
  const [step, setStep] = useState<'q1' | 'group' | 'capture' | 'result'>('q1')
  const [grupo, setGrupo] = useState<Grupo | null>(null)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleQ1 = (valor: Grupo) => {
    setRespostas((r) => ({ ...r, q1: valor }))
    setGrupo(valor)
    setStep('group')
  }

  const handleGroupAnswer = (id: string, valor: string) => {
    setRespostas((r) => ({ ...r, [id]: valor }))
    const current = PERGUNTAS_GRUPO.findIndex((p) => p.id === id)
    if (current >= 0 && current < PERGUNTAS_GRUPO.length - 1) {
      // próximo
    } else {
      setStep('capture')
    }
  }

  const allGroupAnswered = PERGUNTAS_GRUPO.every((p) => respostas[p.id])
  const goToResult = () => {
    if (!allGroupAnswered) return
    setStep('capture')
  }

  const submitCapture = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!grupo) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/nutri/quiz/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim() || null,
          email: email.trim(),
          telefone: telefone.trim() || null,
          grupo,
          respostas,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar')
      setStep('result')
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const skipCapture = () => {
    if (grupo) setStep('result')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur h-14 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/pt/nutri">
            <Image src="/images/logo/nutri-horizontal.png" alt="YLADA Nutri" width={140} height={42} className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-xl mx-auto">
        {/* —— Step: Pergunta 1 (autossegmentação) —— */}
        {step === 'q1' && (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 mb-2">
              Em que fase está sua carreira como nutricionista hoje?
            </h1>
            <p className="text-gray-600 mb-8">
              Descubra em 2 minutos o que está travando sua agenda e qual é o próximo passo certo para você.
            </p>
            <p className="font-medium text-gray-900 mb-4">{PERGUNTA_1.titulo}</p>
            <ul className="space-y-3">
              {PERGUNTA_1.opcoes.map((opt) => (
                <li key={opt.valor}>
                  <button
                    type="button"
                    onClick={() => handleQ1(opt.valor)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition"
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* —— Step: Perguntas do grupo —— */}
        {step === 'group' && grupo && (
          <>
            <div className="mb-6">
              <span className="text-sm text-gray-500">Pergunta 2 de 4</span>
            </div>
            {PERGUNTAS_GRUPO.map((p) => (
              <div key={p.id} className="mb-8">
                <p className="font-medium text-gray-900 mb-3">{p.titulo}</p>
                <ul className="space-y-2">
                  {p.opcoes.map((opt) => (
                    <li key={opt}>
                      <button
                        type="button"
                        onClick={() => handleGroupAnswer(p.id, opt)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border transition ${
                          respostas[p.id] === opt
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              type="button"
              onClick={goToResult}
              disabled={!allGroupAnswered}
              className="mt-4 w-full py-3 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-50"
            >
              Ver meu resultado
            </button>
          </>
        )}

        {/* —— Step: Captura (opcional) —— */}
        {step === 'capture' && grupo && (
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Quase lá</h2>
            <p className="text-gray-600 mb-6">
              Deixe seu e-mail para receber seu diagnóstico por e-mail e um conteúdo exclusivo.
            </p>
            <form onSubmit={submitCapture} className="space-y-4">
              <input
                type="text"
                placeholder="Nome (opcional)"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
              />
              <input
                type="email"
                placeholder="E-mail *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
              />
              <input
                type="tel"
                placeholder="WhatsApp (opcional)"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={skipCapture}
                  className="flex-1 py-2.5 text-gray-600 border border-gray-200 rounded-lg"
                >
                  Pular
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-70">
                  {loading ? 'Enviando…' : 'Ver resultado'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* —— Step: Resultado + CTA —— */}
        {step === 'result' && grupo && (
          <div className="space-y-6">
            <p className="text-sm font-medium text-amber-700">Seu diagnóstico</p>
            <h2 className="text-2xl font-bold text-gray-900">{RESULTADO_POR_GRUPO[grupo].titulo}</h2>
            <p className="text-gray-700">{RESULTADO_POR_GRUPO[grupo].subtitulo}</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {RESULTADO_POR_GRUPO[grupo].bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <p className="text-gray-700 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 rounded-r">
              {RESULTADO_POR_GRUPO[grupo].esperanca}
            </p>
            <p className="text-sm text-gray-600">
              Isso não é culpa sua. Nutricionistas não aprendem isso na faculdade.
            </p>
            <Link
              href="/pt/nutri/quiz/video"
              className="block w-full py-4 rounded-xl bg-blue-600 text-white text-center font-medium hover:bg-blue-700"
            >
              Quero entender como corrigir isso
            </Link>
            <p className="text-xs text-gray-500 text-center">
              Existe um sistema que organiza o que postar, qual link usar e como conduzir até a consulta. Conheça o Ilada Nutri.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
