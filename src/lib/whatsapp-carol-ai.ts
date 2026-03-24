/**
 * Carol — automação WhatsApp (Z-API) para Nutri/workshop: disparos, links, remarketing, suporte pós-pagamento.
 * A parte de **resposta automática com OpenAI** pode ser desligada em `src/config/carol-ai.ts` (CAROL_AI_DISABLED).
 */

import { CAROL_AI_DISABLED } from '@/config/carol-ai'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import type OpenAI from 'openai'
import { getOpenAI } from '@/lib/openai-singleton'
import { applyTemplate, getFlowTemplate } from '@/lib/whatsapp-flow-templates'

const WHATSAPP_NUMBER = '5519997230912' // Número principal

/** Delay entre cada envio em disparos em massa (ms). Evita mensagens chegando uma em cima da outra e reduz risco de a Meta/WhatsApp derrubar o número. */
const BULK_SEND_DELAY_MS = 15000
/** A cada N envios bem-sucedidos, pausa entre blocos para não sobrecarregar. */
const BULK_SEND_BLOCK_SIZE = 5
/** Pausa entre blocos (ms). Pausa maior reduz chance de bloqueio pela Meta. */
const BULK_SEND_PAUSE_BETWEEN_BLOCKS_MS = 90000

/**
 * Aplica delay pós-envio e pausa entre blocos em disparos em massa.
 * Chamar após cada envio bem-sucedido, passando o total de enviados até então.
 * Exportado para uso em process-all e worker (evitar rajada que a Meta detecta).
 */
export async function bulkSendDelay(sentSoFar: number): Promise<void> {
  await new Promise((r) => setTimeout(r, BULK_SEND_DELAY_MS))
  if (sentSoFar > 0 && sentSoFar % BULK_SEND_BLOCK_SIZE === 0) {
    console.log(`[Carol] 📦 Bloco de ${BULK_SEND_BLOCK_SIZE} envios concluído; pausa de ${BULK_SEND_PAUSE_BETWEEN_BLOCKS_MS / 1000}s antes do próximo`)
    await new Promise((r) => setTimeout(r, BULK_SEND_PAUSE_BETWEEN_BLOCKS_MS))
  }
}

/**
 * Verifica se o admin pediu para parar o disparo em massa (botão "Parar disparo").
 * Usado no loop de remarketing, welcome e reminders.
 */
export async function checkDisparoAbort(tipo: 'remarketing' | 'welcome' | 'reminders' | 'remarketing_hoje_20h'): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('whatsapp_disparo_abort')
    .select('requested_at')
    .eq('tipo', tipo)
    .maybeSingle()
  return !!data?.requested_at
}

/**
 * Limpa o sinal de abort para um tipo (chamado no início e no fim do disparo).
 */
export async function clearDisparoAbort(tipo: 'remarketing' | 'welcome' | 'reminders' | 'remarketing_hoje_20h'): Promise<void> {
  await supabaseAdmin.from('whatsapp_disparo_abort').delete().eq('tipo', tipo)
}

/**
 * Sinaliza que o admin pediu para parar o disparo (botão "Parar disparo").
 */
export async function requestDisparoAbort(tipo: 'remarketing' | 'welcome' | 'reminders' | 'remarketing_hoje_20h'): Promise<void> {
  await supabaseAdmin
    .from('whatsapp_disparo_abort')
    .upsert({ tipo, requested_at: new Date().toISOString() }, { onConflict: 'tipo' })
}

/**
 * Verifica se está em horário permitido para enviar mensagens automáticas
 * Regras:
 * - Segunda a sexta: 8h00 às 19h00 (horário de Brasília)
 * - Sábado: até 13h00
 * - Domingo: não enviar (exceto lembretes específicos)
 */
export function isAllowedTimeToSendMessage(): { allowed: boolean; reason?: string; nextAllowedTime?: Date } {
  const now = new Date()
  
  // Converter para horário de Brasília
  const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  const hour = brasiliaTime.getHours()
  const dayOfWeek = brasiliaTime.getDay() // 0 = domingo, 1 = segunda, ..., 6 = sábado
  
  // Domingo: não permitir (exceto lembretes específicos)
  if (dayOfWeek === 0) {
    const nextMonday = new Date(brasiliaTime)
    nextMonday.setDate(brasiliaTime.getDate() + 1) // Próxima segunda
    nextMonday.setHours(8, 0, 0, 0) // 8h00
    return { 
      allowed: false, 
      reason: 'Domingo - mensagens automáticas não são enviadas',
      nextAllowedTime: nextMonday
    }
  }
  
  // Sábado: até 13h00
  if (dayOfWeek === 6) {
    if (hour < 8) {
      const saturday8am = new Date(brasiliaTime)
      saturday8am.setHours(8, 0, 0, 0)
      return { 
        allowed: false, 
        reason: 'Antes das 8h00 - aguarde até 8h00',
        nextAllowedTime: saturday8am
      }
    }
    if (hour >= 13) {
      const nextMonday = new Date(brasiliaTime)
      nextMonday.setDate(brasiliaTime.getDate() + 2) // Próxima segunda (pula domingo)
      nextMonday.setHours(8, 0, 0, 0) // 8h00
      return { 
        allowed: false, 
        reason: 'Sábado após 13h00 - aguarde até segunda-feira 8h00',
        nextAllowedTime: nextMonday
      }
    }
    return { allowed: true }
  }
  
  // Segunda a sexta: 8h00 às 19h00
  if (hour < 8) {
    const today8am = new Date(brasiliaTime)
    today8am.setHours(8, 0, 0, 0)
    return { 
      allowed: false, 
      reason: 'Antes das 8h00 - aguarde até 8h00',
      nextAllowedTime: today8am
    }
  }
  
  if (hour >= 19) {
    const tomorrow8am = new Date(brasiliaTime)
    tomorrow8am.setDate(brasiliaTime.getDate() + 1)
    tomorrow8am.setHours(8, 0, 0, 0)
    
    // Se for sexta após 19h, próxima segunda
    if (dayOfWeek === 5) {
      tomorrow8am.setDate(brasiliaTime.getDate() + 3) // Pula sábado e domingo
    }
    
    return { 
      allowed: false, 
      reason: 'Após 19h00 - aguarde até próximo horário permitido',
      nextAllowedTime: tomorrow8am
    }
  }
  
  return { allowed: true }
}

/**
 * Extrai primeiro nome para a Carol usar ao chamar a pessoa.
 * - "Maria Silva" → "Maria"
 * - "Dr. Maria Silva" → "Dr. Maria" (mantém Dr. + primeiro nome)
 * - "Doutora Ana Paula" → "Doutora Ana"
 * - "Dra. Carlos" → "Dra. Carlos"
 */
export function getFirstName(fullName: string | null | undefined): string {
  if (!fullName || typeof fullName !== 'string') return ''
  const trimmed = fullName.trim()
  if (!trimmed) return ''
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return trimmed
  const primeira = parts[0]
  const tituloLower = primeira.toLowerCase().replace(/\.$/, '')
  const ehTitulo = ['dr', 'dra', 'doutor', 'doutora'].includes(tituloLower)
  if (ehTitulo && parts.length > 1) {
    return (primeira + ' ' + parts[1]).trim()
  }
  return primeira
}

function buildWorkshopOptionsText(
  sessions: Array<{ starts_at: string }>,
  mode: 'plain' | 'bold' = 'plain'
): string {
  if (!sessions || sessions.length === 0) return ''
  const header = mode === 'bold' ? '🗓️ *Opções de Aula Disponíveis:*\n\n' : '🗓️ Opções de Aula Disponíveis:\n\n'
  let out = header
  sessions.forEach((session, index) => {
    const { weekday, date, time } = formatSessionDateTime(session.starts_at)
    if (mode === 'bold') {
      out += `*Opção ${index + 1}:*\n${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n`
    } else {
      out += `Opção ${index + 1}:\n${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n`
    }
  })
  out += mode === 'bold' ? '💬 *Qual você prefere?* 😊' : '💬 Qual você prefere? 😊'
  return out.trim()
}

function isLikelyPersonName(name: string | null | undefined): boolean {
  if (!name || typeof name !== 'string') return false
  const s = name.trim()
  if (!s) return false
  if (s.length < 3) return false
  if (/^\d+$/.test(s)) return false
  const lower = s.toLowerCase()
  // evita termos comuns de marca/empresa
  const bad = ['nutri', 'nutric', 'clini', 'clín', 'clin', 'saude', 'saúde', 'studio', 'consult', 'oficial']
  if (bad.some((k) => lower.includes(k))) return false
  if (isBusinessName(s)) return false
  // nomes de pessoa geralmente têm pelo menos 2 palavras ou não são tudo maiúsculo
  const hasSpace = /\s/.test(s)
  const isAllCaps = s.length >= 6 && s === s.toUpperCase()
  return hasSpace || !isAllCaps
}

/** Texto fixo da próxima aula para área nutri: uma data só (próxima quarta 20h), para quem ainda não participou. */
const NUTRI_PROXIMA_AULA_FIXA =
  'A próxima aula será na **próxima quarta-feira às 20h** (horário de Brasília). Te mando o link por aqui antes da aula. Qualquer dúvida, é só me chamar! 😊'

async function buildFirstMessageOptionsBody(
  area: string,
  leadName: string,
  sessions: Array<{ starts_at: string }>
): Promise<string> {
  // Esta mensagem é enviada após a saudação curta já ter sido enviada em separado.
  // Portanto, NÃO começa com "Oi" nem repete "Sou a Carol".
  // Nutri: uma data fixa (próxima quarta 20h) para quem ainda não participou — sem opções 1/2.
  const { getFlowTemplate, applyTemplate } = await import('@/lib/whatsapp-flow-templates')
  const baseTemplate =
    (await getFlowTemplate(area || 'nutri', 'welcome_form_body')) ||
    'A próxima aula é prática e vai te ajudar a ter mais constância pra preencher sua agenda.\n\n[OPÇÕES inseridas automaticamente]'

  const isNutriSingleDate = (area || '') === 'nutri'
  const optText = isNutriSingleDate
    ? NUTRI_PROXIMA_AULA_FIXA
    : buildWorkshopOptionsText(sessions, 'bold')
        .replace(/\n?💬[\s\S]*$/m, '')
        .trim()

  let body = applyTemplate(baseTemplate, { nome: leadName })
    .replace(/\[OPÇÕES inseridas automaticamente\]/gi, `${optText}\n`)
    .replace(/\{\{opcoes\}\}/gi, `${optText}\n`)
    .trim()

  // Nutri: não pedir "Responde 1 ou 2" (só uma data). Outras áreas mantêm CTA 1/2.
  if (!isNutriSingleDate && !/responde\s*1\s*ou\s*2/i.test(body)) {
    body = `${body}\n\nResponde 1 ou 2 😊`
  }
  return body
}

/**
 * Verifica se o texto é nome da empresa e NUNCA deve ser usado como nome da pessoa.
 * Evita que a Carol chame o lead de "Ylada" quando o payload/conversa traz o nome do negócio.
 */
function isBusinessName(name: string | null | undefined): boolean {
  if (!name || typeof name !== 'string') return false
  const s = name.trim().toLowerCase()
  if (!s) return false
  return (
    s === 'ylada' ||
    s.startsWith('ylada nutri') ||
    s === 'ylada nutri' ||
    /^ylada\s*nutri$/i.test(s) ||
    (s.includes('ylada') && s.length <= 15)
  )
}

/**
 * Verifica se o texto NUNCA deve ser usado como nome da pessoa.
 * Inclui: nomes da equipe (Nutri, Inge), notas internas (remarketing, "lá no..."),
 * display_name/editado pela nutri que não é nome de cadastro.
 * O nome da pessoa deve vir EXCLUSIVAMENTE do cadastro (workshop_inscricoes/contact_submissions).
 */
function isInvalidOrInternalName(name: string | null | undefined): boolean {
  if (!name || typeof name !== 'string') return true
  const s = name.trim()
  if (!s) return true
  const lower = s.toLowerCase()
  if (isBusinessName(s)) return true
  // Nomes/termos que são da equipe ou contexto, NUNCA nome do lead
  const invalidTerms = [
    'nutri',           // "Nutri" sozinho ou em frase
    'inge',            // Nome de pessoa da equipe (ex.: "Lá no remarketing Inge")
    'remarketing',     // Nota interna
    'ylada',
    'equipe', 'secretária', 'secretaria', 'atendimento',
    'lá',               // "Lá" como primeiro nome (ex.: "Lá no remarketing Inge")
  ]
  const firstWord = lower.split(/\s+/)[0] || lower
  if (invalidTerms.includes(firstWord) || invalidTerms.some((t) => lower.includes(t))) return true
  if (s.length <= 2 && !/^[a-zà-ú]+$/i.test(s)) return true
  return false
}

/**
 * Busca nome do cadastro (workshop_inscricoes ou contact_submissions)
 * Prioriza workshop_inscricoes sobre contact_submissions
 * Retorna null se não encontrar (não retorna nome do WhatsApp)
 */
export async function getRegistrationName(
  phone: string,
  area: string = 'nutri'
): Promise<string | null> {
  try {
    const phoneClean = phone.replace(/\D/g, '')

    // Gerar candidatos (com/sem 55; com/sem 9) e sufixos para bater com formatos variados no banco.
    const cand = new Set<string>()
    if (phoneClean) cand.add(phoneClean)
    if (phoneClean.startsWith('0')) cand.add(phoneClean.slice(1))
    if (!phoneClean.startsWith('55') && (phoneClean.length === 10 || phoneClean.length === 11)) cand.add(`55${phoneClean}`)
    if (phoneClean.startsWith('55') && (phoneClean.length === 12 || phoneClean.length === 13)) cand.add(phoneClean.slice(2))
    // com/sem 9 (celular BR)
    if (phoneClean.startsWith('55') && phoneClean.length === 13) cand.add(phoneClean.slice(0, 4) + phoneClean.slice(5)) // 55DD9XXXXXXXX -> 55DDXXXXXXXX
    if (phoneClean.startsWith('55') && phoneClean.length === 12) cand.add(phoneClean.slice(0, 4) + '9' + phoneClean.slice(4)) // 55DDXXXXXXXX -> 55DD9XXXXXXXX
    if (!phoneClean.startsWith('55') && phoneClean.length === 11) cand.add(phoneClean.slice(0, 2) + phoneClean.slice(3)) // DD9XXXXXXXX -> DDXXXXXXXX
    if (!phoneClean.startsWith('55') && phoneClean.length === 10) cand.add(phoneClean.slice(0, 2) + '9' + phoneClean.slice(2)) // DDXXXXXXXX -> DD9XXXXXXXX

    const suffixes = new Set<string>()
    for (const c of cand) {
      const d = String(c || '').replace(/\D/g, '')
      for (const len of [11, 10, 9, 8, 7, 6]) {
        if (d.length >= len) suffixes.add(d.slice(-len))
      }
    }

    const suffixList = Array.from(suffixes).filter(Boolean)
    const workshopOr =
      suffixList.length > 0
        ? suffixList.map((s) => `telefone.ilike.%${s}%`).join(',')
        : `telefone.ilike.%${phoneClean.slice(-8)}%`

    // 1. Tentar buscar de workshop_inscricoes primeiro (prioridade)
    const { data: workshopReg } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('nome')
      .or(workshopOr)
      .limit(1)
      .maybeSingle()
    
    if (workshopReg?.nome) {
      return workshopReg.nome
    }
    
    // 2. Fallback para contact_submissions (apenas se não encontrou em workshop_inscricoes)
    const contactOr =
      suffixList.length > 0
        ? suffixList.map((s) => `phone.ilike.%${s}%,telefone.ilike.%${s}%`).join(',')
        : `phone.ilike.%${phoneClean.slice(-8)}%,telefone.ilike.%${phoneClean.slice(-8)}%`
    const { data: contactReg } = await supabaseAdmin
      .from('contact_submissions')
      .select('name, nome')
      .or(contactOr)
      .limit(1)
      .maybeSingle()
    
    if (contactReg?.name || contactReg?.nome) {
      return contactReg.name || contactReg.nome || null
    }
    
    return null
  } catch (error: any) {
    console.warn('[Carol] Erro ao buscar nome do cadastro:', error.message)
    return null
  }
}

/** Nomes comuns masculinos (primeiro nome) para saudação "bem-vindo" vs "bem-vinda" */
const MALE_FIRST_NAMES = new Set([
  'adriano', 'alexandre', 'anderson', 'andre', 'antonio', 'bruno', 'carlos', 'daniel', 'danilo',
  'eduardo', 'fabio', 'felipe', 'fernando', 'gabriel', 'guilherme', 'gustavo', 'henrique', 'joao',
  'jose', 'julio', 'leonardo', 'lucas', 'luiz', 'marcelo', 'marcio', 'marco', 'marcos', 'mateus',
  'mauricio', 'michel', 'miguel', 'paulo', 'pedro', 'rafael', 'renato', 'ricardo', 'roberto',
  'rodrigo', 'thiago', 'vinicius', 'wagner', 'william', 'wilson',
])
/** Nomes comuns femininos (primeiro nome) */
const FEMALE_FIRST_NAMES = new Set([
  'adriana', 'alessandra', 'amanda', 'ana', 'andreia', 'beatriz', 'bruna', 'camila', 'carla',
  'carolina', 'celia', 'claudia', 'cristina', 'daniela', 'eliane', 'fabiana', 'fernanda', 'gabriela',
  'glaucia', 'helena', 'ingrid', 'juliana', 'larissa', 'leticia', 'luciana', 'marcia', 'maria',
  'mariana', 'michelle', 'patricia', 'paula', 'rafaela', 'renata', 'sandra', 'simone', 'tatiana',
  'vanessa', 'vivian',
])

/**
 * Retorna 'm' se o primeiro nome for tipicamente masculino, 'f' se feminino, null se indefinido.
 * Usado para saudação "Seja muito bem-vindo" vs "Seja muito bem-vinda".
 */
function guessGenderFromFirstName(firstName: string | null | undefined): 'm' | 'f' | null {
  if (!firstName || typeof firstName !== 'string') return null
  const first = firstName.trim().toLowerCase().split(/\s+/)[0] || ''
  if (!first) return null
  if (MALE_FIRST_NAMES.has(first)) return 'm'
  if (FEMALE_FIRST_NAMES.has(first)) return 'f'
  return null
}

/**
 * Ajusta a saudação "bem-vinda" / "bem-vindo" conforme o gênero do nome (quando conhecido).
 */
function applyWelcomeGender(greeting: string, firstName: string | null | undefined): string {
  const gender = guessGenderFromFirstName(firstName)
  if (gender === 'm') {
    return greeting
      .replace(/\bSeja\s+muito\s+bem-vinda!?/gi, 'Seja muito bem-vindo!')
      .replace(/\bseja\s+muito\s+bem-vinda!?/gi, 'Seja muito bem-vindo!')
  }
  if (gender === 'f') {
    return greeting
      .replace(/\bSeja\s+muito\s+bem-vindo!?/gi, 'Seja muito bem-vinda!')
      .replace(/\bseja\s+muito\s+bem-vindo!?/gi, 'Seja muito bem-vinda!')
  }
  // Indefinido: usar forma inclusiva
  return greeting.replace(/\bSeja\s+muito\s+bem-vind[oa]!?/gi, 'Seja muito bem-vindo(a)!')
}

/**
 * Função helper centralizada para buscar instância Z-API
 * Tenta múltiplas estratégias para encontrar uma instância válida
 */
