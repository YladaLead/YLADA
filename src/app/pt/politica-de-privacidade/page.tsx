import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

export const metadata = {
  title: 'Política de Privacidade - YLADA',
  description: 'Política de Privacidade da plataforma YLADA - Conformidade com LGPD e GDPR',
}

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/pt">
            <YLADALogo size="sm" responsive={true} className="bg-transparent" />
          </Link>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Política de Privacidade
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
                1. Introdução
              </h2>
              <p>
                A YLADA ("nós", "nosso" ou "plataforma") está comprometida em proteger a privacidade 
                e os dados pessoais de nossos usuários. Esta Política de Privacidade descreve como 
                coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade 
                com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e o Regulamento Geral 
                sobre a Proteção de Dados (GDPR - Regulamento UE 2016/679).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Dados que Coletamos
              </h2>
              <p className="mb-4">Coletamos os seguintes tipos de dados pessoais:</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.1. Dados de Identificação
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone/WhatsApp</li>
                <li>CPF (quando necessário para serviços específicos)</li>
                <li>Data de nascimento</li>
                <li>Gênero</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.2. Dados de Endereço
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Rua, número, complemento</li>
                <li>Bairro, cidade, estado</li>
                <li>CEP</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.3. Dados Profissionais
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>CRN (para nutricionistas)</li>
                <li>Especialidades</li>
                <li>Certificações</li>
                <li>Nível Herbalife (quando aplicável)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.4. Dados de Uso
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Histórico de navegação</li>
                <li>Interações com a plataforma</li>
                <li>Preferências e configurações</li>
                <li>Logs de acesso</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.5. Dados de Pagamento
              </h3>
              <p>
                Processamos dados de pagamento através de provedores terceirizados (Stripe, Mercado Pago). 
                Não armazenamos informações completas de cartão de crédito em nossos servidores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Como Coletamos Dados
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Diretamente de você:</strong> Quando você se cadastra, preenche formulários, 
                atualiza seu perfil ou entra em contato conosco.</li>
                <li><strong>Automaticamente:</strong> Quando você usa nossa plataforma, coletamos dados 
                de uso através de cookies e tecnologias similares.</li>
                <li><strong>De terceiros:</strong> Quando você se conecta através de serviços de 
                autenticação de terceiros (ex: Google, Facebook).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Finalidade do Tratamento
              </h2>
              <p className="mb-4">Utilizamos seus dados pessoais para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar pagamentos e gerenciar assinaturas</li>
                <li>Comunicar-nos com você sobre sua conta e serviços</li>
                <li>Enviar notificações importantes e atualizações</li>
                <li>Personalizar sua experiência na plataforma</li>
                <li>Cumprir obrigações legais</li>
                <li>Prevenir fraudes e garantir segurança</li>
                <li>Realizar análises e pesquisas (dados anonimizados)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Base Legal para Processamento
              </h2>
              <p className="mb-4">Processamos seus dados com base em:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consentimento:</strong> Quando você nos dá permissão explícita</li>
                <li><strong>Execução de contrato:</strong> Para cumprir nossos termos de serviço</li>
                <li><strong>Obrigação legal:</strong> Para cumprir leis e regulamentos</li>
                <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços e segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Compartilhamento de Dados
              </h2>
              <p className="mb-4">Compartilhamos seus dados apenas nas seguintes situações:</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                6.1. Provedores de Serviços
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Supabase:</strong> Hospedagem de banco de dados e autenticação</li>
                <li><strong>Stripe/Mercado Pago:</strong> Processamento de pagamentos</li>
                <li><strong>Vercel:</strong> Hospedagem da aplicação</li>
                <li><strong>OpenAI:</strong> Processamento de IA (dados anonimizados)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                6.2. Obrigações Legais
              </h3>
              <p>
                Podemos divulgar dados se exigido por lei, ordem judicial ou autoridade competente.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                6.3. Transferência Internacional
              </h3>
              <p>
                Alguns de nossos provedores podem estar localizados fora do Brasil. Garantimos que 
                todos os provedores estão em conformidade com padrões internacionais de proteção de dados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Retenção de Dados
              </h2>
              <p className="mb-4">Mantemos seus dados pessoais pelo período necessário para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cumprir as finalidades descritas nesta política</li>
                <li>Atender obrigações legais e regulatórias</li>
                <li>Resolver disputas e fazer cumprir nossos acordos</li>
              </ul>
              <p className="mt-4">
                <strong>Períodos específicos:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dados de conta ativa: Enquanto sua conta estiver ativa</li>
                <li>Dados de conta inativa: 2 anos após último acesso</li>
                <li>Dados de assinatura cancelada: 1 ano após cancelamento</li>
                <li>Logs de acesso: 2 anos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Seus Direitos (LGPD/GDPR)
              </h2>
              <p className="mb-4">Você tem os seguintes direitos sobre seus dados pessoais:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">8.1. Direito de Acesso</h3>
                  <p>Você pode solicitar uma cópia de todos os dados que temos sobre você.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">8.2. Direito de Correção</h3>
                  <p>Você pode corrigir dados incorretos ou incompletos através da sua área de configurações.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">8.3. Direito de Exclusão</h3>
                  <p>Você pode solicitar a exclusão de seus dados pessoais ("direito ao esquecimento").</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">8.4. Direito de Portabilidade</h3>
                  <p>Você pode solicitar seus dados em formato estruturado e legível por máquina.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">8.5. Direito de Oposição</h3>
                  <p>Você pode se opor ao processamento de seus dados para fins específicos.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">8.6. Direito de Revogação</h3>
                  <p>Você pode revogar seu consentimento a qualquer momento.</p>
                </div>
              </div>

              <p className="mt-6">
                Para exercer seus direitos, entre em contato através de: <strong>privacidade@ylada.com</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                9. Segurança dos Dados
              </h2>
              <p className="mb-4">Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
                <li>Criptografia de dados em repouso</li>
                <li>Controle de acesso baseado em funções (RBAC)</li>
                <li>Row Level Security (RLS) no banco de dados</li>
                <li>Monitoramento de segurança 24/7</li>
                <li>Backups regulares e seguros</li>
                <li>Autenticação de dois fatores (quando disponível)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                10. Cookies e Tecnologias Similares
              </h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência. Para mais 
                informações, consulte nossa <Link href="/pt/politica-de-cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                11. Menores de Idade
              </h2>
              <p>
                Nossos serviços são destinados a maiores de 18 anos. Não coletamos intencionalmente 
                dados de menores de idade. Se tomarmos conhecimento de que coletamos dados de um menor, 
                tomaremos medidas para excluir essas informações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                12. Alterações nesta Política
              </h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre 
                mudanças significativas por e-mail ou através de avisos na plataforma. A data da última 
                atualização está indicada no topo desta página.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                13. Encarregado de Dados (DPO)
              </h2>
              <p className="mb-4">
                Para questões relacionadas à proteção de dados, entre em contato com nosso Encarregado 
                de Dados:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> privacidade@ylada.com</p>
                <p className="mt-2"><strong>Empresa:</strong> Portal Solutions Tech & Innovation LTDA</p>
                <p><strong>CNPJ:</strong> 63.447.492/0001-88</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                14. Consentimento
              </h2>
              <p>
                Ao usar nossa plataforma, você concorda com esta Política de Privacidade. Se não 
                concordar, por favor, não use nossos serviços.
              </p>
            </section>
          </div>

          {/* Links relacionados */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Documentos relacionados:</p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/pt/termos-de-uso" 
                className="text-blue-600 hover:underline"
              >
                Termos de Uso
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                href="/pt/politica-de-cookies" 
                className="text-blue-600 hover:underline"
              >
                Política de Cookies
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                href="/pt/politica-de-reembolso" 
                className="text-blue-600 hover:underline"
              >
                Política de Reembolso
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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






