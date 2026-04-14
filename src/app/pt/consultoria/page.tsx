'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

type ConsultoriaForm = {
  nome: string
  whatsapp: string
  area: string
  principalDor: string
  meta30dias: string
}

const WHATSAPP_NUMBER = '5519996049800'

export default function ConsultoriaPage() {
  const [form, setForm] = useState<ConsultoriaForm>({
    nome: '',
    whatsapp: '',
    area: '',
    principalDor: '',
    meta30dias: '',
  })

  const whatsappHref = useMemo(() => {
    const linhas = [
      'Olá! Quero saber mais sobre a Consultoria Especializada YLADA.',
      '',
      `Nome: ${form.nome || '-'}`,
      `WhatsApp: ${form.whatsapp || '-'}`,
      `Área/Segmento: ${form.area || '-'}`,
      `Principal dor: ${form.principalDor || '-'}`,
      `Meta para 30 dias: ${form.meta30dias || '-'}`,
    ]
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(linhas.join('\n'))}`
  }, [form])

  const canSubmit =
    form.nome.trim().length > 1 &&
    form.whatsapp.trim().length >= 8 &&
    form.area.trim().length > 1 &&
    form.principalDor.trim().length > 5 &&
    form.meta30dias.trim().length > 5

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <span className="text-sm text-gray-500">Consultoria humana</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Consultoria Especializada YLADA
          </h1>
          <p className="text-gray-600">
            Impulsione resultados com ajustes feitos por especialistas no seu segmento.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>✓ Ajustes de posicionamento, mensagem e conversão</li>
            <li>✓ Plano objetivo para 30 dias com prioridades claras</li>
            <li>✓ Direcionamento prático para executar sem travar</li>
          </ul>
          <p className="mt-4 text-sm font-semibold text-emerald-700">
            Você vai ativar previsibilidade no seu crescimento.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Pré-diagnóstico rápido
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => setForm((s) => ({ ...s, nome: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Seu WhatsApp"
              value={form.whatsapp}
              onChange={(e) => setForm((s) => ({ ...s, whatsapp: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Área/segmento (ex: nutri, estética, psi)"
              value={form.area}
              onChange={(e) => setForm((s) => ({ ...s, area: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg sm:col-span-2"
            />
            <textarea
              placeholder="Qual é a sua principal dor hoje?"
              value={form.principalDor}
              onChange={(e) => setForm((s) => ({ ...s, principalDor: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg sm:col-span-2 min-h-[90px]"
            />
            <textarea
              placeholder="O que você quer resolver nos próximos 30 dias?"
              value={form.meta30dias}
              onChange={(e) => setForm((s) => ({ ...s, meta30dias: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg sm:col-span-2 min-h-[90px]"
            />
          </div>

          <div className="mt-5">
            <a
              href={canSubmit ? whatsappHref : '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!canSubmit) e.preventDefault()
              }}
              aria-disabled={!canSubmit}
              className={`inline-flex w-full sm:w-auto justify-center items-center px-5 py-3 rounded-xl text-white font-semibold ${
                canSubmit ? 'bg-green-600 hover:bg-green-700' : 'bg-green-400 cursor-not-allowed'
              }`}
            >
              Quero falar com especialista no WhatsApp
            </a>
            {!canSubmit && (
              <p className="text-xs text-gray-500 mt-2">
                Preencha os campos acima para liberar o envio ao WhatsApp.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