export async function getZApiInstance(area: string = 'nutri'): Promise<{
  id: string
  instance_id: string
  token: string
} | null> {
  try {
    // Estratégia 1: Buscar por área e status connected (prioridade)
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    if (instance) {
      console.log('[getZApiInstance] ✅ Instância encontrada (área + connected):', {
        id: instance.id,
        instance_id: instance.instance_id,
        area
      })
      return instance
    }

    // Estratégia 2: Buscar apenas por área (sem filtro de status)
    console.log('[getZApiInstance] ⚠️ Instância não encontrada com status connected, tentando apenas por área...')
    const { data: instanceByArea } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token, status')
      .eq('area', area)
      .limit(1)
      .maybeSingle()
    
    if (instanceByArea) {
      console.log('[getZApiInstance] ⚠️ Instância encontrada mas status não é "connected":', {
        id: instanceByArea.id,
        instance_id: instanceByArea.instance_id,
        status: instanceByArea.status,
        area
      })
      return {
        id: instanceByArea.id,
        instance_id: instanceByArea.instance_id,
        token: instanceByArea.token
      }
    }

    // Estratégia 3: Buscar qualquer instância conectada (fallback)
    console.log('[getZApiInstance] ⚠️ Instância da área não encontrada, tentando qualquer instância conectada...')
    const { data: instanceFallback } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token, area')
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()
    
    if (instanceFallback) {
      console.log('[getZApiInstance] ⚠️ Usando instância fallback (não é da área solicitada):', {
        id: instanceFallback.id,
        instance_id: instanceFallback.instance_id,
        area: instanceFallback.area,
        requestedArea: area
      })
      return {
        id: instanceFallback.id,
        instance_id: instanceFallback.instance_id,
        token: instanceFallback.token
      }
    }

    // Estratégia 4: Buscar qualquer instância (último recurso)
    console.log('[getZApiInstance] ⚠️ Nenhuma instância conectada encontrada, tentando qualquer instância...')
    const { data: anyInstance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token, area, status')
      .limit(1)
      .maybeSingle()
    
    if (anyInstance) {
      console.log('[getZApiInstance] ⚠️ Usando qualquer instância disponível (último recurso):', {
        id: anyInstance.id,
        instance_id: anyInstance.instance_id,
        area: anyInstance.area,
        status: anyInstance.status,
        requestedArea: area
      })
      return {
        id: anyInstance.id,
        instance_id: anyInstance.instance_id,
        token: anyInstance.token
      }
    }

    console.error('[getZApiInstance] ❌ Nenhuma instância Z-API encontrada no banco de dados')
    return null
  } catch (error: any) {
    console.error('[getZApiInstance] ❌ Erro ao buscar instância Z-API:', error)
    return null
  }
}

/**
 * System Prompt da Carol
 */
const CAROL_SYSTEM_PROMPT = `Você é a Carol, secretária da YLADA Nutri. Você é profissional, acolhedora e eficiente.

SEU PAPEL:
- Recepcionar pessoas que se inscreveram na Aula Prática ao Vivo
- Enviar opções de dias e horários disponíveis
- Responder dúvidas sobre a aula
- Ajudar com reagendamentos
- Fazer remarketing para quem agendou mas não participou
- Trabalhar vendas e fechamento após a aula
- Lidar com objeções de forma empática e estratégica
- Provocar que a pessoa manifeste suas dúvidas e objeções

OBJETIVO CENTRAL (clareza total):
- A Carol não existe para informar. Ela existe para CONDUZIR DECISÃO com leveza.
- Decisão = sair do improviso → entrar em sistema.
- Tudo que você escreve deve responder implicitamente: "Você vai continuar tentando sozinha ou vai entrar em estrutura agora?"

TOM DE VOZ OBRIGATÓRIO — Light copy altamente persuasiva:
- Frases curtas. Linguagem humana, simples, sem "marketingês".
- Tom calmo, firme, respeitoso. Nunca ansiosa, nunca pedinte, nunca agressiva.
- Sensação que a mensagem deve passar: "Estou te ajudando a decidir, não te convencendo."

FRASE-GUIA (mental model):
- "Cada mensagem da Carol deve fazer a pessoa pensar: ou eu decido agora, ou continuo igual." Se a mensagem não faz isso → está errada.

REGRAS IMPORTANTES:
1. Sempre seja acolhedora e profissional
2. Use emojis moderadamente (1-2 por mensagem)
3. Seja direta e objetiva
4. NUNCA repita informações que já foram ditas na conversa - LEIA O HISTÓRICO PRIMEIRO
5. Se a pessoa já sabe sobre a aula, NÃO explique novamente - apenas responda a pergunta específica
6. Seja natural e conversacional
7. Quando enviar opções de aula, use EXATAMENTE o formato fornecido no contexto
8. Para reagendamentos, seja flexível e ajude a encontrar melhor data

CONTEXTO DA AULA:
- Nome: "Aula Prática ao Vivo de Como Encher a Agenda"
- Duração: aproximadamente 45 minutos
- Formato: Online (Zoom)
- Objetivo: Ensinar estratégias práticas para encher a agenda

QUANDO ENVIAR OPÇÕES DE AULA:
- SEMPRE na primeira mensagem da pessoa (já apresente as duas próximas opções)
- Quando pessoa pergunta sobre dias/horários
- Quando pessoa quer agendar
- Quando pessoa pede para reagendar
- Use EXATAMENTE o formato das opções fornecidas no contexto (não invente horários)
- NUNCA inclua links do Zoom nas opções iniciais
- Apenas mostre dias e horários
- Quando a pessoa escolher uma opção, você enviará o link específico

QUANDO A PESSOA ESCOLHE UMA OPÇÃO (1, 2, Opção 1, Opção 2, 15:00, 09:00, etc.):
- O SISTEMA envia o link do Zoom automaticamente. Você NÃO deve responder com "Ótima escolha!" seguido da lista de opções.
- NUNCA repita as opções (Opção 1, Opção 2 com dia/hora) quando a pessoa já escolheu. Se por algum motivo você for acionada nesse momento, responda APENAS uma frase curta: "Perfeito! Você já vai receber o link em instantes. 😊" — nada mais.

IMPORTANTE - SUGERIR SESSÕES ALTERNATIVAS:
- Se a pessoa mencionar preferência por "noite", "tarde" ou "manhã" e as opções mostradas não corresponderem, você DEVE sugerir a sessão que melhor se encaixa
- Exemplo: Se pessoa diz "prefiro à noite" e você mostrou apenas opções de manhã/tarde, sugira a sessão noturna (quarta 20h se existir)
- Se a pessoa mencionar preferência de período e não houver correspondência nas opções mostradas, busque nas próximas sessões disponíveis e sugira a melhor opção
- Seja proativa: "Vi que você prefere à noite! Temos uma opção perfeita: quarta-feira às 20h. Quer que eu te envie o link?"

PRIMEIRA MENSAGEM (IMPORTANTE):
- Se é a primeira mensagem da pessoa, você DEVE enviar TUDO em UMA ÚNICA mensagem:
  1. Primeira linha: "Oi, tudo bem? 😊" (SE o nome da pessoa estiver disponível, use: "Oi [NOME], tudo bem? 😊")
  
  2. Segunda linha: "Seja muito bem-vinda!" (NÃO repita o nome aqui - use apenas "Seja muito bem-vinda!")
  
  3. Terceira linha: "Eu sou a Carol, da equipe Ylada Nutri."
  
  **CRUCIAL: Essas três primeiras frases devem estar em LINHAS SEPARADAS, uma em cada linha. NÃO junte tudo em uma linha só!**
  
  4. Deixar uma LINHA EM BRANCO
  
  5. Agradecer e explicar sobre a aula focando na DOR e no BENEFÍCIO:
     "Obrigada por se inscrever na Aula Prática ao Vivo – Agenda Cheia para Nutricionistas.
     
     Essa aula é 100% prática e foi criada para ajudar nutricionistas que estão com agenda ociosa a organizar, atrair e preencher atendimentos de forma mais leve e estratégica."
  
  6. Deixar uma LINHA EM BRANCO
  
  7. Depois apresentar as opções: "As próximas aulas ao vivo vão acontecer nos seguintes dias e horários:"
  
  8. JÁ apresentar as duas próximas opções de aula (usando o formato fornecido - apenas dias e horários, SEM links)
  
  9. Perguntar de forma natural: "Qual desses horários funciona melhor pra você? 😊" (SEM botões, apenas texto)
  
  10. NÃO esperar a pessoa perguntar sobre horários - você já apresenta!
  
  11. Use linguagem próxima, humanizada e acolhedora, como se estivesse conversando pessoalmente
  
  12. **CRUCIAL: Se você souber o nome da pessoa (fornecido no contexto), SEMPRE use o nome dela na saudação inicial!**
  
  13. **MUITO IMPORTANTE: TUDO isso deve estar em UMA ÚNICA mensagem. NUNCA divida em múltiplas mensagens. Mantenha tudo unificado.**
  14. **NÃO REPITA: As opções (Opção 1, Opção 2 com dia e hora) devem aparecer UMA ÚNICA VEZ na mensagem. Não repita a mesma data/horário (ex.: Quinta-feira 29/01/2026 09:00). O texto de abertura (Oi, tudo bem? Seja bem-vinda! Eu sou a Carol...) também deve aparecer UMA ÚNICA VEZ.**

REMARKETING E FOLLOW-UP (pós-aula) — tom humano, sem “script engessado”:

- Responda a pergunta primeiro (se a pessoa perguntou algo objetivo, ex.: parcelamento, link, datas).
- Evite “frases de efeito” repetidas e qualquer pressão. Não use: “não é sobre preço”, “sem sistema…”, “mudar sua história”, etc.
- Máx. 3–5 linhas, 2–3 frases. Termine com 1 pergunta simples para avançar (sem interrogatório).

Respostas rápidas (exemplos de tom/estrutura — adapte ao contexto):
- "Vou pensar" → "Claro. O que você precisa ter certeza pra decidir com tranquilidade?"
- "Não tenho tempo" → "Entendo. Qual período do dia costuma ser mais viável pra você: manhã, tarde ou noite?"
- "Está caro" → "Entendo. No *mensal* é mês a mês (assinatura). Se quiser parcelar, o *anual* dá pra dividir no cartão (até 12x). Você prefere mensal ou anual?"
- "Parcelamento" → "Mensal é cobrado mês a mês (sem parcelamento). Anual dá pra parcelar no cartão (até 12x). Qual você prefere?"

REGRAS DE COMPORTAMENTO (remarketing e follow-up):
- Evite parágrafos longos e listas de benefícios.
- Seja acolhedora e direta: 1 ponto por mensagem + 1 pergunta final.

QUANDO FAZER REMARKETING:
- A definição de "participou ou não participou" vem da SITUAÇÃO DESTA PESSOA, das Tags da conversa (Participou/participou_aula) ou do que está escrito na conversa. NUNCA assuma "não participou" por padrão.
- Se a pessoa PARTICIPOU (situação/tag/texto): NUNCA use "não conseguiu participar da aula anterior". Relembre em 1 linha + faça 1 pergunta simples (ex.: "O que você quer destravar primeiro?").
- Se a pessoa NÃO participou (confirmado): acolha sem julgamento e pergunte se quer remarcar + qual período (manhã/tarde/noite).
- Pessoa agendou mas não participou: primeira mensagem NUNCA leva datas/link. Primeiro confirme se ela ainda quer participar; se responder que sim, aí ofereça opções.
- Não mencione "programa" nem force decisão. Foque em ajudar a pessoa a escolher o próximo passo.

IMPORTANTE - NÃO REPETIR:
- SEMPRE leia o histórico completo antes de responder
- Se você JÁ explicou o que é a aula, NÃO explique novamente
- Se você JÁ enviou opções, NÃO envie novamente a menos que a pessoa peça
- Se a pessoa faz uma pergunta simples, responda APENAS a pergunta, sem repetir contexto
- Continue a conversa naturalmente, como se fosse uma conversa real

REGRA DE OURO - INSTRUÇÃO E SITUAÇÃO:
- Se no contexto aparecer "INSTRUÇÃO DO ADMIN PARA ESTA RESPOSTA" ou "INSTRUÇÃO PARA ESTA RESPOSTA", essa instrução tem PRIORIDADE MÁXIMA. Siga EXATAMENTE o que ela diz. Ela SOBREESCREVE qualquer outra regra (primeira mensagem, enviar opções, etc.)
- Se aparecer "SITUAÇÃO DESTA PESSOA", use-a para saber se a pessoa participou ou não da aula. O que está escrito ali (e nas tags "Participou"/participou_aula) SOBREESCREVE o texto genérico de remarketing. Se disser que participou, nunca use "não conseguiu participar da aula anterior".
- Exemplo de instrução: se disser "responda em uma frase curta, não repita opções", você NÃO pode enviar opções nem boas-vindas

PARTICIPOU vs NÃO PARTICIPOU (resumo):
- PARTICIPOU: tag participou_aula/participou OU SITUAÇÃO diz "participou", "ficou de pensar", "participou da aula". Comportamento: follow-up e fechamento. NUNCA diga "não conseguiu participar da aula anterior". NÃO envie boas-vindas nem opções de nova aula.
- NÃO PARTICIPOU: tag nao_participou_aula OU SITUAÇÃO diz que não participou. Comportamento: remarketing. Primeira mensagem: pergunte se ainda tem interesse; só depois de "sim" ofereça opções de horário. Acolha sem julgamento.
- A SITUAÇÃO pode conter notas internas (ex.: "Lá no remarketing Inge", "Nutri"). Essas palavras são da equipe, NUNCA use como nome da pessoa. O nome da pessoa é só o indicado em "NOME DA PESSOA" (cadastro).

QUANDO A PESSOA SÓ CONFIRMOU OU ENTENDEU:
- Se a pessoa disse apenas "Entendi", "Ok", "Certo", "Beleza", "Tá", "Pronto" ou algo muito curto confirmando (e NÃO está escolhendo opção):
  → NÃO repita opções de aula
  → NÃO repita boas-vindas nem explicação da aula
  → Responda em UMA frase curta e amigável, ex.: "Qualquer dúvida, é só me chamar! 😊" ou "Fico no aguardo! 💚"
- Se a pessoa disse "1", "2", "Opção 1", "Opção 2" ou um horário (ex.: 15:00): ela está ESCOLHENDO, não só confirmando. O sistema envia o link. NÃO responda com "Ótima escolha!" + opções nem com "Qualquer dúvida, é só me chamar!" — no máximo uma linha: "Perfeito! Você já vai receber o link em instantes. 😊"
- Essas respostas curtas evitam poluir a conversa e dão sequência natural

FORMATO DE RESPOSTAS:
- Em REMARKETING e FOLLOW-UP: siga as regras da seção "REMARKETING E FOLLOW-UP (pós-aula)" (curto, humano e com 1 pergunta final).
- Quando não for remarketing/follow-up: curta (máx. 3–4 linhas quando não enviar opções), clara e direta.
- SEM repetir informações já ditas. Quando enviar opções, use o formato exato fornecido no contexto.
- **CRUCIAL: SEMPRE envie TUDO em UMA ÚNICA mensagem. NUNCA divida sua resposta em múltiplas mensagens.**
- **IMPORTANTE: Mantenha a mensagem unificada e coesa. Não separe informações que deveriam estar juntas.**

ASSINATURA E ENCERRAMENTO (OBRIGATÓRIO):
- NUNCA assine suas mensagens com "Carol - Secretária YLADA Nutri" ou similar. Mantenha o tom humanizado, como conversa natural.
- Sempre que fizer sentido, termine com uma pergunta. Em remarketing/follow-up: use SEMPRE pergunta REFLEXIVA (ex.: "Você quer dar essa virada agora?"), NUNCA genérica ("Posso ajudar?", "Tem dúvida?", "Quer que eu explique?").

NOME DA PESSOA:
- Ao chamar a pessoa pelo nome, use APENAS o primeiro nome (ex.: "Maria Silva" → "Maria"). Nunca use nome completo nem sobrenome.

TRABALHANDO VENDAS E OBJEÇÕES:
- Em remarketing e follow-up (participou e ficou de pensar, não participou, objeções pós-aula): mantenha curto e humano; responda o que a pessoa perguntou e feche com 1 pergunta simples.
- NUNCA termine com: "Posso ajudar em algo?" | "Você tem alguma dúvida?" | "Quer que eu te explique melhor?" — enfraquecem a decisão. Use perguntas reflexivas que levem a posicionar (ex.: "O que pesa mais pra você hoje?").
- Sempre trabalhe o emocional: lembre o motivo, o sonho, o objetivo. Provocar que a pessoa fale. Quando for objeção em fase de vendas pós-aula, prefira respostas curtas (light copy) e feche com pergunta reflexiva.
- Não seja agressiva, mas seja firme e estratégica. Conduza decisão, não convença.

FASE DE CONVITE (antes de escolher horário) – TOM MAIS LEVE:
- Se a pessoa ainda NÃO escolheu horário e traz objeção ("não tenho tempo", "não dá nesses dias", "quanto custa?", "vou pensar"), você está na FASE DE CONVITE.
- Nessa fase: NÃO seja agressiva. Ainda é convite para uma aula gratuita, não venda. Responde à objeção de forma curta e acolhedora, SEM repetir o bloco inteiro de boas-vindas.
- Quando a objeção for DISPONIBILIDADE (não tenho horário, não dá nesses dias, esses horários não funcionam):
  → Pergunte qual dia da semana é mais tranquilo para ela
  → Se tiver sessão à noite (ex.: quarta 20h), sugira: "Te encaixa melhor à noite? Temos quarta-feira às 20h, por exemplo. Quer que eu te envie o link?"
  → Ofereça ajudar a encontrar um horário: "Qual período costuma funcionar melhor pra você – manhã, tarde ou noite?"
  → Não invente datas; use apenas as opções que você tem no contexto. Se não houver correspondência, diga que vai verificar outras datas e pergunte o preferido
- Objeções de preço/tempo/"vou pensar" na fase de convite: responda em 1–2 frases, suave. Ex.: preço – "A aula é gratuita! 😊 É só escolher um horário que funcione pra você." Tempo – "São só 45 min e você aplica no dia a dia. Qual desses horários te encaixa melhor?" "Vou pensar" – "Claro! Qualquer dúvida, me chama. Qual horário tende a ser melhor pra você – manhã, tarde ou noite?"

OBJEÇÕES COMUNS E COMO TRABALHAR (fase de vendas / pós-aula):

Em REMARKETING e FOLLOW-UP use respostas curtas (light copy) e humanas:
- "Vou pensar" → "Claro. O que você precisa ter certeza pra decidir com tranquilidade?"
- "Não tenho tempo" → "Entendo. Qual período do dia costuma ser mais viável pra você: manhã, tarde ou noite?"
- "Está caro" → "Entendo. No *mensal* é mês a mês; no *anual* dá pra parcelar no cartão (até 12x). Você prefere qual?"

Se precisar de alternativas (ex.: conversa longa já em curso):

1. **PREÇO / VALOR:** Seja direta e útil. Se for parcelamento, explique objetivamente (mensal = mês a mês; anual = parcelável até 12x). Depois faça 1 pergunta (mensal ou anual?).

2. **TEMPO:** Acolha e ajude a pessoa a escolher um caminho viável: "Qual período do dia costuma ser melhor pra você — manhã, tarde ou noite?"

3. **"VOU PENSAR":** "Claro. O que você precisa ter certeza pra decidir com tranquilidade?"

4. **DÚVIDA / INCERTEZA:** "O que está te travando mais agora: agenda, forma de pagamento ou confiança de que vai conseguir aplicar?"

5. **"NÃO TENHO DINHEIRO AGORA":** "Entendo. Você prefere começar no mensal (mês a mês) ou quer ver o anual parcelado no cartão (até 12x)?"

6. **QUANDO A PESSOA DISSER QUE PODE FECHAR EM UM DIA ESPECÍFICO** (ex.: "meu cartão vira dia 17", "só posso dia 15", "no dia 20"):
   - Confirme que vai entrar em contato nesse dia para fechar. Ex.: "Beleza! Então te chamo no dia 17 pra gente fechar, combinado? 😊" (use o dia que ela mencionou).
   - Seja curta e acolhedora. O sistema vai agendar automaticamente um lembrete para enviar só pra ela naquele dia.

7. **"JÁ TENHO MUITAS COISAS":** "Entendo. Se eu te ajudar a simplificar o próximo passo, o que seria mais útil agora: agendar a próxima aula ou ver os planos?"

IMPORTANTE AO TRABALHAR OBJEÇÕES:
- Em remarketing e follow-up: priorize mensagem curta e humana (2–3 frases) e 1 pergunta final.
- Se a pessoa fez uma pergunta objetiva (parcelamento, valores, link), responda primeiro — sem “desviar”.
- Evite frases repetidas e pressão. Seja empática e prática.

QUANDO PRECISAR DE ATENDIMENTO HUMANO:
- Se a pessoa pedir explicitamente para falar com alguém: "quero falar com alguém", "preciso de atendimento", "quero falar com suporte"
- Se a pessoa tiver problemas técnicos complexos que você não consegue resolver
- Se a pessoa tiver questões sobre pagamento, reembolso ou problemas financeiros que você não consegue resolver
- Se a pessoa estiver insatisfeita ou reclamando de forma que exija intervenção humana
- Se a pessoa pedir para cancelar ou desistir e você já tentou trabalhar a objeção sem sucesso
- Se a situação for muito complexa ou específica que você não tem informações suficientes

Quando detectar necessidade de atendimento humano, você DEVE:
1. Ser empática e acolhedora
2. Informar que vai direcionar para o atendimento humano
3. Garantir que a pessoa será atendida
4. NÃO tente resolver sozinha se realmente precisa de humano

IMPORTANTE: Se você detectar necessidade de atendimento humano, inclua na sua resposta uma indicação clara, mas continue sendo acolhedora.`

/**
 * Gera resposta da Carol usando OpenAI
 * Exportada para uso em testes e simulações
 */
export async function generateCarolResponse(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  context?: {
    tags?: string[]
    workshopSessions?: Array<{ id?: string; title: string; starts_at: string; zoom_link: string }>
    leadName?: string
    hasScheduled?: boolean
    scheduledDate?: string
    participated?: boolean
    isFirstMessage?: boolean
    carolInstruction?: string
    /** Situação definida pelo admin (remarketing pessoa por pessoa). Persiste até ser alterada. */
    adminSituacao?: string
  }
): Promise<string> {
  if (CAROL_AI_DISABLED) {
    return ''
  }

  if (!process.env.OPENAI_API_KEY) {
    return 'Olá! Sou a Carol, secretária da YLADA Nutri. Como posso te ajudar? 😊'
  }

  // Respostas objetivas (evita a IA cair em "objeção" errada, ex.: parcelamento ≠ "está caro")
  // Importante: manter curto, humano e com 1 pergunta no final.
  const msgLower = String(message || '').toLowerCase()
  const askedAboutInstallments =
    msgLower.includes('parcel') ||
    msgLower.includes('parcelamento') ||
    msgLower.includes('dividir') ||
    msgLower.includes('12x')

  if (askedAboutInstallments) {
    const mentionsMonthly = msgLower.includes('mensal')
    const mentionsAnnual = msgLower.includes('anual')

    if (mentionsMonthly && !mentionsAnnual) {
      return (
        'Boa pergunta 😊 No *mensal* a cobrança já é mês a mês (assinatura), então não tem parcelamento.\n' +
        'Se você quiser parcelar no cartão, o *anual* permite (até 12x).\n\n' +
        'Você prefere começar no mensal ou no anual?'
      )
    }

    if (mentionsAnnual && !mentionsMonthly) {
      return 'No *anual* dá pra parcelar no cartão (até 12x). Quer que eu te mande o link do anual?'
    }

    return (
      'Sobre pagamento: o *mensal* é cobrado mês a mês (sem parcelamento) e o *anual* dá pra parcelar no cartão (até 12x).\n\n' +
      'Você está pensando em mensal ou anual?'
    )
  }

  // Função para formatar data/hora corretamente (timezone de São Paulo)
  // Exportada para uso em outras funções
  function formatSessionDateTime(startsAt: string): { weekday: string; date: string; time: string } {
    const date = new Date(startsAt)
    // Usar timezone de São Paulo
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }
    
    const formatter = new Intl.DateTimeFormat('pt-BR', options)
    const parts = formatter.formatToParts(date)
    
    const weekday = parts.find(p => p.type === 'weekday')?.value || ''
    const day = parts.find(p => p.type === 'day')?.value || ''
    const month = parts.find(p => p.type === 'month')?.value || ''
    const year = parts.find(p => p.type === 'year')?.value || ''
    const hour = parts.find(p => p.type === 'hour')?.value || ''
    const minute = parts.find(p => p.type === 'minute')?.value || ''
    
    return {
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      date: `${day}/${month}/${year}`,
      time: `${hour}:${minute}`
    }
  }

  // Construir contexto adicional
  let contextText = ''
  let formattedSessionsText = ''
  let shouldSendOptions = false
  
  if (context) {
    // Situação desta pessoa (remarketing pessoa por pessoa – definida pelo admin, persiste)
    if (context.adminSituacao && context.adminSituacao.trim()) {
      contextText += `\n\n📋 SITUAÇÃO DESTA PESSOA (definida por você para remarketing):\n${context.adminSituacao.trim()}\n\nUse isso para dar continuidade. Esta situação SOBREESCREVE qualquer regra genérica de remarketing: se aqui disser que a pessoa PARTICIPOU (ex.: "participou da aula", "ficou de pensar"), NUNCA diga que ela "não conseguiu participar da aula anterior". Só use essa frase quando a situação disser explicitamente que NÃO participou.\n\n⚠️ Este campo é NOTA INTERNA. NUNCA use nenhuma palavra dele (ex.: Nutri, Inge, remarketing, nomes de equipe) como nome da pessoa. O nome da pessoa é EXCLUSIVAMENTE o indicado no campo "NOME DA PESSOA" abaixo (vem do cadastro).\n`
    }
    // Instrução contextual para esta resposta (ex.: não repetir bloco em "Entendi", mensagem do botão, etc.)
    if (context.carolInstruction && context.carolInstruction.trim()) {
      contextText += `\n\n🚨 PRIORIDADE MÁXIMA - INSTRUÇÃO PARA ESTA RESPOSTA:\n${context.carolInstruction.trim()}\n\nEsta instrução SOBREESCREVE qualquer outra regra. Siga EXATAMENTE. Não repita opções, boas-vindas ou explicações se a instrução disser para responder curto.\n`
    }
    // 🆕 Nome da pessoa (sempre APENAS primeiro nome – ex.: Maria Silva → Maria). Fonte: cadastro (inscrição/contato).
    if (context.leadName) {
      const firstName = getFirstName(context.leadName)
      contextText += `\n⚠️ NOME DA PESSOA (cadastro – use APENAS este primeiro nome): ${firstName}\n`
      contextText += `IMPORTANTE: Trate a pessoa SOMENTE por este nome. Exemplo: "Oi ${firstName}, tudo bem? 😊"\n`
      contextText += `NUNCA use como nome: Nutri, Inge, Ylada, palavras do campo "SITUAÇÃO" ou qualquer texto que não seja este nome do cadastro.\n`
    } else {
      contextText += `\n⚠️ Nome da pessoa não disponível no cadastro. Use saudação SEM nome (ex.: "Oi, tudo bem? 😊"). NUNCA invente ou use como nome: Nutri, Inge, Ylada ou qualquer palavra do campo SITUAÇÃO.\n`
    }
    
    if (context.tags && context.tags.length > 0) {
      contextText += `\nTags da conversa: ${context.tags.join(', ')}\n`
      if (context.tags.includes('veio_tirar_duvida')) {
        contextText += `\n(Origem: clicou em "Tirar dúvida" ou veio da página de vendas. Use o mesmo fluxo: aula prática + opções quando fizer sentido; responda com autonomia às dúvidas e objeções.)\n`
      }
      if (context.tags.includes('participou_aula')) {
        contextText += `\n⚠️ Tag "Participou" presente: esta pessoa PARTICIPOU da aula. NUNCA use "não conseguiu participar da aula anterior". Adapte o tom (ex.: participou e ficou de pensar – fazer follow-up, não remarketing de quem faltou).\n`
      }
    }
    if (context.hasScheduled) {
      contextText += `\nEsta pessoa já agendou para: ${context.scheduledDate || 'data não especificada'}\n`
    }
    if (context.participated === true) {
      contextText += `\n⚠️ Esta pessoa PARTICIPOU da aula (confirmado por tag/contexto). NUNCA diga que ela "não conseguiu participar". Use tom de follow-up (participou e ficou de pensar, etc.).\n`
      contextText += `🚫 PROIBIDO: enviar "primeira mensagem"/recepção (ex.: "Seja muito bem-vinda", "Eu sou a Carol", explicação da aula, opções de horários).\n`
      contextText += `✅ Objetivo aqui: follow-up pós-aula e FECHAMENTO. Responda curto, humano e avance com 1 pergunta simples (ex.: mensal ou anual; qual o próximo passo; o que está travando).\n`
    }
    if (context.participated === false) {
      contextText += `\n⚠️ IMPORTANTE: Esta pessoa agendou mas NÃO participou da aula. Faça remarketing oferecendo novas opções.\n`
    }
    if (context.workshopSessions && context.workshopSessions.length > 0) {
      // Formatar opções de forma bonita - APENAS dias/horários (SEM links)
      // Nota: Usar 🗓️ em vez de 📅 pois o emoji 📅 mostra data atual do sistema
      formattedSessionsText = '🗓️ *Opções de Aula Disponíveis:*\n\n'
      context.workshopSessions.forEach((session, index) => {
        const { weekday, date, time } = formatSessionDateTime(session.starts_at)
        formattedSessionsText += `*Opção ${index + 1}:*\n`
        formattedSessionsText += `${weekday}, ${date}\n`
        formattedSessionsText += `🕒 ${time} (horário de Brasília)\n\n`
      })
      formattedSessionsText += `💬 *Qual você prefere?*\n`
      
      // 🆕 Se for primeira mensagem, instruir para já apresentar opções com explicação
      if (context.isFirstMessage) {
        contextText += `\n⚠️ ATENÇÃO: Esta é a PRIMEIRA MENSAGEM da pessoa!\n\n`
        contextText += `Você DEVE seguir EXATAMENTE esta estrutura:\n\n`
        if (context.leadName) {
          contextText += `1. Primeira linha: "Oi ${getFirstName(context.leadName)}, tudo bem? 😊" (USE APENAS O PRIMEIRO NOME!)\n`
          contextText += `2. Segunda linha: "Seja muito bem-vinda!" (NÃO repita o nome aqui - use apenas "Seja muito bem-vinda!")\n`
        } else {
          contextText += `1. Primeira linha: "Oi, tudo bem? 😊"\n`
          contextText += `2. Segunda linha: "Seja muito bem-vinda!"\n`
        }
        contextText += `3. Terceira linha: "Eu sou a Carol, da equipe Ylada Nutri."\n\n`
        contextText += `IMPORTANTE: Essas três primeiras frases devem estar em LINHAS SEPARADAS, uma em cada linha, sem juntar tudo em uma linha só!\n\n`
        contextText += `4. Agradecer e explicar sobre a aula focando na DOR e no BENEFÍCIO:\n`
        contextText += `"Obrigada por se inscrever na Aula Prática ao Vivo – Agenda Cheia para Nutricionistas.\n\n`
        contextText += `Essa aula é 100% prática e foi criada para ajudar nutricionistas que estão com agenda ociosa a organizar, atrair e preencher atendimentos de forma mais leve e estratégica."\n\n`
        contextText += `5. Depois apresentar: "As próximas aulas ao vivo vão acontecer nos seguintes dias e horários:"\n\n`
        contextText += `6. JÁ apresentar as duas próximas opções usando EXATAMENTE este formato (SEM links, apenas dias e horários):\n\n${formattedSessionsText}\n\n`
        contextText += `7. Perguntar de forma natural: "Qual desses horários funciona melhor pra você? 😊" (SEM botões, apenas texto)\n\n`
        contextText += `IMPORTANTE:\n`
        contextText += `- Use linguagem próxima, humanizada e acolhedora, como se estivesse conversando pessoalmente\n`
        contextText += `- NÃO espere a pessoa perguntar sobre horários - você já apresenta as opções na primeira mensagem!\n`
        contextText += `- NUNCA inclua links do Zoom nas opções. Apenas mostre dias e horários.\n`
        contextText += `- Foque na DOR (agenda ociosa) e no BENEFÍCIO (organizar, atrair e preencher atendimentos)\n`
        contextText += `- NÃO REPITA: as opções (Opção 1, Opção 2 com dia e hora) devem aparecer UMA ÚNICA VEZ. Não repita "Quinta-feira", data ou horário. O texto de abertura (Oi, tudo bem? Seja bem-vinda! Eu sou a Carol...) também deve aparecer UMA ÚNICA VEZ.\n`
        shouldSendOptions = true
      } else {
        contextText += `\nIMPORTANTE: Quando a pessoa perguntar sobre horários, dias, agendamento ou quiser agendar, você DEVE usar EXATAMENTE este formato de opções (SEM links, SEM URLs, apenas dias e horários):\n\n${formattedSessionsText}\n\nNUNCA inclua links do Zoom nas opções. Apenas mostre dias e horários. Quando a pessoa escolher uma opção, você enviará o link específico com a imagem.\n`
        
        // Verificar se a mensagem do usuário pede opções
        const messageLower = message.toLowerCase()
        shouldSendOptions = messageLower.includes('horário') || 
                           messageLower.includes('horario') ||
                           messageLower.includes('dia') ||
                           messageLower.includes('agendar') ||
                           messageLower.includes('opção') ||
                           messageLower.includes('opcao') ||
                           messageLower.includes('disponível') ||
                           messageLower.includes('disponivel') ||
                           messageLower.includes('quando') ||
                           messageLower.includes('quais')
      }
    }
  }

  // Última troca — Carol deve reler antes de responder (evita perder contexto, ex.: "Sim" após "tem interesse?" → enviar opções)
  const lastAssistant = conversationHistory.filter((m) => m.role === 'assistant').slice(-1)[0]?.content?.trim() || ''
  if (conversationHistory.length > 0) {
    const lastBotPreview = lastAssistant.slice(0, 400) + (lastAssistant.length > 400 ? '...' : '')
    const userReplyPreview = message.trim().slice(0, 200)
    contextText += `\n\n⚠️ ÚLTIMA TROCA — LEIA ANTES DE RESPONDER:\nSua última mensagem nesta conversa foi: "${lastBotPreview}".\nA pessoa acabou de responder: "${userReplyPreview}".\nUse esse contexto para decidir sua resposta. Ex.: se você perguntou se tem interesse em agendar e ela disse "Sim"/"Quero", envie as opções de aula; não responda com "Qualquer dúvida, é só me chamar".\n`
  }

    // Incluir histórico completo (últimas 15 mensagens para melhor contexto)
    // Aumentado de 10 para 15 para Carol ter mais contexto da conversa
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: CAROL_SYSTEM_PROMPT + contextText,
      },
      ...conversationHistory.slice(-15), // Últimas 15 mensagens para melhor contexto
      {
        role: 'user',
        content: message,
      },
    ]
    
    console.log('[Carol AI] 📜 Histórico enviado para OpenAI:', {
      totalHistory: conversationHistory.length,
      usingLast: Math.min(15, conversationHistory.length),
      messages: messages.map(m => ({ 
        role: m.role, 
        contentLength: typeof m.content === 'string' ? m.content.length : 0,
        preview: typeof m.content === 'string' ? m.content.substring(0, 80) : ''
      }))
    })

  try {
    // Aumentar max_tokens para primeira mensagem (precisa de mais espaço para formatação completa)
    const isFirstMessage = context?.isFirstMessage || false
    const maxTokens = isFirstMessage ? 800 : 400
    
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini', // Modelo mais barato e rápido
      messages,
      temperature: 0.6, // Reduzido para respostas mais consistentes
      max_tokens: maxTokens, // 800 para primeira mensagem, 400 para outras
    })

    let response = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem. Pode repetir?'
    
    // Se deve enviar opções, FORÇAR o formato correto (sem links)
    if (shouldSendOptions && formattedSessionsText) {
      // Remover TODOS os links que a IA possa ter adicionado
      response = response.replace(/\[Link do Zoom\]\([^)]+\)/gi, '')
      response = response.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links mas mantém texto
      response = response.replace(/https?:\/\/[^\s\)]+/g, '') // Remove URLs
      response = response.replace(/zoom\.us[^\s\)]*/gi, '') // Remove referências ao Zoom
      
      // Verificar se a resposta menciona opções ou horários
      const mentionsOptions = response.toLowerCase().includes('opção') || 
                              response.toLowerCase().includes('horário') ||
                              response.toLowerCase().includes('disponível')
      
      if (mentionsOptions) {
        // Se menciona opções mas não tem o formato correto, substituir completamente
        const hasCorrectFormat = response.includes('Opção 1:') && 
                                 !response.includes('http') &&
                                 !response.includes('zoom')
        
        if (!hasCorrectFormat) {
          // Extrair apenas a saudação inicial (até primeira quebra de linha ou ponto)
          const lines = response.split('\n')
          let greeting = lines[0] || 'Olá! 😊'
          
          // Limpar saudação de links
          greeting = greeting.replace(/\[Link do Zoom\]\([^)]+\)/gi, '')
          greeting = greeting.replace(/https?:\/\/[^\s]+/g, '')
          greeting = greeting.trim()
          
          // Se a saudação está vazia ou muito curta, usar padrão
          if (greeting.length < 5) {
            greeting = 'Olá! 😊 Que ótimo que você se inscreveu!'
          }
          
          // Criar resposta com saudação + opções formatadas (SEM links)
          response = `${greeting}\n\n${formattedSessionsText.trim()}`
        } else {
          // Se já tem formato correto, apenas garantir que não tem links
          response = response.replace(/\[Link do Zoom\]\([^)]+\)/gi, '')
          response = response.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          response = response.replace(/https?:\/\/[^\s\)]+/g, '')
          response = response.replace(/zoom\.us[^\s\)]*/gi, '')
        }
      }
    }
    
    return response
  } catch (error: any) {
    console.error('[Carol AI] Erro ao gerar resposta:', error)
    return 'Olá! Sou a Carol, secretária da YLADA Nutri. Como posso te ajudar? 😊'
  }
}

