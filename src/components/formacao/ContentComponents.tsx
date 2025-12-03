/**
 * Componentes de formatação de conteúdo para páginas de leitura
 * Seguem o padrão visual estabelecido no SaaS
 */

interface ContentContainerProps {
  children: React.ReactNode
  className?: string
}

export function ContentContainer({ children, className = '' }: ContentContainerProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {children}
    </div>
  )
}

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}

export function Heading({ level, children, className = '' }: HeadingProps) {
  const baseClasses = 'font-semibold text-gray-900 mb-4 leading-tight'
  const levelClasses = {
    1: 'text-3xl',
    2: 'text-2xl',
    3: 'text-xl',
    4: 'text-lg',
    5: 'text-base',
    6: 'text-sm'
  }

  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Tag className={`${baseClasses} ${levelClasses[level]} ${className}`}>
      {children}
    </Tag>
  )
}

interface ParagraphProps {
  children: React.ReactNode
  className?: string
}

export function Paragraph({ children, className = '' }: ParagraphProps) {
  return (
    <p className={`text-gray-700 leading-relaxed mb-4 ${className}`}>
      {children}
    </p>
  )
}

interface SectionProps {
  children: React.ReactNode
  className?: string
}

export function Section({ children, className = '' }: SectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {children}
    </div>
  )
}

export function Divider() {
  return (
    <hr className="my-8 border-t border-gray-200" />
  )
}

interface InfoBoxProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'success' | 'tip'
  className?: string
}

export function InfoBox({ children, type = 'info', className = '' }: InfoBoxProps) {
  const typeStyles = {
    info: 'bg-blue-50 border-l-4 border-blue-500',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500',
    success: 'bg-green-50 border-l-4 border-green-500',
    tip: 'bg-purple-50 border-l-4 border-purple-500'
  }

  return (
    <div className={`rounded-xl p-4 mb-6 ${typeStyles[type]} ${className}`}>
      <div className="text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

