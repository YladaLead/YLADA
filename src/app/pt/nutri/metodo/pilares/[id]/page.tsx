'use client'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import PilarSecao from '@/components/formacao/PilarSecao'
import PilarAnotacao from '@/components/formacao/PilarAnotacao'
import VoltarJornadaButton from '@/components/jornada/VoltarJornadaButton'
import JornadaDaysChips from '@/components/jornada/JornadaDaysChips'
import { pilaresConfig } from '@/types/pilares'
import { getJornadaDaysForPilar } from '@/utils/jornada-pilares-mapping'

export default function PilarPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const pilarId = params.id as string
  const pilar = pilaresConfig.find(p => p.id === pilarId) || pilaresConfig[0]
  const jornadaDay = searchParams.get('fromDay') // Se veio de um dia da jornada
  const jornadaDays = getJornadaDaysForPilar(parseInt(pilarId))

  if (!pilar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <FormacaoHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <p className="text-red-800">Pilar não encontrado</p>
            <Link
              href="/pt/nutri/metodo/pilares"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              ← Voltar para Pilares
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar para Jornada - Destaque */}
        <div className="mb-4">
          <VoltarJornadaButton />
        </div>

        {/* Breadcrumb - Mais elegante */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link 
            href="/pt/nutri/metodo" 
            className="hover:text-blue-600 transition-all duration-200 ease-out"
          >
            Método YLADA
          </Link>
          <span className="text-gray-400">→</span>
          <Link 
            href="/pt/nutri/metodo/pilares" 
            className="hover:text-blue-600 transition-all duration-200 ease-out"
          >
            Pilares
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 font-medium">Pilar {pilar.numero}</span>
        </div>

        {/* Se veio de um dia da jornada, mostrar link de volta */}
        {jornadaDay && (
          <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-out">
            <p className="text-sm text-gray-700 mb-2 leading-relaxed">
              Este conteúdo faz parte do <strong>Dia {jornadaDay}</strong> da Jornada.
            </p>
            <Link
              href={`/pt/nutri/metodo/jornada/dia/${jornadaDay}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-200 ease-out hover:opacity-90"
            >
              ← Voltar para Dia {jornadaDay}
            </Link>
          </div>
        )}

        {/* Chips de dias relacionados */}
        {jornadaDays.length > 0 && (
          <JornadaDaysChips days={jornadaDays} pilarId={parseInt(pilarId)} />
        )}

        {/* Material complementar recomendado (Pilar 1) */}
        {pilar.id === '1' && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Material complementar recomendado:</strong>{' '}
              <Link
                href="/pt/nutri/metodo/biblioteca/guia-metodo-ylada"
                className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 ease-out hover:opacity-90"
              >
                Guia Completo do Método YLADA
              </Link>
            </p>
          </div>
        )}

        {/* Header do Pilar */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ease-out">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${
              pilar.numero === 1 ? 'from-blue-600 to-indigo-600' :
              pilar.numero === 2 ? 'from-purple-600 to-pink-600' :
              pilar.numero === 3 ? 'from-green-600 to-teal-600' :
              pilar.numero === 4 ? 'from-orange-600 to-red-600' :
              'from-indigo-600 to-purple-600'
            } rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
              {pilar.numero}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Pilar {pilar.numero} — {pilar.nome}
              </h1>
              {pilar.subtitulo && (
                <p className="text-lg text-gray-600">{pilar.subtitulo}</p>
              )}
            </div>
          </div>
          
          {/* Texto-guia */}
          <p className="text-sm text-gray-600 leading-relaxed mt-4 pt-4 border-t border-gray-100">
            Este Pilar faz parte da estrutura da Nutri-Empresária. Navegue pelas seções abaixo para compreender e aplicar os fundamentos.
          </p>
        </div>

        {/* Propósito do Pilar */}
        {pilar.descricao_introducao && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-out">
            <h2 className="font-semibold text-gray-900 mb-4 text-xl">🎯 Propósito do Pilar</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {pilar.descricao_introducao}
            </p>
          </div>
        )}

        {/* Conexão com a Jornada */}
        {pilar.id === '1' && (
          <div className="bg-purple-50 rounded-xl p-6 mb-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-out">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">🔗 Como o Pilar 1 se conecta com a Jornada</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Os primeiros dias (1 a 6) da Jornada apontam diretamente para este pilar. Ele é a porta de entrada da transformação.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              O SAS permite acesso rápido às seções, destaca o conteúdo recomendado para cada dia e mantém navegação simples e intuitiva.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-flex items-center gap-2 text-purple-700 hover:text-purple-800 font-medium transition-all duration-200 ease-out hover:opacity-90"
            >
              Ver Jornada de 30 Dias →
            </Link>
          </div>
        )}
        
        {pilar.id === '2' && (
          <div className="bg-purple-50 rounded-xl p-6 mb-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-out">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">🔗 Como o Pilar 2 se conecta com a Jornada</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Os Dias 3, 5 e 7 da Jornada apontam diretamente para este pilar. Ele é o responsável por transformar a base emocional da Semana 1 em rotina, foco e consistência prática.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              O SAS exibe seções recomendadas para cada dia, facilita acesso rápido à rotina mínima e destaca ações práticas aplicáveis imediatamente.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-flex items-center gap-2 text-purple-700 hover:text-purple-800 font-medium transition-all duration-200 ease-out hover:opacity-90"
            >
              Ver Jornada de 30 Dias →
            </Link>
          </div>
        )}
        
        {pilar.id === '3' && (
          <div className="bg-purple-50 rounded-xl p-6 mb-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-out">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">🔗 Como o Pilar 3 se conecta com a Jornada</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Esta é a espinha dorsal da Semana 2 da Jornada (Dias 8 a 14). É onde o método começa a gerar leads reais.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              O SAS mostra ferramentas recomendadas, exibe CTA da semana, facilita o acesso ao Exercício 10–10–10, permite registrar leads novos e mostra a evolução diária.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-flex items-center gap-2 text-purple-700 hover:text-purple-800 font-medium transition-all duration-200 ease-out hover:opacity-90"
            >
              Ver Jornada de 30 Dias →
            </Link>
          </div>
        )}
        
        {pilar.id === '4' && (
          <div className="bg-purple-50 rounded-xl p-6 mb-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-out">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">🔗 Como o Pilar 4 se conecta com a Jornada</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Este pilar sustenta a Semana 3 — Dias 15 a 21.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              O SAS permite acesso rápido ao script oficial, exibe mensagens prontas, disponibiliza modelos de pós-atendimento, fornece espaço para registrar leads quentes e facilita o acompanhamento após 48h. Este pilar é o motor da conversão YLADA.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-flex items-center gap-2 text-purple-700 hover:text-purple-800 font-medium transition-all duration-200 ease-out hover:opacity-90"
            >
              Ver Jornada de 30 Dias →
            </Link>
          </div>
        )}
        
        {pilar.id === '5' && (
          <div className="bg-purple-50 rounded-xl p-6 mb-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-out">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">🔗 Como o Pilar 5 se conecta com a Jornada</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Este pilar sustenta toda a Semana 4 (Dias 22 a 30). Ele é o encerramento da transformação — o momento em que a profissional assume total controle.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              O SAS exibe as seções principais do GSAL, permite marcações de leads quentes/mornos/frios, permite bloqueios de agenda, exibe painel de prioridades e conecta com o plano de 30 dias.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Este pilar garante continuidade após o fim da Jornada.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-flex items-center gap-2 text-purple-700 hover:text-purple-800 font-medium transition-all duration-200 ease-out hover:opacity-90"
            >
              Ver Jornada de 30 Dias →
            </Link>
          </div>
        )}

        {/* Seções do Pilar */}
        {pilar.secoes && pilar.secoes.length > 0 ? (
          <div className="space-y-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Seções do Pilar</h2>
            {pilar.secoes
              .sort((a, b) => a.order_index - b.order_index)
              .map((secao) => (
                <PilarSecao key={secao.id} secao={secao} pilarId={pilar.id} />
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-200 ease-out">
            <p className="text-gray-600">As seções deste pilar serão adicionadas em breve.</p>
          </div>
        )}

        {/* Campo de Anotação do Pilar */}
        {pilar.campo_anotacao && (
          <PilarAnotacao
            pilarId={pilar.id}
            placeholder={pilar.campo_anotacao}
          />
        )}

        {/* CTA Final no Rodapé */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Botão: Aplicar este Pilar no GSAL */}
            <Link
              href="/pt/nutri/gsal"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-center"
            >
              Aplicar este Pilar no GSAL
            </Link>
            
            {/* Botão: Voltar para a Jornada */}
            <Link
              href={jornadaDay ? `/pt/nutri/metodo/jornada/dia/${jornadaDay}` : '/pt/nutri/metodo/jornada'}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-center"
            >
              {jornadaDay ? `← Voltar para Dia ${jornadaDay}` : '← Voltar para a Jornada'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

