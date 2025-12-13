import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

export const metadata = {
  title: 'Política de Reembolso - YLADA',
  description: 'Política de Reembolso da plataforma YLADA',
}

export default function PoliticaReembolsoPage() {
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
            Política de Reembolso
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
                1. Direito de Arrependimento
              </h2>
              <p>
                De acordo com o Código de Defesa do Consumidor (CDC - Lei 8.078/1990), você tem o 
                direito de se arrepender da compra de serviços prestados à distância, no prazo de 
                <strong> 7 (sete) dias corridos</strong>, contados a partir da data da contratação, 
                sem necessidade de justificativa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Prazo para Solicitar Reembolso
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-blue-900">
                  Você tem até 7 dias corridos após a contratação para solicitar reembolso total.
                </p>
              </div>
              <p>
                O prazo de 7 dias começa a contar a partir da data em que você efetuou o pagamento 
                e sua assinatura foi ativada.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Como Solicitar Reembolso
              </h2>
              <p className="mb-4">
                Para solicitar reembolso, você pode:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Enviar um e-mail para <strong>suporte@ylada.com</strong> com o assunto "Solicitação de Reembolso"</li>
                <li>Incluir seu e-mail cadastrado e número da transação (se disponível)</li>
                <li>Informar o motivo da solicitação (opcional, mas ajuda-nos a melhorar)</li>
              </ul>
              <p className="mt-4">
                Nossa equipe responderá em até <strong>2 dias úteis</strong> e processará o reembolso 
                em até <strong>10 dias úteis</strong> após a aprovação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Processamento do Reembolso
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                4.1. Prazo de Processamento
              </h3>
              <p>
                Após a aprovação da solicitação, o reembolso será processado em até <strong>10 dias úteis</strong>. 
                O valor aparecerá na sua fatura ou conta bancária dependendo do método de pagamento utilizado.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                4.2. Forma de Reembolso
              </h3>
              <p className="mb-4">
                O reembolso será feito na mesma forma de pagamento utilizada na compra:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cartão de Crédito:</strong> Estorno na fatura (pode levar 1-2 ciclos de faturamento)</li>
                <li><strong>PIX:</strong> Transferência direta para a conta cadastrada (até 2 dias úteis)</li>
                <li><strong>Boleto:</strong> Transferência bancária (até 10 dias úteis)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Condições para Reembolso
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                5.1. Reembolso Total (Até 7 dias)
              </h3>
              <p>
                Se você solicitar reembolso dentro de 7 dias corridos da contratação, receberá 
                <strong> 100% do valor pago</strong>, sem deduções.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                5.2. Após 7 dias
              </h3>
              <p>
                Após o prazo de 7 dias, reembolsos podem ser avaliados caso a caso, especialmente 
                em situações de:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Problemas técnicos que impedem o uso do serviço</li>
                <li>Erros em nossa parte na prestação do serviço</li>
                <li>Cancelamento de assinatura anual (reembolso proporcional pode ser considerado)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Situações que NÃO Geram Reembolso
              </h2>
              <p className="mb-4">
                Não oferecemos reembolso nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uso indevido ou violação dos Termos de Uso</li>
                <li>Cancelamento após uso extensivo do serviço (após 7 dias)</li>
                <li>Mudança de opinião sobre o serviço (após 7 dias)</li>
                <li>Problemas causados por terceiros (provedores de internet, navegadores, etc.)</li>
                <li>Uso de recursos que violam nossos termos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Assinaturas Anuais
              </h2>
              <p className="mb-4">
                Para assinaturas anuais:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Até 7 dias:</strong> Reembolso total (100%)</li>
                <li><strong>Após 7 dias:</strong> Reembolso proporcional pode ser considerado caso a caso</li>
                <li><strong>Após 30 dias:</strong> Geralmente não oferecemos reembolso, exceto em casos excepcionais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Cancelamento de Assinatura
              </h2>
              <p>
                Você pode cancelar sua assinatura a qualquer momento através das configurações da sua 
                conta. O cancelamento entra em vigor no final do período já pago. Não há reembolso 
                automático ao cancelar, exceto se solicitado dentro do prazo de 7 dias.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                9. Reembolsos de Promoções e Descontos
              </h2>
              <p>
                Se você utilizou um cupom de desconto ou promoção, o reembolso será calculado sobre o 
                valor efetivamente pago (valor com desconto), não sobre o valor original.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                10. Contato para Reembolsos
              </h2>
              <p className="mb-4">
                Para solicitar reembolso ou esclarecer dúvidas:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> suporte@ylada.com</p>
                <p className="mt-2"><strong>Assunto:</strong> Solicitação de Reembolso</p>
                <p className="mt-2"><strong>Prazo de resposta:</strong> Até 2 dias úteis</p>
                <p className="mt-2"><strong>Empresa:</strong> Portal Solutions Tech & Innovation LTDA</p>
                <p><strong>CNPJ:</strong> 63.447.492/0001-88</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                11. Resolução de Disputas
              </h2>
              <p>
                Se você não estiver satisfeito com nossa decisão sobre um reembolso, você pode:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Entrar em contato novamente com nossa equipe de suporte</li>
                <li>Buscar resolução através de órgãos de defesa do consumidor (PROCON)</li>
                <li>Recorrer à justiça, se necessário</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                12. Alterações nesta Política
              </h2>
              <p>
                Podemos atualizar esta Política de Reembolso periodicamente. Alterações significativas 
                serão comunicadas por e-mail ou através de avisos na plataforma.
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
                href="/pt/politica-de-privacidade" 
                className="text-blue-600 hover:underline"
              >
                Política de Privacidade
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






