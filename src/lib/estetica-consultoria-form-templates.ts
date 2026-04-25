import type { EsteticaConsultSegment } from '@/lib/estetica-consultoria'
import type { ConsultoriaFormField } from '@/lib/pro-lideres-consultoria'

/** Título exacto do material — usado para evitar duplicar o modelo na mesma clínica. */
export const TEMPLATE_DIAGNOSTICO_CORPORAL_TITLE = 'Diagnóstico — Estética corporal (YLADA)'

export const TEMPLATE_DIAGNOSTICO_CORPORAL_ID = 'diagnostico_corporal_v1' as const

export const TEMPLATE_DIAGNOSTICO_CAPILAR_TITLE = 'Diagnóstico — Estética capilar (YLADA)'

export const TEMPLATE_DIAGNOSTICO_CAPILAR_ID = 'diagnostico_capilar_v1' as const

export const TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_TITLE = 'Pré-diagnóstico — Estética corporal (YLADA)'

export const TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID = 'pre_diagnostico_corporal_v1' as const

export const TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_TITLE = 'Pré-diagnóstico — Terapia capilar (YLADA)'

export const TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID = 'pre_diagnostico_capilar_v1' as const

/** Pré-avaliação para cliente final (quem vai ao salão). Material global compartilhado; cada link fica associado à clínica. */
export const TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_TITLE = 'Pré-avaliação capilar — cliente (YLADA)'

export const TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID = 'pre_avaliacao_capilar_cliente_v1' as const

/** Formulários fixos YLADA com confirmação por e-mail antes de preencher. */
export function isDiagnosticoEmailConfirmationTemplate(templateKey: string | null | undefined): boolean {
  return templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID || templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID
}

/** Pré e diagnóstico completo: mesmos campos iniciais (nome, WhatsApp, etc.) para prefill a partir do cadastro admin. */
export function isEsteticaConsultoriaPrefillTemplate(templateKey: string | null | undefined): boolean {
  return (
    templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID ||
    templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID ||
    templateKey === TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID ||
    templateKey === TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID
  )
}

/** Pré com link público (sem clínica criada antes do envio). */
export function isOpenEntryPreDiagnosticoTemplate(templateKey: string | null | undefined): boolean {
  return templateKey === TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID || templateKey === TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID
}

function pickAnswerStr(answers: Record<string, unknown>, key: string): string {
  const v = answers[key]
  return v == null ? '' : String(v).trim()
}

/** Monta payload para INSERT em ylada_estetica_consult_clients após envio do pré (link público). */
export function buildEsteticaLeadClientPayloadFromPreAnswers(
  templateKey: string,
  answers: Record<string, unknown>,
  respondentEmail: string | null
): {
  business_name: string
  contact_name: string | null
  phone: string | null
  contact_email: string | null
  segment: EsteticaConsultSegment
} {
  const nomeClinica = pickAnswerStr(answers, 'nome_clinica')
  const nomeProp = pickAnswerStr(answers, 'nome_proprietaria')
  const ddiRaw = pickAnswerStr(answers, 'whatsapp_ddi')
  const ddi = ddiRaw ? ddiRaw.replace(/\s+—\s+.+$/, '').trim() : '+55'
  const wa = pickAnswerStr(answers, 'whatsapp')
  const phone = [ddi, wa].filter(Boolean).join(' ').trim() || null
  const segment: EsteticaConsultSegment =
    templateKey === TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID ? 'corporal' : 'capilar'
  const business = (nomeClinica || nomeProp || 'Lead — pré-diagnóstico').slice(0, 300)
  return {
    business_name: business,
    contact_name: nomeProp || null,
    phone,
    contact_email: respondentEmail,
    segment,
  }
}

/**
 * Opções do select «DDI do país» em formulários com WhatsApp.
 * Formato: "+NN — Nome" (valor guardado = string completa).
 */
export const ESTETICA_WHATSAPP_DDI_OPTIONS: string[] = [
  '+55 — Brasil',
  '+351 — Portugal',
  '+34 — Espanha',
  '+1 — EUA / Canadá',
  '+52 — México',
  '+54 — Argentina',
  '+56 — Chile',
  '+57 — Colômbia',
  '+51 — Peru',
  '+598 — Uruguai',
  '+595 — Paraguai',
  '+593 — Equador',
  '+591 — Bolívia',
  '+506 — Costa Rica',
  '+507 — Panamá',
  '+502 — Guatemala',
  '+503 — El Salvador',
  '+504 — Honduras',
  '+505 — Nicarágua',
  '+53 — Cuba',
  '+592 — Guiana',
  '+594 — Guiana Francesa',
  '+49 — Alemanha',
  '+33 — França',
  '+39 — Itália',
  '+44 — Reino Unido',
  '+31 — Países Baixos',
  '+41 — Suíça',
  '+43 — Áustria',
  '+972 — Israel',
  '+971 — Emirados Árabes',
  '+244 — Angola',
  '+258 — Moçambique',
  '+238 — Cabo Verde',
  '+670 — Timor-Leste',
  '+86 — China',
  '+81 — Japão',
]

