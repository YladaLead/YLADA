'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function FailurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Cancelado
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Você cancelou o pagamento. Não se preocupe, você pode tentar novamente a qualquer momento.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Precisa de ajuda?
            </h3>
            <p className="text-gray-600 mb-4">
              Entre em contato conosco pelo WhatsApp para esclarecer dúvidas sobre pagamento.
            </p>
            <a 
              href="https://api.whatsapp.com/send?phone=5519996049800&text=Acabei%20de%20fazer%20a%20minha%20inscri%C3%A7%C3%A3o%20e%20estou%20com%20duvida"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors inline-block"
            >
              Falar no WhatsApp
            </a>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/payment"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Tentar Pagamento Novamente</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
            
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
