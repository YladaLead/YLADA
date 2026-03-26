'use client'

interface FormatarMensagemProps {
  texto: string
}

function stripBoldMarkers(s: string): string {
  return s.replace(/\*\*/g, '')
}

/** Alternativas tipo A) B) ou A. (com ou sem ** ao redor do rótulo) */
function isOptionLine(linha: string): boolean {
  const t = stripBoldMarkers(linha).trim()
  return /^[A-Ea-e]\)\s/.test(t) || /^[A-Ea-e]\.\s/.test(t)
}

/** Enunciado de pergunta (evita linhas curtas tipo "Certo?"); ignora ** para detectar `**Pergunta?**` */
function isQuestionLine(linha: string): boolean {
  const stripped = stripBoldMarkers(linha).trim()
  if (stripped.length < 10 || !stripped.endsWith('?')) return false
  if (isOptionLine(linha)) return false
  return true
}

function nextNonEmptyIndex(linhas: string[], from: number): number {
  for (let i = from + 1; i < linhas.length; i++) {
    if (linhas[i].trim() !== '') return i
  }
  return -1
}

/** Espaço extra após o bloco de alternativas, antes da próxima pergunta */
function shouldGapAfterQuizOption(linhas: string[], index: number, linha: string): boolean {
  if (!isOptionLine(linha)) return false
  const ni = nextNonEmptyIndex(linhas, index)
  if (ni < 0) return false
  return isQuestionLine(linhas[ni])
}

function textToneClass(linha: string): string {
  return isQuestionLine(linha) ? 'font-semibold text-gray-900' : 'text-gray-700'
}

/**
 * Componente para formatar mensagens com markdown simples
 * Converte **texto** em negrito e adiciona espaçamento.
 * Para blocos de diagnóstico (pergunta + alternativas A–D): pergunta mais escura e folga entre perguntas.
 */
export default function FormatarMensagem({ texto }: FormatarMensagemProps) {
  const linhas = texto.split('\n')

  return (
    <div className="space-y-2">
      {linhas.map((linha, index) => {
        const gapAfterOptions = shouldGapAfterQuizOption(linhas, index, linha)
        const gapClass = gapAfterOptions ? 'mb-5' : ''

        // Se linha está vazia, adicionar espaço
        if (linha.trim() === '') {
          return <div key={index} className="h-2" />
        }

        // Se linha começa com ** (negrito)
        if (linha.trim().startsWith('**') && linha.trim().endsWith('**')) {
          const textoNegrito = linha.replace(/\*\*/g, '')
          return (
            <p
              key={index}
              className={`text-base ${isQuestionLine(linha) ? 'font-semibold text-gray-900' : 'font-bold text-gray-900'} ${gapClass}`}
            >
              {textoNegrito}
            </p>
          )
        }

        // Se linha contém **texto** (negrito no meio)
        if (linha.includes('**')) {
          const partes = linha.split(/(\*\*[^*]+\*\*)/g)
          return (
            <p key={index} className={`text-sm leading-relaxed ${textToneClass(linha)} ${gapClass}`}>
              {partes.map((parte, i) => {
                if (parte.startsWith('**') && parte.endsWith('**')) {
                  return (
                    <span key={i} className="font-bold text-gray-900" style={{ fontWeight: 700 }}>
                      {parte.replace(/\*\*/g, '')}
                    </span>
                  )
                }
                return <span key={i}>{parte}</span>
              })}
            </p>
          )
        }

        // Detectar listas numeradas (ex: "1. **Texto**" ou "1. Texto")
        const matchLista = linha.match(/^(\d+)\.\s+(.+)$/)
        if (matchLista) {
          const numero = matchLista[1]
          const conteudo = matchLista[2]
          const listaQuestion = isQuestionLine(conteudo)
          const listaTone = listaQuestion ? 'font-semibold text-gray-900' : 'text-gray-700'

          // Verificar se tem negrito no conteúdo
          if (conteudo.includes('**')) {
            const partes = conteudo.split(/(\*\*[^*]+\*\*)/g)
            return (
              <p key={index} className={`text-sm leading-relaxed mb-2 ${listaTone} ${gapClass}`}>
                <span className="font-bold text-gray-900" style={{ fontWeight: 700 }}>
                  {numero}.
                </span>{' '}
                {partes.map((parte, i) => {
                  if (parte.startsWith('**') && parte.endsWith('**')) {
                    return (
                      <span key={i} className="font-bold text-gray-900" style={{ fontWeight: 700 }}>
                        {parte.replace(/\*\*/g, '')}
                      </span>
                    )
                  }
                  return <span key={i}>{parte}</span>
                })}
              </p>
            )
          }

          // Lista numerada sem negrito
          return (
            <p key={index} className={`text-sm leading-relaxed mb-2 ${listaTone} ${gapClass}`}>
              <span className="font-bold text-gray-900" style={{ fontWeight: 700 }}>
                {numero}.
              </span>{' '}
              <span>{conteudo}</span>
            </p>
          )
        }
        
        // Se linha começa com emoji seguido de traço (lista)
        if (/^[📋💚📚🔄🎓🛠️🎨🌐❓📊⚙️]/.test(linha.trim()) && (linha.includes('—') || linha.includes('**'))) {
          // Extrair emoji (primeiro caractere)
          const matchEmoji = linha.trim().match(/^([📋💚📚🔄🎓🛠️🎨🌐❓📊⚙️])/)
          if (matchEmoji) {
            const emoji = matchEmoji[1]
            const resto = linha.trim().substring(emoji.length).trim()
            
            // Verificar se tem negrito no texto
            if (resto.includes('**')) {
              const textoPartes = resto.split(/(\*\*[^*]+\*\*)/g)
              return (
                <p
                  key={index}
                  className={`text-sm leading-relaxed flex items-start gap-2.5 mb-2 ${textToneClass(linha)} ${gapClass}`}
                >
                  <span className="text-base flex-shrink-0 mt-0.5">{emoji}</span>
                  <span className="flex-1">
                    {textoPartes.map((parte, i) => {
                      if (parte.startsWith('**') && parte.endsWith('**')) {
                        return (
                          <span key={i} className="font-bold text-gray-900">
                            {parte.replace(/\*\*/g, '')}
                          </span>
                        )
                      }
                      return <span key={i}>{parte}</span>
                    })}
                  </span>
                </p>
              )
            }

            return (
              <p
                key={index}
                className={`text-sm leading-relaxed flex items-start gap-2.5 mb-2 ${textToneClass(linha)} ${gapClass}`}
              >
                <span className="text-base flex-shrink-0 mt-0.5">{emoji}</span>
                <span className="flex-1">{resto}</span>
              </p>
            )
          }
        }

        // Linha normal
        return (
          <p key={index} className={`text-sm leading-relaxed ${textToneClass(linha)} ${gapClass}`}>
            {linha}
          </p>
        )
      })}
    </div>
  )
}