const DEFAULT_WHATSAPP_DDI = ESTETICA_WHATSAPP_DDI_OPTIONS[0] as string

/** Extrai "+digits" do início de uma opção DDI. */
function ddiCodeFromOption(opt: string): string {
  const m = opt.match(/^\+(\d+)/)
  return m ? `+${m[1]}` : ''
}

/** Prefill: separa DDI e número local a partir do telefone guardado no admin (com ou sem +). */
export function splitPhoneForEsteticaWhatsappPrefill(phone: string): { ddi: string; local: string } {
  const raw = phone.trim()
  if (!raw) {
    return { ddi: DEFAULT_WHATSAPP_DDI, local: '' }
  }
  const ranked = [...ESTETICA_WHATSAPP_DDI_OPTIONS]
    .map((opt) => ({ opt, code: ddiCodeFromOption(opt) }))
    .filter((x) => x.code.length > 0)
    .sort((a, b) => b.code.length - a.code.length)

  for (const { opt, code } of ranked) {
    if (raw.startsWith(code)) {
      const local = raw.slice(code.length).replace(/^[\s\-–]+/, '').trim()
      return { ddi: opt, local: local || raw }
    }
  }
  return { ddi: DEFAULT_WHATSAPP_DDI, local: raw.replace(/^\+/, '') }
}

const WHATSAPP_DDI_FIELD: ConsultoriaFormField = {
  id: 'whatsapp_ddi',
  label: '1. DDI do país (WhatsApp)',
  type: 'select',
  required: true,
  options: ESTETICA_WHATSAPP_DDI_OPTIONS,
}

const WHATSAPP_LOCAL_FIELD: ConsultoriaFormField = {
  id: 'whatsapp',
  label: '1. WhatsApp (número com DDD, sem o código do país)',
  type: 'text',
  required: true,
}

const SIM_NAO_AS_VEZES = ['Sim', 'Não', 'Às vezes']

const SERVICOS_CHECKLIST: string[] = [
  'Drenagem linfática',
  'Massagem modeladora',
  'Criolipólise',
  'Radiofrequência',
  'Ultrassom',
  'Lipocavitação',
  'Endermologia',
  'Pós-operatório',
  'Celulite e flacidez',
  'Gordura localizada',
  'Detox corporal',
  'Protocolos personalizados',
]

const CANAIS_CHECKLIST: string[] = [
  'Instagram',
  'Indicação',
  'WhatsApp',
  'Tráfego pago',
  'Parcerias',
]

const DORES_CHECKLIST: string[] = [
  'Agenda vazia',
  'Clientes que não fecham',
  'Clientes que não voltam',
  'Falta de posicionamento',
  'Não sabe o que postar',
  'Baixo faturamento',
  'Desorganização',
  'Precificação',
]

const PROCESSOS_CHECKLIST: string[] = [
  'Retorno agendado',
  'Acompanhamento',
  'Pós-atendimento',
  'Nenhum',
]

export type EsteticaConsultClientPrefill = {
  business_name: string
  contact_name: string | null
  phone: string | null
  contact_email: string | null
}

/** Dados do cadastro admin → respostas iniciais (a pessoa pode editar). Sem valores comerciais. */
export function buildEsteticaDiagnosticoPublicPrefill(client: EsteticaConsultClientPrefill): {
  initialAnswers: Record<string, string>
  respondentName: string
  respondentEmail: string
} {
  const initialAnswers: Record<string, string> = {}
  const bn = (client.business_name ?? '').trim()
  if (bn) initialAnswers.nome_clinica = bn
  const cn = (client.contact_name ?? '').trim()
  if (cn) initialAnswers.nome_proprietaria = cn
  const ph = (client.phone ?? '').trim()
  if (ph) {
    const { ddi, local } = splitPhoneForEsteticaWhatsappPrefill(ph)
    initialAnswers.whatsapp_ddi = ddi
    initialAnswers.whatsapp = local
  }
  return {
    initialAnswers,
    respondentName: cn,
    respondentEmail: (client.contact_email ?? '').trim(),
  }
}

