#!/usr/bin/env tsx
/**
 * Gera os 5 archetypes de diagnóstico via IA (executar UMA vez).
 * Armazena em ylada_diagnosis_archetypes.
 * Uso: npm run archetypes:gerar
 * Requer: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { config } from 'dotenv'
import { join } from 'path'
config({ path: join(process.cwd(), '.env.local') })

import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ARCHETYPE_CODES = [
  'leve',
  'moderado',
  'urgente',
  'bloqueio_pratico',
  'bloqueio_emocional',
] as const

const PROMPT = `Você gera conteúdo para diagnósticos de quiz (saúde, estética, nutrição, etc.).
O sistema usa 5 TIPOS de diagnóstico. Crie o conteúdo para cada um.
Use {THEME} como placeholder para o tema do quiz (ex: "sua pele", "energia", "intestino").
Use {NAME} como placeholder para o nome do profissional (ex: "aí", "Dr. João").

Para cada tipo, retorne um JSON com exatamente estes campos:
- profile_title: string (ex: "Seu resultado em {THEME}")
- profile_summary: string (leitura personalizada, 1-2 frases)
- main_blocker: string (diagnóstico em 1 frase)
- causa_provavel: string (opcional)
- preocupacoes: string (opcional)
- consequence: string
- growth_potential: string (providências)
- specific_actions: string[] (2-3 ações, use "Converse com {NAME}" na última)
- dica_rapida: string (opcional)
- frase_identificacao: string (opcional, "Se você se identificou...")
- cta_text: string (ex: "Clique para entender melhor seu caso")
- whatsapp_prefill: string (ex: "Oi {NAME}, fiz a análise de {THEME}...")

REGRAS:
- Linguagem acolhedora, nunca culpabilizante
- Nunca dar solução completa; sempre direcionar ao profissional
- Manter {THEME} e {NAME} nos textos onde fizer sentido
- Cada tipo tem tom diferente: leve=educativo, moderado=direcionador, urgente=firme, bloqueio_pratico=foco em rotina/hábitos, bloqueio_emocional=foco em emoções

Retorne um JSON no formato: { "archetypes": [ {...}, {...}, {...}, {...}, {...} ] }
Ordem do array: leve, moderado, urgente, bloqueio_pratico, bloqueio_emocional.`

async function main() {
  console.log('Gerando 5 archetypes via IA...')
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Você retorna apenas JSON válido, sem markdown.' },
      { role: 'user', content: PROMPT },
    ],
    response_format: { type: 'json_object' },
  })
  const text = res.choices[0]?.message?.content
  if (!text) throw new Error('Resposta vazia')
  const parsed = JSON.parse(text)
  const items: unknown[] = parsed.archetypes ?? parsed.items ?? (Array.isArray(parsed) ? parsed : [])
  if (!Array.isArray(items) || items.length < 5) {
    console.error('Formato inesperado:', JSON.stringify(parsed).slice(0, 500))
    throw new Error('Resposta não contém 5 archetypes')
  }
  for (let i = 0; i < 5; i++) {
    const code = ARCHETYPE_CODES[i]
    const content = items[i]
    const { error } = await supabase.from('ylada_diagnosis_archetypes').upsert(
      {
        archetype_code: code,
        segment_code: 'geral',
        content_json: {
          profile_title: content.profile_title ?? `Seu resultado`,
          profile_summary: content.profile_summary ?? '',
          main_blocker: content.main_blocker ?? '',
          causa_provavel: content.causa_provavel,
          preocupacoes: content.preocupacoes,
          consequence: content.consequence ?? '',
          growth_potential: content.growth_potential ?? '',
          specific_actions: content.specific_actions ?? [],
          dica_rapida: content.dica_rapida,
          frase_identificacao: content.frase_identificacao,
          cta_text: content.cta_text ?? 'Clique para entender melhor',
          whatsapp_prefill: content.whatsapp_prefill ?? '',
        },
      },
      { onConflict: 'archetype_code,segment_code' }
    )
    if (error) {
      console.error(`Erro ao salvar ${code}:`, error)
    } else {
      console.log(`✓ ${code} salvo`)
    }
  }
  console.log('Concluído.')
}

main().catch(console.error)
