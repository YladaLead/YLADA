'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import { ContentContainer, Heading, Paragraph, Section, InfoBox } from '@/components/formacao/ContentComponents'

export default function FerramentasManualTecnicoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/pt/nutri/metodo" className="hover:text-blue-600 transition-all duration-200 ease-out">Método YLADA</Link>
          <span className="text-gray-400">→</span>
          <Link href="/pt/nutri/ferramentas" className="hover:text-blue-600 transition-all duration-200 ease-out">Ferramentas</Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 font-medium">Manual Técnico</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Heading level={1} className="mb-2">Ferramentas + Uso Técnico</Heading>
              <Paragraph className="text-lg text-gray-600 mb-0">
                Guia completo de uso técnico de todas as ferramentas YLADA com exemplos práticos e boas práticas.
              </Paragraph>
            </div>
            <Link
              href="/pt/nutri/ferramentas"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-sm"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {/* Link para PDF 9 */}
        <InfoBox type="info" className="mb-6">
          <Paragraph className="mb-0">
            <strong>📘 Manual Técnico Completo:</strong>{' '}
            <Link
              href="/pt/nutri/metodo/biblioteca/pdf-9-manual-tecnico"
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Acesse o PDF completo do Manual Técnico das Ferramentas YLADA
            </Link>
          </Paragraph>
        </InfoBox>

        {/* Conteúdo Principal */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-6">
          <ContentContainer>
            <Section>
              <Heading level={2}>Uso de Ferramentas YLADA</Heading>
              <Paragraph>
                As ferramentas YLADA foram desenvolvidas para facilitar sua captação, atendimento e gestão de clientes. 
                Cada ferramenta tem um propósito específico e pode ser usada de forma integrada com o GSAL.
              </Paragraph>
            </Section>

            <Section>
              <Heading level={2}>Quizzes Personalizados</Heading>
              <Paragraph>
                Os quizzes são ferramentas poderosas para captação de leads qualificados. Eles permitem que você:
              </Paragraph>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-2">
                <li>Capture informações do lead de forma interativa</li>
                <li>Gere diagnósticos personalizados</li>
                <li>Conecte diretamente com o GSAL para acompanhamento</li>
              </ul>
              
              {/* Área para print de exemplo */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-500 mb-2">📸 Exemplo de Quiz preenchido</p>
                <p className="text-xs text-gray-400">Print será inserido aqui</p>
              </div>

              <div className="mt-6 flex gap-4">
                <Link
                  href="/pt/nutri/ferramentas?criar=quiz"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-sm"
                >
                  Criar Quiz →
                </Link>
                <Link
                  href="/pt/nutri/gsal?attachTool=quiz"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-sm"
                >
                  Abrir no GSAL →
                </Link>
              </div>
            </Section>

            <Section>
              <Heading level={2}>Fluxos de Captação</Heading>
              <Paragraph>
                Os fluxos permitem criar jornadas completas de captação, desde o primeiro contato até a conversão em cliente.
              </Paragraph>
              
              {/* Área para print de exemplo */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-500 mb-2">📸 Exemplo de Fluxo real</p>
                <p className="text-xs text-gray-400">Print será inserido aqui</p>
              </div>

              <div className="mt-6 flex gap-4">
                <Link
                  href="/pt/nutri/ferramentas?criar=fluxo"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-sm"
                >
                  Criar Fluxo →
                </Link>
              </div>
            </Section>

            <Section>
              <Heading level={2}>Integração com GSAL</Heading>
              <Paragraph>
                Todas as ferramentas podem ser anexadas diretamente aos clientes no GSAL, facilitando o acompanhamento e a gestão.
              </Paragraph>
              
              {/* Área para print de exemplo */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-500 mb-2">📸 Exemplo de GSAL com evolução</p>
                <p className="text-xs text-gray-400">Print será inserido aqui</p>
              </div>

              <div className="mt-6">
                <Link
                  href="/pt/nutri/gsal"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-sm"
                >
                  Abrir GSAL →
                </Link>
              </div>
            </Section>

            {/* Tabela de Boas Práticas */}
            <Section>
              <Heading level={2}>Tabela de Boas Práticas</Heading>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ferramenta</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boas Práticas</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evitar</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Quizzes</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Perguntas objetivas, resultados claros, CTAs diretos</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Perguntas muito longas, resultados confusos, falta de CTA</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Fluxos</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Sequência lógica, CTAs claros, poucos passos</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Muitos passos, falta de clareza, CTAs confusos</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Templates</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Personalização, contexto adequado, atualização</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Uso genérico, falta de contexto, desatualização</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">GSAL</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Organização, anexos relevantes, acompanhamento regular</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Desorganização, falta de anexos, acompanhamento esporádico</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            {/* FAQ Técnico */}
            <Section>
              <Heading level={2}>FAQ Técnico</Heading>
              <div className="space-y-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Como anexar uma ferramenta a um cliente no GSAL?</h4>
                  <Paragraph className="mb-0 text-sm">
                    Acesse o GSAL, selecione o cliente desejado e use o botão "Anexar Ferramenta". 
                    Você pode escolher entre quizzes, fluxos ou templates já criados.
                  </Paragraph>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Posso criar múltiplos quizzes para diferentes objetivos?</h4>
                  <Paragraph className="mb-0 text-sm">
                    Sim! Você pode criar quantos quizzes precisar, cada um com objetivos específicos. 
                    Recomendamos organizá-los por categoria ou público-alvo.
                  </Paragraph>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Como personalizar os diagnósticos dos quizzes?</h4>
                  <Paragraph className="mb-0 text-sm">
                    Ao criar um quiz, você pode definir os resultados e diagnósticos personalizados. 
                    Use linguagem clara e objetiva, sempre conectando com a próxima ação (CTA).
                  </Paragraph>
                </div>
              </div>
            </Section>
          </ContentContainer>
        </div>

        {/* Navegação */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/pt/nutri/ferramentas"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-center"
          >
            ← Voltar para Ferramentas
          </Link>
          <Link
            href="/pt/nutri/metodo/biblioteca/pdf-9-manual-tecnico"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-center"
          >
            Ver Manual Técnico Completo →
          </Link>
        </div>
      </div>
    </div>
  )
}

