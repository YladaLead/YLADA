/**
 * Camada adaptativa do diagnóstico: TOM da abertura + CTA avançada.
 * Não altera motor, score nem cálculo — só a camada de copy.
 * @see docs/ANALISE-PROMPT-CAMADA-DECISAO-SERGIO.md
 */

import type { StrategicProfile } from './strategic-profile'
import type { RiskLevel } from './diagnosis-types'

/** Nível base do diagnóstico (motor); modula intensidade da abertura. */
export type DiagnosisBaseLevel = RiskLevel | undefined

/**
 * Retorna frase de abertura do diagnóstico adaptada ao perfil estratégico e ao nível.
 * maturityStage + dominantPain + mindset definem o tom; baseLevel modula intensidade.
 */
export function getAdaptiveDiagnosisIntro(
  strategicProfile: StrategicProfile,
  baseLevel: DiagnosisBaseLevel
): string {
  const { maturityStage, dominantPain, mindset } = strategicProfile
  const isHighStakes = baseLevel === 'alto'
  const isLowStakes = baseLevel === 'baixo'

  // --- Iniciante + Inseguro (encorajador, simples, estruturado) ---
  if (maturityStage === 'iniciante' && mindset === 'inseguro') {
    if (isHighStakes)
      return 'Seu resultado mostra uma oportunidade clara de organizar sua captação. Com pequenos ajustes, você já pode gerar mais previsibilidade.'
    if (isLowStakes)
      return 'Seu resultado indica espaço para organizar sua captação. Pequenos ajustes podem aumentar sua previsibilidade.'
    return 'Seu resultado mostra uma oportunidade clara de organizar sua captação. Com pequenos ajustes estratégicos, você já pode gerar mais previsibilidade.'
  }

  // --- Instável + Agenda ---
  if (maturityStage === 'instavel' && dominantPain === 'agenda') {
    return 'Seu padrão indica que a previsibilidade da sua agenda pode ser estruturada com mais método. Ajustando alguns pontos-chave, você ganha consistência rapidamente.'
  }

  // --- Crescendo + Posicionamento ---
  if (maturityStage === 'crescendo' && dominantPain === 'posicionamento') {
    return 'Seu diagnóstico mostra espaço estratégico para refinar seu posicionamento e atrair pacientes mais alinhados ao seu perfil.'
  }

  // --- Consolidado + Estratégico ---
  if (maturityStage === 'consolidado' && mindset === 'estrategico') {
    if (isHighStakes)
      return 'Seu padrão revela oportunidade de otimização estratégica. Ajustes focados podem elevar sua estrutura de captação.'
    return 'Seu padrão revela oportunidade de otimização estratégica. Pequenos ajustes podem elevar sua estrutura de captação para um nível ainda mais escalável.'
  }

  // --- Mindset Comercial (energia, conversão) ---
  if (mindset === 'comercial') {
    return 'Há espaço claro para otimizar conversão e gerar mais fechamento nos próximos atendimentos.'
  }

  // --- Mindset Técnico (precisão, estrutura) ---
  if (mindset === 'tecnico') {
    return 'Ajustes objetivos na estrutura de captação podem gerar ganhos consistentes.'
  }

  // --- Por estágio genérico ---
  if (maturityStage === 'iniciante')
    return 'Seu padrão mostra onde começar para gerar mais consultas com previsibilidade.'
  if (maturityStage === 'instavel')
    return 'Seu padrão indica próximos passos claros para organizar sua captação.'
  if (maturityStage === 'crescendo')
    return 'Seu padrão aponta para otimizações que aumentam resultado.'
  if (maturityStage === 'consolidado')
    return 'Seu padrão mostra onde escalar com consistência.'

  return 'Seu padrão indica o próximo passo estratégico.'
}

/**
 * CTA avançada por matriz: dominantPain × urgencyLevel × mindset.
 * Se nenhuma regra casar, retorna defaultCta.
 */
export function getAdvancedCta(
  strategicProfile: StrategicProfile,
  defaultCta: string
): string {
  const { dominantPain, urgencyLevel, mindset } = strategicProfile

  // --- Dor: agenda ---
  if (dominantPain === 'agenda') {
    if (urgencyLevel === 'alta')
      return 'Comece hoje a estruturar sua captação e gere consultas com previsibilidade.'
    if (urgencyLevel === 'media')
      return 'Organize sua agenda com método e aumente sua estabilidade.'
    return 'Estruture sua captação e ganhe mais previsibilidade na agenda.'
  }

  // --- Dor: posicionamento ---
  if (dominantPain === 'posicionamento') {
    return 'Ajuste seu posicionamento e atraia pacientes mais alinhados ao seu perfil.'
  }

  // --- Dor: conversão ---
  if (dominantPain === 'conversao') {
    if (mindset === 'comercial')
      return 'Estruture seu processo e aumente seu fechamento já nos próximos atendimentos.'
    if (mindset === 'tecnico')
      return 'Ajuste etapas da sua conversão e otimize seus resultados.'
    return 'Organize seu processo de conversão e aumente seus fechamentos.'
  }

  // --- Dor: autoridade ---
  if (dominantPain === 'autoridade') {
    return 'Fortaleça sua presença e torne sua captação mais consistente.'
  }

  // --- Fallback por mindset (sem dor específica) ---
  if (mindset === 'inseguro')
    return 'Veja como aplicar isso com segurança no seu caso.'
  if (mindset === 'comercial')
    return 'Ative essa estratégia e gere mais conversas ainda hoje.'
  if (mindset === 'tecnico')
    return 'Veja os próximos passos objetivos para aplicar agora.'

  return defaultCta
}