/**
 * Detecta se a conversa precisa de atendimento humano
 */
function detectNeedsHumanSupport(
  carolResponse: string,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): { detected: boolean; reason: string } {
  const responseLower = carolResponse.toLowerCase()
  const messageLower = userMessage.toLowerCase()
  
  // Palavras-chave na mensagem do usuário que indicam necessidade de humano
  const userKeywords = [
    'quero falar com alguém',
    'quero falar com uma pessoa',
    'preciso de atendimento',
    'quero atendimento humano',
    'quero falar com suporte',
    'quero cancelar',
    'quero desistir',
    'quero reembolso',
    'quero meu dinheiro de volta',
    'estou insatisfeita',
    'estou insatisfeito',
    'não estou satisfeita',
    'não estou satisfeito',
    'reclamação',
    'reclamar',
    'problema com pagamento',
    'erro no pagamento',
    'não recebi',
    'não funcionou',
    'não consigo acessar',
    'problema técnico',
  ]
  
  // Palavras-chave na resposta da Carol que indicam que ela detectou necessidade de humano
  const carolKeywords = [
    'vou direcionar',
    'direcionar para',
    'atendimento humano',
    'atendimento pessoal',
    'vou transferir',
    'transferir para',
    'não consigo ajudar',
    'precisa de ajuda',
    'vou encaminhar',
    'encaminhar para',
    'suporte técnico',
    'equipe de suporte',
  ]
  
  // Verificar mensagem do usuário
  const userNeedsHuman = userKeywords.some(keyword => messageLower.includes(keyword))
  
  // Verificar resposta da Carol
  const carolDetected = carolKeywords.some(keyword => responseLower.includes(keyword))
  
  if (userNeedsHuman) {
    // Identificar motivo específico
    if (messageLower.includes('cancelar') || messageLower.includes('desistir')) {
      return { detected: true, reason: 'Cliente quer cancelar/desistir' }
    }
    if (messageLower.includes('reembolso') || messageLower.includes('dinheiro de volta')) {
      return { detected: true, reason: 'Solicitação de reembolso' }
    }
    if (messageLower.includes('pagamento') || messageLower.includes('paguei')) {
      return { detected: true, reason: 'Problema com pagamento' }
    }
    if (messageLower.includes('insatisfeit') || messageLower.includes('reclama')) {
      return { detected: true, reason: 'Cliente insatisfeito/reclamação' }
    }
    if (messageLower.includes('técnico') || messageLower.includes('não funciona')) {
      return { detected: true, reason: 'Problema técnico' }
    }
    return { detected: true, reason: 'Cliente pediu atendimento humano' }
  }
  
  if (carolDetected) {
    return { detected: true, reason: 'Carol detectou necessidade de atendimento humano' }
  }
  
  // Verificar se há muitas mensagens sem progresso (possível frustração)
  const recentUserMessages = conversationHistory
    .filter(m => m.role === 'user')
    .slice(-3)
    .map(m => m.content.toLowerCase())
  
  const hasRepeatedQuestions = recentUserMessages.length >= 2 && 
    recentUserMessages.some(msg => 
      msg.includes('?') && recentUserMessages.filter(m => m.includes('?')).length >= 2
    )
  
  if (hasRepeatedQuestions && conversationHistory.length > 6) {
    return { detected: true, reason: 'Múltiplas perguntas sem resolução - possível frustração' }
  }
  
  return { detected: false, reason: '' }
}

/**
 * Extrai o dia do mês quando a pessoa menciona uma data para fechar (ex.: "meu cartão vira dia 17", "só posso dia 15").
 * Retorna o dia (1-31) ou null se não encontrar. Evita "às 17" (hora) — só considera "dia N".
 */
function parseFechamentoLembreteDay(userMessage: string): number | null {
  const msg = String(userMessage || '').trim()
  // "dia 17", "no dia 15", "cartão vira dia 17", "só posso dia 20" — não pegar "às 17" (hora)
  const match = msg.match(/\bdia\s*(\d{1,2})\b/i)
  if (!match) return null
  const day = parseInt(match[1], 10)
  if (day < 1 || day > 31) return null
  return day
}

/**
 * Agenda envio de lembrete de fechamento para um dia específico (ex.: dia 17 às 10h BRT).
 * Só para essa conversa; o worker envia na data agendada.
 */
async function scheduleFechamentoLembreteForDate(params: {
  conversationId: string
  phone: string
  day: number
  leadName: string
  area?: string
}): Promise<{ success: boolean; scheduledFor?: string; error?: string }> {
  try {
    const tz = 'America/Sao_Paulo'
    const now = new Date()
    const nowBr = new Date(now.toLocaleString('en-US', { timeZone: tz }))
    let year = nowBr.getFullYear()
    let month = nowBr.getMonth()
    if (day > 28) {
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
      if (day > lastDayOfMonth) return { success: false, error: `Dia ${day} inválido para este mês` }
    }
    let target = new Date(year, month, params.day)
    if (target <= nowBr) {
      month += 1
      if (month > 11) {
        month = 0
        year += 1
      }
      target = new Date(year, month, params.day)
    }
    target.setHours(10, 0, 0, 0)
    const registrationUrl = process.env.NUTRI_REGISTRATION_URL || 'https://www.ylada.com/pt/nutri#oferta'
    const firstName = getFirstName(params.leadName) || 'querido(a)'
    const messageText = `Oi ${firstName}! Hoje é o dia que você comentou. 😊 Vamos fechar? Aqui está o link: ${registrationUrl}\n\nQualquer dúvida, é só responder aqui. 💚`
    const { scheduleMessage } = await import('@/lib/whatsapp-automation/scheduler')
    const result = await scheduleMessage({
      conversationId: params.conversationId,
      messageType: 'fechamento_lembrete_data',
      scheduledFor: target,
      messageData: { message: messageText, lead_name: params.leadName },
    })
    if (!result.success) return { success: false, error: result.error }
    return { success: true, scheduledFor: target.toISOString() }
  } catch (e: any) {
    return { success: false, error: e?.message || String(e) }
  }
}

/**
 * Envia mensagem via WhatsApp usando Z-API
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string,
  instanceId: string,
  token: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const client = createZApiClient(instanceId, token)
    const result = await client.sendTextMessage({ phone, message })

    if (!result.success) {
      return { success: false, error: result.error }
    }

    return { success: true, messageId: result.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Processa mensagem recebida e responde automaticamente com Carol
 */