/** Formulário diagnóstico corporal (estrutura por blocos). */
export function buildDiagnosticoCorporalV1Fields(): ConsultoriaFormField[] {
  return [
    {
      id: 'nome_clinica',
      label: '1. Nome da clínica / marca',
      type: 'text',
      required: true,
    },
    {
      id: 'nome_proprietaria',
      label: '1. Nome da proprietária (ou quem decide)',
      type: 'text',
      required: true,
    },
    {
      id: 'instagram',
      label: '1. Instagram (@ ou link)',
      type: 'text',
      required: true,
    },
    WHATSAPP_DDI_FIELD,
    WHATSAPP_LOCAL_FIELD,
    {
      id: 'cidade_estado',
      label: '1. Cidade / Estado',
      type: 'text',
      required: true,
    },
    {
      id: 'tempo_atuacao',
      label: '1. Tempo de atuação em estética corporal',
      type: 'text',
      required: false,
    },
    {
      id: 'trabalha_sozinha_equipe',
      label: '1. Trabalha sozinha ou com equipe?',
      type: 'select',
      required: true,
      options: ['Sozinha', 'Com equipe'],
    },
    {
      id: 'equipe_quantas',
      label: '1. Se tem equipe: quantas pessoas (incluindo você)?',
      type: 'text',
      required: false,
    },
    {
      id: 'servicos_chk',
      label: '2. Serviços que oferece (marque todos que aplicam)',
      type: 'checkbox_group',
      required: true,
      options: SERVICOS_CHECKLIST,
    },
    {
      id: 'servicos_outros',
      label: '2. Outros serviços (texto livre, opcional)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_1_nome',
      label: '3. Serviço principal 1 — nome do tratamento / protocolo',
      type: 'text',
      required: true,
    },
    {
      id: 'servico_1_valor_sessao',
      label: '3. Serviço 1 — valor por sessão (R$)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_1_duracao_min',
      label: '3. Serviço 1 — duração média (minutos)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_1_custo_aprox',
      label: '3. Serviço 1 — custo aproximado por sessão (R$ ou “não sei”)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_1_sessoes_por_dia',
      label: '3. Serviço 1 — sessões por dia (média)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_2_nome',
      label: '3. Serviço principal 2 — nome (opcional)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_2_valor_sessao',
      label: '3. Serviço 2 — valor por sessão (R$)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_2_duracao_min',
      label: '3. Serviço 2 — duração média (minutos)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_2_custo_aprox',
      label: '3. Serviço 2 — custo aproximado',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_2_sessoes_por_dia',
      label: '3. Serviço 2 — sessões por dia (média)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_3_nome',
      label: '3. Serviço principal 3 — nome (opcional)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_3_valor_sessao',
      label: '3. Serviço 3 — valor por sessão (R$)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_3_duracao_min',
      label: '3. Serviço 3 — duração média (minutos)',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_3_custo_aprox',
      label: '3. Serviço 3 — custo aproximado',
      type: 'text',
      required: false,
    },
    {
      id: 'servico_3_sessoes_por_dia',
      label: '3. Serviço 3 — sessões por dia (média)',
      type: 'text',
      required: false,
    },
    {
      id: 'atendimentos_por_semana',
      label: '4. Atendimentos por semana (média)',
      type: 'text',
      required: false,
    },
    {
      id: 'agenda_situacao',
      label: '4. Sua agenda hoje está:',
      type: 'select',
      required: true,
      options: [
        'Vazia',
        'Parcialmente cheia',
        'Cheia, mas com horários ociosos',
        'Cheia e organizada',
      ],
    },
    {
      id: 'horarios_mais_vazios',
      label: '4. Dias/horários mais vazios',
      type: 'textarea',
      required: false,
    },
    {
      id: 'canais_chk',
      label: '5. Como consegue clientes hoje? (marque)',
      type: 'checkbox_group',
      required: false,
      options: CANAIS_CHECKLIST,
    },
    {
      id: 'canais_outros',
      label: '5. Outros canais (texto)',
      type: 'text',
      required: false,
    },
    {
      id: 'posta_frequencia',
      label: '5. Posta com frequência no Instagram?',
      type: 'select',
      required: false,
      options: SIM_NAO_AS_VEZES,
    },
    {
      id: 'instagram_traz_qualidade',
      label: '5. O Instagram traz clientes de qualidade?',
      type: 'select',
      required: false,
      options: ['Sim', 'Não', 'Mais curiosos do que clientes'],
    },
    {
      id: 'conversao_situacao',
      label: '6. Quando alguém chama, você sente que:',
      type: 'select',
      required: false,
      options: [
        'Fecha fácil',
        'Tem dificuldade em converter',
        'A pessoa pergunta preço e some',
      ],
    },
    {
      id: 'oferece_formato',
      label: '6. Você oferece principalmente:',
      type: 'select',
      required: false,
      options: ['Sessões avulsas', 'Pacotes', 'Programas completos', 'Mistura'],
    },
    {
      id: 'ticket_medio',
      label: '6. Ticket médio atual (R$, se souber)',
      type: 'text',
      required: false,
    },
    {
      id: 'clientes_voltam',
      label: '7. Seus clientes costumam voltar?',
      type: 'select',
      required: false,
      options: ['Sim', 'Não', 'Pouco'],
    },
    {
      id: 'processos_pos_chk',
      label: '7. Processo de: (marque o que tiver)',
      type: 'checkbox_group',
      required: false,
      options: PROCESSOS_CHECKLIST,
    },
    {
      id: 'dores_chk',
      label: '8. O que mais incomoda no negócio? (marque)',
      type: 'checkbox_group',
      required: true,
      options: DORES_CHECKLIST,
    },
    {
      id: 'dores_detalhe',
      label: '8. Quer complementar? (opcional)',
      type: 'textarea',
      required: false,
    },
    {
      id: 'objetivo_30_dias',
      label: '9. Principal resultado nos próximos 30 dias',
      type: 'textarea',
      required: true,
    },
    {
      id: 'uma_coisa_so',
      label: '10. Se pudesse resolver só UMA coisa hoje no negócio, qual seria?',
      type: 'textarea',
      required: true,
    },
    {
      id: 'comentarios_finais',
      label:
        '11. Comentários livres (opcional) — contexto extra, dúvidas, ideias ou o que quiser que a consultoria saiba',
      type: 'textarea',
      required: false,
    },
  ]
}

