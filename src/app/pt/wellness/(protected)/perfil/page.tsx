'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { DeleteAccountSection } from '@/components/shared/DeleteAccountSection'

interface PerfilCompleto {
  objetivo_principal?: string
  tempo_disponivel?: string
  experiencia_herbalife?: string
  canal_principal?: string
  canal_preferido?: string[]
  prepara_bebidas?: string
  trabalha_com?: string
  meta_pv?: number
  meta_financeira?: number
  contatos_whatsapp?: number
  seguidores_instagram?: number
  abertura_recrutar?: string
  publico_preferido?: string[]
  tom?: string
  ritmo?: string
  lembretes?: boolean
  tem_lista_contatos?: string
  onboarding_completo?: boolean
  onboarding_completado_at?: string
  // Perfil estratégico / MLM
  tipo_trabalho?: string
  foco_trabalho?: string
  ganhos_prioritarios?: string
  nivel_herbalife?: string
  carga_horaria_diaria?: string
  dias_por_semana?: string
  meta_3_meses?: string
  meta_1_ano?: string
  observacoes_adicionais?: string
  pessoas_na_carteira?: number
  contatos_novos_semana?: number
  meta_crescimento_equipe?: number
  bloqueio_principal?: string
}

// Funções para formatar valores
function formatarObjetivo(objetivo?: string): string {
  if (!objetivo) return 'Não informado'
  const map: Record<string, string> = {
    'vender_mais': '💰 Vender mais',
    'construir_carteira': '👥 Construir carteira',
    'melhorar_rotina': '📅 Melhorar rotina',
    'voltar_ritmo': '🔄 Voltar ao ritmo',
    'aprender_divulgar': '📚 Aprender a divulgar'
  }
  return map[objetivo] || objetivo
}

function formatarTempo(tempo?: string): string {
  if (!tempo) return 'Não informado'
  const map: Record<string, string> = {
    '15_minutos': '15 minutos por dia',
    '30_minutos': '30 minutos por dia',
    '1_hora': '1 hora por dia',
    'mais_1_hora': 'Mais de 1 hora por dia'
  }
  return map[tempo] || tempo
}

function formatarExperiencia(exp?: string): string {
  if (!exp) return 'Não informado'
  const map: Record<string, string> = {
    'nenhuma': 'Nenhuma experiência',
    'ja_vendi': 'Já vendi bebidas funcionais',
    'sim_regularmente': 'Sim, vendo regularmente',
    'ja_vendi_tempo': 'Já vendi há algum tempo',
    'nunca_vendi': 'Nunca vendi'
  }
  return map[exp] || exp
}

function formatarCanal(canal?: string): string {
  if (!canal) return 'Não informado'
  const map: Record<string, string> = {
    'whatsapp': '📱 WhatsApp',
    'instagram': '📸 Instagram',
    'presencial': '🤝 Presencial',
    'grupos': '👥 Grupos',
    'misto': '🔄 Misto (vários canais)'
  }
  return map[canal] || canal
}

function formatarPreparaBebidas(prepara?: string): string {
  if (!prepara) return 'Não informado'
  const map: Record<string, string> = {
    'sim_sempre': 'Sim, sempre',
    'sim_quando_pede': 'Sim, quando pedem',
    'nao': 'Não preparo'
  }
  return map[prepara] || prepara
}

function formatarTrabalhaCom(trabalha?: string): string {
  if (!trabalha) return 'Não informado'
  const map: Record<string, string> = {
    'bebidas_funcionais': 'Bebidas funcionais',
    'nutricao': 'Nutrição',
    'ambos': 'Ambos'
  }
  return map[trabalha] || trabalha
}

function formatarAberturaRecrutar(abertura?: string): string {
  if (!abertura) return 'Não informado'
  const map: Record<string, string> = {
    'sim_interessado': 'Sim, estou interessado',
    'talvez_futuro': 'Talvez no futuro',
    'nao_interessado': 'Não estou interessado'
  }
  return map[abertura] || abertura
}