export async function processIncomingMessageWithCarol(
  conversationId: string,
  phone: string,
  message: string,
  area: string = 'nutri',
  instanceId: string
): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    console.log('[Carol AI] 🚀 Iniciando processamento:', {
      conversationId,
      phone,
      messagePreview: message?.substring(0, 50),
      area,
      instanceId,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY
    })

    if (CAROL_AI_DISABLED) {
      console.log('[Carol AI] ⏭️ IA desativada (src/config/carol-ai.ts — CAROL_AI_DISABLED)')
      return { success: false, error: 'Carol IA desativada' }
    }

    // Verificar se OpenAI está configurado
    if (!process.env.OPENAI_API_KEY) {
      console.error('[Carol AI] ❌ OPENAI_API_KEY não configurada')
      return { success: false, error: 'OpenAI API Key não configurada' }
    }

    // Mensagem vazia não deve travar; retornar erro claro
    const msgTrim = typeof message === 'string' ? message.trim() : ''
    if (!msgTrim) {
      console.warn('[Carol AI] ⚠️ Mensagem vazia recebida, ignorando')
      return { success: false, error: 'Mensagem vazia' }
    }

    // 1. Buscar contexto da conversa
    // Usar maybeSingle() para evitar erro se não encontrar (pode ser problema de timing)
    let conversation: any = null
    let retries = 0
    const maxRetries = 3
    
    while (!conversation && retries < maxRetries) {
      if (retries > 0) {
        // Aguardar um pouco antes de tentar novamente (problema de timing)
        await new Promise(resolve => setTimeout(resolve, 300 * retries))
      }
      
      const { data: conv, error: convError } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('context, name, customer_name')
        .eq('id', conversationId)
        .maybeSingle()

      if (convError) {
        console.error('[Carol AI] ❌ Erro ao buscar conversa:', convError)
        if (retries === maxRetries - 1) {
          return { success: false, error: `Erro ao buscar conversa: ${convError.message}` }
        }
        retries++
        continue
      }

      if (conv) {
        conversation = conv
        break
      }
      
      retries++
      if (retries < maxRetries) {
        console.log(`[Carol AI] ⏳ Conversa não encontrada, tentando novamente (${retries}/${maxRetries})...`)
      }
    }

    if (!conversation) {
      console.error('[Carol AI] ❌ Conversa não encontrada após', maxRetries, 'tentativas:', conversationId)
      return { success: false, error: 'Conversa não encontrada' }
    }

    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []
    const workshopSessionId = context.workshop_session_id
    const nowIso = new Date().toISOString()

    // 🛑 Conversa "tirar dúvida do vídeo": Carol já enviou a única mensagem automática; a partir daí é atendimento humano.
    if (tags.includes('tirar_duvida_video')) {
      console.log('[Carol AI] ⏭️ Conversa é tirar dúvida do vídeo (atendimento humano); Carol não responde.')
      return { success: true, response: '' }
    }

    // 🛑 Auto-resposta do WhatsApp do lead (ex.: "Agradecemos sua mensagem...")
    // Não deve disparar "primeira mensagem" / boas-vindas novamente.
    const msgNormAuto = String(message || '').trim().toLowerCase().replace(/\s+/g, ' ')
    const isAutoReplyMessage =
      /(agradecemos\s+sua\s+mensagem|n[aã]o\s+estamos\s+dispon[ií]veis\s+no\s+momento|responderemos\s+assim\s+que\s+poss[ií]vel|responderemos\s+assim\s+que\s+for\s+poss[ií]vel)/i.test(
        msgNormAuto
      )
    if (isAutoReplyMessage) {
      console.log('[Carol AI] 🛑 Auto-resposta detectada; ignorando para evitar duplicação.', {
        conversationId,
        hasWorkshopSessionId: !!workshopSessionId,
        tags,
      })
      return { success: true, response: '' }
    }

    // 1b. Se a pessoa avisar que NÃO vai conseguir participar/entrar, NÃO reenviar link.
    // Em vez disso, desmarcar e oferecer remarcação (evita loops de "link" quando a pessoa fala que não consegue ir).
    const msgForReagendar = String(message || '').trim().toLowerCase()
    const querReagendar =
      /reagendar|remarcar|trocar\s+hor[aá]rio|mudar\s+hor[aá]rio|mudar\s+o\s+hor[aá]rio|adiar|outro\s+hor[aá]rio|outro\s+dia/i.test(message) ||
      /n[aã]o\s+vou\s+conseguir\s+(participar|entrar|ir)|n[aã]o\s+consigo\s+(participar|entrar|ir)|n[aã]o\s+poderei\s+(participar|entrar|ir)|n[aã]o\s+vou\s+poder\s+(participar|entrar|ir)|n[aã]o\s+posso\s+(participar|entrar|ir)/i.test(message) ||
      // Justificativa para o horário que tinha agendado: "esse horário não dá", "nesse horário vou estar em fisioterapia", etc.
      (!!workshopSessionId && (
        /(esse|nesse|neste)\s+hor[aá]rio\s+(n[aã]o\s+)?(d[aá]|posso|consigo|vou)/i.test(msgForReagendar) ||
        /(esse|nesse|neste)\s+hor[aá]rio\s+.{0,30}(fisioterapia|m[eé]dico|consulta|compromisso|reuni[aã]o|trabalho)/i.test(msgForReagendar) ||
        /(n[aã]o\s+)?(d[aá]|posso|consigo)\s+.{0,20}(nesse|esse)\s+hor[aá]rio/i.test(msgForReagendar) ||
        /(vou\s+estar|tenho)\s+.{0,25}(fisioterapia|m[eé]dico|consulta|compromisso|reuni[aã]o)/i.test(msgForReagendar)
      ))

    const querCancelar =
      /quero\s+cancelar|quero\s+desmarcar|desmarcar|desistir|n[aã]o\s+quero\s+mais\s+participar|n[aã]o\s+quero\s+participar|tirar\s+(me)?\s+da\s+(lista|aula)|remover\s+(me)?\s+do\s+agendamento|cancelar\s+(minha\s+)?(participação|aula|inscrição)/i.test(message)
    let desagendarResponse: string | null = null
    let shouldOfferRescheduleOptions = false
    if (workshopSessionId && (querCancelar || querReagendar)) {
      const tagsFiltered = tags.filter((t: string) => t !== 'agendou_aula' && t !== 'recebeu_link_workshop')
      const nextTags = querReagendar ? [...new Set([...tagsFiltered, 'adiou_aula'])] : tagsFiltered
      const { workshop_session_id, scheduled_date, ...restContext } = context as Record<string, unknown>
      const newContext = {
        ...restContext,
        tags: nextTags,
        workshop_session_id: null,
        scheduled_date: null,
      }
      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({ context: newContext })
        .eq('id', conversationId)
      if (querReagendar) {
        // A lista real de opções é montada depois que buscamos as sessões.
        shouldOfferRescheduleOptions = true
        desagendarResponse = 'Sem problema 😊 Vou remarcar sua aula.'
      } else {
        desagendarResponse = 'Tudo bem! Desmarquei sua participação. Se quiser agendar em outro horário, é só me avisar. 😊'
      }
    }

    // Se já marcou adiou_aula anteriormente e a pessoa voltou pedindo para reagendar, oferecer opções mesmo sem workshop_session_id.
    const isAlreadyRescheduleFlow = tags.includes('adiou_aula')
    const wantsRescheduleNow =
      /reagendar|remarcar|trocar\s+hor[aá]rio|outro\s+hor[aá]rio|outro\s+dia|pode\s+reagendar|quero\s+reagendar/i.test(message) ||
      /^(reagendar|remarcar)$/i.test(message.trim())
    if (!workshopSessionId && isAlreadyRescheduleFlow && wantsRescheduleNow) {
      shouldOfferRescheduleOptions = true
      desagendarResponse = 'Sem problema 😊 Vamos reagendar.'
    }

    // 2. Buscar sessões de workshop (aula gratuita): 2 opções próxima + manhã.
    let workshopSessions: Array<{ id: string; title: string; starts_at: string; zoom_link: string }> = []
    const now = new Date()
    const minDateIso = now.toISOString()
    let sessionsError: unknown = null

    {
      console.log('[Carol AI] 🔍 Buscando sessões futuras (sempre 2 opções: próxima + manhã):', {
        now: minDateIso,
        area,
        conversationId,
        workshopSessionId: workshopSessionId ?? '(nenhum)'
      })

      const { data: allSessions, error: errSessions } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('id, title, starts_at, zoom_link')
        .eq('area', area)
        .eq('is_active', true)
        .gte('starts_at', minDateIso)
        .order('starts_at', { ascending: true })
        .limit(8)

      sessionsError = errSessions || null
      if (sessionsError) {
        console.error('[Carol AI] ❌ Erro ao buscar sessões:', sessionsError)
      }

      const list = allSessions || []
      const hourBR = (startsAt: string) =>
        parseInt(new Date(startsAt).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false }), 10)
      const isManha = (s: { starts_at: string }) => {
        const h = hourBR(s.starts_at)
        return h === 9 || h === 10
      }
      const first = list[0]
      const soonestManha = list.find(isManha)
      const second = soonestManha && soonestManha.id !== first?.id ? soonestManha : list[1]
      workshopSessions = first && second ? [first, second] : first ? [first] : []
    }

    console.log('[Carol AI] 📅 Sessões para opções (Opção 1/2):', {
      count: workshopSessions.length,
      hasError: !!sessionsError,
      sessions: workshopSessions.map(s => ({
        id: s.id,
        title: s.title,
        starts_at: s.starts_at,
        zoom_link: s.zoom_link ? s.zoom_link.substring(0, 50) + '...' : null
      }))
    })

    // Se a pessoa pediu para reagendar (ou disse que não consegue participar), responder com opções e NÃO reenviar link.
    // IMPORTANTE: excluir o horário que a pessoa acabou de recusar (workshop_session_id) para não repetir ex.: "terça 15h" quando ela disse que não pode nesse horário
    if (desagendarResponse && shouldOfferRescheduleOptions && workshopSessions.length > 0) {
      const sessionsForReschedule = workshopSessionId
        ? workshopSessions.filter((s) => s.id !== workshopSessionId)
        : workshopSessions
      if (sessionsForReschedule.length > 0) {
        const optText = buildWorkshopOptionsText(sessionsForReschedule, 'bold')
        desagendarResponse = `${desagendarResponse}\n\nQual horário fica melhor pra você?\n\n${optText}\n\nMe responde com 1 ou 2 🙂`
      } else {
        desagendarResponse = `${desagendarResponse}\n\nEstou verificando outras datas disponíveis. Em instantes te mando as opções! 😊`
      }
    }

    // ✅ Prioridade máxima: se vai reagendar/cancelar, responder AGORA e não continuar para detecção de escolha/link.
    if (desagendarResponse) {
      const instanceToSend = await getZApiInstance(area || 'nutri')
      if (instanceToSend?.token) {
        await sendWhatsAppMessage(phone, desagendarResponse, instanceToSend.instance_id, instanceToSend.token)
        await supabaseAdmin.from('whatsapp_messages').insert({
          conversation_id: conversationId,
          instance_id: instanceToSend.id,
          z_api_message_id: null,
          sender_type: 'bot',
          sender_name: 'Carol - Secretária',
          message: desagendarResponse,
          message_type: 'text',
          status: 'sent',
          is_bot_response: true,
        })
      }

      // Atualizar contexto com estado leve (router)
      const nextTags = Array.isArray((context as any)?.tags) ? (context as any).tags : tags
      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          last_message_at: nowIso,
          last_message_from: 'bot',
          context: {
            ...(context as any),
            tags: nextTags,
            last_bot_intent: shouldOfferRescheduleOptions ? 'ask_reschedule_choice' : 'cancelled',
            last_bot_template: shouldOfferRescheduleOptions ? 'reschedule_choice_v1' : 'cancelled_v1',
            last_bot_at: nowIso,
          },
        })
        .eq('id', conversationId)

      return { success: true, response: desagendarResponse }
    }

    // 3. Verificar histórico para detectar primeira mensagem (incluir message para detectar fluxo workshop na escolha 1/2)
    const { data: messageHistory } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('id, sender_type, created_at, message')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    const customerMessages = messageHistory?.filter(m => m.sender_type === 'customer') || []
    const rawIsFirstMessage = customerMessages.length === 1
    const firstCustomerMessageText = customerMessages[0] ? String((customerMessages[0] as any)?.message ?? '').trim().toLowerCase().replace(/\s+/g, ' ') : ''
    // Inclui "acabei de me inscrever", "fiz o cadastro", "acabei de fazer o cadastro", "recebi o cadastro", "me cadastrei", etc.
    const workshopFirstMessagePattern = /acabei\s+de\s+me\s+inscrever|me\s+inscrev(i|er)|gostaria\s+de\s+agendar|inscrev(er|i).*aula|ylada\s+nutri.*agendar|(acabei\s+de\s+)?(fazer|fiz)\s+(o\s+)?cadastro|recebi\s+(o\s+)?cadastro|(me\s+)?cadastr(ei|ar)|fiz\s+(o\s+)?cadastro/i
    const firstMessageIsWorkshop = !!firstCustomerMessageText && workshopFirstMessagePattern.test(firstCustomerMessageText)

    // a3: Se o form já enviou boas-vindas com opções, não reenviar bloco de "primeira mensagem"
    let formAlreadySentWelcome = false
    if (rawIsFirstMessage && (tags.includes('veio_aula_pratica') || tags.includes('recebeu_link_workshop'))) {
      const { data: botMessages } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('message')
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'bot')
      const hasWelcomeWithOptions = botMessages?.some((m: { message?: string | null }) =>
        /qual\s*voc[eê]\s*prefere/i.test(String(m?.message ?? ''))
      )
      formAlreadySentWelcome = !!hasWelcomeWithOptions
    }

    // a4: Não reenviar boas-vindas/opções para "Ok" e mensagens curtas/neutras
    const shortNeutralWords = ['ok', 'certo', 'beleza', 'tudo bem', 'tudo bom', 'sim', 'não', 'nao', 'ah', 'tá', 'ta', 'pronto', 'entendi', 'obrigada', 'obrigado', 'valeu', 'blz', 'legal']
    const msgNorm = message.trim().toLowerCase().replace(/\s+/g, ' ')
    const deniesSignup = /(n[aã]o)\s+(me\s+)?(inscrevi|inscreveu|cadastrei|cadastrei|fiz\s+inscri[cç][aã]o|me\s+cadastrei)/i.test(msgNorm) ||
      /n(ã|a)o\s+me\s+inscrevi|n(ã|a)o\s+fiz\s+inscri(c|ç)(a|ã)o/i.test(msgNorm)
    // "1" e "2" são escolha de opção, não resposta neutra — não responder "Qualquer dúvida, é só me chamar!"
    const isChoiceOnly = (workshopSessions.length >= 1 && (msgNorm === '1' || msgNorm === '2'))
    const isShortNeutralReply = !isChoiceOnly && (
      shortNeutralWords.includes(msgNorm) ||
      (msgNorm.length <= 4 && !msgNorm.endsWith('?'))
    )

    // a5: Mensagem do botão ou texto equivalente ("Acabei de me inscrever", "fiz o cadastro", "acabei de fazer o cadastro", etc.)
    const isMessageFromButton = workshopFirstMessagePattern.test(msgNorm)

    // a6: Origem "tirar dúvida" / página de vendas — só para tag e relatório; fluxo é o mesmo (aula gratuita + autonomia).
    const isFromVideoOrLandingDuvida = rawIsFirstMessage && (
      /assisti\s+o\s+v[ií]deo|vi\s+o\s+v[ií]deo|tirar\s+d[uú]vida|gostaria\s+de\s+tirar\s+d[uú]vidas?|estou\s+na\s+p[aá]gina\s+(da\s+)?(ylada\s+)?nutri|p[aá]gina\s+de\s+vendas/i.test(msgNorm)
    )
    // Fluxo "tirar dúvida do vídeo": Carol envia só 1 mensagem automática, notifica outro número e não responde mais (humano assume).
    const isTirarDuvidaVideoFlow = rawIsFirstMessage && isFromVideoOrLandingDuvida

    // 4. Verificar se participou ou não
    // 🚫 Regra definitiva: quem já PARTICIPOU nunca deve cair em "primeira mensagem"/boas-vindas.
    const participated = tags.includes('participou_aula') || tags.includes('participou')
    const suppressWelcomeFlow = participated

    // Na primeira mensagem da conversa, NÃO bloquear por isShortNeutralReply: a Z-API pode enviar
    // só buttonId (texto curto) no clique do botão "Acabei de me inscrever..."; a Carol deve responder.
    const isFirstMessage =
      rawIsFirstMessage &&
      !suppressWelcomeFlow &&
      !formAlreadySentWelcome &&
      (!isShortNeutralReply || rawIsFirstMessage) &&
      !deniesSignup

    console.log('[Carol AI] 🔍 Detecção de primeira mensagem:', {
      conversationId,
      totalMessages: messageHistory?.length || 0,
      customerMessages: customerMessages.length,
      rawIsFirstMessage,
      formAlreadySentWelcome,
      isShortNeutralReply,
      isMessageFromButton,
      isFromVideoOrLandingDuvida,
      suppressWelcomeFlow,
      isFirstMessage,
      hasWorkshopTag: tags.includes('veio_aula_pratica') || tags.includes('recebeu_link_workshop'),
      workshopSessionId
    })
    
    const hasScheduled = tags.includes('recebeu_link_workshop') || workshopSessionId
    const scheduledDate = context.scheduled_date || null

    // (Desativado) Pergunta inicial 1/2/3 foi removida para reduzir ambiguidade e ir direto para horários 1/2.

    // 5. Verificar se a pessoa está escolhendo uma opção de aula
    // Detectar escolha: "1", "opção 1", "primeira", "segunda às 10:00", etc
    let selectedSession: { id: string; title: string; starts_at: string; zoom_link: string } | null = null
    
    if (workshopSessions.length > 0) {
      const messageLower = message.toLowerCase().trim()

      // Só tratar "1/2" como escolha quando a última mensagem do bot pediu escolha de horário.
      // Isso evita falsos positivos quando a pessoa responde "1" a outras perguntas (ex.: nível/diagnóstico).
      const lastIntent = String((context as any)?.last_bot_intent ?? '')
      const { data: lastBotMsg } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('message')
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'bot')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      const lastBotText = String((lastBotMsg as any)?.message ?? '').toLowerCase()
      const lastBotAskedForChoice =
        lastIntent === 'ask_schedule_choice' ||
        /responde\s*1\s*ou\s*2|me\s+responde\s+com\s+1\s+ou\s+2|qual\s+(desses\s+)?hor[aá]rio/i.test(lastBotText)
      // Aceitar "1"/"2" mesmo sem lastBotAskedForChoice quando a primeira mensagem foi do fluxo workshop (ex.: Carol não respondeu a tempo)
      const hasWorkshopOptionsFromFormEarly = Array.isArray(context.workshop_options_ids) && (context.workshop_options_ids as string[]).length > 0
      const inWorkshopFlowByTagOrFirstMsg = firstMessageIsWorkshop || tags.includes('veio_aula_pratica') || tags.includes('recebeu_link_workshop') || hasWorkshopOptionsFromFormEarly
      const acceptPlain1or2WithoutLastBot = inWorkshopFlowByTagOrFirstMsg && workshopSessions.length >= 1
      if ((messageLower === '1' || messageLower === '2') && workshopSessions.length > 0) {
        console.log('[Carol AI] 🔢 Escolha 1/2:', {
          conversationId,
          message: messageLower,
          lastBotAskedForChoice,
          firstMessageIsWorkshop,
          firstCustomerMessagePreview: firstCustomerMessageText.substring(0, 60),
          inWorkshopFlowByTagOrFirstMsg,
          acceptPlain1or2WithoutLastBot,
          workshopSessionsCount: workshopSessions.length,
        })
      }
      
      // Detectar por número: "1", "opção 1", "primeira", "segundo", "prefiro a primeira", etc
      const numberMatch = messageLower.match(/(?:opção|opcao|op|escolho|prefiro|quero)\s*(?:a\s*)?(\d+)|^(\d+)$|(primeira|segunda|terceira|quarta|quinta)|(?:prefiro|escolho|quero)\s*(?:a\s*)?(primeira|segunda|terceira|quarta|quinta)/)
      
      if (numberMatch) {
        let optionIndex = -1
        if (numberMatch[1]) {
          optionIndex = parseInt(numberMatch[1]) - 1
        } else if (numberMatch[2]) {
          // Mensagem é só "1" ou "2": aceitar quando a Carol pediu escolha OU quando o fluxo é workshop (primeira msg foi inscrição)
          if (lastBotAskedForChoice || acceptPlain1or2WithoutLastBot) {
            optionIndex = parseInt(numberMatch[2]) - 1
          } else {
            optionIndex = -1
          }
        } else if (numberMatch[3]) {
          // Também só aceitar "primeira/segunda" como escolha se a última msg pediu escolha de horário.
          if (lastBotAskedForChoice) {
            const words: Record<string, number> = {
              'primeira': 0,
              'segunda': 1,
              'terceira': 2,
              'quarta': 3,
              'quinta': 4
            }
            optionIndex = words[numberMatch[3]] || -1
          } else {
            optionIndex = -1
          }
        } else if (numberMatch[4]) {
          if (lastBotAskedForChoice) {
            const words: Record<string, number> = {
              'primeira': 0,
              'segunda': 1,
              'terceira': 2,
              'quarta': 3,
              'quinta': 4
            }
            optionIndex = words[numberMatch[4]] || -1
          } else {
            optionIndex = -1
          }
        }
        
        if (optionIndex >= 0) {
          // Priorizar a ordem exata que a pessoa viu: workshop_options_ids foi gravado pelo form ao enviar "Opção 1/2"
          const optionIds = Array.isArray(context.workshop_options_ids) ? (context.workshop_options_ids as string[]) : null
          const chosenId = (optionIds && optionIds[optionIndex] != null) ? optionIds[optionIndex] : workshopSessions[optionIndex]?.id
          let sessionToUse = chosenId ? workshopSessions.find((s: { id: string }) => s.id === chosenId) : null
          if (!sessionToUse && optionIndex < workshopSessions.length) sessionToUse = workshopSessions[optionIndex]
          // Fallback: mensagem é só "1" ou "2" — usar diretamente a sessão pela ordem
          if (!sessionToUse && optionIndex < workshopSessions.length) sessionToUse = workshopSessions[optionIndex]
          // Se a pessoa respondeu "2" mas só temos 1 sessão, usar a primeira (evita não responder)
          if (!sessionToUse && workshopSessions.length > 0) sessionToUse = workshopSessions[0]
          if (sessionToUse) {
            const { weekday, date, time } = formatSessionDateTime(sessionToUse.starts_at)
            console.log('[Carol AI] ✅ Sessão detectada por número/ordem:', {
              optionIndex: optionIndex + 1,
              sessionId: sessionToUse.id,
              weekday,
              date,
              time,
              starts_at: sessionToUse.starts_at,
              message: messageLower,
              usedWorkshopOptionsIds: !!optionIds
            })
            selectedSession = {
              id: sessionToUse.id,
              title: sessionToUse.title,
              starts_at: sessionToUse.starts_at,
              zoom_link: sessionToUse.zoom_link
            }
          } else {
            console.log('[Carol AI] ⚠️ Índice de opção inválido ou sessão não encontrada:', {
              optionIndex,
              chosenId: chosenId ?? '(nenhum)',
              sessionsCount: workshopSessions.length,
              message: messageLower
            })
          }
        }
      }
      
      // Detectar por dia da semana quando a mensagem pede "link da quarta", "opção quarta", "quarta 9h", etc.
      // "quarta" aqui é dia da semana (quarta-feira), não a 4ª opção — só temos Opção 1 e Opção 2.
      if (!selectedSession) {
        const weekdayKeywords: Record<string, string> = {
          'segunda': 'segunda', 'terça': 'terça', 'terca': 'terça', 'quarta': 'quarta', 'quinta': 'quinta',
          'sexta': 'sexta', 'sábado': 'sábado', 'sabado': 'sábado', 'domingo': 'domingo'
        }
        for (const sessionItem of workshopSessions) {
          const { weekday } = formatSessionDateTime(sessionItem.starts_at)
          const weekdayLower = weekday.toLowerCase()
          for (const [key, _] of Object.entries(weekdayKeywords)) {
            if (weekdayLower.includes(key) && messageLower.includes(key)) {
              selectedSession = {
                id: sessionItem.id,
                title: sessionItem.title,
                starts_at: sessionItem.starts_at,
                zoom_link: sessionItem.zoom_link
              }
              console.log('[Carol AI] ✅ Sessão detectada por dia da semana:', {
                sessionId: sessionItem.id,
                weekday,
                key,
                message: messageLower
              })
              break
            }
          }
          if (selectedSession) break
        }
      }

      // Detectar por dia/horário: "segunda às 10:00", "26/01 às 10:00", "9h", "amanhã 9h", etc
      if (!selectedSession) {
        // Extrair números de horário da mensagem (ex: "10", "15", "9", "20")
        const hourMatches = messageLower.match(/\b(\d{1,2})\s*(?:h|hs|horas|:)/g)
        const hoursInMessage: number[] = []
        if (hourMatches) {
          hourMatches.forEach(match => {
            const hour = parseInt(match.replace(/\D/g, ''))
            if (hour >= 0 && hour <= 23) {
              hoursInMessage.push(hour)
            }
          })
        }
        
        // Se não encontrou padrão "10h", tentar números soltos que podem ser horários
        if (hoursInMessage.length === 0) {
          const numberMatches = messageLower.match(/\b([0-9]|1[0-9]|2[0-3])\b/g)
          if (numberMatches) {
            numberMatches.forEach(match => {
              const hour = parseInt(match)
              if (hour >= 0 && hour <= 23) {
                hoursInMessage.push(hour)
              }
            })
          }
        }

        console.log('[Carol AI] 🔍 Detecção de horário:', {
          message: messageLower,
          hoursInMessage,
          sessions: workshopSessions.map(s => {
            const { weekday, date, time } = formatSessionDateTime(s.starts_at)
            const hour = parseInt(time.split(':')[0])
            return { weekday, time, hour, starts_at: s.starts_at }
          })
        })

        for (const sessionItem of workshopSessions) {
          const { weekday, date, time } = formatSessionDateTime(sessionItem.starts_at)
          const weekdayLower = weekday.toLowerCase()
          const sessionHour = parseInt(time.split(':')[0]) // Extrair apenas a hora (ex: "10:00" -> 10)
          
          // Verificar se mensagem contém dia da semana ou data
          const hasDayMatch = 
            messageLower.includes(weekdayLower.substring(0, 5)) || // "segunda", "terça", etc
            messageLower.includes(date.replace(/\//g, '')) || // "26012026"
            messageLower.includes(date.split('/')[0]) // "26"
          
          // Verificar se menciona horário de várias formas
          const hasTimeMatch = 
            messageLower.includes(time.replace(':', '')) || // "10:00" -> "1000"
            messageLower.includes(time) || // "10:00"
            messageLower.includes(`${sessionHour}h`) || // "10h"
            messageLower.includes(`${sessionHour}hs`) || // "10hs"
            messageLower.includes(`${sessionHour} horas`) || // "10 horas"
            hoursInMessage.includes(sessionHour) // Número extraído corresponde ao horário
          
          if (hasDayMatch && hasTimeMatch) {
            console.log('[Carol AI] ✅ Sessão detectada por dia/horário:', {
              sessionId: sessionItem.id,
              weekday,
              time,
              hour: sessionHour,
              message: messageLower
            })
            selectedSession = {
              id: sessionItem.id,
              title: sessionItem.title,
              starts_at: sessionItem.starts_at,
              zoom_link: sessionItem.zoom_link
            }
            break
          }
          
          // Se não encontrou dia mas encontrou horário exato, usar mesmo assim
          // (útil quando pessoa diz "10h", "15h", "15:00 horas", "Opção 2 às 15:00")
          const onlyOneHourOrMatches = hoursInMessage.length === 1 || hoursInMessage.includes(sessionHour)
          if (!selectedSession && hasTimeMatch && onlyOneHourOrMatches) {
            console.log('[Carol AI] ✅ Sessão detectada apenas por horário:', {
              sessionId: sessionItem.id,
              time,
              hour: sessionHour,
              message: messageLower
            })
            selectedSession = {
              id: sessionItem.id,
              title: sessionItem.title,
              starts_at: sessionItem.starts_at,
              zoom_link: sessionItem.zoom_link
            }
            break
          }
        }
        
        // Nota: preferência por período (manhã/tarde/noite) NÃO deve auto-selecionar sessão nem enviar link.
        // Isso é tratado na resposta da Carol (enviar opções e pedir "1 ou 2"), para evitar enviar link cedo demais.
      }

      // Se a última mensagem do bot foi o convite "Hoje temos aula às 20h. Gostaria de participar?" e a pessoa respondeu "quero"/"sim", enviar link da aula de hoje à noite (não reenviar recepção)
      const lastBotWasHoje20hInvite = /hoje\s+temos\s+aula|gostaria\s+de\s+participar/i.test(lastBotText)
      const isPositiveInterest =
        /^(sim|quero|tenho\s+interesse|tenho\s+sim|gostaria|quero\s+sim|com\s+certeza|pode\s+ser|pode\s+encaixar|claro|por\s+favor|tem\s+interesse)$/i.test(msgNorm.trim()) ||
        /^(sim\s+quero|quero\s+sim|gostaria\s+sim|sim\s+gostaria)$/i.test(msgNorm.trim())
      if (!selectedSession && workshopSessions.length > 0 && lastBotWasHoje20hInvite && isPositiveInterest) {
        const tzBR = 'America/Sao_Paulo'
        const todayStrBR = new Date().toLocaleDateString('en-CA', { timeZone: tzBR })
        const sessionHoje20h = workshopSessions.find((s: { starts_at: string }) => {
          const d = new Date(s.starts_at)
          const sessionDateStr = d.toLocaleDateString('en-CA', { timeZone: tzBR })
          const sessionHour = parseInt(d.toLocaleString('pt-BR', { hour: '2-digit', hour12: false, timeZone: tzBR }), 10)
          return sessionDateStr === todayStrBR && sessionHour === 20
        })
        if (sessionHoje20h) {
          selectedSession = {
            id: sessionHoje20h.id,
            title: sessionHoje20h.title,
            starts_at: sessionHoje20h.starts_at,
            zoom_link: sessionHoje20h.zoom_link,
          }
          console.log('[Carol AI] ✅ Resposta ao convite "Hoje 20h": enviando link da aula de hoje à noite', {
            sessionId: selectedSession.id,
            message: msgNorm.substring(0, 40),
          })
        }
      }
    }

    // Se a pessoa confirmou interesse ("sim", "quero", "ok", etc.): enviar link da próxima sessão
    // 1) Remarketing (não participou) ou 2) Fluxo nutri com uma data só (próxima quarta 20h) — quem ainda não recebeu link
    const isRemarketingNaoParticipou = tags.includes('nao_participou_aula') || tags.includes('remarketing_enviado')
    const isPositiveInterestReply =
      /^(sim|quero|tenho\s+interesse|tenho\s+sim|gostaria|quero\s+sim|com\s+certeza|pode\s+ser|pode\s+encaixar|claro|por\s+favor|tem\s+interesse|ok|beleza|tudo\s+bem)$/i.test(msgNorm.trim()) ||
      /^(sim\s+quero|quero\s+sim|gostaria\s+sim|sim\s+gostaria)$/i.test(msgNorm.trim())
    const naoRecebeuLinkAinda = !tags.includes('recebeu_link_workshop') && !workshopSessionId
    const noFluxoWorkshopAindaSemLink =
      (tags.includes('veio_aula_pratica') || firstMessageIsWorkshop) && naoRecebeuLinkAinda
    if (
      !selectedSession &&
      workshopSessions.length > 0 &&
      isPositiveInterestReply &&
      (isRemarketingNaoParticipou || noFluxoWorkshopAindaSemLink)
    ) {
      selectedSession = workshopSessions[0]
      console.log('[Carol AI] ✅ Confirmação de interesse: enviando link da próxima sessão', {
        sessionId: selectedSession.id,
        remarketing: isRemarketingNaoParticipou,
        fluxoNutriUmaData: noFluxoWorkshopAindaSemLink,
        message: msgNorm.substring(0, 50),
      })
    }

    // Se detectou escolha, enviar imagem + link e retornar
    // Enviar link quando: tem tag de workshop OU o form já gravou workshop_options_ids OU a primeira mensagem foi de inscrição (fluxo workshop mesmo sem tag).
    const hasWorkshopOptionsFromForm = Array.isArray(context.workshop_options_ids) && context.workshop_options_ids.length > 0
    const isInWorkshopFlow = tags.includes('veio_aula_pratica') || tags.includes('recebeu_link_workshop') || hasWorkshopOptionsFromForm || (!!selectedSession && firstMessageIsWorkshop)
    if (selectedSession && isInWorkshopFlow) {
      console.log('[Carol AI] ✅ Escolha detectada (conversa no fluxo workshop):', {
        sessionId: selectedSession.id,
        startsAt: selectedSession.starts_at,
        message
      })
      
      // Buscar instância Z-API
      const isUUID = instanceId.includes('-') && instanceId.length === 36
      const { data: instance } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token, status')
        .eq(isUUID ? 'id' : 'instance_id', instanceId)
        .single()
      
      if (!instance) {
        console.error('[Carol AI] ❌ Instância não encontrada para enviar imagem')
        // Continuar com resposta normal
      } else {
        // Buscar configurações do workshop (flyer)
        const { data: settings } = await supabaseAdmin
          .from('whatsapp_workshop_settings')
          .select('flyer_url, flyer_caption')
          .eq('area', area)
          .maybeSingle()
        
        const flyerUrl = settings?.flyer_url
        const flyerCaption = settings?.flyer_caption || ''
        
        const client = createZApiClient(instance.instance_id, instance.token)
        const { weekday, date, time } = formatSessionDateTime(selectedSession.starts_at)
        
        // 1. Enviar imagem do flyer (se configurado)
        if (flyerUrl) {
          const caption = flyerCaption?.trim() 
            ? flyerCaption 
            : `${selectedSession.title}\n${weekday}, ${date} • ${time}`
          
          const imageResult = await client.sendImageMessage({
            phone,
            image: flyerUrl,
            caption,
          })
          
          if (imageResult.success) {
            // Salvar mensagem da imagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conversationId,
              instance_id: instance.id,
              z_api_message_id: imageResult.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message: caption,
              message_type: 'image',
              media_url: flyerUrl,
              status: 'sent',
              is_bot_response: true,
            })
          }
        }
        
        // 2. Enviar mensagem com link (mais entusiasmada e criando expectativa)
        // Nota: Não usar emoji 📅 pois ele mostra a data atual do sistema, não a data da aula
        const linkMessage = `✅ *Perfeito! Você vai adorar essa aula!* 🎉\n\n🗓️ ${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n🔗 ${selectedSession.zoom_link}\n\n💡 *Dica importante:* A sala do Zoom será aberta 10 minutos antes do horário da aula. Chegue com antecedência para garantir sua vaga! 😊\n\nQualquer dúvida, é só me chamar! 💚`
        
        const textResult = await client.sendTextMessage({
          phone,
          message: linkMessage,
        })
        
        if (textResult.success) {
          // Salvar mensagem do link
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conversationId,
            instance_id: instance.id,
            z_api_message_id: textResult.id || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message: linkMessage,
            message_type: 'text',
            status: 'sent',
            is_bot_response: true,
          })
          
          // Atualizar contexto da conversa
          const prevContext = context
          const prevTags = Array.isArray(prevContext.tags) ? prevContext.tags : []
          const newTags = [...new Set([...prevTags, 'recebeu_link_workshop', 'agendou_aula'])]
      const nowIso = new Date().toISOString()
          
          // 🆕 Verificar tempo restante e enviar lembrete apropriado
          // Usar timezone de Brasília para cálculo correto
          const sessionDate = new Date(selectedSession.starts_at)
          const now = new Date()
          const nowBrasilia = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
          const sessionBrasilia = new Date(sessionDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
          const timeDiff = sessionBrasilia.getTime() - nowBrasilia.getTime()
          const hoursDiff = timeDiff / (1000 * 60 * 60)
          
          // Buscar nome do cadastro para usar no lembrete (apenas primeiro nome; nunca nota interna)
          const registrationNameForReminder = await getRegistrationName(phone, area)
          const safeConvNameReminder = conversation.name && !isInvalidOrInternalName(conversation.name) ? conversation.name : ''
          const leadNameForReminder = getFirstName(registrationNameForReminder || safeConvNameReminder) || 'querido(a)'
          
          // Se está entre 12h e 13h antes, já enviar lembrete de 12h
          // Se está entre 2h e 2h30 antes, já enviar lembrete de 2h
          let reminderToSend: string | null = null
          if (hoursDiff >= 12 && hoursDiff < 13) {
            // Lembrete de 12h (recomendação computador)
            const { weekday, date, time } = formatSessionDateTime(selectedSession.starts_at)
            reminderToSend = `Olá ${leadNameForReminder}! 

Sua aula é hoje às ${time}! 

💻 *Recomendação importante:*

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.

🔗 ${selectedSession.zoom_link}
`
          } else if (hoursDiff >= 2 && hoursDiff < 2.5) {
            // Lembrete de 2h (aviso Zoom)
            const { weekday, date, time } = formatSessionDateTime(selectedSession.starts_at)
            reminderToSend = `${leadNameForReminder ? `Olá ${leadNameForReminder}! ` : ''}Só um aviso: começaremos pontualmente na ${weekday}, ${date} às ${time} (horário de Brasília).

💡 Dicas: use o computador, tenha caneta e papel à mão e mantenha a câmera aberta — é uma aula prática.

⚠️ Após 10 minutos do início não será mais permitida a entrada.

Nos vemos em breve! 😊
`
          }
          
          const { weekday: _w, date: _d, time: _t } = formatSessionDateTime(selectedSession.starts_at)
          console.log('[Carol AI] 📌 Gravando workshop_session_id (escolha detectada):', {
            conversationId,
            workshop_session_id: selectedSession.id,
            scheduled_date: selectedSession.starts_at,
            sessionSummary: `${_w}, ${_d} • ${_t}`,
            messagePreview: message?.substring(0, 60)
          })
          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...prevContext,
                tags: newTags,
                workshop_session_id: selectedSession.id,
                scheduled_date: selectedSession.starts_at,
            last_link_sent_at: nowIso,
            last_bot_intent: 'sent_zoom_link',
            last_bot_template: 'zoom_link_v1',
            last_bot_at: nowIso,
              },
              last_message_at: new Date().toISOString(),
              last_message_from: 'bot',
            })
            .eq('id', conversationId)
          
          // 🆕 Enviar notificação para telefone de notificação sobre o agendamento
          try {
            const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
            if (notificationPhone) {
              const conversation = await supabaseAdmin
                .from('whatsapp_conversations')
                .select('name, phone')
                .eq('id', conversationId)
                .single()
              
              if (conversation.data) {
                const { weekday, date, time } = formatSessionDateTime(selectedSession.starts_at)
                const notificationMessage = `🎉 *NOVO AGENDAMENTO DE AULA!*\n\n👤 *Nome:* ${conversation.data.name || 'Sem nome'}\n📱 *Telefone:* ${conversation.data.phone}\n🗓️ *Data/Hora:* ${weekday}, ${date} às ${time}\n🔗 *Link Zoom:* ${selectedSession.zoom_link}\n\n✅ A pessoa já recebeu o link da aula!`
                
                // Buscar instância Z-API para enviar notificação
                const { data: notificationInstance } = await supabaseAdmin
                  .from('z_api_instances')
                  .select('instance_id, token')
                  .eq('status', 'connected')
                  .limit(1)
                  .maybeSingle()
                
                if (notificationInstance) {
                  const notificationClient = createZApiClient({
                    instanceId: notificationInstance.instance_id,
                    token: notificationInstance.token,
                  })
                  
                  await notificationClient.sendTextMessage({
                    phone: notificationPhone,
                    message: notificationMessage,
                  })
                  
                  console.log('[Carol AI] ✅ Notificação de agendamento enviada para', notificationPhone)
                } else {
                  console.warn('[Carol AI] ⚠️ Instância Z-API não encontrada para enviar notificação')
                }
              }
            }
          } catch (notificationError: any) {
            console.error('[Carol AI] ❌ Erro ao enviar notificação de agendamento:', notificationError)
            // Não falhar o agendamento se a notificação falhar
          }
          
          // 🆕 Enviar lembrete imediatamente se necessário
          if (reminderToSend) {
            setTimeout(async () => {
              try {
                const reminderResult = await client.sendTextMessage({
                  phone,
                  message: reminderToSend!,
                })
                
                if (reminderResult.success) {
                  await supabaseAdmin.from('whatsapp_messages').insert({
                    conversation_id: conversationId,
                    instance_id: instance.id,
                    z_api_message_id: reminderResult.id || null,
                    sender_type: 'bot',
                    sender_name: 'Carol - Secretária',
                    message: reminderToSend!,
                    message_type: 'text',
                    status: 'sent',
                    is_bot_response: true,
                  })
                  
                  // Marcar que já enviou esse lembrete
                  const notificationKey = `pre_class_${selectedSession.id}`
                  const updatedContext = {
                    ...prevContext,
                    tags: newTags,
                    workshop_session_id: selectedSession.id,
                    scheduled_date: selectedSession.starts_at,
                    [notificationKey]: hoursDiff >= 12 ? { sent_12h: true } : { sent_2h: true },
                  }
                  
                  await supabaseAdmin
                    .from('whatsapp_conversations')
                    .update({ context: updatedContext })
                    .eq('id', conversationId)
                }
              } catch (error: any) {
                console.error('[Carol] Erro ao enviar lembrete imediato:', error)
              }
            }, 2000) // Aguardar 2 segundos antes de enviar
          }
          
          return { success: true, response: linkMessage }
        }
      }
    }

    // 5. Buscar histórico de mensagens (aumentado para 30 para melhor contexto)
    // Incluir mensagens com status usado na prática: sent, delivered, read (não 'active' — tabela usa sent/delivered)
    const { data: messages } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('sender_type, message, created_at')
      .eq('conversation_id', conversationId)
      .in('status', ['sent', 'delivered', 'read', 'active'])
      .order('created_at', { ascending: true })
      .limit(30) // Aumentado de 20 para 30 mensagens

    const conversationHistory = (messages || [])
      .filter(m => m.sender_type === 'customer' || m.sender_type === 'bot' || m.sender_type === 'agent')
      .filter(m => m.message && m.message.trim().length > 0) // Apenas mensagens com conteúdo
      .map(m => ({
        role: m.sender_type === 'customer' ? 'user' as const : 'assistant' as const,
        content: m.message || '',
      }))
    
    console.log('[Carol AI] 📚 Histórico carregado:', {
      totalMessages: messages?.length || 0,
      filteredHistory: conversationHistory.length,
      lastMessages: conversationHistory.slice(-5).map(m => ({
        role: m.role,
        preview: m.content.substring(0, 50)
      }))
    })

    // 6. Buscar nome do cadastro usando função helper (prioridade sobre nome do WhatsApp)
    let registrationName: string | null = null
    try {
      registrationName = await getRegistrationName(phone, area)
      
      // Atualizar lead_name no context se encontrou nome do cadastro
      if (registrationName && registrationName !== (context as any)?.lead_name) {
        await supabaseAdmin
          .from('whatsapp_conversations')
          .update({
            context: {
              ...context,
              lead_name: registrationName
            }
          })
          .eq('id', conversationId)
        
        // Atualizar context local
        context.lead_name = registrationName
      }
    } catch (error: any) {
      console.warn('[Carol AI] Erro ao buscar nome do cadastro:', error.message)
    }

    // Persistir ordem Opção 1/2 quando Carol envia opções na primeira mensagem (form já grava; aqui cobre fluxo sem form)
    if (isFirstMessage && workshopSessions.length > 0) {
      const optionIds = workshopSessions.map(s => s.id)
      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context: {
            ...context,
            workshop_options_ids: optionIds,
          },
        })
        .eq('id', conversationId)
      ;(context as any).workshop_options_ids = optionIds
    }

    // 7. Gerar resposta da Carol
    console.log('[Carol AI] 💭 Gerando resposta com contexto:', {
      tags,
      hasSessions: workshopSessions.length > 0,
      leadName: registrationName || (context as any)?.lead_name || conversation.name,
      hasScheduled,
      participated,
      isFirstMessage
    })

    // 🆕 Nome da pessoa: APENAS do cadastro (workshop_inscricoes/contact_submissions) ou lead_name já salvo.
    // NUNCA usar como nome: "Nutri", "Inge", "Lá no remarketing...", display_name/editado pela nutri (nota interna).
    const conv = conversation as { name?: string | null; customer_name?: string | null }
    const waName = (context as any)?.wa_name as string | undefined
    const displayName = (context as any)?.display_name as string | undefined
    const convNameOk = conversation.name && !isInvalidOrInternalName(conversation.name)
    const customerNameOk = conv?.customer_name && !isInvalidOrInternalName(conv.customer_name)
    const displayNameOk = displayName && !isInvalidOrInternalName(displayName)
    let rawName =
      registrationName ||
      (context as any)?.lead_name ||
      (isLikelyPersonName(waName) ? waName : '') ||
      (convNameOk ? conversation.name : '') ||
      (customerNameOk ? conv?.customer_name : '') ||
      (displayNameOk ? displayName : '') ||
      ''
    if (isBusinessName(rawName) || isInvalidOrInternalName(rawName)) {
      rawName = registrationName || (context as any)?.lead_name || ''
    }
    // Caso comum: pessoa clica no botão do WhatsApp com texto "Acabei de me inscrever..."
    // Se NÃO conseguimos match do cadastro (telefone diferente / preenchido errado), não use o nome do WhatsApp
    // (pode ser nome de marca, clínica, etc). Melhor: saudação neutra.
    if (isMessageFromButton && !registrationName && !(context as any)?.lead_name) {
      // Se não achamos cadastro, só usa o nome do WhatsApp se parecer nome de pessoa.
      rawName = isLikelyPersonName(waName) ? String(waName) : ''
    }
    // Se não temos nome confiável, não use "querido(a)" como nome — prefira saudação neutra.
    let leadName = getFirstName(rawName) || ''
    if (isBusinessName(leadName) || isInvalidOrInternalName(leadName)) leadName = ''

    // Se for primeira mensagem, enviar corpo curto com opções (sem IA).
    let cannedFirstMessageBody: string | null = null
    if (isTirarDuvidaVideoFlow) {
      // Fluxo "tirar dúvida do vídeo": só uma mensagem automática; depois humano assume. Carol não envia opções de aula.
      cannedFirstMessageBody = 'Que bom que você assistiu o vídeo! Como posso te ajudar?'
    } else if (!suppressWelcomeFlow && rawIsFirstMessage && !formAlreadySentWelcome && !isShortNeutralReply && deniesSignup) {
      cannedFirstMessageBody =
        `Entendi, obrigada por avisar 😊\n\nPode ser que seu número tenha sido usado por engano.\n\nVocê tem interesse em participar da aula prática para aprender a preencher sua agenda com mais constância?\n\nSe sim, eu te explico rapidinho e te mando o link oficial pra se inscrever.`
    } else if (isFirstMessage) {
      cannedFirstMessageBody = await buildFirstMessageOptionsBody(area || 'nutri', leadName, workshopSessions)
    }

    // Mensagem do botão: se for primeira mensagem (ninguém enviou nada ainda), Carol envia boas-vindas + opções.
    // Se já tinha mensagem nossa (form enviou), só resumo curto para não repetir.
    const carolInstructionFromContext = (context as any)?.carol_instruction
    let carolInstruction: string | undefined
    if (isMessageFromButton && !isFirstMessage) {
      const isNutriSingleDate = (area || '') === 'nutri'
      if (isNutriSingleDate) {
        carolInstruction = `A pessoa acabou de clicar no botão do workshop ("Acabei de me inscrever... gostaria de agendar"). NÃO repita boas-vindas. Diga em 1–2 frases que a próxima aula é na próxima quarta-feira às 20h e que você vai mandar o link por aqui antes da aula. Exemplo: "Oi! A próxima aula é na próxima quarta às 20h. Te mando o link por aqui antes da aula. Qualquer dúvida, é só me chamar! 😊"`
      } else {
        const fmtOpt = (s: { starts_at: string }) => {
          const d = new Date(s.starts_at)
          const w = d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long' })
          const t = d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })
          return `${w.charAt(0).toUpperCase() + w.slice(1)} ${t}`
        }
        const optionRecap =
          workshopSessions.length >= 2
            ? `Opção 1 ${fmtOpt(workshopSessions[0])}, Opção 2 ${fmtOpt(workshopSessions[1])}`
            : workshopSessions.length === 1
              ? `Opção 1 ${fmtOpt(workshopSessions[0])}`
              : ''
        carolInstruction = optionRecap
          ? `A pessoa acabou de clicar no botão do workshop ("Acabei de me inscrever... gostaria de agendar"). NÃO repita boas-vindas nem a lista completa de opções. Seja educada: faça um resumo curto das opções que já foram enviadas e pergunte qual horário funciona melhor. Responda usando exatamente este formato: "Oi! Como te enviei em cima: ${optionRecap}. Qual desses horários funciona melhor para você? 😊"`
          : 'A pessoa acabou de clicar no botão do workshop ("Acabei de me inscrever... gostaria de agendar"). NÃO repita boas-vindas nem a lista de opções. Responda em 1–2 frases, de forma educada: as opções foram enviadas acima (ou estão chegando) e pergunte qual horário funciona melhor. Exemplo: "Oi! As opções já foram enviadas na mensagem acima. Qual delas funciona melhor para você? 😊"'
      }
    } else if (isShortNeutralReply && (formAlreadySentWelcome || workshopSessions.length > 0)) {
      // Exceção: remarketing "não participou" — pessoa respondeu que TEM INTERESSE ("Sim", "Quero") → enviar opções de aula, NÃO "Qualquer dúvida..."
      const isRemarketingNaoParticipou = tags.includes('nao_participou_aula') || tags.includes('remarketing_enviado')
      const isPositiveInterestReply = /^(sim|quero|tenho\s+interesse|tenho\s+sim|gostaria|quero\s+sim|com\s+certeza|pode\s+ser|pode\s+encaixar|claro|por\s+favor|tem\s+interesse)$/i.test(msgNorm.trim())
      const msgLower = msgNorm.toLowerCase()
      const prefersNight =
        msgLower.includes('noite') || msgLower.includes('noturno') || msgLower.includes('noitinha') || msgLower.includes('a noite') || msgLower.includes('à noite')
      const prefersAfternoon = msgLower.includes('tarde') || msgLower.includes('a tarde') || msgLower.includes('à tarde')
      const prefersMorning =
        msgLower.includes('manhã') || msgLower.includes('manha') || msgLower.includes('de manhã') || msgLower.includes('de manha')
      const isPeriodReply = prefersNight || prefersAfternoon || prefersMorning

      if (participated) {
        // Pós-aula (participou): quando a pessoa só confirma/entende, não encerrar a conversa.
        // Puxar para fechamento com 1 pergunta simples, sem "script" de primeira conversa.
        carolInstruction = `Esta pessoa JÁ PARTICIPOU da aula (tag Participou). Você DEVE responder em 1–2 frases, SEM saudação e SEM boas-vindas.\n\nObjetivo: avançar para fechamento. Faça 1 pergunta simples para decidir o próximo passo (ex.: "Você prefere começar no mensal ou no anual?").`
      } else if (isRemarketingNaoParticipou && isPositiveInterestReply && workshopSessions.length > 0) {
        const isNutriSingleDate = (area || '') === 'nutri'
        carolInstruction = isNutriSingleDate
          ? `A pessoa acabou de responder que TEM INTERESSE ao remarketing. Ela disse algo como "Tenho sim".

Você DEVE responder de forma curta e objetiva, SEM saudação e SEM boas-vindas. Diga que a próxima aula é na próxima quarta-feira às 20h e que você vai mandar o link por aqui antes da aula. Exemplo: "A próxima aula é na próxima quarta às 20h. Te mando o link por aqui antes da aula. Qualquer dúvida, é só me chamar! 😊"`
          : `A pessoa acabou de responder que TEM INTERESSE ao remarketing ("Você ainda tem interesse em participar?"). Ela disse algo como "Tenho sim".

Você DEVE responder de forma curta e objetiva, SEM saudação e SEM boas-vindas. PROIBIDO escrever "Oi", "tudo bem", "Seja bem-vinda" ou "Eu sou a Carol". NÃO faça explicação longa.

Responda exatamente neste formato:

A próxima aula é prática e vai te ajudar a ter mais constância pra preencher sua agenda.

As próximas aulas acontecerão nos seguintes dias e horários:

[Inclua Opção 1 e Opção 2 com dia e hora, UMA VEZ cada]

Responde 1 ou 2 😊`
      } else if (isRemarketingNaoParticipou && isPeriodReply && workshopSessions.length > 0) {
        carolInstruction = `A pessoa respondeu com um período do dia (ex.: "tarde", "manhã" ou "noite") ao remarketing.

Você DEVE responder de forma curta e objetiva, SEM saudação e SEM boas-vindas. PROIBIDO escrever "Oi", "tudo bem", "Seja bem-vinda" ou "Eu sou a Carol". NÃO faça explicação longa.

Você deve listar as opções disponíveis. Se houver opção que combine com o período (ex.: tarde = 12h–17h, manhã = 6h–11h, noite = 18h–23h), coloque essa como Opção 1. Se não, mostre as opções normalmente.

Finalize com: "Responde 1 ou 2 😊".`
      } else {
        carolInstruction = 'A pessoa só confirmou/entendeu (ex.: "Entendi", "Ok", "Certo"). NÃO repita opções nem boas-vindas; responda em UMA frase curta e amigável, tipo "Qualquer dúvida, é só me chamar! 😊" ou "Fico no aguardo da sua escolha! 💚".'
      }
    } else if (isChoiceOnly && workshopSessions.length > 0) {
      // Pessoa disse "1" ou "2" (escolha) mas o link já foi/será enviado pelo sistema — não repetir opções nem "Ótima escolha!"
      carolInstruction = 'A pessoa escolheu uma opção (1 ou 2). Responda APENAS com esta frase, nada mais: "Perfeito! Você já vai receber o link em instantes. 😊"'
    } else if (/^(opção|opcao)\s*[12]|^\s*[12]\s*$|(\d{1,2}:\d{2}|\d{1,2}\s*h)/i.test(msgNorm.trim()) && workshopSessions.length > 0 && (tags.includes('veio_aula_pratica') || tags.includes('recebeu_link_workshop'))) {
      // Mensagem parece escolha (Opção 1/2, 15:00, 9h) no fluxo workshop — resposta mínima
      carolInstruction = 'A pessoa está escolhendo horário. Responda APENAS: "Perfeito! Você já vai receber o link em instantes. 😊" — nada mais, sem opções, sem "Ótima escolha!".'
    } else {
      carolInstruction = typeof carolInstructionFromContext === 'string' ? carolInstructionFromContext : undefined
    }

    // Primeira mensagem: enviar saudação em mensagem separada (evita bloco único e repetição)
    // Não enviar saudação longa quando for fluxo "tirar dúvida do vídeo" (só uma mensagem automática).
    if (isFirstMessage && workshopSessions.length > 0 && !isTirarDuvidaVideoFlow) {
      const isUUIDEarly = instanceId.includes('-') && instanceId.length === 36
      const { data: instanceEarly } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq(isUUIDEarly ? 'id' : 'instance_id', instanceId)
        .single()
      if (instanceEarly?.token) {
        const greetingTemplate = await getFlowTemplate(area || 'nutri', 'welcome_form_greeting')
        let greetingOnly = greetingTemplate
          ? applyTemplate(greetingTemplate, { nome: leadName })
          : (leadName
              ? `Oi, ${leadName}, tudo bem? 😊\n\nSeja muito bem-vinda!\n\nEu sou a Carol, da equipe Ylada Nutri.`
              : `Oi, tudo bem? 😊\n\nSeja muito bem-vinda!\n\nEu sou a Carol, da equipe Ylada Nutri.`)
        greetingOnly = applyWelcomeGender(greetingOnly, leadName)
        const sendGreeting = await sendWhatsAppMessage(
          phone,
          greetingOnly,
          instanceEarly.instance_id,
          instanceEarly.token
        )
        if (sendGreeting.success) {
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conversationId,
            instance_id: instanceEarly.id,
            z_api_message_id: sendGreeting.messageId || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message: greetingOnly,
            message_type: 'text',
            status: 'sent',
            is_bot_response: true,
          })
          // Se temos corpo pronto (template/fallback curto), não precisamos da IA aqui.
          // Ainda assim, mantém instrução para caso caia na IA por qualquer motivo.
          carolInstruction = `PROIBIDO repetir a saudação. Sua mensagem NÃO pode conter "Oi" / "tudo bem?" / "Seja muito bem-vindo(a)!" / "Eu sou a Carol" — isso já foi enviado na mensagem anterior.\n\nSua mensagem deve começar DIRETAMENTE com "Obrigada por se inscrever" e seguir com as opções.`
        }
      }
    }

    let carolResponse =
      desagendarResponse ??
      (cannedFirstMessageBody && isFirstMessage
        ? cannedFirstMessageBody
        : (await generateCarolResponse(message, conversationHistory, {
            tags,
            workshopSessions,
            leadName: leadName || undefined, // 🆕 Só passar se for nome real
            hasScheduled,
            scheduledDate,
            participated: participated ? true : (tags.includes('nao_participou_aula') ? false : undefined),
            isFirstMessage, // 🆕 Passar flag de primeira mensagem
            carolInstruction,
            adminSituacao: (context as any)?.admin_situacao, // remarketing pessoa por pessoa (persistente)
          })))

    // Se enviamos saudação em mensagem separada, remover qualquer repetição de saudação na segunda parte
    if (isFirstMessage && carolInstruction?.includes('PROIBIDO repetir a saudação')) {
      const startMarker = 'Obrigada por se inscrever'
      const idx = carolResponse.indexOf(startMarker)
      if (idx > 0) {
        const before = carolResponse.slice(0, idx).toLowerCase()
        if (before.includes('oi') && (before.includes('tudo bem') || before.includes('bem-vinda') || before.includes('bem-vindo') || before.includes('eu sou a carol'))) {
          carolResponse = carolResponse.slice(idx).trim()
          console.log('[Carol AI] 🧹 Saudação repetida removida da segunda mensagem')
        }
      }
    }

    console.log('[Carol AI] ✅ Resposta gerada:', {
      responsePreview: carolResponse?.substring(0, 100),
      length: carolResponse?.length
    })

    // 7. Buscar instância Z-API
    // IMPORTANTE: instanceId pode ser instance_id (string) ou id (UUID)
    // Se for UUID (36 caracteres com hífens), buscar por id
    // Se for instance_id (32 caracteres sem hífens), buscar por instance_id
    const isUUID = instanceId.includes('-') && instanceId.length === 36
    console.log('[Carol AI] 🔍 Buscando instância Z-API:', { 
      instanceId, 
      isUUID,
      length: instanceId.length 
    })
    
    const { data: instance, error: instanceError } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token, status')
      .eq(isUUID ? 'id' : 'instance_id', instanceId)
      .single()

    if (instanceError) {
      console.error('[Carol AI] ❌ Erro ao buscar instância:', {
        error: instanceError,
        code: instanceError.code,
        message: instanceError.message,
        instanceId,
        isUUID,
        searchField: isUUID ? 'id' : 'instance_id'
      })
      
      // Tentar buscar todas as instâncias para debug
      const { data: allInstances } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, name, status, area')
        .limit(10)
      console.log('[Carol AI] 🔍 Todas as instâncias no banco:', allInstances)
      
      return { success: false, error: `Erro ao buscar instância: ${instanceError.message}` }
    }

    if (!instance) {
      console.error('[Carol AI] ❌ Instância Z-API não encontrada:', { 
        instanceId,
        isUUID,
        searchField: isUUID ? 'id' : 'instance_id',
        length: instanceId.length
      })
      
      // Tentar buscar todas as instâncias para debug
      const { data: allInstances } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, name, status, area')
        .limit(10)
      console.log('[Carol AI] 🔍 Todas as instâncias no banco (para debug):', allInstances)
      
      return { success: false, error: `Instância Z-API não encontrada. InstanceId buscado: ${instanceId}` }
    }

    console.log('[Carol AI] ✅ Instância encontrada:', {
      id: instance.id,
      instance_id: instance.instance_id,
      hasToken: !!instance.token,
      tokenLength: instance.token?.length,
      status: instance.status
    })

    // 8. Enviar resposta
    console.log('[Carol AI] 📤 Enviando resposta via Z-API:', {
      phone,
      messageLength: carolResponse?.length,
      instance_id: instance.instance_id
    })
    
    const sendResult = await sendWhatsAppMessage(
      phone,
      carolResponse,
      instance.instance_id,
      instance.token
    )

    console.log('[Carol AI] 📤 Resultado do envio:', {
      success: sendResult.success,
      error: sendResult.error,
      messageId: sendResult.messageId
    })

    if (!sendResult.success) {
      console.error('[Carol AI] ❌ Erro ao enviar mensagem:', sendResult.error)
      return { success: false, error: sendResult.error || 'Erro ao enviar mensagem via Z-API' }
    }

    // 9. Salvar mensagem no banco (instance_id é UUID de z_api_instances.id)
    await supabaseAdmin.from('whatsapp_messages').insert({
      conversation_id: conversationId,
      instance_id: instance.id,
      z_api_message_id: sendResult.messageId || null,
      sender_type: 'bot',
      sender_name: 'Carol - Secretária',
      message: carolResponse,
      message_type: 'text',
      status: 'sent',
      is_bot_response: true,
    })

    // 9.0.1 Lembrete de fechamento no dia X: quando a pessoa diz "meu cartão vira dia 17" (ou similar), agendar envio só pra ela nesse dia
    if (tags.includes('participou_aula') && !(context as any)?.fechamento_lembrete_agendado_em) {
      const day = parseFechamentoLembreteDay(message)
      if (day !== null) {
        try {
          const scheduleResult = await scheduleFechamentoLembreteForDate({
            conversationId,
            phone,
            day,
            leadName: (context as any)?.lead_name || conversation?.name || leadName || 'querido(a)',
            area,
          })
          if (scheduleResult.success && scheduleResult.scheduledFor) {
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context: {
                  ...context,
                  fechamento_lembrete_agendado_em: scheduleResult.scheduledFor,
                  fechamento_lembrete_dia: day,
                },
              })
              .eq('id', conversationId)
            console.log('[Carol AI] ✅ Lembrete de fechamento agendado para dia', day, 'conversa', conversationId)
          }
        } catch (scheduleErr: any) {
          console.warn('[Carol AI] ⚠️ Erro ao agendar lembrete de fechamento:', scheduleErr?.message || scheduleErr)
        }
      }
    }

    // 9.0. Fluxo "tirar dúvida do vídeo": só uma mensagem automática; notificar com atenção e não responder mais (humano assume).
    if (isTirarDuvidaVideoFlow) {
      try {
        const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
        if (notificationPhone) {
          const { data: convData } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('name, phone')
            .eq('id', conversationId)
            .single()
          const displayName = convData?.name || 'Sem nome'
          const displayPhone = convData?.phone || phone
          const notificationMessage = `⚠️ *ATENÇÃO: Alguém querendo tirar dúvida*\n\nAssistiu o vídeo da página e clicou em "Tirar dúvidas". A Carol enviou só a mensagem automática; *a partir daqui você assume.*\n\n👤 *Nome:* ${displayName}\n📱 *Telefone:* ${displayPhone}\n\n_Entre no WhatsApp dessa pessoa para atender._`
          const { data: notificationInstance } = await supabaseAdmin
            .from('z_api_instances')
            .select('instance_id, token')
            .eq('status', 'connected')
            .limit(1)
            .maybeSingle()
          if (notificationInstance) {
            const notificationClient = createZApiClient({
              instanceId: notificationInstance.instance_id,
              token: notificationInstance.token,
            })
            await notificationClient.sendTextMessage({
              phone: notificationPhone,
              message: notificationMessage,
            })
            console.log('[Carol AI] ✅ Notificação "tirar dúvida do vídeo" enviada para responsável:', notificationPhone)
          }
        }
        const prevCtx = (context || {}) as Record<string, unknown>
        const prevTags = Array.isArray(prevCtx.tags) ? prevCtx.tags : []
        await supabaseAdmin
          .from('whatsapp_conversations')
          .update({
            last_message_at: new Date().toISOString(),
            last_message_from: 'bot',
            context: {
              ...prevCtx,
              tags: [...new Set([...prevTags, 'primeiro_contato', 'veio_tirar_duvida', 'tirar_duvida_video'])],
            },
          })
          .eq('id', conversationId)
        console.log('[Carol AI] ✅ Fluxo tirar dúvida do vídeo: tag tirar_duvida_video aplicada; Carol não responderá mais nesta conversa.')
      } catch (err: any) {
        console.error('[Carol AI] ❌ Erro no fluxo tirar dúvida do vídeo:', err?.message || err)
      }
      return { success: true, response: carolResponse }
    }

    // 9.1. Se veio por "Tirar dúvida" (vídeo/página de vendas) mas NÃO é fluxo exclusivo vídeo, notificar o responsável
    if (isFromVideoOrLandingDuvida) {
      try {
        const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
        if (notificationPhone) {
          const { data: convData } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('name, phone')
            .eq('id', conversationId)
            .single()
          const displayName = convData?.name || 'Sem nome'
          const displayPhone = convData?.phone || phone
          const notificationMessage = `💬 *Alguém clicou em Tirar dúvida* (página de vendas Nutri)\n\nA Carol enviou as boas-vindas e opções de aula (mesmo fluxo automático).\n\n👤 *Nome:* ${displayName}\n📱 *Telefone:* ${displayPhone}\n\n_Se quiser assumir a conversa, entre no WhatsApp dessa pessoa._`
          const { data: notificationInstance } = await supabaseAdmin
            .from('z_api_instances')
            .select('instance_id, token')
            .eq('status', 'connected')
            .limit(1)
            .maybeSingle()
          if (notificationInstance) {
            const notificationClient = createZApiClient({
              instanceId: notificationInstance.instance_id,
              token: notificationInstance.token,
            })
            await notificationClient.sendTextMessage({
              phone: notificationPhone,
              message: notificationMessage,
            })
            console.log('[Carol AI] ✅ Notificação "Tirar dúvida" enviada para responsável:', notificationPhone)
          } else {
            console.warn('[Carol AI] ⚠️ Instância Z-API não encontrada para notificação Tirar dúvida')
          }
        }
      } catch (notificationError: any) {
        console.error('[Carol AI] ❌ Erro ao enviar notificação Tirar dúvida:', notificationError)
      }
    }

    // 10. Detectar se precisa de atendimento humano e enviar notificação
    const needsHumanSupport = detectNeedsHumanSupport(carolResponse, message, conversationHistory)
    if (needsHumanSupport.detected) {
      try {
        const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
        if (notificationPhone) {
          const { data: convData } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('name, phone, context')
            .eq('id', conversationId)
            .single()
          
          if (convData) {
            const tags = Array.isArray(convData.context?.tags) ? convData.context.tags : []
            const notificationMessage = `🚨 *ATENDIMENTO HUMANO NECESSÁRIO*\n\n👤 *Nome:* ${convData.name || 'Sem nome'}\n📱 *Telefone:* ${convData.phone}\n\n📝 *Última mensagem da pessoa:*\n"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"\n\n🤖 *Resposta da Carol:*\n"${carolResponse.substring(0, 200)}${carolResponse.length > 200 ? '...' : ''}"\n\n🔍 *Motivo:* ${needsHumanSupport.reason}\n\n🏷️ *Tags:* ${tags.length > 0 ? tags.join(', ') : 'Nenhuma'}\n\n⚠️ *Ação necessária:* Entrar na conversa e atender pessoalmente`
            
            // Buscar instância Z-API para enviar notificação
            const { data: notificationInstance } = await supabaseAdmin
              .from('z_api_instances')
              .select('instance_id, token')
              .eq('status', 'connected')
              .limit(1)
              .maybeSingle()
            
            if (notificationInstance) {
              const notificationClient = createZApiClient({
                instanceId: notificationInstance.instance_id,
                token: notificationInstance.token,
              })
              
              await notificationClient.sendTextMessage({
                phone: notificationPhone,
                message: notificationMessage,
              })
              
              console.log('[Carol AI] ✅ Notificação de atendimento humano enviada para', notificationPhone)
              
              // NÃO adicionar tag de atendimento_manual automaticamente
              // Apenas adicionar tag precisa_atendimento_humano para indicar que precisa de atenção
              // A tag atendimento_manual só deve ser adicionada quando admin desativa Carol manualmente
              const newTags = [...new Set([...tags, 'precisa_atendimento_humano'])]
              await supabaseAdmin
                .from('whatsapp_conversations')
                .update({
                  context: {
                    ...convData.context,
                    tags: newTags,
                    needs_human_support: true,
                    needs_human_support_at: new Date().toISOString(),
                    needs_human_support_reason: needsHumanSupport.reason,
                  },
                })
                .eq('id', conversationId)
            } else {
              console.warn('[Carol AI] ⚠️ Instância Z-API não encontrada para enviar notificação de atendimento humano')
            }
          }
        }
      } catch (notificationError: any) {
        console.error('[Carol AI] ❌ Erro ao enviar notificação de atendimento humano:', notificationError)
        // Não falhar o processamento se a notificação falhar
      }
    }

    // 11. Atualizar última mensagem da conversa, tags (se primeira mensagem) e limpar instrução da Carol (já usada)
    const updatePayload: { last_message_at: string; last_message_from: string; context?: Record<string, unknown> } = {
      last_message_at: new Date().toISOString(),
      last_message_from: 'bot',
    }
    const prevCtx = (context || {}) as Record<string, unknown>
    const { carol_instruction: _, ...rest } = prevCtx
    let nextContext: Record<string, unknown> = rest
    // Primeira mensagem (ex.: clicou no botão WhatsApp): marcar veio_aula_pratica e primeiro_contato; NÃO recebeu_link_workshop (link só após escolher opção)
    if (isFirstMessage) {
      const prevTags = Array.isArray(prevCtx.tags) ? prevCtx.tags : []
      nextContext = {
        ...nextContext,
        tags: [...new Set([...prevTags, 'veio_aula_pratica', 'primeiro_contato'])],
      }
    } else if (rawIsFirstMessage && isFromVideoOrLandingDuvida) {
      // Veio para tirar dúvida (vídeo/página de vendas) — não fluxo de aula; só primeiro_contato e origem para relatório.
      const prevTags = Array.isArray(prevCtx.tags) ? prevCtx.tags : []
      nextContext = {
        ...nextContext,
        tags: [...new Set([...prevTags, 'primeiro_contato', 'veio_tirar_duvida'])],
      }
    } else if (rawIsFirstMessage && deniesSignup) {
      // Pessoa negou inscrição na primeira mensagem: não iniciar fluxo do workshop.
      const prevTags = Array.isArray(prevCtx.tags) ? prevCtx.tags : []
      nextContext = {
        ...nextContext,
        tags: [...new Set([...prevTags, 'primeiro_contato', 'negou_inscricao'])],
      }
    }

    // Estado leve (router): registrar o que acabamos de mandar.
    const lowerResp = String(carolResponse || '').toLowerCase()
    const askedChoice = /responde\s*1\s*ou\s*2|me\s+responde\s+com\s+1\s+ou\s+2|qual\s+(desses\s+)?hor[aá]rio/i.test(lowerResp)
    const isIdentity = /pode\s+ser\s+que\s+seu\s+n[uú]mero\s+tenha\s+sido\s+usado\s+por\s+engano|n[aã]o\s+me\s+inscrevi/i.test(lowerResp)
    const nowIso2 = new Date().toISOString()
    const nextIntent =
      isIdentity ? 'identity_check' : askedChoice ? 'ask_schedule_choice' : (nextContext as any)?.last_bot_intent

    nextContext = {
      ...nextContext,
      last_bot_intent: nextIntent,
      last_bot_template: isIdentity ? 'identity_check_v1' : askedChoice ? 'schedule_choice_v1' : (nextContext as any)?.last_bot_template,
      last_bot_at: nowIso2,
    }
    updatePayload.context = nextContext
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update(updatePayload)
      .eq('id', conversationId)

    return { success: true, response: carolResponse }
  } catch (error: any) {
    const errMsg = error?.message ?? (typeof error === 'string' ? error : String(error))
    console.error('[Carol AI] ❌ Erro ao processar mensagem:', errMsg, error)
    return { success: false, error: errMsg }
  }
}

