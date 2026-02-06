'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { AULA_PAGA_ZOOM_LINK, AULA_PAGA_DATA_HORARIO_LONGO } from '@/lib/aula-paga-config'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_NUTRI_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5519997230912'
const WHATSAPP_MSG = 'Acabei de me inscrever na aula da YLADA Nutri e quero receber informações adicionais e o link da aula.'
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(WHATSAPP_MSG)}`

function AgendaCheiaSucessoContent() {
  const searchParams = useSearchParams()
  const isPending = searchParams.get('status') === 'pending'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <Link href="/pt/nutri">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={133}
              height={40}
              className="h-8 sm:h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border-2 border-green-200 p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
            {isPending ? 'Pagamento em processamento' : 'Inscrição confirmada!'}
          </h1>
          <p className="text-gray-700 text-lg mb-4">
            {isPending
              ? 'Seu pagamento está sendo processado. Em breve você receberá a confirmação por e-mail e o link da aula por WhatsApp.'
              : <>Sua inscrição na aula foi confirmada. <strong>Próxima aula: {AULA_PAGA_DATA_HORARIO_LONGO}</strong>.</>}
          </p>
          {!isPending && (
            <>
              <div className="mb-4 p-4 bg-gray-50 rounded-xl text-left">
                <p className="text-sm font-semibold text-gray-700 mb-2">🔗 Link da sala Zoom (guarde ou clique para entrar no dia):</p>
                <a href={AULA_PAGA_ZOOM_LINK} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-sm">
                  {AULA_PAGA_ZOOM_LINK}
                </a>
              </div>
              <p className="text-gray-600 text-base mb-6">
                Você também receberá lembretes por e-mail e WhatsApp. Clique abaixo se quiser falar com a gente:
              </p>
            </>
          )}
          {!isPending && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-green-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors mb-6"
            >
              <span>Receber informações e link no WhatsApp</span>
            </a>
          )}
          <Link
            href="/pt/nutri"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function AgendaCheiaSucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Carregando...</div>
      </div>
    }>
      <AgendaCheiaSucessoContent />
    </Suspense>
  )
}
