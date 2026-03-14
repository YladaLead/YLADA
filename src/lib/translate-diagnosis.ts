/**
 * Traduz o objeto de diagnóstico para o idioma solicitado.
 * Usado quando o visitante acessa /en/l/[slug] ou /es/l/[slug].
 */
import OpenAI from 'openai'

type DiagnosisPayload = Record<string, unknown>

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function translateDiagnosis(
  diagnosis: DiagnosisPayload,
  locale: 'en' | 'es'
): Promise<DiagnosisPayload> {
  const lang = locale === 'en' ? 'English' : 'Spanish'

  const prompt = `Translate this diagnosis to ${lang}. Preserve the professional, empathetic tone. Return a JSON object with the same structure. Translate only string values and array elements. Return ONLY valid JSON.

${JSON.stringify(diagnosis)}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.3,
    })
    const raw = completion.choices[0]?.message?.content?.trim()
    if (!raw) return diagnosis
    const cleaned = raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(cleaned) as DiagnosisPayload
    return { ...diagnosis, ...parsed }
  } catch (e) {
    console.warn('[translateDiagnosis]', e)
    return diagnosis
  }
}
