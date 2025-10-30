'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'

interface ReceitaExemplo {
  nome: string
  tempo: string
  dificuldade: string
  ingredientes: string[]
  beneficio: string
}

interface Resultado {
  nivelReceitas: string
  receitasRecomendadas: ReceitaExemplo[]
  caracteristicas: string[]
}

export default function TemplateReceitas({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    experiencia: '',
    tempo: '',
    tipoRefeicao: '',
    objetivo: '',
    preferencias: [] as string[]
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const iniciarFormulario = () => {
    setEtapa('formulario')
  }

  const gerarRecomendacoes = () => {
    if (!dados.experiencia || !dados.tempo || !dados.tipoRefeicao || !dados.objetivo) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    // Determinar nível de receitas
    let nivelReceitas = 'receitasBasicas'
    let receitasRecomendadas: ReceitaExemplo[] = []
    let caracteristicas: string[] = []

    if (dados.experiencia === 'avancado' || (dados.experiencia === 'intermediario' && dados.tempo === 'alto')) {
      nivelReceitas = 'receitasAvancadas'
      caracteristicas = [
        'Técnicas refinadas e sofisticadas',
        '7-10+ ingredientes estrategicamente combinados',
        'Tempo de preparo: 45-90 minutos',
        'Ingredientes premium e funcionais',
        'Apresentação gourmet',
        'Foco em densidade nutricional máxima'
      ]
      receitasRecomendadas = [
        {
          nome: 'Bowl de Quinoa com Salmão Grelhado e Abacate',
          tempo: '60 min',
          dificuldade: 'Avançada',
          ingredientes: ['Quinoa', 'Salmão', 'Abacate', 'Rúcula', 'Tomate cereja', 'Sementes de chia', 'Molho tahine'],
          beneficio: 'Alto teor de ômega-3, proteína completa e fibras'
        },
        {
          nome: 'Risotto de Camarão com Aspargos e Ervas',
          tempo: '45 min',
          dificuldade: 'Avançada',
          ingredientes: ['Arroz arbóreo', 'Camarão', 'Aspargos', 'Caldo de legumes', 'Vinho branco', 'Queijo parmesão', 'Ervas frescas'],
          beneficio: 'Rico em proteína, antioxidantes e sabor sofisticado'
        },
        {
          nome: 'Salada de Grãos com Frango Desfiado e Molho de Iogurte',
          tempo: '50 min',
          dificuldade: 'Moderada-Avançada',
          ingredientes: ['Quinoa', 'Grão-de-bico', 'Frango', 'Vegetais variados', 'Iogurte grego', 'Azeite extra virgem', 'Especiarias'],
          beneficio: 'Proteína completa, probióticos e densidade nutricional'
        }
      ]
    } else if (dados.experiencia === 'intermediario' || (dados.experiencia === 'iniciante' && dados.tempo === 'moderado')) {
      nivelReceitas = 'receitasModeradas'
      caracteristicas = [
        'Técnicas intermediárias',
        '5-7 ingredientes principais',
        'Tempo de preparo: 20-45 minutos',
        'Ingredientes funcionais e nutritivos',
        'Preparo com variedade',
        'Boa qualidade nutricional'
      ]
      receitasRecomendadas = [
        {
          nome: 'Frango Grelhado com Legumes Assados',
          tempo: '35 min',
          dificuldade: 'Moderada',
          ingredientes: ['Peito de frango', 'Batata-doce', 'Brócolis', 'Cenoura', 'Azeite', 'Temperos'],
          beneficio: 'Alto teor de proteína, vitaminas e minerais'
        },
        {
          nome: 'Salada de Folhas com Ovo Pochê e Abacate',
          tempo: '25 min',
          dificuldade: 'Moderada',
          ingredientes: ['Folhas verdes', 'Ovos', 'Abacate', 'Tomate', 'Azeite', 'Limão'],
          beneficio: 'Proteína, gorduras boas e antioxidantes'
        },
        {
          nome: 'Tigela de Aveia com Frutas e Sementes',
          tempo: '15 min',
          dificuldade: 'Fácil-Moderada',
          ingredientes: ['Aveia', 'Banana', 'Morangos', 'Sementes de linhaça', 'Mel', 'Canela'],
          beneficio: 'Fibras, vitaminas e energia sustentada'
        }
      ]
    } else {
      nivelReceitas = 'receitasBasicas'
      caracteristicas = [
        'Técnicas simples e acessíveis',
        '3-5 ingredientes principais',
        'Tempo de preparo: 10-30 minutos',
        'Ingredientes básicos e acessíveis',
        'Preparo rápido e prático',
        'Nutritivo e saboroso'
      ]
      receitasRecomendadas = [
        {
          nome: 'Omelete com Espinafre',
          tempo: '15 min',
          dificuldade: 'Fácil',
          ingredientes: ['Ovos', 'Espinafre', 'Queijo', 'Azeite'],
          beneficio: 'Proteína completa, ferro e cálcio'
        },
        {
          nome: 'Frango Cozido com Legumes',
          tempo: '25 min',
          dificuldade: 'Fácil',
          ingredientes: ['Frango', 'Batata', 'Cenoura', 'Cebola', 'Azeite'],
          beneficio: 'Proteína, carboidratos e vitaminas'
        },
        {
          nome: 'Smoothie Verde',
          tempo: '5 min',
          dificuldade: 'Muito Fácil',
          ingredientes: ['Banana', 'Espinafre', 'Leite', 'Mel'],
          beneficio: 'Rápido, nutritivo e energético'
        }
      ]
    }

    const diagnosticoCompleto = getDiagnostico('template-receitas', 'nutri', nivelReceitas)
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelReceitas,
      receitasRecomendadas,
      caracteristicas
    })
    setEtapa('resultado')
  }

  const togglePreferencia = (pref: string) => {
    if (dados.preferencias.includes(pref)) {
      setDados({
        ...dados,
        preferencias: dados.preferencias.filter(p => p !== pref)
      })
    } else {
      setDados({
        ...dados,
        preferencias: [...dados.preferencias, pref]
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Receitas Nutritivas e Práticas"
        defaultDescription="Receitas personalizadas para você"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="👨‍🍳"
            defaultTitle="Receitas Nutritivas e Práticas"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Receitas personalizadas para você
                </p>
                <p className="text-gray-600">
                  Descubra receitas que se adaptam ao seu estilo de vida e objetivos nutricionais
                </p>
              </>
            }
            benefits={[
              'Receitas personalizadas por nível de experiência',
              'Adaptadas ao seu tempo disponível',
              'Alinhadas aos seus objetivos nutricionais',
              'Ingredientes acessíveis e nutritivos'
            ]}
            onStart={iniciarFormulario}
            buttonText="👨‍🍳 Começar Agora - É Grátis"
          />
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Suas Receitas</h2>
              <p className="text-gray-600">Responda as perguntas para receber receitas personalizadas.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu nível de experiência culinária <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.experiencia}
                  onChange={(e) => setDados({ ...dados, experiencia: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante - Estou aprendendo</option>
                  <option value="intermediario">Intermediário - Tenho alguma prática</option>
                  <option value="avancado">Avançado - Sou experiente na cozinha</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo disponível para cozinhar <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.tempo}
                  onChange={(e) => setDados({ ...dados, tempo: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="baixo">Baixo - Até 30 minutos</option>
                  <option value="moderado">Moderado - 30-60 minutos</option>
                  <option value="alto">Alto - Mais de 60 minutos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de refeição que você mais busca <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.tipoRefeicao}
                  onChange={(e) => setDados({ ...dados, tipoRefeicao: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="cafe-manha">Café da manhã</option>
                  <option value="almoco">Almoço</option>
                  <option value="jantar">Jantar</option>
                  <option value="lanches">Lanches/Snacks</option>
                  <option value="todas">Todas as refeições</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual seu principal objetivo? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.objetivo}
                  onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="perder-peso">Perder peso</option>
                  <option value="ganhar-massa">Ganhar massa muscular</option>
                  <option value="manter-saude">Manter saúde</option>
                  <option value="aumentar-energia">Aumentar energia</option>
                  <option value="melhorar-digestao">Melhorar digestão</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferências alimentares (opcional)
                </label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Vegetariano', 'Vegano', 'Sem glúten', 'Sem lactose', 'Low carb', 'Keto'].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePreferencia(pref)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.preferencias.includes(pref)
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {dados.preferencias.includes(pref) && '✓ '}{pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={gerarRecomendacoes}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                  }}
            >
              Gerar Minhas Receitas →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-orange-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">👨‍🍳</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Suas Receitas Personalizadas</h2>
                <p className="text-gray-600 text-lg">
                  {resultado.nivelReceitas === 'receitasBasicas' && 'Nível: Receitas Básicas - Simples e Nutritivas'}
                  {resultado.nivelReceitas === 'receitasModeradas' && 'Nível: Receitas Moderadas - Qualidade e Variedade'}
                  {resultado.nivelReceitas === 'receitasAvancadas' && 'Nível: Receitas Avançadas - Gourmet e Sofisticadas'}
                </p>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-orange-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Características das Suas Receitas
                </h3>
                <ul className="space-y-2">
                  {resultado.caracteristicas.map((carac, index) => (
                    <li key={index} className="flex items-start text-orange-800 bg-white rounded-lg p-3">
                      <span className="text-orange-600 mr-2">•</span>
                      <span>{carac}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                  <span className="text-2xl mr-2">🍽️</span>
                  Exemplos de Receitas Recomendadas
                </h3>
                <div className="space-y-4">
                  {resultado.receitasRecomendadas.map((receita, index) => (
                    <div key={index} className="bg-white rounded-lg p-5 border-2 border-orange-200">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-gray-900 text-lg">{receita.nome}</h4>
                        <div className="flex gap-2">
                          <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                            {receita.tempo}
                          </span>
                          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            {receita.dificuldade}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</p>
                        <div className="flex flex-wrap gap-2">
                          {receita.ingredientes.map((ing, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded p-3">
                        <p className="text-sm text-orange-800">
                          <span className="font-semibold">✓ Benefício: </span>
                          {receita.beneficio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnósticos Nutricionais */}
              {diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                      <span className="text-2xl mr-2">📋</span>
                      Diagnóstico Nutricional Completo
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.diagnostico}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.causaRaiz}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.acaoImediata}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.plano7Dias}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.suplementacao}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.alimentacao}</p>
                      </div>
                      {diagnostico.proximoPasso && (
                        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4 border-l-4 border-orange-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Dicas para Sucesso na Cozinha
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Prepare ingredientes com antecedência quando possível</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Tenha sempre ingredientes básicos em casa (ovos, legumes, proteínas)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Experimente uma nova receita por semana para manter variedade</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Congele porções quando fizer grandes quantidades</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Reaproveite ingredientes entre receitas diferentes</span>
                  </li>
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Receitas: ${resultado.nivelReceitas === 'receitasBasicas' ? 'Básicas' : resultado.nivelReceitas === 'receitasModeradas' ? 'Moderadas' : 'Avançadas'} | Objetivo: ${dados.objetivo}`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setDados({
                    experiencia: '',
                    tempo: '',
                    tipoRefeicao: '',
                    objetivo: '',
                    preferencias: []
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('formulario')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Ajustar Preferências
              </button>
              <button
                onClick={() => {
                  setDados({
                    experiencia: '',
                    tempo: '',
                    tipoRefeicao: '',
                    objetivo: '',
                    preferencias: []
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                🏠 Voltar ao Início
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