function formatarTom(tom?: string): string {
  if (!tom) return 'Não informado'
  const map: Record<string, string> = {
    'formal': 'Formal',
    'casual': 'Casual',
    'amigavel': 'Amigável',
    'profissional': 'Profissional'
  }
  return map[tom] || tom
}

function formatarRitmo(ritmo?: string): string {
  if (!ritmo) return 'Não informado'
  const map: Record<string, string> = {
    'acelerado': 'Acelerado',
    'moderado': 'Moderado',
    'calmo': 'Calmo'
  }
  return map[ritmo] || ritmo
}

// Labels neutros (MLM puro) para perfil estratégico
function formatarNivelAtual(nivel?: string): string {
  if (!nivel) return 'Não informado'
  const map: Record<string, string> = {
    'novo_distribuidor': 'Iniciante',
    'supervisor': 'Em crescimento',
    'equipe_mundial': 'Com equipe',
    'equipe_expansao_global': 'Liderança em expansão',
    'equipe_milionarios': 'Liderança consolidada',
    'equipe_presidentes': 'Topo de carreira'
  }
  return map[nivel] || nivel
}

function formatarTipoTrabalho(tipo?: string): string {
  if (!tipo) return 'Não informado'
  const map: Record<string, string> = {
    'bebidas_funcionais': 'Vendas com foco em volume e recorrência',
    'produtos_fechados': 'Vendas com foco em valor por venda',
    'cliente_que_indica': 'Foco em equipe e indicação'
  }
  return map[tipo] || tipo
}

function formatarFocoTrabalho(foco?: string): string {
  if (!foco) return 'Não informado'
  const map: Record<string, string> = {
    'renda_extra': 'Renda extra',
    'plano_carreira': 'Plano de carreira / crescimento em rede',
    'ambos': 'Os dois'
  }
  return map[foco] || foco
}

function formatarGanhosPrioritarios(ganhos?: string): string {
  if (!ganhos) return 'Não informado'
  const map: Record<string, string> = {
    'vendas': 'Ganhos com vendas',
    'equipe': 'Ganhos em comissões de equipe',
    'ambos': 'Os dois'
  }
  return map[ganhos] || ganhos
}

function formatarCargaHoraria(carga?: string): string {
  if (!carga) return 'Não informado'
  const map: Record<string, string> = {
    '1_hora': '1 hora por dia',
    '1_a_2_horas': '1 a 2 horas por dia',
    '2_a_4_horas': '2 a 4 horas por dia',
    'mais_4_horas': 'Mais de 4 horas por dia'
  }
  return map[carga] || carga
}

function formatarDiasPorSemana(dias?: string): string {
  if (!dias) return 'Não informado'
  const map: Record<string, string> = {
    '1_a_2_dias': '1–2 dias por semana',
    '3_a_4_dias': '3–4 dias por semana',
    '5_a_6_dias': '5–6 dias por semana',
    'todos_dias': 'Todos os dias'
  }
  return map[dias] || dias
}

function formatarBloqueio(bloqueio?: string): string {
  if (!bloqueio) return 'Não informado'
  const map: Record<string, string> = {
    'medo': 'Medo de abordar / rejeição',
    'organizacao': 'Organização / rotina',
    'constancia': 'Constância / disciplina',
    'abordagem': 'Não sei como abordar',
    'outro': 'Outro'
  }
  return map[bloqueio] || bloqueio
}

// Layout server-side já valida autenticação, perfil e assinatura
export default function WellnessPerfilPage() {
  return <WellnessPerfilContent />
}