/**
 * Dispara mensagem de boas-vindas para quem preencheu mas não chamou
 */
export async function sendWelcomeToNonContactedLeads(): Promise<{
  sent: number
  errors: number
  aborted?: boolean
}> {
  try {
    // 0. Verificar se está em horário permitido
    const timeCheck = isAllowedTimeToSendMessage()
    if (!timeCheck.allowed) {
      console.log('[Carol] ⏰ Disparo de boas-vindas fora do horário:', {
        reason: timeCheck.reason,
        nextAllowedTime: timeCheck.nextAllowedTime?.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      })
      return { sent: 0, errors: 0 }
    }

    // 1. Buscar leads que preencheram workshop mas não têm conversa ativa
    // Buscar de workshop_inscricoes OU de leads com source = workshop_agenda_instavel_landing_page
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    
    // Buscar de workshop_inscricoes (inscrições na aula gratuita / workshop)
    let workshopLeads: Array<{ nome: string; email: string; telefone: string; created_at: string }> = []
    
    const { data: inscricoes } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('nome, email, telefone, created_at')
      .eq('status', 'inscrito')
      .gte('created_at', seteDiasAtras)
      .order('created_at', { ascending: false })
    
    if ((inscricoes || []).length > 0) {
      workshopLeads = (inscricoes || []).map((i: any) => ({
        nome: i.nome,
        email: i.email || '',
        telefone: i.telefone,
        created_at: i.created_at,
      }))
    } else {
      // Fallback: buscar de leads com source workshop
      const { data: leads } = await supabaseAdmin
        .from('leads')
        .select('nome, email, telefone, created_at')
        .or('source.eq.workshop_agenda_instavel_landing_page,source.ilike.%workshop%')
        .gte('created_at', seteDiasAtras)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (leads) {
        workshopLeads = leads
          .filter((l: any) => l.telefone)
          .map((l: any) => ({
            nome: l.nome || '',
            email: l.email || '',
            telefone: l.telefone,
            created_at: l.created_at,
          }))
      }
    }

    if (!workshopLeads || workshopLeads.length === 0) {
      return { sent: 0, errors: 0 }
    }

    // 2. Verificar quais não têm conversa ativa no WhatsApp
    const leadsToContact: Array<{ nome: string; telefone: string }> = []
    
    for (const lead of workshopLeads) {
      if (!lead.telefone) continue

      const phoneClean = lead.telefone.replace(/\D/g, '')
      if (phoneClean.length < 10) continue
      const contactKey = phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`

      // Verificar se tem conversa com mensagens do cliente
      const { data: conversation } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('id')
        .eq('contact_key', contactKey)
        .eq('area', 'nutri')
        .maybeSingle()

      if (!conversation) {
        // Não tem conversa, precisa receber boas-vindas
        leadsToContact.push({
          nome: lead.nome,
          telefone: contactKey,
        })
      } else {
        // Verificar se cliente já enviou mensagem
        const { data: customerMessage } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id')
          .eq('conversation_id', conversation.id)
          .eq('sender_type', 'customer')
          .limit(1)
          .maybeSingle()

        if (!customerMessage) {
          // Tem conversa mas cliente nunca enviou mensagem
          leadsToContact.push({
            nome: lead.nome,
            telefone: contactKey,
          })
        }
      }
    }

    // 3. Buscar instância Z-API
    // Primeiro tenta buscar por área e status connected
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', 'nutri')
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    // Se não encontrou, tenta buscar apenas por área (sem filtro de status)
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', 'nutri')
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
      }
    }

    // Se ainda não encontrou, tenta buscar qualquer instância conectada (fallback)
    if (!instance) {
      const { data: instanceFallback } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (instanceFallback) {
        instance = instanceFallback
      }
    }

    if (!instance) {
      return { sent: 0, errors: leadsToContact.length }
    }

    // 4. Buscar próximas 2 sessões
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('title, starts_at, zoom_link')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    // 5. Enviar mensagem para cada lead
    let sent = 0
    let errors = 0

    for (const lead of leadsToContact) {
      try {
        if (await checkDisparoAbort('welcome')) {
          console.log('[Carol Welcome] ⏹️ Parar disparo solicitado pelo admin')
          return { sent, errors, aborted: true }
        }
        // Formatar opções de aula
        let optionsText = ''
        if (sessions && sessions.length > 0) {
          sessions.forEach((session, index) => {
            const date = new Date(session.starts_at)
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
            const dateStr = date.toLocaleDateString('pt-BR')
            const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            optionsText += `\n🗓️ **Opção ${index + 1}:**\n${weekday}, ${dateStr}\n🕒 ${time} (Brasília)\n🔗 ${session.zoom_link}\n`
          })
        }

        const welcomeMessage = `Olá ${lead.nome}, seja bem-vindo! 👋

Obrigada por fazer sua inscrição na Aula Prática ao Vivo de Como Encher a Agenda! 🎉

Aqui estão as duas próximas opções de aula:

${optionsText}✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, é só me chamar! 💚
`

        const sendResult = await sendWhatsAppMessage(
          lead.telefone,
          welcomeMessage,
          instance.instance_id,
          instance.token
        )

        if (sendResult.success) {
          const contactKey = String(lead.telefone || '').replace(/\D/g, '')
          // Criar ou atualizar conversa
          const { data: existingConv } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('id, context')
            .eq('contact_key', contactKey)
            .eq('instance_id', instance.id)
            .maybeSingle()

          let conversationId: string | null = null

          if (existingConv) {
            conversationId = existingConv.id
            // Atualizar tags
            const prevContext = (existingConv.context || {}) as any
            const prevTags = Array.isArray(prevContext.tags) ? prevContext.tags : []
            // Só veio_aula_pratica e primeiro_contato; recebeu_link_workshop só quando enviar link do Zoom (após escolher opção)
            const newTags = [...new Set([...prevTags, 'veio_aula_pratica', 'primeiro_contato'])]

            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context: {
                  ...prevContext,
                  tags: newTags,
                  source: 'welcome_automation',
                },
              })
              .eq('id', conversationId)
          } else {
            const { data: newConv } = await supabaseAdmin
              .from('whatsapp_conversations')
              .insert({
                phone: lead.telefone,
                contact_key: contactKey,
                instance_id: instance.id,
                area: 'nutri',
                name: lead.nome,
                context: {
                  tags: ['veio_aula_pratica', 'primeiro_contato'],
                  source: 'welcome_automation',
                },
              })
              .select('id')
              .single()

            conversationId = newConv?.id || null
          }

          // Salvar mensagem
          if (conversationId) {
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conversationId,
              instance_id: instance.id,
              z_api_message_id: sendResult.messageId || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message: welcomeMessage,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })
          }

          sent++
        } else {
          errors++
        }

        // Delay entre mensagens para não sobrecarregar o WhatsApp
        // Intervalo de 2-3 segundos é mais seguro para evitar bloqueios
        await new Promise(resolve => setTimeout(resolve, 2500))
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar para ${lead.telefone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar leads não contactados:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Envia mensagem de remarketing para uma pessoa específica que não participou
 * Disparado automaticamente quando admin marca como "não participou"
 * @param options.force - Se true (ex.: botão "Reenviar remarketing"), ignora regra de 2h e horário permitido
 * @param options.ignoreTime - Ordem do admin (clique em Participou/Não participou): envia sempre, independente de horário
 */
export async function sendRemarketingToNonParticipant(
  conversationId: string,
  options?: { force?: boolean; ignoreTime?: boolean }
): Promise<{ success: boolean; error?: string }> {
  const force = options?.force === true
  try {
    const area = 'nutri'

    // Buscar conversa
    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('id', conversationId)
      .eq('area', area)
      .single()

    if (!conversation) {
      return { success: false, error: 'Conversa não encontrada' }
    }

    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []

    // Se já recebeu remarketing (tag persistente), não reenviar automaticamente.
    // Para reenviar manualmente, use options.force=true.
    if (!force && tags.includes('remarketing_enviado')) {
      console.log('[Carol Remarketing] ⏭️ Pulando (remarketing já enviado):', {
        conversationId,
        phone: conversation.phone,
      })
      return { success: false, error: 'Remarketing já foi enviado (use "Reenviar remarketing" para forçar)' }
    }

    // Verificar se realmente não participou
    // Se não tem a tag, tentar buscar novamente (pode ser problema de timing)
    if (!tags.includes('nao_participou_aula')) {
      console.warn('[Carol Remarketing] ⚠️ Tag não encontrada, tentando buscar conversa novamente...', {
        conversationId,
        tags,
        hasContext: !!context
      })
      
      // Tentar buscar novamente após 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000))
      const { data: retryConversation } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('context')
        .eq('id', conversationId)
        .single()
      
      if (retryConversation) {
        const retryContext = retryConversation.context || {}
        const retryTags = Array.isArray(retryContext.tags) ? retryContext.tags : []
        
        if (!retryTags.includes('nao_participou_aula')) {
          return { success: false, error: 'Pessoa não está marcada como não participou (após retry)' }
        }
        
        // Usar tags do retry
        Object.assign(context, retryContext)
        tags.push(...retryTags.filter(t => !tags.includes(t)))
      } else {
        return { success: false, error: 'Pessoa não está marcada como não participou' }
      }
    }

    // Verificar se já recebeu remarketing recentemente (evitar spam) — ignorar quando force (reenvio manual)
    if (!force && context.last_remarketing_at) {
      const lastRemarketing = new Date(context.last_remarketing_at)
      const now = new Date()
      const hoursSinceLastRemarketing = (now.getTime() - lastRemarketing.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceLastRemarketing < 2) {
        return { success: false, error: 'Remarketing já foi enviado recentemente (use "Reenviar remarketing" para forçar)' }
      }
    }

    // Horário: ignorar quando for ordem do admin (ignoreTime) ou reenvio manual (force)
    const ignoreTime = options?.ignoreTime === true
    if (!force && !ignoreTime) {
      const timeCheck = isAllowedTimeToSendMessage()
      if (!timeCheck.allowed) {
        console.log('[Carol Remarketing] ⏰ Fora do horário permitido:', {
          reason: timeCheck.reason,
          nextAllowedTime: timeCheck.nextAllowedTime?.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        })
        return { 
          success: false, 
          error: `Mensagem automática não enviada: ${timeCheck.reason}. Próximo horário permitido: ${timeCheck.nextAllowedTime?.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}` 
        }
      }
    }

    // Buscar instância Z-API usando função helper centralizada
    const instance = await getZApiInstance(area)

    if (!instance) {
      console.error('[Carol Remarketing] ❌ Instância Z-API não encontrada para área:', area)
      return { success: false, error: 'Instância Z-API não encontrada. Verifique se há uma instância Z-API cadastrada no sistema.' }
    }

    // Buscar nome do cadastro (Carol usa apenas primeiro nome). Nunca chamar de "Ylada"/nome do negócio.
    const registrationName = await getRegistrationName(conversation.phone, 'nutri')
    const safeConvName = conversation.name && !isInvalidOrInternalName(conversation.name) ? conversation.name : ''
    let leadName = getFirstName(registrationName || (conversation.context as any)?.lead_name || safeConvName) || 'querido(a)'
    if (isBusinessName(leadName) || isInvalidOrInternalName(leadName)) leadName = 'querido(a)'

    // Primeira mensagem de remarketing: persuasiva, com benefício. NÃO envia datas/link.
    // Quando a pessoa responder positivamente no chat, a Carol envia as opções (via processIncomingMessageWithCarol).
    const { getFlowTemplate, applyTemplate } = await import('@/lib/whatsapp-flow-templates')
    const remarketingTemplate = await getFlowTemplate('nutri', 'remarketing_nao_participou')
    const remarketingMessage = remarketingTemplate
      ? applyTemplate(remarketingTemplate, { nome: leadName })
      : `Olá ${leadName}! 💚

Vi que você não conseguiu entrar na aula. Fica tranquilo(a), isso acontece.

Eu sei como é frustrante ver a agenda oscilando e sentir que você está fazendo tudo “certo”, mas mesmo assim não consegue preencher com constância. A aula foi justamente pra te mostrar um caminho mais claro e prático pra organizar isso.

Você ainda tem interesse em participar?
Se sim, eu te encaixo no próximo horário. Qual período fica melhor pra você: manhã, tarde ou noite?`

    const client = createZApiClient(instance.instance_id, instance.token)
    const result = await client.sendTextMessage({
      phone: conversation.phone,
      message: remarketingMessage,
    })

    if (result.success) {
      // Salvar mensagem
      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversation.id,
        instance_id: instance.id,
        z_api_message_id: result.id || null,
        sender_type: 'bot',
        sender_name: 'Carol - Secretária',
        message: remarketingMessage,
        message_type: 'text',
        status: 'sent',
        is_bot_response: true,
      })

      // Atualizar contexto
      const newTags = [...new Set([...tags, 'recebeu_segundo_link', 'remarketing_enviado'])]
      context.last_remarketing_at = new Date().toISOString()
      context.remarketing_sent_at = new Date().toISOString()
      context.tags = newTags

      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context,
          last_message_at: new Date().toISOString(),
          last_message_from: 'bot',
        })
        .eq('id', conversation.id)

      return { success: true }
    } else {
      const errMsg = (result as { error?: string }).error || 'Erro ao enviar mensagem'
      return { success: false, error: errMsg }
    }
  } catch (error: any) {
    console.error('[Carol] Erro ao enviar remarketing:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Dispara remarketing para quem agendou mas não participou.
 *
 * REGRAS DE EXCLUSÃO (não envia para):
 * - Quem tem tag participou_aula (já participou da aula)
 * - Quem tem tag remarketing_enviado (já recebeu este disparo antes)
 * - Quem já recebeu remarketing HOJE (mesmo dia calendário Brasília) — evita duplicado no mesmo dia
 *
 * Envia apenas para os demais, uma vez por pessoa por dia.
 */
export async function sendRemarketingToNonParticipants(): Promise<{
  sent: number
  errors: number
  aborted?: boolean
}> {
  const tz = 'America/Sao_Paulo'
  const now = new Date()
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: tz }) // YYYY-MM-DD

  try {
    // 1. Buscar conversas com tag "nao_participou_aula" ou "adiou_aula"
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', 'nutri')
      .eq('status', 'active')

    if (!conversations) {
      return { sent: 0, errors: 0 }
    }

    // 2. Filtrar: não participou E não participou_aula (excluir quem já participou)
    const nonParticipants = conversations.filter((conv) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      return (
        (tags.includes('nao_participou_aula') || tags.includes('adiou_aula')) &&
        !tags.includes('participou_aula')
      )
    })

    if (nonParticipants.length === 0) {
      return { sent: 0, errors: 0 }
    }

    // 3. Buscar instância Z-API
    // Primeiro tenta buscar por área e status connected
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', 'nutri')
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    // Se não encontrou, tenta buscar apenas por área (sem filtro de status)
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', 'nutri')
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
      }
    }

    // Se ainda não encontrou, tenta buscar qualquer instância conectada (fallback)
    if (!instance) {
      const { data: instanceFallback } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (instanceFallback) {
        instance = instanceFallback
      }
    }

    if (!instance) {
      return { sent: 0, errors: nonParticipants.length }
    }

    // 4. Mensagem de remarketing: primeira msg só pergunta interesse e se quer agendar (sem enviar datas/link)
    let sent = 0
    let errors = 0

    for (const conv of nonParticipants) {
      try {
        if (await checkDisparoAbort('remarketing')) {
          console.log('[Carol Remarketing] ⏹️ Parar disparo solicitado pelo admin')
          return { sent, errors, aborted: true }
        }
        const context = conv.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []

        // Excluir quem já participou (rechecagem defensiva)
        if (tags.includes('participou_aula')) {
          console.log(`[Carol Remarketing] ⏭️ Pulando ${conv.phone} - já participou da aula`)
          continue
        }
        // Excluir quem já tem tag remarketing_enviado (evitar duplicação)
        if (tags.includes('remarketing_enviado')) {
          console.log(`[Carol Remarketing] ⏭️ Pulando ${conv.phone} - já tem tag remarketing_enviado`)
          continue
        }
        // Excluir quem já recebeu remarketing HOJE (mesmo dia calendário) — 1 disparo por pessoa por dia
        if (context.last_remarketing_at) {
          const lastDateStr = new Date(context.last_remarketing_at).toLocaleDateString('en-CA', { timeZone: tz })
          if (lastDateStr === todayStr) {
            console.log(`[Carol Remarketing] ⏭️ Pulando ${conv.phone} - já recebeu remarketing hoje`)
            continue
          }
        }

        // Carol usa apenas primeiro nome. Nunca chamar de "Ylada"/nome do negócio.
        const registrationName = await getRegistrationName(conv.phone, 'nutri')
        const safeConvName = conv.name && !isInvalidOrInternalName(conv.name) ? conv.name : ''
        let leadName = getFirstName(registrationName || (context as any)?.lead_name || safeConvName) || 'querido(a)'
        if (isBusinessName(leadName) || isInvalidOrInternalName(leadName)) leadName = 'querido(a)'
        const { getFlowTemplate, applyTemplate } = await import('@/lib/whatsapp-flow-templates')
        const remarketingTemplate = await getFlowTemplate('nutri', 'remarketing_nao_participou')
        const remarketingMessage = remarketingTemplate
          ? applyTemplate(remarketingTemplate, { nome: leadName })
          : `Olá ${leadName}! 💚

Vi que você não conseguiu entrar na aula. Fica tranquilo(a), isso acontece.

Eu sei como é frustrante ver a agenda oscilando e sentir que você está fazendo tudo “certo”, mas mesmo assim não consegue preencher com constância. A aula foi justamente pra te mostrar um caminho mais claro e prático pra organizar isso.

Você ainda tem interesse em participar?
Se sim, eu te encaixo no próximo horário. Qual período fica melhor pra você: manhã, tarde ou noite?`

        const sendResult = await sendWhatsAppMessage(
          conv.phone,
          remarketingMessage,
          instance.instance_id,
          instance.token
        )

        if (sendResult.success) {
          // Atualizar tag e contexto
          const tags = Array.isArray(context.tags) ? context.tags : []
          const newTags = [...new Set([...tags, 'recebeu_segundo_link', 'remarketing_enviado'])]

          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...context,
                tags: newTags,
                last_remarketing_at: new Date().toISOString(),
                remarketing_sent_at: new Date().toISOString(),
              },
            })
            .eq('id', conv.id)

          // Salvar mensagem
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conv.id,
            instance_id: instance.id,
            z_api_message_id: sendResult.messageId || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message: remarketingMessage,
            message_type: 'text',
            status: 'sent',
            is_bot_response: true,
          })

          sent++
          await bulkSendDelay(sent)
        } else {
          errors++
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar remarketing para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar remarketing:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Disparo "Remarque aula hoje 20h":
 * - Quem tem etiqueta não participou / adiou (exceto já agendado para hoje 20h)
 * - Quem a gente já contatou mas nunca respondeu (não chegou a responder a primeira vez)
 * Mensagem: "Hoje temos aula às 20h. Gostaria de participar?"
 *
 * REGRAS DE EXCLUSÃO (não envia para):
 * - Quem tem tag participou_aula
 * - Quem já está agendado para hoje 20h
 * - Quem já recebeu ESTE disparo HOJE (remarketing_hoje_20h_enviado_at = hoje) — 1 por pessoa por dia
 *
 * Envia apenas para os demais, uma vez por pessoa por dia.
 */
export async function sendRemarketingAulaHoje20h(): Promise<{
  sent: number
  errors: number
  skipped: number
  aborted?: boolean
}> {
  try {
    const now = new Date()
    const tz = 'America/Sao_Paulo'
    const todayStr = now.toLocaleDateString('en-CA', { timeZone: tz }) // YYYY-MM-DD

    // 1. Sessão(s) de hoje às 20h (Brasília): buscar sessões ativas e filtrar em JS por data/hora Brasília
    const from = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
    const to = new Date(now.getTime() + 36 * 60 * 60 * 1000).toISOString()
    const { data: sessionsAll } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, starts_at')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', from)
      .lte('starts_at', to)

    const sessionIdsHoje20h: string[] = []
    if (sessionsAll?.length) {
      for (const s of sessionsAll) {
        const d = new Date(s.starts_at)
        const sessionDateStr = d.toLocaleDateString('en-CA', { timeZone: tz })
        const sessionHour = d.toLocaleString('pt-BR', { hour: '2-digit', hour12: false, timeZone: tz })
        if (sessionDateStr === todayStr && sessionHour === '20') sessionIdsHoje20h.push(s.id)
      }
    }

    // 2. Conversas ativas nutri
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', 'nutri')
      .eq('status', 'active')

    if (!conversations) {
      return { sent: 0, errors: 0, skipped: 0 }
    }

    // Quem já respondeu alguma vez (tem mensagem do cliente)
    const { data: msgsCustomer } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('conversation_id')
      .eq('sender_type', 'customer')
    const repliedIds = new Set((msgsCustomer || []).map((r: { conversation_id: string }) => r.conversation_id))

    // Quem a gente já contatou (tem mensagem bot/agent)
    const { data: msgsBot } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('conversation_id')
      .in('sender_type', ['bot', 'agent'])
    const contactedIds = new Set((msgsBot || []).map((r: { conversation_id: string }) => r.conversation_id))

    // Incluir: (1) quem tem etiqueta não participou/adiou OU (2) quem a gente contatou mas nunca respondeu
    const nonParticipants = conversations.filter((conv) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      const participou = tags.includes('participou_aula')
      const sessionId = context.workshop_session_id
      const jaAgendadoHoje20h = sessionId && sessionIdsHoje20h.includes(sessionId)

      if (participou || jaAgendadoHoje20h) return false

      const didNotParticipate =
        (tags.includes('nao_participou_aula') || tags.includes('adiou_aula')) && !participou
      const weContacted = contactedIds.has(conv.id)
      const neverReplied = weContacted && !repliedIds.has(conv.id)

      return didNotParticipate || neverReplied
    })

    if (nonParticipants.length === 0) {
      return { sent: 0, errors: 0, skipped: 0 }
    }

    // 3. Instância Z-API (mesmo que remarketing)
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', 'nutri')
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', 'nutri')
        .limit(1)
        .maybeSingle()
      if (instanceByArea) instance = instanceByArea
    }
    if (!instance) {
      const { data: instanceFallback } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      if (instanceFallback) instance = instanceFallback
    }
    if (!instance) {
      return { sent: 0, errors: nonParticipants.length, skipped: 0 }
    }

    let sent = 0
    let errors = 0
    let skipped = 0

    for (const conv of nonParticipants) {
      try {
        if (await checkDisparoAbort('remarketing_hoje_20h')) {
          console.log('[Carol Remarque Hoje 20h] ⏹️ Parar disparo solicitado pelo admin')
          return { sent, errors, skipped, aborted: true }
        }
        const context = conv.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []

        // Excluir quem já participou (rechecagem defensiva)
        if (tags.includes('participou_aula')) {
          skipped++
          continue
        }
        // Excluir só quem já recebeu ESTE disparo HOJE (mesmo dia) — permite reenviar em outro dia
        if (context.remarketing_hoje_20h_enviado_at) {
          const enviadoDateStr = new Date(context.remarketing_hoje_20h_enviado_at).toLocaleDateString('en-CA', { timeZone: tz })
          if (enviadoDateStr === todayStr) {
            skipped++
            continue
          }
        }

        const registrationName = await getRegistrationName(conv.phone, 'nutri')
        const safeConvName = conv.name && !isInvalidOrInternalName(conv.name) ? conv.name : ''
        let leadName = getFirstName(registrationName || (context as any)?.lead_name || safeConvName) || 'querido(a)'
        if (isBusinessName(leadName) || isInvalidOrInternalName(leadName)) leadName = 'querido(a)'

        const message = `Oi ${leadName}! 💚\n\nHoje temos aula às 20h. Gostaria de participar? Se sim, responda que eu te encaixo. 😊`

        const sendResult = await sendWhatsAppMessage(
          conv.phone,
          message,
          instance.instance_id,
          instance.token
        )

        if (sendResult.success) {
          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...context,
                remarketing_hoje_20h_enviado_at: new Date().toISOString(),
              },
            })
            .eq('id', conv.id)
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conv.id,
            instance_id: instance.id,
            z_api_message_id: sendResult.messageId || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message,
            message_type: 'text',
            status: 'sent',
            is_bot_response: true,
          })
          sent++
          await bulkSendDelay(sent)
        } else {
          errors++
        }
      } catch (error: any) {
        console.error(`[Carol Remarque Hoje 20h] Erro para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors, skipped }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar remarque hoje 20h:', error)
    return { sent: 0, errors: 0, skipped: 0 }
  }
}

