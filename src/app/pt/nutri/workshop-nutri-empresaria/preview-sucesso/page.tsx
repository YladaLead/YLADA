import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

function buildWhatsappUrl(phone: string, message: string) {
  const numeroLimpo = phone.replace(/\D/g, '')
  if (!numeroLimpo) return null
  return `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(message)}`
}

/**
 * Cópia estática da tela de sucesso pós-inscrição (Nutri Empresária), só em `next dev`.
 * Em produção: 404. Não deployar uso público — apenas localhost para revisar layout.
 */
export default function WorkshopNutriEmpresariaPreviewSucessoPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const confirmedFirstName = 'Maria'
  const waMsg =
    'Olá! Sou Maria. Acabei de me inscrever na aula Nutri Empresária (YLADA, nutri → empresária) pelo site. Quero iniciar por aqui para receber o link da aula e os lembretes da automação. Obrigada!'
  const whatsappRedirectUrl = buildWhatsappUrl('5519997230912', waMsg)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-600 to-blue-700 flex flex-col">
      <div className="bg-amber-400 text-amber-950 text-center text-xs font-bold py-2 px-3 shrink-0">
        Preview só no localhost (dev) — em produção esta rota não existe
      </div>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-14 sm:h-16 flex items-center shrink-0">
        <div className="container mx-auto px-4 sm:px-6 py-2">
          <Link href="/pt/nutri" className="block">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={180}
              height={54}
              className="h-9 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>
        </div>
      </header>

      <main className="px-4 py-10 sm:py-14 flex-1">
        <div className="max-w-md mx-auto text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
            {confirmedFirstName ? `${confirmedFirstName}, inscrição confirmada!` : 'Inscrição confirmada!'}
          </h3>
          <p className="text-white/95 text-sm sm:text-base mb-2 leading-relaxed">
            Seus dados foram salvos. Em instantes abrimos o WhatsApp{' '}
            <strong className="text-white">+55 (19) 99723-0912</strong> para você enviar a mensagem e entrar na
            automação (link da aula + lembretes).
          </p>
          <p className="text-white/85 text-xs mb-6">Se não abrir sozinho, use o botão abaixo.</p>
          {whatsappRedirectUrl ? (
            <a
              href={whatsappRedirectUrl}
              className="inline-block w-full bg-green-500 hover:bg-green-600 text-white px-5 py-3.5 rounded-xl font-black text-base shadow-lg"
            >
              Abrir WhatsApp agora
            </a>
          ) : null}
          <p className="text-white/70 text-xs mt-5">E-mail de confirmação pode cair no spam — dá uma olhadinha.</p>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 shrink-0">
        <div className="container mx-auto px-4 flex justify-center">
          <Link href="/pt" className="block">
            <Image
              src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
              alt="YLADA"
              width={120}
              height={32}
              className="h-7 w-auto object-contain opacity-95"
            />
          </Link>
        </div>
      </footer>
    </div>
  )
}