export function getDiagnosticoCorporalV1Description(): string {
  return [
    'Ajuda a ver onde você está travando — faturamento, agenda e clientes.',
    'Passos curtos no celular. No final: Enviar.',
  ].join('\n')
}

/** Pré curto antes da consultoria — ecoa temas do diagnóstico completo (dores, agenda, canais, retorno, ticket). */
export function buildPreDiagnosticoCorporalV1Fields(): ConsultoriaFormField[] {
  return [
    {
      id: 'nome_proprietaria',
      label: '1. Nome completo',
      type: 'text',
      required: true,
    },
    WHATSAPP_DDI_FIELD,
    WHATSAPP_LOCAL_FIELD,
    {
      id: 'nome_clinica',
      label: '1. Nome do salão / clínica (ou marca)',
      type: 'text',
      required: true,
    },
    {
      id: 'instagram',
      label: '1. Instagram do negócio (@ ou link)',
      type: 'text',
      required: true,
    },
    {
      id: 'cidade_estado',
      label: '1. Cidade / Estado',
      type: 'text',
      required: true,
    },
    {
      id: 'pre_dor_principal',
      label: '2. Hoje, o que mais incomoda no seu negócio?',
      type: 'select',
      required: true,
      options: [
        'Agenda com horários livres',
        'Clientes não retornam',
        'Dificuldade de atrair novos clientes',
        'Muito interesse, pouca conversão',
        'Preciso baixar preço pra fechar',
        'Falta de posicionamento ou autoridade',
      ],
    },
    {
      id: 'pre_agenda',
      label: '3. Sua agenda hoje está:',
      type: 'select',
      required: true,
      options: ['Cheia e organizada', 'Oscila bastante', 'Com muitos horários livres'],
    },
    {
      id: 'pre_canais',
      label: '4. De onde vêm seus clientes hoje? (marque)',
      type: 'checkbox_group',
      required: true,
      options: ['Instagram', 'Indicação', 'Tráfego pago', 'WhatsApp', 'Outros'],
    },
    {
      id: 'pre_retorno',
      label: '5. Seus clientes costumam voltar?',
      type: 'select',
      required: true,
      options: ['Sim, com frequência', 'Às vezes', 'Raramente'],
    },
    {
      id: 'pre_cobrar_preco',
      label: '6. Você sente dificuldade em cobrar seu preço?',
      type: 'select',
      required: true,
      options: ['Sim', 'Às vezes', 'Não'],
    },
    {
      id: 'pre_queixa_corporal',
      label: '7. O que suas clientes mais buscam no corporal?',
      type: 'select',
      required: true,
      options: ['Gordura localizada', 'Flacidez', 'Celulite', 'Retenção de líquido', 'Mais de um destes (equilibrado)'],
    },
    {
      id: 'pre_aberta_estrategia',
      label: '8. Você está aberta a ajustar sua estratégia para melhorar resultados nos próximos 30 dias?',
      type: 'select',
      required: true,
      options: ['Sim', 'Depende do que for', 'Só quero entender melhor por enquanto'],
    },
    {
      id: 'pre_interesse_plano',
      label: '9. Se fizer sentido, teria interesse em aplicar um plano para melhorar seus resultados?',
      type: 'select',
      required: true,
      options: ['Sim', 'Talvez', 'Não no momento'],
    },
  ]
}

export function getPreDiagnosticoCorporalV1Description(): string {
  return [
    'Antes da consultoria: 2 a 3 minutos. Leve e estratégico — para chegarmos na conversa com foco.',
    'Depois você recebe o diagnóstico completo (outro link), com mais detalhe operacional.',
  ].join('\n')
}

