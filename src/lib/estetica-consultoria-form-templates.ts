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
  if (ph) initialAnswers.whatsapp = ph
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
    {
      id: 'whatsapp',
      label: '1. WhatsApp (com DDD)',
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
    {
      id: 'whatsapp',
      label: '1. WhatsApp (com DDD)',
      type: 'text',
      required: true,
    },
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
    {
      id: 'whatsapp',
      label: '1. WhatsApp (com DDD)',
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
    {
      id: 'whatsapp',
      label: '1. WhatsApp (com DDD)',
      type: 'text',
      required: true,
    },
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

export function getDiagnosticoTemplateDescription(templateKey: string | null | undefined): string | null {
  if (templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID) return getDiagnosticoCorporalV1Description()
  if (templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID) return getDiagnosticoCapilarV1Description()
  if (templateKey === TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID) return getPreDiagnosticoCorporalV1Description()
  if (templateKey === TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID) return getPreDiagnosticoCapilarV1Description()
  return null
}
