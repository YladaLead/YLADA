/**
 * Formata o catálogo de ferramentas pré-construídas do Pro Líderes
 * para injeção no system prompt do Noel — permite que ele oriente
 * o líder sobre ferramentas disponíveis que ainda não foram ativadas.
 */

/** Ferramentas do catálogo de Vendas (Clientes) */
const CATALOG_VENDAS = [
  { id: 'calc-hidratacao', label: 'Calculadora de Água', tipo: 'calculadora', uso: 'lead informa peso, atividade e clima → recebe necessidade diária de hidratação' },
  { id: 'calc-proteina',   label: 'Calculadora de Proteína', tipo: 'calculadora', uso: 'calcula necessidade diária de proteína por perfil' },
  { id: 'calc-calorias',   label: 'Calculadora de Calorias', tipo: 'calculadora', uso: 'calcula necessidade calórica diária' },
  { id: 'calc-imc',        label: 'Calculadora de IMC', tipo: 'calculadora', uso: 'avalia índice de massa corporal com interpretação' },
  { id: 'energia-foco',    label: 'Quiz: Energia & Foco', tipo: 'quiz', uso: 'mapeamento do padrão de energia e foco ao longo do dia' },
  { id: 'pre-treino',      label: 'Quiz: Pré-Treino Ideal', tipo: 'quiz', uso: 'identifica o pré-treino mais adequado para o perfil da pessoa' },
  { id: 'rotina-produtiva',label: 'Quiz: Rotina Produtiva', tipo: 'quiz', uso: 'diagnóstico de produtividade e energia no trabalho' },
  { id: 'constancia',      label: 'Quiz: Constância & Rotina', tipo: 'quiz', uso: 'identifica o que impede a pessoa de manter hábitos' },
  { id: 'consumo-cafeina', label: 'Calculadora: Consumo de Cafeína', tipo: 'calculadora', uso: 'avalia consumo diário de cafeína e padrão energético' },
  { id: 'custo-energia',   label: 'Calculadora: Custo da Baixa Energia', tipo: 'calculadora', uso: 'estima horas e R$ perdidos por falta de energia' },
]

/** Ferramentas do catálogo de Recrutamento */
const CATALOG_RECRUTAMENTO = [
  { id: 'quiz-recrut-ganhos-prosperidade', label: 'Quiz: Ganhos e Prosperidade', tipo: 'quiz', uso: 'qualifica prospect pela situação financeira e abertura para renda extra' },
  { id: 'quiz-recrut-proposito-equilibrio', label: 'Quiz: Propósito e Equilíbrio', tipo: 'quiz', uso: 'qualifica prospect por valores, tempo e busca de sentido' },
  { id: 'quiz-recrut-potencial-crescimento', label: 'Quiz: Potencial e Crescimento', tipo: 'quiz', uso: 'qualifica prospect pela ambição e disposição para crescer' },
  { id: 'renda-extra-imediata',   label: 'Fluxo: Renda Extra Imediata', tipo: 'quiz', uso: 'para quem quer uma segunda fonte de renda rápida' },
  { id: 'maes-trabalhar-casa',    label: 'Fluxo: Mães que Querem Trabalhar de Casa', tipo: 'quiz', uso: 'para mães que buscam flexibilidade e renda sem sair de casa' },
  { id: 'ja-empreendem',          label: 'Fluxo: Já Empreendem', tipo: 'quiz', uso: 'para quem já tem negócio próprio e quer renda complementar' },
  { id: 'querem-trabalhar-digital', label: 'Fluxo: Querem Trabalhar Digital', tipo: 'quiz', uso: 'para quem quer 100% digital sem estoque' },
  { id: 'ja-tentaram-outros-negocios', label: 'Fluxo: Já Tentaram Outros Negócios', tipo: 'quiz', uso: 'para quem tem histórico de tentativas e precisa de algo diferente' },
  { id: 'cansadas-trabalho-atual', label: 'Fluxo: Cansadas do Trabalho Atual', tipo: 'quiz', uso: 'para quem quer sair do emprego ou ter renda paralela' },
  { id: 'jovens-empreendedores',  label: 'Fluxo: Jovens Empreendedores', tipo: 'quiz', uso: 'para quem quer começar cedo em negócio digital' },
]

/**
 * Formata o catálogo disponível para injeção no system prompt do Noel.
 * Recebe os slugs dos links já ativos do líder para marcar o que já foi ativado.
 */
/**
 * Extrai o fluxo_id de um slug Pro Líderes (ex: "pl-abc123-v-calc-hidratacao" → "calc-hidratacao").
 * Retorna o slug original se não corresponder ao padrão.
 */
function extractFluxoId(slug: string): string {
  const m = slug.trim().match(/^pl-[a-f0-9]+-(?:v|r)-(.+)$/i)
  return m?.[1] ?? slug.toLowerCase()
}

export function formatProLideresCatalogForNoel(activeSlugs: string[]): string {
  const activeSet = new Set(activeSlugs.map(extractFluxoId))

  const formatGroup = (items: typeof CATALOG_VENDAS, heading: string): string => {
    const lines = items.map((item) => {
      const status = activeSet.has(item.id) ? '✅ ativado' : '⬜ disponível'
      return `- [${status}] **${item.label}** (${item.tipo}): ${item.uso}`
    })
    return `**${heading}**\n${lines.join('\n')}`
  }

  const vendas = formatGroup(CATALOG_VENDAS, 'Vendas — Clientes')
  const recrutamento = formatGroup(CATALOG_RECRUTAMENTO, 'Recrutamento')

  return `[CATÁLOGO DE FERRAMENTAS DISPONÍVEIS NO PRO LÍDERES]
Estas ferramentas já estão pré-construídas e prontas para uso — o líder pode ativá-las em "Ferramentas / Catálogo" no painel.
Use este catálogo para orientar o líder sobre qual ferramenta enviar ao lead certo, e para sugerir ativação das que ainda não estão em uso (⬜).
Nunca invente ferramentas fora desta lista nem desta conta. Ao sugerir uma ferramenta ao líder, cite o nome exato e o uso indicado.

${vendas}

${recrutamento}

Regra: ao sugerir uma ferramenta ⬜ disponível, diga ao líder para ativá-la em **Ferramentas → Catálogo** no painel. Ao sugerir uma ✅ já ativa, o link já está disponível na seção [LINKS ATIVOS] acima.`
}
