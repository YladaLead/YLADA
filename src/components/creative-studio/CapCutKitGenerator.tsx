'use client'

import { useState } from 'react'
import { Copy, Download, Check, Sparkles, Image as ImageIcon, Film, Settings } from 'lucide-react'

interface Scene {
  number: number
  type: 'hook' | 'problem' | 'solution' | 'cta'
  text: string
  duration: number
  startTime: number
  endTime: number
  imagePrompt: string
  imageSearchTerms: string[]
  transition?: string
  effects?: string[]
  notes?: string
}

interface CapCutKit {
  script: {
    title: string
    totalDuration: number
    scenes: Scene[]
    narration: string
  }
  images: {
    sceneNumber: number
    prompt: string
    searchTerms: string[]
    source: 'chatgpt' | 'envato' | 'pexels'
    notes: string
  }[]
  capcutInstructions: {
    projectSettings: {
      aspectRatio: string
      resolution: string
      frameRate: number
    }
    timeline: {
      sceneNumber: number
      imageDuration: number
      transition: string
      effects: string[]
      textOverlay?: {
        text: string
        style: string
        position: string
        timing: string
      }
    }[]
    audio: {
      narration: string
      backgroundMusic?: string
      soundEffects?: string[]
      voiceStyle?: string
    }
    export: {
      format: string
      resolution: string
      quality: string
    }
  }
}

interface CapCutKitGeneratorProps {
  area?: 'nutri' | 'coach' | 'wellness'
  onGenerate?: (kit: CapCutKit) => void
}

export function CapCutKitGenerator({ area = 'nutri', onGenerate }: CapCutKitGeneratorProps) {
  const [objective, setObjective] = useState('')
  const [duration, setDuration] = useState(30)
  const [style, setStyle] = useState<'quick-ad' | 'sales-page' | 'educational'>('quick-ad')
  const [loading, setLoading] = useState(false)
  const [kit, setKit] = useState<CapCutKit | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!objective.trim()) {
      alert('Por favor, descreva o objetivo do anúncio')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/creative-studio/generate-capcut-kit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objective,
          area,
          duration,
          style,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar kit')
      }

      const data = await response.json()
      if (data.success && data.kit) {
        setKit(data.kit)
        if (onGenerate) {
          onGenerate(data.kit)
        }
      }
    } catch (error) {
      console.error('Erro ao gerar kit:', error)
      alert('Erro ao gerar kit. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const downloadKit = () => {
    if (!kit) return

    const content = `
# KIT COMPLETO CAPCUT - ${kit.script.title}

## 📝 ROTEIRO COMPLETO

### Narração Completa:
${kit.script.narration}

---

## 🎬 CENAS DETALHADAS

${kit.script.scenes.map(scene => `
### CENA ${scene.number} - ${scene.type.toUpperCase()} (${scene.startTime}s - ${scene.endTime}s)

**Texto:**
${scene.text}

**Duração:** ${scene.duration} segundos
**Transição:** ${scene.transition}
**Efeitos:** ${scene.effects?.join(', ') || 'Nenhum'}
**Notas:** ${scene.notes || 'Nenhuma'}

`).join('\n')}

---

## 🎨 PROMPTS DE IMAGEM

${kit.images.map((img, idx) => `
### CENA ${img.sceneNumber} - ${kit.script.scenes[idx]?.type.toUpperCase()}

**Fonte Recomendada:** ${img.source === 'chatgpt' ? 'ChatGPT/DALL-E' : 'Envato Elements'}

**Prompt para ChatGPT/DALL-E:**
\`\`\`
${img.prompt}
\`\`\`

**Termos para Busca no Envato:**
${img.searchTerms.map(term => `- ${term}`).join('\n')}

**Notas:** ${img.notes}

`).join('\n')}

---

## ⚙️ INSTRUÇÕES CAPCUT

### Configurações do Projeto
- **Aspecto:** ${kit.capcutInstructions.projectSettings.aspectRatio}
- **Resolução:** ${kit.capcutInstructions.projectSettings.resolution}
- **Frame Rate:** ${kit.capcutInstructions.projectSettings.frameRate}fps

### Timeline
${kit.capcutInstructions.timeline.map(tl => `
**Cena ${tl.sceneNumber}:**
- Duração da imagem: ${tl.imageDuration}s
- Transição: ${tl.transition}
- Efeitos: ${tl.effects.join(', ')}
- Texto: "${tl.textOverlay?.text}"
- Estilo do texto: ${tl.textOverlay?.style}
- Posição: ${tl.textOverlay?.position}
- Timing: ${tl.textOverlay?.timing}
`).join('\n')}

### Áudio
- **Narração:** ${kit.capcutInstructions.audio.narration}
- **Música de Fundo:** ${kit.capcutInstructions.audio.backgroundMusic || 'Não especificada'}
- **Efeitos Sonoros:** ${kit.capcutInstructions.audio.soundEffects?.join(', ') || 'Nenhum'}

### Exportação
- **Formato:** ${kit.capcutInstructions.export.format}
- **Resolução:** ${kit.capcutInstructions.export.resolution}
- **Qualidade:** ${kit.capcutInstructions.export.quality}

