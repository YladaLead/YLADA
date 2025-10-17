'use client'

import { Clock } from 'lucide-react'
import Link from 'next/link'

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento em Processamento ⏳
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Seu pagamento está sendo processado. Isso pode levar alguns minutos para ser confirmado.
          </p>
          
          <div className="bg-yellow-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              O que acontece agora:
            </h3>
            <ul className="text-left text-yellow-700 space-y-2">
              <li>• Pagamento sendo verificado pelo banco</li>
              <li>• Email de confirmação será enviado</li>
              <li>• Acesso será liberado automaticamente</li>
              <li>• Você receberá notificação por WhatsApp</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Tempo estimado:
            </h3>
            <ul className="text-left text-blue-700 space-y-1">
              <li>• PIX: 1-5 minutos</li>
              <li>• Cartão de crédito: 1-2 minutos</li>
              <li>• Boleto: 1-3 dias úteis</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Você receberá um email assim que o pagamento for confirmado.
            </p>
            
            <div className="text-center">
              <Link 
                href="/"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                ← Voltar ao início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
