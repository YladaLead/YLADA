'use client'

interface FormatarMensagemProps {
  texto: string
}

/**
 * Componente para formatar mensagens com markdown simples
 * Converte **texto** em negrito e adiciona espaçamento
 */
export default function FormatarMensagem({ texto }: FormatarMensagemProps) {
  // Dividir por linhas
  const linhas = texto.split('\n')
  
  return (
    <div className="space-y-2">
      {linhas.map((linha, index) => {
        // Se linha está vazia, adicionar espaço
        if (linha.trim() === '') {
          return <div key={index} className="h-2" />
        }
        
        // Se linha começa com ** (negrito)
        if (linha.trim().startsWith('**') && linha.trim().endsWith('**')) {
          const textoNegrito = linha.replace(/\*\*/g, '')
          return (
            <p key={index} className="font-bold text-base text-gray-900">
              {textoNegrito}
            </p>
          )
        }
        
        // Se linha contém **texto** (negrito no meio)
        if (linha.includes('**')) {
          const partes = linha.split(/(\*\*[^*]+\*\*)/g)
          return (
            <p key={index} className="text-sm leading-relaxed">
              {partes.map((parte, i) => {
                if (parte.startsWith('**') && parte.endsWith('**')) {
                  return (
                    <span key={i} className="font-bold text-gray-900">
                      {parte.replace(/\*\*/g, '')}
                    </span>
                  )
                }
                return <span key={i}>{parte}</span>
              })}
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
                <p key={index} className="text-sm leading-relaxed flex items-start gap-2.5 mb-2">
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
              <p key={index} className="text-sm leading-relaxed flex items-start gap-2.5 mb-2">
                <span className="text-base flex-shrink-0 mt-0.5">{emoji}</span>
                <span className="flex-1">{resto}</span>
              </p>
            )
          }
        }
        
        // Linha normal
        return (
          <p key={index} className="text-sm leading-relaxed text-gray-700">
            {linha}
          </p>
        )
      })}
    </div>
  )
}