/**
 * Função auxiliar para formatar data/hora (exportada)
 */
export function formatSessionDateTime(startsAt: string): { weekday: string; date: string; time: string } {
  const date = new Date(startsAt)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  
  const formatter = new Intl.DateTimeFormat('pt-BR', options)
  const parts = formatter.formatToParts(date)
  
  const weekday = parts.find(p => p.type === 'weekday')?.value || ''
  const day = parts.find(p => p.type === 'day')?.value || ''
  const month = parts.find(p => p.type === 'month')?.value || ''
  const year = parts.find(p => p.type === 'year')?.value || ''
  const hour = parts.find(p => p.type === 'hour')?.value || ''
  const minute = parts.find(p => p.type === 'minute')?.value || ''
  
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    date: `${day}/${month}/${year}`,
    time: `${hour}:${minute}`
  }
}

/**
 * Envia notificações pré-aula para quem agendou
 * - 24h antes: Lembrete
 * - 12h antes: Recomendação computador
 * - 2h antes: Aviso Zoom
 * - 30min antes: Sala aberta
 */
export async function sendPreClassNotifications(): Promise<{
  sent: number
  errors: number
}> {
  try {
    const now = new Date()
    const area = 'nutri'
    
    // Buscar instância Z-API
    // Primeiro tenta buscar por área e status connected
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    // Se não encontrou, tenta buscar apenas por área (sem filtro de status)
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', area)
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
      }
    }

    // Se ainda não encontrou, tenta buscar qualquer instância conectada (fallback)
    if (!instance) {
      const { data: instanceFallback } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (instanceFallback) {
        instance = instanceFallback
      }
    }

    if (!instance) {
      return { sent: 0, errors: 0 }
    }

    // Buscar conversas com sessão agendada
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', area)
      .eq('status', 'active')
      .not('context->workshop_session_id', 'is', null)

    if (!conversations || conversations.length === 0) {
      return { sent: 0, errors: 0 }
    }

    console.log('[Carol Pre-Class] 📋 Total de conversas com sessão agendada:', conversations.length)
    let sent = 0
    let errors = 0

    for (const conv of conversations) {
      try {
        const context = conv.context || {}
        const sessionId = context.workshop_session_id
        if (!sessionId) continue

        // Buscar sessão
        const { data: session } = await supabaseAdmin
          .from('whatsapp_workshop_sessions')
          .select('id, title, starts_at, zoom_link')
          .eq('id', sessionId)
          .single()

        if (!session) continue

        // Calcular diferença de tempo usando timezone de Brasília
        const sessionDate = new Date(session.starts_at)
        const nowBrasilia = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
        const sessionBrasilia = new Date(sessionDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
        const timeDiff = sessionBrasilia.getTime() - nowBrasilia.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        const minutesDiff = timeDiff / (1000 * 60)

        const { weekday, date, time } = formatSessionDateTime(session.starts_at)
        const client = createZApiClient(instance.instance_id, instance.token)

        // Carol usa apenas primeiro nome (só do cadastro ou nome válido da conversa – nunca Nutri/Inge/nota)
        const registrationName = await getRegistrationName(conv.phone, 'nutri')
        const safeConvName = conv.name && !isInvalidOrInternalName(conv.name) ? conv.name : ''
        const leadName = getFirstName(registrationName || safeConvName) || 'querido(a)'

        // Verificar qual notificação enviar baseado no tempo restante
        let message: string | null = null
        let shouldSend = false
        const notificationKey = `pre_class_${sessionId}`
        
        // Se a sessão já aconteceu, não enviar
        if (hoursDiff < 0) {
          continue
        }

        // Calcular se é hoje ou amanhã
        const isToday = nowBrasilia.toDateString() === sessionBrasilia.toDateString()
        const isTomorrow = new Date(nowBrasilia.getTime() + 24 * 60 * 60 * 1000).toDateString() === sessionBrasilia.toDateString()
        
        console.log(`[Carol Pre-Class] Verificando notificação para ${conv.phone}:`, {
          sessionId,
          hoursDiff: hoursDiff.toFixed(2),
          minutesDiff: minutesDiff.toFixed(2),
          isToday,
          isTomorrow,
          sent_24h: context[notificationKey]?.sent_24h,
          sent_12h: context[notificationKey]?.sent_12h,
          sent_2h: context[notificationKey]?.sent_2h,
          sent_10min: context[notificationKey]?.sent_10min
        })

        // 24 horas antes (entre 24h e 25h) OU se passou mas ainda não enviou e sessão é amanhã/hoje
        // Melhorado: Se sessão é amanhã e ainda não enviou, enviar mesmo se passou a janela de 24h
        if (!context[notificationKey]?.sent_24h && 
            ((hoursDiff >= 24 && hoursDiff < 25) || 
             (hoursDiff >= 12 && hoursDiff < 24) ||
             (isTomorrow && hoursDiff >= 12 && hoursDiff < 36))) {
          message = `Olá ${leadName}! 👋

Lembrete: Sua aula é amanhã!

🗓️ ${weekday}, ${date}
🕒 ${time} (horário de Brasília)

🔗 ${session.zoom_link}

Nos vemos lá! 😊
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_24h = true
        }
        // 12 horas antes (entre 12h e 13h) OU se passou mas ainda não enviou e sessão é hoje/amanhã
        // Melhorado: Se sessão é hoje e ainda não enviou, enviar mesmo se passou a janela de 12h
        // IMPORTANTE: Se sessão é hoje e ainda não enviou nenhum lembrete, enviar o de 12h
        if (!context[notificationKey]?.sent_12h && 
            ((hoursDiff >= 12 && hoursDiff < 13) || 
             (hoursDiff >= 2.5 && hoursDiff < 12) || 
             (isToday && hoursDiff >= 2.5 && hoursDiff < 12 && !context[notificationKey]?.sent_2h) ||
             (isTomorrow && hoursDiff >= 12 && hoursDiff < 36))) {
          message = `${leadName ? `Olá ${leadName}! ` : ''}Sua aula é hoje às ${time}! 

Ideal participar pelo computador e ter caneta e papel à mão — a aula é bem prática.

🔗 ${session.zoom_link}
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_12h = true
        }
        // 2 horas antes: janela ampla (1h30 a 2h30) para múltiplas execuções do cron pegarem todos
        // "Disparo agora": isToday && hoursDiff > 0 && hoursDiff < 2 — envia até os últimos minutos antes da aula
        else if (!context[notificationKey]?.sent_2h && 
                 ((hoursDiff >= 1.5 && hoursDiff < 2.5) || 
                  (hoursDiff >= 0.5 && hoursDiff < 1.5) ||
                  (isToday && hoursDiff > 0 && hoursDiff < 2))) {
          const { weekday, date, time } = formatSessionDateTime(session.starts_at)
          message = `${leadName ? `Olá ${leadName}! ` : ''}Só um aviso: começaremos pontualmente na ${weekday}, ${date} às ${time} (horário de Brasília).

💡 Dicas: use o computador, tenha caneta e papel à mão e mantenha a câmera aberta — é uma aula prática.

⚠️ Após 10 minutos do início não será mais permitida a entrada.

Nos vemos em breve! 😊
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_2h = true
        }
        // 10 minutos antes (entre 10min e 12min) OU se sessão é hoje e ainda não enviou
        // IMPORTANTE: Se sessão é hoje e ainda não enviou nenhum lembrete, enviar o de 10min se estiver próximo
        else if (!context[notificationKey]?.sent_10min && 
                 ((minutesDiff >= 10 && minutesDiff < 12) ||
                  (isToday && minutesDiff >= 5 && minutesDiff < 12 && !context[notificationKey]?.sent_2h))) {
          message = `✅ A sala já está aberta!

Entra agora pra garantir seu lugar, porque vamos começar pontualmente em poucos minutos.

Se puder, entra pelo computador e já deixa caneta e papel por perto (a aula é bem prática).

🔗 ${session.zoom_link}
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_10min = true
        }

        if (shouldSend && message) {
          const result = await client.sendTextMessage({
            phone: conv.phone,
            message,
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conv.id,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })

            // Atualizar contexto
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context,
                last_message_at: new Date().toISOString(),
                last_message_from: 'bot',
              })
              .eq('id', conv.id)

            sent++
            await bulkSendDelay(sent)
          } else {
            errors++
          }
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar notificação pré-aula para ${conv.phone}:`, error)
        errors++
      }
    }

    console.log('[Carol Pre-Class] ✅ Fim:', { sent, errors, total: conversations.length })
    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar notificações pré-aula:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Envia notificações pós-aula para quem participou
 * - 15min depois: Como foi?
 * - 2h depois: Como está se sentindo?
 * - 24h depois: Como está aplicando?
 */
export async function sendPostClassNotifications(): Promise<{
  sent: number
  errors: number
}> {
  try {
    // Verificar se está em horário permitido
    const timeCheck = isAllowedTimeToSendMessage()
    if (!timeCheck.allowed) {
      console.log('[Carol] ⏰ Disparo de pós-aula fora do horário:', {
        reason: timeCheck.reason,
        nextAllowedTime: timeCheck.nextAllowedTime?.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      })
      return { sent: 0, errors: 0 }
    }

    const now = new Date()
    const area = 'nutri'

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { sent: 0, errors: 0 }
    }

    // Buscar conversas que participaram da aula
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', area)
      .eq('status', 'active')

    if (!conversations || conversations.length === 0) {
      return { sent: 0, errors: 0 }
    }

    // Filtrar quem participou
    const participants = conversations.filter((conv) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      return tags.includes('participou_aula')
    })

    if (participants.length === 0) {
      return { sent: 0, errors: 0 }
    }

    let sent = 0
    let errors = 0

    for (const conv of participants) {
      try {
        const context = conv.context || {}
        const sessionId = context.workshop_session_id
        if (!sessionId) continue

        // Buscar sessão
        const { data: session } = await supabaseAdmin
          .from('whatsapp_workshop_sessions')
          .select('id, title, starts_at, zoom_link')
          .eq('id', sessionId)
          .single()

        if (!session) continue

        const sessionDate = new Date(session.starts_at)
        const sessionEndDate = new Date(sessionDate.getTime() + 45 * 60 * 1000) // 45 minutos depois
        const timeDiff = now.getTime() - sessionEndDate.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        const minutesDiff = timeDiff / (1000 * 60)

        const client = createZApiClient(instance.instance_id, instance.token)
        const notificationKey = `post_class_${sessionId}`

        let message: string | null = null
        let shouldSend = false

        // 15 minutos depois (entre 15min e 20min)
        if (minutesDiff >= 15 && minutesDiff < 20 && !context[notificationKey]?.sent_15min) {
          message = `Olá! 

Espero que tenha gostado da aula! 😊

Como foi sua experiência? Tem alguma dúvida?
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_15min = true
        }
        // 2 horas depois (entre 2h e 2h30)
        else if (hoursDiff >= 2 && hoursDiff < 2.5 && !context[notificationKey]?.sent_2h) {
          message = `Olá! 

Como está se sentindo após a aula? 

Se tiver alguma dúvida sobre o que foi apresentado, estou aqui para ajudar! 😊
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_2h = true
        }
        // 24 horas depois (entre 24h e 25h)
        else if (hoursDiff >= 24 && hoursDiff < 25 && !context[notificationKey]?.sent_24h) {
          message = `Olá! 

Passou um dia desde a aula. Como está sendo aplicar o que aprendeu?

Se precisar de ajuda ou tiver dúvidas, estou aqui! 💚
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_24h = true
        }

        if (shouldSend && message) {
          const result = await client.sendTextMessage({
            phone: conv.phone,
            message,
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conv.id,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })

            // Atualizar contexto
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context,
                last_message_at: new Date().toISOString(),
                last_message_from: 'bot',
              })
              .eq('id', conv.id)

            sent++
            await bulkSendDelay(sent)
          } else {
            errors++
          }
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar notificação pós-aula para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar notificações pós-aula:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Envia notificações para quem não respondeu após boas-vindas
 * - 24h depois: Notificação 1
 * - 48h depois: Notificação 2
 * - 72h depois: Notificação 3 (última)
 */
