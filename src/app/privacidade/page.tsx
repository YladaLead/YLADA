export const metadata = {
  title: 'Política de Privacidade | Ylada',
  description: 'Política de Privacidade da plataforma Ylada',
}

export default function PoliticaDePrivacidade() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
      <p className="text-sm text-gray-500 mb-10">Última atualização: maio de 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Quem somos</h2>
        <p>
          A Ylada (ylada.com) é uma plataforma brasileira de diagnóstico de negócios com inteligência artificial,
          operada por Andre Faula. Nosso contato é{' '}
          <a href="mailto:faulaandre@gmail.com" className="text-blue-600 underline">
            faulaandre@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Dados que coletamos</h2>
        <p className="mb-3">Coletamos os seguintes dados quando você interage com nossa plataforma:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Nome completo</li>
          <li>Endereço de e-mail</li>
          <li>Número de WhatsApp</li>
          <li>Respostas fornecidas em quizzes ou diagnósticos</li>
          <li>Histórico de conversas com nosso agente de atendimento (Carol)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Como usamos seus dados</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Para conduzir diagnósticos personalizados do seu negócio</li>
          <li>Para entrar em contato com você sobre o diagnóstico gratuito</li>
          <li>Para melhorar nossos serviços e agentes de IA</li>
          <li>Para enviar comunicações relevantes (com sua autorização)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Compartilhamento de dados</h2>
        <p>
          Não vendemos seus dados. Podemos compartilhá-los com ferramentas de apoio operacional (como HubSpot CRM
          e MailerLite para e-mails), sempre com finalidade exclusiva de prestar o serviço contratado.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Retenção de dados</h2>
        <p>
          Mantemos seus dados pelo tempo necessário para a prestação do serviço. Você pode solicitar a exclusão
          a qualquer momento.
        </p>
      </section>

      <section className="mb-8" id="exclusao">
        <h2 className="text-xl font-semibold mb-3">6. Exclusão dos seus dados</h2>
        <p>
          Para solicitar a exclusão dos seus dados, envie um e-mail para{' '}
          <a href="mailto:faulaandre@gmail.com" className="text-blue-600 underline">
            faulaandre@gmail.com
          </a>{' '}
          com o assunto <strong>"Exclusão de dados"</strong>. Atenderemos sua solicitação em até 10 dias úteis.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Segurança</h2>
        <p>
          Seus dados são armazenados de forma segura no Supabase (infraestrutura PostgreSQL com controle de
          acesso por Row Level Security). O acesso é restrito à equipe da Ylada.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Seus direitos (LGPD)</h2>
        <p className="mb-2">
          Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incorretos</li>
          <li>Solicitar a exclusão dos seus dados</li>
          <li>Revogar o consentimento a qualquer momento</li>
          <li>Solicitar portabilidade dos seus dados</li>
        </ul>
        <p className="mt-3">
          Entre em contato pelo e-mail{' '}
          <a href="mailto:faulaandre@gmail.com" className="text-blue-600 underline">
            faulaandre@gmail.com
          </a>{' '}
          para exercer qualquer um desses direitos.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Cookies</h2>
        <p>
          Usamos cookies técnicos essenciais para o funcionamento da plataforma. Não usamos cookies de
          rastreamento de terceiros.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">10. Alterações nesta política</h2>
        <p>
          Podemos atualizar esta política periodicamente. A data de última atualização estará sempre indicada
          no topo desta página.
        </p>
      </section>
    </main>
  )
}