---

**Gerado em:** ${new Date().toLocaleString('pt-BR')}
`

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `capcut-kit-${kit.script.title.replace(/\s+/g, '-').toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Formulário de Geração */}
      {!kit && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎬 Gerar Kit Completo para CapCut
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo do Anúncio *
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Ex: Anúncio sobre agenda vazia para Instagram"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração (segundos)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={15}
                  max={120}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="quick-ad">Anúncio Rápido</option>
                  <option value="sales-page">Página de Vendas</option>
                  <option value="educational">Educativo</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !objective.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="animate-spin" />
                  Gerando Kit Completo...
                </>
              ) : (
                <>
                  <Sparkles />
                  Gerar Kit Completo
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Kit Gerado */}
      {kit && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{kit.script.title}</h2>
                <p className="text-blue-100">
                  Duração total: {kit.script.totalDuration}s | {kit.script.scenes.length} cenas
                </p>
              </div>
              <button
                onClick={downloadKit}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2"
              >
                <Download />
                Baixar Kit Completo
              </button>
            </div>
          </div>

          {/* Roteiro */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Film />
              Roteiro Completo
            </h3>
            <div className="space-y-4">
              {kit.script.scenes.map((scene) => (
                <div key={scene.number} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      CENA {scene.number} - {scene.type.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {scene.startTime}s - {scene.endTime}s ({scene.duration}s)
                    </span>
                  </div>
                  <p className="text-gray-700">{scene.text}</p>
                  {scene.notes && (
                    <p className="text-sm text-gray-500 mt-1">💡 {scene.notes}</p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => copyToClipboard(kit.script.narration, 'narration')}
              className="mt-4 text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm"
            >
              {copied === 'narration' ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Narração Completa
                </>
              )}
            </button>
          </div>

          {/* Prompts de Imagem */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon />
              Prompts de Imagem
            </h3>
            <div className="space-y-6">
              {kit.images.map((img, idx) => (
                <div key={img.sceneNumber} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">
                      Cena {img.sceneNumber} - {kit.script.scenes[idx]?.type.toUpperCase()}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {img.source === 'chatgpt' ? 'ChatGPT/DALL-E' : 'Envato Elements'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Prompt para ChatGPT/DALL-E:
                      </label>
                      <div className="relative">
                        <textarea
                          readOnly
                          value={img.prompt}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                          rows={8}
                        />
                        <button
                          onClick={() => copyToClipboard(img.prompt, `prompt-${img.sceneNumber}`)}
                          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
                        >
                          {copied === `prompt-${img.sceneNumber}` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {img.searchTerms.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Termos para Busca no Envato:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {img.searchTerms.map((term, termIdx) => (
                            <span
                              key={termIdx}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(img.searchTerms.join('\n'), `terms-${img.sceneNumber}`)
                          }
                          className="mt-2 text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm"
                        >
                          {copied === `terms-${img.sceneNumber}` ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copiar Todos os Termos
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {img.notes && (
                      <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                        💡 {img.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instruções CapCut */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings />
              Instruções para CapCut
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Configurações do Projeto:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Aspecto: {kit.capcutInstructions.projectSettings.aspectRatio}</li>
                  <li>Resolução: {kit.capcutInstructions.projectSettings.resolution}</li>
                  <li>Frame Rate: {kit.capcutInstructions.projectSettings.frameRate}fps</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Timeline:</h4>
                <div className="space-y-3">
                  {kit.capcutInstructions.timeline.map((tl) => (
                    <div key={tl.sceneNumber} className="border-l-4 border-purple-500 pl-4">
                      <div className="font-semibold text-gray-900 mb-1">
                        Cena {tl.sceneNumber}:
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>Duração: {tl.imageDuration}s</li>
                        <li>Transição: {tl.transition}</li>
                        <li>Efeitos: {tl.effects.join(', ')}</li>
                        {tl.textOverlay && (
                          <>
                            <li>Texto: "{tl.textOverlay.text}"</li>
                            <li>Estilo: {tl.textOverlay.style}</li>
                            <li>Posição: {tl.textOverlay.position}</li>
                            <li>Timing: {tl.textOverlay.timing}</li>
                          </>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Áudio:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Narração: {kit.capcutInstructions.audio.narration}</li>
                  {kit.capcutInstructions.audio.backgroundMusic && (
                    <li>Música: {kit.capcutInstructions.audio.backgroundMusic}</li>
                  )}
                  {kit.capcutInstructions.audio.soundEffects && (
                    <li>
                      Efeitos: {kit.capcutInstructions.audio.soundEffects.join(', ')}
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Exportação:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Formato: {kit.capcutInstructions.export.format}</li>
                  <li>Resolução: {kit.capcutInstructions.export.resolution}</li>
                  <li>Qualidade: {kit.capcutInstructions.export.quality}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botão para Gerar Novo */}
          <button
            onClick={() => {
              setKit(null)
              setObjective('')
            }}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300"
          >
            Gerar Novo Kit
          </button>
        </div>
      )}
    </div>
  )
}