const ESPECIALIDADES_CAPILAR_CHECKLIST: string[] = [
  'Queda de cabelo',
  'Alopecia',
  'Caspa / dermatite',
  'Oleosidade excessiva',
  'Crescimento capilar',
  'Fortalecimento dos fios',
  'Terapia capilar preventiva',
  'Microagulhamento capilar',
  'Laser capilar',
  'Ozonioterapia capilar',
  'Detox capilar',
]

const CANAIS_AQUISICAO_CAPILAR: string[] = ['Instagram', 'Indicação', 'Tráfego pago', 'Parcerias', 'Outros']

const DORES_CAPILAR_CHECKLIST: string[] = [
  'Falta de clientes',
  'Clientes não fecham',
  'Clientes não continuam o tratamento',
  'Dificuldade de explicar o tratamento',
  'Baixo faturamento',
  'Falta de posicionamento',
  'Não sabe o que postar',
]

const TRABALHA_COM_CAPILAR_CHK: string[] = ['Protocolos completos', 'Sessões avulsas', 'Planos de tratamento']

function tratamentoCapilarFields(n: 1 | 2 | 3 | 4 | 5): ConsultoriaFormField[] {
  const req = n === 1
  return [
    {
      id: `trat_cap_${n}_nome`,
      label: `3.${n} Nome do tratamento / protocolo`,
      type: 'text',
      required: req,
    },
    {
      id: `trat_cap_${n}_valor_sessao`,
      label: `3.${n} Valor por sessão (R$)`,
      type: 'text',
      required: false,
    },
    {
      id: `trat_cap_${n}_duracao`,
      label: `3.${n} Duração média (minutos ou texto)`,
      type: 'text',
      required: false,
    },
    {
      id: `trat_cap_${n}_sessoes_recomendadas`,
      label: `3.${n} Quantas sessões você recomenda por cliente (média)`,
      type: 'text',
      required: false,
    },
    {
      id: `trat_cap_${n}_sessoes_por_dia`,
      label: `3.${n} Quantas sessões consegue fazer por dia (média)`,
      type: 'text',
      required: false,
    },
  ]
}

