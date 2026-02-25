/**
 * NOEL YLADA - API por segmento (ylada, psi, odonto, nutra, coach, seller).
 * POST /api/ylada/noel
 * Body: { message, conversationHistory?, segment?, area? }
 * Injeta no system prompt: contexto + perfil (ylada_noel_profile) + snapshot da trilha.
 * Quando o profissional pede link/quiz/calculadora: interpret + generate e entrega o link na resposta.
 * @see docs/MATRIZ-CENTRAL-CRONOGRAMA.md
 * @see docs/ANALISE-LINKS-BRIEF-POR-PERFIL-E-PROXIMOS-PASSOS.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'
import { supabaseAdmin } from '@/lib/supabase'
import { buildProfileResumo, type YladaNoelProfileRow } from '@/lib/ylada-profile-resumo'
import { getNoelYladaLinks, formatLinksAtivosParaNoel } from '@/lib/noel-ylada-links'
import { getPerfilSimuladoByKey, SIMULATE_COOKIE_NAME } from '@/data/perfis-simulados'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/** Detecta se a mensagem indica pedido de link / quiz / calculadora / ferramenta para engajar. */
function isIntencaoCriarLink(message: string): boolean {
  const m = message.toLowerCase().trim()
  const termos = [
    'quero um link', 'quero uma calculadora', 'quero um quiz', 'quero uma ferramenta',
    'preciso de um link', 'preciso de uma calculadora', 'preciso de um quiz', 'preciso de uma ferramenta',
    'criar um link', 'criar uma calculadora', 'criar um quiz', 'gerar um link', 'gerar um quiz',
    'ferramenta para', 'link para', 'quiz para', 'calculadora para',
    'atrair pacientes', 'atrair clientes', 'conteúdo para o paciente', 'tema da minha especialidade',
    'qualificar quem quer agendar', 'quanto está deixando de faturar', 'mostrar valor',
    'para engajar', 'para captar', 'para meus clientes', 'para meus pacientes',
    'despertar curiosidade', 'link que atrai',
  ]
  return termos.some((t) => m.includes(t))
}

