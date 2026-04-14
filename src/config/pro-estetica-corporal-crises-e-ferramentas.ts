/**
 * Referência de produto — Pro Estética Corporal
 * Crises = queixas/dores típicas do cliente; calculadoras = ferramentas leves (educação, não diagnóstico).
 * Complementa com o teu material; ChatGPT/Noel devem manter linguagem de bem-estar e sessões, sem promessa médica.
 */

export type CriseCorporal = {
  id: string
  /** Nome curto para menus ou filtros */
  label: string
  /** Contexto para scripts, fluxos e Noel */
  notas: string
}

/** Principais crises / focos de queixa em estética corporal (lista viva — acrescenta as tuas) */
export const CRISES_ESTETICA_CORPORAL: CriseCorporal[] = [
  {
    id: 'celulite',
    label: 'Celulite / textura da pele',
    notas:
      'Grau, zonas (coxas, glúteos, barriga), expectativa de “sumir” vs melhora de textura; combinar protocolo + hábitos.',
  },
  {
    id: 'gordura-localizada',
    label: 'Gordura localizada',
    notas:
      'Abdômen, flancos, culote, braços, subpapada; alinhar expectativa com número de sessões e estilo de vida — sem prometer cm fixos.',
  },
  {
    id: 'flacidez',
    label: 'Flacidez de pele / perda de firmeza',
    notas:
      'Pós-emagrecimento, idade, pós-parto; diferenciar flacidez leve de casos que exigem encaminhamento médico.',
  },
  {
    id: 'contorno',
    label: 'Contorno e definição corporal',
    notas:
      'Objetivo estético de silhueta; reforçar constância de sessões e fotos no mesmo critério (luz, posição).',
  },
  {
    id: 'retencao',
    label: 'Retenção líquida / sensação de inchaço',
    notas:
      'Rotina, sono, sal; educação sem substituir avaliação clínica se houver sinais de alarme.',
  },
  {
    id: 'estrias',
    label: 'Estrias / marcas na pele',
    notas:
      'Fase (vermelhas vs brancas), expectativa de melhora de aparência; linguagem cuidadosa, sem cura garantida.',
  },
  {
    id: 'pos-parto',
    label: 'Pós-parto (abdômen, flacidez, autoestima)',
    notas:
      'Respeitar tempo do corpo; alinhar com liberação médica para atividade e protocolos invasivos.',
  },
  {
    id: 'pernas-cansadas',
    label: 'Pernas cansadas / má circulação (sensação)',
    notas:
      'Bem-estar e drenagem como complemento; sinais de trombose ou dor aguda → encaminhar, não improvisar.',
  },
  {
    id: 'pele-aspera',
    label: 'Aspereza / folículos / “pele de laranja”',
    notas:
      'Hidratação, exfoliação suave no protocolo do estúdio; evitar prometer resultado único de produto.',
  },
]

export type CalculadoraLite = {
  id: string
  label: string
  /** Para que serve na conversa com o cliente */
  uso: string
  /** Limitações legais/comunicação */
  cuidado: string
}

/**
 * Calculadoras / ferramentas leves que a área corporal costuma usar ou que fazem sentido no app (modo lite).
 * Nada disto substitui avaliação profissional presencial.
 */
export const CALCULADORAS_E_FERRAMENTAS_LITE: CalculadoraLite[] = [
  {
    id: 'imc',
    label: 'IMC (índice de massa corporal)',
    uso: 'Contexto geral de peso/altura; abrir conversa sobre hábitos, não para rotular saúde sozinho.',
    cuidado: 'Não usar como único critério de elegibilidade para protocolo; atletas e idosos precisam de contexto.',
  },
  {
    id: 'circunferencias',
    label: 'Circunferências (cm) antes / depois',
    uso: 'Acompanhar evolução por zona (cintura, abdômen, coxa) com mesma fita e postura.',
    cuidado: 'Variação diária por retenção; combinar com fotos padronizadas.',
  },
  {
    id: 'agua',
    label: 'Meta diária de água (por peso)',
    uso: 'Hábito simples entre sessões; reforça hidratação da pele e sensação de bem-estar.',
    cuidado: 'Condições cardíacas/renais: remeter a médico se aplicável.',
  },
  {
    id: 'relacao-cintura-quadril',
    label: 'Relação cintura–quadril (opcional)',
    uso: 'Alguns profissionais usam como conversa sobre distribuição de gordura; contexto educativo.',
    cuidado: 'Não confundir com exame médico; é apoio à conversa, não diagnóstico.',
  },
  {
    id: 'sessoes-protocolo',
    label: 'Contagem de sessões / fases do protocolo',
    uso: 'Transparência no pacote (ex.: 6 + 6 manutenção); reduz ansiedade e churn mal explicado.',
    cuidado: 'Contratos e políticas de cancelamento claros por escrito.',
  },
]

/** IDs sugeridos para futuras integrações (Noel, fluxos /l/) — referência mínima */
export const CHAT_LITE_ESCOPO =
  'Só orientação de comunicação, roteiros e educação leve; sem prescrição, sem diagnóstico, sem dosagem.'