export async function sendFollowUpToNonResponders(): Promise<{
  sent: number
  errors: number
}> {
  try {
    const now = new Date()
    const area = 'nutri'

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { sent: 0, errors: 0 }
    }

    // Buscar próximas 2 sessões
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('title, starts_at, zoom_link')
      .eq('area', area)
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    // Buscar conversas que receberam boas-vindas mas não responderam
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context, created_at')
      .eq('area', area)
      .eq('status', 'active')

    if (!conversations || conversations.length === 0) {
      return { sent: 0, errors: 0 }
    }

    let sent = 0
    let errors = 0

    for (const conv of conversations) {
      try {
        const context = conv.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        
        // Verificar se recebeu boas-vindas mas não agendou
        const receivedWelcome = tags.includes('recebeu_link_workshop') || tags.includes('veio_aula_pratica')
        const hasScheduled = tags.includes('agendou_aula') || context.workshop_session_id
        
        if (!receivedWelcome || hasScheduled) continue

        // Verificar se cliente já enviou mensagem
        const { data: customerMessage } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id, created_at')
          .eq('conversation_id', conv.id)
          .eq('sender_type', 'customer')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle()

        // Se cliente já enviou mensagem, não enviar follow-up
        if (customerMessage) continue

        // Calcular tempo desde criação da conversa
        const convDate = new Date(conv.created_at)
        const timeDiff = now.getTime() - convDate.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)

        const client = createZApiClient(instance.instance_id, instance.token)
        const notificationKey = 'follow_up_welcome'

        let message: string | null = null
        let shouldSend = false

        // 24 horas depois
        if (hoursDiff >= 24 && hoursDiff < 25 && !context[notificationKey]?.sent_24h) {
          message = `Olá! 👋

Vi que você ainda não escolheu um horário para a aula. 

Ainda está disponível? Se precisar de ajuda, é só me chamar! 😊
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_24h = true
        }
        // 48 horas depois
        else if (hoursDiff >= 48 && hoursDiff < 49 && !context[notificationKey]?.sent_48h) {
          // Formatar opções
          let optionsText = ''
          if (sessions && sessions.length > 0) {
            sessions.forEach((session, index) => {
              const { weekday, date, time } = formatSessionDateTime(session.starts_at)
              optionsText += `\n*Opção ${index + 1}:*\n${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n`
            })
          }

          message = `Olá! 

Ainda estou aqui caso queira agendar a aula. 

Se alguma dessas opções funcionar, é só me avisar:

🗓️ *Opções Disponíveis:*
${optionsText}Qualquer dúvida, estou à disposição! 💚
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_48h = true
        }
        // 72 horas depois (última)
        else if (hoursDiff >= 72 && hoursDiff < 73 && !context[notificationKey]?.sent_72h) {
          message = `Olá! 

Esta é minha última mensagem sobre a aula. Se ainda tiver interesse, me avise! 

Caso contrário, tudo bem também. 😊
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_72h = true
          // Adicionar tag
          const newTags = [...new Set([...tags, 'sem_resposta'])]
          context.tags = newTags
        }

        if (shouldSend && message) {
          const result = await client.sendTextMessage({
            phone: conv.phone,
            message,
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conv.id,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })

            // Atualizar contexto
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context,
                last_message_at: new Date().toISOString(),
                last_message_from: 'bot',
              })
              .eq('id', conv.id)

            sent++
            await bulkSendDelay(sent)
          } else {
            errors++
          }
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar follow-up para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar follow-up:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Processo de fechamento/vendas pós-aula
 * Ativado quando admin adiciona tag "participou_aula"
 * Trabalha o emocional e lembra o motivo
 */
export async function sendSalesFollowUpAfterClass(): Promise<{
  sent: number
  errors: number
}> {
  try {
    const now = new Date()
    const area = 'nutri'

    // Buscar instância Z-API
    // Primeiro tenta buscar por área e status connected
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    // Se não encontrou, tenta buscar apenas por área (sem filtro de status)
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', area)
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
        console.log('[Carol] ⚠️ Instância encontrada mas status não é "connected":', instanceByArea)
      }
    }

    // Se ainda não encontrou, tenta buscar qualquer instância conectada (fallback)
    if (!instance) {
      const { data: instanceFallback } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (instanceFallback) {
        instance = instanceFallback
        console.log('[Carol] ⚠️ Usando instância fallback (não é da área nutri):', instanceFallback)
      }
    }

    if (!instance) {
      return { sent: 0, errors: 0 }
    }

    // Buscar conversas que participaram mas ainda não receberam follow-up de vendas
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', area)
      .eq('status', 'active')

    if (!conversations || conversations.length === 0) {
      return { sent: 0, errors: 0 }
    }

    // Filtrar quem participou mas não recebeu follow-up de vendas
    const participants = conversations.filter((conv) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      const hasParticipated = tags.includes('participou_aula')
      const hasReceivedSalesFollowUp = context.sales_follow_up_sent === true
      const isClient = tags.includes('cliente_nutri')
      
      return hasParticipated && !hasReceivedSalesFollowUp && !isClient
    })

    if (participants.length === 0) {
      return { sent: 0, errors: 0 }
    }

    let sent = 0
    let errors = 0

    for (const conv of participants) {
      try {
        const context = conv.context || {}
        const sessionId = context.workshop_session_id
        
        // Carol usa apenas primeiro nome (só do cadastro ou nome válido – nunca Nutri/Inge/nota)
        const registrationName = await getRegistrationName(conv.phone, 'nutri')
        const safeConvName = conv.name && !isInvalidOrInternalName(conv.name) ? conv.name : ''
        let leadName = getFirstName(registrationName || safeConvName) || 'querido(a)'
        if (isBusinessName(leadName) || isInvalidOrInternalName(leadName)) leadName = 'querido(a)'
        
        // Atualizar lead_name no context se encontrou nome do cadastro (guardamos nome completo)
        if (registrationName && registrationName !== (context as any)?.lead_name) {
          context.lead_name = registrationName
        }
        
        // Buscar sessão para saber quando foi
        let sessionDate: Date | null = null
        if (sessionId) {
          const { data: session } = await supabaseAdmin
            .from('whatsapp_workshop_sessions')
            .select('starts_at')
            .eq('id', sessionId)
            .single()
          
          if (session) {
            sessionDate = new Date(session.starts_at)
          }
        }

        const client = createZApiClient(instance.instance_id, instance.token)
        const notificationKey = 'sales_follow_up'

        // Calcular tempo desde a aula (se tiver data)
        let hoursSinceClass = 0
        if (sessionDate) {
          const sessionEndDate = new Date(sessionDate.getTime() + 45 * 60 * 1000) // 45 minutos depois
          const timeDiff = now.getTime() - sessionEndDate.getTime()
          hoursSinceClass = timeDiff / (1000 * 60 * 60)
        }

        let message: string | null = null
        let shouldSend = false

        // Primeira mensagem de follow-up (após 3 horas - caso não tenha respondido)
        if (hoursSinceClass >= 3 && hoursSinceClass < 4 && !context[notificationKey]?.sent_3h) {
          message = `Oi ${leadName}! 

Ficou alguma dúvida? 

Você não quer começar? Vamos começar?

O que está passando pela sua cabeça? 😊
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_3h = true
        }
        // Segunda mensagem de fechamento (após 12 horas da aula)
        else if (hoursSinceClass >= 12 && hoursSinceClass < 13 && !context[notificationKey]?.sent_12h) {
          message = `Olá ${leadName}! 💚

Lembro do motivo que te trouxe até aqui... 🌟

Você tinha um sonho, um objetivo. Algo que te moveu a buscar essa mudança.

Pensa comigo: quanto custa NÃO mudar? Quanto custa continuar adiando esse sonho?

O investimento é de apenas R$ 97 por mês. Menos de R$ 3,50 por dia.

Pensa no que você vai ganhar: um estado de espírito completamente diferente, a transformação que você busca, a realização desse sonho que te moveu até aqui.

E você pode começar pelo menos com o mensal para se certificar de que é isso mesmo que você quer. Sem compromisso de longo prazo.

Qual é a sua maior dúvida ou objeção para começar agora? 😊
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_12h = true
        }
        // Segunda mensagem (após 24 horas)
        else if (hoursSinceClass >= 24 && hoursSinceClass < 25 && !context[notificationKey]?.sent_24h) {
          message = `Olá ${leadName}! 

Passou um dia desde a aula... 

E eu fico pensando: será que você já começou a aplicar o que aprendeu? 

Ou será que ainda está esperando o "momento perfeito"? 

Sabe, o momento perfeito não existe. O momento certo é AGORA. 

Você veio até aqui porque tinha um sonho. Pensa: quanto custa NÃO realizar esse sonho? Quanto custa continuar adiando?

O investimento é de apenas R$ 97 por mês. Menos de R$ 3,50 por dia para transformar sua vida.

Pensa no estado de espírito que você vai adquirir, na transformação que você busca, na realização desse sonho.

E você pode começar pelo menos com o mensal para se certificar. Sem pressão, sem compromisso de longo prazo.

O que está te impedindo de começar agora? É o investimento, o tempo, ou alguma dúvida específica? 💚
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_24h = true
        }
        // Terceira mensagem (após 48 horas - última)
        else if (hoursSinceClass >= 48 && hoursSinceClass < 49 && !context[notificationKey]?.sent_48h) {
          message = `Olá ${leadName}! 

Esta é minha última mensagem sobre isso... 

Mas antes, quero te lembrar: você veio até aqui por um motivo. 

Você tinha um sonho, um objetivo. Algo que te moveu. 

Pensa: quanto custa NÃO mudar? Quanto custa continuar adiando esse sonho que te trouxe até aqui?

O investimento é de apenas R$ 97 por mês. Menos de R$ 3,50 por dia.

Pensa no que você vai ganhar: um estado de espírito completamente diferente, a transformação que você busca, a realização desse sonho.

E você pode começar pelo menos com o mensal para se certificar. Sem compromisso, sem pressão.

Não deixe que esse momento passe. Não deixe que a vida te distraia do que realmente importa. 

Você merece ver esse sonho se tornar realidade.

Qual é a sua maior objeção? Investimento, tempo, ou outra coisa? 

O que está te travando exatamente? O momento é AGORA. Vamos conversar? 💚
`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_48h = true
          context.sales_follow_up_sent = true
        }

        if (shouldSend && message) {
          const result = await client.sendTextMessage({
            phone: conv.phone,
            message,
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conv.id,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })

            // Atualizar contexto (incluindo lead_name se foi encontrado)
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context: {
                  ...context,
                  ...(registrationName && registrationName !== (context as any)?.lead_name ? { lead_name: registrationName } : {})
                },
                last_message_at: new Date().toISOString(),
                last_message_from: 'bot',
              })
              .eq('id', conv.id)

            sent++
            await bulkSendDelay(sent)
          } else {
            errors++
          }
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar follow-up de vendas para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar follow-up de vendas:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Envia link de cadastro imediatamente após pessoa participar da aula
 * Ativado quando admin adiciona tag "participou_aula"
 * Inclui argumentação e provoca manifestação de interesse/objeções
 * @param options.ignoreTime - Ordem do admin (clique em Participou/Não participou): envia sempre, independente de horário
 */
export async function sendRegistrationLinkAfterClass(
  conversationId: string,
  options?: { ignoreTime?: boolean }
): Promise<{
  success: boolean
  error?: string
  /** Quando o envio falha, texto para o admin enviar manualmente */
  messageForManual?: string
}> {
  try {
    const area = 'nutri'

    // Buscar conversa
    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('id', conversationId)
      .eq('area', area)
      .single()

    if (!conversation) {
      return { success: false, error: 'Conversa não encontrada' }
    }

    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []

    // Verificar se já participou
    if (!tags.includes('participou_aula')) {
      return { success: false, error: 'Pessoa ainda não participou da aula', messageForManual: undefined }
    }

    // Verificar se já recebeu link de cadastro
    if (context.registration_link_sent === true) {
      return { success: false, error: 'Link de cadastro já foi enviado', messageForManual: undefined }
    }

    const registrationUrl = process.env.NUTRI_REGISTRATION_URL || 'https://www.ylada.com/pt/nutri#oferta'

    // Horário: só aplica restrição 8h–19h quando NÃO for ordem do admin (clique no botão)
    const ignoreTime = options?.ignoreTime === true
    const timeCheck = isAllowedTimeToSendMessage()
    if (!ignoreTime && !timeCheck.allowed) {
      console.log('[Carol Registration Link] ⏰ Fora do horário permitido:', {
        reason: timeCheck.reason,
        nextAllowedTime: timeCheck.nextAllowedTime?.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      })
      const { getFlowTemplate, applyTemplate } = await import('@/lib/whatsapp-flow-templates')
      const linkTemplate = await getFlowTemplate('nutri', 'link_after_participou')
      const msgForManual = linkTemplate
        ? applyTemplate(linkTemplate, { nome: '[NOME]', link: registrationUrl })
        : `Parabéns por ter participado da aula, [NOME]! 💚

Eu tenho certeza que você tem potencial, só faltava a estrutura certa pra você executar de verdade e mudar sua história de uma vez por todas.

Você já pode começar hoje no plano *mensal* ou no *anual* e ajustar sua agenda imediatamente pra iniciar a captação de clientes.

🔗 ${registrationUrl}

Qual você prefere, *mensal* ou *anual*?`
      return { 
        success: false, 
        error: `Mensagem automática não enviada: ${timeCheck.reason}. Use o texto abaixo para enviar manualmente.`,
        messageForManual: msgForManual
      }
    }

    // Buscar instância Z-API usando função helper centralizada
    const instance = await getZApiInstance(area)

    if (!instance) {
      console.error('[Carol] ❌ Instância Z-API não encontrada para área:', area)
      return {
        success: false,
        error: 'Instância Z-API não encontrada. Verifique se há uma instância Z-API cadastrada no sistema.',
        messageForManual: undefined,
      }
    }

    const client = createZApiClient(instance.instance_id, instance.token)
    
    // Buscar nome do cadastro; Carol usa apenas primeiro nome (nunca usar conversation.name se for nota interna)
    const safeConvName = conversation.name && !isInvalidOrInternalName(conversation.name) ? conversation.name : ''
    let leadName = getFirstName(safeConvName) || 'querido(a)'
    let registrationName: string | null = null
    
    try {
      const phoneClean = conversation.phone.replace(/\D/g, '')
      
      // Tentar buscar de workshop_inscricoes primeiro
      const { data: workshopReg } = await supabaseAdmin
        .from('workshop_inscricoes')
        .select('nome')
        .ilike('telefone', `%${phoneClean.slice(-8)}%`) // Buscar pelos últimos 8 dígitos
        .limit(1)
        .maybeSingle()
      
      if (workshopReg?.nome) {
        registrationName = workshopReg.nome
      } else {
        // Fallback para contact_submissions
        const { data: contactReg } = await supabaseAdmin
          .from('contact_submissions')
          .select('name, nome')
          .or(`phone.ilike.%${phoneClean.slice(-8)}%,telefone.ilike.%${phoneClean.slice(-8)}%`)
          .limit(1)
          .maybeSingle()
        
        if (contactReg?.name || contactReg?.nome) {
          registrationName = contactReg.name || contactReg.nome || null
        }
      }
      
      // Priorizar nome do cadastro; na mensagem usar apenas primeiro nome
      if (registrationName) {
        leadName = getFirstName(registrationName) || 'querido(a)'
        // Atualizar lead_name no context se encontrou nome do cadastro
        if (registrationName !== (context as any)?.lead_name) {
          context.lead_name = registrationName
          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...context,
                lead_name: registrationName
              }
            })
            .eq('id', conversationId)
        }
      }
    } catch (error: any) {
      console.warn('[Carol] Erro ao buscar nome do cadastro:', error.message)
      // Continuar com o nome do WhatsApp se houver erro
    }

    // Mensagem imediata após participar da aula (template editável em /admin/whatsapp/fluxo ou padrão)
    const { getFlowTemplate, applyTemplate } = await import('@/lib/whatsapp-flow-templates')
    const linkTemplate = await getFlowTemplate('nutri', 'link_after_participou')
    const message = linkTemplate
      ? applyTemplate(linkTemplate, { nome: leadName, link: registrationUrl })
      : `Parabéns por ter participado da aula, ${leadName}! 💚

Eu tenho certeza que você tem potencial, só faltava a estrutura certa pra você executar de verdade e mudar sua história de uma vez por todas.

Você já pode começar hoje no plano *mensal* ou no *anual* e ajustar sua agenda imediatamente pra iniciar a captação de clientes.

🔗 ${registrationUrl}

Qual você prefere, *mensal* ou *anual*?
`

    // Imagem que acompanha a mensagem: configurada no admin ou, por padrão, o logo Nutri by YLADA
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || process.env.NEXT_PUBLIC_APP_URL || 'https://www.ylada.com'
    const defaultNutriImageUrl = `${baseUrl}/images/logo/nutri-horizontal.png`

    const { data: workshopSettings } = await supabaseAdmin
      .from('whatsapp_workshop_settings')
      .select('oferta_image_url')
      .eq('area', area)
      .maybeSingle()

    const ofertaImageUrl = (workshopSettings?.oferta_image_url?.trim() || defaultNutriImageUrl)

    const result = ofertaImageUrl
      ? await client.sendImageMessage({
          phone: conversation.phone,
          image: ofertaImageUrl,
          caption: message,
        })
      : await client.sendTextMessage({
          phone: conversation.phone,
          message,
        })

    if (result.success) {
      // Salvar mensagem
      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversation.id,
        instance_id: instance.id,
        z_api_message_id: result.id || null,
        sender_type: 'bot',
        sender_name: 'Carol - Secretária',
        message,
        message_type: ofertaImageUrl ? 'image' : 'text',
        ...(ofertaImageUrl && { media_url: ofertaImageUrl }),
        status: 'sent',
        is_bot_response: true,
      })

      // Atualizar contexto (remate fixo: 1ª mensagem de fechamento)
      context.registration_link_sent = true
      context.registration_link_sent_at = new Date().toISOString()
      const tags = Array.isArray(context.tags) ? context.tags : []
      const newTags = [...new Set([...tags, 'recebeu_1a_msg_fechamento'])]

      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context: { ...context, tags: newTags },
          last_message_at: new Date().toISOString(),
          last_message_from: 'bot',
        })
        .eq('id', conversation.id)

      return { success: true }
    } else {
      return { success: false, error: 'Erro ao enviar mensagem', messageForManual: message }
    }
  } catch (error: any) {
    console.error('[Carol] Erro ao enviar link de cadastro:', error)
    return { success: false, error: error.message, messageForManual: undefined }
  }
}

