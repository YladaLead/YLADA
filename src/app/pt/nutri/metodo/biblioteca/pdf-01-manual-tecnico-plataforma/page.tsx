'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function PDF01ManualTecnicoPlataforma() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/pt/nutri/metodo" className="hover:text-blue-600 transition-all">
            Método YLADA
          </Link>
          <span className="text-gray-400">→</span>
          <Link href="/pt/nutri/metodo/biblioteca" className="hover:text-blue-600 transition-all">
            Materiais de Apoio
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 font-medium">Manual Técnico da Plataforma</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Manual Técnico da Plataforma YLADA Nutri
            </h1>
            <p className="text-xl text-gray-600">
              Guia prático para usar o sistema com clareza e segurança
            </p>
            <p className="text-sm text-gray-500 mt-2">
              YLADA Nutri • Mentoria Estratégica com IA
            </p>
          </div>

          {/* Botão Download */}
          <div className="flex justify-center">
            <button
              disabled
              className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-2"
            >
              <span>📄</span>
              <span>PDF em preparação</span>
            </button>
          </div>
        </div>

        {/* Conteúdo dos Slides */}
        <div className="space-y-6">
          
          {/* Slide 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Como este manual funciona</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Este manual é um guia de navegação, não um curso.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use sempre que tiver dúvida sobre onde clicar ou como usar uma área.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não é necessário ler tudo de uma vez.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>A estratégia e as decisões são conduzidas pelo Noel Mentor, dentro da plataforma.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Use este material como apoio rápido, sempre que precisar.</p>
          </div>

          {/* Slide 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Visão geral da Plataforma YLADA Nutri</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Home:</strong> sua central de direção diária.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Trilha Empresarial:</strong> o caminho principal da sua capacitação empresarial (30 dias).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Pilares do Método:</strong> aprofundamento conceitual (usado no momento certo).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Ferramentas Profissionais:</strong> estrutura para captação e organização.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>GSAL:</strong> gestão de leads, avaliações e planos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Biblioteca:</strong> materiais de apoio.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Chat com o Noel:</strong> seu mentor estratégico.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Tudo começa e se organiza a partir da Trilha.</p>
          </div>

          {/* Slide 4 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Home: sua central de comando</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Bloco do Noel: mostra seu foco do dia e a ação prioritária.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Botão principal: leva sempre para o próximo passo correto.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Progresso da Jornada: indica em que dia você está.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Outros blocos: apoio complementar (não prioridade inicial).</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Se tiver dúvida, volte sempre para a Home.</p>
          </div>

          {/* Slide 5 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O que fazer ao entrar na Home</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Leia com atenção a análise do Noel.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Identifique qual é a ação do dia.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Clique no botão principal e execute.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Evite explorar outras áreas antes de concluir o dia atual.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Execução vem antes de exploração.</p>
          </div>

          {/* Slide 6 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trilha Empresarial — 30 Dias</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>A Trilha é dividida em dias, com foco específico.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Cada dia foi criado para ser executado em sequência.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não é recomendado pular etapas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>O progresso libera novas áreas do sistema.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Confie no processo. Um dia de cada vez.</p>
          </div>

          {/* Slide 7 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Como navegar pela Jornada</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Acesse pelo menu lateral ou pela Home.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Clique sempre em "Continuar Jornada".</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Conclua o conteúdo do dia antes de avançar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>O Noel acompanha seu progresso automaticamente.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Seu crescimento acontece na continuidade.</p>
          </div>

          {/* Slide 8 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pilares do Método: quando usar</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Os Pilares aprofundam conceitos importantes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não são prioridade nos primeiros dias.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use quando a Jornada ou o Noel indicar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Servem para fortalecer decisões e visão estratégica.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Primeiro execute. Depois aprofunde.</p>
          </div>

          {/* Slide 9 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ferramentas Profissionais: Quiz Personalizado</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>A ferramenta de Quiz ajuda na captação e qualificação.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Crie seu quiz seguindo as orientações da plataforma.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use como apoio ao seu posicionamento profissional.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>O objetivo é gerar movimento e conversa.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Ferramenta certa, no momento certo.</p>
          </div>

          {/* Slide 10 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GSAL — Gestão Estratégica</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>GSAL significa: Gerar, Servir, Acompanhar e Lucrar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>É a área de organização do seu crescimento.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Fica bloqueada até a conclusão do Dia 1.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>É liberada quando você está pronta para gerenciar dados.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Primeiro direção, depois gestão.</p>
          </div>

          {/* Slide 11 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat com o Noel Mentor</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>O Noel está disponível durante toda a sua jornada.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Faça perguntas objetivas e relacionadas ao seu momento atual.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>O Noel sempre prioriza o dia da Jornada em que você está.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Confie na condução.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 O Noel orienta. Você executa.</p>
          </div>

          {/* Conclusão */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500 p-8">
            <p className="text-gray-700 text-center text-lg leading-relaxed">
              Este material está sempre disponível para consulta.<br/>
              Use quando sentir necessidade de relembrar como navegar na plataforma.
            </p>
            <p className="text-blue-700 font-semibold text-center mt-4">
              💙 O Noel está aqui para te guiar em cada etapa.
            </p>
          </div>

        </div>

        {/* Navegação */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/pt/nutri/metodo/biblioteca"
            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
          >
            ← Voltar para Materiais de Apoio
          </Link>
        </div>
      </div>
    </div>
  )
}
