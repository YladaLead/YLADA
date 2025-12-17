/**
 * Componente para formatar texto de orientação com markdown simples
 * Converte **texto** em negrito e preserva quebras de linha
 */
interface FormatarOrientacaoProps {
  texto: string
}

export default function FormatarOrientacao({ texto }: FormatarOrientacaoProps) {
  // Processar o texto para garantir que "Exemplo prático:" e "Erro comum:" tenham quebras de linha
  // Mesmo que o banco ainda não tenha sido atualizado
  let textoProcessado = texto
  
  // Adicionar quebra de linha antes de "**Exemplo prático:**" se não tiver quebra antes
  textoProcessado = textoProcessado.replace(/([^\n])(\*\*Exemplo prático:\*\*)/g, '$1\n\n$2')
  // Se não tem ** ainda, adicionar quebra e negrito
  if (!textoProcessado.includes('**Exemplo prático:**')) {
    textoProcessado = textoProcessado.replace(/([^\n])(Exemplo prático:)/g, '$1\n\n**$2**')
  }
  
  // Adicionar quebra de linha antes de "**Erro comum:**" se não tiver quebra antes
  textoProcessado = textoProcessado.replace(/([^\n])(\*\*Erro comum:\*\*)/g, '$1\n\n$2')
  // Se não tem ** ainda, adicionar quebra e negrito
  if (!textoProcessado.includes('**Erro comum:**')) {
    textoProcessado = textoProcessado.replace(/([^\n])(Erro comum:)/g, '$1\n\n**$2**')
  }
  
  // Dividir por linhas
  const linhas = textoProcessado.split('\n')
  
  return (
    <div className="space-y-3">
      {linhas.map((linha, index) => {
        // Se linha está vazia, adicionar espaço
        if (linha.trim() === '') {
          return <div key={index} className="h-2" />
        }
        
        // Se linha começa com ** (negrito completo)
        if (linha.trim().startsWith('**') && linha.trim().endsWith('**')) {
          const textoNegrito = linha.replace(/\*\*/g, '').trim()
          return (
            <p key={index} className="font-bold text-base text-gray-900 mt-4 mb-2">
              {textoNegrito}
            </p>
          )
        }
        
        // Se linha contém **texto** (negrito no meio ou no início)
        if (linha.includes('**')) {
          // Dividir por padrões de negrito
          const partes = linha.split(/(\*\*[^*]+\*\*)/g)
          return (
            <p key={index} className="text-gray-700 leading-relaxed">
              {partes.map((parte, i) => {
                if (parte.startsWith('**') && parte.endsWith('**')) {
                  return (
                    <strong key={i} className="font-bold text-gray-900">
                      {parte.replace(/\*\*/g, '')}
                    </strong>
                  )
                }
                return <span key={i}>{parte}</span>
              })}
            </p>
          )
        }
        
        // Linha normal
        return (
          <p key={index} className="text-gray-700 leading-relaxed">
            {linha}
          </p>
        )
      })}
    </div>
  )
}

