/**
 * Contrato dos pacotes em `public.ylada_flow_diagnosis_outcomes` para links **Pro Líderes**
 * (`architecture = 'RISK_DIAGNOSIS'`, `diagnosis_vertical IS NULL`, `flow_id` = preset / espelho).
 *
 * A UI do link público (`PublicLinkView` → `DiagnosisResultState`) já consome estas chaves.
 * Use este ficheiro como **referência única** ao:
 * - escrever migrações SQL (`content_json`);
 * - gerar conteúdo com Noel / IA (few-shots + regras anti-duplicação);
 * - rever copy por `flow_id` × `archetype_code` (leve | moderado | urgente).
 *
 * **Papéis editoriais (pt-BR, visitante):**
 * 1. **Espelho** — `profile_title` (+ opcional `espelho_comportamental`): “foi sobre mim”, sem rótulo vazio.
 * 2. **Leitura** — `profile_summary` visível; no “Ver mais”: `frase_identificacao`, `causa_provavel`, `preocupacoes`, `main_blocker`, `consequence` (cada um = **uma ideia**, sem repetir a mesma frase).
 * 3. **Convite** — `growth_potential`, `dica_rapida`, `specific_actions` (lista ou parágrafo), `cta_text`, `whatsapp_prefill`.
 *
 * **Regras de ouro**
 * - Não duplicar `consequence` com `profile_summary` ou com `main_blocker`.
 * - Sem promessa de ganho, sem diagnóstico médico, sem pressão agressiva.
 * - Próximo passo sempre ancorado em **conversar com quem enviou o link**.
 *
 * **Funil e tom (meta do link)**
 * - `pro_lideres_kind`: `sales` → vendas wellness (hábito/corpo); `recruitment` → oportunidade/conversa (sem jargão clínico de metabolismo).
 * - Tom padrão visitante: **PT-BR simples** — frases curtas, concreto, evitar “consultorese” (ex.: sprint, descompasso, conversa guiada como produto).
 * - Pós-processo na API (`normalizeDiagnosisDecisionForVisitor` + cache v23) alinha textos antigos; migrações devem gravar copy já revisada por fluxo.
 */

/** Chaves que `PublicLinkView` trata como diagnóstico empacotado (alinhado a `DiagnosisResultState`). */
export type ProLideresPackagedDiagnosisContent = {
  profile_title: string
  profile_summary: string
  main_blocker: string
  consequence: string
  growth_potential: string
  cta_text: string
  whatsapp_prefill: string
  frase_identificacao?: string
  causa_provavel?: string
  preocupacoes?: string
  espelho_comportamental?: string
  dica_rapida?: string
  specific_actions?: string[]
}

/** Ordem sugerida de revisão / geração (não altera runtime da UI). */
export const PRO_LIDERES_PACKAGED_DIAGNOSIS_KEYS_ORDERED = [
  'profile_title',
  'profile_summary',
  'frase_identificacao',
  'espelho_comportamental',
  'main_blocker',
  'causa_provavel',
  'preocupacoes',
  'consequence',
  'growth_potential',
  'dica_rapida',
  'specific_actions',
  'cta_text',
  'whatsapp_prefill',
] as const satisfies ReadonlyArray<keyof ProLideresPackagedDiagnosisContent>

const REQUIRED: (keyof ProLideresPackagedDiagnosisContent)[] = [
  'profile_title',
  'profile_summary',
  'main_blocker',
  'consequence',
  'growth_potential',
  'cta_text',
  'whatsapp_prefill',
]

/** Texto curto para colar em prompts (Noel / revisão humana). */
export function getProLideresPackagedDiagnosisSchemaPromptBlock(): string {
  return [
    'JSON content_json (Pro Líderes, RISK_DIAGNOSIS, diagnosis_vertical null):',
    '- Obrigatórios: profile_title, profile_summary, main_blocker, consequence, growth_potential, cta_text, whatsapp_prefill.',
    '- Opcionais (preencher quando fizer sentido, sem repetir ideias): frase_identificacao, espelho_comportamental, causa_provavel, preocupacoes, dica_rapida, specific_actions (array de strings curtas).',
    '- Regras: uma ideia por campo; português do Brasil; tom recrutamento = oportunidade/conversa; tom vendas = hábito/bem-estar; sem promessa de renda nem diagnóstico médico; CTA convida a falar com quem enviou o link.',
  ].join('\n')
}

export function getMissingProLideresPackagedDiagnosisKeys(
  content: Record<string, unknown>
): (keyof ProLideresPackagedDiagnosisContent)[] {
  return REQUIRED.filter((k) => {
    const v = content[k]
    return typeof v !== 'string' || String(v).trim().length === 0
  })
}
