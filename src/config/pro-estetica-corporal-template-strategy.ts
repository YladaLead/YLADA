/**
 * Pro Estética Corporal — reuso de templates (sem duplicar UI)
 *
 * **Não** criar cópias de calculadoras/quizzes dentro de `/pro-estetica-corporal/`.
 * O painel de estética já usa a mesma mecânica que Pro Líderes:
 * - `buildProLideresCatalog` + links YLADA (`ylada_link_templates` / eventos)
 * - entradas em `leader_tenant_flow_entries` com `href` → `/l/...` ou URL pública
 * - API `/api/pro-estetica-corporal/flows` — paralela ao Pro Líderes, só muda o tenant vertical
 *
 * **Fluxo duplicável:**
 * 1. Um template existe **uma vez** (Wellness + `template-slug-map.ts` + diagnósticos em `lib/diagnostics/wellness`).
 * 2. O profissional **gera o link** “Meus links” → passa a ter um `/l/<código>` (ou rota pública do template).
 * 3. No catálogo Pro Estética, **fixa** esse link na categoria certa (captar / retencao / acompanhar) — é só referência, sem fork de código.
 * 4. O que é específico de estética sem duplicar UI: textos em `pro-estetica-corporal-jornada.ts`, Noel com contexto do tenant,
 *    e um atalho em `pro-estetica-corporal-preset-catalog.ts` para `/pro-estetica-corporal/painel/biblioteca-links` (área Estética, sem /pt/wellness nem /pt/links).
 *
 * Novos templates globais: continuam a nascer no ecossistema YLADA (um sítio); Estética e
 * outras verticais apenas **recomendam** e **ligam** via catálogo.
 */

/** Slugs canónicos (após normalização) para documentação e presets — ver `template-slug-map.ts`. */
/** Alinhado à biblioteca Pro Estética Corporal (`TEMPLATE_IDS_BIBLIOTECA_ESTETICA_CORPORAL_PERMITIDOS`). */
export const PRO_ESTETICA_RECOMMENDED_CANONICAL_SLUGS = [
  'calc-calorias',
  'calc-hidratacao',
  'calc-proteina',
  'calc-imc',
] as const

export type ProEsteticaRecommendedCanonicalSlug = (typeof PRO_ESTETICA_RECOMMENDED_CANONICAL_SLUGS)[number]
