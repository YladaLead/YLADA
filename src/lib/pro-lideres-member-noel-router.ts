/**
 * Classificação interna da pergunta do membro (uso no prompt).
 */

export type ProLideresMemberNoelMode =
  | 'execucao'
  | 'objecao'
  | 'fechamento'
  | 'comportamento'
  | 'mentor'
  | 'catalogo'
  | 'emocional'
  | 'bloqueio_criar_link'
  | 'scripts_painel'
  | 'conversacional'

export type ProLideresMemberNoelRoute = {
  mode: ProLideresMemberNoelMode
  audience: 'cliente' | 'captacao' | 'oportunidade' | 'ambiguo'
  includeLink: boolean
  includeMensagemPronta: boolean
  directive: string
}

function normRouter(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
}

function norm(s: string): string {
  return normRouter(s)
}

function detectAudience(m: string): ProLideresMemberNoelRoute['audience'] {
  if (/(minha cliente|minha paciente|ja comprou|pos venda|pos-venda|retorno|reativar|sumiu|nao responde)/.test(m)) {
    return 'cliente'
  }
  if (/(oportunidade|convite|recrut|apresentacao|negocio|parceir|distribuidor|projeto|conhecer melhor)/.test(m)) {
    return 'oportunidade'
  }
  if (/(mais clientes|novos contatos|atrair|prospect|lista|captar|geracao de contato)/.test(m)) {
    return 'captacao'
  }
  return 'ambiguo'
}