/** Formulário diagnóstico capilar (recorrência, posicionamento, conversão). */
export function buildDiagnosticoCapilarV1Fields(): ConsultoriaFormField[] {
  return [
    {
      id: 'nome_clinica',
      label: '1. Nome da clínica / marca',
      type: 'text',
      required: true,
    },
    {
      id: 'nome_proprietaria',
      label: '1. Nome da profissional (ou quem decide)',
      type: 'text',
      required: true,
    },
    {
      id: 'instagram',
      label: '1. Instagram (@ ou link)',
      type: 'text',
      required: true,
    },
    WHATSAPP_DDI_FIELD,
    WHATSAPP_LOCAL_FIELD,
    {
      id: 'cidade_estado',
      label: '1. Cidade / Estado',
      type: 'text',
      required: true,
    },
    {
      id: 'tempo_atuacao',
      label: '1. Tempo de atuação em estética capilar',
      type: 'text',
      required: false,
    },
    {
      id: 'trabalha_sozinha_equipe',
      label: '1. Trabalha sozinha ou com equipe?',
      type: 'select',
      required: true,
      options: ['Sozinha', 'Com equipe'],
    },
    {
      id: 'equipe_quantas',
      label: '1. Se tem equipe: quantas pessoas (incluindo você)?',
      type: 'text',
      required: false,
    },
    {
      id: 'especialidades_capilar_chk',
      label: '2. Especialidades (marque todas que aplicam)',
      type: 'checkbox_group',
      required: true,
      options: ESPECIALIDADES_CAPILAR_CHECKLIST,
    },
    {
      id: 'especialidades_outros',
      label: '2. Outras especialidades (texto livre, opcional)',
      type: 'text',
      required: false,
    },
    ...tratamentoCapilarFields(1),
    ...tratamentoCapilarFields(2),
    ...tratamentoCapilarFields(3),
    ...tratamentoCapilarFields(4),
    ...tratamentoCapilarFields(5),
    {
      id: 'posicionamento_como',
      label: '4. Hoje você se posiciona mais como:',
      type: 'select',
      required: true,
      options: ['Tratamento estético', 'Tratamento terapêutico', 'Saúde capilar', 'Não sei exatamente'],
    },
    {
      id: 'clientes_percebem_valor',
      label: '4. Você sente que seus clientes:',
      type: 'select',
      required: true,
      options: ['Entendem o valor do tratamento', 'Acham caro', 'Comparam muito com preço'],
    },
    {
      id: 'chegam_clientes_chk',
      label: '5. Como chegam seus clientes hoje? (marque)',
      type: 'checkbox_group',
      required: false,
      options: CANAIS_AQUISICAO_CAPILAR,
    },
    {
      id: 'chegam_clientes_outros',
      label: '5. Outros canais (texto, opcional)',
      type: 'text',
      required: false,
    },
    {
      id: 'instagram_hoje',
      label: '5. Seu Instagram hoje:',
      type: 'select',
      required: false,
      options: ['Atrai clientes certos', 'Atrai curiosos', 'Não gera resultado'],
    },
    {
      id: 'conversao_quando_chamam',
      label: '6. Quando alguém te chama:',
      type: 'select',
      required: true,
      options: ['Fecha fácil', 'Precisa explicar muito', 'A pessoa some depois do preço'],
    },
    {
      id: 'tratamento_continuo',
      label: '7. Seus clientes fazem tratamento contínuo?',
      type: 'select',
      required: true,
      options: ['Sim', 'Não', 'Só alguns'],
    },
    {
      id: 'trabalha_com_chk',
      label: '7. Você trabalha com: (marque)',
      type: 'checkbox_group',
      required: false,
      options: TRABALHA_COM_CAPILAR_CHK,
    },
    {
      id: 'acompanhamento_cliente',
      label: '7. Você tem acompanhamento do cliente?',
      type: 'select',
      required: false,
      options: ['Sim', 'Não'],
    },
    {
      id: 'agenda_hoje',
      label: '8. Sua agenda hoje está:',
      type: 'select',
      required: true,
      options: ['Vazia', 'Parcial', 'Cheia, mas desorganizada', 'Cheia e previsível'],
    },
    {
      id: 'dias_fracos',
      label: '8. Tem dias fracos?',
      type: 'select',
      required: false,
      options: ['Sim', 'Não'],
    },
    {
      id: 'dores_capilar_chk',
      label: '9. Principais dores (marque)',
      type: 'checkbox_group',
      required: true,
      options: DORES_CAPILAR_CHECKLIST,
    },
    {
      id: 'dores_capilar_outros',
      label: '9. Outras dores (texto, opcional)',
      type: 'text',
      required: false,
    },
    {
      id: 'objetivo_30_dias_capilar',
      label: '10. Objetivo (30 dias) — o que você mais gostaria de melhorar agora?',
      type: 'textarea',
      required: true,
    },
    {
      id: 'impede_crescer_capilar',
      label: '11. O que hoje mais te impede de crescer na área capilar?',
      type: 'textarea',
      required: true,
    },
    {
      id: 'cliente_entende_processo',
      label:
        '12. (Opcional) Você acredita que seu cliente entende que o tratamento capilar é um processo (e não algo imediato)?',
      type: 'select',
      required: false,
      options: ['Sim', 'Não', 'Em parte'],
    },
    {
      id: 'comentarios_finais_capilar',
      label: '13. Comentários livres (opcional)',
      type: 'textarea',
      required: false,
    },
  ]
}

export function getDiagnosticoCapilarV1Description(): string {
  return [
    'Foco em recorrência, posicionamento e conversão na capilar.',
    'Confirme o e-mail, depois responda com calma no celular.',
  ].join('\n')
}

/** Pré capilar — alinhado a dores, canais, retorno e queixas típicas do diagnóstico longo. */
export function buildPreDiagnosticoCapilarV1Fields(): ConsultoriaFormField[] {
  return [
    {
      id: 'nome_proprietaria',
      label: '1. Nome completo',
      type: 'text',
      required: true,
    },
    WHATSAPP_DDI_FIELD,
    WHATSAPP_LOCAL_FIELD,
    {
      id: 'nome_clinica',
      label: '1. Nome do salão / clínica (ou marca)',
      type: 'text',
      required: true,
    },
    {
      id: 'instagram',
      label: '1. Instagram do negócio (@ ou link)',
      type: 'text',
      required: true,
    },
    {
      id: 'cidade_estado',
      label: '1. Cidade / Estado',
      type: 'text',
      required: true,
    },
    {
      id: 'pre_dor_principal',
      label: '2. Hoje, o que mais incomoda no seu negócio?',
      type: 'select',
      required: true,
      options: [
        'Agenda com horários livres',
        'Clientes não fecham ou não continuam o tratamento',
        'Dificuldade de atrair novas clientes',
        'Muito interesse, pouca conversão',
        'Preciso baixar preço pra fechar',
        'Falta de posicionamento ou autoridade',
      ],
    },
    {
      id: 'pre_agenda',
      label: '3. Sua agenda hoje está:',
      type: 'select',
      required: true,
      options: ['Cheia e organizada', 'Oscila bastante', 'Com muitos horários livres'],
    },
    {
      id: 'pre_canais',
      label: '4. De onde vêm suas clientes hoje? (marque)',
      type: 'checkbox_group',
      required: true,
      options: ['Instagram', 'Indicação', 'Tráfego pago', 'WhatsApp', 'Outros'],
    },
    {
      id: 'pre_retorno',
      label: '5. As clientes costumam voltar para manter o tratamento?',
      type: 'select',
      required: true,
      options: ['Sim, com frequência', 'Às vezes', 'Raramente'],
    },
    {
      id: 'pre_cobrar_preco',
      label: '6. Você sente dificuldade em cobrar seu preço?',
      type: 'select',
      required: true,
      options: ['Sim', 'Às vezes', 'Não'],
    },
    {
      id: 'pre_queixa_capilar',
      label: '7. Qual a principal queixa que suas clientes trazem?',
      type: 'select',
      required: true,
      options: ['Queda de cabelo', 'Falhas / falhas de preenchimento', 'Afinamento dos fios', 'Caspa ou oleosidade', 'Mais de um destes'],
    },
    {
      id: 'pre_aberta_estrategia',
      label: '8. Você está aberta a ajustar sua estratégia para melhorar resultados nos próximos 30 dias?',
      type: 'select',
      required: true,
      options: ['Sim', 'Depende do que for', 'Só quero entender melhor por enquanto'],
    },
    {
      id: 'pre_interesse_plano',
      label: '9. Se fizer sentido, teria interesse em aplicar um plano para melhorar seus resultados?',
      type: 'select',
      required: true,
      options: ['Sim', 'Talvez', 'Não no momento'],
    },
  ]
}

