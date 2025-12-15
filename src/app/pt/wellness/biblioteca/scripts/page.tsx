'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useRouter } from 'next/navigation'

export default function BibliotecaScriptsPage() {
  const router = useRouter()

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <button
                  onClick={() => router.push('/pt/wellness/biblioteca')}
                  className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm"
                >
                  ← Voltar para Biblioteca
                </button>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">💬 Scripts Oficiais</h1>
                <p className="text-lg text-gray-600">
                  Os scripts oficiais agora estão centralizados no NOEL. Sempre que precisar de um script,
                  peça diretamente para o NOEL que ele monta, adapta e personaliza para você.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
                <p className="text-gray-700 mb-4 text-lg font-medium">
                  "NOEL, qual o melhor script para eu usar agora?"
                </p>
                <p className="text-sm text-gray-500 mb-6 max-w-2xl mx-auto">
                  Em vez de uma lista fixa de scripts, o NOEL escolhe e monta a mensagem ideal
                  para o seu contexto (tipo de pessoa, objetivo, etapa da conversa e histórico de uso).
                </p>
                <button
                  onClick={() => router.push('/pt/wellness/noel')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-base"
                >
                  Falar com o NOEL
                </button>
              </div>
            </div>
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
