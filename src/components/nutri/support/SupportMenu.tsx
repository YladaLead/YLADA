'use client'

interface SupportMenuProps {
  onSelect: (option: string) => void
}

export default function SupportMenu({ onSelect }: SupportMenuProps) {
  const categorias = [
    {
      icon: '🛠️',
      title: 'Ferramentas e Templates',
      options: [
        'Como criar uma calculadora',
        'Como criar um quiz',
        'Como criar checklist',
        'Como editar ferramenta',
        'Como compartilhar ferramenta'
      ]
    },
    {
      icon: '📝',
      title: 'Formulários',
      options: [
        'Como criar formulário',
        'Como usar formulários pré-montados',
        'Como enviar formulário para clientes',
        'Como ver respostas'
      ]
    },
    {
      icon: '👥',
      title: 'Clientes e Leads',
      options: [
        'Como ver meus leads',
        'Como converter lead em cliente',
        'Como criar cliente',
        'Como usar Kanban'
      ]
    },
    {
      icon: '🌐',
      title: 'Portais e Compartilhamento',
      options: [
        'Como criar portal',
        'Como gerar QR code',
        'Como usar short codes',
        'Como compartilhar links'
      ]
    },
    {
      icon: '⚙️',
      title: 'Configurações',
      options: [
        'Como configurar perfil',
        'Como alterar telefone',
        'Como configurar slug'
      ]
    },
    {
      icon: '📊',
      title: 'Relatórios',
      options: [
        'Como ver relatórios de leads',
        'Como ver relatórios de gestão'
      ]
    },
    {
      icon: '❓',
      title: 'Outras Dúvidas',
      options: [
        'Problemas técnicos',
        'Outras questões'
      ]
    }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">📋 Escolha uma opção:</h3>
      <div className="space-y-2">
        {categorias.map((categoria, index) => (
          <div key={index} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
            <button
              onClick={() => onSelect(categoria.title)}
              className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span className="text-xl">{categoria.icon}</span>
              <span className="font-medium text-gray-700">{categoria.title}</span>
            </button>
          </div>
        ))}
        <div className="pt-2 border-t border-gray-200 mt-2">
          <button
            onClick={() => onSelect('👤 Falar com atendente humano')}
            className="w-full text-left px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            👤 Falar com Atendente Humano
          </button>
        </div>
      </div>
    </div>
  )
}

