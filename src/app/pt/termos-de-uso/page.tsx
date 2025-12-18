import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

export const metadata = {
  title: 'Termos de Uso - YLADA',
  description: 'Termos de Uso da plataforma YLADA',
}

export default function TermosUsoPage() {
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
            Termos de Uso
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
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar e usar a plataforma YLADA ("Plataforma", "Serviço"), você concorda em cumprir 
                e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes 
                termos, não deve usar nossos serviços.
              </p>
              <p className="mt-4">
                Estes termos constituem um acordo legal entre você ("Usuário", "Você") e a Portal Solutions 
                Tech & Innovation LTDA ("YLADA", "Nós", "Nosso").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Descrição dos Serviços
              </h2>
              <p className="mb-4">
                A YLADA oferece uma plataforma SaaS (Software as a Service) que permite:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criação de ferramentas de captação de leads (quizzes, formulários, calculadoras)</li>
                <li>Gestão de clientes e leads</li>
                <li>Geração de conteúdo com inteligência artificial</li>
                <li>Ferramentas de acompanhamento e gestão</li>
                <li>Outros serviços relacionados conforme disponibilizados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Cadastro e Conta de Usuário
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                3.1. Requisitos
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Você deve ter pelo menos 18 anos de idade</li>
                <li>Você deve fornecer informações precisas e completas</li>
                <li>Você é responsável por manter a segurança de sua conta</li>
                <li>Você não pode compartilhar sua conta com terceiros</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                3.2. Responsabilidades
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manter sua senha segura e confidencial</li>
                <li>Notificar-nos imediatamente sobre uso não autorizado</li>
                <li>Ser responsável por todas as atividades em sua conta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Assinaturas e Pagamentos
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                4.1. Planos e Preços
              </h3>
              <p>
                Oferecemos diferentes planos de assinatura. Os preços podem ser alterados com aviso prévio 
                de 30 dias. Alterações de preço não afetam assinaturas já ativas durante o período contratado.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                4.2. Renovação Automática
              </h3>
              <p>
                As assinaturas são renovadas automaticamente no final de cada período (mensal ou anual), 
                a menos que você cancele antes da data de renovação.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                4.3. Cancelamento
              </h3>
              <p>
                Você pode cancelar sua assinatura a qualquer momento através da área de configurações. 
                O cancelamento entra em vigor no final do período pago. Não há reembolso proporcional 
                para períodos já pagos, exceto conforme nossa Política de Reembolso.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                4.4. Reembolsos
              </h3>
              <p>
                Reembolsos são regidos por nossa <Link href="/pt/politica-de-reembolso" className="text-blue-600 hover:underline">Política de Reembolso</Link>. 
                Em geral, oferecemos reembolso dentro de 7 dias da compra inicial, conforme o Código de 
                Defesa do Consumidor.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Uso Aceitável
              </h2>
              <p className="mb-4">Você concorda em NÃO:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usar a plataforma para atividades ilegais ou não autorizadas</li>
                <li>Violar direitos de propriedade intelectual de terceiros</li>
                <li>Enviar spam, malware ou conteúdo malicioso</li>
                <li>Tentar acessar áreas restritas ou contas de outros usuários</li>
                <li>Interferir no funcionamento da plataforma</li>
                <li>Usar bots, scrapers ou ferramentas automatizadas sem autorização</li>
                <li>Reproduzir, copiar ou revender nossos serviços sem permissão</li>
                <li>Usar a plataforma para competir conosco ou criar produtos similares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Propriedade Intelectual
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                6.1. Nossa Propriedade
              </h3>
              <p>
                Todo o conteúdo da plataforma, incluindo código, design, textos, gráficos, logos, 
                ícones e software, é propriedade da YLADA ou de seus licenciadores e está protegido 
                por leis de propriedade intelectual.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                6.2. Seu Conteúdo
              </h3>
              <p>
                Você mantém todos os direitos sobre o conteúdo que você cria na plataforma (quizzes, 
                formulários, textos gerados). Ao usar nossos serviços, você nos concede uma licença 
                não exclusiva para usar, armazenar e processar seu conteúdo apenas para fornecer e 
                melhorar nossos serviços.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                6.3. Conteúdo Gerado por IA
              </h3>
              <p>
                Conteúdo gerado por inteligência artificial através de nossa plataforma pode estar 
                sujeito a direitos de terceiros. Você é responsável por revisar e validar todo o 
                conteúdo gerado antes de usar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Limitação de Responsabilidade
              </h2>
              <p className="mb-4">
                Na máxima extensão permitida por lei:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A plataforma é fornecida "como está" e "conforme disponível"</li>
                <li>Não garantimos que o serviço será ininterrupto, seguro ou livre de erros</li>
                <li>Não somos responsáveis por perdas indiretas, incidentais ou consequenciais</li>
                <li>Nossa responsabilidade total é limitada ao valor pago por você nos últimos 12 meses</li>
                <li>Não somos responsáveis por conteúdo de terceiros ou ações de outros usuários</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Indenização
              </h2>
              <p>
                Você concorda em indenizar e isentar a YLADA, seus diretores, funcionários e parceiros 
                de qualquer reclamação, dano, obrigação, perda, responsabilidade, custo ou dívida, 
                incluindo honorários advocatícios, decorrentes de:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Seu uso ou mau uso da plataforma</li>
                <li>Violation destes Termos de Uso</li>
                <li>Violation de direitos de terceiros</li>
                <li>Conteúdo que você cria ou compartilha</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                9. Modificações do Serviço
              </h2>
              <p>
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer parte do serviço 
                a qualquer momento, com ou sem aviso prévio. Não seremos responsáveis por você ou terceiros 
                por qualquer modificação, suspensão ou descontinuação do serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                10. Modificações dos Termos
              </h2>
              <p>
                Podemos modificar estes Termos de Uso a qualquer momento. Alterações significativas serão 
                comunicadas por e-mail ou através de avisos na plataforma. O uso continuado do serviço após 
                as modificações constitui sua aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                11. Rescisão
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                11.1. Por Você
              </h3>
              <p>
                Você pode encerrar sua conta a qualquer momento através das configurações ou entrando 
                em contato conosco.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                11.2. Por Nós
              </h3>
              <p>
                Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, se você violar 
                estes Termos de Uso ou se estivermos legalmente obrigados a fazê-lo.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                11.3. Efeitos da Rescisão
              </h3>
              <p>
                Após a rescisão, seu direito de usar o serviço cessará imediatamente. Podemos deletar 
                sua conta e dados após um período de retenção conforme nossa Política de Privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                12. Lei Aplicável e Foro
              </h2>
              <p>
                Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa será resolvida 
                no foro da comarca de São Paulo, SP, Brasil, renunciando as partes a qualquer outro, 
                por mais privilegiado que seja.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                13. Disposições Gerais
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                13.1. Acordo Completo
              </h3>
              <p>
                Estes Termos, junto com nossa Política de Privacidade e Política de Cookies, constituem 
                o acordo completo entre você e a YLADA.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                13.2. Divisibilidade
              </h3>
              <p>
                Se qualquer disposição destes Termos for considerada inválida ou inexequível, as demais 
                disposições permanecerão em pleno vigor.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                13.3. Renúncia
              </h3>
              <p>
                Nossa falha em fazer valer qualquer direito ou disposição destes Termos não constitui 
                uma renúncia a tal direito ou disposição.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                14. Contato
              </h2>
              <p className="mb-4">
                Para questões sobre estes Termos de Uso, entre em contato:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> suporte@ylada.com</p>
                <p className="mt-2"><strong>Empresa:</strong> Portal Solutions Tech & Innovation LTDA</p>
                <p><strong>CNPJ:</strong> 63.447.492/0001-88</p>
                <p className="mt-2"><strong>Endereço:</strong> São Paulo, SP, Brasil</p>
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




















