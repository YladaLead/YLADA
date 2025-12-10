'use client'

import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import WellnessSuporteAcoes from '@/components/wellness/WellnessSuporteAcoes'
import WellnessChatWidget from '@/components/wellness/WellnessChatWidget'

export default function WellnessSuportePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Suporte" />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Suporte</h1>
          <p className="text-gray-600">
            Resolva seus problemas de forma rápida e segura
          </p>
        </div>

        {/* Ações Rápidas */}
        <WellnessSuporteAcoes />

        {/* NOEL Assistente */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">🤖</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">NOEL - Assistente de Suporte</h3>
              <p className="text-sm text-gray-600">Ajuda com acesso, login e problemas técnicos</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Precisa de ajuda? O NOEL está disponível 24/7 para te ajudar com:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
            <li>Problemas de acesso e login</li>
            <li>Dúvidas sobre como usar o sistema</li>
            <li>Orientações técnicas</li>
            <li>Gerar links de acesso (após verificação)</li>
            <li>Recuperar senha (após verificação)</li>
          </ul>
          <p className="text-sm text-gray-500 italic">
            💡 Clique no botão de chat no canto inferior direito para falar com o NOEL
          </p>
        </div>

        {/* Contato Direto */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ainda precisa de ajuda?</h2>
          <p className="mb-6 opacity-90">
            Nossa equipe está pronta para te atender
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:ylada.app@gmail.com"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all transform hover:scale-105"
            >
              <div className="text-3xl mb-2">📧</div>
              <p className="font-semibold mb-1">Email</p>
              <p className="text-sm opacity-90">ylada.app@gmail.com</p>
            </a>
            <a
              href="https://wa.me/5519996049800"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all transform hover:scale-105"
            >
              <div className="text-3xl mb-2">💬</div>
              <p className="font-semibold mb-1">WhatsApp</p>
              <p className="text-sm opacity-90">+55 19 99604-9800</p>
            </a>
          </div>
        </div>
      </main>

      {/* Chat Widget Flutuante - NOEL */}
      <WellnessChatWidget chatbotId="noel" />
    </div>
  )
}


