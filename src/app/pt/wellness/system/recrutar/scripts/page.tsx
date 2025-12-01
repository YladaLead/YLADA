'use client'

import { useState } from 'react'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

type TipoContato = 'conhecidos' | 'pouco-conhecidos' | 'desconhecidos'
type EstiloAbordagem = 'direto' | 'curiosidade' | 'emocional' | 'consultivo' | 'leve' | 'reconhecimento'
type MomentoConversa = 
  | 'abertura' 
  | 'envio-link' 
  | 'pos-link' 
  | 'pos-diagnostico' 
  | 'convite-apresentacao' 
  | 'pos-apresentacao' 
  | 'objecoes' 
  | 'recuperacao' 
  | 'indicacoes'

interface Script {
  id: string
  titulo: string
  conteudo: string
  tipoContato?: TipoContato
  estilo?: EstiloAbordagem
  momento: MomentoConversa
}

const scriptsRecrutamento: Script[] = [
  // 1. ABERTURA - PESSOAS CONHECIDAS
  {
    id: 'abertura-conhecidos-direto',
    titulo: 'Abertura - Conhecidos (Direto)',
    conteudo: 'Oi, [NOME]! Eu estou com um projeto novo de renda extra com bebidas funcionais e lembrei de você. Posso te enviar uma avaliação rápida pra ver se faz sentido pro seu perfil? Leva menos de 1 minuto.',
    tipoContato: 'conhecidos',
    estilo: 'direto',
    momento: 'abertura'
  },
  {
    id: 'abertura-conhecidos-curiosidade',
    titulo: 'Abertura - Conhecidos (Curiosidade)',
    conteudo: '[NOME], estou usando uma avaliação que identifica perfis que combinam com a nova tendência das bebidas funcionais. Lembrei de você na hora. Quer fazer o teste? É bem rapidinho.',
    tipoContato: 'conhecidos',
    estilo: 'curiosidade',
    momento: 'abertura'
  },
  {
    id: 'abertura-conhecidos-emocional',
    titulo: 'Abertura - Conhecidos (Emocional)',
    conteudo: '[NOME], sei que você anda buscando melhorar de vida e abrir novas possibilidades. Tô com uma avaliação rápida que mostra caminhos reais de renda extra com algo simples. Posso te enviar?',
    tipoContato: 'conhecidos',
    estilo: 'emocional',
    momento: 'abertura'
  },
  {
    id: 'abertura-conhecidos-consultivo',
    titulo: 'Abertura - Conhecidos (Consultivo)',
    conteudo: '[NOME], estou participando de um projeto estruturado de bebidas funcionais com foco em renda extra. Tenho uma avaliação de perfil que usamos antes de convidar para a apresentação oficial. Quer responder e ver se faz sentido pra você?',
    tipoContato: 'conhecidos',
    estilo: 'consultivo',
    momento: 'abertura'
  },
  // 1.2. PESSOAS POUCO CONHECIDAS
  {
    id: 'abertura-pouco-conhecidos-leve',
    titulo: 'Abertura - Pouco Conhecidos (Leve)',
    conteudo: 'Oi, [NOME]! Aqui é o(a) [SEU NOME]. Estou participando de um projeto novo na área de bebidas funcionais e usamos uma avaliação rápida pra ver o perfil de cada pessoa. Posso te enviar pra você responder?',
    tipoContato: 'pouco-conhecidos',
    estilo: 'leve',
    momento: 'abertura'
  },
  {
    id: 'abertura-pouco-conhecidos-curiosidade',
    titulo: 'Abertura - Pouco Conhecidos (Curiosidade)',
    conteudo: '[NOME], tudo bem? Estou com uma avaliação que identifica perfis que combinam com projetos de renda extra simples e digitais. Posso te mandar pra você ver o seu?',
    tipoContato: 'pouco-conhecidos',
    estilo: 'curiosidade',
    momento: 'abertura'
  },
  {
    id: 'abertura-pouco-conhecidos-reconhecimento',
    titulo: 'Abertura - Pouco Conhecidos (Reconhecimento)',
    conteudo: '[NOME], lembrei de você porque sei que você [ex: já consome coisas saudáveis / gosta de digital / está empreendendo]. Tenho uma avaliação rápida que mostra se o seu perfil combina com um projeto de bebidas funcionais. Quer fazer?',
    tipoContato: 'pouco-conhecidos',
    estilo: 'reconhecimento',
    momento: 'abertura'
  },
  // 1.3. DESCONHECIDOS / PÚBLICO ONLINE
  {
    id: 'abertura-desconhecidos-padrao',
    titulo: 'Abertura - Desconhecidos (Padrão)',
    conteudo: 'Oi, [NOME]! Vi seu interesse no projeto de bebidas funcionais. Antes de te explicar tudo, posso te enviar uma avaliação rápida pra ver se o modelo combina com você? É coisa de 1 minutinho.',
    tipoContato: 'desconhecidos',
    estilo: 'direto',
    momento: 'abertura'
  },
  {
    id: 'abertura-desconhecidos-curta',
    titulo: 'Abertura - Desconhecidos (Curta)',
    conteudo: 'Show, [NOME]! Faço assim com todo mundo: te envio uma avaliação rápida e, com base no seu perfil, te explico as melhores opções. Posso mandar?',
    tipoContato: 'desconhecidos',
    estilo: 'direto',
    momento: 'abertura'
  },
  // 2. ENVIO DO LINK
  {
    id: 'envio-link-padrao1',
    titulo: 'Envio do Link (Padrão 1)',
    conteudo: 'Como combinado, aqui está sua avaliação: [LINK]. Ela é bem rápida e já mostra se seu perfil combina com o projeto de bebidas funcionais.',
    momento: 'envio-link'
  },
  {
    id: 'envio-link-curiosidade',
    titulo: 'Envio do Link (Com Curiosidade)',
    conteudo: 'Aqui está sua avaliação: [LINK]. No final, ela mostra um diagnóstico bem interessante sobre seu perfil para projetos de renda extra. Me chama quando terminar.',
    momento: 'envio-link'
  },
  {
    id: 'envio-link-bem-estar',
    titulo: 'Envio do Link (Para Quem Consome Bem-Estar)',
    conteudo: 'Prontinho, [NOME]! Aqui está sua avaliação: [LINK]. Ela foi pensada justamente pra pessoas que já se interessam por saúde, bem-estar e tendências como bebidas funcionais.',
    momento: 'envio-link'
  },
  {
    id: 'envio-link-digital',
    titulo: 'Envio do Link (Digital/Trabalha com Internet)',
    conteudo: 'Segue sua avaliação: [LINK]. Ela mostra se seu perfil combina com um modelo 100% digital, trabalhando basicamente com links.',
    momento: 'envio-link'
  },
  // 3. PÓS-LINK
  {
    id: 'pos-link-followup-2h',
    titulo: 'Pós-Link - Follow-up Leve (2 horas)',
    conteudo: 'Oi, [NOME]! Conseguiu fazer sua avaliação? Ela é bem rápida e já mostra se seu perfil encaixa no projeto de bebidas funcionais.',
    momento: 'pos-link'
  },
  {
    id: 'pos-link-lembrete-24h',
    titulo: 'Pós-Link - Lembrete (24h)',
    conteudo: 'Passando só pra lembrar da sua avaliação, [NOME]! Ela ainda está ativa e leva menos de 1 minuto. Assim que você fizer, eu já te explico as possibilidades pro seu perfil.',
    momento: 'pos-link'
  },
  {
    id: 'pos-link-iniciou-parou',
    titulo: 'Pós-Link - Iniciou e Não Terminou',
    conteudo: 'Vi aqui que você chegou a iniciar sua avaliação mas não finalizou. Quer que eu deixe o link fácil aqui pra você concluir rapidinho?',
    momento: 'pos-link'
  },
  // 4. PÓS-DIAGNÓSTICO
  {
    id: 'pos-diagnostico-generico',
    titulo: 'Pós-Diagnóstico (Genérico)',
    conteudo: '[NOME], acabei de ver seu diagnóstico aqui: seu perfil é muito alinhado com o nosso projeto de bebidas funcionais. Quer que eu te explique rapidinho como funciona?',
    momento: 'pos-diagnostico'
  },
  {
    id: 'pos-diagnostico-produtos-saudaveis',
    titulo: 'Pós-Diagnóstico (Quem Já Consome Produtos Saudáveis)',
    conteudo: 'Seu diagnóstico confirmou que você tem um perfil forte porque já se interessa por saúde/bem-estar. Isso é uma vantagem enorme nesse projeto. Posso te mostrar como funciona a oportunidade?',
    momento: 'pos-diagnostico'
  },
  {
    id: 'pos-diagnostico-renda-extra',
    titulo: 'Pós-Diagnóstico (Quem Quer Renda Extra)',
    conteudo: 'Seu teste mostrou que você tem um perfil ótimo pra criar renda extra com algo simples e guiado, sem precisar largar o que faz hoje. Quer que eu te mostre os próximos passos?',
    momento: 'pos-diagnostico'
  },
  {
    id: 'pos-diagnostico-emocional',
    titulo: 'Pós-Diagnóstico (Emocional - Transição/Desemprego)',
    conteudo: '[NOME], seu diagnóstico mostra que você está exatamente no perfil de quem mais tem resultados no nosso projeto: pessoas em fase de mudança que querem um caminho mais seguro. Quer participar da apresentação oficial pra entender direitinho?',
    momento: 'pos-diagnostico'
  },
  // 5. CONVITE PARA APRESENTAÇÃO
  {
    id: 'convite-apresentacao-direto',
    titulo: 'Convite para Apresentação (Direto)',
    conteudo: 'Posso te colocar na próxima apresentação oficial do projeto? Ela é rápida e explica tudo de forma simples.',
    momento: 'convite-apresentacao'
  },
  {
    id: 'convite-apresentacao-horario',
    titulo: 'Convite para Apresentação (Com Escolha de Horário)',
    conteudo: 'Tenho apresentação hoje e amanhã, bem objetivas, explicando o projeto. Você prefere ver **hoje** ou **amanhã**?',
    momento: 'convite-apresentacao'
  },
  {
    id: 'convite-apresentacao-curiosidade',
    titulo: 'Convite para Apresentação (Com Curiosidade)',
    conteudo: 'Na apresentação você vai entender por que tanta gente com um perfil parecido com o seu está tendo resultado com bebidas funcionais. Quer que eu te envie o acesso?',
    momento: 'convite-apresentacao'
  },
  {
    id: 'convite-apresentacao-amigavel',
    titulo: 'Convite para Apresentação (Amigável)',
    conteudo: 'Acho que você vai se identificar muito com o que será explicado na apresentação. Quer participar pra ver se faz sentido pra você?',
    momento: 'convite-apresentacao'
  },
  // 6. PÓS-APRESENTAÇÃO
  {
    id: 'pos-apresentacao-pergunta-aberta',
    titulo: 'Pós-Apresentação (Pergunta Aberta)',
    conteudo: 'E aí, [NOME], o que você achou da apresentação? Fez sentido pra você?',
    momento: 'pos-apresentacao'
  },
  {
    id: 'pos-apresentacao-direcionamento',
    titulo: 'Pós-Apresentação (Direcionamento para Decisão)',
    conteudo: 'Dentro do que você viu, você se vê começando de forma leve, como renda extra, ou prefere esperar mais um pouco?',
    momento: 'pos-apresentacao'
  },
  {
    id: 'pos-apresentacao-reforco',
    titulo: 'Pós-Apresentação (Reforço de Simplicidade)',
    conteudo: 'O ponto principal é: você não precisa saber tudo pra começar. O sistema é guiado e a gente caminha junto. Se fizer sentido, posso te mostrar como dar o primeiro passo.',
    momento: 'pos-apresentacao'
  },
  // 7. OBJEÇÕES
  {
    id: 'objecao-sem-tempo',
    titulo: 'Objeção: "Não tenho tempo"',
    conteudo: 'Totalmente compreensível. Justamente por isso o modelo foi pensado pra ser encaixado na rotina — começa pequeno, com poucos minutos por dia, e vai crescendo conforme você se adapta.',
    momento: 'objecoes'
  },
  {
    id: 'objecao-medo-nao-dar-conta',
    titulo: 'Objeção: "Tenho medo de não dar conta"',
    conteudo: 'Normal sentir isso no começo. A diferença é que aqui você não começa sozinho(a): tem passo a passo, ferramentas prontas e suporte. Você só precisa dar o primeiro passo.',
    momento: 'objecoes'
  },
  {
    id: 'objecao-ja-tentou-outras',
    titulo: 'Objeção: "Já tentei outras coisas e não deu certo"',
    conteudo: 'Muita gente aqui passou pela mesma situação. A diferença é que esse modelo é simples, muito guiado e com produtos de consumo diário, o que facilita demais. Por isso a gente começa com a avaliação e a apresentação — pra você decidir com clareza.',
    momento: 'objecoes'
  },
  {
    id: 'objecao-nao-quer-vender',
    titulo: 'Objeção: "Não quero vender"',
    conteudo: 'Perfeito. Tem muita gente no projeto que começa indicando, usando apenas os links e as avaliações. O sistema faz boa parte da explicação por você.',
    momento: 'objecoes'
  },
  // 8. RECUPERAÇÃO
  {
    id: 'recuperacao-leve',
    titulo: 'Recuperação (Leve)',
    conteudo: 'Oi, [NOME]! Vi que a gente não deu sequência naquele assunto do projeto. Você ainda tem interesse em ver como funciona ou prefere que eu deixe em stand-by por enquanto?',
    momento: 'recuperacao'
  },
  {
    id: 'recuperacao-pos-diagnostico',
    titulo: 'Recuperação (Pós-Diagnóstico)',
    conteudo: 'Seu diagnóstico ficou excelente e acabei não te mostrar os próximos passos. Quer que eu retome de onde paramos?',
    momento: 'recuperacao'
  },
  {
    id: 'recuperacao-pos-apresentacao',
    titulo: 'Recuperação (Pós-Apresentação)',
    conteudo: 'Você chegou a ver a apresentação inteira? Se quiser, posso resumir os pontos principais pra você aqui, bem direto.',
    momento: 'recuperacao'
  },
  // 9. INDICAÇÕES
  {
    id: 'indicacoes-suave',
    titulo: 'Indicações (Suave)',
    conteudo: 'Tranquilo se não for o momento pra você. Se lembrar de alguém que esteja buscando renda extra ou algo novo, me indica? Posso enviar a avaliação gratuita pra essa pessoa também.',
    momento: 'indicacoes'
  },
  {
    id: 'indicacoes-direcionada',
    titulo: 'Indicações (Direcionada)',
    conteudo: 'Você conhece alguém que: precisa de renda extra, está insatisfeito(a) com o trabalho atual ou gosta de saúde/bem-estar? Se lembrar de alguém, me manda o primeiro nome que eu cuido do resto com todo cuidado.',
    momento: 'indicacoes'
  }
]

