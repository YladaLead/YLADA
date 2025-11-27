'use client'

interface FAQResponseProps {
  resposta: string
  video_url?: string
  pdf_url?: string
  thumbnail_url?: string
}

export default function FAQResponse({ resposta, video_url, pdf_url, thumbnail_url }: FAQResponseProps) {
  // Parsear a resposta formatada (se tiver estrutura especial)
  const parseResponse = (text: string) => {
    const sections: { type: string; content: string }[] = []
    let currentSection = { type: 'text', content: '' }

    const lines = text.split('\n')
    
    for (const line of lines) {
      if (line.startsWith('📌')) {
        if (currentSection.content) sections.push(currentSection)
        currentSection = { type: 'title', content: line.replace('📌', '').trim() }
      } else if (line.startsWith('🎯')) {
        if (currentSection.content) sections.push(currentSection)
        currentSection = { type: 'learn', content: line.replace('🎯', '').trim() }
      } else if (line.startsWith('📝')) {
        if (currentSection.content) sections.push(currentSection)
        currentSection = { type: 'steps', content: '' }
      } else if (line.startsWith('💡')) {
        if (currentSection.content) sections.push(currentSection)
        currentSection = { type: 'tips', content: line.replace('💡', '').trim() }
      } else if (line.startsWith('⚠️')) {
        if (currentSection.content) sections.push(currentSection)
        currentSection = { type: 'warnings', content: line.replace('⚠️', '').trim() }
      } else if (line.startsWith('🔗')) {
        if (currentSection.content) sections.push(currentSection)
        currentSection = { type: 'next', content: line.replace('🔗', '').trim() }
      } else if (line.trim()) {
        currentSection.content += (currentSection.content ? '\n' : '') + line
      }
    }
    
    if (currentSection.content) sections.push(currentSection)
    
    return sections.length > 0 ? sections : [{ type: 'text', content: text }]
  }

  const sections = parseResponse(resposta)

  return (
    <div className="space-y-3">
      {sections.map((section, index) => {
        if (section.type === 'title') {
          return (
            <h4 key={index} className="font-bold text-lg text-gray-900">
              📌 {section.content}
            </h4>
          )
        }
        
        if (section.type === 'learn') {
          return (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="font-semibold text-blue-900 mb-2">🎯 O que você vai aprender:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                {section.content.split('\n').filter(l => l.trim()).map((item, i) => (
                  <li key={i}>{item.replace(/^[-•]\s*/, '')}</li>
                ))}
              </ul>
            </div>
          )
        }
        
        if (section.type === 'steps') {
          const steps = section.content.split(/\n(?=Passo \d+:)/).filter(s => s.trim())
          return (
            <div key={index} className="space-y-3">
              <p className="font-semibold text-gray-900">📝 Passo a passo:</p>
              {steps.map((step, i) => {
                const stepMatch = step.match(/^Passo (\d+):\s*(.+)/)
                if (stepMatch) {
                  const [, num, title] = stepMatch
                  const details = step.replace(/^Passo \d+:\s*.+\n/, '').trim()
                  return (
                    <div key={i} className="bg-gray-50 p-3 rounded-lg border-l-4 border-purple-500">
                      <p className="font-semibold text-gray-900 mb-1">
                        Passo {num}: {title}
                      </p>
                      {details && (
                        <div className="text-sm text-gray-700 space-y-1">
                          {details.split('\n').map((line, j) => {
                            if (line.trim().startsWith('→')) {
                              return (
                                <p key={j} className="text-purple-700 pl-2">
                                  {line}
                                </p>
                              )
                            }
                            return <p key={j}>{line}</p>
                          })}
                        </div>
                      )}
                    </div>
                  )
                }
                return <p key={i} className="text-sm text-gray-700">{step}</p>
              })}
            </div>
          )
        }
        
        if (section.type === 'tips') {
          return (
            <div key={index} className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
              <p className="font-semibold text-yellow-900 mb-2">💡 Dicas importantes:</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-800">
                {section.content.split('\n').filter(l => l.trim()).map((item, i) => (
                  <li key={i}>{item.replace(/^[-•]\s*/, '')}</li>
                ))}
              </ul>
            </div>
          )
        }
        
        if (section.type === 'warnings') {
          return (
            <div key={index} className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="font-semibold text-red-900 mb-2">⚠️ Problemas comuns:</p>
              <ul className="list-disc list-inside space-y-1 text-red-800">
                {section.content.split('\n').filter(l => l.trim()).map((item, i) => (
                  <li key={i}>{item.replace(/^[-•]\s*/, '')}</li>
                ))}
              </ul>
            </div>
          )
        }
        
        if (section.type === 'next') {
          return (
            <div key={index} className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
              <p className="font-semibold text-green-900 mb-2">🔗 Próximos passos:</p>
              <ul className="list-disc list-inside space-y-1 text-green-800">
                {section.content.split('\n').filter(l => l.trim()).map((item, i) => (
                  <li key={i}>{item.replace(/^[-•]\s*/, '')}</li>
                ))}
              </ul>
            </div>
          )
        }
        
        // Texto normal
        return (
          <p key={index} className="text-gray-700 whitespace-pre-wrap">
            {section.content}
          </p>
        )
      })}

      {/* Links para vídeo e PDF */}
      {(video_url || pdf_url) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 mt-3">
          {video_url && (
            <a
              href={video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <span>🎥</span>
              <span>Assistir vídeo tutorial</span>
            </a>
          )}
          {pdf_url && (
            <a
              href={pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <span>📄</span>
              <span>Baixar PDF</span>
            </a>
          )}
        </div>
      )}
    </div>
  )
}

