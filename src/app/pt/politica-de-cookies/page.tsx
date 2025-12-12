import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

export const metadata = {
  title: 'Política de Cookies - YLADA',
  description: 'Política de Cookies da plataforma YLADA',
}

export default function PoliticaCookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/pt">
            <YLADALogo size="sm" responsive={true} className="bg-transparent" />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Política de Cookies
          </h1>

          <p className="text-gray-600 mb-8">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                1. O que são Cookies?
              </h2>
              <p>
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet 
                ou celular) quando você visita um site. Eles permitem que o site reconheça seu dispositivo 
                e armazene algumas informações sobre suas preferências ou ações passadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Como Usamos Cookies
              </h2>
              <p className="mb-4">
                Utilizamos cookies para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manter você logado na plataforma</li>
                <li>Lembrar suas preferências e configurações</li>
                <li>Melhorar a segurança da plataforma</li>
                <li>Analisar como você usa nossa plataforma</li>
                <li>Personalizar sua experiência</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Tipos de Cookies que Utilizamos
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                3.1. Cookies Essenciais
              </h3>
              <p className="mb-4">
                Estes cookies são necessários para o funcionamento básico da plataforma. Sem eles, 
                você não consegue usar recursos essenciais como login e segurança.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Autenticação:</strong> Mantém você logado</li>
                <li><strong>Segurança:</strong> Protege contra fraudes e ataques</li>
                <li><strong>Preferências:</strong> Lembra suas configurações básicas</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                <strong>Nota:</strong> Estes cookies não podem ser desativados, pois são essenciais 
                para o funcionamento da plataforma.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                3.2. Cookies de Funcionalidade
              </h3>
              <p className="mb-4">
                Estes cookies permitem que a plataforma lembre escolhas que você fez (como idioma 
                preferido) e forneça recursos aprimorados e mais personalizados.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Idioma preferido</li>
                <li>Configurações de notificações</li>
                <li>Preferências de exibição</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                3.3. Cookies de Análise
              </h3>
              <p className="mb-4">
                Estes cookies nos ajudam a entender como os visitantes interagem com nossa plataforma, 
                fornecendo informações sobre áreas visitadas, tempo gasto e problemas encontrados.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Analytics (quando habilitado)</li>
                <li>Métricas de uso interno</li>
                <li>Análise de performance</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                <strong>Nota:</strong> Você pode desativar estes cookies através das configurações 
                do seu navegador ou nosso banner de consentimento.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                3.4. Cookies de Terceiros
              </h3>
              <p className="mb-4">
                Alguns cookies são definidos por serviços de terceiros que aparecem em nossas páginas:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Stripe/Mercado Pago:</strong> Para processamento de pagamentos</li>
                <li><strong>Supabase:</strong> Para autenticação e banco de dados</li>
                <li><strong>Vercel:</strong> Para hospedagem e analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Duração dos Cookies
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                4.1. Cookies de Sessão
              </h3>
              <p>
                São temporários e são excluídos quando você fecha o navegador. Usados principalmente 
                para manter você logado durante sua visita.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                4.2. Cookies Persistentes
              </h3>
              <p>
                Permanecem no seu dispositivo por um período determinado (geralmente até 1 ano) ou 
                até que você os exclua. Usados para lembrar suas preferências entre visitas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Como Gerenciar Cookies
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                5.1. Através do Banner de Consentimento
              </h3>
              <p>
                Quando você visita nossa plataforma pela primeira vez, mostramos um banner permitindo 
                que você escolha quais tipos de cookies aceitar. Você pode alterar suas preferências 
                a qualquer momento através das configurações da sua conta.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                5.2. Através do Navegador
              </h3>
              <p className="mb-4">
                A maioria dos navegadores permite que você:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Veja quais cookies estão armazenados</li>
                <li>Exclua cookies individuais ou todos</li>
                <li>Bloqueie cookies de sites específicos</li>
                <li>Bloqueie cookies de terceiros</li>
                <li>Exclua todos os cookies quando fechar o navegador</li>
              </ul>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Como gerenciar cookies nos principais navegadores:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
                  <li><strong>Firefox:</strong> Opções → Privacidade e Segurança → Cookies</li>
                  <li><strong>Safari:</strong> Preferências → Privacidade → Cookies</li>
                  <li><strong>Edge:</strong> Configurações → Cookies e permissões do site</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Impacto de Desativar Cookies
              </h2>
              <p className="mb-4">
                Se você desativar cookies, algumas funcionalidades da plataforma podem não funcionar 
                corretamente:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Você precisará fazer login a cada visita</li>
                <li>Suas preferências não serão salvas</li>
                <li>Algumas funcionalidades podem estar indisponíveis</li>
                <li>A experiência pode ser menos personalizada</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Cookies de Terceiros
              </h2>
              <p>
                Alguns cookies são definidos por serviços de terceiros. Não temos controle sobre esses 
                cookies. Recomendamos que você verifique as políticas de privacidade desses serviços:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Privacy Policy</a></li>
                <li><a href="https://www.mercadopago.com.br/developers/pt/docs/checkout-api/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mercado Pago Privacy</a></li>
                <li><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Privacy Policy</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Atualizações desta Política
              </h2>
              <p>
                Podemos atualizar esta Política de Cookies periodicamente. Recomendamos que você revise 
                esta página ocasionalmente para se manter informado sobre como usamos cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                9. Contato
              </h2>
              <p className="mb-4">
                Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> privacidade@ylada.com</p>
                <p className="mt-2"><strong>Empresa:</strong> Portal Solutions Tech & Innovation LTDA</p>
                <p><strong>CNPJ:</strong> 63.447.492/0001-88</p>
              </div>
            </section>
          </div>

          {/* Links relacionados */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Documentos relacionados:</p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/pt/politica-de-privacidade" 
                className="text-blue-600 hover:underline"
              >
                Política de Privacidade
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                href="/pt/termos-de-uso" 
                className="text-blue-600 hover:underline"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-500 text-xs text-center">
              © {new Date().getFullYear()} YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}




