'use client'

import { useRouter } from 'next/navigation'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'
import { getLyaPhase, getLyaConfig } from '@/lib/nutri/lya-prompts'
import Link from 'next/link'

interface WelcomeCardProps {
  currentDay: number | null
  userName?: string | null
}

export default function WelcomeCard({ currentDay, userName }: WelcomeCardProps) {
  const router = useRouter()
  const { progress } = useJornadaProgress()
  
  const phase = getLyaPhase(currentDay)
  const lyaConfig = getLyaConfig(phase)
  
  // 🎉 JORNADA CONCLUÍDA: Layout simplificado pós-30 dias
  if (currentDay && currentDay > 30) {
    return (
      <div className="mb-8">
        {/* Saudação simples */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Olá{userName ? `, ${userName}` : ''} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Sua jornada foi concluída! Agora você e a LYA crescem juntas. 💜
          </p>
        </div>

        {/* Card da LYA - compacto */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🤖</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">LYA - Sua Mentora</h3>
              <p className="text-sm text-gray-600">Estou aqui para qualquer dúvida ou desafio!</p>
            </div>
            <button
              onClick={() => {
                // Abrir widget da LYA
                const lyaButton = document.querySelector('[data-lya-widget]') as HTMLButtonElement
                if (lyaButton) lyaButton.click()
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Conversar
            </button>
          </div>
        </div>

        {/* Atalhos rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/pt/nutri/c/clientes"
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl mb-2 block">👥</span>
            <span className="text-sm font-medium text-gray-700">Clientes</span>
          </Link>
          <Link
            href="/pt/nutri/ferramentas"
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl mb-2 block">🛠️</span>
            <span className="text-sm font-medium text-gray-700">Ferramentas</span>
          </Link>
          <Link
            href="/pt/nutri/formularios"
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl mb-2 block">📋</span>
            <span className="text-sm font-medium text-gray-700">Formulários</span>
          </Link>
          <Link
            href="/pt/nutri/biblioteca"
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl mb-2 block">📚</span>
            <span className="text-sm font-medium text-gray-700">Biblioteca</span>
          </Link>
        </div>
      </div>
    )
  }
  
  // Determinar mensagem baseada no dia (jornada em andamento)
  const getMessage = () => {
    if (!currentDay || currentDay === 0) {
      return {
        title: 'Seu plano de ação para hoje',
        description: 'Hoje, vamos estruturar sua base profissional. Leva cerca de 20 minutos.',
        action: 'Iniciar Dia 1',
        href: '/pt/nutri/metodo/jornada/dia/1'
      }
    }
    
    if (currentDay === 1) {
      return {
        title: 'Seu plano de ação para hoje',
        description: 'Complete o Dia 1 da sua Jornada Nutri-Empresária. Isso organiza sua base profissional e evita confusão lá na frente.',
        action: 'Executar Dia 1 com a LYA',
        href: '/pt/nutri/metodo/jornada/dia/1'
      }
    }
    
    // Dias 2-30
    return {
      title: 'Seu plano de ação para hoje',
      description: `Continue seguindo a Jornada. Você está no Dia ${currentDay} de 30. Mantenha o foco e a consistência.`,
      action: `Continuar Dia ${currentDay}`,
      href: `/pt/nutri/metodo/jornada/dia/${currentDay}`
    }
  }
  
  const message = getMessage()
  
  const handleAction = () => {
    router.push(message.href)
  }
  
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 sm:p-10 text-white relative overflow-hidden">
        {/* Decoração de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        
        {/* Conteúdo */}
        <div className="relative z-10">
          {/* Saudação personalizada com nome */}
          {userName && (
            <p className="text-xl sm:text-2xl text-blue-50 mb-4">
              Olá, <span className="font-semibold text-white">{userName}</span> 👋
            </p>
          )}
          
          {/* Badge da LYA */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-xl">🤖</span>
            <span className="font-semibold text-sm">LYA - Sua Mentora</span>
          </div>
          
          {/* Título */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {message.title}
          </h2>
          
          {/* Descrição */}
          <p className="text-lg sm:text-xl text-blue-50 mb-6 leading-relaxed max-w-2xl">
            {message.description}
          </p>
          
          {/* Botão de ação */}
          <button
            onClick={handleAction}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>👉</span>
            <span>{message.action}</span>
          </button>
          
          {/* Informação adicional (opcional) */}
          {currentDay && currentDay <= 7 && (
            <p className="text-sm text-blue-100 mt-4 opacity-90">
              Fase atual: {lyaConfig.name} • Dia {currentDay} de 30
            </p>
          )}
        </div>
      </div>
    </div>
  )
}



