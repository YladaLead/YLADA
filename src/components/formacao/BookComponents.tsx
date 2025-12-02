'use client'

// Componentes visuais que remetem a livro/manual profissional

interface BookBoxProps {
  type: 'exemplo' | 'checklist' | 'nota' | 'erro' | 'reflexao' | 'insight'
  title?: string
  children: React.ReactNode
}

export function BookBox({ type, title, children }: BookBoxProps) {
  const styles = {
    exemplo: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      icon: '💡',
      defaultTitle: 'Exemplo Prático'
    },
    checklist: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      icon: '✓',
      defaultTitle: 'Checklist Aplicável'
    },
    nota: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      icon: '📌',
      defaultTitle: 'Nota Importante'
    },
    erro: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      icon: '⚠️',
      defaultTitle: 'Erro Comum da Nutri'
    },
    reflexao: {
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      icon: '🤔',
      defaultTitle: 'Perguntas para Reflexão'
    },
    insight: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-300',
      icon: '💎',
      defaultTitle: 'Insight YLADA'
    }
  }

  const style = styles[type]

  return (
    <div className={`${style.bg} border-l-4 ${style.border} rounded-r-lg p-4 my-4 shadow-sm`}>
      <div className="flex items-start gap-2 mb-2">
        <span className="text-xl">{style.icon}</span>
        <h4 className="font-bold text-gray-900">{title || style.defaultTitle}</h4>
      </div>
      <div className="text-gray-700 ml-7">
        {children}
      </div>
    </div>
  )
}

interface BookQuoteProps {
  children: React.ReactNode
  author?: string
}

export function BookQuote({ children, author }: BookQuoteProps) {
  return (
    <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-700 bg-gray-50 py-3 rounded-r">
      <p className="text-lg">"{children}"</p>
      {author && (
        <cite className="text-sm text-gray-600 mt-2 block">— {author}</cite>
      )}
    </blockquote>
  )
}

interface BookSectionProps {
  title: string
  children: React.ReactNode
  level?: 1 | 2 | 3
}

export function BookSection({ title, children, level = 1 }: BookSectionProps) {
  const HeadingTag = `h${level + 1}` as keyof JSX.IntrinsicElements
  const sizes = {
    1: 'text-3xl font-bold mb-6 text-gray-900',
    2: 'text-2xl font-bold mb-4 text-gray-800',
    3: 'text-xl font-semibold mb-3 text-gray-700'
  }

  return (
    <section className="my-8">
      <HeadingTag className={sizes[level]}>{title}</HeadingTag>
      <div className="prose prose-lg max-w-none">
        {children}
      </div>
    </section>
  )
}