const SEGMENT_CONTEXT: Record<string, string> = {
  ylada: 'Você é o Noel, mentor da YLADA (motor de conversas). Oriente qualquer profissional ou vendedor sobre rotina, links inteligentes, trilha empresarial e geração de conversas qualificadas no WhatsApp. Tom direto e prático.',
  psi: 'Você é o Noel, mentor da YLADA para a área de Psicologia. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  psicanalise: 'Você é o Noel, mentor da YLADA para a área de Psicanálise. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  odonto: 'Você é o Noel, mentor da YLADA para a área de Odontologia. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  nutra: 'Você é o Noel, mentor da YLADA para a área Nutra (vendedores de suplementos). Oriente sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  coach: 'Você é o Noel, mentor da YLADA para a área de Coach. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json()
    const { message, conversationHistory = [], segment, area = 'ylada' } = body as {
      message?: string
      conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
      segment?: string
      area?: string
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Mensagem é obrigatória.' }, { status: 400 })
    }

    const segmentKey = (segment ?? area) as string
    const validSegment = YLADA_SEGMENT_CODES.includes(segmentKey as any) ? segmentKey : 'ylada'

    // Buscar perfil e snapshot da trilha para personalizar o Noel (etapa 2.4)
    let profileResumo = ''
    let snapshotText = ''
    let profileRow: YladaNoelProfileRow | null = null
    const simulateKey = request.cookies.get(SIMULATE_COOKIE_NAME)?.value?.trim()
    if (simulateKey) {
      const fixture = getPerfilSimuladoByKey(simulateKey)
      if (fixture && fixture.segment === validSegment) {
        profileRow = fixture
        profileResumo = buildProfileResumo(fixture)
      }
    }
    if (!profileRow && supabaseAdmin) {
      const [profileRes, snapshotRes] = await Promise.all([
        supabaseAdmin
          .from('ylada_noel_profile')
          .select('*')
          .eq('user_id', user.id)
          .eq('segment', validSegment)
          .maybeSingle(),
        supabaseAdmin
          .from('user_strategy_snapshot')
          .select('snapshot_text')
          .eq('user_id', user.id)
          .maybeSingle(),
      ])
      profileRow = profileRes.data as YladaNoelProfileRow | null
      profileResumo = buildProfileResumo(profileRow)
      const snap = snapshotRes.data as { snapshot_text?: string | null } | null
      snapshotText = snap?.snapshot_text?.trim() ?? ''
    }

    const baseUrl = typeof request.url === 'string' ? new URL(request.url).origin : (process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app')
    const linksAtivos = await getNoelYladaLinks(user.id, baseUrl)
    const linksAtivosBlock = formatLinksAtivosParaNoel(linksAtivos)

    // Se o profissional pediu link/quiz/calculadora: verificar perfil; se tiver, interpret + generate
    let linkGeradoBlock = ''
    if (isIntencaoCriarLink(message)) {
      const temPerfil = profileRow && (profileRow.profile_type || profileRow.profession)
      if (!temPerfil) {
        linkGeradoBlock = '\n[AVISO: SEM PERFIL]\nO profissional pediu um link/quiz/calculadora mas ainda não preencheu o perfil empresarial (tipo de atuação e área). NÃO gere link. Responda de forma amigável que ele precisa completar o perfil em "Perfil empresarial" primeiro (menu ao lado) para você poder recomendar o link mais adequado ao tipo de atuação dele. Diga que em um minuto ele preenche e aí você consegue criar o link certo.'
      } else {
        try {
          const cookie = request.headers.get('cookie') || ''
          const interpretRes = await fetch(`${baseUrl}/api/ylada/interpret`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', cookie },
            body: JSON.stringify({
              text: message.trim(),
              segment: validSegment,
              profile_type: profileRow?.profile_type ?? undefined,
              profession: profileRow?.profession ?? undefined,
            }),
          })
          const interpretJson = await interpretRes.json().catch(() => ({}))
          const data = interpretJson?.data
          const templateId = data?.recommendedTemplateId
          const confidence = typeof data?.confidence === 'number' ? data.confidence : 0
          if (templateId && confidence >= 0.5) {
            const genRes = await fetch(`${baseUrl}/api/ylada/links/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', cookie },
              body: JSON.stringify({ template_id: templateId, segment: validSegment }),
            })
            const genJson = await genRes.json().catch(() => ({}))
            if (genJson?.success && genJson?.data?.url) {
              const title = genJson.data.title || genJson.data.slug || 'Link'
              linkGeradoBlock = `\n[LINK GERADO AGORA PARA ESTE PEDIDO]\nO sistema acabou de criar um link para o profissional. Inclua na sua resposta o link em markdown exatamente assim: [${title}](${genJson.data.url})\nDiga que você criou esse link para ele e que ele pode copiar e compartilhar. Se for quiz, diga que o visitante responde e vê um diagnóstico; se for calculadora, que preenche e vê o resultado.`
            }
          }
        } catch (e) {
          console.warn('[/api/ylada/noel] interpret/generate:', e)
        }
      }
    }

    const baseSystem = SEGMENT_CONTEXT[validSegment] ||
      'Você é o Noel, mentor da YLADA. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.'
    const parts: string[] = [baseSystem]
    if (profileResumo) {
      parts.push('\n[PERFIL DO PROFISSIONAL]\n' + profileResumo)
    } else {
      parts.push('\nO profissional ainda não preencheu o perfil empresarial. Oriente de forma útil e, se fizer sentido, sugira completar o perfil em "Perfil empresarial" para orientações mais personalizadas.')
    }
    if (snapshotText) {
      parts.push('\n[RESUMO ESTRATÉGICO DA TRILHA — situação atual e próximos passos]\n' + snapshotText)
    }
    if (linksAtivosBlock) parts.push(linksAtivosBlock)
    if (linkGeradoBlock) parts.push(linkGeradoBlock)
    const systemContent = parts.join('')

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      ...conversationHistory.slice(-12).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message.trim() },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    })

    const responseText =
      completion.choices[0]?.message?.content?.trim() ||
      'Desculpe, não consegui processar. Tente novamente.'

    return NextResponse.json({
      response: responseText,
      segment: validSegment,
      area: validSegment,
    })
  } catch (error: unknown) {
    console.error('[/api/ylada/noel]', error)
    const message = error instanceof Error ? error.message : 'Erro ao processar mensagem.'
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error && message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}
