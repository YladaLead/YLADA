import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { createProLideresServerClient } from '@/lib/pro-lideres-server'
import { isJoiasVertical } from '@/lib/pro-joias-server'

type ScriptSeed = {
  stage: string
  title: string
  contexto: string
  canal: string
  content: string
}

type ToolSeed = {
  name: string
  emoji: string
  description: string
  scripts: ScriptSeed[]
}

const FERRAMENTAS_SEED: ToolSeed[] = [
  // ════════════════════════════════════════════════════════════════
  // FERRAMENTA 1 — RECRUTAMENTO DE DISTRIBUIDORAS
  // ════════════════════════════════════════════════════════════════
  {
    name: 'Recrutamento de Distribuidoras',
    emoji: '🤝',
    description: 'Scripts para convidar, apresentar a oportunidade e converter novas distribuidoras para sua rede',
    scripts: [
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'whatsapp',
        title: 'Convite inicial — amiga ou conhecida',
        content: `[Nome], posso te fazer uma pergunta?

Você já pensou em ter uma renda extra fazendo algo que as pessoas adoram — joias e bijuterias?

Estou com uma oportunidade na minha rede e lembrei de você. Não é esquema, é um modelo simples: você vende peças lindas para quem você já conhece e ainda indica outras pessoas para vender também.

Tem 10 minutos para eu te explicar como funciona? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'whatsapp',
        title: 'Abordagem pelo resultado — compartilhar conquista',
        content: `[Nome], você me permite compartilhar algo que está acontecendo comigo?

Comecei a trabalhar com joias e semijoias há [X meses] e já consegui [resultado — ex: pagar uma conta, fazer uma viagem, ter minha própria renda].

Não é mágica — é método. Tenho um grupo de distribuidoras e estou procurando pessoas comprometidas para crescer junto.

Você toparia entender melhor? Sem compromisso 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'instagram',
        title: 'DM Instagram — perfil que vende ou empreende',
        content: `Oi [Nome]! Vi seu perfil e percebi que você tem jeito para vendas / empreendedorismo.

Trabalho com uma rede de joias e semijoias e estou procurando pessoas com esse perfil para crescer junto.

Me conta: você tem algum produto ou serviço que já vende, ou está buscando uma nova fonte de renda? 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'indicacao',
        canal: 'whatsapp',
        title: 'Pedido de indicação — distribuidora satisfeita',
        content: `[Nome], fico feliz em ver como você está indo bem na rede! 🙌

Uma pergunta: tem alguém próxima de você — amiga, familiar, colega de trabalho — que você acha que teria perfil para distribuir joias também?

Não precisa saber vender: a gente ensina. Precisa só de vontade e gostar de pessoas.

Alguém vem à mente? 😊`,
      },
      {
        stage: 'follow_up',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Follow-up dia 3 — após enviar apresentação',
        content: `Oi [Nome]! Tudo bem?

Faz 3 dias que te mandei as informações sobre a oportunidade na minha rede de joias.

Queria saber: chegou a dar uma olhada? Tem alguma dúvida que eu possa responder?

Se ainda não for o momento certo, tudo bem — é só me falar 😊`,
      },
      {
        stage: 'follow_up',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Follow-up — "vou pensar"',
        content: `[Nome], sem pressa! Entendo que é uma decisão importante.

Só quero deixar dois pontos para você considerar:

1. O investimento inicial é baixo — você começa com o catálogo e vende antes de comprar em quantidade.
2. Você não fica sozinha — eu te acompanho no início e te ensino o que me foi ensinado.

Quando você quiser retomar a conversa, é só me chamar 😊`,
      },
      {
        stage: 'objecao',
        contexto: 'geral',
        canal: 'geral',
        title: 'Objeção: "Não sei vender"',
        content: `Entendo essa preocupação! Mas te falo: eu também achei que não sabia.

O que aprendi é que vender joia não é convencer — é mostrar. As peças falam por si mesmas, especialmente quando você usa.

Na minha rede, a gente começa pequeno: você mostra para 5 pessoas próximas e vê a reação. Você se surpreende com o resultado.

Posso te mostrar como funciona na prática? 😊`,
      },
      {
        stage: 'objecao',
        contexto: 'geral',
        canal: 'geral',
        title: 'Objeção: "Não tenho dinheiro para investir"',
        content: `Essa é a dúvida mais comum — e a resposta pode te surpreender.

Na minha rede, você começa com o catálogo digital, sem precisar ter estoque. Você mostra as peças, a cliente escolhe, e você faz o pedido depois de confirmar a venda.

O investimento inicial é só para formalizar sua entrada na rede — e ele volta rápido na primeira venda.

Posso te explicar em detalhe como funciona? Aí você decide com informação completa 😊`,
      },
      {
        stage: 'objecao',
        contexto: 'geral',
        canal: 'geral',
        title: 'Objeção: "Não tenho tempo"',
        content: `Faz todo sentido — tempo é o recurso mais valioso que temos.

O que posso te dizer é: a maioria das distribuidoras da minha rede trabalha em horários livres — manhã cedo, horário de almoço, noite. Não é um segundo emprego em horário fixo.

Você definiria quanto tempo quer dedicar. Quem dedica 1h por dia costuma ter resultados bons dentro de 30 dias.

Vale pelo menos conhecer como funciona na prática? 😊`,
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // FERRAMENTA 2 — VENDA AO CONSUMIDOR FINAL
  // ════════════════════════════════════════════════════════════════
  {
    name: 'Venda ao Consumidor Final',
    emoji: '💎',
    description: 'Scripts para abordar, qualificar e fechar vendas de joias, semijoias e bijuterias com o consumidor',
    scripts: [
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'whatsapp',
        title: 'Abertura — lista quente (apresentar produto)',
        content: `Oi [Nome]! Tudo bem?

Estou com novidades lindas aqui e lembrei de você 😊

Antes de mandar foto, me conta: você está procurando alguma peça específica agora — um anel, colar, brinco? Ou é mais para olhar e se inspirar?

Assim eu te mostro o que tem mais a ver com o que você precisa.`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_fria',
        canal: 'instagram',
        title: 'DM Instagram — abordagem por estilo',
        content: `Oi [Nome]! Vi que você tem um estilo bem definido nos stories 😊

Trabalho com joias e semijoias e tenho peças que combinam muito com o que você usa.

Me conta: você costuma usar mais peças clássicas e discretas, ou prefere algo mais marcante e moderno?`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'lista_quente',
        canal: 'whatsapp',
        title: 'Abertura — ocasião especial',
        content: `Oi [Nome]! Lembrei de você porque estou com coleções novas e perfeitas para [evento/ocasião — ex: casamento, formatura, Natal].

Você tem algum evento especial chegando ou está buscando uma peça para o dia a dia?

Me fala mais para eu te mostrar o que vai combinar melhor 😊`,
      },
      {
        stage: 'qualificacao',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Qualificação — entender antes de mostrar catálogo',
        content: `Antes de te mandar fotos, deixa eu entender melhor o que você está buscando:

1. É para você ou é presente para alguém?
2. Tem alguma peça que você já usa muito e quer combinar?
3. Prefere ouro, prata ou tom rosê?

Com isso consigo te mostrar exatamente o que vai te apaixonar 💛`,
      },
      {
        stage: 'qualificacao',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Diferença semijoia x bijuteria — explicar com valor',
        content: `Boa pergunta! Deixa eu explicar a diferença para você escolher com segurança:

**Bijuteria** — peça com acabamento em metal, sem garantia de banho. Ótima para usar com frequência em ocasiões casuais. Preço acessível.

**Semijoia** — peça com banho de ouro ou prata de alta qualidade, geralmente com garantia de 1 a 2 anos. Parece joia de verdade, dura muito mais e o preço ainda é bem mais em conta que a joia fina.

**Joia fina** — ouro/prata maciços, com ou sem pedras, para quem quer algo para a vida toda.

O que faz mais sentido para o que você está buscando?`,
      },
      {
        stage: 'fechamento',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Fechamento — após apresentar peça',
        content: `[Nome], o que você achou da peça?

Posso separar ela para você agora — tenho estoque limitado e peças assim costumam sair rápido.

Prefere pagar via Pix, cartão ou parcelado? Me fala que te passo os detalhes 😊`,
      },
      {
        stage: 'fechamento',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Fechamento — "vou pensar"',
        content: `[Nome], sem pressa! Só quero te falar uma coisa:

Essa peça está com preço especial até [data/quantidade]. Depois volta ao preço normal.

Se você quiser, posso separar por enquanto para você decidir com calma. Assim você não perde se decidir comprar 😊

O que você prefere?`,
      },
      {
        stage: 'objecao',
        contexto: 'geral',
        canal: 'geral',
        title: 'Objeção: "É muito caro"',
        content: `Entendo! O preço é mesmo um critério importante.

Me conta: você está comparando com qual referência? Com bijuteria de loja de shopping, com joia fina ou com semijoia de outra marca?

Pergunto porque a comparação muda bastante. Uma semijoia bem feita dura anos com os cuidados certos — diferente de bijuteria que escurece em meses.

Qual é o quanto você costuma investir em acessórios? Assim consigo te mostrar o que cabe melhor 😊`,
      },
      {
        stage: 'objecao',
        contexto: 'geral',
        canal: 'geral',
        title: 'Objeção: "Compro no marketplace mais barato"',
        content: `Entendo — no marketplace tem de tudo mesmo.

A diferença que costumo apontar é:

✅ Aqui você sabe exatamente o que está comprando — o material, o banho, a garantia.
✅ Se tiver qualquer problema, tem suporte direto comigo.
✅ As peças que trabalho têm procedência e qualidade consistente.

No marketplace você paga barato e às vezes recebe uma peça que escurece na semana. Aqui você paga um pouco mais e usa por anos.

Qual peça você costuma comprar por lá? Posso te mostrar uma equivalente aqui com mais garantia 😊`,
      },
      {
        stage: 'follow_up',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Follow-up — cliente sumiu após ver catálogo',
        content: `Oi [Nome]! Tudo bem?

Vi que você deu uma olhada nas peças outro dia. Queria saber se ficou com alguma dúvida ou se tem alguma peça específica que você não encontrou.

Às vezes o catálogo é grande e fica difícil escolher sozinha — se quiser, me conta o que você usa no dia a dia e eu te indico as 2 ou 3 peças que mais combinam com você 😊`,
      },
      {
        stage: 'follow_up',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Reativação — cliente antiga',
        content: `Oi [Nome]! Faz um tempinho que a gente não conversa 😊

Queria te avisar que chegaram peças novas aqui — especialmente [linha/categoria que ela gosta].

Tem alguma ocasião especial chegando ou está buscando renovar os acessórios? Me fala que te mostro as novidades 💛`,
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // FERRAMENTA 3 — DESENVOLVIMENTO DE EQUIPE
  // ════════════════════════════════════════════════════════════════
  {
    name: 'Desenvolvimento de Equipe',
    emoji: '📈',
    description: 'Scripts para onboarding, acompanhamento, motivação e reativação das distribuidoras da sua rede',
    scripts: [
      {
        stage: 'gerar_contato',
        contexto: 'novo_membro',
        canal: 'whatsapp',
        title: 'Boas-vindas — primeira mensagem para nova distribuidora',
        content: `[Nome], bem-vinda à nossa rede! 🎉

Estou muito feliz em ter você aqui. Quero que você saiba que não vai caminhar sozinha — estou aqui para te apoiar em cada passo.

Para começar da melhor forma, me conta:
1. Quantas horas por semana você pretende dedicar?
2. Você já vende alguma coisa ou é sua primeira experiência?
3. Quem são as primeiras 5 pessoas que você pensa em contatar?

Com isso consigo te dar um plano inicial bem prático 😊`,
      },
      {
        stage: 'gerar_contato',
        contexto: 'novo_membro',
        canal: 'whatsapp',
        title: 'Onboarding — lista quente dos primeiros 7 dias',
        content: `[Nome], vamos dar o primeiro passo juntas?

A estratégia mais simples para começar: escreva agora uma lista com 20 nomes de pessoas que você conhece e que podem gostar de joias ou da oportunidade.

Não precisa ser perfeita — escreve quem vier à cabeça: amigas, familiares, colegas, ex-colegas de trabalho.

Quando você tiver a lista, me manda. Aí a gente decide juntas quem abordar primeiro e com qual script 😊`,
      },
      {
        stage: 'acompanhamento',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Check-in semanal — acompanhamento de resultado',
        content: `Oi [Nome]! Check-in da semana 😊

Me conta:
✅ Quantas pessoas você abordou essa semana?
✅ Teve alguma venda ou interesse?
✅ Chegou em alguma dúvida ou dificuldade?

Não tem certo ou errado — o objetivo é entender onde você está para eu te ajudar melhor.`,
      },
      {
        stage: 'acompanhamento',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Feedback construtivo — baixo volume de atividade',
        content: `[Nome], queria ter uma conversa franca com você 😊

Percebi que essa semana foi mais parada. Quero entender o que aconteceu — sem julgamento nenhum.

Às vezes é falta de tempo, às vezes é travamento na hora de abordar, às vezes é só uma semana difícil.

Me conta: o que está dificultando mais? Com isso a gente acha uma solução juntas.`,
      },
      {
        stage: 'acompanhamento',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Reconhecimento — primeira venda',
        content: `[Nome]!!! 🎉🎉🎉

PARABÉNS pela primeira venda! Esse é um momento importante — você provou para si mesma que consegue.

Agora que você sabe que funciona, vamos repetir. Me conta: quem é a próxima pessoa na sua lista? 😊`,
      },
      {
        stage: 'acompanhamento',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Reconhecimento — meta batida ou resultado expressivo',
        content: `[Nome], precisei te falar sobre isso 💛

Você bateu [meta/resultado] esse mês. Isso não é sorte — é fruto do seu esforço e comprometimento.

Quero que você saiba que sua evolução é um orgulho para mim e uma inspiração para toda a rede.

O que você quer conquistar no próximo mês? Vamos traçar juntas 🚀`,
      },
      {
        stage: 'reativacao',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Reativação — distribuidora parada (7-14 dias)',
        content: `Oi [Nome]! Faz um tempinho que não te vejo por aqui 😊

Sem cobranças — só quero saber como você está e se tem algo que eu possa te ajudar.

Às vezes a vida enche de coisas e o negócio fica para segundo plano. Totalmente normal.

Quando você quiser retomar, é só me falar. Estou aqui 💛`,
      },
      {
        stage: 'reativacao',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Reativação — distribuidora parada (30+ dias)',
        content: `[Nome], oi! Tudo bem?

Faz um mês que não nos falamos e queria checar como você está.

Se a rede de joias ainda faz sentido para você, estamos de braços abertos. Se a vida tomou outro rumo, tudo bem também — quero só saber para não ficar te mandando mensagem sem sentido 😊

Como você está?`,
      },
      {
        stage: 'treinamento',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Treino de objeção — role-play com distribuidora',
        content: `[Nome], vou te propor um exercício rápido que ajuda muito!

Vou ser a "cliente difícil" e você pratica responder. Pode ser que você encontre essas situações de verdade nas próximas abordagens.

Pronta? Começo eu:

"Olha, é interessante, mas achei bem caro. No Shopee tem coisa parecida por muito menos..."

Agora é sua vez — como você responderia? Não precisa ser perfeito, é só para praticar 😊`,
      },
      {
        stage: 'treinamento',
        contexto: 'geral',
        canal: 'whatsapp',
        title: 'Compartilhamento de dica — cuidados com semijoias',
        content: `💡 Dica do dia para compartilhar com suas clientes:

**Como conservar sua semijoia por mais tempo:**

✅ Guarde em saquinho ou caixinha separada (evita oxidação)
✅ Tire antes de dormir, tomar banho e praticar esporte
✅ Evite perfume diretamente na peça
✅ Limpe com pano seco e macio após usar

Quando você orienta a cliente assim, ela confia mais em você, cuida melhor da peça e volta para comprar de novo 😊

Já compartilhou essa dica com alguém?`,
      },
    ],
  },
]

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const supabase = await createProLideresServerClient()
  const ctx = await resolveProLideresTenantContext(supabase, auth.user)

  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }

  if (!isJoiasVertical(ctx.tenant)) {
    return NextResponse.json({ error: 'Este endpoint é exclusivo para tenants Pro Joias' }, { status: 403 })
  }

  const tenantId = ctx.tenant.id
  const admin = supabaseAdmin

  if (!admin) {
    return NextResponse.json({ error: 'Service role não configurado' }, { status: 500 })
  }

  // Verificar se já tem ferramentas — seed é idempotente (não apaga o que existe)
  const { data: existing } = await admin
    .from('prolider_tools')
    .select('id')
    .eq('tenant_id', tenantId)

  if (existing && existing.length > 0) {
    return NextResponse.json({
      ok: true,
      message: `Tenant já possui ${existing.length} ferramenta(s). Seed não aplicado (use DELETE primeiro se quiser reiniciar).`,
      skipped: true,
    })
  }

  const results: { tool: string; scripts: number }[] = []

  for (const tool of FERRAMENTAS_SEED) {
    // Inserir ferramenta
    const { data: toolRow, error: toolErr } = await admin
      .from('prolider_tools')
      .insert({
        tenant_id: tenantId,
        name: tool.name,
        emoji: tool.emoji,
        description: tool.description,
        position: FERRAMENTAS_SEED.indexOf(tool),
      })
      .select()
      .single()

    if (toolErr || !toolRow) {
      console.error('[pro-joias seed] tool insert error:', toolErr?.message, tool.name)
      continue
    }

    // Inserir scripts da ferramenta
    const scriptsPayload = tool.scripts.map((s, idx) => ({
      tenant_id: tenantId,
      tool_id: toolRow.id,
      stage: s.stage,
      title: s.title,
      contexto: s.contexto,
      canal: s.canal,
      content: s.content,
      position: idx,
    }))

    const { error: scriptsErr } = await admin.from('prolider_scripts').insert(scriptsPayload)

    if (scriptsErr) {
      console.error('[pro-joias seed] scripts insert error:', scriptsErr.message, tool.name)
    }

    results.push({ tool: tool.name, scripts: tool.scripts.length })
  }

  return NextResponse.json({
    ok: true,
    message: `Seed aplicado com sucesso para tenant ${tenantId}`,
    results,
  })
}
