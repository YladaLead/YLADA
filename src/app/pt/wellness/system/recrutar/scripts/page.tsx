'use client'

import { useState, useEffect } from 'react'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useWellnessAcoes } from '@/hooks/useWellnessAcoes'
import { 
  getAllScriptsGenericos,
  getScriptsGenericosByMomento,
  getScriptsGenericosByTipoContato,
  type ScriptRecrutamento,
  type MomentoConversa,
  type TipoContato
} from '@/lib/wellness-system/scripts-recrutamento'
import { fluxosRecrutamento } from '@/lib/wellness-system/fluxos-recrutamento'

type EstiloAbordagem = 'direto' | 'curiosidade' | 'emocional' | 'consultivo' | 'leve' | 'reconhecimento'

type TipoAba = 'genericos' | 'por-fluxo'

function RecrutarScriptsPageContent() {
  const { registrarAcao } = useWellnessAcoes()
  const [abaAtiva, setAbaAtiva] = useState<TipoAba>('genericos')
  const [momentoSelecionado, setMomentoSelecionado] = useState<MomentoConversa | 'todos'>('todos')
  const [tipoContatoSelecionado, setTipoContatoSelecionado] = useState<TipoContato | 'todos'>('todos')
  const [fluxoSelecionado, setFluxoSelecionado] = useState<string>('todos')
  const [scriptCopiado, setScriptCopiado] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  // Registrar acesso à página
  useEffect(() => {
    registrarAcao({
      tipo: 'visualizou_fluxo',
      descricao: 'Acessou a página de scripts de recrutamento',
      pagina: 'Scripts de Recrutamento',
      rota: '/pt/wellness/system/recrutar/scripts'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Obter scripts genéricos
  const scriptsGenericos = getAllScriptsGenericos()
  
  // Filtrar scripts genéricos
  const scriptsGenericosFiltrados = scriptsGenericos.filter(script => {
    const matchMomento = momentoSelecionado === 'todos' || script.momento === momentoSelecionado
    const matchTipoContato = tipoContatoSelecionado === 'todos' || !script.tipoContato || script.tipoContato === tipoContatoSelecionado
    const matchBusca = busca === '' || 
      script.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      script.conteudo.toLowerCase().includes(busca.toLowerCase())
    
    return matchMomento && matchTipoContato && matchBusca
  })

  // Scripts por fluxo (preparado para futuro)
  const scriptsPorFluxo: ScriptRecrutamento[] = [
    // Scripts específicos por fluxo serão adicionados aqui no futuro
    // Por enquanto, deixamos vazio para mostrar a estrutura preparada
  ]

  const momentos: { id: MomentoConversa | 'todos'; nome: string; emoji: string }[] = [
    { id: 'todos', nome: 'Todos os Momentos', emoji: '📋' },
    { id: 'abertura', nome: 'Abertura', emoji: '👋' },
    { id: 'envio-link', nome: 'Envio do Link', emoji: '🔗' },
    { id: 'pos-link', nome: 'Pós-Link', emoji: '⏰' },
    { id: 'pos-diagnostico', nome: 'Pós-Diagnóstico', emoji: '📊' },
    { id: 'convite-apresentacao', nome: 'Convite para Apresentação', emoji: '🎁' },
    { id: 'pos-apresentacao', nome: 'Pós-Apresentação', emoji: '💬' },
    { id: 'objecoes', nome: 'Objeções', emoji: '🚫' },
    { id: 'recuperacao', nome: 'Recuperação', emoji: '🔁' },
    { id: 'indicacoes', nome: 'Indicações', emoji: '👥' }
  ]

  const tiposContato: { id: TipoContato | 'todos'; nome: string; emoji: string }[] = [
    { id: 'todos', nome: 'Todos os Tipos', emoji: '👤' },
    { id: 'conhecidos', nome: 'Conhecidos', emoji: '🤝' },
    { id: 'pouco-conhecidos', nome: 'Pouco Conhecidos', emoji: '👋' },
    { id: 'desconhecidos', nome: 'Desconhecidos/Online', emoji: '🌐' }
  ]

  // Filtrar scripts por fluxo
  const scriptsPorFluxoFiltrados = scriptsPorFluxo.filter(script => {
    const matchFluxo = fluxoSelecionado === 'todos' || script.id.includes(fluxoSelecionado)
    const matchBusca = busca === '' || 
      script.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      script.conteudo.toLowerCase().includes(busca.toLowerCase())
    
    return matchFluxo && matchBusca
  })

  const copiarScript = (conteudo: string, id: string, tipo: 'generico' | 'fluxo') => {
    navigator.clipboard.writeText(conteudo)
    setScriptCopiado(id)
    setTimeout(() => setScriptCopiado(null), 2000)

    // Registrar ação de copiar script
    const script = tipo === 'generico' 
      ? scriptsGenericos.find(s => s.id === id)
      : scriptsPorFluxo.find(s => s.id === id)
    
    registrarAcao({
      tipo: 'copiou_script',
      descricao: `Copiou o script: ${script?.titulo || id}`,
      metadata: {
        scriptId: id,
        scriptTitulo: script?.titulo,
        momento: script?.momento,
        tipoContato: script?.tipoContato,
        tipoScript: tipo
      },
      pagina: 'Scripts de Recrutamento',
      rota: '/pt/wellness/system/recrutar/scripts'
    })
  }

  // Scripts a exibir baseado na aba ativa
  const scriptsParaExibir = abaAtiva === 'genericos' 
    ? scriptsGenericosFiltrados 
    : scriptsPorFluxoFiltrados

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Scripts de Recrutamento" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Botão Voltar ao Sistema - Bem visível no topo */}
          <div className="mb-6">
            <Link
              href="/pt/wellness/system"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Voltar ao Sistema</span>
            </Link>
          </div>

          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Scripts de Recrutamento
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Biblioteca completa de scripts para recrutamento. Escolha entre scripts genéricos ou específicos por fluxo.
            </p>
          </div>

          {/* Abas */}
          <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setAbaAtiva('genericos')
                  setFluxoSelecionado('todos')
                }}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  abaAtiva === 'genericos'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📋 Scripts Genéricos
              </button>
              <button
                onClick={() => {
                  setAbaAtiva('por-fluxo')
                  setMomentoSelecionado('todos')
                  setTipoContatoSelecionado('todos')
                }}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  abaAtiva === 'por-fluxo'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎯 Scripts por Fluxo
              </button>
            </div>
          </div>

          {/* Busca */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <input
              type="text"
              placeholder="🔍 Buscar scripts..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros - Apenas para Scripts Genéricos */}
          {abaAtiva === 'genericos' && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filtro por Momento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Momento da Conversa
                  </label>
                  <select
                    value={momentoSelecionado}
                    onChange={(e) => setMomentoSelecionado(e.target.value as MomentoConversa | 'todos')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {momentos.map(momento => (
                      <option key={momento.id} value={momento.id}>
                        {momento.emoji} {momento.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Tipo de Contato */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Contato
                  </label>
                  <select
                    value={tipoContatoSelecionado}
                    onChange={(e) => setTipoContatoSelecionado(e.target.value as TipoContato | 'todos')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {tiposContato.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.emoji} {tipo.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Filtros - Apenas para Scripts por Fluxo */}
          {abaAtiva === 'por-fluxo' && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fluxo
                </label>
                <select
                  value={fluxoSelecionado}
                  onChange={(e) => setFluxoSelecionado(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos os Fluxos</option>
                  {fluxosRecrutamento.map(fluxo => (
                    <option key={fluxo.id} value={fluxo.id}>
                      {fluxo.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Lista de Scripts */}
          <div className="space-y-4">
            {scriptsParaExibir.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                {abaAtiva === 'por-fluxo' ? (
                  <div>
                    <p className="text-gray-500 mb-2">Scripts específicos por fluxo serão adicionados em breve.</p>
                    <p className="text-sm text-gray-400">Por enquanto, use os scripts genéricos que funcionam para todos os fluxos.</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum script encontrado com os filtros selecionados.</p>
                )}
              </div>
            ) : (
              scriptsParaExibir.map((script) => (
                <div
                  key={script.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">
                          {script.titulo}
                        </h3>
                        {script.tipoContato && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {script.tipoContato === 'conhecidos' && '🤝 Conhecidos'}
                            {script.tipoContato === 'pouco-conhecidos' && '👋 Pouco Conhecidos'}
                            {script.tipoContato === 'desconhecidos' && '🌐 Desconhecidos'}
                          </span>
                        )}
                        {script.estilo && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            {script.estilo === 'direto' && '🎯 Direto'}
                            {script.estilo === 'curiosidade' && '❓ Curiosidade'}
                            {script.estilo === 'emocional' && '💝 Emocional'}
                            {script.estilo === 'consultivo' && '💼 Consultivo'}
                            {script.estilo === 'leve' && '🌿 Leve'}
                            {script.estilo === 'reconhecimento' && '👁️ Reconhecimento'}
                          </span>
                        )}
                        {abaAtiva === 'genericos' && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {momentos.find(m => m.id === script.momento)?.emoji} {momentos.find(m => m.id === script.momento)?.nome}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {script.conteudo}
                      </p>
                    </div>
                    <button
                      onClick={() => copiarScript(script.conteudo, script.id, abaAtiva === 'genericos' ? 'generico' : 'fluxo')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        scriptCopiado === script.id
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {scriptCopiado === script.id ? '✓ Copiado!' : '📋 Copiar'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Informações Adicionais */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              💡 Dicas de Uso
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• Adapte os scripts substituindo [NOME] e [SEU NOME] pelos nomes reais</li>
              <li>• Substitua [LINK] pelo link da avaliação do fluxo escolhido</li>
              <li>• Use os filtros para encontrar o script ideal para cada situação</li>
              <li>• Combine diferentes scripts conforme a evolução da conversa</li>
              <li>• Personalize os scripts conforme o perfil identificado no diagnóstico</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function RecrutarScriptsPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RecrutarScriptsPageContent />
    </ProtectedRoute>
  )
}

