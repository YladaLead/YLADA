'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'

export default function NutriDiagnosticoPage() {
  return <NutriDiagnosticoContent />
}

function NutriDiagnosticoContent() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [verificandoFluxo, setVerificandoFluxo] = useState(true)
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    // BLOCO 1
    tipo_atuacao: '',
    tempo_atuacao: '',
    autoavaliacao: '',
    
    // BLOCO 2
    situacao_atual: '',
    processos_captacao: true, // true = tem processo (checkbox desmarcado), false = falta processo (checkbox marcado)
    processos_avaliacao: true,
    processos_fechamento: true,
    processos_acompanhamento: true,
    
    // BLOCO 3
    objetivo_principal: '',
    meta_financeira: '',
    
    // BLOCO 4
    travas: [] as string[],
    
    // BLOCO 5
    tempo_disponivel: '',
    preferencia: '',
    
    // BLOCO 6
    campo_aberto: ''
  })

  // 🚨 CORREÇÃO: Verificar apenas se usuário acessou diretamente a URL (sem passar pelo onboarding)
  // Se chegou através do botão da página de onboarding, não redirecionar de volta
  useEffect(() => {
    const verificarFluxoOnboarding = async () => {
      if (!user) return
      
      // Se já tem diagnóstico completo no perfil, pode acessar diretamente
      if (userProfile?.diagnostico_completo) {
        setVerificandoFluxo(false)
        return
      }
      
      // 🚨 CORREÇÃO: Verificar se veio do onboarding através do referrer
      // Se veio do onboarding, não redirecionar de volta (evita loop)
      if (typeof window !== 'undefined') {
        const referrer = document.referrer
        const veioDoOnboarding = referrer.includes('/onboarding')
        
        if (veioDoOnboarding) {
          console.log('✅ Usuário veio do onboarding - permitindo acesso ao diagnóstico')
          setVerificandoFluxo(false)
          return
        }
      }
      
      // Se não veio do onboarding, verificar se tem diagnóstico
      // Se não tem e acessou diretamente, redirecionar para onboarding
      try {
        const response = await fetch('/api/nutri/diagnostico', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // Se não tem diagnóstico E não veio do onboarding, redirecionar
          if (!data.hasDiagnostico) {
            console.log('ℹ️ Usuário sem diagnóstico e acesso direto - redirecionando para onboarding')
            router.replace('/pt/nutri/onboarding')
            return
          }
        }
      } catch (error) {
        console.error('Erro ao verificar diagnóstico:', error)
        // Em caso de erro, não redirecionar (evita loops)
        setVerificandoFluxo(false)
        return
      } finally {
        setVerificandoFluxo(false)
      }
    }
    
    verificarFluxoOnboarding()
  }, [user, userProfile, router])

  // Carregar diagnóstico existente para edição
  useEffect(() => {
    // Só carregar diagnóstico se já passou pela verificação de fluxo
    if (verificandoFluxo) return
    
    const carregarDiagnostico = async () => {
      try {
        const response = await fetch('/api/nutri/diagnostico', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.diagnostico) {
            // Preencher formulário com dados existentes
            setFormData({
              tipo_atuacao: data.diagnostico.tipo_atuacao || '',
              tempo_atuacao: data.diagnostico.tempo_atuacao || '',
              autoavaliacao: data.diagnostico.autoavaliacao || '',
              situacao_atual: data.diagnostico.situacao_atual || '',
              processos_captacao: data.diagnostico.processos_captacao || false,
              processos_avaliacao: data.diagnostico.processos_avaliacao || false,
              processos_fechamento: data.diagnostico.processos_fechamento || false,
              processos_acompanhamento: data.diagnostico.processos_acompanhamento || false,
              objetivo_principal: data.diagnostico.objetivo_principal || '',
              meta_financeira: data.diagnostico.meta_financeira || '',
              travas: data.diagnostico.travas || [],
              tempo_disponivel: data.diagnostico.tempo_disponivel || '',
              preferencia: data.diagnostico.preferencia || '',
              campo_aberto: data.diagnostico.campo_aberto || ''
            })
          }
        }
      } catch (error) {
        console.error('Erro ao carregar diagnóstico:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarDiagnostico()
  }, [verificandoFluxo])
  
  // Mostrar loading enquanto verifica o fluxo
  if (verificandoFluxo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando...</p>
        </div>
      </div>
    )
  }

  // Função para verificar se formulário está completo
  const isFormValid = () => {
    return (
      formData.tipo_atuacao &&
      formData.tempo_atuacao &&
      formData.autoavaliacao &&
      formData.situacao_atual &&
      formData.objetivo_principal &&
      formData.meta_financeira &&
      formData.tempo_disponivel &&
      formData.preferencia &&
      formData.travas.length <= 3
      // Campo aberto é opcional agora
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validação completa
    if (!formData.tipo_atuacao || !formData.tempo_atuacao || !formData.autoavaliacao) {
      setError('Por favor, preencha todos os campos do Bloco 1: Perfil Profissional.')
      setLoading(false)
      return
    }

    if (!formData.situacao_atual) {
      setError('Por favor, preencha o Bloco 2: Momento Atual do Negócio.')
      setLoading(false)
      return
    }

    if (!formData.objetivo_principal || !formData.meta_financeira) {
      setError('Por favor, preencha todos os campos do Bloco 3: Objetivo Principal.')
      setLoading(false)
      return
    }

    if (formData.travas.length > 3) {
      setError('Selecione no máximo 3 travas.')
      setLoading(false)
      return
    }

    if (!formData.tempo_disponivel || !formData.preferencia) {
      setError('Por favor, preencha todos os campos do Bloco 5: Tempo, Energia e Disciplina.')
      setLoading(false)
      return
    }

    // Campo aberto é totalmente opcional, sem validação de tamanho

    try {
      console.log('📤 Enviando diagnóstico...', formData)
      
      const response = await fetch('/api/nutri/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      console.log('📥 Resposta recebida:', response.status, response.statusText)

      const data = await response.json()
      console.log('📦 Dados recebidos:', data)

      if (!response.ok) {
        console.error('❌ Erro na resposta:', data)
        throw new Error(data.error || 'Erro ao salvar diagnóstico')
      }

      console.log('✅ Diagnóstico salvo com sucesso!')

      // Gerar primeira análise da LYA (não bloquear se falhar)
      try {
        console.log('🤖 Gerando análise da LYA...')
        const lyaResponse = await fetch('/api/nutri/lya/analise', {
          method: 'POST',
          credentials: 'include'
        })
        
        if (lyaResponse.ok) {
          console.log('✅ Análise da LYA gerada!')
        } else {
          console.warn('⚠️ Erro ao gerar análise da LYA (não crítico)')
        }
      } catch (lyaError) {
        console.warn('⚠️ Erro ao gerar análise da LYA (não crítico):', lyaError)
        // Não bloquear - análise pode ser gerada depois
      }

      // Redirecionar para home
      console.log('🔄 Redirecionando para home...')
      router.push('/pt/nutri/home')
    } catch (err: any) {
      console.error('❌ Erro completo:', err)
      setError(err.message || 'Erro ao salvar diagnóstico')
      setLoading(false)
    }
  }

  const toggleTrava = (trava: string) => {
    setFormData(prev => {
      const travas = prev.travas.includes(trava)
        ? prev.travas.filter(t => t !== trava)
        : [...prev.travas, trava]
      
      if (travas.length > 3) {
        return prev // Não adicionar mais de 3
      }
      
      return { ...prev, travas }
    })
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <NutriSidebar />
        <div className="flex-1 lg:ml-56 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando seu perfil Nutri-Empresária...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NutriSidebar />
      
      <div className="flex-1 lg:ml-56">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Perfil Nutri-Empresária
            </h1>
            <p className="text-gray-600 mb-8">
              A LYA precisa conhecer você para te orientar da melhor forma possível. Você pode editar essas informações a qualquer momento.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* BLOCO 1: Perfil Profissional */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  1. Perfil Profissional
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hoje você atua principalmente como:
                    </label>
                    <select
                      value={formData.tipo_atuacao}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipo_atuacao: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="clinica_fisica">Nutricionista clínica (consultório físico)</option>
                      <option value="online">Nutricionista online</option>
                      <option value="hibrida">Híbrida (online + presencial)</option>
                      <option value="iniciante">Recém-formada / iniciando</option>
                      <option value="outra">Outra</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Há quanto tempo você atua como nutricionista?
                    </label>
                    <select
                      value={formData.tempo_atuacao}
                      onChange={(e) => setFormData(prev => ({ ...prev, tempo_atuacao: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="menos_1_ano">Menos de 1 ano</option>
                      <option value="1_3_anos">1 a 3 anos</option>
                      <option value="3_5_anos">3 a 5 anos</option>
                      <option value="mais_5_anos">Mais de 5 anos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hoje você se considera:
                    </label>
                    <select
                      value={formData.autoavaliacao}
                      onChange={(e) => setFormData(prev => ({ ...prev, autoavaliacao: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="tecnica_boa_negocio_fraco">Técnica muito boa, mas fraca em vendas/negócio</option>
                      <option value="tecnica_boa_negocio_razoavel">Boa técnica e razoável no negócio</option>
                      <option value="tecnica_boa_negocio_bom">Boa técnica e boa no negócio</option>
                      <option value="mais_empreendedora">Mais empreendedora do que técnica</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BLOCO 2: Momento Atual do Negócio */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  2. Momento Atual do Negócio
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qual melhor descreve sua realidade hoje?
                    </label>
                    <select
                      value={formData.situacao_atual}
                      onChange={(e) => setFormData(prev => ({ ...prev, situacao_atual: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="poucos_pacientes">Poucos pacientes / agenda vazia</option>
                      <option value="agenda_instavel">Agenda instável</option>
                      <option value="agenda_cheia_desorganizada">Agenda cheia, mas desorganizada</option>
                      <option value="agenda_cheia_organizada">Agenda cheia e organizada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      O que você sente que falta na sua prática hoje? (pode selecionar mais de uma)
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Marque o que você ainda não tem estruturado ou sente que precisa melhorar
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!formData.processos_captacao}
                          onChange={(e) => setFormData(prev => ({ ...prev, processos_captacao: !e.target.checked }))}
                          className="mr-2"
                        />
                        <span>Processo para captar novos clientes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!formData.processos_avaliacao}
                          onChange={(e) => setFormData(prev => ({ ...prev, processos_avaliacao: !e.target.checked }))}
                          className="mr-2"
                        />
                        <span>Processo para avaliação inicial estruturada</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!formData.processos_fechamento}
                          onChange={(e) => setFormData(prev => ({ ...prev, processos_fechamento: !e.target.checked }))}
                          className="mr-2"
                        />
                        <span>Processo para fechar planos de acompanhamento</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!formData.processos_acompanhamento}
                          onChange={(e) => setFormData(prev => ({ ...prev, processos_acompanhamento: !e.target.checked }))}
                          className="mr-2"
                        />
                        <span>Processo para acompanhar clientes ativamente</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Se você já tem algum processo estruturado, não marque essa opção
                    </p>
                  </div>
                </div>
              </div>

              {/* BLOCO 3: Objetivo Principal */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  3. Objetivo Principal (90 dias)
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seu principal objetivo nos próximos 90 dias é:
                    </label>
                    <select
                      value={formData.objetivo_principal}
                      onChange={(e) => setFormData(prev => ({ ...prev, objetivo_principal: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="lotar_agenda">Lotar agenda</option>
                      <option value="organizar_rotina">Organizar rotina e processos</option>
                      <option value="vender_planos">Vender planos de acompanhamento</option>
                      <option value="aumentar_faturamento">Aumentar faturamento</option>
                      <option value="estruturar_negocio">Estruturar negócio para crescer</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quanto você gostaria de faturar por mês?
                    </label>
                    <select
                      value={formData.meta_financeira}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_financeira: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="ate_5k">Até R$5.000</option>
                      <option value="5k_10k">R$5.000 a R$10.000</option>
                      <option value="10k_20k">R$10.000 a R$20.000</option>
                      <option value="acima_20k">Acima de R$20.000</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BLOCO 4: Travas */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  4. Travas e Dificuldades
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O que mais te trava hoje? (selecione até 3)
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'falta_clientes', label: 'Falta de clientes' },
                      { value: 'falta_constancia', label: 'Falta de constância' },
                      { value: 'dificuldade_vender', label: 'Dificuldade em vender' },
                      { value: 'falta_organizacao', label: 'Falta de organização' },
                      { value: 'inseguranca', label: 'Insegurança' },
                      { value: 'falta_tempo', label: 'Falta de tempo' },
                      { value: 'medo_aparecer', label: 'Medo de aparecer' },
                      { value: 'nao_saber_comecar', label: 'Não saber por onde começar' }
                    ].map(trava => (
                      <label key={trava.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.travas.includes(trava.value)}
                          onChange={() => toggleTrava(trava.value)}
                          disabled={!formData.travas.includes(trava.value) && formData.travas.length >= 3}
                          className="mr-2"
                        />
                        <span>{trava.label}</span>
                      </label>
                    ))}
                  </div>
                  {formData.travas.length >= 3 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Máximo de 3 travas selecionadas
                    </p>
                  )}
                </div>
              </div>

              {/* BLOCO 5: Tempo e Disciplina */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  5. Tempo, Energia e Disciplina
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quanto tempo real por dia você pode dedicar ao negócio?
                    </label>
                    <select
                      value={formData.tempo_disponivel}
                      onChange={(e) => setFormData(prev => ({ ...prev, tempo_disponivel: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="ate_30min">Até 30 min</option>
                      <option value="30_60min">30 a 60 min</option>
                      <option value="1_2h">1 a 2 horas</option>
                      <option value="2_3h">2 a 3 horas</option>
                      <option value="3_4h">3 a 4 horas</option>
                      <option value="4_6h">4 a 6 horas</option>
                      <option value="mais_6h">Mais de 6 horas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Você prefere:
                    </label>
                    <select
                      value={formData.preferencia}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferencia: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="guiado">Passo a passo bem guiado</option>
                      <option value="autonomo">Autonomia com orientação pontual</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BLOCO 6: Campo Aberto (OBRIGATÓRIO) */}
              <div className="pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  6. O que ainda não te perguntamos
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existe algo importante sobre você, seu momento ou seu negócio que não perguntamos aqui e que a LYA deveria saber para te orientar melhor?
                    <span className="text-gray-400 ml-1">(opcional)</span>
                  </label>
                  <textarea
                    value={formData.campo_aberto}
                    onChange={(e) => setFormData(prev => ({ ...prev, campo_aberto: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Escreva livremente aqui se quiser adicionar informações extras. Este campo é opcional."
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-4">
                {!isFormValid() && (
                  <p className="text-sm text-gray-500">
                    Preencha todos os campos obrigatórios acima
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Salvando...' : 'Salvar Perfil Nutri-Empresária'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

