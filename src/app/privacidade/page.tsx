export const metadata = {
  title: 'Política de Privacidade | Ylada',
  description: 'Política de Privacidade da plataforma Ylada — Portal Solutions Tech & Innovation LTDA',
}

export default function PoliticaDePrivacidade() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
      <p className="text-sm text-gray-500 mb-10">Última atualização: maio de 2026</p>

      {/* 1. Quem somos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Quem somos</h2>
        <p className="mb-3">
          A <strong>YLADA</strong> (ylada.com) é uma plataforma brasileira de diagnóstico de negócios
          com inteligência artificial, operada por:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-1">
          <p><strong>Razão Social:</strong> Portal Solutions Tech &amp; Innovation Ltda</p>
          <p><strong>Nome Fantasia:</strong> YLADA — Your Lead and Data Assistant</p>
          <p><strong>CNPJ:</strong> 63.447.492/0001-88</p>
          <p><strong>Endereço:</strong> R. Dona Eugênia, 345, Apto 92 — Jardim Europa, Piracicaba/SP — CEP 13.416-401</p>
          <p><strong>E-mail:</strong>{' '}
            <a href="mailto:suporte@ylada.com" className="text-blue-600 underline">suporte@ylada.com</a>
          </p>
        </div>
        <p className="mt-3">
          Esta Política descreve como coletamos, usamos, armazenamos e protegemos os dados pessoais dos
          nossos usuários, em conformidade com a <strong>Lei Geral de Proteção de Dados — LGPD
          (Lei nº 13.709/2018)</strong> e os requisitos das plataformas Google Play e Apple App Store.
        </p>
      </section>

      {/* 2. Idade mínima */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Público e idade mínima</h2>
        <p>
          A plataforma YLADA é destinada exclusivamente a <strong>pessoas com 18 anos ou mais</strong>.
          Não coletamos intencionalmente dados de menores de idade. Se identificarmos que um menor
          forneceu dados sem autorização, os excluiremos imediatamente. Caso suspeite disso,
          entre em contato pelo{' '}
          <a href="mailto:suporte@ylada.com" className="text-blue-600 underline">suporte@ylada.com</a>.
        </p>
      </section>

      {/* 3. Dados que coletamos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Dados que coletamos</h2>
        <p className="mb-3">Coletamos os seguintes dados quando você interage com nossa plataforma:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Dados de identificação:</strong> nome completo, endereço de e-mail</li>
          <li><strong>Dados de contato:</strong> número de WhatsApp</li>
          <li><strong>Dados comportamentais:</strong> respostas fornecidas em quizzes e diagnósticos</li>
          <li><strong>Dados de conversas:</strong> histórico de interações com nosso agente de atendimento (Carol)</li>
          <li><strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo, navegador e dados de uso da plataforma (via cookies técnicos)</li>
        </ul>
        <p className="mt-3">
          Não coletamos dados sensíveis (origem racial, convicções religiosas, dados de saúde, biometria
          ou orientação sexual) conforme definido pelo Art. 5º, II da LGPD.
        </p>
      </section>

      {/* 4. Base legal para o tratamento */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Base legal para o tratamento (Art. 7º — LGPD)</h2>
        <p className="mb-3">
          Todo tratamento de dados pessoais realizado pela YLADA está fundamentado nas seguintes
          bases legais:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Consentimento (Art. 7º, I):</strong> para o envio de comunicações de marketing,
            newsletters e atualizações do produto — você pode revogar a qualquer momento.
          </li>
          <li>
            <strong>Execução de contrato (Art. 7º, V):</strong> para operar a plataforma, processar
            diagnósticos e entregar os serviços contratados.
          </li>
          <li>
            <strong>Legítimo interesse (Art. 7º, IX):</strong> para melhorar nossos serviços, prevenir
            fraudes e garantir a segurança da plataforma, sempre respeitando seus direitos fundamentais.
          </li>
          <li>
            <strong>Cumprimento de obrigação legal (Art. 7º, II):</strong> quando exigido por lei,
            regulamentação ou ordem judicial.
          </li>
        </ul>
      </section>

      {/* 5. Como usamos seus dados */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Como usamos seus dados</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Conduzir diagnósticos personalizados de negócio ou saúde</li>
          <li>Qualificar leads e facilitar o contato com profissionais parceiros</li>
          <li>Operar e aprimorar o agente de atendimento Carol (IA)</li>
          <li>Enviar comunicações sobre o diagnóstico e próximos passos</li>
          <li>Enviar atualizações e novidades da plataforma (com consentimento)</li>
          <li>Cumprir obrigações legais e regulatórias</li>
        </ul>
      </section>

      {/* 6. Decisões automatizadas */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Decisões automatizadas e IA (Art. 20 — LGPD)</h2>
        <p className="mb-3">
          A plataforma YLADA utiliza inteligência artificial (OpenAI GPT-4) para processar suas respostas
          e gerar diagnósticos personalizados. O agente Carol conduz conversas automatizadas via WhatsApp
          para qualificar seu perfil e recomendar próximos passos.
        </p>
        <p>
          Em conformidade com o Art. 20 da LGPD, você tem o direito de <strong>solicitar revisão humana</strong>{' '}
          de qualquer decisão tomada exclusivamente por meios automatizados que afete seus interesses.
          Para isso, entre em contato pelo{' '}
          <a href="mailto:suporte@ylada.com" className="text-blue-600 underline">suporte@ylada.com</a>.
        </p>
      </section>

      {/* 7. Compartilhamento e transferências internacionais */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Compartilhamento e transferências internacionais (Art. 33 — LGPD)</h2>
        <p className="mb-3">
          Não vendemos seus dados pessoais. Podemos compartilhá-los com os seguintes fornecedores
          de serviço, estritamente para operar a plataforma:
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b">Fornecedor</th>
                <th className="text-left p-3 border-b">País</th>
                <th className="text-left p-3 border-b">Finalidade</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">Supabase</td>
                <td className="p-3">EUA</td>
                <td className="p-3">Armazenamento do banco de dados</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">OpenAI</td>
                <td className="p-3">EUA</td>
                <td className="p-3">Processamento de IA para diagnósticos e agente Carol</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">HubSpot</td>
                <td className="p-3">EUA</td>
                <td className="p-3">CRM e gestão de leads</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">MailerLite</td>
                <td className="p-3">UE/EUA</td>
                <td className="p-3">Envio de e-mails (com consentimento)</td>
              </tr>
              <tr>
                <td className="p-3">Meta (WhatsApp Business API)</td>
                <td className="p-3">EUA</td>
                <td className="p-3">Atendimento via WhatsApp pelo agente Carol</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Todas as transferências internacionais são realizadas com fornecedores que adotam salvaguardas
          adequadas de proteção de dados, em conformidade com o Art. 33 da LGPD.
        </p>
      </section>

      {/* 8. Retenção de dados */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Retenção de dados</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Dados de conta ativa:</strong> mantidos enquanto a conta estiver ativa</li>
          <li><strong>Dados de diagnósticos e conversas:</strong> até 2 anos após a última interação</li>
          <li><strong>Dados de leads:</strong> até 1 ano após o último contato, salvo consentimento para período maior</li>
          <li><strong>Dados para obrigações legais:</strong> pelo prazo exigido por lei (ex: 5 anos para dados fiscais)</li>
        </ul>
        <p className="mt-3">
          Você pode solicitar a exclusão dos seus dados a qualquer momento — veja a seção 10.
        </p>
      </section>

      {/* 9. Segurança */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Segurança</h2>
        <p>
          Seus dados são armazenados com controle de acesso por Row Level Security (RLS) no Supabase,
          conexões criptografadas via HTTPS/TLS e acesso restrito à equipe autorizada da YLADA.
          Em caso de incidente de segurança que afete seus dados, notificaremos você e a ANPD no prazo
          legal de até 2 dias úteis após a ciência do incidente, conforme Art. 48 da LGPD.
        </p>
      </section>

      {/* 10. Exclusão dos dados */}
      <section className="mb-8" id="exclusao">
        <h2 className="text-xl font-semibold mb-3">10. Exclusão dos seus dados</h2>
        <p>
          Para solicitar a exclusão dos seus dados, envie um e-mail para{' '}
          <a href="mailto:suporte@ylada.com" className="text-blue-600 underline">
            suporte@ylada.com
          </a>{' '}
          com o assunto <strong>"Exclusão de dados"</strong>. Atenderemos em até 10 dias úteis.
          Observe que alguns dados podem ser retidos por obrigação legal mesmo após o pedido de exclusão.
        </p>
      </section>

      {/* 11. Seus direitos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">11. Seus direitos (LGPD — Art. 18)</h2>
        <p className="mb-2">Em conformidade com a LGPD, você tem direito a:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Confirmar a existência de tratamento dos seus dados</li>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários</li>
          <li>Solicitar portabilidade dos seus dados</li>
          <li>Revogar o consentimento a qualquer momento</li>
          <li>Opor-se a tratamento realizado com fundamento em outra base legal</li>
          <li>Solicitar revisão de decisões automatizadas (Art. 20)</li>
          <li>Peticionar à ANPD (Autoridade Nacional de Proteção de Dados)</li>
        </ul>
        <p className="mt-3">
          Para exercer qualquer desses direitos, entre em contato pelo{' '}
          <a href="mailto:suporte@ylada.com" className="text-blue-600 underline">suporte@ylada.com</a>.
        </p>
      </section>

      {/* 12. Cookies */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">12. Cookies</h2>
        <p className="mb-3">
          Utilizamos apenas <strong>cookies técnicos essenciais</strong> para o funcionamento da
          plataforma (autenticação de sessão, preferências do usuário). Não utilizamos cookies de
          rastreamento de terceiros para fins publicitários.
        </p>
        <p>
          A hospedagem é realizada na Vercel, que pode registrar dados técnicos de acesso (IP, user agent)
          conforme sua própria política de privacidade (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">vercel.com/legal/privacy-policy</a>).
        </p>
      </section>

      {/* 13. Alterações */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">13. Alterações nesta política</h2>
        <p>
          Podemos atualizar esta política periodicamente. Alterações relevantes serão comunicadas
          por e-mail ou por aviso na plataforma com pelo menos 10 dias de antecedência. A data de
          última atualização estará sempre indicada no topo desta página.
        </p>
      </section>

      {/* 14. Contato */}
      <section>
        <h2 className="text-xl font-semibold mb-3">14. Contato e Encarregado de Dados</h2>
        <p className="mb-3">
          Para dúvidas, solicitações ou reclamações relacionadas a esta Política, entre em contato:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-1">
          <p><strong>E-mail:</strong>{' '}
            <a href="mailto:suporte@ylada.com" className="text-blue-600 underline">suporte@ylada.com</a>
          </p>
          <p><strong>Empresa:</strong> Portal Solutions Tech &amp; Innovation Ltda</p>
          <p><strong>CNPJ:</strong> 63.447.492/0001-88</p>
          <p><strong>Endereço:</strong> R. Dona Eugênia, 345, Apto 92 — Jardim Europa, Piracicaba/SP — CEP 13.416-401</p>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Você também pode contatar a{' '}
          <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            ANPD — Autoridade Nacional de Proteção de Dados
          </a>{' '}
          para registrar reclamações sobre o tratamento dos seus dados pessoais.
        </p>
      </section>
    </main>
  )
}