export function getPreDiagnosticoCapilarV1Description(): string {
  return [
    'Antes da consultoria: 2 a 3 minutos. Para reflexão rápida e conversa mais produtiva.',
    'O diagnóstico completo capilar (outro link) aprofunda protocolos, valores e processos.',
  ].join('\n')
}

const CLI_CAP_PROTOCOLOS_CHK: string[] = [
  'Ozonioterapia capilar',
  'Blend de óleos essenciais',
  'Ativos naturais no ritual de lavagem (ex.: cúrcuma)',
  'Microagulhamento capilar',
  'Detox / esfoliação suave do couro',
  'LED / fototerapia',
  'Vacuoterapia / sucção suave no couro',
  'Não sei — quero orientação da profissional',
]

/** Questionário reflexivo para a cliente marcar interesse e contexto antes de falar com a clínica. */
export function buildPreAvaliacaoCapilarClienteV1Fields(): ConsultoriaFormField[] {
  return [
    {
      id: 'cli_cap_confirmo_aviso',
      label:
        '1. Este questionário é informativo e ajuda a profissional a preparar o seu atendimento. Não substitui consulta médica nem diagnóstico clínico. Confirma que compreende e quer continuar?',
      type: 'select',
      required: true,
      options: ['Sim, compreendo e quero continuar'],
    },
    {
      id: 'cli_cap_nome_completo',
      label: '1. Seu nome completo',
      type: 'text',
      required: true,
    },
    WHATSAPP_DDI_FIELD,
    WHATSAPP_LOCAL_FIELD,
    {
      id: 'cli_cap_email',
      label: '1. E-mail (opcional — para contato ou envio de informações)',
      type: 'text',
      required: false,
    },
    {
      id: 'cli_cap_couro_hoje',
      label: '2. Como você descreve o couro cabeludo na maior parte do tempo?',
      type: 'select',
      required: true,
      options: [
        'Normal / sem queixas fortes',
        'Oleoso na raiz',
        'Seco ou repuxa',
        'Misto (oleoso na raiz, seco nas pontas)',
        'Muito sensível (ardor, comichão ou reação fácil a produtos)',
        'Não tenho certeza',
      ],
    },
    {
      id: 'cli_cap_queda',
      label: '2. Queda de cabelo — o que você sente hoje?',
      type: 'select',
      required: true,
      options: [
        'Quase nada / sazonal leve',
        'Notei mais fios na escova ou no chuveiro',
        'Afinamento visível ou falhas',
        'Já fui orientada por médica/o para isso',
        'Prefiro não responder aqui',
      ],
    },
    {
      id: 'cli_cap_ressecamento',
      label: '2. Ressecamento, porosidade ou frizz — como está?',
      type: 'select',
      required: true,
      options: ['Leve', 'Moderado', 'Forte', 'Depende da estação ou do que aplico', 'Raramente noto'],
    },
    {
      id: 'cli_cap_caspa',
      label: '2. Caspa ou descamação do couro?',
      type: 'select',
      required: true,
      options: ['Não', 'Ocasional', 'Frequente', 'Já tive diagnóstico de dermatite / seborreia', 'Não sei distinguir'],
    },
    {
      id: 'cli_cap_oleosidade_raiz',
      label: '2. Oleosidade na raiz — quanto tempo até sentir a raiz “pesada” após lavar?',
      type: 'select',
      required: true,
      options: [
        '1 dia ou menos',
        '2 dias',
        '3 ou mais dias',
        'Varia muito',
        'Não noto oleosidade',
      ],
    },
    {
      id: 'cli_cap_quimica',
      label: '2. Química ou coloração nos últimos 6 meses?',
      type: 'select',
      required: true,
      options: [
        'Nenhuma',
        'Coloração ou madeixas',
        'Alisamento / relaxamento / progressiva',
        'Descoloração ou luzes',
        'Mais de um destes',
      ],
    },
    {
      id: 'cli_cap_calor_styling',
      label: '3. Calor (secador, chapinha) ou penteados bem presos com frequência?',
      type: 'select',
      required: true,
      options: ['Quase todos os dias', 'Algumas vezes por semana', 'Raramente', 'Evito de propósito'],
    },
    {
      id: 'cli_cap_frequencia_lavagem',
      label: '3. Com que frequência você lava o cabelo em média?',
      type: 'select',
      required: true,
      options: ['Todos os dias', 'Em dia sim, dia não', '2 vezes por semana', '1 vez por semana ou menos', 'Varia muito'],
    },
    {
      id: 'cli_cap_estresse_sono',
      label: '3. Você sente que estresse ou sono influenciam seu cabelo ou couro?',
      type: 'select',
      required: true,
      options: ['Sim, claramente', 'Um pouco', 'Não sei', 'Não'],
    },
    {
      id: 'cli_cap_sensibilidade_produtos',
      label: '3. O couro reage facilmente a perfumes fortes, tintas ou shampoos novos?',
      type: 'select',
      required: true,
      options: ['Sim', 'Às vezes', 'Não', 'Nunca reparei'],
    },
    {
      id: 'cli_cap_agua_ambiente',
      label: '3. Água dura, piscina, mar ou poluição — você sente que pioram o estado do cabelo/couro?',
      type: 'select',
      required: false,
      options: ['Sim', 'Um pouco', 'Não', 'Não aplicável'],
    },
    {
      id: 'cli_cap_mudanca_hormonal',
      label: '3. Mudança hormonal recente (ex.: pós-parto, contracepção, menopausa) que você associa ao cabelo?',
      type: 'select',
      required: false,
      options: ['Sim', 'Possivelmente', 'Não', 'Prefiro não responder'],
    },
    {
      id: 'cli_cap_objetivo_principal',
      label: '4. O que mais você gostaria de melhorar nos próximos meses?',
      type: 'select',
      required: true,
      options: [
        'Reduzir queda ou quebra',
        'Mais brilho e maciez',
        'Equilibrar oleosidade / caspa',
        'Fortalecer e “engrossar” o aspeto do fio',
        'Manutenção / prevenção',
        'Outro (explico na mensagem final)',
      ],
    },
    {
      id: 'cli_cap_interesse_protocolos',
      label: '4. Que tipos de protocolo te interessam explorar? (pode marcar vários)',
      type: 'checkbox_group',
      required: true,
      options: CLI_CAP_PROTOCOLOS_CHK,
    },
    {
      id: 'cli_cap_frequencia_clinica',
      label: '4. Com que frequência você conseguiria ir ao salão para acompanhamento?',
      type: 'select',
      required: true,
      options: [
        'Semanal',
        'Quinzenal',
        'Mensal',
        'Só quando der',
        'Quero só uma primeira avaliação por agora',
      ],
    },
    {
      id: 'cli_cap_contacto_preferido',
      label: '4. Você prefere ser contactada como?',
      type: 'select',
      required: true,
      options: ['WhatsApp', 'Ligação telefónica', 'Instagram', 'E-mail'],
    },
    {
      id: 'cli_cap_mensagem_livre',
      label: '4. Mensagem ou dúvida para a profissional (opcional)',
      type: 'textarea',
      required: false,
    },
  ]
}

export function getPreAvaliacaoCapilarClienteV1Description(): string {
  return [
    'Cerca de 5 minutos. Ajuda a cliente a refletir sobre couro, fios e rotina — antes de falar com você.',
    'Cada link fica associado à tua ficha no painel; não há entrada pública sem clínica.',
    'Resultado orientativo: a avaliação definitiva é sempre presencial.',
  ].join('\n')
}

export function getDiagnosticoTemplateDescription(templateKey: string | null | undefined): string | null {
  if (templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID) return getDiagnosticoCorporalV1Description()
  if (templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID) return getDiagnosticoCapilarV1Description()
  if (templateKey === TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID) return getPreDiagnosticoCorporalV1Description()
  if (templateKey === TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID) return getPreDiagnosticoCapilarV1Description()
  if (templateKey === TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID) return getPreAvaliacaoCapilarClienteV1Description()
  return null
}
