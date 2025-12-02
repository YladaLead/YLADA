'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import PilarSecao from '@/components/formacao/PilarSecao'
import PilarAnotacao from '@/components/formacao/PilarAnotacao'
import { pilaresConfig } from '@/types/pilares'

export default function PilarPage() {
  const params = useParams()
  const pilarId = params.id as string
  const pilar = pilaresConfig.find(p => p.id === pilarId) || pilaresConfig[0]

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
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/pt/nutri/metodo" className="hover:text-blue-600">
            Método YLADA
          </Link>
          <span>→</span>
          <Link href="/pt/nutri/metodo/pilares" className="hover:text-blue-600">
            Pilares
          </Link>
          <span>→</span>
          <span className="text-gray-900">Pilar {pilar.numero}</span>
        </div>

        {/* Header do Pilar */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-16 h-16 bg-gradient-to-r ${
              pilar.numero === 1 ? 'from-blue-600 to-indigo-600' :
              pilar.numero === 2 ? 'from-purple-600 to-pink-600' :
              pilar.numero === 3 ? 'from-green-600 to-teal-600' :
              pilar.numero === 4 ? 'from-orange-600 to-red-600' :
              'from-indigo-600 to-purple-600'
            } rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
              {pilar.numero}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Pilar {pilar.numero} — {pilar.nome}
              </h1>
              {pilar.subtitulo && (
                <p className="text-lg text-gray-600 mt-1">{pilar.subtitulo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Propósito do Pilar */}
        {pilar.descricao_introducao && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-l-4 border-blue-500">
            <h2 className="font-bold text-gray-900 mb-3 text-lg">🎯 Propósito do Pilar</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {pilar.descricao_introducao}
            </p>
          </div>
        )}

        {/* Conexão com a Jornada */}
        {pilar.id === '1' && (
          <div className="bg-purple-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🔗 Como o Pilar 1 se conecta com a Jornada</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Os primeiros dias (1 a 6) da Jornada apontam diretamente para este pilar. Ele é a porta de entrada da transformação.
            </p>
            <p className="text-gray-700 leading-relaxed">
              O SAS permite acesso rápido às seções, destaca o conteúdo recomendado para cada dia e mantém navegação simples e intuitiva.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-block text-purple-700 hover:text-purple-800 font-medium"
            >
              Ver Jornada de 30 Dias →
            </Link>
          </div>
        )}
        
        {pilar.id === '2' && (
          <div className="bg-purple-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🔗 Como o Pilar 2 se conecta com a Jornada</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Os Dias 3, 5 e 7 da Jornada apontam diretamente para este pilar. Ele é o responsável por transformar a base emocional da Semana 1 em rotina, foco e consistência prática.
            </p>
            <p className="text-gray-700 leading-relaxed">
              O SAS exibe seções recomendadas para cada dia, facilita acesso rápido à rotina mínima e destaca ações práticas aplicáveis imediatamente.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-block text-purple-700 hover:text-purple-800 font-medium"
            >
              Ver Jornada de 30 Dias →
            </Link>
          </div>
        )}
        
        {pilar.id === '3' && (
          <div className="bg-purple-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🔗 Como o Pilar 3 se conecta com a Jornada</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Esta é a espinha dorsal da Semana 2 da Jornada (Dias 8 a 14). É onde o método começa a gerar leads reais.
            </p>
            <p className="text-gray-700 leading-relaxed">
              O SAS mostra ferramentas recomendadas, exibe CTA da semana, facilita o acesso ao Exercício 10–10–10, permite registrar leads novos e mostra a evolução diária.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-block text-purple-700 hover:text-purple-800 font-medium"
            >
              Ver Jornada de 30 Dias →
            </Link>
          </div>
        )}
        
        {pilar.id === '4' && (
          <div className="bg-purple-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🔗 Como o Pilar 4 se conecta com a Jornada</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Este pilar sustenta a Semana 3 — Dias 15 a 21.
            </p>
            <p className="text-gray-700 leading-relaxed">
              O SAS permite acesso rápido ao script oficial, exibe mensagens prontas, disponibiliza modelos de pós-atendimento, fornece espaço para registrar leads quentes e facilita o acompanhamento após 48h. Este pilar é o motor da conversão YLADA.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-block text-purple-700 hover:text-purple-800 font-medium"
            >
              Ver Jornada de 30 Dias →
            </Link>
          </div>
        )}
        
        {pilar.id === '5' && (
          <div className="bg-purple-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🔗 Como o Pilar 5 se conecta com a Jornada</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Este pilar sustenta toda a Semana 4 (Dias 22 a 30). Ele é o encerramento da transformação — o momento em que a profissional assume total controle.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              O SAS exibe as seções principais do GSAL, permite marcações de leads quentes/mornos/frios, permite bloqueios de agenda, exibe painel de prioridades e conecta com o plano de 30 dias.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Este pilar garante continuidade após o fim da Jornada.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="mt-4 inline-block text-purple-700 hover:text-purple-800 font-medium"
            >
              Ver Jornada de 30 Dias →
            </Link>
          </div>
        )}

        {/* Seções do Pilar */}
        {pilar.secoes && pilar.secoes.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seções do Pilar</h2>
            {pilar.secoes
              .sort((a, b) => a.order_index - b.order_index)
              .map((secao) => (
                <PilarSecao key={secao.id} secao={secao} pilarId={pilar.id} />
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center">
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

        {/* Navegação */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pt/nutri/metodo/pilares"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                ← Voltar para os Pilares
              </Link>
              <Link
                href="/pt/nutri/metodo"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                ← Voltar para o Método
              </Link>
            </div>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver Jornada →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

