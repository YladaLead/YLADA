'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Copy, Play, Sparkles } from 'lucide-react'
import { ScriptGenerator } from '@/components/creative-studio/ScriptGenerator'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'

// Templates de anúncios pré-definidos
const adTemplates: Record<string, {
  title: string
  description: string
  type: string
  script: string[]
  hook: string
  cta: string
  tips: string[]
  duration: string
}> = {
  'video-1': {
    title: 'Como Conseguir Mais Leads',
    description: 'Vídeo focado em dores reais - 15 segundos',
    type: 'video',
    duration: '15s',
    hook: '73% dos nutricionistas faturam menos de R$ 5.000/mês. Não por falta de conhecimento, mas por falta de ferramentas',
    script: [
      '[0-3s] HOOK: "73% dos nutricionistas faturam menos de R$ 5.000/mês"',
      '[3-8s] PROBLEMA: "Não por falta de conhecimento técnico, mas por falta de ferramentas digitais profissionais"',
      '[8-12s] SOLUÇÃO: "A YLADA resolve isso. Quizzes automáticos, templates prontos, tudo em um só lugar"',
      '[12-15s] CTA: "Teste grátis por 7 dias. Link na bio"',
    ],
    cta: 'Comece grátis por 7 dias →',
    tips: [
      'Use estatísticas reais (73% dos nutricionistas) para criar identificação',
      'Foque nas dores reais: dependência de indicações, falta de automação',
      'Destaque o benefício principal: trabalhar menos e ganhar mais',
      'Termine com CTA claro e urgente',
    ],
  },
  'video-2': {
    title: 'Pare de Perder Clientes',
    description: 'Vídeo problema/solução - 30 segundos',
    type: 'video',
    duration: '30s',
    hook: '73% dos nutricionistas faturam menos de R$ 5.000/mês. Não por falta de conhecimento, mas por falta de ferramentas',
    script: [
      '[0-5s] PROBLEMA: "Se você é nutricionista, provavelmente já passou por isso: Depender só de indicações, não saber como capturar leads online, perder tempo com planilhas manuais"',
      '[5-15s] ESTATÍSTICA: "A verdade é que 73% dos nutricionistas faturam menos de R$ 5.000 por mês, não por falta de conhecimento técnico, mas por falta de ferramentas digitais profissionais"',
      '[15-25s] SOLUÇÃO: "A YLADA resolve isso. Quizzes automáticos que capturam leads, templates prontos, acompanhamento de clientes, tudo em um só lugar"',
      '[25-30s] CTA: "Teste grátis por 7 dias. Link na bio"',
    ],
    cta: 'Veja como mudar isso →',
    tips: [
      'Comece identificando a dor do público',
      'Use estatísticas para criar urgência',
      'Apresente a solução de forma clara',
      'Termine com oferta irresistível (teste grátis)',
    ],
  },
  'video-3': {
    title: 'Automatize Sua Captação',
    description: 'Vídeo demonstrativo - 20 segundos',
    type: 'video',
    duration: '20s',
    hook: 'Quizzes automáticos que capturam leads enquanto você dorme',
    script: [
      '[0-5s] HOOK: "Quizzes automáticos que capturam leads enquanto você dorme"',
      '[5-12s] DEMONSTRAÇÃO: "Veja como funciona: Cliente faz o quiz, recebe diagnóstico completo, e você recebe o lead automaticamente no seu WhatsApp"',
      '[12-18s] BENEFÍCIO: "29 templates prontos. Só personalizar e publicar. Zero trabalho manual"',
      '[18-20s] CTA: "Comece agora. Link na bio"',
    ],
    cta: 'Teste grátis →',
    tips: [
      'Mostre o processo funcionando (screen recording)',
      'Destaque a automação (enquanto você dorme)',
      'Mencione quantidade de templates (29)',
      'Enfatize facilidade (zero trabalho manual)',
    ],
  },
}

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string
  const template = adTemplates[templateId]

  const [copied, setCopied] = useState(false)

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template não encontrado</h1>
          <Link href="/pt/creative-studio/templates" className="text-purple-600 hover:text-purple-700">
            Voltar para templates
          </Link>
        </div>
      </div>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/pt/creative-studio/templates"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Templates
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {template.title}
          </h1>
          <p className="text-gray-600">
            {template.description}
          </p>
        </div>

        {/* Template Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Duração</p>
              <p className="text-lg font-semibold text-gray-900">{template.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tipo</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{template.type}</p>
            </div>
          </div>

          {/* Hook */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm font-semibold text-purple-900 mb-2">🎣 Hook (Primeira linha)</p>
            <div className="flex items-start justify-between gap-4">
              <p className="text-gray-900 italic flex-1">"{template.hook}"</p>
              <button
                onClick={() => copyToClipboard(template.hook)}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Script */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">📝 Roteiro Completo</p>
            <div className="space-y-2">
              {template.script.map((line, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between gap-4"
                >
                  <p className="text-sm text-gray-700 flex-1">{line}</p>
                  <button
                    onClick={() => copyToClipboard(line)}
                    className="p-1.5 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-900 mb-2">🎯 Call to Action</p>
            <div className="flex items-start justify-between gap-4">
              <p className="text-gray-900 font-medium flex-1">{template.cta}</p>
              <button
                onClick={() => copyToClipboard(template.cta)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">💡 Dicas de Produção</p>
            <ul className="space-y-2">
              {template.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/pt/creative-studio/editor?template=${templateId}`}
              className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
            >
              <Play className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Criar Vídeo</p>
              <p className="text-sm text-gray-600">Abrir no editor</p>
            </Link>
            <button
              onClick={() => {
                const fullScript = template.script.join('\n\n')
                copyToClipboard(fullScript)
              }}
              className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <Copy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Copiar Roteiro</p>
              <p className="text-sm text-gray-600">Copiar tudo</p>
            </button>
            <button
              onClick={() => {
                const content = `HOOK: ${template.hook}\n\nROTEIRO:\n${template.script.join('\n')}\n\nCTA: ${template.cta}`
                const blob = new Blob([content], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${template.title.replace(/\s+/g, '-')}.txt`
                a.click()
              }}
              className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center"
            >
              <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Baixar</p>
              <p className="text-sm text-gray-600">Salvar como TXT</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

