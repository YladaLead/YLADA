'use client'

import { useState, useRef, useEffect } from 'react'
import {
  MessagesProblemScene,
  CreateEvaluationScene,
  ShareLinkScene,
  UserAnswerScene,
  AIAnalysisScene,
  DiagnosisResultScene,
  ConversationScene,
  FinalScene,
} from '@/components/ylada-demo'

const SCENES = [
  { id: 1, name: 'Mensagens (problema)', Component: MessagesProblemScene },
  { id: 2, name: 'Criar avaliação', Component: CreateEvaluationScene },
  { id: 3, name: 'Compartilhar link', Component: ShareLinkScene },
  { id: 4, name: 'Pessoa responde', Component: UserAnswerScene },
  { id: 5, name: 'Análise IA', Component: AIAnalysisScene },
  { id: 6, name: 'Resultado diagnóstico', Component: DiagnosisResultScene },
  { id: 7, name: 'Conversa iniciada', Component: ConversationScene },
  { id: 8, name: 'Final (slogan)', Component: FinalScene },
] as const

const AI_STEP_NAMES = ['analisando-respostas', 'detectando-padroes', 'gerando-diagnostico'] as const

function getSceneFileName(index: number, ext: string, aiStep?: number) {
  if (index === 4 && aiStep !== undefined) {
    return `ylada-demo-cena-5-passo-${aiStep + 1}-${AI_STEP_NAMES[aiStep]}.${ext}`
  }
  const slug = SCENES[index].name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
  return `ylada-demo-cena-${index + 1}-${slug}.${ext}`
}

export default function YladaDemoPage() {
  const [scene, setScene] = useState(0)
  const [exporting, setExporting] = useState<'png' | 'pdf' | 'pdf-all' | 'png-ai' | null>(null)
  const [forceAIStep, setForceAIStep] = useState<number | null>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const CurrentComponent = SCENES[scene].Component

  async function exportAsPng() {
    const el = sceneRef.current
    if (!el) return
    setExporting('png')
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#fafafa',
      })
      const link = document.createElement('a')
      link.download = getSceneFileName(scene, 'png')
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    } finally {
      setExporting(null)
    }
  }

  async function exportAsPdf() {
    const el = sceneRef.current
    if (!el) return
    setExporting('pdf')
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#fafafa',
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const r = canvas.width / canvas.height
      const w = r >= pageW / pageH ? pageW : pageH * r
      const h = r >= pageW / pageH ? pageW / r : pageH
      const x = (pageW - w) / 2
      const y = (pageH - h) / 2
      pdf.addImage(imgData, 'PNG', x, y, w, h)
      pdf.save(getSceneFileName(scene, 'pdf'))
    } catch (e) {
      console.error(e)
    } finally {
      setExporting(null)
    }
  }

  async function exportAIStepAsPng(step: number) {
    setForceAIStep(step)
    setExporting('png-ai')
  }

  useEffect(() => {
    if (forceAIStep === null || exporting !== 'png-ai') return
    const el = sceneRef.current
    if (!el) {
      setExporting(null)
      setForceAIStep(null)
      return
    }
    const t = setTimeout(async () => {
      try {
        const html2canvas = (await import('html2canvas')).default
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#fafafa',
        })
        const link = document.createElement('a')
        link.download = getSceneFileName(4, 'png', forceAIStep)
        link.href = canvas.toDataURL('image/png')
        link.click()
      } catch (e) {
        console.error(e)
      } finally {
        setExporting(null)
        setForceAIStep(null)
      }
    }, 450)
    return () => clearTimeout(t)
  }, [forceAIStep, exporting])

  async function exportAllAsPdf() {
    setExporting('pdf-all')
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()

      for (let i = 0; i < SCENES.length; i++) {
        setScene(i)
        await new Promise((r) => setTimeout(r, 400))
        const el = sceneRef.current
        if (!el) continue
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#fafafa',
        })
        const imgData = canvas.toDataURL('image/png')
        const r = canvas.width / canvas.height
        const w = r >= pageW / pageH ? pageW : pageH * r
        const h = r >= pageW / pageH ? pageW / r : pageH
        const x = (pageW - w) / 2
        const y = (pageH - h) / 2
        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', x, y, w, h)
      }
      setScene(0)
      pdf.save('ylada-demo-todas-as-cenas.pdf')
    } catch (e) {
      console.error(e)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navegação para gravação */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3">
        <div className="mx-auto max-w-[720px] flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-gray-500">YLADA — Demo vídeo</span>
          <nav className="flex items-center gap-1 flex-wrap justify-end">
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScene(i)}
                disabled={!!exporting}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                  i === scene
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {s.id}
              </button>
            ))}
          </nav>
        </div>
        <p className="mx-auto max-w-[720px] mt-2 text-xs text-gray-400">
          Cena {scene + 1}: {SCENES[scene].name}
        </p>
        <div className="mx-auto max-w-[720px] mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportAsPng}
            disabled={!!exporting}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {exporting === 'png' ? 'Salvando…' : 'Salvar cena como PNG'}
          </button>
          <button
            type="button"
            onClick={exportAsPdf}
            disabled={!!exporting}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {exporting === 'pdf' ? 'Salvando…' : 'Salvar cena como PDF'}
          </button>
          <button
            type="button"
            onClick={exportAllAsPdf}
            disabled={!!exporting}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {exporting === 'pdf-all' ? 'Gerando PDF…' : 'Salvar todas as cenas em PDF'}
          </button>
          {scene === 4 && (
            <>
              <span className="text-gray-300 mx-1">|</span>
              <span className="text-xs text-gray-500 mr-1">Cena 5 em 3 PNGs:</span>
              {[0, 1, 2].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => exportAIStepAsPng(step)}
                  disabled={!!exporting}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {exporting === 'png-ai' && forceAIStep === step ? 'Salvando…' : `PNG passo ${step + 1}`}
                </button>
              ))}
            </>
          )}
        </div>
      </header>

      <main className="py-8 flex justify-center">
        <div ref={sceneRef} className="w-full max-w-[720px]">
          {scene === 4 ? (
            <AIAnalysisScene fixedStep={forceAIStep ?? undefined} />
          ) : (
            <CurrentComponent />
          )}
        </div>
      </main>
    </div>
  )
}