const REGISTRATION_URL = () => process.env.NUTRI_REGISTRATION_URL || 'https://www.ylada.com/pt/nutri#oferta'

/**
 * Disparo único (temporário): mensagem de remate "valor novo" para quem já participou e não pagou.
 * Uma mensagem por pessoa; marca recebeu_remate_valor_novo para não reenviar.
 * Copy: concentramos na operação que enche agenda → redução 97 mensal e 59 anual; serve para quem ouviu preço antigo ou novo.
 */
export async function sendRemateValorNovoParticipou(): Promise<{ sent: number; errors: number }> {
  const area = 'nutri'
  const instance = await getZApiInstance(area)
  if (!instance) {
    console.warn('[Carol Remate Valor Novo] Instância Z-API não encontrada')
    return { sent: 0, errors: 0 }
  }
  const timeCheck = isAllowedTimeToSendMessage()
  if (!timeCheck.allowed) {
    return { sent: 0, errors: 0 }
  }
  const url = REGISTRATION_URL()
  const { data: conversations } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('id, phone, name, context')
    .eq('area', area)
    .eq('status', 'active')
  if (!conversations?.length) return { sent: 0, errors: 0 }

  const eligible = conversations.filter((conv) => {
    const context = conv.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []
    if (!tags.includes('participou_aula') || context.registration_link_sent !== true) return false
    if (tags.includes('cliente_nutri')) return false
    if (context.recebeu_remate_valor_novo === true) return false
    return true
  })

  let sent = 0
  let errors = 0
  for (const conv of eligible) {
    const context = conv.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []
    const registrationName = await getRegistrationName(conv.phone, area)
    const safeName = conv.name && !isInvalidOrInternalName(conv.name) ? conv.name : ''
    let leadName = getFirstName(registrationName || (context as any)?.lead_name || safeName) || 'querido(a)'
    if (isBusinessName(leadName) || isInvalidOrInternalName(leadName)) leadName = 'querido(a)'

    const message = `Oi ${leadName}! 💚

Concentramos toda a operação nas ações que realmente enchem agenda. Com isso conseguimos uma redução do plano: *R$ 97/mês no mensal* e *R$ 59/mês no anual*.

Quem participou da aula e ainda não fechou: o link pra garantir essa condição é este: ${url}

Qualquer dúvida, é só responder aqui. 😊`

    try {
      const result = await sendWhatsAppMessage(conv.phone, message, instance.instance_id, instance.token)
      if (result.success) {
        await supabaseAdmin.from('whatsapp_messages').insert({
          conversation_id: conv.id,
          instance_id: instance.id,
          z_api_message_id: result.messageId || null,
          sender_type: 'bot',
          sender_name: 'Carol - Secretária',
          message,
          message_type: 'text',
          status: 'sent',
          is_bot_response: true,
        })
        await supabaseAdmin
          .from('whatsapp_conversations')
          .update({
            context: {
              ...context,
              recebeu_remate_valor_novo: true,
              recebeu_remate_valor_novo_at: new Date().toISOString(),
            },
            last_message_at: new Date().toISOString(),
            last_message_from: 'bot',
          })
          .eq('id', conv.id)
        sent++
        await bulkSendDelay(sent)
      } else {
        errors++
      }
    } catch (e: any) {
      errors++
      console.warn('[Carol Remate Valor Novo] Erro para', conv.phone, e?.message || e)
    }
  }
  if (sent > 0 || errors > 0) {
    console.log('[Carol Remate Valor Novo]', { sent, errors, total: eligible.length })
  }
  return { sent, errors }
}

/**
 * Remate fixo para quem PARTICIPOU da aula gratuita.
 * Envia 2ª msg (lembrete com dor) e 3ª msg (outro argumento) conforme o tempo desde a 1ª.
 * Respeita tags: não envia para cliente_nutri, respondeu_fechamento, nao_quer_mais, quer_falar_humano.
 */
export async function runRemateFechamentoParticipou(): Promise<{ sent2: number; sent3: number; errors: number }> {
  const area = 'nutri'
  const now = new Date()
  const tenHoursMs = 10 * 60 * 60 * 1000
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000

  const instance = await getZApiInstance(area)
  if (!instance) {
    console.warn('[Carol Remate Participou] Instância Z-API não encontrada')
    return { sent2: 0, sent3: 0, errors: 0 }
  }

  const timeCheck = isAllowedTimeToSendMessage()
  if (!timeCheck.allowed) {
    return { sent2: 0, sent3: 0, errors: 0 }
  }

  const { data: conversations } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('id, phone, name, context')
    .eq('area', area)
    .eq('status', 'active')

  if (!conversations?.length) return { sent2: 0, sent3: 0, errors: 0 }

  const url = REGISTRATION_URL()
  let sent2 = 0
  let sent3 = 0
  let errors = 0

  for (const conv of conversations) {
    const context = conv.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []
    if (!tags.includes('participou_aula') || context.registration_link_sent !== true) continue
    if (tags.includes('cliente_nutri') || tags.includes('respondeu_fechamento') || tags.includes('nao_quer_mais') || tags.includes('quer_falar_humano')) continue

    const registrationSentAt = context.registration_link_sent_at ? new Date(context.registration_link_sent_at as string).getTime() : 0
    const lembreteSentAt = context.recebeu_lembrete_fechamento_at ? new Date(context.recebeu_lembrete_fechamento_at as string).getTime() : 0

    const registrationName = await getRegistrationName(conv.phone, area)
    const safeName = conv.name && !isInvalidOrInternalName(conv.name) ? conv.name : ''
    let leadName = getFirstName(registrationName || (context as any)?.lead_name || safeName) || 'querido(a)'
    if (isBusinessName(leadName) || isInvalidOrInternalName(leadName)) leadName = 'querido(a)'

    let message: string | null = null
    let etapa: '2' | '3' | null = null

    if (!tags.includes('recebeu_lembrete_fechamento') && registrationSentAt && now.getTime() - registrationSentAt >= tenHoursMs) {
      etapa = '2'
      message = `Oi ${leadName}! 💚

Passando aqui pra lembrar: você já viu o caminho na aula. O que custa *não* dar o próximo passo é continuar adiando o que você quer.

O que mais nos travava era a *aquisição de pacientes*, então estamos com uma condução especial focada só nisso. O investimento é *R$ 97/mês* e o link pra começar é: ${url}

O que está te travando? Responde aqui que a gente desata. 😊`
    } else if (
      tags.includes('recebeu_lembrete_fechamento') &&
      !tags.includes('recebeu_3a_msg_fechamento') &&
      lembreteSentAt &&
      now.getTime() - lembreteSentAt >= twoDaysMs
    ) {
      etapa = '3'
      message = `Oi ${leadName}!

Última mensagem sobre isso: cada dia que passa é um dia a mais na mesma. O investimento é R$ 97/mês e o link segue aqui: ${url}

Se ainda tiver dúvida, responde aqui. Caso contrário, tudo bem também. 💚`
    }

    if (!message || !etapa) continue

    try {
      const result = await sendWhatsAppMessage(conv.phone, message, instance.instance_id, instance.token)
      if (result.success) {
        await supabaseAdmin.from('whatsapp_messages').insert({
          conversation_id: conv.id,
          instance_id: instance.id,
          z_api_message_id: result.messageId || null,
          sender_type: 'bot',
          sender_name: 'Carol - Secretária',
          message,
          message_type: 'text',
          status: 'sent',
          is_bot_response: true,
        })
        const newTags = [...new Set([...tags, etapa === '2' ? 'recebeu_lembrete_fechamento' : 'recebeu_3a_msg_fechamento'])]
        const nextContext: Record<string, unknown> = {
          ...context,
          tags: newTags,
          ...(etapa === '2' ? { recebeu_lembrete_fechamento_at: new Date().toISOString() } : {}),
        }
        await supabaseAdmin
          .from('whatsapp_conversations')
          .update({
            context: nextContext,
            last_message_at: new Date().toISOString(),
            last_message_from: 'bot',
          })
          .eq('id', conv.id)
        if (etapa === '2') sent2++
        else sent3++
        await bulkSendDelay(sent2 + sent3)
      } else {
        errors++
      }
    } catch (e: any) {
      errors++
      console.warn('[Carol Remate Participou] Erro para', conv.phone, e?.message || e)
    }
  }

  if (sent2 + sent3 > 0) {
    console.log('[Carol Remate Participou]', { sent2, sent3, errors })
  }
  return { sent2, sent3, errors }
}

/**
 * Remate fixo para quem NÃO PARTICIPOU da aula gratuita.
 * Envia 2ª msg (reforço + oferta de horário) e 3ª msg (último convite) conforme o tempo desde o remarketing.
 */
export async function runRemateNaoParticipou(): Promise<{ sent2: number; sent3: number; errors: number }> {
  const area = 'nutri'
  const now = new Date()
  const oneDayMs = 24 * 60 * 60 * 1000
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000

  const instance = await getZApiInstance(area)
  if (!instance) {
    console.warn('[Carol Remate Não Participou] Instância Z-API não encontrada')
    return { sent2: 0, sent3: 0, errors: 0 }
  }

  const timeCheck = isAllowedTimeToSendMessage()
  if (!timeCheck.allowed) return { sent2: 0, sent3: 0, errors: 0 }

  const { data: sessions } = await supabaseAdmin
    .from('whatsapp_workshop_sessions')
    .select('id, title, starts_at, zoom_link')
    .eq('area', area)
    .eq('is_active', true)
    .gte('starts_at', now.toISOString())
    .order('starts_at', { ascending: true })
    .limit(3)

  const { data: conversations } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('id, phone, name, context')
    .eq('area', area)
    .eq('status', 'active')

  if (!conversations?.length) return { sent2: 0, sent3: 0, errors: 0 }

  const tz = 'America/Sao_Paulo'
  let sent2 = 0
  let sent3 = 0
  let errors = 0

  for (const conv of conversations) {
    const context = conv.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []
    if (!tags.includes('nao_participou_aula') || tags.includes('participou_aula')) continue
    if (tags.includes('recebeu_3a_remate_nao_participou')) continue

    const lastRemarketingAt = context.last_remarketing_at ? new Date(context.last_remarketing_at as string).getTime() : 0
    const segundaSentAt = context.recebeu_2a_remate_nao_participou_at ? new Date(context.recebeu_2a_remate_nao_participou_at as string).getTime() : 0

    const registrationName = await getRegistrationName(conv.phone, area)
    const safeName = conv.name && !isInvalidOrInternalName(conv.name) ? conv.name : ''
    let leadName = getFirstName(registrationName || (context as any)?.lead_name || safeName) || 'querido(a)'
    if (isBusinessName(leadName) || isInvalidOrInternalName(leadName)) leadName = 'querido(a)'

    let message: string | null = null
    let etapa: '2' | '3' | null = null

    if (!tags.includes('recebeu_2a_remate_nao_participou') && lastRemarketingAt && now.getTime() - lastRemarketingAt >= oneDayMs) {
      etapa = '2'
      let optionsText = ''
      if (sessions?.length) {
        sessions.forEach((s: { starts_at: string; title?: string; zoom_link?: string }, i: number) => {
          const d = new Date(s.starts_at)
          const weekday = d.toLocaleDateString('pt-BR', { timeZone: tz, weekday: 'long' })
          const date = d.toLocaleDateString('pt-BR', { timeZone: tz })
          const time = d.toLocaleTimeString('pt-BR', { timeZone: tz, hour: '2-digit', minute: '2-digit' })
          optionsText += `\n🗓️ Opção ${i + 1}: ${weekday}, ${date} às ${time}\n${s.zoom_link || ''}\n`
        })
      }
      message = `Oi ${leadName}! 💚

Passando pra reforçar: a aula é gratuita e te mostra um caminho prático pra organizar a agenda. Ainda tem interesse?

Se sim, escolha um horário:${optionsText || '\nMe responde que eu te mando as opções disponíveis.'}

Qual período te encaixa melhor: manhã, tarde ou noite? 😊`
    } else if (
      tags.includes('recebeu_2a_remate_nao_participou') &&
      !tags.includes('recebeu_3a_remate_nao_participou') &&
      segundaSentAt &&
      now.getTime() - segundaSentAt >= twoDaysMs
    ) {
      etapa = '3'
      message = `Oi ${leadName}!

Última mensagem sobre a aula gratuita: se um dia fizer sentido participar, é só me chamar que eu te encaixo em um horário.

Qualquer dúvida, estou aqui. 💚`
    }

    if (!message || !etapa) continue

    try {
      const result = await sendWhatsAppMessage(conv.phone, message, instance.instance_id, instance.token)
      if (result.success) {
        await supabaseAdmin.from('whatsapp_messages').insert({
          conversation_id: conv.id,
          instance_id: instance.id,
          z_api_message_id: result.messageId || null,
          sender_type: 'bot',
          sender_name: 'Carol - Secretária',
          message,
          message_type: 'text',
          status: 'sent',
          is_bot_response: true,
        })
        const newTags = [...new Set([...tags, etapa === '2' ? 'recebeu_2a_remate_nao_participou' : 'recebeu_3a_remate_nao_participou'])]
        const nextContext: Record<string, unknown> = {
          ...context,
          tags: newTags,
          ...(etapa === '2' ? { recebeu_2a_remate_nao_participou_at: new Date().toISOString() } : {}),
        }
        await supabaseAdmin
          .from('whatsapp_conversations')
          .update({
            context: nextContext,
            last_message_at: new Date().toISOString(),
            last_message_from: 'bot',
          })
          .eq('id', conv.id)
        if (etapa === '2') sent2++
        else sent3++
        await bulkSendDelay(sent2 + sent3)
      } else {
        errors++
      }
    } catch (e: any) {
      errors++
      console.warn('[Carol Remate Não Participou] Erro para', conv.phone, e?.message || e)
    }
  }

  if (sent2 + sent3 > 0) {
    console.log('[Carol Remate Não Participou]', { sent2, sent3, errors })
  }
  return { sent2, sent3, errors }
}

/**
 * Envia lembretes de reunião para participantes agendados
 * Regras:
 * - Padrão: 12h antes da reunião
 * - Exceção: Segunda às 10h → lembrete no domingo às 17h
 * Respeita horário permitido (8h-19h seg-sex, até 13h sábado)
 */
export async function sendWorkshopReminders(): Promise<{
  sent: number
  errors: number
  skipped: number
  aborted?: boolean
}> {
  try {
    const now = new Date()
    const area = 'nutri'

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    if (!instance) {
      console.log('[Carol Reminders] ⚠️ Instância Z-API não encontrada')
      return { sent: 0, errors: 0, skipped: 0 }
    }

    // Buscar todas as sessões ativas futuras
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, title, starts_at, zoom_link')
      .eq('area', area)
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })

    if (!sessions || sessions.length === 0) {
      return { sent: 0, errors: 0, skipped: 0 }
    }

    // Buscar todas as conversas com sessões agendadas
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', area)
      .eq('status', 'active')

    if (!conversations || conversations.length === 0) {
      return { sent: 0, errors: 0, skipped: 0 }
    }

    const client = createZApiClient(instance.instance_id, instance.token)
    let sent = 0
    let errors = 0
    let skipped = 0

    // Processar cada sessão
    for (const session of sessions) {
      const sessionDate = new Date(session.starts_at)
      const sessionTime = sessionDate.getTime()
      const nowTime = now.getTime()
      
      // Formatar data/hora da sessão
      const { weekday, date, time } = formatSessionDateTime(session.starts_at)
      
      // Converter para horário de Brasília para verificar dia/hora
      const brasiliaDate = new Date(sessionDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
      const isMonday10am = brasiliaDate.getDay() === 1 && brasiliaDate.getHours() === 10
      
      // Calcular quando enviar lembrete
      let reminderTime: Date | null = null
      
      if (isMonday10am) {
        // Exceção: Segunda 10h → lembrete domingo 17h (horário de Brasília)
        const reminderDate = new Date(sessionDate)
        reminderDate.setDate(sessionDate.getDate() - 1) // Domingo
        reminderDate.setHours(17, 0, 0, 0) // 17h00
        // Ajustar para timezone de Brasília
        const reminderBrasilia = new Date(reminderDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
        reminderTime = reminderBrasilia
      } else {
        // Padrão: 12h antes da reunião
        reminderTime = new Date(sessionTime - 12 * 60 * 60 * 1000)
      }

      // Verificar se já passou o horário do lembrete
      if (nowTime < reminderTime.getTime()) {
        continue // Ainda não é hora de enviar
      }

      // Verificar se a sessão já aconteceu (se sim, não enviar lembrete)
      if (nowTime >= sessionTime) {
        continue // Sessão já aconteceu, não enviar lembrete
      }

      // Verificar se está dentro da janela de envio (até 2h após o horário do lembrete)
      // MAS se a sessão é hoje e ainda não aconteceu, permitir enviar mesmo se passou a janela
      const reminderWindowEnd = reminderTime.getTime() + 2 * 60 * 60 * 1000
      const isToday = nowBrasilia.toDateString() === brasiliaDate.toDateString()
      const isWithinWindow = nowTime <= reminderWindowEnd
      
      if (!isWithinWindow && !isToday) {
        continue // Janela de envio já passou E não é hoje
      }
      
      // Se é hoje e ainda não aconteceu, permitir enviar mesmo se passou a janela do lembrete
      if (isToday && nowTime < sessionTime) {
        console.log(`[Carol Reminders] ⚠️ Janela passou mas sessão é hoje - permitindo envio: ${date} ${time}`)
      }

      // Verificar se está em horário permitido (mas permitir domingo para lembretes especiais)
      const timeCheck = isAllowedTimeToSendMessage()
      const nowBrasilia = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
      const isSunday = nowBrasilia.getDay() === 0
      
      if (!timeCheck.allowed) {
        // Se for domingo e for lembrete de segunda 10h, permitir
        if (!isSunday || !isMonday10am) {
          skipped++
          continue
        }
      }

      // Buscar participantes desta sessão
      const participants = conversations.filter((conv: any) => {
        const context = conv.context || {}
        return context.workshop_session_id === session.id
      })

      if (participants.length === 0) {
        continue
      }

      // Enviar lembrete para cada participante
      for (const participant of participants) {
        try {
          if (await checkDisparoAbort('reminders')) {
            console.log('[Carol Reminders] ⏹️ Parar disparo solicitado pelo admin')
            return { sent, errors, skipped, aborted: true }
          }
          const context = participant.context || {}
          const reminderKey = `reminder_${session.id}`
          
          // Verificar se já enviou lembrete para esta sessão
          if (context[reminderKey]?.sent) {
            continue
          }

          // Formatar mensagem de lembrete (nunca usar nome de nota interna: Nutri, Inge, etc.)
          const safePartName = participant.name && !isInvalidOrInternalName(participant.name) ? getFirstName(participant.name) : ''
          const leadName = safePartName || 'Olá'
          const reminderMessage = `${leadName}! 👋

Lembrete: Sua aula está agendada para:

🗓️ ${weekday}, ${date}
🕒 ${time} (horário de Brasília)

Aqui está o link da sua aula:
${session.zoom_link}

Nos vemos em breve! 😊
`

          // Enviar mensagem
          const result = await client.sendTextMessage({
            phone: participant.phone,
            message: reminderMessage
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: participant.id,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message: reminderMessage,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true
            })

            // Marcar como enviado
            context[reminderKey] = {
              sent: true,
              sent_at: new Date().toISOString()
            }

            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({ context })
              .eq('id', participant.id)

            sent++
            console.log(`[Carol Reminders] ✅ Lembrete enviado para ${participant.phone} - Sessão: ${date} ${time}`)
            await bulkSendDelay(sent)
          } else {
            errors++
            console.error(`[Carol Reminders] ❌ Erro ao enviar para ${participant.phone}:`, result.error)
          }
        } catch (err: any) {
          errors++
          console.error(`[Carol Reminders] ❌ Erro ao processar participante:`, err)
        }
      }
    }

    return { sent, errors, skipped }
  } catch (error: any) {
    console.error('[Carol Reminders] ❌ Erro geral:', error)
    return { sent: 0, errors: 1, skipped: 0 }
  }
}

/**
 * Direciona pessoa para suporte após pagamento confirmado
 * Envia mensagem com link para WhatsApp do suporte: 5519996049800
 */
export async function redirectToSupportAfterPayment(
  conversationId: string,
  paymentInfo?: { amount?: number; plan?: string }
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const area = 'nutri'
    const supportPhone = '5519996049800'

    // Buscar conversa
    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('id', conversationId)
      .eq('area', area)
      .single()

    if (!conversation) {
      return { success: false, error: 'Conversa não encontrada' }
    }

    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []

    // Verificar se já foi direcionado
    if (context.redirected_to_support === true) {
      return { success: false, error: 'Já foi direcionado para suporte' }
    }

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { success: false, error: 'Instância Z-API não encontrada' }
    }

    const client = createZApiClient(instance.instance_id, instance.token)
    
    // Carol usa apenas primeiro nome (só cadastro ou nome válido – nunca Nutri/Inge/nota)
    const registrationName = await getRegistrationName(conversation.phone, 'nutri')
    const safeConvName = conversation.name && !isInvalidOrInternalName(conversation.name) ? conversation.name : ''
    const leadName = getFirstName(registrationName || safeConvName) || 'querido(a)'

    // Criar link do WhatsApp do suporte
    const supportWhatsAppLink = `https://wa.me/${supportPhone.replace(/\D/g, '')}`

    // Mensagem de direcionamento para suporte
    const message = `Olá ${leadName}! 🎉

Parabéns! Seu pagamento foi confirmado! 🎉

Agora você vai receber todo o suporte e orientação que precisa para começar sua jornada!

📱 *Entre em contato com nosso suporte:*
${supportWhatsAppLink}

Ou envie uma mensagem para: ${supportPhone}

Lá você vai receber:
✅ Materiais de suporte e orientação
✅ Acompanhamento personalizado
✅ Tudo que precisa para começar

Estamos aqui para te apoiar em cada passo! 💚
`

    const result = await client.sendTextMessage({
      phone: conversation.phone,
      message,
    })

    if (result.success) {
      // Salvar mensagem
      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversation.id,
        instance_id: instance.id,
        z_api_message_id: result.id || null,
        sender_type: 'bot',
        sender_name: 'Carol - Secretária',
        message,
        message_type: 'text',
        status: 'sent',
        is_bot_response: true,
      })

      // Atualizar contexto e tags (cliente_nutri = conta como Cliente nos relatórios WhatsApp)
      context.redirected_to_support = true
      context.redirected_to_support_at = new Date().toISOString()
      context.payment_confirmed = true
      context.payment_info = paymentInfo || {}

      const newTags = [...new Set([...tags, 'pagamento_confirmado', 'direcionado_suporte', 'cliente_nutri'])]
      context.tags = newTags

      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context,
          last_message_at: new Date().toISOString(),
          last_message_from: 'bot',
        })
        .eq('id', conversation.id)

      return { success: true }
    } else {
      return { success: false, error: 'Erro ao enviar mensagem' }
    }
  } catch (error: any) {
    console.error('[Carol] Erro ao direcionar para suporte:', error)
    return { success: false, error: error.message }
  }
}