function WellnessPerfilContent() {
  const router = useRouter()
  const authenticatedFetch = useAuthenticatedFetch()
  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await authenticatedFetch('/api/wellness/consultor/perfil-completo', {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar perfil')
        }

        const data = await response.json()
        if (data.success && data.perfil) {
          setPerfil(data.perfil)
        } else {
          throw new Error(data.message || 'Perfil não encontrado')
        }
      } catch (err: any) {
        console.error('Erro ao carregar perfil:', err)
        setError(err.message || 'Erro ao carregar perfil completo')
      } finally {
        setLoading(false)
      }
    }

    carregarPerfil()
  }, [authenticatedFetch])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Meu Perfil de Trabalho" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando seu perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !perfil) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Meu Perfil de Trabalho" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-800 mb-4">{error || 'Perfil não encontrado'}</p>
            <button
              onClick={() => router.push('/pt/wellness/home')}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              ← Voltar para Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <WellnessNavBar showTitle={true} title="Meu Perfil de Trabalho" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            📋 Seu perfil de crescimento
          </h1>
          <p className="text-gray-600">
            Resumo das informações que você preencheu para o mentor personalizar suas orientações
          </p>
        </div>

        {/* Seção: Perfil de crescimento (estratégico + MLM) */}
        {(perfil.tipo_trabalho || perfil.nivel_herbalife || perfil.meta_financeira != null || perfil.pessoas_na_carteira != null || perfil.contatos_novos_semana != null || perfil.meta_crescimento_equipe != null || perfil.bloqueio_principal) && (
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎯</span>
              <span>Perfil de crescimento</span>
            </h2>
            <div className="space-y-3">
              {perfil.tipo_trabalho && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Como você trabalha</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {formatarTipoTrabalho(perfil.tipo_trabalho)}
                  </span>
                </div>
              )}
              {perfil.foco_trabalho && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Foco de trabalho</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {formatarFocoTrabalho(perfil.foco_trabalho)}
                  </span>
                </div>
              )}
              {perfil.ganhos_prioritarios && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Ganhos prioritários</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {formatarGanhosPrioritarios(perfil.ganhos_prioritarios)}
                  </span>
                </div>
              )}
              {perfil.nivel_herbalife && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Nível atual</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {formatarNivelAtual(perfil.nivel_herbalife)}
                  </span>
                </div>
              )}
              {perfil.carga_horaria_diaria && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Tempo por dia</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {formatarCargaHoraria(perfil.carga_horaria_diaria)}
                  </span>
                </div>
              )}
              {perfil.dias_por_semana && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Dias por semana</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {formatarDiasPorSemana(perfil.dias_por_semana)}
                  </span>
                </div>
              )}
              {(perfil.meta_financeira != null && perfil.meta_financeira !== 0) && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Meta de renda mensal</span>
                  <span className="text-sm font-semibold text-green-600">
                    R$ {Number(perfil.meta_financeira).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
              {(perfil.pessoas_na_carteira != null && perfil.pessoas_na_carteira !== 0) && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Pessoas na carteira</span>
                  <span className="text-sm font-semibold text-gray-900">{perfil.pessoas_na_carteira}</span>
                </div>
              )}
              {(perfil.contatos_novos_semana != null && perfil.contatos_novos_semana !== 0) && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Contatos novos por semana</span>
                  <span className="text-sm font-semibold text-gray-900">{perfil.contatos_novos_semana}</span>
                </div>
              )}
              {(perfil.meta_crescimento_equipe != null && perfil.meta_crescimento_equipe !== 0) && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Meta de crescimento em equipe</span>
                  <span className="text-sm font-semibold text-gray-900">{perfil.meta_crescimento_equipe}</span>
                </div>
              )}
              {perfil.bloqueio_principal && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Principal bloqueio</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {formatarBloqueio(perfil.bloqueio_principal)}
                  </span>
                </div>
              )}
              {perfil.meta_3_meses && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Meta para 3 meses</span>
                  <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">
                    {perfil.meta_3_meses}
                  </span>
                </div>
              )}
              {perfil.meta_1_ano && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Meta para 1 ano</span>
                  <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">
                    {perfil.meta_1_ano}
                  </span>
                </div>
              )}
              {perfil.observacoes_adicionais && (
                <div className="flex justify-between items-start py-2">
                  <span className="text-sm text-gray-600">Observações</span>
                  <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%] whitespace-pre-line">
                    {perfil.observacoes_adicionais}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Seção 1: Objetivos e Metas (legado) */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>Objetivos e Metas</span>
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-start py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Objetivo Principal</span>
              <span className="text-sm font-semibold text-gray-900 text-right">
                {formatarObjetivo(perfil.objetivo_principal)}
              </span>
            </div>
            {perfil.meta_pv && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Meta de PV</span>
                <span className="text-sm font-semibold text-blue-600">
                  {perfil.meta_pv} PV
                </span>
              </div>
            )}
            {perfil.meta_financeira && (
              <div className="flex justify-between items-start py-2">
                <span className="text-sm text-gray-600">Meta Financeira</span>
                <span className="text-sm font-semibold text-green-600">
                  R$ {perfil.meta_financeira.toLocaleString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2: Disponibilidade e Experiência */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>⏰</span>
            <span>Disponibilidade e Experiência</span>
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-start py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Tempo Disponível</span>
              <span className="text-sm font-semibold text-gray-900 text-right">
                {formatarTempo(perfil.tempo_disponivel)}
              </span>
            </div>
            <div className="flex justify-between items-start py-2">
              <span className="text-sm text-gray-600">Experiência</span>
              <span className="text-sm font-semibold text-gray-900 text-right">
                {formatarExperiencia(perfil.experiencia_herbalife)}
              </span>
            </div>
          </div>
        </div>

        {/* Seção 3: Canais e Forma de Trabalho */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📱</span>
            <span>Canais e Forma de Trabalho</span>
          </h2>
          <div className="space-y-3">
            {perfil.canal_principal && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Canal Principal</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {formatarCanal(perfil.canal_principal)}
                </span>
              </div>
            )}
            {perfil.canal_preferido && perfil.canal_preferido.length > 0 && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Canais Preferidos</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {perfil.canal_preferido.map(c => formatarCanal(c)).join(', ')}
                </span>
              </div>
            )}
            {perfil.prepara_bebidas && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Prepara Bebidas</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {formatarPreparaBebidas(perfil.prepara_bebidas)}
                </span>
              </div>
            )}
            {perfil.trabalha_com && (
              <div className="flex justify-between items-start py-2">
                <span className="text-sm text-gray-600">Trabalha Com</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {formatarTrabalhaCom(perfil.trabalha_com)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4: Rede e Contatos */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>👥</span>
            <span>Rede e Contatos</span>
          </h2>
          <div className="space-y-3">
            {perfil.contatos_whatsapp !== undefined && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Contatos WhatsApp</span>
                <span className="text-sm font-semibold text-gray-900">
                  {perfil.contatos_whatsapp}
                </span>
              </div>
            )}
            {perfil.seguidores_instagram !== undefined && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Seguidores Instagram</span>
                <span className="text-sm font-semibold text-gray-900">
                  {perfil.seguidores_instagram}
                </span>
              </div>
            )}
            {perfil.tem_lista_contatos && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Lista de Contatos</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {perfil.tem_lista_contatos === 'sim' ? '✅ Sim' :
                   perfil.tem_lista_contatos === 'nao' ? '❌ Não' :
                   '⚠️ Parcialmente'}
                </span>
              </div>
            )}
            {perfil.publico_preferido && perfil.publico_preferido.length > 0 && (
              <div className="flex justify-between items-start py-2">
                <span className="text-sm text-gray-600">Público Preferido</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {perfil.publico_preferido.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5: Preferências */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚙️</span>
            <span>Preferências</span>
          </h2>
          <div className="space-y-3">
            {perfil.tom && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Tom de Comunicação</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {formatarTom(perfil.tom)}
                </span>
              </div>
            )}
            {perfil.ritmo && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Ritmo de Trabalho</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {formatarRitmo(perfil.ritmo)}
                </span>
              </div>
            )}
            {perfil.abertura_recrutar && (
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Abertura para Recrutar</span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  {formatarAberturaRecrutar(perfil.abertura_recrutar)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-start py-2">
              <span className="text-sm text-gray-600">Lembretes</span>
              <span className="text-sm font-semibold text-gray-900">
                {perfil.lembretes ? '✅ Ativados' : '❌ Desativados'}
              </span>
            </div>
          </div>
        </div>

        {/* Botão Voltar */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/pt/wellness/home')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            ← Voltar para Home
          </button>
        </div>

        {/* Exclusão de conta — obrigatório App Store */}
        <div className="mt-8">
          <DeleteAccountSection redirectTo="/entrar" />
        </div>
      </main>
    </div>
  )
}