function RecrutarScriptsPageContent() {
  const [momentoSelecionado, setMomentoSelecionado] = useState<MomentoConversa | 'todos'>('todos')
  const [tipoContatoSelecionado, setTipoContatoSelecionado] = useState<TipoContato | 'todos'>('todos')
  const [scriptCopiado, setScriptCopiado] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

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

  const scriptsFiltrados = scriptsRecrutamento.filter(script => {
    const matchMomento = momentoSelecionado === 'todos' || script.momento === momentoSelecionado
    const matchTipoContato = tipoContatoSelecionado === 'todos' || !script.tipoContato || script.tipoContato === tipoContatoSelecionado
    const matchBusca = busca === '' || 
      script.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      script.conteudo.toLowerCase().includes(busca.toLowerCase())
    
    return matchMomento && matchTipoContato && matchBusca
  })

  const copiarScript = (conteudo: string, id: string) => {
    navigator.clipboard.writeText(conteudo)
    setScriptCopiado(id)
    setTimeout(() => setScriptCopiado(null), 2000)
  }

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
              Biblioteca completa de scripts organizados por momento da conversa e tipo de contato. 
              Escolha o script ideal para cada situação.
            </p>
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

          {/* Filtros */}
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

          {/* Lista de Scripts */}
          <div className="space-y-4">
            {scriptsFiltrados.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-500">Nenhum script encontrado com os filtros selecionados.</p>
              </div>
            ) : (
              scriptsFiltrados.map((script) => (
                <div
                  key={script.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
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
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {script.conteudo}
                      </p>
                    </div>
                    <button
                      onClick={() => copiarScript(script.conteudo, script.id)}
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

