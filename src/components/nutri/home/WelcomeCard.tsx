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
  
  // 🎉 TRILHA CONCLUÍDA: Layout simplificado após todas as etapas
  if (currentDay && currentDay > 30) {
    // Usar nome exatamente como configurado (sem adicionar título automaticamente)
    const displayName = userName || 'Nutricionista'
    
    return (
      <div className="mb-8">
        {/* Saudação simples */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Olá, {displayName} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            O Noel está aqui para você 💜
          </p>
        </div>

        {/* Card do Noel - compacto */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-3xl">👩‍💼</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Noel - Seu Mentor</h3>
              <p className="text-sm text-gray-600 mb-3">Estou aqui para qualquer dúvida ou desafio! Use o botão azul no canto inferior direito para conversar.</p>
              <button
                onClick={() => {
                  // Disparar evento customizado para abrir o chat
                  window.dispatchEvent(new CustomEvent('open-lya-chat'))
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Noel
              </button>
            </div>
          </div>
        </div>

        {/* Atalhos rápidos */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/pt/nutri/metodo/jornada"
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl mb-2 block">📘</span>
            <span className="text-sm font-medium text-gray-700">Trilha</span>
          </Link>
          <Link
            href="/pt/nutri/ferramentas/templates"
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl mb-2 block">🧲</span>
            <span className="text-sm font-medium text-gray-700">Captar</span>
          </Link>
        </div>
      </div>
    )
  }
  
  // Mensagem baseada na etapa atual (trilha em andamento)
  const getMessage = () => {
    if (!currentDay || currentDay === 0) {
      return {
        title: 'Seu próximo passo na trilha',
        description: 'Estruture sua base profissional. Leva cerca de 20 minutos.',
        action: 'Iniciar Etapa 1',
        href: '/pt/nutri/metodo/jornada/dia/1'
      }
    }
    
    if (currentDay === 1) {
      return {
        title: 'Seu próximo passo na trilha',
        description: 'Complete a Etapa 1 da sua Trilha Empresarial. Isso organiza sua base profissional e evita confusão lá na frente.',
        action: 'Executar Etapa 1 com o Noel',
        href: '/pt/nutri/metodo/jornada/dia/1'
      }
    }
    
    return {
      title: 'Seu próximo passo na trilha',
      description: `Continue seguindo a Trilha. Você está na Etapa ${currentDay}. Mantenha o foco e a consistência.`,
      action: `Continuar Etapa ${currentDay}`,
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
          <p className="text-xl sm:text-2xl text-blue-50 mb-4">
            Olá, <span className="font-semibold text-white">
              {userName || 'Nutricionista'}
            </span> 👋
          </p>
          
          {/* Badge do Noel */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-xl">👩‍💼</span>
            <span className="font-semibold text-sm">Noel - Seu Mentor</span>
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
              Fase atual: {lyaConfig.name} • Etapa {currentDay}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}



