'use client'

interface FormacaoTabsProps {
  activeTab: 'jornada' | 'trilhas' | 'microcursos' | 'biblioteca' | 'tutoriais'
  onTabChange: (tab: 'jornada' | 'trilhas' | 'microcursos' | 'biblioteca' | 'tutoriais') => void
}

export default function FormacaoTabs({ activeTab, onTabChange }: FormacaoTabsProps) {
  const tabs = [
    { id: 'jornada' as const, label: '🗺️ Jornada', icon: '🗺️', subtitle: 'Jornada de 30 Dias' },
    { id: 'trilhas' as const, label: '🏛️ Pilares', icon: '🏛️', subtitle: 'Pilares do Método' },
    { id: 'microcursos' as const, label: '💪 Exercícios', icon: '💪', subtitle: 'Exercícios Aplicáveis' },
    { id: 'biblioteca' as const, label: '🛠️ Ferramentas', icon: '🛠️', subtitle: 'Ferramentas YLADA' },
    { id: 'tutoriais' as const, label: '📖 Manual Técnico', icon: '📖', subtitle: 'Manual Técnico YLADA' },
  ]

  return (
    <div className="mb-8" data-tabs>
      <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 inline-flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={tab.subtitle}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.icon}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

