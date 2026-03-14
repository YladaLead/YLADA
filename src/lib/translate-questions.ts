/**
 * Traduz perguntas (labels e options) para o idioma solicitado.
 * Usado no generate quando locale é en/es e as perguntas vêm do catálogo.
 */
import OpenAI from 'openai'

export type FormField = { id: string; label: string; type?: string; options?: string[] }

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function translateQuestions(
  fields: FormField[],
  locale: 'en' | 'es'
): Promise<FormField[]> {
  if (fields.length === 0) return fields

  const lang = locale === 'en' ? 'English' : 'Spanish'
  const prompt = `Translate this quiz form to ${lang}. Preserve the structure. Return a JSON array with the same length. Each object: { "id": "...", "label": "translated label", "type": "single", "options": ["opt1", "opt2", ...] }. Translate labels and options only. Return ONLY valid JSON array.

${JSON.stringify(fields)}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.3,
    })
    const raw = completion.choices[0]?.message?.content?.trim()
    if (!raw) return fields
    const cleaned = raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(cleaned) as FormField[]
    if (Array.isArray(parsed) && parsed.length === fields.length) {
      return parsed.map((p, i) => ({
        id: fields[i].id,
        label: p.label ?? fields[i].label,
        type: p.type ?? fields[i].type ?? 'single',
        options: Array.isArray(p.options) ? p.options : fields[i].options,
      }))
    }
  } catch (e) {
    console.warn('[translateQuestions]', e)
  }
  return fields
}