/** Normaliza abreviações de chat (vc, tb…) antes de classificar intenção. */
function expandMemberNoelQueryNorm(userMessage: string): string {
  return normRouter(userMessage)
    .replace(/\bvc\b/g, 'voce')
    .replace(/\btb\b/g, 'tambem')
    .replace(/\bpq\b/g, 'porque')
    .replace(/\bq\b/g, 'que')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Perguntas gerais sobre o Noel — conversa, sem blocos de ação. */
export function isMemberNoelConversationalQuery(userMessage: string): boolean {
  const um = expandMemberNoelQueryNorm(userMessage)

  if (
    /(quem e (voce|noel)|quem eh (voce|noel)|o que (e|eh) (voce|noel)|o que voce faz|como (voce|noel) funciona|como funciona (o )?noel|me apresenta|se apresenta|quem eh o noel|o que e o noel|pra que serve|para que serve|voce e (uma ia|um robo|um bot)|noel quem e)/.test(
      um
    )
  ) {
    return true
  }
  if (
    /(duvida|dúvida|explica|me conta sobre|nao entendi|não entendi|nao sei o que|não sei o que)/.test(um) &&
    !/(mensagem|link|lista|post|story|objecao|objeção|whatsapp|zap|convite|abordar|mandar|enviar)/.test(um)
  ) {
    return true
  }
  return false
}

export function classifyProLideresMemberNoelMessage(
  message: string,
  opts?: { hasObjectionBase?: boolean }
): ProLideresMemberNoelRoute {
  const m = norm(message)
  const audience = detectAudience(m)
  const wantsText = /(mensagem|texto|o que falar|o que mandar|o que escrever|script|whatsapp|zap)/.test(m)

  if (isMemberNoelConversationalQuery(message)) {
    return {
      mode: 'conversacional',
      audience,
      includeLink: false,
      includeMensagemPronta: false,
      directive:
        'Resposta em conversa natural (1–3 parágrafos). **Sem** blocos Na prática, Mensagem pronta, Link para enviar ou Próximo passo.',
    }
  }

  if (/(criar|cria|gerar|gera|montar|fazer)\s*(um\s*)?(link|quiz|calculadora)/.test(m)) {
    return {
      mode: 'bloqueio_criar_link',
      audience,
      includeLink: false,
      includeMensagemPronta: false,
      directive:
        'Explique que os links ficam em **Meus links** (URLs suas no painel). **Sem** bloco Link para enviar — oriente a abrir o painel.',
    }
  }

  if (
    /(varios scripts|5 scripts|posts para equipe|gerar posts|story para todos|legenda para equipe)/.test(m) ||
    (/(post|story|legenda|reels)/.test(m) && /(equipe|todos|varios|em massa)/.test(m))
  ) {
    return {
      mode: 'scripts_painel',
      audience,
      includeLink: false,
      includeMensagemPronta: false,
      directive: 'Muitos posts: **Scripts** do líder. Aqui: 1 ideia do que postar + tom.',
    }
  }

  if (/(qual link|que link|mandar link|link da|link do|link para|meu link)/.test(m)) {
    return {
      mode: 'catalogo',
      audience,
      includeLink: true,
      includeMensagemPronta: /(mensagem|texto|o que falar|whatsapp|zap)/.test(m),
      directive:
        'Indique **qual link** (Meus links) e **por quê**. Se nada em [LINK INDICADO] couber, **1 pergunta curta** (oportunidade de negócio vs produto/saúde) — **não chute** URL fora de contexto. Mensagem pronta só se pediu texto.',
    }
  }

  const fechamentoInteresse =
    /(depois do video|pos video|pos-video|pós video|viu o video|assistiu o video|o que falar depois|como fecho|fechar a venda|fechar venda|reservar|separar pra|quero comprar|fechou comigo|dar sequencia|dar sequência|fechar a experiencia|fechar experiencia)/.test(
      m
    ) ||
    (/(gostou|curtiu|adorei|fez bem|experimentou|passou bem)/.test(m) &&
      /(fechar|proximo|próximo|reservar|entrega|pix|sequencia|sequência|mandar|falar depois)/.test(m))

  if (fechamentoInteresse) {
    return {
      mode: 'fechamento',
      audience: audience === 'ambiguo' ? 'cliente' : audience,
      includeLink: false,
      includeMensagemPronta: true,
      directive:
        'Pós-interesse (material/vídeo/experiência): **mensagem pronta** com fecho leve — **A ou B** + prazo + como concluir (entrega/retirada/retorno) conforme **[FOCO]** e tarefas do líder. **Próximo passo:** métrica **sua** (confirmar até data), não só “aguarde” ou “pergunte o que achou”.',
    }
  }

  if (opts?.hasObjectionBase || /(objecao|objeção|caro|preco|preço|vou pensar|nao tenho tempo|nao sou vendedor|vergonha|nao funciona|medo de|nao e pra mim)/.test(m)) {
    return {
      mode: 'objecao',
      audience,
      includeLink: /(link|mandar|enviar)/.test(m),
      includeMensagemPronta: true,
      directive:
        'Objeção de **timing** ou resistência — **não** é fechamento de venda. Postura + **mensagem pronta** curta. **Próximo passo:** espera ética ou 1 contato leve; **sem** opção A/B de compra se ela disse que não vai agora.',
    }
  }

  if (/(desanim|desistir|quero parar|nada da certo|cansad|frustrad|sem energia)/.test(m)) {
    return {
      mode: 'emocional',
      audience,
      includeLink: false,
      includeMensagemPronta: false,
      directive:
        '1–2 frases de acolhimento real (faz sentido / normal cansar) + **1 ação mínima** hoje. Sem terapia, sem textão, sem mensagem pronta longa.',
    }
  }

  if (/(convite|oportunidade|apresentacao|explicar o negocio|sem prometer|nao sou vendedor)/.test(m)) {
    const pedeLinkExplicito = /(qual link|que link|mandar link|enviar link|link para|link do|link da)/.test(m)
    return {
      mode: 'mentor',
      audience: audience === 'ambiguo' ? 'oportunidade' : audience,
      includeLink: pedeLinkExplicito,
      includeMensagemPronta: true,
      directive: pedeLinkExplicito
        ? 'Convite ético na rede: princípio + sequência + **mensagem pronta** leve + link após permissão.'
        : 'Convite ético: **mensagem pronta** leve. **Sem** bloco Link para enviar nesta resposta.',
    }
  }

  if (
    /(o que falar|como abordar|como convidar|postura|comportamento|tom|primeira abordagem|reativar|como me comunico|como me comunicar|visualiz)/.test(m) ||
    wantsText
  ) {
    const reativacaoSemNovoLink = /(sumiu|sumida|visualiz|nao responde|não responde|parou de responder)/.test(
      m
    )
    const pedeLinkExplicito = /(qual link|que link|mandar link|enviar link|link para|link do|link da)/.test(m)
    return {
      mode: 'comportamento',
      audience,
      includeLink: !reativacaoSemNovoLink && (pedeLinkExplicito || /(enviar|mandar).*(material|quiz)/.test(m)),
      includeMensagemPronta: true,
      directive: reativacaoSemNovoLink
        ? 'Reativação no WhatsApp: postura + **mensagem pronta** leve. **Sem** novo link — a pessoa já recebeu material.'
        : 'O que comunicar + como se comportar (incl. WhatsApp: leve, permissão). **Mensagem pronta** curta e natural.',
    }
  }

  if (
    /(lista|priorizar|quem falar|10 pessoas|tarefa de hoje|tarefa do lider|checklist|o que fazer hoje|disciplina|rotina|proximas 24h)/.test(m)
  ) {
    return {
      mode: 'execucao',
      audience,
      includeLink: /(link|enviar|mandar)/.test(m),
      includeMensagemPronta: wantsText,
      directive:
        'Acolha a trava em 1 frase se houver emoção; prioridades de lista/contato + ação hoje. Mensagem pronta só se pediu texto.',
    }
  }

  if (/(o que postar|post|story|legenda|instagram)/.test(m)) {
    return {
      mode: 'comportamento',
      audience,
      includeLink: false,
      includeMensagemPronta: false,
      directive:
        'Ideia do que postar + **Legenda curta** (bloco próprio, com linha em branco antes). Sem Mensagem pronta de WhatsApp.',
    }
  }

  return {
    mode: 'mentor',
    audience,
    includeLink: true,
    includeMensagemPronta: wantsText,
    directive: 'Mentor de campo: orientação + mensagem pronta quando útil + link de Meus links.',
  }
}

export function proLideresMemberNoelFewShot(mode: ProLideresMemberNoelMode): string {
  const examples: Record<ProLideresMemberNoelMode, string> = {
    execucao: `Faz sentido essa dúvida — lista grande confunde mesmo 😊 Que bom que você quer organizar isso direitinho.

**Na prática**

- Escolha **3 mornos** (ou 2 quentes se tiver).
- 1 mensagem leve em cada até o fim do dia.
- Anote quem respondeu no painel YLADA.

**Próximo passo**
Me conta quantas responderam — um passo de cada vez. 💪`,

    objecao: `Quando a pessoa diz que está caro e vai pensar, não é hora de “vencer” a objeção — é hora de **ouvir** com calma 😊

**Na prática**
- Valide sem concordar cegamente.
- Faça **uma** pergunta para entender o que ela compara.
- Só depois, se fizer sentido, um link leve de hábito.

**Mensagem pronta**
Entendo, [nome]. O que pesou mais pra você: o valor em si ou ainda não ver como isso encaixa na sua rotina? Fico à disposição 💬

**Link para enviar**
[Nome em Meus links] — [URL] — educativo, sem pressionar produto.

**Próximo passo**
Aguarde a resposta dela antes de insistir — se voltar, retome com calma.`,

    fechamento: `Ela assistiu o vídeo e curtiu? Ótimo sinal — agora é **facilitar o próximo passo**, não só perguntar opinião 😊

**Na prática**
- Valide em **1 frase** o que ela disse (sem hype).
- Ofereça **duas formas simples** de experimentar (ex.: retirada X ou entrega Y).
- Deixe claro **como ela confirma** (responde sim, pix, horário).

**Mensagem pronta**
Que bom que fez sentido pra você, [nome]! Quer que eu separe pra você experimentar esta semana — prefere retirar comigo ou combinar entrega? Me avisa até amanhã que eu organizo 😊

**Próximo passo**
Confirme até amanhã quem aceitou — anote no painel YLADA. 💪`,

    comportamento: `Sumiu depois do link? Acontece — e no WhatsApp a gente **não cobra**, só retoma com leveza 👋

**Na prática**
- Espere 2–3 dias.
- Lembre o último assunto real (nada genérico).
- Peça permissão antes de mandar outro link.

**Mensagem pronta**
Oi, [nome]! Só passando pra saber se deu tempo de ver o que te enviei. Se quiser trocar uma ideia, estou por aqui 😊

**Próximo passo**
Sem resposta em 48h, siga para o próximo nome da lista.`,

    mentor: `Convidar prima sem prometer dinheiro é **convite de conversa**, não pitch de renda 💡 Fale do projeto com propósito, no seu tom.

**Na prática**
- 2 frases: bem-estar + propósito (sem hype).
- Permissão clara: “só ouvir, sem compromisso”.
- Link **só** se ela aceitar ouvir.

**Mensagem pronta**
Oi, [nome]! Tenho acompanhado um projeto de bem-estar com propósito que está me ajudando. Se quiser, te conto em 15 min, só pra conhecer — sem compromisso. Topa? 😊

**Link para enviar**
[Link em Meus links] — [URL] — depois que ela disser sim.

**Próximo passo**
1 convite feito > 10 mensagens genéricas.`,

    catalogo: `Para quem quer melhorar o hábito de água, manda algo **rápido e educativo** antes de falar de produto 💧

**Na prática**
- Confirme se é cliente ou só curioso.
- Peça permissão no WhatsApp.
- Use um link de **Meus links** no painel YLADA.

**Mensagem pronta**
Posso te mandar um link de 2 min sobre hábito de água no dia a dia? Sem compromisso 😊

**Link para enviar**
[Nome em Meus links] — [URL exata]

**Próximo passo**
Se ela usar o link, mande mensagem em 24–48h com **uma** pergunta objetiva (ex.: “Fez sentido pra você?”) — se mostrar interesse, ofereça o próximo passo do método do líder.`,

    emocional: `Faz sentido querer pausar — desânimo bate em todo mundo 🫶 Parar a semana inteira, porém, costuma pesar mais do que um passo pequeno hoje.

**Na prática**
- Escolha **só 1**: 1 pessoa de confiança para um oi honesto **ou** 1 item da tarefa do líder.
- Sem cobrar resultado — só cumprir o combinado consigo mesma.

**Próximo passo**
Me conta o que fez — mesmo que tenha sido só 1 contato. Bola pra frente. 💪`,

    bloqueio_criar_link: `Aqui no Noel da YLADA eu **não crio** link novo — em **Meus links** você já tem os endereços prontos pra compartilhar 😊

**Na prática**
- Abra **Meus links** no Pro Líderes.
- Escolha o tema (hábito, oportunidade).
- Se faltar algo, alinhe com o líder.

**Próximo passo**
Me diga o tema que te indico qual link já existe.`,

    scripts_painel: `5 posts pra equipe inteira? Isso é trabalho de **Scripts** do líder — volume e padrão 📋 Aqui te deixo **1 ideia** pra você adaptar.

**Na prática**
- Vá em **Scripts** no painel do líder.
- Ângulo: rotina real + pergunta no final.

**Legenda curta**
“O que mudou na sua rotina esta semana? Comenta aqui 👇”

**Próximo passo**
Gere o pacote em Scripts se precisar escalar.`,

    conversacional: `Sou o **Noel**, mentor de campo na **YLADA** (Pro Líderes) 😊

Te ajudo com lista, disciplina, o que postar, como falar no WhatsApp e objeções, no tom da operação do seu líder. Quando pedir, monto **mensagem pronta** ou indico link de **Meus links**.

O que está travando hoje?`,
  }
  return examples[mode]
}
