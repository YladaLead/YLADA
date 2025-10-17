import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Teste de Compartilhamento - Herbalead',
  description: 'Teste como o Herbalead aparece quando compartilhado no WhatsApp e outras redes sociais.',
  openGraph: {
    title: 'Teste de Compartilhamento - Herbalead',
    description: 'Teste como o Herbalead aparece quando compartilhado no WhatsApp e outras redes sociais.',
    url: 'https://herbalead.com/test-share',
    siteName: 'Herbalead',
    images: [
      {
        url: '/logos/herbalead/herbalead-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Herbalead - Your Lead Accelerator',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teste de Compartilhamento - Herbalead',
    description: 'Teste como o Herbalead aparece quando compartilhado no WhatsApp e outras redes sociais.',
    images: ['/logos/herbalead/herbalead-og-image.png'],
  },
}

export default function TestSharePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Teste de Compartilhamento
          </h1>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                ✅ Configurações Implementadas
              </h2>
              <ul className="space-y-2 text-green-700">
                <li>• Open Graph tags para Facebook, WhatsApp, LinkedIn</li>
                <li>• Twitter Cards para compartilhamento no Twitter</li>
                <li>• Manifest.json para PWA</li>
                <li>• Favicon e Apple Touch Icon</li>
                <li>• Meta tags específicas para cada rede social</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                🔗 Como Testar
              </h2>
              <ol className="space-y-2 text-blue-700">
                <li>1. Copie esta URL: <code className="bg-blue-100 px-2 py-1 rounded">https://herbalead.com</code></li>
                <li>2. Cole no WhatsApp e envie para alguém</li>
                <li>3. Verifique se aparece o logo do Herbalead</li>
                <li>4. Teste também no Facebook, LinkedIn e Twitter</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-800 mb-4">
                ⚠️ Importante
              </h2>
              <ul className="space-y-2 text-yellow-700">
                <li>• Pode levar alguns minutos para as redes sociais atualizarem o cache</li>
                <li>• Use ferramentas como Facebook Debugger para forçar atualização</li>
                <li>• WhatsApp pode demorar até 24h para atualizar</li>
                <li>• Teste em diferentes dispositivos e navegadores</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🛠️ Ferramentas de Debug
              </h2>
              <div className="space-y-2">
                <a 
                  href="https://developers.facebook.com/tools/debug/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  Facebook Debugger
                </a>
                <a 
                  href="https://cards-dev.twitter.com/validator" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  Twitter Card Validator
                </a>
                <a 
                  href="https://www.linkedin.com/post-inspector/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  LinkedIn Post Inspector
                </a>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
